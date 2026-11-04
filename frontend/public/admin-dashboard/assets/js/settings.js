/**
 * Skinfinity Derma Admin Dashboard
 * Settings Controller
 */

$(document).ready(function () {
  'use strict';

  // Load Settings
  function loadSettings() {
    window.API.getSettings()
      .done(function (res) {
        if (!res.success) return;
        const s = res.data;

        $('#setClinicName').val(s.clinicName || 'Skinfinity Derma');
        $('#setTagline').val(s.tagline || '');
        $('#setPhone').val(s.phone || '');
        $('#setAltPhone').val(s.alternatePhone || '');
        $('#setEmail').val(s.email || '');
        $('#setWorkingHours').val(s.workingHours || '');
        $('#setAddress').val(s.address || '');

        if (s.socialLinks) {
          $('#setInstagram').val(s.socialLinks.instagram || '');
          $('#setFacebook').val(s.socialLinks.facebook || '');
          $('#setYoutube').val(s.socialLinks.youtube || '');
        }

        if (s.seo) {
          $('#setSeoTitle').val(s.seo.defaultTitle || '');
          $('#setSeoDesc').val(s.seo.defaultMetaDescription || '');
        }
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load clinic settings');
      });
  }

  // Save Clinic Details
  $('#clinicSettingsForm').on('submit', function (e) {
    e.preventDefault();

    const payload = {
      clinicName: $('#setClinicName').val().trim(),
      tagline: $('#setTagline').val().trim(),
      phone: $('#setPhone').val().trim(),
      alternatePhone: $('#setAltPhone').val().trim(),
      email: $('#setEmail').val().trim(),
      workingHours: $('#setWorkingHours').val().trim(),
      address: $('#setAddress').val().trim(),
      socialLinks: {
        instagram: $('#setInstagram').val().trim(),
        facebook: $('#setFacebook').val().trim(),
        youtube: $('#setYoutube').val().trim()
      }
    };

    const $btn = $('#btnSaveClinicSettings');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    window.API.updateSettings(payload)
      .done(function (res) {
        if (res.success) {
          window.App.toast('success', 'Clinic contact details saved');
        }
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update settings');
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Clinic Details');
      });
  });

  // Save SEO Defaults
  $('#seoSettingsForm').on('submit', function (e) {
    e.preventDefault();

    const payload = {
      seo: {
        defaultTitle: $('#setSeoTitle').val().trim(),
        defaultMetaDescription: $('#setSeoDesc').val().trim()
      }
    };

    const $btn = $('#btnSaveSeoSettings');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    window.API.updateSettings(payload)
      .done(function (res) {
        if (res.success) {
          window.App.toast('success', 'SEO defaults updated');
        }
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update SEO settings');
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Update SEO Defaults');
      });
  });

  // Change Password
  $('#passwordChangeForm').on('submit', function (e) {
    e.preventDefault();

    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();

    if (!currentPassword || !newPassword) {
      window.App.toast('error', 'Please fill all password fields');
      return;
    }

    if (newPassword.length < 6) {
      window.App.toast('error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      window.App.toast('error', 'New passwords do not match');
      return;
    }

    const $btn = $('#btnUpdatePassword');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Updating...');

    window.API.post('/auth/update-password', { currentPassword, newPassword })
      .done(function (res) {
        if (res.success) {
          window.App.toast('success', res.message || 'Password updated successfully');
          $('#passwordChangeForm')[0].reset();
        }
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error updating password';
        window.App.toast('error', msg);
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-key me-1"></i> Update Password');
      });
  });

  // Test API connection
  $('#btnTestApi').on('click', function () {
    const customUrl = $('#customApiUrl').val().trim();
    if (customUrl) {
      window.API.baseUrl = customUrl;
    }

    window.API.getDashboardStats()
      .done(function () {
        $('#apiStatusBadge').removeClass('badge-inactive').addClass('badge-active').text('Connected');
        window.App.toast('success', 'API connection verified successfully');
      })
      .fail(function () {
        $('#apiStatusBadge').removeClass('badge-active').addClass('badge-inactive').text('Disconnected');
        window.App.toast('error', 'Failed to reach API endpoint');
      });
  });

  // Initial Load
  loadSettings();
});
