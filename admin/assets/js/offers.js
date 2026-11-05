/**
 * Skinfinity Derma Admin Dashboard
 * Dynamic Monthly Offers Controller (Best Offers this Month)
 */

$(document).ready(function () {
  'use strict';

  let allOffers = [];
  let currentFilterCategory = 'All';
  let dataTable = null;

  // Initialize
  init();

  function init() {
    loadOffers();
    setupEventListeners();
  }

  function setupEventListeners() {
    // Refresh button
    $('#btn-refresh-offers').on('click', function () {
      loadOffers();
    });

    // Add Offer button
    $('#btn-add-offer').on('click', function () {
      openOfferModal();
    });

    // Category filter pills
    $('#category-filter-group').on('click', '.category-filter-btn', function () {
      $('.category-filter-btn').removeClass('active');
      $(this).addClass('active');
      currentFilterCategory = $(this).data('category');
      renderOffersTable();
    });

    // Dropzone click & drag events
    const $dropzone = $('#offer-dropzone');
    const $fileInput = $('#offer-image-file');

    $dropzone.on('click', function () {
      $fileInput.trigger('click');
    });

    $dropzone.on('dragover dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.addClass('border-teal bg-light');
    });

    $dropzone.on('dragleave dragend', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.removeClass('border-teal bg-light');
    });

    $dropzone.on('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.removeClass('border-teal bg-light');
      const files = e.originalEvent.dataTransfer.files;
      if (files.length > 0) {
        handleImageUpload(files[0]);
      }
    });

    $fileInput.on('change', function () {
      if (this.files && this.files.length > 0) {
        handleImageUpload(this.files[0]);
      }
    });

    $('#offer-image-url').on('input', function () {
      const url = $(this).val().trim();
      updateImagePreview(url);
    });

    // Form submission
    $('#offerForm').on('submit', function (e) {
      e.preventDefault();
      saveOffer();
    });

    // Table click delegation for edit, delete, toggle, zoom, and reordering
    $('#offers-table-body').on('click', '.btn-edit-offer', function () {
      const id = $(this).data('id');
      const offer = allOffers.find((o) => String(o.id) === String(id));
      if (offer) openOfferModal(offer);
    });

    $('#offers-table-body').on('click', '.btn-delete-offer', function () {
      const id = $(this).data('id');
      deleteOffer(id);
    });

    $('#offers-table-body').on('change', '.offer-status-toggle', function () {
      const id = $(this).data('id');
      toggleOfferStatus(id, this);
    });

    $('#offers-table-body').on('click', '.offer-thumb-preview', function () {
      const src = $(this).attr('src');
      const title = $(this).data('title');
      $('#zoom-image').attr('src', src);
      $('#zoom-title').text(title || '');
      $('#imagePreviewModal').modal('show');
    });

    $('#offers-table-body').on('click', '.btn-move-up', function () {
      const id = $(this).data('id');
      moveOfferOrder(id, -1);
    });

    $('#offers-table-body').on('click', '.btn-move-down', function () {
      const id = $(this).data('id');
      moveOfferOrder(id, 1);
    });
  }

  // Load offers from API
  async function loadOffers() {
    try {
      const res = await API.getOffers();
      if (res && res.success && Array.isArray(res.data)) {
        allOffers = res.data;
        updateMetrics();
        renderOffersTable();
      } else {
        Swal.fire('Notice', 'Unable to retrieve offers from server.', 'info');
      }
    } catch (err) {
      console.error('Error loading offers:', err);
      Swal.fire('Error', err.message || 'Failed to load offers.', 'error');
    }
  }

  // Update Stats & Category Counters
  function updateMetrics() {
    const total = allOffers.length;
    const active = allOffers.filter((o) => o.isActive).length;
    const inactive = total - active;

    const catCounts = {
      Skin: 0,
      Hair: 0,
      Laser: 0,
      Body: 0,
      Bridal: 0,
    };

    allOffers.forEach((o) => {
      const cat = o.category || 'Skin';
      if (catCounts[cat] !== undefined) {
        catCounts[cat]++;
      }
    });

    $('#stat-total-offers').text(total);
    $('#stat-active-offers').text(active);
    $('#stat-inactive-offers').text(inactive);

    $('#cat-count-all').text(total);
    $('#cat-count-skin').text(catCounts.Skin);
    $('#cat-count-hair').text(catCounts.Hair);
    $('#cat-count-laser').text(catCounts.Laser);
    $('#cat-count-body').text(catCounts.Body);
    $('#cat-count-bridal').text(catCounts.Bridal);
  }

  // Render Table
  function renderOffersTable() {
    if (dataTable) {
      dataTable.destroy();
      dataTable = null;
    }

    const filtered = currentFilterCategory === 'All'
      ? allOffers
      : allOffers.filter((o) => (o.category || 'Skin').toLowerCase() === currentFilterCategory.toLowerCase());

    const $tbody = $('#offers-table-body');
    $tbody.empty();

    if (filtered.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="8" class="text-center py-5 text-muted">
            <i class="bi bi-tag fs-2 d-block mb-2 text-secondary"></i>
            No offers found for category: <strong>${currentFilterCategory}</strong>
          </td>
        </tr>
      `);
      return;
    }

    filtered.forEach((offer, idx) => {
      const rowNum = idx + 1;
      const imageUrl = offer.image || '/images/offers/festive-package.png';
      const badgeClass = getBadgeColor(offer.category);

      const html = `
        <tr data-id="${offer.id}">
          <td class="fw-bold text-slate-600">
            <div class="d-flex align-items-center gap-1">
              <span>#${offer.displayOrder || rowNum}</span>
              <div class="btn-group-vertical btn-group-sm ms-1">
                <button type="button" class="btn btn-link p-0 text-muted btn-move-up" data-id="${offer.id}" title="Move Up">
                  <i class="bi bi-caret-up-fill" style="font-size: 11px;"></i>
                </button>
                <button type="button" class="btn btn-link p-0 text-muted btn-move-down" data-id="${offer.id}" title="Move Down">
                  <i class="bi bi-caret-down-fill" style="font-size: 11px;"></i>
                </button>
              </div>
            </div>
          </td>
          <td>
            <img src="${imageUrl}" alt="${escapeHtml(offer.title)}" class="offer-thumb-preview" data-title="${escapeHtml(offer.title)}" onerror="this.src='/images/offers/festive-package.png'">
          </td>
          <td>
            <div class="fw-bold text-slate-800">${escapeHtml(offer.title)}</div>
            <span class="badge ${badgeClass} text-uppercase mt-1" style="font-size: 10px;">
              ${offer.category || 'Skin'}
            </span>
          </td>
          <td>
            <span class="badge bg-light text-dark border px-2.5 py-1 fw-bold" style="font-size: 11px;">
              <i class="bi bi-stars text-warning me-1"></i>${escapeHtml(offer.badge || 'Offer')}
            </span>
          </td>
          <td>
            <div class="text-muted small text-truncate" style="max-width: 250px;" title="${escapeHtml(offer.description || '')}">
              ${escapeHtml(offer.description || '—')}
            </div>
          </td>
          <td>
            <span class="badge bg-teal bg-opacity-10 text-teal border border-teal border-opacity-25 py-1 px-2 font-monospace" style="font-size: 11px;">
              ${escapeHtml(offer.linkText || 'Claim Offer')}
            </span>
          </td>
          <td class="text-center">
            <div class="form-check form-switch d-inline-block">
              <input class="form-check-input offer-status-toggle" type="checkbox" data-id="${offer.id}" ${offer.isActive ? 'checked' : ''}>
            </div>
          </td>
          <td class="text-end">
            <button type="button" class="btn btn-sm btn-light border btn-edit-offer me-1" data-id="${offer.id}" title="Edit Offer">
              <i class="bi bi-pencil-square text-primary"></i>
            </button>
            <button type="button" class="btn btn-sm btn-light border btn-delete-offer" data-id="${offer.id}" title="Delete Offer">
              <i class="bi bi-trash text-danger"></i>
            </button>
          </td>
        </tr>
      `;
      $tbody.append(html);
    });

    // Initialize DataTable
    dataTable = $('#offers-table').DataTable({
      order: [[0, 'asc']],
      pageLength: 25,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search offers...',
      },
      columnDefs: [
        { orderable: false, targets: [1, 6, 7] },
      ],
    });
  }

  function getBadgeColor(cat) {
    switch (cat) {
      case 'Hair': return 'bg-purple text-white';
      case 'Laser': return 'bg-danger text-white';
      case 'Body': return 'bg-success text-white';
      case 'Bridal': return 'bg-pink text-white';
      default: return 'bg-primary text-white';
    }
  }

  // Open Add/Edit Modal
  function openOfferModal(offer = null) {
    const $form = $('#offerForm');
    $form[0].reset();

    if (offer) {
      $('#offerModalLabel').html('<i class="bi bi-pencil-square text-teal me-2"></i>Edit Offer');
      $('#offer-id').val(offer.id);
      $('#offer-title').val(offer.title || '');
      $('#offer-category').val(offer.category || 'Skin');
      $('#offer-badge').val(offer.badge || 'Special Offer');
      $('#offer-order').val(offer.displayOrder || 1);
      $('#offer-status').prop('checked', Boolean(offer.isActive));
      $('#offer-image-url').val(offer.image || '');
      $('#offer-description').val(offer.description || '');
      $('#offer-link-text').val(offer.linkText || 'Claim Offer');
      $('#offer-slug').val(offer.slug || '/contact-us#appointment_form');
      updateImagePreview(offer.image);
    } else {
      $('#offerModalLabel').html('<i class="bi bi-stars text-warning me-2"></i>Add New Offer');
      $('#offer-id').val('');
      $('#offer-category').val(currentFilterCategory !== 'All' ? currentFilterCategory : 'Skin');
      $('#offer-badge').val('Special Offer');
      $('#offer-order').val(allOffers.length + 1);
      $('#offer-status').prop('checked', true);
      $('#offer-link-text').val('Claim Offer');
      $('#offer-slug').val('/contact-us#appointment_form');
      updateImagePreview('');
    }

    $('#offerModal').modal('show');
  }

  // Handle direct image file upload
  async function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
      Swal.fire('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP).', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait while the image is uploaded to server.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await API.uploadImage(formData);
      Swal.close();

      if (res && res.success && res.data && res.data.url) {
        $('#offer-image-url').val(res.data.url);
        updateImagePreview(res.data.url);
        Swal.fire('Uploaded!', 'Offer image uploaded successfully.', 'success');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      Swal.fire('Upload Failed', err.message || 'Could not upload image.', 'error');
    }
  }

  function updateImagePreview(url) {
    if (url) {
      $('#offer-image-preview').attr('src', url);
      $('#offer-image-preview-container').removeClass('d-none');
    } else {
      $('#offer-image-preview-container').addClass('d-none');
    }
  }

  // Save Offer (Create / Update)
  async function saveOffer() {
    const id = $('#offer-id').val();
    const payload = {
      title: $('#offer-title').val().trim(),
      category: $('#offer-category').val(),
      badge: $('#offer-badge').val().trim() || 'Special Offer',
      displayOrder: parseInt($('#offer-order').val(), 10) || 1,
      isActive: $('#offer-status').is(':checked') ? 1 : 0,
      image: $('#offer-image-url').val().trim(),
      description: $('#offer-description').val().trim(),
      linkText: $('#offer-link-text').val().trim() || 'Claim Offer',
      slug: $('#offer-slug').val().trim() || '/contact-us#appointment_form',
    };

    if (!payload.title) {
      Swal.fire('Required Field', 'Please enter an offer title.', 'warning');
      return;
    }
    if (!payload.image) {
      Swal.fire('Required Field', 'Please provide or upload an offer banner image.', 'warning');
      return;
    }

    try {
      Swal.fire({
        title: 'Saving...',
        text: 'Saving offer details to database.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let res;
      if (id) {
        res = await API.updateOffer(id, payload);
      } else {
        res = await API.createOffer(payload);
      }

      Swal.close();
      if (res && res.success) {
        $('#offerModal').modal('hide');
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: id ? 'Offer updated successfully.' : 'New offer added successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        loadOffers();
      } else {
        throw new Error(res.message || 'Save failed');
      }
    } catch (err) {
      console.error('Save offer error:', err);
      Swal.fire('Error', err.message || 'Failed to save offer.', 'error');
    }
  }

  // Toggle Offer Status
  async function toggleOfferStatus(id, switchEl) {
    try {
      const res = await API.toggleOfferStatus(id);
      if (res && res.success) {
        const item = allOffers.find((o) => String(o.id) === String(id));
        if (item) item.isActive = res.isActive;
        updateMetrics();
        const toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
        toast.fire({
          icon: 'success',
          title: res.message || 'Status updated',
        });
      } else {
        throw new Error(res.message || 'Failed to toggle status');
      }
    } catch (err) {
      $(switchEl).prop('checked', !$(switchEl).prop('checked'));
      Swal.fire('Error', err.message || 'Failed to update offer status.', 'error');
    }
  }

  // Move Order Up or Down
  async function moveOfferOrder(id, delta) {
    const idx = allOffers.findIndex((o) => String(o.id) === String(id));
    if (idx === -1) return;
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= allOffers.length) return;

    // Swap items in array
    const temp = allOffers[idx];
    allOffers[idx] = allOffers[targetIdx];
    allOffers[targetIdx] = temp;

    const newOrder = allOffers.map((o) => o.id);

    try {
      renderOffersTable();
      await API.reorderOffers(newOrder);
      loadOffers();
    } catch (err) {
      console.error('Reorder error:', err);
      Swal.fire('Error', 'Failed to save new order.', 'error');
      loadOffers();
    }
  }

  // Delete Offer
  async function deleteOffer(id) {
    const item = allOffers.find((o) => String(o.id) === String(id));
    const title = item ? item.title : 'this offer';

    const result = await Swal.fire({
      title: 'Delete Offer?',
      text: `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });
        const res = await API.deleteOffer(id);
        Swal.close();
        if (res && res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Offer has been removed.',
            timer: 1500,
            showConfirmButton: false,
          });
          loadOffers();
        } else {
          throw new Error(res.message || 'Delete failed');
        }
      } catch (err) {
        console.error('Delete error:', err);
        Swal.fire('Error', err.message || 'Failed to delete offer.', 'error');
      }
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
