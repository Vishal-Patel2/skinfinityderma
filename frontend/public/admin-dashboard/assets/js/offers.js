/**
 * Skinfinity Derma Admin Dashboard
 * Dynamic Monthly Offers Controller (Best Offers this Month)
 * Simple Table Format: S.N., Image, Title, Status, Action
 */

$(document).ready(function () {
  'use strict';

  let allOffers = [];
  let currentFilterCategory = 'All';
  let currentSearchQuery = '';
  let dataTable = null;

  // Initialize
  init();

  function init() {
    loadOffers();
    setupEventListeners();
    setupModalSimulation();
  }

  // Smart image resolver to support all server setups (XAMPP /skinfinityderma, Express, Render, Next, direct)
  function resolveImageUrl(url) {
    if (!url) return 'assets/img/placeholder.svg';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    // If opened via local XAMPP path like /skinfinityderma/admin/
    if (window.location.pathname.includes('/skinfinityderma/admin/')) {
      if (url.startsWith('/images/')) {
        return '../frontend/public' + url;
      }
      if (url.startsWith('/uploads/')) {
        return '../backend' + url;
      }
    }
    return url;
  }

  function setupEventListeners() {
    // Refresh button
    $('#btn-refresh-offers').on('click', function () {
      const $btn = $(this);
      $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Refreshing...');
      loadOffers().finally(() => {
        $btn.prop('disabled', false).html('<i class="bi bi-arrow-clockwise me-1"></i> Refresh');
      });
    });

    // Add Offer button
    $('#btn-add-offer').on('click', function () {
      openOfferModal();
    });

    // Category filter pills
    $('#category-filter-group').on('click', '.filter-pill-btn', function () {
      $('.filter-pill-btn').removeClass('active');
      $(this).addClass('active');
      currentFilterCategory = $(this).data('category');
      renderOffersTable();
    });

    // Quick Search Input
    $('#quick-search-input').on('input', function () {
      currentSearchQuery = $(this).val().toLowerCase().trim();
      if (currentSearchQuery) {
        $('#btn-clear-search').removeClass('d-none');
      } else {
        $('#btn-clear-search').addClass('d-none');
      }
      if (dataTable) {
        dataTable.search(currentSearchQuery).draw();
      }
    });

    $('#btn-clear-search').on('click', function () {
      $('#quick-search-input').val('');
      currentSearchQuery = '';
      $(this).addClass('d-none');
      if (dataTable) {
        dataTable.search('').draw();
      }
    });

    // Preset Image Selector in Modal
    $('#preset-image-selector').on('change', function () {
      const val = $(this).val();
      if (val) {
        $('#offer-image-url').val(val).trigger('input');
      }
    });

    // Preset Badge Chips in Modal
    $('.chip-badge-preset').on('click', function () {
      const text = $(this).data('preset');
      $('#offer-badge').val(text).trigger('input');
    });

    // Dropzone upload events with reliable delegation
    $(document).on('click', '#offer-dropzone', function (e) {
      if ($(e.target).is('#offer-image-file')) return;
      $('#offer-image-file').trigger('click');
    });

    $(document).on('dragover dragenter', '#offer-dropzone', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $('#offer-dropzone').addClass('dragover');
    });

    $(document).on('dragleave dragend', '#offer-dropzone', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $('#offer-dropzone').removeClass('dragover');
    });

    $(document).on('drop', '#offer-dropzone', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $('#offer-dropzone').removeClass('dragover');
      const files = e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files;
      if (files && files.length > 0) {
        handleImageUpload(files[0]);
      }
    });

    $(document).on('change', '#offer-image-file', function () {
      if (this.files && this.files.length > 0) {
        handleImageUpload(this.files[0]);
      }
    });

    // Form submission
    $('#offerForm').on('submit', function (e) {
      e.preventDefault();
      saveOffer();
    });

    // Table click delegation (Single action column buttons)
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

    $('#offers-table-body').on('click', '.offer-thumbnail-wrapper', function () {
      const src = $(this).find('img').attr('src');
      const title = $(this).data('title');
      $('#zoom-image').attr('src', src);
      $('#zoom-title').text(title || '');
      $('#imagePreviewModal').modal('show');
    });
  }

  // Setup real-time card simulation inside the modal
  function setupModalSimulation() {
    $('#offer-title').on('input', function () {
      $('#sim-title').text($(this).val().trim() || 'Offer Title');
    });

    $('#offer-category').on('change', function () {
      const cat = $(this).val();
      $('#sim-category').text(cat);
      updateSimCategoryColor(cat);
    });

    $('#offer-badge').on('input', function () {
      $('#sim-badge').text($(this).val().trim() || 'Special Offer');
    });

    $('#offer-description').on('input', function () {
      $('#sim-description').text($(this).val().trim() || 'Description of treatment package and inclusions...');
    });

    $('#offer-link-text').on('input', function () {
      $('#sim-btn-text').text($(this).val().trim() || 'Claim Offer');
    });

    $('#offer-image-url').on('input', function () {
      const raw = $(this).val().trim();
      const resolved = resolveImageUrl(raw);
      $('#sim-image').attr('src', resolved);
    });
  }

  function updateSimCategoryColor(cat) {
    const $cat = $('#sim-category');
    $cat.removeClass('bg-warning bg-primary bg-danger bg-success bg-purple text-dark text-white');
    switch (cat) {
      case 'Hair':
        $cat.addClass('bg-primary text-white');
        break;
      case 'Laser':
        $cat.addClass('bg-danger text-white');
        break;
      case 'Body':
        $cat.addClass('bg-success text-white');
        break;
      case 'Bridal':
        $cat.addClass('bg-warning text-dark');
        break;
      default:
        $cat.addClass('bg-warning text-dark');
    }
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

  // Update Metric Counters & Category Badges
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

    // Exact count with no awkward inner spaces: All 19, Skin 6, etc.
    $('#cat-count-all').text(total);
    $('#cat-count-skin').text(catCounts.Skin);
    $('#cat-count-hair').text(catCounts.Hair);
    $('#cat-count-laser').text(catCounts.Laser);
    $('#cat-count-body').text(catCounts.Body);
    $('#cat-count-bridal').text(catCounts.Bridal);
  }

  // Filtered array based on current category and search
  function getFilteredOffers() {
    return allOffers.filter((o) => {
      const matchesCat = currentFilterCategory === 'All'
        || (o.category || 'Skin').toLowerCase() === currentFilterCategory.toLowerCase();

      if (!matchesCat) return false;

      if (!currentSearchQuery) return true;

      const titleMatch = (o.title || '').toLowerCase().includes(currentSearchQuery);
      const descMatch = (o.description || '').toLowerCase().includes(currentSearchQuery);
      const badgeMatch = (o.badge || '').toLowerCase().includes(currentSearchQuery);
      const catMatch = (o.category || '').toLowerCase().includes(currentSearchQuery);

      return titleMatch || descMatch || badgeMatch || catMatch;
    });
  }

  // Render Table: EXACT 5 COLUMNS (S.N., Image, Title, Status, Action)
  function renderOffersTable() {
    if (dataTable) {
      dataTable.destroy();
      dataTable = null;
    }

    const filtered = getFilteredOffers();
    const $tbody = $('#offers-table-body');
    $tbody.empty();

    if (filtered.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="5" class="text-center py-5 text-muted">
            <i class="bi bi-tag fs-1 d-block mb-2 text-slate-300"></i>
            <div class="fw-semibold text-slate-600">No offers found</div>
            <div class="small">Try changing category or clearing your search.</div>
          </td>
        </tr>
      `);
      return;
    }

    filtered.forEach((offer, idx) => {
      const resolvedImg = resolveImageUrl(offer.image);
      const catClass = getCategoryBadgeClass(offer.category);

      const html = `
        <tr data-id="${offer.id}">
          <td class="text-center fw-bold text-slate-700">${idx + 1}</td>
          <td>
            <div class="offer-thumbnail-wrapper" data-title="${escapeHtml(offer.title)}">
              <img src="${resolvedImg}" alt="${escapeHtml(offer.title)}" onerror="this.onerror=null; this.src='assets/img/placeholder.svg';">
              <div class="zoom-overlay">
                <i class="bi bi-zoom-in"></i>
              </div>
            </div>
          </td>
          <td>
            <div class="fw-bold text-slate-900 mb-1" style="font-size: 0.95rem;">
              ${escapeHtml(offer.title)}
            </div>
            <div class="d-flex align-items-center flex-wrap gap-2">
              <span class="cat-badge ${catClass}">
                ${escapeHtml(offer.category || 'Skin')}
              </span>
              ${offer.badge ? `<span class="badge bg-light text-slate-700 border" style="font-size: 0.725rem; font-weight: 600;">${escapeHtml(offer.badge)}</span>` : ''}
            </div>
          </td>
          <td class="text-center">
            <div class="form-check form-switch d-inline-block">
              <input class="form-check-input offer-status-toggle" type="checkbox" data-id="${offer.id}" ${offer.isActive ? 'checked' : ''} title="Toggle active status">
            </div>
          </td>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-primary btn-edit-offer" data-id="${offer.id}" title="Edit Offer">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete-offer" data-id="${offer.id}" title="Delete Offer">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(html);
    });

    // Initialize DataTable on the 5 columns
    dataTable = $('#offers-table').DataTable({
      pageLength: 25,
      dom: '<"d-none"f>rt<"d-flex justify-content-between align-items-center p-3"ip>',
      language: {
        info: 'Showing _START_ to _END_ of _TOTAL_ offers',
        paginate: {
          previous: '<i class="bi bi-chevron-left"></i>',
          next: '<i class="bi bi-chevron-right"></i>',
        },
      },
      columnDefs: [
        { orderable: false, targets: [1, 3, 4] },
        { className: 'text-center', targets: [0, 3, 4] }
      ],
    });
  }

  function getCategoryBadgeClass(cat) {
    switch (cat) {
      case 'Hair': return 'cat-badge-hair';
      case 'Laser': return 'cat-badge-laser';
      case 'Body': return 'cat-badge-body';
      case 'Bridal': return 'cat-badge-bridal';
      default: return 'cat-badge-skin';
    }
  }

  // Open Add / Edit Modal (Order field removed from form)
  function openOfferModal(offer = null) {
    const $form = $('#offerForm');
    $form[0].reset();

    if (offer) {
      $('#modal-title-text').text('Edit Offer Details');
      $('#offerModalLabel i').attr('class', 'bi bi-pencil-square text-teal');
      $('#offer-id').val(offer.id);
      $('#offer-title').val(offer.title || '').trigger('input');
      $('#offer-category').val(offer.category || 'Skin').trigger('change');
      $('#offer-badge').val(offer.badge || 'Special Offer').trigger('input');
      $('#offer-status').prop('checked', Boolean(offer.isActive));
      $('#offer-image-url').val(offer.image || '').trigger('input');
      $('#offer-description').val(offer.description || '').trigger('input');
      $('#offer-link-text').val(offer.linkText || 'Claim Offer').trigger('input');
      $('#offer-slug').val(offer.slug || '/contact-us#appointment_form');
      $('#preset-image-selector').val(offer.image || '');
    } else {
      $('#modal-title-text').text('Add New Offer');
      $('#offerModalLabel i').attr('class', 'bi bi-tag-fill text-teal');
      $('#offer-id').val('');
      const defaultCat = currentFilterCategory !== 'All' ? currentFilterCategory : 'Skin';
      $('#offer-category').val(defaultCat).trigger('change');
      $('#offer-badge').val('Limited Period').trigger('input');
      $('#offer-status').prop('checked', true);
      $('#offer-title').val('').trigger('input');
      $('#offer-description').val('').trigger('input');
      $('#offer-link-text').val('Claim Offer').trigger('input');
      $('#offer-slug').val('/contact-us#appointment_form');
      $('#offer-image-url').val('/images/offers/skinfinity-offer-1.png').trigger('input');
      $('#preset-image-selector').val('/images/offers/skinfinity-offer-1.png');
    }

    $('#offerModal').modal('show');
  }

  // Handle custom image file upload
  async function handleImageUpload(file) {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      Swal.fire('Invalid File', 'Please upload a valid image file (PNG, JPG, WEBP).', 'warning');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire('File Too Large', 'Maximum image size is 10MB.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('file', file);
    formData.append('folder', 'offers');

    const defaultDropzoneHtml = `
      <i class="bi bi-cloud-arrow-up text-teal fs-2 d-block mb-1"></i>
      <div class="fw-semibold text-slate-800 small">Upload Fresh Custom Banner</div>
      <div class="text-muted" style="font-size: 11px;">Drag &amp; drop file here or click to browse (PNG, JPG, WEBP)</div>
    `;

    const $inner = $('#offer-dropzone-inner').length ? $('#offer-dropzone-inner') : $('#offer-dropzone');
    $inner.html('<div class="spinner-border spinner-border-sm text-teal me-2"></div> <span class="small text-slate-700">Uploading banner image...</span>');

    try {
      let res;
      if (window.API && typeof window.API.uploadFile === 'function') {
        res = await window.API.uploadFile(formData, 'offers');
      } else if (window.API && typeof window.API.uploadImage === 'function') {
        res = await window.API.uploadImage(file, 'offers');
      } else {
        const token = localStorage.getItem('token') || (window.API && window.API.getToken && window.API.getToken());
        const resp = await fetch('/api/upload?folder=offers', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData,
        });
        res = await resp.json();
      }

      $inner.html(defaultDropzoneHtml);
      $('#offer-image-file').val('');

      const uploadedUrl = res?.url || res?.fileUrl || res?.data?.file_url || res?.data?.url || res?.absoluteUrl;
      if (uploadedUrl) {
        $('#offer-image-url').val(uploadedUrl).trigger('input');
        $('#preset-image-selector').val('');
        Swal.fire({
          icon: 'success',
          title: 'Banner Uploaded!',
          text: 'Custom banner uploaded and preview updated.',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(res?.message || 'Server did not return a valid image URL');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      $inner.html(defaultDropzoneHtml);
      $('#offer-image-file').val('');
      Swal.fire('Upload Failed', err.message || err.statusText || 'Could not upload image to server.', 'error');
    }
  }

  // Save Offer (Create / Update without Display Order input in form)
  async function saveOffer() {
    const id = $('#offer-id').val();
    const existingOffer = id ? allOffers.find((o) => String(o.id) === String(id)) : null;

    // Auto-calculate order if new
    let finalOrder = undefined;
    if (existingOffer) {
      finalOrder = existingOffer.displayOrder;
    } else {
      finalOrder = allOffers.length > 0 ? Math.max(...allOffers.map((o) => o.displayOrder || 0)) + 1 : 1;
    }

    const payload = {
      title: $('#offer-title').val().trim(),
      category: $('#offer-category').val(),
      badge: $('#offer-badge').val().trim() || 'Special Offer',
      displayOrder: finalOrder,
      isActive: $('#offer-status').is(':checked') ? 1 : 0,
      image: $('#offer-image-url').val().trim(),
      description: $('#offer-description').val().trim(),
      linkText: $('#offer-link-text').val().trim() || 'Claim Offer',
      slug: $('#offer-slug').val().trim() || '/contact-us#appointment_form',
    };

    if (!payload.title) {
      Swal.fire('Required Field', 'Please provide an offer title.', 'warning');
      return;
    }
    if (!payload.image) {
      Swal.fire('Required Field', 'Please choose or upload a banner image.', 'warning');
      return;
    }

    try {
      Swal.fire({
        title: 'Saving...',
        text: 'Updating database in real time.',
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
          title: 'Offer Saved!',
          text: id ? 'Offer updated successfully.' : 'New offer added to live homepage carousel.',
          timer: 1600,
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

  // Delete Offer
  async function deleteOffer(id) {
    const offer = allOffers.find((o) => String(o.id) === String(id));
    const title = offer ? offer.title : 'this offer';

    const result = await Swal.fire({
      title: 'Delete Offer?',
      html: `Are you sure you want to remove <strong>${escapeHtml(title)}</strong> from the homepage carousel?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
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
            timer: 1400,
            showConfirmButton: false,
          });
          loadOffers();
        } else {
          throw new Error(res.message || 'Failed to delete offer');
        }
      } catch (err) {
        console.error('Delete offer error:', err);
        Swal.fire('Error', err.message || 'Could not delete offer.', 'error');
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