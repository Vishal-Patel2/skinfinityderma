/**
 * Skinfinity Derma Admin Dashboard
 * Gallery Module Controller
 */

$(document).ready(function () {
  'use strict';

  let galleryData = [];
  let treatmentsData = [];
  let currentView = 'grid'; // 'grid' or 'table'

  // Dropzone trigger
  $('#galleryDropzone').on('click', function () {
    $('#galleryImageFile').trigger('click');
  });

  // Setup Image Preview
  window.App.setupImagePreview(
    '#galleryImageFile',
    '#galleryPreviewImg',
    '#btnRemoveGalleryImg',
    '#galleryImageUrl'
  );

  // Load Treatments for dropdown
  function loadTreatmentsDropdown() {
    return window.API.getTreatments().done(function (res) {
      if (res.success) {
        treatmentsData = res.data;
        const $select = $('#filterGalleryTreatment, #galleryTreatment');
        $select.empty().append('<option value="">None / General</option>');
        treatmentsData.forEach(function (t) {
          $select.append(`<option value="${t.id}">${t.name}</option>`);
        });
      }
    });
  }

  // Load Gallery Items
  function loadGallery() {
    const params = {
      category: $('#filterGalleryCategory').val(),
      treatmentId: $('#filterGalleryTreatment').val()
    };

    window.API.getGallery(params)
      .done(function (res) {
        if (!res.success) return;
        galleryData = res.data;
        if (currentView === 'grid') {
          renderGrid(galleryData);
        } else {
          renderTable(galleryData);
        }
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load gallery items');
      });
  }

  // Render Grid View
  function renderGrid(data) {
    const $container = $('#galleryGridContainer').empty();
    $('#galleryTableContainer').addClass('d-none');
    $('#galleryGridContainer').removeClass('d-none');

    if (!data || data.length === 0) {
      $container.html(`
        <div class="col-12 w-100 empty-state">
          <i class="bi bi-images empty-state-icon"></i>
          <div class="empty-state-title">No Gallery Images Found</div>
          <div class="empty-state-text">Upload clinical treatment photographs or clinic ambience pictures.</div>
          <button type="button" class="btn btn-primary btn-sm" onclick="$('#btnOpenAddGalleryModal').click()">
            <i class="bi bi-cloud-arrow-up me-1"></i> Upload Image
          </button>
        </div>
      `);
      return;
    }

    data.forEach(function (item) {
      const activeBadge = item.isActive ?
        '<span class="badge badge-active gallery-badge">Active</span>' :
        '<span class="badge badge-inactive gallery-badge">Inactive</span>';

      const html = `
        <div class="gallery-card" data-id="${item.id}">
          <div class="gallery-thumb-wrap">
            ${activeBadge}
            <img src="${item.image}" alt="${item.altText || item.title}" loading="lazy" class="btn-lightbox" data-img="${item.image}" data-caption="${item.title}">
          </div>
          <div class="gallery-card-body">
            <div class="gallery-card-title text-truncate" title="${item.title || 'Untitled'}">${item.title || 'Untitled Image'}</div>
            <div class="gallery-card-meta mb-1 d-flex gap-1 flex-wrap">
              <span class="badge bg-teal-subtle text-teal border border-teal-subtle">${item.category || 'Clinic'}</span>
              ${item.badge ? `<span class="badge bg-light text-dark border">${item.badge}</span>` : ''}
              ${item.location ? `<span class="badge bg-secondary-subtle text-secondary">${item.location}</span>` : ''}
            </div>
            ${item.description ? `<p class="small text-muted mb-1 text-truncate-2" style="font-size: 11px; line-height: 1.35;">${item.description}</p>` : ''}
          </div>
          <div class="gallery-card-footer">
            <div class="form-check form-switch m-0">
              <input class="form-check-input btn-toggle-gallery-status" type="checkbox" data-id="${item.id}" ${item.isActive ? 'checked' : ''} title="Toggle Active">
            </div>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit" data-id="${item.id}" title="Edit Caption">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" data-id="${item.id}" title="Delete Image">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      $container.append(html);
    });
  }

  // Render Table View
  function renderTable(data) {
    const $tbody = $('#galleryTableBody').empty();
    $('#galleryGridContainer').addClass('d-none');
    $('#galleryTableContainer').removeClass('d-none');

    data.forEach(function (item) {
      const thumb = `
        <img src="${item.image}" alt="${item.title}" class="btn-lightbox" data-img="${item.image}" data-caption="${item.title}" style="width: 70px; height: 50px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 1px solid var(--border);">
      `;

      const statusSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-gallery-status" type="checkbox" data-id="${item.id}" ${item.isActive ? 'checked' : ''} title="Toggle Active">
        </div>
      `;

      const row = `
        <tr data-id="${item.id}">
          <td class="fw-bold text-muted">${item.displayOrder || 1}</td>
          <td>${thumb}</td>
          <td>
            <div class="fw-bold text-dark">${item.title || 'Untitled'}</div>
            <div class="small text-muted text-truncate" style="max-width: 250px;">${item.altText || '—'}</div>
          </td>
          <td><span class="badge badge-pill-soft">${item.category || 'General'}</span></td>
          <td><span class="small text-muted">${item.treatmentName || 'General'}</span></td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit" data-id="${item.id}" title="Edit Image">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" data-id="${item.id}" title="Delete Image">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });
  }

  // View Switchers
  $('#btnViewGrid').on('click', function () {
    currentView = 'grid';
    $(this).addClass('active');
    $('#btnViewTable').removeClass('active');
    renderGrid(galleryData);
  });

  $('#btnViewTable').on('click', function () {
    currentView = 'table';
    $(this).addClass('active');
    $('#btnViewGrid').removeClass('active');
    renderTable(galleryData);
  });

  // Lightbox Click
  $(document).on('click', '.btn-lightbox', function () {
    const src = $(this).data('img');
    const caption = $(this).data('caption') || '';
    $('#lightboxImg').attr('src', src);
    $('#lightboxCaption').text(caption);
    $('#lightboxModal').modal('show');
  });

  // Open Modal for Add
  $('#btnOpenAddGalleryModal').on('click', function () {
    $('#galleryForm')[0].reset();
    $('#galleryId').val('');
    $('#galleryImageUrl').val('');
    $('#galleryPreviewImg').attr('src', '');
    $('#galleryPreviewWrap').addClass('d-none');
    $('#galleryIsActive').prop('checked', true);
    $('#galleryDisplayOrder').val(galleryData.length + 1);
    $('#galleryModalLabel').text('Upload Gallery Image');
    $('#galleryModal').modal('show');
  });

  // Edit Gallery Item
  $(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    const id = $(this).attr('data-id') || $(this).data('id');
    const item = galleryData.find(g => String(g.id) === String(id));
    if (!item) {
      console.warn('Gallery item not found in local cache for id:', id);
      return;
    }

    $('#galleryId').val(item.id);
    $('#galleryTitle').val(item.title || '');
    $('#galleryDescription').val(item.description || '');
    $('#galleryBadge').val(item.badge || '');
    $('#galleryLocation').val(item.location || 'Noida & Gurgaon');
    $('#galleryAltText').val(item.altText || '');
    $('#galleryCategory').val(item.category || '');
    $('#galleryTreatment').val(item.treatmentId || '');
    $('#galleryDisplayOrder').val(item.displayOrder || 1);
    $('#galleryIsActive').prop('checked', Boolean(item.isActive));

    $('#galleryImageUrl').val(item.image || '');
    if (item.image) {
      $('#galleryPreviewImg').attr('src', item.image);
      $('#galleryPreviewWrap').removeClass('d-none');
    } else {
      $('#galleryPreviewWrap').addClass('d-none');
    }

    $('#galleryModalLabel').text('Edit Gallery Image Details');
    $('#galleryModal').modal('show');
  });

  // Save Gallery Item
  $('#galleryForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#galleryId').val();
    const image = $('#galleryImageUrl').val().trim();

    if (!image) {
      window.App.toast('error', 'Please upload or provide an image');
      return;
    }

    const payload = {
      image: image,
      title: $('#galleryTitle').val().trim(),
      description: $('#galleryDescription').val().trim(),
      badge: $('#galleryBadge').val().trim(),
      location: $('#galleryLocation').val(),
      altText: $('#galleryAltText').val().trim(),
      category: $('#galleryCategory').val().trim() || 'Clinic',
      treatmentId: $('#galleryTreatment').val() || '',
      displayOrder: parseInt($('#galleryDisplayOrder').val()) || 1,
      isActive: $('#galleryIsActive').is(':checked')
    };

    const $btn = $('#btnSaveGallery');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateGalleryItem(id, payload) : window.API.createGalleryItem(payload);

    request.done(function (res) {
      if (res.success) {
        $('#galleryModal').modal('hide');
        window.App.toast('success', res.message || 'Gallery item saved successfully');
        loadGallery();
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save gallery item';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Image');
    });
  });

  // Toggle Active
  $(document).on('change', '.btn-toggle-gallery-status', function () {
    const id = $(this).attr('data-id') || $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleGalleryStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update status');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Gallery Item
  $(document).on('click', '.btn-delete', function (e) {
    e.preventDefault();
    const id = $(this).attr('data-id') || $(this).data('id');
    if (!id) return;

    window.App.confirm(
      'Delete Image?',
      'Are you sure you want to permanently delete this photo from the clinic gallery?',
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteGalleryItem(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Image deleted successfully');
              loadGallery();
            }
          })
          .fail(function (xhr) {
            const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error deleting image';
            window.App.toast('error', msg);
          });
      }
    });
  });

  // Filters
  $('#filterGalleryCategory, #filterGalleryTreatment').on('change', loadGallery);
  $('#btnReloadGallery').on('click', loadGallery);

  // Check URL params for ?action=new
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'new') {
    setTimeout(function () {
      $('#btnOpenAddGalleryModal').trigger('click');
    }, 200);
  }

  // Initialize
  loadTreatmentsDropdown().always(function () {
    loadGallery();
  });
});
