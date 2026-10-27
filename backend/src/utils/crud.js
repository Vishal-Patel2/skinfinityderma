/**
 * Generic, permission-guarded CRUD router factory.
 *
 * A resource definition describes the table, the writable fields (camelCase API name -> column + type),
 * optional many-to-many relations, list search/filter/sort options and lifecycle hooks. The factory then
 * provides:
 *
 *   GET    /            paginated list   (?page&limit&q&sort&dir&<filters>)  [<module>.view]
 *   GET    /:id         single record                                         [<module>.view]
 *   POST   /            create                                                [<module>.create]
 *   PUT    /:id         update (partial)                                      [<module>.edit]
 *   PATCH  /:id         update (partial)                                      [<module>.edit]
 *   PATCH  /:id/toggle  flip the active flag                                  [<module>.edit]
 *   POST   /reorder     { ids: [...] } -> display_order                       [<module>.edit]
 *   DELETE /:id         delete                                                [<module>.delete]
 *
 * Responses use `{ success, data, meta? }`. `id` and every `*Id` value is returned as a string.
 */
const express = require('express');
const { query, one, tx } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { HttpError, asyncHandler } = require('../middleware/error');
const { slugify } = require('./slug');
const { mysqlDateTime, parseJson } = require('./helpers');

const camel = (s) => s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
const snake = (s) => s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

function prepare(def) {
  if (def.table && !def.table.startsWith('sid_')) {
    def.table = 'sid_' + def.table;
  }
  def.alias = 't';
  def.permission = def.permission || def.key;
  def.label = def.label || def.key;
  def.titleField = def.titleField || 'name';
  def.relations = def.relations || {};
  for (const rel of Object.values(def.relations)) {
    if (rel.table && !rel.table.startsWith('sid_')) {
      rel.table = 'sid_' + rel.table;
    }
  }
  def.filters = def.filters || [];
  def.customFilters = def.customFilters || {};
  def.sortExtras = def.sortExtras || {};
  def._byCol = {};
  for (const [key, f] of Object.entries(def.fields)) {
    f.key = key;
    f.col = f.col || snake(key);
    f.type = f.type || 'string';
    f.label = f.label || key;
    def._byCol[f.col] = f;
  }
  if (!def.sortable) def.sortable = ['id', ...Object.keys(def.fields)];
  return def;
}

function fromDb(f, v) {
  if (v === null || v === undefined) return f.type === 'bool' ? false : null;
  switch (f.type) {
    case 'bool':
      return !!v;
    case 'json':
      return parseJson(v, null);
    case 'id':
      return String(v);
    default:
      return v;
  }
}

function coerce(f, raw) {
  const t = f.type;
  const empty = raw === null || raw === '' || raw === undefined;
  if (empty) {
    if (t === 'bool') return 0;
    if (f.default !== undefined) return coerce(f, f.default);
    if (f.required) throw new HttpError(422, `${f.label} is required`);
    return null;
  }
  switch (t) {
    case 'string':
    case 'text':
    case 'slug': {
      const s = String(raw).trim();
      if (f.max && s.length > f.max) throw new HttpError(422, `${f.label} must be at most ${f.max} characters`);
      if (s === '' && f.required) throw new HttpError(422, `${f.label} is required`);
      return s;
    }
    case 'int':
    case 'id': {
      const n = parseInt(raw, 10);
      if (Number.isNaN(n)) {
        if (t === 'id') return null;
        throw new HttpError(422, `${f.label} must be a whole number`);
      }
      if (f.min !== undefined && n < f.min) throw new HttpError(422, `${f.label} must be at least ${f.min}`);
      if (f.max !== undefined && t === 'int' && n > f.max) throw new HttpError(422, `${f.label} must be at most ${f.max}`);
      return n;
    }
    case 'number': {
      const n = Number(raw);
      if (Number.isNaN(n)) throw new HttpError(422, `${f.label} must be a number`);
      if (f.min !== undefined && n < f.min) throw new HttpError(422, `${f.label} must be at least ${f.min}`);
      if (f.max !== undefined && n > f.max) throw new HttpError(422, `${f.label} must be at most ${f.max}`);
      return n;
    }
    case 'bool':
      return raw === true || raw === 1 || raw === '1' || raw === 'true' || raw === 'on' ? 1 : 0;
    case 'json': {
      let v = raw;
      if (typeof v === 'string') {
        try {
          v = JSON.parse(v);
        } catch (e) {
          throw new HttpError(422, `${f.label} must be valid JSON`);
        }
      }
      return JSON.stringify(v);
    }
    case 'date': {
      const s = String(raw).slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new HttpError(422, `${f.label} must be a valid date (YYYY-MM-DD)`);
      return s;
    }
    case 'datetime': {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) throw new HttpError(422, `${f.label} must be a valid date & time`);
      return mysqlDateTime(d);
    }
    case 'enum': {
      if (!f.values.includes(raw)) throw new HttpError(422, `${f.label} must be one of: ${f.values.join(', ')}`);
      return raw;
    }
    default:
      return raw;
  }
}

function createCrud(rawDef) {
  const def = prepare(rawDef);
  const A = def.alias;
  const router = express.Router();
  const perm = (action) => requirePermission(`${def.permission}.${action}`);

  const baseFrom = () => `FROM ${def.table} ${A} ${def.joins || ''}`;
  const baseSelect = () => `SELECT ${A}.*${def.selectExtra ? `, ${def.selectExtra}` : ''}`;

  function mapRow(row) {
    const out = {};
    for (const [col, val] of Object.entries(row)) {
      const f = def._byCol[col];
      if (f) {
        out[f.key] = fromDb(f, val);
      } else {
        const key = camel(col);
        out[key] = (col === 'id' || col.endsWith('_id')) && val !== null && val !== undefined ? String(val) : val;
      }
    }
    return out;
  }

  async function hydrate(rows) {
    const items = rows.map(mapRow);
    if (def.hydrate) await def.hydrate(items, rows);
    const ids = rows.map((r) => r.id);
    for (const [key, rel] of Object.entries(def.relations)) {
      const links = ids.length
        ? await query(`SELECT ${rel.key} AS k, ${rel.other} AS o FROM ${rel.table} WHERE ${rel.key} IN (?)`, [ids])
        : [];
      const map = {};
      links.forEach((l) => {
        (map[l.k] = map[l.k] || []).push(String(l.o));
      });
      items.forEach((item, i) => {
        item[key] = map[rows[i].id] || [];
      });
    }
    return items;
  }

  async function getById(id) {
    const rows = await query(`${baseSelect()} ${baseFrom()} WHERE ${A}.id = ? LIMIT 1`, [id]);
    if (!rows.length) return null;
    return (await hydrate(rows))[0];
  }

  function colRef(name) {
    if (def.sortExtras[name]) return def.sortExtras[name];
    if (def.fields[name]) return `${A}.${def.fields[name].col}`;
    if (name === 'id') return `${A}.id`;
    if (name === 'createdAt') return `${A}.created_at`;
    if (name === 'updatedAt') return `${A}.updated_at`;
    return null;
  }

  async function listRows(req) {
    const q = req.query;
    const where = def.baseWhere ? [def.baseWhere] : [];
    const params = [];

    const search = (q.q || q.search || '').toString().trim();
    if (search && def.search && def.search.length) {
      where.push(`(${def.search.map((c) => `${c.includes('.') ? c : `${A}.${c}`} LIKE ?`).join(' OR ')})`);
      def.search.forEach(() => params.push(`%${search}%`));
    }

    for (const name of def.filters) {
      const v = q[name];
      if (v === undefined || v === '' || v === 'all') continue;
      const f = def.fields[name];
      const ref = colRef(name);
      if (!ref) continue;
      if (f && f.type === 'bool') params.push(v === '1' || v === 'true' || v === 'active' ? 1 : 0);
      else if (f && (f.type === 'id' || f.type === 'int')) params.push(parseInt(v, 10));
      else params.push(v);
      where.push(`${ref} = ?`);
    }
    for (const [name, fn] of Object.entries(def.customFilters)) {
      const v = q[name];
      if (v === undefined || v === '' || v === 'all') continue;
      const r = fn(v, req);
      if (r) {
        where.push(r.sql);
        params.push(...(r.params || []));
      }
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const total = (await one(`SELECT COUNT(*) AS c ${baseFrom()} ${whereSql}`, params)).c;

    // sorting
    let sortKey = q.sort && def.sortable.includes(q.sort) ? q.sort : null;
    let dir = (q.dir || '').toString().toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    let orderSql;
    if (sortKey && colRef(sortKey)) {
      orderSql = `${colRef(sortKey)} ${dir}, ${A}.id ASC`;
    } else {
      orderSql = def.defaultSort || `${A}.id DESC`;
    }

    // pagination
    const all = q.limit === 'all';
    const page = Math.max(1, parseInt(q.page, 10) || 1);
    const limit = all ? 2000 : Math.min(500, Math.max(1, parseInt(q.limit, 10) || 20));
    const offset = all ? 0 : (page - 1) * limit;

    const rows = await query(
      `${baseSelect()} ${baseFrom()} ${whereSql} ORDER BY ${orderSql} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return { items: await hydrate(rows), total, page: all ? 1 : page, limit };
  }

  async function ensureUniqueSlug(f, base, excludeId, explicit) {
    const root = base || 'item';
    let candidate = root;
    let n = 1;
    for (;;) {
      const exists = await one(
        `SELECT id FROM ${def.table} WHERE ${f.col} = ? ${excludeId ? 'AND id <> ?' : ''} LIMIT 1`,
        excludeId ? [candidate, excludeId] : [candidate]
      );
      if (!exists) return candidate;
      if (explicit) throw new HttpError(409, `${f.label} "${candidate}" is already in use`);
      n += 1;
      candidate = `${root}-${n}`;
    }
  }

  /** Validate + persist. Returns the record id. */
  async function save(req, existing, body) {
    const isNew = !existing;
    const data = {};

    for (const [key, f] of Object.entries(def.fields)) {
      if (f.readOnly) continue;
      const raw = body[key];
      if (raw === undefined) {
        if (isNew && f.default !== undefined && f.type !== 'slug') data[key] = coerce(f, f.default);
        else if (isNew && f.required && f.type !== 'slug') throw new HttpError(422, `${f.label} is required`);
        continue;
      }
      if (f.type === 'slug') continue; // handled below
      data[key] = coerce(f, raw);
    }

    for (const [key, f] of Object.entries(def.fields)) {
      if (f.type !== 'slug') continue;
      const raw = body[key];
      const provided = raw !== undefined && raw !== null && String(raw).trim() !== '';
      if (provided) {
        data[key] = await ensureUniqueSlug(f, slugify(raw), existing && existing.id, true);
      } else if (isNew || raw !== undefined) {
        const source = data[f.from] !== undefined ? data[f.from] : body[f.from] || (existing && existing[f.from]);
        data[key] = await ensureUniqueSlug(f, slugify(source), existing && existing.id, false);
      }
    }

    if (def.beforeSave) await def.beforeSave({ data, body, existing, req, isNew });

    const id = await tx(async (q) => {
      let rowId = existing ? existing.id : null;
      const keys = Object.keys(data);
      if (isNew) {
        if (keys.length) {
          const cols = keys.map((k) => def.fields[k].col);
          const r = await q(`INSERT INTO ${def.table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, keys.map((k) => data[k]));
          rowId = r.insertId;
        } else {
          const r = await q(`INSERT INTO ${def.table} () VALUES ()`);
          rowId = r.insertId;
        }
      } else if (keys.length) {
        await q(
          `UPDATE ${def.table} SET ${keys.map((k) => `${def.fields[k].col} = ?`).join(', ')} WHERE id = ?`,
          [...keys.map((k) => data[k]), rowId]
        );
      }

      for (const [key, rel] of Object.entries(def.relations)) {
        if (body[key] === undefined) continue;
        const ids = [...new Set((Array.isArray(body[key]) ? body[key] : []).map((v) => parseInt(v, 10)).filter((n) => !Number.isNaN(n)))];
        await q(`DELETE FROM ${rel.table} WHERE ${rel.key} = ?`, [rowId]);
        if (ids.length) {
          await q(`INSERT INTO ${rel.table} (${rel.key}, ${rel.other}) VALUES ?`, [ids.map((o) => [rowId, o])]);
        }
      }
      if (def.afterSaveTx) await def.afterSaveTx({ q, id: rowId, data, body, existing, req, isNew });
      return rowId;
    });

    if (def.afterSave) await def.afterSave({ id, data, body, existing, req, isNew });
    return id;
  }

  const summaryName = (item) => item && (item[def.titleField] || item.id);

  if (def.extraRoutes) {
    def.extraRoutes(router, { def, perm, getById, hydrate, listRows, mapRow, save });
  }

  router.get(
    '/',
    perm('view'),
    asyncHandler(async (req, res) => {
      const { items, total, page, limit } = await listRows(req);
      res.json({ success: true, data: items, meta: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
    })
  );

  router.post(
    '/reorder',
    perm('edit'),
    asyncHandler(async (req, res) => {
      const ids = (req.body.ids || []).map((v) => parseInt(v, 10)).filter((n) => !Number.isNaN(n));
      if (!def.fields.displayOrder) throw new HttpError(400, 'This resource cannot be reordered');
      await tx(async (q) => {
        for (let i = 0; i < ids.length; i += 1) {
          await q(`UPDATE ${def.table} SET display_order = ? WHERE id = ?`, [i + 1, ids[i]]);
        }
      });
      await audit(req, { action: 'reorder', entity: def.key, summary: `${def.label} reordered` });
      res.json({ success: true, message: 'Order updated' });
    })
  );

  router.get(
    '/:id(\\d+)',
    perm('view'),
    asyncHandler(async (req, res) => {
      const item = await getById(req.params.id);
      if (!item) throw new HttpError(404, `${def.label} not found`);
      res.json({ success: true, data: item });
    })
  );

  router.post(
    '/',
    perm('create'),
    asyncHandler(async (req, res) => {
      const id = await save(req, null, req.body || {});
      const item = await getById(id);
      await audit(req, { action: 'create', entity: def.key, entityId: id, summary: `Created ${def.label} "${summaryName(item)}"` });
      res.status(201).json({ success: true, data: item, message: `${def.label} created successfully` });
    })
  );

  const update = asyncHandler(async (req, res) => {
    const existing = await getById(req.params.id);
    if (!existing) throw new HttpError(404, `${def.label} not found`);
    await save(req, existing, req.body || {});
    const item = await getById(req.params.id);
    await audit(req, { action: 'update', entity: def.key, entityId: req.params.id, summary: `Updated ${def.label} "${summaryName(item)}"` });
    res.json({ success: true, data: item, message: `${def.label} updated successfully` });
  });
  router.put('/:id(\\d+)', perm('edit'), update);
  router.patch('/:id(\\d+)', perm('edit'), update);

  router.patch(
    '/:id(\\d+)/toggle',
    perm('edit'),
    asyncHandler(async (req, res) => {
      const flag = def.toggleField || 'isActive';
      const f = def.fields[flag];
      if (!f) throw new HttpError(400, 'This resource has no status flag');
      const existing = await getById(req.params.id);
      if (!existing) throw new HttpError(404, `${def.label} not found`);
      const next = existing[flag] ? 0 : 1;
      await query(`UPDATE ${def.table} SET ${f.col} = ? WHERE id = ?`, [next, req.params.id]);
      await audit(req, { action: 'status', entity: def.key, entityId: req.params.id, summary: `${next ? 'Activated' : 'Deactivated'} ${def.label} "${summaryName(existing)}"` });
      res.json({ success: true, isActive: !!next, [flag]: !!next, message: `${def.label} ${next ? 'activated' : 'deactivated'}` });
    })
  );

  router.delete(
    '/:id(\\d+)',
    perm('delete'),
    asyncHandler(async (req, res) => {
      const existing = await getById(req.params.id);
      if (!existing) throw new HttpError(404, `${def.label} not found`);
      if (def.beforeDelete) await def.beforeDelete(existing, { req });
      await query(`DELETE FROM ${def.table} WHERE id = ?`, [req.params.id]);
      if (def.afterDelete) await def.afterDelete(existing, { req });
      await audit(req, { action: 'delete', entity: def.key, entityId: req.params.id, summary: `Deleted ${def.label} "${summaryName(existing)}"` });
      res.json({ success: true, message: `${def.label} deleted successfully` });
    })
  );

  router.def = def;
  router.getById = getById;
  return router;
}

module.exports = { createCrud };
