/**
 * Skinfinity Derma Admin Dashboard
 * Treatment Management Controller
 */

$(document).ready(function () {
  'use strict';

  let dataTable = null;
  let treatmentsData = [];
  let categoriesData = [];
  let concernsData = [];

  // Parse URL query parameters for pre-filtering
  const urlParams = new URLSearchParams(window.location.search);
  const initialCatFilter = urlParams.get('category') || '';
  const initialConFilter = urlParams.get('concern') || '';

  // Load dropdown options for filters
  function loadFilterTaxonomy() {
    return $.when(
      window.API.getCategories(),
      window.API.getConcerns()
    ).done(function (catRes, conRes) {
      if (catRes[0].success) {
        categoriesData = catRes[0].data;
        const $catSelect = $('#filterCategory');
        categoriesData.forEach(function (cat) {
          $catSelect.append(`<option value="${cat.id}">${cat.name}</option>`);
        });
        if (initialCatFilter) {
          $catSelect.val(initialCatFilter);
        }
      }

      if (conRes[0].success) {
        concernsData = conRes[0].data;
        const $conSelect = $('#filterConcern');
        concernsData.forEach(function (con) {
          $conSelect.append(`<option value="${con.id}">${con.name}</option>`);
        });
        if (initialConFilter) {
          $conSelect.val(initialConFilter);
        }
      }
    });
  }

  // Load Treatments with current filters
  function loadTreatments() {
    const params = {
      category: $('#filterCategory').val(),
      concern: $('#filterConcern').val(),
      status: $('#filterStatus').val(),
      featured: $('#filterFeatured').val()
    };

    window.API.getTreatments(params)
      .done(function (res) {
        if (!res.success) return;
        treatmentsData = res.data;
        renderTable(treatmentsData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load treatments');
      });
  }

  function renderTable(data) {
    if (dataTable) {
      dataTable.destroy();
    }

    const $tbody = $('#treatmentsTableBody');
    $tbody.empty();

    data.forEach(function (t) {
      const img = t.featuredImage ?
        `<img src="${t.featuredImage}" alt="${t.name}" style="width: 52px; height: 52px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border);">` :
        `<div style="width: 52px; height: 52px; background: var(--accent-soft); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--secondary);"><i class="bi bi-capsule"></i></div>`;

      const concernsBadges = (t.concerns || []).map(function (c) {
        return `<span class="badge badge-pill-soft me-1 mb-1">${c.name}</span>`;
      }).join('') || '<span class="text-muted small">—</span>';

      const priceHtml = t.price ?
        `<div><span class="fw-bold text-dark">${window.App.formatCurrency(t.price)}</span>${t.originalPrice ? ` <del class="text-muted small">${window.App.formatCurrency(t.originalPrice)}</del>` : ''}</div>` :
        `<span class="text-muted small">On Consultation</span>`;

      const featuredSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-featured" type="checkbox" data-id="${t.id}" ${t.isFeatured ? 'checked' : ''} title="Toggle Featured">
        </div>
      `;

      const statusSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-status" type="checkbox" data-id="${t.id}" ${t.isActive ? 'checked' : ''} title="Toggle Active">
        </div>
      `;

      const row = `
        <tr data-id="${t.id}">
          <td class="text-muted small fw-bold">${t.displayOrder || 1}</td>
          <td>${img}</td>
          <td>
            <div class="fw-bold text-dark">${t.name}</div>
            <div class="small text-muted"><code>/${t.slug}</code></div>
          </td>
          <td><span class="badge bg-light text-dark border">${t.categoryName || 'Unassigned'}</span></td>
          <td><div style="max-width: 220px;" class="d-flex flex-wrap">${concernsBadges}</div></td>
          <td>${priceHtml}</td>
          <td class="text-center">${featuredSwitch}</td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <a href="treatment-form.html?id=${t.id}" class="btn btn-outline-secondary" title="Edit Treatment">
                <i class="bi bi-pencil"></i>
              </a>
              <button type="button" class="btn btn-outline-secondary btn-duplicate" title="Duplicate Treatment" data-id="${t.id}">
                <i class="bi bi-files"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" title="Delete Treatment" data-id="${t.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    dataTable = $('#treatmentsTable').DataTable({
      responsive: true,
      order: [[0, 'asc']],
      pageLength: 10,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search treatments by name, slug..."
      }
    });
  }

  // Filter change handlers
  $('#filterCategory, #filterConcern, #filterStatus, #filterFeatured').on('change', function () {
    loadTreatments();
  });

  // Reset filters
  $('#btnResetFilters').on('click', function () {
    $('#filterCategory').val('');
    $('#filterConcern').val('');
    $('#filterStatus').val('');
    $('#filterFeatured').val('');
    loadTreatments();
  });

  // Toggle Featured status
  $(document).on('change', '.btn-toggle-featured', function () {
    const id = $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleTreatmentFeatured(id)
      .done(function (res) {
        window.App.toast('success', res.message);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update featured status');
        // revert
        $(this).prop('checked', !isChecked);
      });
  });

  // Toggle Active status
  $(document).on('change', '.btn-toggle-status', function () {
    const id = $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleTreatmentStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update active status');
        // revert
        $(this).prop('checked', !isChecked);
      });
  });

  // Duplicate Treatment
  $(document).on('click', '.btn-duplicate', function () {
    const id = $(this).data('id');
    const t = treatmentsData.find(item => item.id === id);
    if (!t) return;

    window.App.confirm(
      'Duplicate Treatment?',
      `Create an editable draft copy of "${t.name}"?`,
      'Yes, Duplicate'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.duplicateTreatment(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', res.message);
              loadTreatments();
            }
          })
          .fail(function (xhr) {
            const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Duplication failed';
            window.App.toast('error', msg);
          });
      }
    });
  });

  // Delete Treatment
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const t = treatmentsData.find(item => item.id === id);
    if (!t) return;

    window.App.confirm(
      'Delete Treatment?',
      `Are you sure you want to permanently delete "${t.name}"? This will remove it from the website catalog.`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteTreatment(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Treatment deleted successfully');
              loadTreatments();
            }
          })
          .fail(function (xhr) {
            const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error deleting treatment';
            window.App.toast('error', msg);
          });
      }
    });
  });

  // Reload button
  $('#btnReloadTreatments').on('click', function () {
    loadTreatments();
  });

  // Initialize
  loadFilterTaxonomy().always(function () {
    loadTreatments();
  });
});
