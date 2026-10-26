/**
 * Skinfinity Derma Admin Dashboard
 * Video Testimonials (Patient Stories) Controller
 */

$(document).ready(function () {
  'use strict';

  let testimonialsData = [];
  let treatmentsData = [];
  let dataTable = null;
  let currentView = 'grid'; // 'grid' or 'table'

  // Dropzone trigger
  $('#testimonialDropzone').on('click', function () {
    $('#testimonialThumbFile').trigger('click');
  });

  // Setup Thumbnail Preview
  window.App.setupImagePreview(
    '#testimonialThumbFile',
    '#testimonialPreviewImg',
    '#btnRemoveTestimonialThumb',
    '#testimonialThumbnailUrl'
  );

  // Helper to convert any YouTube URL to an embeddable URL
  function getEmbedUrl(url) {
    if (!url) return '';
    if (url.includes('embed/')) return url;

    // Standard YouTube watch link: https://www.youtube.com/watch?v=ID
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }

    // Vimeo: https://vimeo.com/ID
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    return url;
  }

  // Load Treatments for dropdown
  function loadTreatmentsDropdown() {
    return window.API.getTreatments().done(function (res) {
      if (res.success) {
        treatmentsData = res.data;
        const $filter = $('#filterTestimonialTreatment');
        const $form = $('#testimonialTreatment');

        $filter.empty().append('<option value="">All Treatments</option>');
        $form.empty().append('<option value="">General Clinic Experience</option>');

        treatmentsData.forEach(function (t) {
          $filter.append(`<option value="${t.id}">${t.name}</option>`);
          $form.append(`<option value="${t.id}">${t.name}</option>`);
        });
      }
    });
  }

  // Load Testimonials
  function loadTestimonials() {
    const params = {
      treatmentId: $('#filterTestimonialTreatment').val(),
      status: $('#filterTestimonialStatus').val()
    };

    window.API.getTestimonials(params)
      .done(function (res) {
        if (!res.success) return;
        testimonialsData = res.data;
        $('#navBadgeVideoTestimonials').text(testimonialsData.length);

        if (currentView === 'grid') {
          renderGrid(testimonialsData);
        } else {
          renderTable(testimonialsData);
        }
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load video testimonials');
      });
  }

  // Render Video Cards Grid matching Patient Stories Screenshot
  function renderGrid(data) {
    const $container = $('#testimonialsGridContainer').empty();
    $('#testimonialsTableContainer').addClass('d-none');
    $('#testimonialsGridContainer').removeClass('d-none');

    if (!data || data.length === 0) {
      $container.html(`
        <div class="col-12 empty-state">
          <i class="bi bi-play-btn empty-state-icon"></i>
          <div class="empty-state-title">No Video Stories Recorded</div>
          <div class="empty-state-text">Add patient video stories, YouTube testimonials, and clinical feedback.</div>
          <button type="button" class="btn btn-primary btn-sm" onclick="$('#btnOpenAddTestimonialModal').click()">
            <i class="bi bi-plus-lg me-1"></i> Add Video Story
          </button>
        </div>
      `);
      return;
    }

    data.forEach(function (item) {
      const statusBadge = item.isActive ?
        '<span class="badge badge-active">Active</span>' :
        '<span class="badge badge-inactive">Inactive</span>';

      const thumb = item.thumbnailUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80';

      const cardHtml = `
        <div class="col-xl-4 col-md-6">
          <div class="story-video-card">
            <!-- Background Image Thumbnail -->
            <img src="${thumb}" alt="${item.title}" class="story-video-thumb" loading="lazy">
            <div class="story-video-overlay"></div>

            <!-- Top Actions Overlay -->
            <div class="story-actions-bar">
              <div class="form-check form-switch m-0 me-1">
                <input class="form-check-input btn-toggle-testimonial-status" type="checkbox" data-id="${item.id}" ${item.isActive ? 'checked' : ''} title="Toggle Visibility">
              </div>
              <button type="button" class="btn btn-sm btn-light btn-icon shadow-sm btn-edit" data-id="${item.id}" title="Edit Story">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-sm btn-danger btn-icon shadow-sm btn-delete" data-id="${item.id}" title="Delete Story">
                <i class="bi bi-trash"></i>
              </button>
            </div>

            <!-- Central Play Button -->
            <button type="button" class="story-play-btn btn-play-video" data-id="${item.id}" title="Watch Patient Story">
              <i class="bi bi-play-fill"></i>
            </button>

            <!-- Bottom Content Overlay -->
            <div class="story-card-content">
              <div class="story-journey-tag">${item.journeyTag || 'PATIENT STORY'}</div>
              <div class="story-card-title text-truncate-2">${item.title}</div>
              <div class="d-flex align-items-center justify-content-between">
                <div class="story-stars-gold">★★★★★</div>
                <span class="small text-white-50" style="font-size: 0.76rem;">
                  <i class="bi bi-person me-1"></i>${item.patientName || 'Skinfinity Patient'}
                </span>
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

    const $tbody = $('#testimonialsTableBody').empty();
    $('#testimonialsGridContainer').addClass('d-none');
    $('#testimonialsTableContainer').removeClass('d-none');

    data.forEach(function (item) {
      const thumb = `
        <img src="${item.thumbnailUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80'}" alt="${item.title}" style="width: 75px; height: 48px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);">
      `;

      const statusSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-testimonial-status" type="checkbox" data-id="${item.id}" ${item.isActive ? 'checked' : ''} title="Toggle Active">
        </div>
      `;

      const row = `
        <tr data-id="${item.id}">
          <td class="fw-bold text-muted">${item.displayOrder || 1}</td>
          <td>${thumb}</td>
          <td>
            <div class="fw-bold text-dark">${item.title}</div>
            <div class="small text-muted text-truncate" style="max-width: 260px;">${item.quote || '—'}</div>
          </td>
          <td><span class="fw-semibold text-secondary small">${item.patientName || 'Anonymous'}</span></td>
          <td><span class="badge badge-pill-soft">${item.journeyTag || 'Patient Story'}</span></td>
          <td><span class="small text-muted">${item.treatmentName || 'General'}</span></td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-primary btn-play-video" data-id="${item.id}" title="Watch Video">
                <i class="bi bi-play-fill"></i>
              </button>
              <button type="button" class="btn btn-outline-secondary btn-edit" data-id="${item.id}" title="Edit Story">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" data-id="${item.id}" title="Delete Story">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    dataTable = $('#testimonialsTable').DataTable({
      responsive: true,
      order: [[0, 'asc']],
      pageLength: 10,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search video stories..."
      }
    });
  }

  // Play Video Lightbox Modal
  $(document).on('click', '.btn-play-video', function () {
    const id = $(this).data('id');
    const item = testimonialsData.find(v => v.id === id);
    if (!item) return;

    const embedUrl = getEmbedUrl(item.videoUrl);
    $('#videoModalTitle').text(item.title);
    $('#videoModalQuote').html(item.quote ? `<i class="bi bi-quote me-1"></i>"${item.quote}" — <strong>${item.patientName || 'Patient'}</strong>` : '');

    // Embed iframe
    $('#videoFrameContainer').html(`
      <iframe src="${embedUrl}" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%;"></iframe>
    `);

    $('#videoPlayerModal').modal('show');
  });

  // Stop video when closing modal
  $('#videoPlayerModal').on('hidden.bs.modal', function () {
    $('#videoFrameContainer').empty();
  });

  // View Switchers
  $('#btnViewGrid').on('click', function () {
    currentView = 'grid';
    $(this).addClass('active');
    $('#btnViewTable').removeClass('active');
    renderGrid(testimonialsData);
  });

  $('#btnViewTable').on('click', function () {
    currentView = 'table';
    $(this).addClass('active');
    $('#btnViewGrid').removeClass('active');
    renderTable(testimonialsData);
  });

  // Open Modal for Add
  $('#btnOpenAddTestimonialModal').on('click', function () {
    $('#testimonialForm')[0].reset();
    $('#testimonialId').val('');
    $('#testimonialThumbnailUrl').val('');
    $('#testimonialPreviewImg').attr('src', '');
    $('#testimonialPreviewWrap').addClass('d-none');
    $('#testimonialJourneyTag').val('PATIENT STORY');
    $('#testimonialRating').val('5');
    $('#testimonialIsActive').prop('checked', true);
    $('#testimonialOrder').val(testimonialsData.length + 1);
    $('#testimonialModalLabel').text('Add Video Testimonial');
    $('#testimonialModal').modal('show');
  });

  // Edit Testimonial
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const item = testimonialsData.find(v => v.id === id);
    if (!item) return;

    $('#testimonialId').val(item.id);
    $('#testimonialTitle').val(item.title);
    $('#testimonialPatientName').val(item.patientName || '');
    $('#testimonialJourneyTag').val(item.journeyTag || 'PATIENT STORY');
    $('#testimonialVideoUrl').val(item.videoUrl);
    $('#testimonialTreatment').val(item.treatmentId || '');
    $('#testimonialQuote').val(item.quote || '');
    $('#testimonialRating').val(item.rating || 5);
    $('#testimonialOrder').val(item.displayOrder || 1);
    $('#testimonialIsActive').prop('checked', item.isActive);

    $('#testimonialThumbnailUrl').val(item.thumbnailUrl || '');
    if (item.thumbnailUrl) {
      $('#testimonialPreviewImg').attr('src', item.thumbnailUrl);
      $('#testimonialPreviewWrap').removeClass('d-none');
    } else {
      $('#testimonialPreviewWrap').addClass('d-none');
    }

    $('#testimonialModalLabel').text('Edit Video Story: ' + item.title);
    $('#testimonialModal').modal('show');
  });

  // Save Testimonial (Create or Update)
  $('#testimonialForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#testimonialId').val();
    const title = $('#testimonialTitle').val().trim();
    const videoUrl = $('#testimonialVideoUrl').val().trim();

    if (!title || !videoUrl) {
      window.App.toast('error', 'Story title and video URL are required');
      return;
    }

    const treatmentId = $('#testimonialTreatment').val();
    const treatment = treatmentsData.find(t => t.id === treatmentId);

    const payload = {
      title: title,
      patientName: $('#testimonialPatientName').val().trim() || 'Skinfinity Patient',
      journeyTag: $('#testimonialJourneyTag').val().trim() || 'PATIENT STORY',
      videoUrl: videoUrl,
      thumbnailUrl: $('#testimonialThumbnailUrl').val().trim() || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      treatmentId: treatmentId || '',
      treatmentName: treatment ? treatment.name : '',
      quote: $('#testimonialQuote').val().trim(),
      rating: parseInt($('#testimonialRating').val()) || 5,
      displayOrder: parseInt($('#testimonialOrder').val()) || 1,
      isActive: $('#testimonialIsActive').is(':checked')
    };

    const $btn = $('#btnSaveTestimonial');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateTestimonial(id, payload) : window.API.createTestimonial(payload);

    request.done(function (res) {
      if (res.success) {
        $('#testimonialModal').modal('hide');
        window.App.toast('success', res.message || 'Video testimonial saved successfully');
        loadTestimonials();
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save testimonial';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Video Story');
    });
  });

  // Toggle Visibility
  $(document).on('change', '.btn-toggle-testimonial-status', function () {
    const id = $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleTestimonialStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update status');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Testimonial
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const item = testimonialsData.find(v => v.id === id);
    if (!item) return;

    window.App.confirm(
      'Delete Video Story?',
      `Are you sure you want to remove "${item.title}"?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteTestimonial(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Video story deleted successfully');
              loadTestimonials();
            }
          })
          .fail(function () {
            window.App.toast('error', 'Error deleting story');
          });
      }
    });
  });

  // Filters
  $('#filterTestimonialTreatment, #filterTestimonialStatus').on('change', loadTestimonials);
  $('#btnResetTestimonialFilters').on('click', function () {
    $('#filterTestimonialTreatment').val('');
    $('#filterTestimonialStatus').val('');
    loadTestimonials();
  });

  $('#btnReloadTestimonials').on('click', loadTestimonials);

  // Initialize
  loadTreatmentsDropdown().always(function () {
    loadTestimonials();
  });
});
