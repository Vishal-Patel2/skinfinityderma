/**
 * Skinfinity Derma Admin Dashboard
 * Google Reviews Controller
 */

$(document).ready(function () {
  'use strict';

  let reviewsData = [];
  let dataTable = null;
  let currentView = 'grid'; // 'grid' or 'table'
  let activeTreatmentFilter = '';

  // Load Google Review Overview Stats
  function loadGoogleStats() {
    window.API.getReviewStats().done(function (res) {
      if (!res.success) return;
      const s = res.data;
      $('#displayGoogleRating').text(s.rating ? `${s.rating}+` : '4.7+');
      $('#displayGoogleReviewCount').text(s.reviewCount || '2500+');
      if (s.writeReviewUrl) {
        $('#btnWriteReviewLink').attr('href', s.writeReviewUrl);
        $('#statGoogleWriteUrl').val(s.writeReviewUrl);
      }
      $('#statGoogleRating').val(s.rating || '4.7+');
      $('#statGoogleReviewCount').val(s.reviewCount || '2500+');
    });
  }

  // Load Reviews
  function loadReviews() {
    const params = {};
    if (activeTreatmentFilter) {
      params.treatmentTag = activeTreatmentFilter;
    }

    window.API.getReviews(params)
      .done(function (res) {
        if (!res.success) return;
        reviewsData = res.data;
        $('#navBadgeReviews').text(reviewsData.length);

        if (currentView === 'grid') {
          renderGrid(reviewsData);
        } else {
          renderTable(reviewsData);
        }
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load Google reviews');
      });
  }

  // Render Gold Stars HTML
  function getStarsHtml(rating) {
    const r = Math.max(1, Math.min(5, parseInt(rating) || 5));
    let stars = '';
    for (let i = 0; i < r; i++) {
      stars += '★';
    }
    for (let i = r; i < 5; i++) {
      stars += '☆';
    }
    return `<span class="stars-gold">${stars}</span>`;
  }

  // Render Grid View matching the screenshot
  function renderGrid(data) {
    const $container = $('#reviewsGridContainer').empty();
    $('#reviewsTableContainer').addClass('d-none');
    $('#reviewsGridContainer').removeClass('d-none');

    if (!data || data.length === 0) {
      $container.html(`
        <div class="col-12 empty-state">
          <i class="bi bi-google empty-state-icon"></i>
          <div class="empty-state-title">No Google Reviews Found</div>
          <div class="empty-state-text">Add patient Google feedback to display in your website testimonials section.</div>
          <button type="button" class="btn btn-primary btn-sm" onclick="$('#btnOpenAddReviewModal').click()">
            <i class="bi bi-plus-lg me-1"></i> Add Google Review
          </button>
        </div>
      `);
      return;
    }

    data.forEach(function (r) {
      const initials = r.initials || r.reviewerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const statusSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-review-status" type="checkbox" data-id="${r.id}" ${r.isActive ? 'checked' : ''} title="Toggle Visibility">
        </div>
      `;

      const cardHtml = `
        <div class="col-xl-4 col-md-6">
          <div class="review-card" data-id="${r.id}">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="d-flex align-items-center gap-3">
                <div class="reviewer-initials-badge">${initials}</div>
                <div>
                  <div class="fw-bold text-dark fs-6 mb-0">${r.reviewerName}</div>
                  <div class="text-muted small" style="font-size: 0.74rem;">
                    <i class="bi bi-google text-primary me-1"></i> Google
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-center gap-1">
                ${statusSwitch}
              </div>
            </div>

            <div class="mb-2">
              ${getStarsHtml(r.rating)}
            </div>

            <p class="small text-secondary mb-3 fst-normal" style="line-height: 1.55; flex: 1;">
              "${r.reviewText}"
            </p>

            <div class="pt-2 border-top d-flex justify-content-between align-items-center mt-auto" style="font-size: 0.78rem;">
              <span class="badge badge-pill-soft">${r.treatmentTag || 'Skin Treatment'}</span>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary btn-sm py-0 px-2 btn-edit" data-id="${r.id}" title="Edit Review">
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm py-0 px-2 btn-delete" data-id="${r.id}" title="Delete Review">
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

  // Render Table View
  function renderTable(data) {
    if (dataTable) {
      dataTable.destroy();
    }

    const $tbody = $('#reviewsTableBody').empty();
    $('#reviewsGridContainer').addClass('d-none');
    $('#reviewsTableContainer').removeClass('d-none');

    data.forEach(function (r) {
      const initials = r.initials || r.reviewerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const statusSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-review-status" type="checkbox" data-id="${r.id}" ${r.isActive ? 'checked' : ''} title="Toggle Active">
        </div>
      `;

      const row = `
        <tr data-id="${r.id}">
          <td class="fw-bold text-muted">${r.displayOrder || 1}</td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-light text-primary border">${initials}</span>
              <span class="fw-bold text-dark">${r.reviewerName}</span>
            </div>
          </td>
          <td>${getStarsHtml(r.rating)}</td>
          <td>
            <div class="small text-secondary text-truncate" style="max-width: 320px;" title="${r.reviewText}">
              "${r.reviewText}"
            </div>
          </td>
          <td><span class="badge badge-pill-soft">${r.treatmentTag || 'Skin'}</span></td>
          <td><span class="small text-muted">${r.branch || 'Delhi NCR'}</span></td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit" data-id="${r.id}" title="Edit Review">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" data-id="${r.id}" title="Delete Review">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    dataTable = $('#reviewsTable').DataTable({
      responsive: true,
      order: [[0, 'asc']],
      pageLength: 10,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search reviews by patient or text..."
      }
    });
  }

  // Filter Pills Click
  $('#filterPillsContainer').on('click', '.google-pill-btn', function () {
    $('#filterPillsContainer .google-pill-btn').removeClass('active');
    $(this).addClass('active');
    activeTreatmentFilter = $(this).data('treatment') || '';
    loadReviews();
  });

  // View Switchers
  $('#btnViewGrid').on('click', function () {
    currentView = 'grid';
    $(this).addClass('active');
    $('#btnViewTable').removeClass('active');
    renderGrid(reviewsData);
  });

  $('#btnViewTable').on('click', function () {
    currentView = 'table';
    $(this).addClass('active');
    $('#btnViewGrid').removeClass('active');
    renderTable(reviewsData);
  });

  // Live Card Preview in Modal
  function updateModalPreview() {
    const name = $('#reviewerName').val().trim() || 'Patient Name';
    const initialsInput = $('#reviewInitials').val().trim();
    const initials = initialsInput || name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'P';
    const text = $('#reviewText').val().trim() || 'Review text will appear here...';
    const rating = $('#reviewRating').val() || 5;
    const tag = $('#reviewTreatmentTag').val().trim() || 'Laser Hair Removal';
    const branch = $('#reviewBranch').val().trim().split(',')[0] || 'Safdarjung';

    $('#previewReviewerName').text(name);
    $('#previewInitials').text(initials);
    $('#previewText').text(text);
    $('#previewStars').html(getStarsHtml(rating));
    $('#previewTag').text(tag);
    $('#previewBranchText').text(branch);
  }

  $('#reviewerName, #reviewInitials, #reviewText, #reviewRating, #reviewTreatmentTag, #reviewBranch')
    .on('input change', updateModalPreview);

  // Open Modal for Add
  $('#btnOpenAddReviewModal').on('click', function () {
    $('#reviewForm')[0].reset();
    $('#reviewId').val('');
    $('#reviewRating').val('5');
    $('#reviewIsActive').prop('checked', true);
    $('#reviewDisplayOrder').val(reviewsData.length + 1);
    $('#reviewModalLabel').text('Add Google Review');
    updateModalPreview();
    $('#reviewModal').modal('show');
  });

  // Edit Review
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const r = reviewsData.find(item => item.id === id);
    if (!r) return;

    $('#reviewId').val(r.id);
    $('#reviewerName').val(r.reviewerName);
    $('#reviewInitials').val(r.initials || '');
    $('#reviewRating').val(r.rating || 5);
    $('#reviewTreatmentTag').val(r.treatmentTag || '');
    $('#reviewBranch').val(r.branch || 'Safdarjung Enclave, New Delhi');
    $('#reviewText').val(r.reviewText);
    $('#reviewDisplayOrder').val(r.displayOrder || 1);
    $('#reviewIsActive').prop('checked', r.isActive);

    $('#reviewModalLabel').text('Edit Google Review: ' + r.reviewerName);
    updateModalPreview();
    $('#reviewModal').modal('show');
  });

  // Save Review (Create or Update)
  $('#reviewForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#reviewId').val();
    const name = $('#reviewerName').val().trim();
    const text = $('#reviewText').val().trim();

    if (!name || !text) {
      window.App.toast('error', 'Reviewer name and review text are required');
      return;
    }

    const payload = {
      reviewerName: name,
      initials: $('#reviewInitials').val().trim(),
      rating: parseInt($('#reviewRating').val()) || 5,
      treatmentTag: $('#reviewTreatmentTag').val().trim() || 'Skin Treatment',
      branch: $('#reviewBranch').val(),
      reviewText: text,
      displayOrder: parseInt($('#reviewDisplayOrder').val()) || 1,
      isActive: $('#reviewIsActive').is(':checked')
    };

    const $btn = $('#btnSaveReview');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateReview(id, payload) : window.API.createReview(payload);

    request.done(function (res) {
      if (res.success) {
        $('#reviewModal').modal('hide');
        window.App.toast('success', res.message || 'Google review saved successfully');
        loadReviews();
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save review';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Google Review');
    });
  });

  // Toggle Visibility
  $(document).on('change', '.btn-toggle-review-status', function () {
    const id = $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleReviewStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update review status');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Review
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const r = reviewsData.find(item => item.id === id);
    if (!r) return;

    window.App.confirm(
      'Delete Google Review?',
      `Are you sure you want to remove the review by "${r.reviewerName}"?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteReview(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Google review deleted successfully');
              loadReviews();
            }
          })
          .fail(function () {
            window.App.toast('error', 'Error deleting review');
          });
      }
    });
  });

  // Edit Google Overall Stats Modal
  $('#btnEditGoogleStats').on('click', function () {
    $('#googleStatsModal').modal('show');
  });

  $('#googleStatsForm').on('submit', function (e) {
    e.preventDefault();

    const payload = {
      rating: $('#statGoogleRating').val().trim(),
      reviewCount: $('#statGoogleReviewCount').val().trim(),
      writeReviewUrl: $('#statGoogleWriteUrl').val().trim()
    };

    window.API.updateReviewStats(payload)
      .done(function (res) {
        if (res.success) {
          $('#googleStatsModal').modal('hide');
          window.App.toast('success', 'Google rating overview updated');
          loadGoogleStats();
        }
      });
  });

  $('#btnReloadReviews').on('click', loadReviews);

  // Initial Load
  loadGoogleStats();
  loadReviews();
});
