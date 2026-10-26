/**
 * Skinfinity Derma Admin Dashboard
 * Before & After Management Controller
 */

$(document).ready(function () {
  'use strict';

  let baData = [];
  let treatmentsData = [];

  // Dropzone click bindings
  $('#baBeforeDropzone').on('click', function () {
    $('#baBeforeFile').trigger('click');
  });

  $('#baAfterDropzone').on('click', function () {
    $('#baAfterFile').trigger('click');
  });

  // Setup Before Image Preview
  window.App.setupImagePreview(
    '#baBeforeFile',
    '#baBeforePreviewImg',
    '#btnRemoveBABefore',
    '#baBeforeImageUrl'
  );

  // Setup After Image Preview
  window.App.setupImagePreview(
    '#baAfterFile',
    '#baAfterPreviewImg',
    '#btnRemoveBAAfter',
    '#baAfterImageUrl'
  );

  // Load Treatments for dropdown
  function loadTreatmentsDropdown() {
    return window.API.getTreatments().done(function (res) {
      if (res.success) {
        treatmentsData = res.data;
        const $filterSelect = $('#filterBATreatment');
        const $formSelect = $('#baTreatment');

        $filterSelect.empty().append('<option value="">All Treatments</option>');
        $formSelect.empty().append('<option value="">Select Treatment...</option>');

        treatmentsData.forEach(function (t) {
          $filterSelect.append(`<option value="${t.id}">${t.name}</option>`);
          $formSelect.append(`<option value="${t.id}">${t.name}</option>`);
        });
      }
    });
  }

  // Load Before & After Cases
  function loadBeforeAfter() {
    const params = {
      treatmentId: $('#filterBATreatment').val(),
      concern: $('#filterBAConcern').val()
    };

    window.API.getBeforeAfter(params)
      .done(function (res) {
        if (!res.success) return;
        baData = res.data;
        renderCards(baData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load before & after cases');
      });
  }

  // Render Cases
  function renderCards(data) {
    const $container = $('#baListContainer').empty();

    if (!data || data.length === 0) {
      $container.html(`
        <div class="col-12 empty-state">
          <i class="bi bi-layout-split empty-state-icon"></i>
          <div class="empty-state-title">No Comparison Cases Recorded</div>
          <div class="empty-state-text">Add patient transformation before-and-after photographic comparisons.</div>
          <button type="button" class="btn btn-primary btn-sm" onclick="$('#btnOpenAddBAModal').click()">
            <i class="bi bi-plus-lg me-1"></i> Add Comparison Case
          </button>
        </div>
      `);
      return;
    }

    data.forEach(function (item) {
      let approvalBadge = '<span class="badge bg-success-subtle text-success border border-success-subtle">Approved</span>';
      if (item.approvalStatus === 'Pending Review') {
        approvalBadge = '<span class="badge bg-warning-subtle text-warning border border-warning-subtle">Pending Review</span>';
      } else if (item.approvalStatus === 'Restricted') {
        approvalBadge = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle">Restricted</span>';
      }

      const consentBadge = item.hasPatientConsent ?
        '<span class="badge bg-light text-success border"><i class="bi bi-check-circle-fill me-1"></i>Consent Verified</span>' :
        '<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="bi bi-exclamation-triangle-fill me-1"></i>No Consent</span>';

      const statusSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-ba-status" type="checkbox" data-id="${item.id}" ${item.isActive ? 'checked' : ''} title="Toggle Visibility">
        </div>
      `;

      const cardHtml = `
        <div class="col-xl-6 col-lg-6">
          <div class="ba-card" data-id="${item.id}">
            <!-- Split Before & After View -->
            <div class="ba-split-view btn-visualize" data-id="${item.id}" style="cursor: pointer;" title="Click to view enlarged comparison">
              <div class="ba-pane">
                <img src="${item.beforeImage}" alt="${item.beforeAltText || item.title + ' Before'}" loading="lazy">
                <span class="ba-tag ba-tag-before">Before</span>
              </div>
              <div class="ba-pane border-start">
                <img src="${item.afterImage}" alt="${item.afterAltText || item.title + ' After'}" loading="lazy">
                <span class="ba-tag ba-tag-after">After</span>
              </div>
            </div>

            <!-- Card Content -->
            <div class="p-3">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="fw-bold text-dark fs-6">${item.title}</div>
                ${approvalBadge}
              </div>

              <div class="d-flex flex-wrap gap-2 mb-2">
                <span class="badge badge-pill-soft"><i class="bi bi-capsule me-1"></i>${item.treatmentName || 'Treatment'}</span>
                ${item.categoryOrConcern ? `<span class="badge bg-light text-muted border">${item.categoryOrConcern}</span>` : ''}
                ${consentBadge}
              </div>

              <p class="small text-muted mb-0 fst-italic text-truncate-2" style="min-height: 38px;">
                ${item.caption || 'No clinical observations entered.'}
              </p>
            </div>

            <!-- Footer Controls -->
            <div class="p-2 px-3 bg-light border-top d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <span class="small text-muted">Visible on Site:</span>
                ${statusSwitch}
              </div>

              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary btn-visualize" data-id="${item.id}" title="Enlarge Comparison">
                  <i class="bi bi-arrows-fullscreen"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary btn-edit" data-id="${item.id}" title="Edit Case">
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-outline-danger btn-delete" data-id="${item.id}" title="Delete Case">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      $container.append(cardHtml);
    });
  }

  // Open Modal for Add
  $('#btnOpenAddBAModal').on('click', function () {
    $('#baForm')[0].reset();
    $('#baId').val('');
    $('#baBeforeImageUrl, #baAfterImageUrl').val('');
    $('#baBeforePreviewImg, #baAfterPreviewImg').attr('src', '');
    $('#baBeforePreviewWrap, #baAfterPreviewWrap').addClass('d-none');
    $('#baPatientConsent').prop('checked', true);
    $('#baIsActive').prop('checked', true);
    $('#baApprovalStatus').val('Approved');
    $('#baOrder').val(baData.length + 1);
    $('#baModalLabel').text('Add Before & After Case');
    $('#baModal').modal('show');
  });

  // Edit Case
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const item = baData.find(b => b.id === id);
    if (!item) return;

    $('#baId').val(item.id);
    $('#baTitle').val(item.title);
    $('#baTreatment').val(item.treatmentId || '');
    $('#baCategoryOrConcern').val(item.categoryOrConcern || '');
    $('#baCaption').val(item.caption || '');
    $('#baBeforeAlt').val(item.beforeAltText || '');
    $('#baAfterAlt').val(item.afterAltText || '');
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

    $('#baModalLabel').text('Edit Case: ' + item.title);
    $('#baModal').modal('show');
  });

  // Save Case
  $('#baForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#baId').val();
    const title = $('#baTitle').val().trim();
    const beforeImg = $('#baBeforeImageUrl').val().trim();
    const afterImg = $('#baAfterImageUrl').val().trim();
    const treatmentId = $('#baTreatment').val();
    const hasConsent = $('#baPatientConsent').is(':checked');

    if (!title) {
      window.App.toast('error', 'Case title is required');
      return;
    }

    if (!beforeImg || !afterImg) {
      window.App.toast('error', 'Both Before and After photographs must be uploaded');
      return;
    }

    if (!treatmentId) {
      window.App.toast('error', 'Please associate a treatment with this case');
      return;
    }

    if (!hasConsent && $('#baIsActive').is(':checked')) {
      Swal.fire({
        icon: 'warning',
        title: 'Consent Required',
        text: 'Patient consent must be confirmed before publishing identifiable before & after photographs.',
        confirmButtonColor: '#124432'
      });
      return;
    }

    const payload = {
      title: title,
      beforeImage: beforeImg,
      afterImage: afterImg,
      treatmentId: treatmentId,
      categoryOrConcern: $('#baCategoryOrConcern').val().trim(),
      caption: $('#baCaption').val().trim(),
      beforeAltText: $('#baBeforeAlt').val().trim() || `${title} - Before`,
      afterAltText: $('#baAfterAlt').val().trim() || `${title} - After`,
      hasPatientConsent: hasConsent,
      approvalStatus: $('#baApprovalStatus').val(),
      displayOrder: parseInt($('#baOrder').val()) || 1,
      isActive: $('#baIsActive').is(':checked')
    };

    const $btn = $('#btnSaveBA');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateBeforeAfter(id, payload) : window.API.createBeforeAfter(payload);

    request.done(function (res) {
      if (res.success) {
        $('#baModal').modal('hide');
        window.App.toast('success', res.message || 'Case saved successfully');
        loadBeforeAfter();
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save case';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Comparison Case');
    });
  });

  // Toggle Visibility Status
  $(document).on('change', '.btn-toggle-ba-status', function () {
    const id = $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleBeforeAfterStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update status');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Case
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const item = baData.find(b => b.id === id);
    if (!item) return;

    window.App.confirm(
      'Delete Comparison Case?',
      `Are you sure you want to remove "${item.title}"?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteBeforeAfter(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Case deleted successfully');
              loadBeforeAfter();
            }
          })
          .fail(function () {
            window.App.toast('error', 'Error deleting case');
          });
      }
    });
  });

  // Enlarge Visualizer
  $(document).on('click', '.btn-visualize', function () {
    const id = $(this).data('id');
    const item = baData.find(b => b.id === id);
    if (!item) return;

    $('#visualizerTitle').text(item.title);
    $('#visBeforeImg').attr('src', item.beforeImage);
    $('#visAfterImg').attr('src', item.afterImage);
    $('#visCaption').text(item.caption || 'Clinical before-and-after comparison protocol.');
    $('#baVisualizerModal').modal('show');
  });

  // Filters
  $('#filterBATreatment, #filterBAConcern').on('change input', loadBeforeAfter);
  $('#btnResetBAFilters').on('click', function () {
    $('#filterBATreatment').val('');
    $('#filterBAConcern').val('');
    loadBeforeAfter();
  });

  // Check URL params for ?action=new
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'new') {
    setTimeout(function () {
      $('#btnOpenAddBAModal').trigger('click');
    }, 200);
  }

  // Initialize
  loadTreatmentsDropdown().always(function () {
    loadBeforeAfter();
  });
});
