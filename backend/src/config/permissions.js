/**
 * RBAC catalog — the single source of truth for permissions and the default role presets.
 * Permission codes are `<module>.<action>`. The seeder syncs this catalog into the
 * `permissions` / `roles` / `role_permissions` tables; super admins can then fine-tune roles
 * from the dashboard (Access Control → Roles & Permissions).
 */

const CRUD = ['view', 'create', 'edit', 'delete'];

const MODULES = [
  { module: 'dashboard', label: 'Dashboard', actions: ['view'] },
  { module: 'appointments', label: 'Appointments', actions: CRUD },
  { module: 'enquiries', label: 'Enquiries & Leads', actions: CRUD },
  { module: 'treatments', label: 'Treatments', actions: CRUD },
  { module: 'categories', label: 'Treatment Categories', actions: CRUD },
  { module: 'concerns', label: 'Skin / Hair Concerns', actions: CRUD },
  { module: 'doctors', label: 'Doctors', actions: CRUD },
  { module: 'clinics', label: 'Clinics & Branches', actions: CRUD },
  { module: 'banners', label: 'Hero Banners', actions: CRUD },
  { module: 'offers', label: 'Offers', actions: CRUD },
  { module: 'coupons', label: 'Coupons', actions: CRUD },
  { module: 'reviews', label: 'Patient Reviews', actions: CRUD },
  { module: 'videos', label: 'Videos & Stories', actions: CRUD },
  { module: 'before_after', label: 'Before & After Results', actions: CRUD },
  { module: 'gallery', label: 'Gallery', actions: CRUD },
  { module: 'press', label: 'Press & Media', actions: CRUD },
  { module: 'faqs', label: 'FAQs', actions: CRUD },
  { module: 'menus', label: 'Menus (Header & Footer)', actions: CRUD },
  { module: 'content_blocks', label: 'Website Content Blocks', actions: CRUD },
  { module: 'seo', label: 'SEO Manager', actions: CRUD },
  { module: 'media', label: 'Media Library', actions: ['view', 'create', 'delete'] },
  { module: 'settings', label: 'Site Settings', actions: ['view', 'edit', 'scripts'] },
  { module: 'users', label: 'Staff Users', actions: CRUD },
  { module: 'roles', label: 'Roles & Permissions', actions: CRUD },
  { module: 'audit_logs', label: 'Audit Logs', actions: ['view'] },
  { module: 'system', label: 'System & Developer Tools', actions: ['view', 'manage'] },
];

const ACTION_LABELS = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  scripts: 'Manage tracking / custom scripts',
  manage: 'Manage',
};

const ALL_PERMISSIONS = MODULES.flatMap((m) =>
  m.actions.map((action) => ({
    code: `${m.module}.${action}`,
    module: m.module,
    action,
    label: `${ACTION_LABELS[action] || action} — ${m.label}`,
  }))
);

const ALL_CODES = ALL_PERMISSIONS.map((p) => p.code);

const viewAll = (...skip) =>
  MODULES.filter((m) => m.actions.includes('view') && !skip.includes(m.module)).map((m) => `${m.module}.view`);

const full = (...modules) =>
  modules.flatMap((mod) => {
    const m = MODULES.find((x) => x.module === mod);
    return m ? m.actions.map((a) => `${mod}.${a}`) : [];
  });

/** Default roles. `super_admin` always bypasses permission checks. */
const ROLE_PRESETS = [
  {
    slug: 'super_admin',
    name: 'Super Admin',
    description: 'Full, unrestricted access including users, roles and system tools.',
    permissions: ALL_CODES,
  },
  {
    slug: 'admin',
    name: 'Admin',
    description: 'Runs the clinic website & operations. Cannot manage roles, system tools or tracking scripts.',
    permissions: ALL_CODES.filter(
      (c) =>
        !c.startsWith('roles.') &&
        !c.startsWith('system.') &&
        c !== 'settings.scripts' &&
        c !== 'users.delete'
    ),
  },
  {
    slug: 'seo_executive',
    name: 'SEO Executive',
    description: 'Owns SEO metadata, sitemap, FAQs and content blocks. Read-only elsewhere.',
    permissions: [
      'dashboard.view',
      ...full('seo', 'faqs', 'press'),
      'content_blocks.view',
      'content_blocks.edit',
      'media.view',
      'media.create',
      'treatments.view',
      'categories.view',
      'concerns.view',
      'doctors.view',
      'banners.view',
      'menus.view',
      'reviews.view',
      'settings.view',
    ],
  },
  {
    slug: 'developer',
    name: 'Developer',
    description: 'Technical owner: site settings, tracking scripts, menus, content blocks, system tools.',
    permissions: [
      'dashboard.view',
      ...viewAll('users', 'roles'),
      'settings.edit',
      'settings.scripts',
      ...full('menus', 'content_blocks', 'seo', 'media', 'system'),
      'audit_logs.view',
      'users.view',
    ],
  },
  {
    slug: 'content_manager',
    name: 'Content Manager',
    description: 'Manages website content: treatments, doctors, banners, offers, reviews, media.',
    permissions: [
      'dashboard.view',
      'treatments.view', 'treatments.create', 'treatments.edit',
      ...full('categories', 'concerns', 'banners', 'gallery', 'before_after', 'reviews', 'videos', 'press', 'faqs', 'media'),
      'doctors.view', 'doctors.create', 'doctors.edit',
      'offers.view', 'offers.create', 'offers.edit',
      'coupons.view',
      'clinics.view',
      'seo.view',
    ],
  },
  {
    slug: 'front_desk',
    name: 'Front Desk',
    description: 'Handles appointments and incoming enquiries.',
    permissions: [
      'dashboard.view',
      'appointments.view', 'appointments.create', 'appointments.edit',
      'enquiries.view', 'enquiries.create', 'enquiries.edit',
      'coupons.view',
      'treatments.view',
      'doctors.view',
      'clinics.view',
    ],
  },
];

module.exports = { MODULES, ALL_PERMISSIONS, ALL_CODES, ROLE_PRESETS };
