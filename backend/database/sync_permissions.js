const { query, tx } = require('../src/config/db');
const { ALL_PERMISSIONS, ROLE_PRESETS } = require('../src/config/permissions');

async function syncPermissions() {
  console.log('🔄 Syncing permissions and role presets in database...');

  // 1. Insert or update permissions in sid_permissions
  for (const p of ALL_PERMISSIONS) {
    const existing = await query(`SELECT id FROM sid_permissions WHERE code = ?`, [p.code]);
    if (existing.length === 0) {
      await query(
        `INSERT INTO sid_permissions (code, module, action, label) VALUES (?, ?, ?, ?)`,
        [p.code, p.module, p.action, p.label]
      );
      console.log(`➕ Added permission: ${p.code}`);
    } else {
      await query(
        `UPDATE sid_permissions SET module = ?, action = ?, label = ? WHERE code = ?`,
        [p.module, p.action, p.label, p.code]
      );
    }
  }

  // Fetch all permissions map: code -> id
  const allDbPerms = await query(`SELECT id, code FROM sid_permissions`);
  const permMap = new Map(allDbPerms.map(p => [p.code, p.id]));

  // 2. Sync roles and role_permissions
  for (const preset of ROLE_PRESETS) {
    let roleRow = await query(`SELECT id FROM sid_roles WHERE slug = ?`, [preset.slug]);
    let roleId;
    if (roleRow.length === 0) {
      const res = await query(
        `INSERT INTO sid_roles (slug, name, description, is_system) VALUES (?, ?, ?, 1)`,
        [preset.slug, preset.name, preset.description]
      );
      roleId = res.insertId;
      console.log(`🛡️ Created role: ${preset.name}`);
    } else {
      roleId = roleRow[0].id;
      await query(
        `UPDATE sid_roles SET name = ?, description = ? WHERE id = ?`,
        [preset.name, preset.description, roleId]
      );
    }

    // Assign permissions for this role
    for (const code of preset.permissions) {
      const permId = permMap.get(code);
      if (permId) {
        const rp = await query(`SELECT 1 FROM sid_role_permissions WHERE role_id = ? AND permission_id = ?`, [roleId, permId]);
        if (rp.length === 0) {
          await query(`INSERT IGNORE INTO sid_role_permissions (role_id, permission_id) VALUES (?, ?)`, [roleId, permId]);
        }
      }
    }
    console.log(`✅ Role ${preset.name} synced with ${preset.permissions.length} permissions.`);
  }

  console.log('🎉 Permissions sync completed successfully!');
}

syncPermissions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to sync permissions:', err);
    process.exit(1);
  });
