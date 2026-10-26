/**
 * Skinfinity Derma Admin Dashboard
 * Core Application Framework & Shell Controller
 */

(function (window, $) {
  'use strict';

  const App = {
    init: function () {
      this.checkAuth();
      this.initSidebar();
      this.initUserProfile();
      this.initGlobalEvents();
      this.highlightActiveNav();
    },

    // Session Protection
    checkAuth: function () {
      const isLoginPage = window.location.pathname.endsWith('login.html');
      const token = window.API.getToken();

      if (!token && !isLoginPage) {
        // Automatically provide demo access credentials if user just landed directly
        // or redirect to login.html
        window.location.href = 'login.html';
      } else if (token && isLoginPage) {
        window.location.href = 'index.html';
      }
    },

    // Initialize Sidebar & Responsive Drawer
    initSidebar: function () {
      const $sidebar = $('.admin-sidebar');
      const $toggleBtn = $('#sidebarToggleBtn');
      const $backdrop = $('#sidebarBackdrop');

      $toggleBtn.on('click', function (e) {
        e.preventDefault();
        $sidebar.toggleClass('show');
        $backdrop.toggleClass('show');
      });

      $backdrop.on('click', function () {
        $sidebar.removeClass('show');
        $backdrop.removeClass('show');
      });

      // Close on resize if wider than tablet
      $(window).on('resize', function () {
        if ($(window).width() >= 992) {
          $sidebar.removeClass('show');
          $backdrop.removeClass('show');
        }
      });
    },

    // Highlight Current Active Navigation Link
    highlightActiveNav: function () {
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      $('.sidebar-nav .nav-link').each(function () {
        const href = $(this).attr('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
          $(this).addClass('active');
        } else if (currentPath === 'treatment-form.html' && href === 'treatments.html') {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
    },

    // Display Current Administrator Details & Role Badges
    initUserProfile: function () {
      const user = window.API.getCurrentUser() || {
        name: 'Dr. Ipshita Johri (Founder)',
        email: 'superadmin@skinfinityderma.com',
        role: 'Super Administrator',
        roleSlug: 'super_admin',
        isSuperAdmin: true,
        permissions: [],
        avatar: 'https://images.unsplash.com/photo-1594824813637-230cb233b47c?w=150&auto=format&fit=crop&q=80'
      };

      $('.sidebar-user-name, .header-profile-name').text(user.name);
      
      // Determine Role Badge
      let badgeClass = 'badge-role-superadmin';
      let roleLabel = user.role || 'Super Admin';
      const slug = user.roleSlug || '';

      if (slug === 'super_admin' || roleLabel.toLowerCase().includes('super')) {
        badgeClass = 'badge-role-superadmin';
        roleLabel = 'Super Admin';
      } else if (slug === 'admin' || roleLabel.toLowerCase() === 'admin') {
        badgeClass = 'badge-role-admin';
        roleLabel = 'Clinic Admin';
      } else if (slug === 'seo_executive' || roleLabel.toLowerCase().includes('seo')) {
        badgeClass = 'badge-role-seo';
        roleLabel = 'SEO Executive';
      } else if (slug === 'developer' || roleLabel.toLowerCase().includes('dev')) {
        badgeClass = 'badge-role-dev';
        roleLabel = 'Technical Dev';
      } else if (slug === 'front_desk' || roleLabel.toLowerCase().includes('front') || roleLabel.toLowerCase().includes('reception')) {
        badgeClass = 'badge-role-frontdesk';
        roleLabel = 'Front Desk';
      }

      $('.sidebar-user-role').html(`<span class="${badgeClass}"><i class="bi bi-shield-check"></i> ${roleLabel}</span>`);
      if (user.avatar) {
        $('.sidebar-user-avatar, .header-profile-avatar').attr('src', user.avatar);
      }

      this.applyRBAC(user);
    },

    // RBAC Sidebar Link Visibility Controller
    applyRBAC: function (user) {
      if (!user) return;
      if (user.isSuperAdmin || user.roleSlug === 'super_admin') return; // Full access

      const perms = user.permissions || [];
      const has = (code) => perms.includes(code);

      // Hide sidebar sections where user lacks permission
      if (!has('appointments.view')) $('a[href="appointments.html"]').closest('li').hide();
      if (!has('enquiries.view')) $('a[href="enquiries.html"]').closest('li').hide();
      if (!has('treatments.view')) $('a[href="treatments.html"], a[href="treatment-form.html"]').closest('li').hide();
      if (!has('doctors.view')) $('a[href="doctors.html"]').closest('li').hide();
      if (!has('banners.view')) $('a[href="banners.html"]').closest('li').hide();
      if (!has('coupons.view')) $('a[href="coupons.html"]').closest('li').hide();
      if (!has('categories.view')) $('a[href="categories.html"]').closest('li').hide();
      if (!has('concerns.view')) $('a[href="concerns.html"]').closest('li').hide();
      if (!has('reviews.view')) $('a[href="reviews.html"]').closest('li').hide();
      if (!has('videos.view')) $('a[href="video-testimonials.html"]').closest('li').hide();
      if (!has('before_after.view')) $('a[href="before-after.html"]').closest('li').hide();
      if (!has('gallery.view')) $('a[href="gallery.html"]').closest('li').hide();
      if (!has('users.view')) $('a[href="users.html"]').closest('li').hide();
      if (!has('settings.view')) $('a[href="settings.html"]').closest('li').hide();
    },

    // Global Events
    initGlobalEvents: function () {
      const self = this;

      // Global Logout Handler
      $(document).on('click', '.action-logout', function (e) {
        e.preventDefault();
        self.confirm(
          'Log Out of Admin Panel?',
          'Are you sure you want to log out of the Skinfinity Derma dashboard?',
          'Yes, Log Out'
        ).then(function (result) {
          if (result.isConfirmed) {
            window.API.logout();
          }
        });
      });
    },

    // SweetAlert2 Toast Helper
    toast: function (icon, title) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      return Toast.fire({
        icon: icon || 'success',
        title: title || 'Action completed successfully'
      });
    },

    // SweetAlert2 Confirmation Dialog Helper
    confirm: function (title, text, confirmBtnText, cancelBtnText) {
      return Swal.fire({
        title: title || 'Are you sure?',
        text: text || "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#124432',
        cancelButtonColor: '#6C757D',
        confirmButtonText: confirmBtnText || 'Yes, proceed',
        cancelButtonText: cancelBtnText || 'Cancel',
        reverseButtons: true,
        customClass: {
          confirmButton: 'btn btn-primary px-3 me-2',
          cancelButton: 'btn btn-outline-secondary px-3'
        },
        buttonsStyling: false
      });
    },

    // Slug Generator Helper
    slugify: function (text) {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
    },

    // Format Currency Helper
    formatCurrency: function (amount) {
      if (amount === null || amount === undefined || isNaN(amount)) return '—';
      return '₹' + Number(amount).toLocaleString('en-IN');
    },

    // Format Date Helper
    formatDate: function (dateString) {
      if (!dateString) return '—';
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },

    // Format Relative Time
    formatRelativeTime: function (dateString) {
      if (!dateString) return '';
      const d = new Date(dateString);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return this.formatDate(dateString);
    },

    // Image Upload & Preview Helper
    setupImagePreview: function (fileInputSelector, previewImgSelector, removeBtnSelector, hiddenUrlSelector) {
      const $input = $(fileInputSelector);
      const $preview = $(previewImgSelector);
      const $removeBtn = $(removeBtnSelector);
      const $hidden = $(hiddenUrlSelector);

      $input.on('change', function () {
        const file = this.files[0];
        if (!file) return;

        // Size check (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          App.toast('error', 'File size exceeds 5MB limit');
          this.value = '';
          return;
        }

        // Preview locally immediately
        const reader = new FileReader();
        reader.onload = function (e) {
          $preview.attr('src', e.target.result).closest('.image-preview-wrapper').removeClass('d-none');
        };
        reader.readAsDataURL(file);

        // Upload to server
        window.API.uploadImage(file).done(function (res) {
          if (res.success) {
            $hidden.val(res.url);
            App.toast('success', 'Image uploaded successfully');
          }
        }).fail(function (xhr) {
          const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Image upload failed';
          App.toast('error', msg);
        });
      });

      if ($removeBtn.length) {
        $removeBtn.on('click', function (e) {
          e.preventDefault();
          $input.val('');
          $hidden.val('');
          $preview.attr('src', '').closest('.image-preview-wrapper').addClass('d-none');
        });
      }
    }
  };

  $(document).ready(function () {
    App.init();
  });

  window.App = App;
})(window, jQuery);
