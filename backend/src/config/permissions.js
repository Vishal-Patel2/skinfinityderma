/**
 * RBAC catalog — the single source of truth for permissions and the default role presets.
 * Permission codes are `<module>.<action>`. The seeder and permissions syncer sync this catalog into the
 * `sid_permissions` / `sid_roles` / `sid_role_permissions` tables.
 */

const CRUD = ['view', 'create', 'edit', 'delete'];

const MODULES = [
  { module: 'dashboard', label: 'Dashboard Overview', actions: ['view'] },
  { module: 'appointments', label: 'Appointments & Scheduling', actions: ['view', 'create', 'edit', 'delete', 'export'] },
  { module: 'patients', label: 'Patient Management', actions: CRUD },
  { module: 'enquiries', label: 'CRM & Lead Management', actions: ['view', 'create', 'edit', 'delete', 'assign'] },
  { module: 'treatments', label: 'Treatments Catalog', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
  { module: 'categories', label: 'Treatment Categories', actions: CRUD },
  { module: 'concerns', label: 'Skin & Hair Concerns', actions: CRUD },
  { module: 'doctors', label: 'Medical Board Doctors', actions: CRUD },
  { module: 'clinics', label: 'Clinics & Branches', actions: CRUD },
  { module: 'banners', label: 'Hero & Promo Banners', actions: CRUD },
  { module: 'offers', label: 'Seasonal Offers', actions: CRUD },
  { module: 'coupons', label: 'Promo Codes & Discounts', actions: CRUD },
  { module: 'blogs', label: 'Clinical Articles & Blogs', actions: ['view', 'create', 'edit', 'delete', 'publish'] },
  { module: 'reviews', label: 'Verified Google & Patient Reviews', actions: CRUD },
  { module: 'videos', label: 'Video Testimonials & Shorts', actions: CRUD },
  { module: 'before_after', label: 'Clinical Transformations', actions: CRUD },
  { module: 'gallery', label: 'Clinic Photo Gallery', actions: CRUD },
  { module: 'press', label: 'Press & Media Mentions', actions: CRUD },
  { module: 'faqs', label: 'Clinical FAQs', actions: CRUD },
  { module: 'menus', label: 'Header & Footer Menus', actions: CRUD },
  { module: 'content_blocks', label: 'Homepage & Website CMS Blocks', actions: CRUD },
  { module: 'seo', label: 'SEO Metadata & Sitemap', actions: CRUD },
  { module: 'media', label: 'Centralized Media Library', actions: ['view', 'create', 'delete', 'manage'] },
  { module: 'notifications', label: 'Notification Center', actions: ['view', 'manage'] },
  { module: 'settings', label: 'Clinic & System Settings', actions: ['view', 'edit', 'scripts'] },
  { module: 'users', label: 'Staff Accounts & RBAC', actions: CRUD },
  { module: 'roles', label: 'Roles & Permission Matrix', actions: CRUD },
  { module: 'audit_logs', label: 'Operational Audit Logs', actions: ['view'] },
  { module: 'system', label: 'System & Developer Tools', actions: ['view', 'manage'] },
];

const ACTION_LABELS = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  publish: 'Publish / Unpublish',
  export: 'Export Data',
  assign: 'Assign Lead',
  scripts: 'Manage Custom Tracking Scripts',
  manage: 'Full Management',
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

/**
 * Default roles:
 * 1. Super Admin
 * 2. Admin
 * 3. Clinic Manager
 * 4. Doctor
 * 5. Receptionist
 * 6. Content Manager
 * 7. Marketing Manager
 */
const ROLE_PRESETS = [
  {
    slug: 'super_admin',
    name: 'Super Admin',
    description: 'Full unrestricted access to all modules, users, roles, system tools, and settings.',
    permissions: ALL_CODES,
  },
  {
    slug: 'admin',
    name: 'Admin',
    description: 'Clinic administration, appointments, patients, catalog, marketing, and operations.',
    permissions: ALL_CODES.filter(
      (c) =>
        !c.startsWith('roles.') &&
        !c.startsWith('system.') &&
        c !== 'settings.scripts' &&
        c !== 'users.delete'
    ),
  },
  {
    slug: 'clinic_manager',
    name: 'Clinic Manager',
    description: 'Manages daily clinic operations, appointments calendar, patient profiles, doctors roster, and leads.',
    permissions: [
      'dashboard.view',
      ...full('appointments', 'patients', 'enquiries', 'doctors', 'clinics', 'reviews', 'notifications'),
      'treatments.view',
      'categories.view',
      'concerns.view',
      'coupons.view',
      'offers.view',
      'media.view',
      'users.view',
      'settings.view',
    ],
  },
  {
    slug: 'doctor',
    name: 'Doctor',
    description: 'Medical board specialist: consultation view, assigned appointments, patient clinical histories, and treatments.',
    permissions: [
      'dashboard.view',
      'appointments.view',
      'appointments.edit',
      'patients.view',
      'patients.edit',
      'treatments.view',
      'categories.view',
      'concerns.view',
      'before_after.view',
      'reviews.view',
      'notifications.view',
    ],
  },
  {
    slug: 'receptionist',
    name: 'Receptionist',
    description: 'Front desk reception: booking patient appointments, rescheduling, check-in, intake of calls and leads.',
    permissions: [
      'dashboard.view',
      'appointments.view',
      'appointments.create',
      'appointments.edit',
      'patients.view',
      'patients.create',
      'patients.edit',
      'enquiries.view',
      'enquiries.create',
      'enquiries.edit',
      'treatments.view',
      'doctors.view',
      'clinics.view',
      'coupons.view',
      'notifications.view',
    ],
  },
  {
    slug: 'front_desk',
    name: 'Front Desk',
    description: 'Front desk reception (alias for receptionist).',
    permissions: [
      'dashboard.view',
      'appointments.view',
      'appointments.create',
      'appointments.edit',
      'patients.view',
      'patients.create',
      'patients.edit',
      'enquiries.view',
      'enquiries.create',
      'enquiries.edit',
      'treatments.view',
      'doctors.view',
      'clinics.view',
      'coupons.view',
      'notifications.view',
    ],
  },
  {
    slug: 'content_manager',
    name: 'Content Manager',
    description: 'Manages website content: treatments, blogs, banners, FAQs, gallery, videos, and SEO blocks.',
    permissions: [
      'dashboard.view',
      ...full('treatments', 'categories', 'concerns', 'blogs', 'banners', 'gallery', 'before_after', 'reviews', 'videos', 'press', 'faqs', 'media', 'seo', 'content_blocks'),
      'doctors.view',
      'offers.view',
      'coupons.view',
      'menus.view',
      'settings.view',
    ],
  },
  {
    slug: 'marketing_manager',
    name: 'Marketing Manager',
    description: 'Manages promotional campaigns: coupons, seasonal offers, hero banners, leads pipeline, and patient reviews.',
    permissions: [
      'dashboard.view',
      ...full('coupons', 'offers', 'banners', 'enquiries', 'reviews', 'videos', 'press', 'media'),
      'treatments.view',
      'blogs.view',
      'appointments.view',
      'appointments.export',
      'patients.view',
      'notifications.view',
    ],
  },
];

module.exports = { MODULES, ALL_PERMISSIONS, ALL_CODES, ROLE_PRESETS };
