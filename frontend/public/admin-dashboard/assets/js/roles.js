/**
 * Skinfinity Derma Admin - Roles & Permissions Matrix Controller
 */
(function (window, $) {
  'use strict';

  let allPermissions = [];
  let currentRoles = [];

  function loadPermissions() {
    return window.API.getPermissionsList().done(function (res) {
      if (res.success) {
        allPermissions = res.data;
        renderPermissionModules(allPermissions);
      }
    });
  }

  function renderPermissionModules(modules) {
    const html = modules.map((m) => {
      const permsHtml = m.permissions.map((p) => `
        <div class="form-check">
          <input class="form-check-input perm-checkbox" type="checkbox" value="${p.id}" id="perm_${p.id}" data-code="${p.code}" data-module="${m.module}">
          <label class="form-check-label small text-dark" for="perm_${p.id}">
            ${p.label.split('—')[0].trim()}
          </label>
        </div>
      `).join('');

      return `
        <div class="perm-module-card">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <div class="fw-bold text-dark small">
              <i class="bi bi-folder2 text-success me-1"></i> ${m.label}
            </div>
            <button type="button" class="btn btn-link btn-sm p-0 text-decoration-none btn-module-toggle" data-module="${m.module}">Toggle All</button>
          </div>
          <div class="perm-grid">
            ${permsHtml}
          </div>
        </div>
      `;
    }).join('');

    $('#permissionsContainer').html(html);
  }

  function loadRoles() {
    window.API.getRolesList()
      .done(function (res) {
        if (!res.success) return;
        currentRoles = res.data;
        renderRolesTable(currentRoles);
      })
      .fail(function () {
        $('#rolesTableBody').html(`
          <tr>
            <td colspan="7" class="text-center py-4 text-danger">Failed to load roles.</td>
          </tr>
        `);
      });
  }

  function renderRolesTable(roles) {
    if (roles.length === 0) {
      $('#rolesTableBody').html('<tr><td colspan="7" class="text-center py-4 text-muted">No roles configured.</td></tr>');
      return;
    }

    const html = roles.map((r) => {
      const typeBadge = r.isSystem
        ? '<span class="badge bg-secondary-subtle text-secondary border">System Default</span>'
        : '<span class="badge bg-primary-subtle text-primary border">Custom Role</span>';

      const deleteBtn = r.isSystem
        ? ''
        : `<button type="button" class="btn btn-outline-danger btn-sm btn-delete-role" data-id="${r.id}" data-name="${r.name}" title="Delete Role"><i class="bi bi-trash"></i></button>`;

      return `
        <tr>
          <td class="ps-4">
            <div class="fw-bold text-dark">${r.name}</div>
          </td>
          <td>
            <code class="text-muted small">${r.slug}</code>
          </td>
          <td>
            <span class="text-muted small">${r.description || '—'}</span>
          </td>
          <td>
            <span class="badge bg-light text-dark border px-2 py-1"><i class="bi bi-person me-1"></i> ${r.userCount} Staff</span>
          </td>
          <td>
            <span class="badge bg-success-subtle text-success border px-2 py-1">${r.permissionCount} Permissions</span>
          </td>
          <td>${typeBadge}</td>
          <td class="text-end pe-4">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-primary btn-sm btn-edit-role" data-id="${r.id}" title="Edit Permissions">
                <i class="bi bi-sliders"></i> Permissions
              </button>
              ${deleteBtn}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    $('#rolesTableBody').html(html);
  }

  $(document).ready(function () {
    loadPermissions().then(loadRoles);

    // Toggle all for module
    $(document).on('click', '.btn-module-toggle', function () {
      const mod = $(this).data('module');
      const $checkboxes = $(`.perm-checkbox[data-module="${mod}"]`);
      const allChecked = $checkboxes.filter(':checked').length === $checkboxes.length;
      $checkboxes.prop('checked', !allChecked);
    });

    // Select / Deselect All
    $('#btnSelectAllPerms').on('click', function () {
      $('.perm-checkbox').prop('checked', true);
    });
    $('#btnDeselectAllPerms').on('click', function () {
      $('.perm-checkbox').prop('checked', false);
    });

    // Create Role Modal
    $('#btnCreateRole').on('click', function () {
      $('#roleForm')[0].reset();
      $('#formRoleId').val('');
      $('.perm-checkbox').prop('checked', false);
      $('#roleModalTitle').text('Create Custom Clinic Role');
      const modal = new bootstrap.Modal(document.getElementById('roleModal'));
      modal.show();
    });

    // Edit Role & Permission Matrix
    $(document).on('click', '.btn-edit-role', function () {
      const id = $(this).data('id');
      window.API.getRole(id).done(function (res) {
        if (!res.success) return;
        const r = res.data;
        $('#formRoleId').val(r.id);
        $('#roleNameInput').val(r.name);
        $('#roleDescInput').val(r.description || '');
        $('#roleModalTitle').text(`Configure Role Permissions: ${r.name}`);

        $('.perm-checkbox').prop('checked', false);
        (r.permissionIds || []).forEach((pId) => {
          $(`#perm_${pId}`).prop('checked', true);
        });

        const modal = new bootstrap.Modal(document.getElementById('roleModal'));
        modal.show();
      });
    });

    // Save Role Form
    $('#roleForm').on('submit', function (e) {
      e.preventDefault();
      const id = $('#formRoleId').val();
      const selectedPerms = [];
      $('.perm-checkbox:checked').each(function () {
        selectedPerms.push(parseInt($(this).val(), 10));
      });

      const payload = {
        name: $('#roleNameInput').val().trim(),
        description: $('#roleDescInput').val().trim(),
        permissionIds: selectedPerms,
      };

      if (!payload.name) {
        Swal.fire('Required', 'Role title is required.', 'warning');
        return;
      }

      const $btn = $('#btnSaveRole').prop('disabled', true).text('Saving Matrix...');
      const req = id ? window.API.updateRole(id, payload) : window.API.createRole(payload);

      req
        .done(function () {
          Swal.fire('Saved', 'Role and permission security matrix updated successfully.', 'success');
          bootstrap.Modal.getInstance(document.getElementById('roleModal')).hide();
          loadRoles();
        })
        .fail(function (xhr) {
          const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save role.';
          Swal.fire('Error', msg, 'error');
        })
        .always(function () {
          $btn.prop('disabled', false).text('Save Role Configuration');
        });
    });

    // Delete Custom Role
    $(document).on('click', '.btn-delete-role', function () {
      const id = $(this).data('id');
      const name = $(this).data('name');

      Swal.fire({
        title: 'Delete Role?',
        text: `Are you sure you want to delete custom role "${name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete',
      }).then(function (result) {
        if (result.isConfirmed) {
          window.API.deleteRole(id)
            .done(function () {
              Swal.fire('Deleted', 'Role removed.', 'success');
              loadRoles();
            })
            .fail(function (xhr) {
              const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Cannot delete role.';
              Swal.fire('Error', msg, 'error');
            });
        }
      });
    });
  });
})(window, jQuery);
