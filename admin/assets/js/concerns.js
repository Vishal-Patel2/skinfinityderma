/**
 * Skinfinity Derma Admin Dashboard
 * Concerns Module Controller
 */

$(document).ready(function () {
  'use strict';

  let dataTable = null;
  let concernsData = [];

  // Dropzone trigger
  $('#concernDropzone').on('click', function () {
    $('#concernImageFile').trigger('click');
  });

  // Setup Image Preview
  window.App.setupImagePreview(
    '#concernImageFile',
    '#concernPreviewImg',
    '#btnRemoveConcernImg',
    '#concernThumbnailUrl'
  );

  // Auto generate slug from concern name
  $('#concernName').on('input', function () {
    if (!$('#concernId').val()) {
      $('#concernSlug').val(window.App.slugify($(this).val()));
    }
  });

  // Load Concerns
  function loadConcerns() {
    window.API.getConcerns()
      .done(function (res) {
        if (!res.success) return;
        concernsData = res.data;
        renderTable(concernsData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to fetch concerns');
      });
  }

  function renderTable(data) {
    if (dataTable) {
      dataTable.destroy();
    }

    const $tbody = $('#concernsTableBody');
    $tbody.empty();

    data.forEach(function (con) {
      const thumb = con.thumbnail ?
        `<img src="${con.thumbnail}" alt="${con.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);">` :
        `<div style="width: 48px; height: 48px; background: var(--accent-soft); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--secondary);"><i class="bi bi-heart-pulse"></i></div>`;

      const statusBadge = con.isActive ?
        '<span class="badge badge-active">Active</span>' :
        '<span class="badge badge-inactive">Inactive</span>';

      const treatmentCountBadge = con.treatmentCount > 0 ?
        `<a href="treatments.html?concern=${con.id}" class="badge bg-secondary-subtle text-secondary border border-secondary-subtle text-decoration-none"><i class="bi bi-capsule me-1"></i>${con.treatmentCount} Treatments</a>` :
        `<span class="badge bg-light text-muted border">0 Treatments</span>`;

      const row = `
        <tr data-id="${con.id}">
          <td class="fw-bold text-muted">${con.displayOrder || 1}</td>
          <td>${thumb}</td>
          <td>
            <div class="fw-bold text-dark">${con.name}</div>
            <div class="small text-muted text-truncate" style="max-width: 280px;">${con.description || '—'}</div>
          </td>
          <td><code>/${con.slug}</code></td>
          <td>${treatmentCountBadge}</td>
          <td>${statusBadge}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit" title="Edit Concern" data-id="${con.id}">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" title="Delete Concern" data-id="${con.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    dataTable = $('#concernsTable').DataTable({
      responsive: true,
      order: [[0, 'asc']],
      pageLength: 10,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search concerns..."
      }
    });
  }

  // Open Modal for New Concern
  $('#btnOpenAddConcernModal').on('click', function () {
    $('#concernForm')[0].reset();
    $('#concernId').val('');
    $('#concernThumbnailUrl').val('');
    $('#concernPreviewImg').attr('src', '');
    $('#concernPreviewWrap').addClass('d-none');
    window.App.setCKData('concernDescription', '');
    $('#concernIsActive').prop('checked', true);
    $('#concernOrder').val(concernsData.length + 1);
    $('#concernModalLabel').text('Add New Concern');
    $('#concernModal').modal('show');
  });

  // Edit Concern
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const con = concernsData.find(c => c.id === id);
    if (!con) return;

    $('#concernId').val(con.id);
    $('#concernName').val(con.name);
    $('#concernSlug').val(con.slug);
    $('#concernDescription').val(con.description || '');
    window.App.setCKData('concernDescription', con.description || '');
    $('#concernOrder').val(con.displayOrder || 1);
    $('#concernIsActive').prop('checked', con.isActive);
    $('#concernThumbnailUrl').val(con.thumbnail || '');

    if (con.thumbnail) {
      $('#concernPreviewImg').attr('src', con.thumbnail);
      $('#concernPreviewWrap').removeClass('d-none');
    } else {
      $('#concernPreviewImg').attr('src', '');
      $('#concernPreviewWrap').addClass('d-none');
    }

    $('#concernModalLabel').text('Edit Concern: ' + con.name);
    $('#concernModal').modal('show');
  });

  // Save Concern (Create or Update)
  $('#concernForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#concernId').val();
    const name = $('#concernName').val().trim();
    const slug = $('#concernSlug').val().trim();

    if (!name || !slug) {
      window.App.toast('error', 'Concern name and slug are required');
      return;
    }

    const payload = {
      name: name,
      slug: slug,
      description: window.App.getCKData('concernDescription') || $('#concernDescription').val().trim(),
      thumbnail: $('#concernThumbnailUrl').val(),
      displayOrder: parseInt($('#concernOrder').val()) || 1,
      isActive: $('#concernIsActive').is(':checked')
    };

    const $btn = $('#btnSaveConcern');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateConcern(id, payload) : window.API.createConcern(payload);

    request.done(function (res) {
      if (res.success) {
        $('#concernModal').modal('hide');
        window.App.toast('success', res.message || 'Concern saved successfully');
        loadConcerns();
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save concern';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Concern');
    });
  });

  // Delete Concern with Relational Protection
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const con = concernsData.find(c => c.id === id);
    if (!con) return;

    if (con.treatmentCount > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Cannot Delete Concern',
        text: `"${con.name}" is assigned to ${con.treatmentCount} treatment(s). Please remove this concern tag from treatments before deleting.`,
        confirmButtonColor: '#124432'
      });
      return;
    }

    window.App.confirm(
      'Delete Concern?',
      `Are you sure you want to permanently delete concern "${con.name}"?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteConcern(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Concern deleted successfully');
              loadConcerns();
            }
          })
          .fail(function (xhr) {
            const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error deleting concern';
            Swal.fire({
              icon: 'error',
              title: 'Deletion Failed',
              text: msg,
              confirmButtonColor: '#124432'
            });
          });
      }
    });
  });

  // Reload button
  $('#btnReloadConcerns').on('click', function () {
    loadConcerns();
  });

  // Initial load
  window.App.initCKEditor('#concernDescription');
  loadConcerns();
});
