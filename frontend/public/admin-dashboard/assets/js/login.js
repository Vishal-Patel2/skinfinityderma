/**
 * Skinfinity Derma Admin Dashboard
 * Secure Authentication & RBAC Login Controller
 */

$(document).ready(function () {
  'use strict';

  // Toggle password visibility
  $('#togglePasswordBtn').on('click', function () {
    const $passInput = $('#loginPassword');
    const isPass = $passInput.attr('type') === 'password';
    $passInput.attr('type', isPass ? 'text' : 'password');
    $(this).find('i').toggleClass('bi-eye bi-eye-slash');
  });

  // Autofill buttons helper for testing roles
  $('#autofillDemoBtn').on('click', function () {
    $('#loginEmail').val('superadmin@skinfinityderma.com');
    $('#loginPassword').val('admin123');
  });

  // Handle Login Submission
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val().trim();
    const $submitBtn = $('#loginSubmitBtn');
    const $alert = $('#loginAlert');

    $alert.addClass('d-none').text('');

    if (!email || !password) {
      $alert.removeClass('d-none').text('Please fill in both email and password.');
      return;
    }

    $submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Authenticating with RBAC...');

    window.API.post('/auth/login', { email, password })
      .done(function (res) {
        if (res.success && res.token) {
          window.API.setToken(res.token);
          window.API.setCurrentUser(res.data);
          window.location.href = 'index.html';
        } else {
          $alert.removeClass('d-none').text(res.message || 'Login failed.');
          $submitBtn.prop('disabled', false).html('<span>Sign In to Admin Portal</span><i class="bi bi-arrow-right ms-2"></i>');
        }
      })
      .fail(function (xhr) {
        let msg = 'Invalid email or password.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          msg = xhr.responseJSON.message;
        }
        $alert.removeClass('d-none').text(msg);
        $submitBtn.prop('disabled', false).html('<span>Sign In to Admin Portal</span><i class="bi bi-arrow-right ms-2"></i>');
      });
  });
});
