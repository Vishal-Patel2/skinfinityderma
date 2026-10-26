/**
 * Skinfinity Derma Admin Dashboard
 * Login Controller
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

  // Autofill button
  $('#autofillDemoBtn').on('click', function () {
    $('#loginEmail').val('admin@skinfinityderma.com');
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

    $submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Signing in...');

    // window.API.login(email, password)
    //   .done(function (res) {
    //     if (res.success) {
    //       window.API.setToken(res.token);
    //       window.API.setCurrentUser(res.admin);
    //       window.location.href = 'index.html';
    //     } else {
    //       $alert.removeClass('d-none').text(res.message || 'Login failed. Please verify your credentials.');
    //       $submitBtn.prop('disabled', false).html('<span>Sign In to Admin Portal</span><i class="bi bi-arrow-right ms-2"></i>');
    //     }
    //   })
    //   .fail(function (xhr) {
    //     let errorMsg = 'Invalid email or password. Please try again.';
    //     if (xhr.responseJSON && xhr.responseJSON.message) {
    //       errorMsg = xhr.responseJSON.message;
    //     } else if (xhr.status === 0) {
    //       // If server is not responding, fallback for local prototype testing:
    //       if (email === 'admin@skinfinityderma.com' && password === 'admin123') {
    //         window.API.setToken('skf_prototype_token_' + Date.now());
    //         window.API.setCurrentUser({
    //           id: 'adm_1',
    //           name: 'Dr. Johar (Admin)',
    //           email: 'admin@skinfinityderma.com',
    //           role: 'Super Administrator',
    //           avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
    //         });
    //         window.location.href = 'index.html';
    //         return;
    //       }
    //     }
    //     $alert.removeClass('d-none').text(errorMsg);
    //     $submitBtn.prop('disabled', false).html('<span>Sign In to Admin Portal</span><i class="bi bi-arrow-right ms-2"></i>');
    //   });


    // TEMPORARY LOGIN — local UI testing only
if (
  email === 'admin@skinfinityderma.com' &&
  password === 'admin123'
) {
  window.API.setToken('skf_prototype_token_' + Date.now());

  window.API.setCurrentUser({
    id: 'adm_1',
    name: 'Dr. Johar (Admin)',
    email: email,
    role: 'Super Administrator',
    avatar: ''
  });

  window.location.href = 'index.html';
  return;
}

$alert.removeClass('d-none')
  .text('Invalid email or password. Please try again.');

$submitBtn.prop('disabled', false).html(
  '<span>Sign In to Admin Portal</span>' +
  '<i class="bi bi-arrow-right ms-2"></i>'
);
  });
});
