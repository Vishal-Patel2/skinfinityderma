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

    // Display Current Administrator Details
    initUserProfile: function () {
      const user = window.API.getCurrentUser() || {
        name: 'Dr. Johar (Admin)',
        email: 'admin@skinfinityderma.com',
        role: 'Super Administrator',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
      };

      if (user.name && (user.name.includes('Demo Admin') || user.name.includes('Sharma'))) {
        user.name = 'Dr. Johar (Admin)';
        window.API.setCurrentUser(user);
      }

      $('.sidebar-user-name, .header-profile-name').text(user.name);
      $('.sidebar-user-role').text(user.role);
      if (user.avatar) {
        $('.sidebar-user-avatar, .header-profile-avatar').attr('src', user.avatar);
      }
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
