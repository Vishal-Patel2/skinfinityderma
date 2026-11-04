/**
 * Skinfinity Derma Admin Dashboard
 * Clinical Treatment Management Controller
 */

$(document).ready(function () {
  'use strict';

  let dataTable = null;
  let treatmentsData = [];
  let categoriesData = [];
  let concernsData = [];

  const urlParams = new URLSearchParams(window.location.search);
  const initialCatFilter = urlParams.get('category') || '';
  const initialConFilter = urlParams.get('concern') || '';

  // Load Categories & Concerns for filters
  function loadFilterTaxonomies() {
    return $.when(
      window.API.getCategories(),
      window.API.getConcerns()
    ).done(function (catRes, conRes) {
      if (catRes[0].success) {
        categoriesData = catRes[0].data || [];
        const $catSelect = $('#filterCategory').empty().append('<option value="">All Categories</option>');
        categoriesData.forEach(function (c) {
          $catSelect.append(`<option value="${c.id}">${c.name}</option>`);
        });
        if (initialCatFilter) $catSelect.val(initialCatFilter);
      }

      if (conRes[0].success) {
        concernsData = conRes[0].data || [];
        const $conSelect = $('#filterConcern').empty().append('<option value="">All Concerns</option>');
        concernsData.forEach(function (cn) {
          $conSelect.append(`<option value="${cn.id}">${cn.name}</option>`);
        });
        if (initialConFilter) $conSelect.val(initialConFilter);
      }
    });
  }

  // Load Treatments
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
        treatmentsData = res.data || [];
        renderTable(treatmentsData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load treatments catalog');
      });
  }

  // Render Table
  function renderTable(data) {
    if (dataTable) {
      dataTable.destroy();
    }

    const $tbody = $('#treatmentsTableBody').empty();

    if (!data || data.length === 0) {
      $tbody.html('<tr><td colspan="9" class="text-center py-4 text-muted">No clinical treatments found.</td></tr>');
      return;
    }

    data.forEach(function (t, idx) {
      const order = t.displayOrder || idx + 1;
      const img = t.featuredImage || t.bannerImage ?
        `<img src="${t.featuredImage || t.bannerImage}" alt="${t.name}" class="treatment-thumb" onerror="this.src='assets/img/avatar-default.svg'">` :
        `<img src="assets/img/avatar-default.svg" alt="${t.name}" class="treatment-thumb">`;

      const categoryBadge = `<span class="badge bg-light text-dark border px-2 py-1">${t.categoryName || t.category || 'General Dermatology'}</span>`;

      const concernsHtml = (t.concerns && t.concerns.length) ?
        t.concerns.map(function (c) { return `<span class="badge bg-light text-muted border small me-1">${c.name}</span>`; }).join('') :
        '<span class="text-muted small">—</span>';

      const priceHtml = t.price ?
        `<div><span class="fw-bold text-dark">${window.App.formatCurrency(t.price)}</span>${t.originalPrice ? ` <del class="text-muted small">${window.App.formatCurrency(t.originalPrice)}</del>` : ''}</div>` :
        '<span class="text-muted small">On Consultation</span>';

      const featuredSwitch = `
        <div class="form-check form-switch m-0 d-flex justify-content-center">
          <input class="form-check-input btn-toggle-featured" type="checkbox" data-id="${t.id}" ${t.isFeatured ? 'checked' : ''} title="Toggle Featured">
        </div>
      `;

      const statusSwitch = `
        <div class="form-check form-switch m-0 d-flex justify-content-center">
          <input class="form-check-input btn-toggle-status" type="checkbox" data-id="${t.id}" ${t.isActive ? 'checked' : ''} title="Toggle Status">
        </div>
      `;

      const actionsHtml = `
        <div class="btn-group btn-group-sm">
          <a href="treatment-form.html?id=${t.id}" class="btn btn-outline-secondary action-btn-pill" title="Edit Treatment">
            <i class="bi bi-pencil"></i>
          </a>
          <button type="button" class="btn btn-outline-secondary action-btn-pill btn-duplicate" data-id="${t.id}" title="Duplicate / Clone">
            <i class="bi bi-files"></i>
          </button>
          <button type="button" class="btn btn-outline-danger action-btn-pill btn-delete" data-id="${t.id}" title="Delete Treatment">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;

      const rowHtml = `
        <tr data-id="${t.id}">
          <td class="text-muted small fw-bold">${order}</td>
          <td>${img}</td>
          <td>
            <div class="fw-bold text-dark font-serif">${t.name}</div>
            <a href="treatment-form.html?id=${t.id}" class="treatment-slug-text text-decoration-none">/${t.slug}</a>
          </td>
          <td>${categoryBadge}</td>
          <td>${concernsHtml}</td>
          <td>${priceHtml}</td>
          <td class="text-center">${featuredSwitch}</td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end">${actionsHtml}</td>
        </tr>
      `;

      $tbody.append(rowHtml);
    });

    // Initialize DataTable
    dataTable = $('#treatmentsTable').DataTable({
      pageLength: 10,
      order: [[0, 'asc']],
      columnDefs: [
        { orderable: false, targets: [1, 6, 7, 8] }
      ],
      language: {
        search: '',
        searchPlaceholder: 'Search treatments by name, slug...',
        lengthMenu: 'Show _MENU_ entries',
        paginate: {
          previous: 'Previous',
          next: 'Next'
        }
      }
    });
  }

  // Filter bindings
  $('#filterCategory, #filterConcern, #filterStatus, #filterFeatured').on('change', function () {
    loadTreatments();
  });

  $('#btnResetFilters').on('click', function () {
    $('#filterCategory').val('');
    $('#filterConcern').val('');
    $('#filterStatus').val('');
    $('#filterFeatured').val('');
    loadTreatments();
  });

  $('#btnReloadTreatments').on('click', function () {
    loadTreatments();
    window.App.toast('info', 'Treatments catalog reloaded');
  });

  // Toggle Featured Switch
  $(document).on('change', '.btn-toggle-featured', function () {
    const id = $(this).data('id');
    const $switch = $(this);
    window.API.toggleTreatmentFeatured(id)
      .done(function (res) {
        if (res.success) {
          window.App.toast('success', res.message || 'Featured status updated');
        }
      })
      .fail(function () {
        $switch.prop('checked', !$switch.prop('checked'));
        window.App.toast('error', 'Failed to update featured status');
      });
  });

  // Toggle Active/Live Status Switch
  $(document).on('change', '.btn-toggle-status', function () {
    const id = $(this).data('id');
    const $switch = $(this);
    window.API.toggleTreatmentStatus(id)
      .done(function (res) {
        if (res.success) {
          window.App.toast('success', res.message || 'Visibility updated');
        }
      })
      .fail(function () {
        $switch.prop('checked', !$switch.prop('checked'));
        window.App.toast('error', 'Failed to update status');
      });
  });

  // Duplicate / Clone Treatment
  $(document).on('click', '.btn-duplicate', function () {
    const id = $(this).data('id');
    const trt = treatmentsData.find(function (t) { return String(t.id) === String(id); });
    const name = trt ? trt.name : 'Treatment';

    Swal.fire({
      title: 'Duplicate Treatment?',
      text: `Create a copy of "${name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#005b41',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Duplicate'
    }).then(function (result) {
      if (result.isConfirmed) {
        window.API.duplicateTreatment(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Treatment duplicated successfully');
              loadTreatments();
            } else {
              window.App.toast('error', res.message || 'Duplicate failed');
            }
          })
          .fail(function () {
            window.App.toast('error', 'Failed to duplicate treatment');
          });
      }
    });
  });

  // Delete Treatment
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const trt = treatmentsData.find(function (t) { return String(t.id) === String(id); });
    const name = trt ? trt.name : 'this treatment';

    Swal.fire({
      title: 'Delete Treatment?',
      text: `Are you sure you want to permanently delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete'
    }).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteTreatment(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Treatment deleted successfully');
              loadTreatments();
            } else {
              window.App.toast('error', res.message || 'Delete failed');
            }
          })
          .fail(function () {
            window.App.toast('error', 'Failed to delete treatment');
          });
      }
    });
  });

  // Initial load
  loadFilterTaxonomies().then(loadTreatments);
});
