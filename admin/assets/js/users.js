$(document).ready(function () {
  'use strict';

  function loadUsers() {
    $('#usersTableBody').html('<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary spinner-border-sm me-2"></div>Loading staff accounts...</td></tr>');

    window.API.getUsers()
      .done(function (res) {
        if (!res.success) return;
        const list = res.data || [];
        $('#totalUsersCount').text(`${list.length} Staff Users`);

        let html = '';
        list.forEach(function (u) {
          let badgeClass = 'badge-role-admin';
          if (u.roleSlug === 'super_admin') badgeClass = 'badge-role-superadmin';
          else if (u.roleSlug === 'seo_executive') badgeClass = 'badge-role-seo';
          else if (u.roleSlug === 'developer') badgeClass = 'badge-role-dev';
          else if (u.roleSlug === 'front_desk') badgeClass = 'badge-role-frontdesk';

          html += `
            <tr>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <img src="${u.avatar || 'assets/img/avatar-default.svg'}" alt="${u.name}" class="rounded-circle border" width="36" height="36" style="object-fit: cover;">
                  <div>
                    <div class="fw-semibold text-dark">${u.name}</div>
                    <div class="small text-muted">ID: #${u.id}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="font-monospace text-dark">${u.email}</div>
              </td>
              <td>
                <div class="small">${u.phone || '—'}</div>
              </td>
              <td>
                <span class="${badgeClass}"><i class="bi bi-shield-check"></i> ${u.roleName}</span>
              </td>
              <td>
                <div class="form-check form-switch">
                  <input class="form-check-input btn-toggle-user" type="checkbox" data-id="${u.id}" ${u.status === 'active' ? 'checked' : ''}>
                </div>
              </td>
              <td>
                <div class="small text-muted">${u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-IN') : 'Never'}</div>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1 btn-edit-user"
                  data-id="${u.id}" data-name="${u.name}" data-email="${u.email}" data-phone="${u.phone || ''}" data-role="${u.roleSlug}">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-user" data-id="${u.id}">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `;
        });

        $('#usersTableBody').html(html);
      })
      .fail(function () {
        $('#usersTableBody').html('<tr><td colspan="7" class="text-center py-4 text-danger">Failed to load staff accounts.</td></tr>');
      });
  }

  $('#btnOpenAddUser').on('click', function () {
    $('#userId').val('');
    $('#userForm')[0].reset();
    $('#userStatus').prop('checked', true);
    $('#userModalTitle').text('Add Staff Account');
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
  });

  $(document).on('click', '.btn-edit-user', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    const email = $(this).data('email');
    const phone = $(this).data('phone');
    const role = $(this).data('role');

    $('#userId').val(id);
    $('#userName').val(name);
    $('#userEmail').val(email);
    $('#userPhone').val(phone);
    $('#userRoleSelect').val(role);
    $('#userPassword').val('');
    $('#userModalTitle').text('Edit Staff Account');

    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
  });

  $('#userForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#userId').val();
    const data = {
      name: $('#userName').val().trim(),
      email: $('#userEmail').val().trim(),
      phone: $('#userPhone').val().trim(),
      roleSlug: $('#userRoleSelect').val(),
      status: $('#userStatus').is(':checked') ? 'active' : 'inactive',
    };
    const pwd = $('#userPassword').val().trim();
    if (pwd) data.password = pwd;

    const action = id ? window.API.updateUser(id, data) : window.API.createUser(data);

    action
      .done(function (res) {
        if (res.success) {
          bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
          window.App.toast('success', res.message || 'Staff saved successfully');
          loadUsers();
        }
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error saving staff';
        window.App.toast('error', msg);
      });
  });

  $(document).on('change', '.btn-toggle-user', function () {
    const id = $(this).data('id');
    window.API.toggleUser(id)
      .done(function (res) {
        window.App.toast('success', res.message || 'Status updated');
      })
      .fail(function (xhr) {
        window.App.toast('error', xhr.responseJSON ? xhr.responseJSON.message : 'Cannot toggle status');
        loadUsers();
      });
  });

  $(document).on('click', '.btn-delete-user', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Staff User?', 'This account will permanently lose dashboard access.').then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteUser(id)
          .done(function (res) {
            window.App.toast('success', res.message || 'User deleted');
            loadUsers();
          })
          .fail(function (xhr) {
            window.App.toast('error', xhr.responseJSON ? xhr.responseJSON.message : 'Cannot delete user');
          });
      }
    });
  });

  loadUsers();
});
