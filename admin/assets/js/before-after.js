/**
 * Skinfinity Derma Admin Dashboard
 * Clinical Before & After Transformation Controller
 */

$(document).ready(function () {
  'use strict';

  let baData = [];

  // Dropzone click triggers
  $('#baBeforeDropzone').on('click', function () {
    $('#baBeforeFile').trigger('click');
  });

  $('#baAfterDropzone').on('click', function () {
    $('#baAfterFile').trigger('click');
  });

  // Setup Image Previews
  window.App.setupImagePreview(
    '#baBeforeFile',
    '#baBeforePreviewImg',
    '#btnRemoveBABefore',
    '#baBeforeImageUrl'
  );

  window.App.setupImagePreview(
    '#baAfterFile',
    '#baAfterPreviewImg',
    '#btnRemoveBAAfter',
    '#baAfterImageUrl'
  );

  // When typing URL directly, update preview
  $('#baBeforeImageUrl').on('input', function () {
    const url = $(this).val().trim();
    if (url) {
      $('#baBeforePreviewImg').attr('src', url);
      $('#baBeforePreviewWrap').removeClass('d-none');
    } else {
      $('#baBeforePreviewWrap').addClass('d-none');
    }
  });

  $('#baAfterImageUrl').on('input', function () {
    const url = $(this).val().trim();
    if (url) {
      $('#baAfterPreviewImg').attr('src', url);
      $('#baAfterPreviewWrap').removeClass('d-none');
    } else {
      $('#baAfterPreviewWrap').addClass('d-none');
    }
  });

  // Load All Cases
  function loadBeforeAfter() {
    window.API.getBeforeAfter()
      .done(function (res) {
        if (!res.success) return;
        baData = res.data || [];
        updateMetrics(baData);
        filterAndRender();
      })
      .fail(function (xhr) {
        window.App.toast('error', 'Failed to load before & after cases');
      });
  }

  // Update KPI counters
  function updateMetrics(data) {
    const total = data.length;
    const active = data.filter(function (d) { return d.isActive; }).length;
    const consent = data.filter(function (d) { return d.hasPatientConsent; }).length;

    $('#statTotalCases').text(total);
    $('#statActiveCases').text(active);
    $('#statConsentCases').text(consent + '/' + total);
  }

  // Filter & Render
  function filterAndRender() {
    const cat = $('#filterBACategory').val();
    const status = $('#filterBAStatus').val();
    const search = $('#filterBASearch').val().toLowerCase().trim();

    const filtered = baData.filter(function (item) {
      if (cat && item.resultsType !== cat && item.categoryOrConcern !== cat) return false;
      if (status === 'active' && !item.isActive) return false;
      if (status === 'inactive' && item.isActive) return false;
      if (search) {
        const titleMatch = (item.treatment || item.title || '').toLowerCase().includes(search);
        const patientMatch = (item.patientName || '').toLowerCase().includes(search);
        const descMatch = (item.description || item.caption || '').toLowerCase().includes(search);
        if (!titleMatch && !patientMatch && !descMatch) return false;
      }
      return true;
    });

    renderCards(filtered);
  }

  // Render Grid Cards
  function renderCards(data) {
    const $container = $('#baListContainer').empty();

    if (!data || data.length === 0) {
      $container.html(`
        <div class="col-12 text-center py-5">
          <div class="p-5 bg-white border rounded-4 shadow-sm">
            <i class="bi bi-layout-split text-muted display-4 mb-3"></i>
            <h5 class="fw-bold text-dark">No Transformation Cases Found</h5>
            <p class="text-muted small">No cases match the selected filter criteria.</p>
            <button type="button" class="btn btn-luxury-emerald btn-sm rounded-pill px-3" onclick="$('#btnOpenAddBAModal').click()">
              <i class="bi bi-plus-lg me-1"></i> Add Transformation Case
            </button>
          </div>
        </div>
      `);
      return;
    }

    data.forEach(function (item) {
      const title = item.treatment || item.title || 'Clinical Case';
      const patient = item.patientName || 'Verified Patient';
      const category = item.resultsType || item.categoryOrConcern || 'General';
      const timeframe = item.timeframe || '6 Weeks';
      const desc = item.description || item.caption || 'Documented medical transformation.';

      let approvalBadge = '<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Approved</span>';
      if (item.approvalStatus === 'Pending Review') {
        approvalBadge = '<span class="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">Pending Review</span>';
      } else if (item.approvalStatus === 'Restricted') {
        approvalBadge = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">Restricted</span>';
      }

      const consentBadge = item.hasPatientConsent ?
        '<span class="badge bg-light text-success border small"><i class="bi bi-check-circle-fill me-1"></i>Consent OK</span>' :
        '<span class="badge bg-danger-subtle text-danger border border-danger-subtle small"><i class="bi bi-exclamation-triangle-fill me-1"></i>No Consent</span>';

      const cardHtml = `
        <div class="col-xl-4 col-lg-6">
          <div class="ba-case-card" data-id="${item.id}">
            <!-- Interactive Dual-Image Preview -->
            <div class="ba-slider-preview btn-visualize" data-id="${item.id}" title="Click to view full comparison preview">
              <div class="ba-slider-pane">
                <img src="${item.beforeImage}" alt="Before ${title}" loading="lazy" onerror="this.src='assets/img/avatar-default.svg'">
                <span class="ba-badge-pill ba-badge-before">Before</span>
              </div>
              <div class="ba-slider-pane border-start border-2 border-white">
                <img src="${item.afterImage}" alt="After ${title}" loading="lazy" onerror="this.src='assets/img/avatar-default.svg'">
                <span class="ba-badge-pill ba-badge-after">After</span>
              </div>
              <span class="ba-category-tag">${category}</span>
              <span class="ba-patient-tag">${patient}</span>
            </div>

            <!-- Card Content -->
            <div class="p-3 d-flex flex-column flex-grow-1">
              <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                <h6 class="fw-bold text-dark mb-0 font-serif" style="font-size: 0.95rem; line-height: 1.35;">
                  ${title}
                </h6>
                ${approvalBadge}
              </div>

              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span class="badge bg-light text-muted border small"><i class="bi bi-clock me-1 text-success"></i>${timeframe}</span>
                ${consentBadge}
                <span class="text-muted small ms-auto fw-bold">#${item.displayOrder || 1}</span>
              </div>

              <p class="small text-muted mb-3 flex-grow-1" style="font-size: 0.775rem; line-height: 1.5; min-height: 40px;">
                ${desc}
              </p>

              <!-- Footer Controls -->
              <div class="pt-2 border-top d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                  <div class="form-check form-switch m-0">
                    <input class="form-check-input btn-toggle-ba-status" type="checkbox" data-id="${item.id}" ${item.isActive ? 'checked' : ''} title="Toggle Website Visibility">
                  </div>
                  <span class="small fw-semibold ${item.isActive ? 'text-success' : 'text-muted'}">${item.isActive ? 'Live' : 'Hidden'}</span>
                </div>

                <div class="btn-group btn-group-sm">
                  <button type="button" class="btn btn-outline-secondary btn-visualize rounded-start-pill px-2" data-id="${item.id}" title="Enlarge Comparison">
                    <i class="bi bi-arrows-fullscreen"></i>
                  </button>
                  <button type="button" class="btn btn-outline-secondary btn-edit px-2" data-id="${item.id}" title="Edit Case">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button type="button" class="btn btn-outline-danger btn-delete rounded-end-pill px-2" data-id="${item.id}" title="Delete Case">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      $container.append(cardHtml);
    });
  }

  // Filter change events
  $('#filterBACategory, #filterBAStatus').on('change', filterAndRender);
  $('#filterBASearch').on('input', filterAndRender);
  $('#btnResetBAFilters').on('click', function () {
    $('#filterBACategory').val('');
    $('#filterBAStatus').val('');
    $('#filterBASearch').val('');
    filterAndRender();
  });

  // Toggle Status
  $(document).on('change', '.btn-toggle-ba-status', function () {
    const id = $(this).data('id');
    const $switch = $(this);

    window.API.toggleBeforeAfterStatus(id)
      .done(function (res) {
        if (res.success) {
          window.App.toast('success', res.message || 'Status updated');
          const item = baData.find(function (b) { return String(b.id) === String(id); });
          if (item) item.isActive = res.isActive;
          updateMetrics(baData);
          $switch.closest('.d-flex').find('span.small').text(res.isActive ? 'Live' : 'Hidden').toggleClass('text-success', res.isActive).toggleClass('text-muted', !res.isActive);
        }
      })
      .fail(function () {
        $switch.prop('checked', !$switch.prop('checked'));
        window.App.toast('error', 'Failed to toggle status');
      });
  });

  // Open Modal for Add
  $('#btnOpenAddBAModal').on('click', function () {
    $('#baForm')[0].reset();
    $('#baId').val('');
    $('#baBeforeImageUrl, #baAfterImageUrl').val('');
    $('#baBeforePreviewImg, #baAfterPreviewImg').attr('src', '');
    $('#baBeforePreviewWrap, #baAfterPreviewWrap').addClass('d-none');
    $('#baPatientName').val('Patient ' + String.fromCharCode(65 + (baData.length % 26)));
    $('#baTimeframe').val('6 Weeks');
    window.App.setCKData('baDescription', '');
    $('#baPatientConsent').prop('checked', true);
    $('#baIsActive').prop('checked', true);
    $('#baApprovalStatus').val('Approved');
    $('#baOrder').val(baData.length + 1);
    $('#baModalLabel').text('Add Clinical Transformation Case');
    $('#baModal').modal('show');
  });

  // Edit Case
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const item = baData.find(function (b) { return String(b.id) === String(id); });
    if (!item) return;

    $('#baId').val(item.id);
    $('#baTitle').val(item.treatment || item.title || '');
    $('#baPatientName').val(item.patientName || 'Verified Patient');
    $('#baCategory').val(item.resultsType || item.categoryOrConcern || 'Acne & Scars');
    $('#baTimeframe').val(item.timeframe || '');
    $('#baDescription').val(item.description || item.caption || '');
    window.App.setCKData('baDescription', item.description || item.caption || '');
    $('#baPatientConsent').prop('checked', item.hasPatientConsent);
    $('#baApprovalStatus').val(item.approvalStatus || 'Approved');
    $('#baOrder').val(item.displayOrder || 1);
    $('#baIsActive').prop('checked', item.isActive);

    $('#baBeforeImageUrl').val(item.beforeImage || '');
    if (item.beforeImage) {
      $('#baBeforePreviewImg').attr('src', item.beforeImage);
      $('#baBeforePreviewWrap').removeClass('d-none');
    } else {
      $('#baBeforePreviewWrap').addClass('d-none');
    }

    $('#baAfterImageUrl').val(item.afterImage || '');
    if (item.afterImage) {
      $('#baAfterPreviewImg').attr('src', item.afterImage);
      $('#baAfterPreviewWrap').removeClass('d-none');
    } else {
      $('#baAfterPreviewWrap').addClass('d-none');
    }

    $('#baModalLabel').text('Edit Case: ' + (item.treatment || item.title));
    $('#baModal').modal('show');
  });

  // Save Case
  $('#baForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#baId').val();
    const title = $('#baTitle').val().trim();
    const patientName = $('#baPatientName').val().trim() || 'Verified Patient';
    const category = $('#baCategory').val();
    const timeframe = $('#baTimeframe').val().trim() || '6 Weeks';
    const description = window.App.getCKData('baDescription') || $('#baDescription').val().trim();
    const beforeImg = $('#baBeforeImageUrl').val().trim();
    const afterImg = $('#baAfterImageUrl').val().trim();
    const hasConsent = $('#baPatientConsent').is(':checked');
    const approvalStatus = $('#baApprovalStatus').val();
    const displayOrder = parseInt($('#baOrder').val(), 10) || 1;
    const isActive = $('#baIsActive').is(':checked') ? 1 : 0;

    if (!title) {
      window.App.toast('error', 'Treatment protocol / case title is required');
      return;
    }

    if (!afterImg) {
      window.App.toast('error', 'After photograph is required');
      return;
    }

    const payload = {
      treatment: title,
      title: title,
      patientName: patientName,
      resultsType: category,
      categoryOrConcern: category,
      timeframe: timeframe,
      description: description,
      caption: description,
      beforeImage: beforeImg || afterImg,
      afterImage: afterImg,
      hasPatientConsent: hasConsent ? 1 : 0,
      approvalStatus: approvalStatus,
      displayOrder: displayOrder,
      isActive: isActive
    };

    const $btn = $('#btnSaveBA');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Saving...');

    const req = id ? window.API.updateBeforeAfter(id, payload) : window.API.createBeforeAfter(payload);

    req.done(function (res) {
      if (res.success) {
        window.App.toast('success', id ? 'Case updated successfully' : 'New transformation added successfully');
        $('#baModal').modal('hide');
        loadBeforeAfter();
      } else {
        window.App.toast('error', res.message || 'Operation failed');
      }
    })
    .fail(function (xhr) {
      const msg = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : 'Server error occurred';
      window.App.toast('error', msg);
    })
    .always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Transformation Case');
    });
  });

  // Delete Case
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const item = baData.find(function (b) { return String(b.id) === String(id); });
    const name = item ? (item.treatment || item.title) : 'this comparison';

    Swal.fire({
      title: 'Delete Transformation Case?',
      text: `Are you sure you want to permanently remove "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete Case'
    }).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteBeforeAfter(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Case deleted successfully');
              loadBeforeAfter();
            } else {
              window.App.toast('error', res.message || 'Failed to delete case');
            }
          })
          .fail(function () {
            window.App.toast('error', 'Failed to delete transformation case');
          });
      }
    });
  });

  // Enlarge Visualizer
  $(document).on('click', '.btn-visualize', function () {
    const id = $(this).data('id');
    const item = baData.find(function (b) { return String(b.id) === String(id); });
    if (!item) return;

    $('#visualizerTitle').text(item.treatment || item.title);
    $('#visBeforeImg').attr('src', item.beforeImage);
    $('#visAfterImg').attr('src', item.afterImage);
    $('#visCaption').text((item.timeframe ? `[${item.timeframe}] ` : '') + (item.description || item.caption || ''));
    $('#baVisualizerModal').modal('show');
  });

  // Initial load
  window.App.initCKEditor('#baDescription');
  loadBeforeAfter();
});
