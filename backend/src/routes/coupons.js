const express = require('express');
const { query, one, tx } = require('../config/db');
const { requirePermission } = require('../middleware/auth');
const { audit } = require('../middleware/audit');
const { asyncHandler, HttpError } = require('../middleware/error');

const router = express.Router();

/**
 * GET /api/coupons
 */
router.get(
  '/',
  requirePermission('coupons.view'),
  asyncHandler(async (req, res) => {
    const rows = await query('SELECT * FROM sid_coupons ORDER BY id DESC');
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: String(r.id),
        code: r.code,
        title: r.title,
        description: r.description,
        discountType: r.discount_type,
        discountValue: Number(r.discount_value),
        maxDiscount: r.max_discount ? Number(r.max_discount) : null,
        minOrder: Number(r.min_order),
        appliesTo: r.applies_to,
        usageLimit: r.usage_limit,
        usedCount: r.used_count,
        isActive: Boolean(r.is_active),
        createdAt: r.created_at,
      })),
    });
  })
);

/**
 * POST /api/coupons
 */
router.post(
  '/',
  requirePermission('coupons.create'),
  asyncHandler(async (req, res) => {
    const { code, title, description, discountType = 'percent', discountValue, maxDiscount, minOrder = 0, appliesTo = 'all', usageLimit, isActive = 1 } = req.body;

    if (!code || !title || discountValue === undefined) {
      throw new HttpError(400, 'Code, title, and discount value are required');
    }

    const cleanCode = code.trim().toUpperCase();
    const exists = await one('SELECT id FROM sid_coupons WHERE code = ?', [cleanCode]);
    if (exists) throw new HttpError(409, 'Coupon code already exists');

    const r = await query(
      `INSERT INTO sid_coupons (code, title, description, discount_type, discount_value, max_discount, min_order, applies_to, usage_limit, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cleanCode, title, description || null, discountType, discountValue, maxDiscount || null, minOrder, appliesTo, usageLimit || null, isActive ? 1 : 0]
    );

    await audit(req, {
      action: 'create',
      entity: 'coupons',
      entityId: r.insertId,
      summary: `Created coupon ${cleanCode}`,
    });

    res.status(201).json({ success: true, id: String(r.insertId), message: 'Coupon created successfully' });
  })
);

/**
 * PUT /api/coupons/:id
 */
router.put(
  '/:id',
  requirePermission('coupons.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { code, title, description, discountType, discountValue, maxDiscount, minOrder, appliesTo, usageLimit, isActive } = req.body;

    const existing = await one('SELECT * FROM sid_coupons WHERE id = ?', [id]);
    if (!existing) throw new HttpError(404, 'Coupon not found');

    const cleanCode = code ? code.trim().toUpperCase() : existing.code;

    await query(
      `UPDATE sid_coupons
          SET code = ?, title = ?, description = ?, discount_type = ?, discount_value = ?, max_discount = ?,
              min_order = ?, applies_to = ?, usage_limit = ?, is_active = ?
        WHERE id = ?`,
      [
        cleanCode,
        title || existing.title,
        description !== undefined ? description : existing.description,
        discountType || existing.discount_type,
        discountValue !== undefined ? discountValue : existing.discount_value,
        maxDiscount !== undefined ? maxDiscount : existing.max_discount,
        minOrder !== undefined ? minOrder : existing.min_order,
        appliesTo || existing.applies_to,
        usageLimit !== undefined ? usageLimit : existing.usage_limit,
        isActive !== undefined ? (isActive ? 1 : 0) : existing.is_active,
        id,
      ]
    );

    await audit(req, {
      action: 'update',
      entity: 'coupons',
      entityId: id,
      summary: `Updated coupon ${cleanCode}`,
    });

    res.json({ success: true, message: 'Coupon updated successfully' });
  })
);

/**
 * PATCH /api/coupons/:id/toggle
 */
router.patch(
  '/:id/toggle',
  requirePermission('coupons.edit'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cp = await one('SELECT is_active, code FROM sid_coupons WHERE id = ?', [id]);
    if (!cp) throw new HttpError(404, 'Coupon not found');

    const nextState = cp.is_active ? 0 : 1;
    await query('UPDATE sid_coupons SET is_active = ? WHERE id = ?', [nextState, id]);

    await audit(req, {
      action: 'status',
      entity: 'coupons',
      entityId: id,
      summary: `${nextState ? 'Activated' : 'Deactivated'} coupon ${cp.code}`,
    });

    res.json({ success: true, isActive: Boolean(nextState), message: `Coupon is now ${nextState ? 'active' : 'inactive'}` });
  })
);

/**
 * DELETE /api/coupons/:id
 */
router.delete(
  '/:id',
  requirePermission('coupons.delete'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cp = await one('SELECT code FROM sid_coupons WHERE id = ?', [id]);
    if (!cp) throw new HttpError(404, 'Coupon not found');

    await query('DELETE FROM sid_coupons WHERE id = ?', [id]);

    await audit(req, {
      action: 'delete',
      entity: 'coupons',
      entityId: id,
      summary: `Deleted coupon ${cp.code}`,
    });

    res.json({ success: true, message: 'Coupon deleted successfully' });
  })
);

module.exports = router;
