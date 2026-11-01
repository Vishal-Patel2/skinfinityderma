const fs = require('fs');
const path = require('path');

const files = [
  'appointments.html',
  'banners.html',
  'before-after.html',
  'blogs.html',
  'categories.html',
  'concerns.html',
  'coupons.html',
  'doctors.html',
  'enquiries.html',
  'gallery.html',
  'homepage.html',
  'index.html',
  'locations.html',
  'media.html',
  'memberships.html',
  'pages.html',
  'patients.html',
  'reviews.html',
  'roles.html',
  'services.html',
  'settings.html',
  'treatment-form.html',
  'treatments.html',
  'users.html',
  'video-testimonials.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', 'admin', file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const startMarker = '<div class="sidebar-body">';
  const endMarker = '<div class="sidebar-footer">';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx !== -1 && endIdx !== -1) {
    const navItems = [
      { href: 'index.html', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
      { href: 'appointments.html', icon: 'bi-calendar2-check-fill text-success', label: 'Appointments' },
      { href: 'patients.html', icon: 'bi-people-fill text-primary', label: 'Patients' },
      { href: 'enquiries.html', icon: 'bi-chat-left-dots-fill text-info', label: 'Enquiries & Leads' },
      { href: 'memberships.html', icon: 'bi-award-fill text-warning', label: 'VIP Memberships' },
      { section: 'Catalog & Doctors' },
      { href: 'treatments.html', icon: 'bi-capsule', label: 'Treatments' },
      { href: 'services.html', icon: 'bi-heart-pulse-fill text-danger', label: 'Services' },
      { href: 'doctors.html', icon: 'bi-person-badge', label: 'Doctors' },
      { href: 'locations.html', icon: 'bi-geo-alt-fill text-danger', label: 'Locations' },
      { href: 'categories.html', icon: 'bi-folder2', label: 'Categories' },
      { href: 'concerns.html', icon: 'bi-heart-pulse', label: 'Concerns' },
      { section: 'Marketing & Media' },
      { href: 'homepage.html', icon: 'bi-house-gear-fill text-success', label: 'Homepage CMS' },
      { href: 'banners.html', icon: 'bi-images', label: 'Banners' },
      { href: 'pages.html', icon: 'bi-file-earmark-text text-primary', label: 'Dynamic Pages' },
      { href: 'coupons.html', icon: 'bi-tag-fill text-warning', label: 'Offers & Coupons' },
      { href: 'blogs.html', icon: 'bi-journal-text text-info', label: 'Articles & Blogs' },
      { href: 'media.html', icon: 'bi-folder-fill text-warning', label: 'Media Library' },
      { href: 'before-after.html', icon: 'bi-layout-split', label: 'Before & After' },
      { href: 'reviews.html', icon: 'bi-google', label: 'Reviews' },
      { href: 'video-testimonials.html', icon: 'bi-play-btn-fill', label: 'Video Stories' },
      { href: 'gallery.html', icon: 'bi-camera', label: 'Gallery' },
      { section: 'Administration & RBAC' },
      { href: 'users.html', icon: 'bi-people-fill text-primary', label: 'Staff Accounts' },
      { href: 'roles.html', icon: 'bi-shield-lock-fill text-success', label: 'Roles & Matrix' },
      { href: 'settings.html', icon: 'bi-gear', label: 'Settings' },
      { href: '#', icon: 'bi-box-arrow-right text-danger', label: 'Logout', extraClass: 'text-danger action-logout' }
    ];

    let newSidebar = '<div class="sidebar-body">\n        <div class="sidebar-section-title">Core Operations</div>\n        <ul class="sidebar-nav">\n';

    navItems.forEach(item => {
      if (item.section) {
        newSidebar += '        </ul>\n\n        <div class="sidebar-section-title">' + item.section + '</div>\n        <ul class="sidebar-nav">\n';
      } else {
        const isActive = (item.href === file);
        const linkClass = 'nav-link' + (isActive ? ' active' : '') + (item.extraClass ? ' ' + item.extraClass : '');
        newSidebar += '          <li class="nav-item"><a href="' + item.href + '" class="' + linkClass + '"><i class="bi ' + item.icon + '"></i><span>' + item.label + '</span></a></li>\n';
      }
    });

    newSidebar += '        </ul>\n      </div>\n\n      ';

    const updated = content.substring(0, startIdx) + newSidebar + content.substring(endIdx);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Successfully updated sidebar in:', file);
  } else {
    console.log('Markers not found in:', file, startIdx, endIdx);
  }
});
