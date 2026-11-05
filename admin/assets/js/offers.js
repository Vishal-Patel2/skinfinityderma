/**
 * Skinfinity Derma Admin Dashboard
 * Dynamic Monthly Offers Controller (Best Offers this Month)
 * Full-featured: Table View, Live Card Simulation View, Image Lightbox, Real-Time Sync
 */

$(document).ready(function () {
  'use strict';

  let allOffers = [];
  let currentFilterCategory = 'All';
  let currentSearchQuery = '';
  let currentViewMode = 'table'; // 'table' | 'cards'
  let dataTable = null;

  // Initialize
  init();

  function init() {
    loadOffers();
    setupEventListeners();
    setupModalSimulation();
  }

  // Smart image resolver to support all server setups (XAMPP /skinfinityderma, Express, Next, direct)
  function resolveImageUrl(url) {
    if (!url) return 'assets/img/placeholder.svg';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    // If opened via XAMPP path like /skinfinityderma/admin/
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

    // View Switcher (Table vs Cards)
    $('#btn-view-table').on('click', function () {
      $(this).addClass('active');
      $('#btn-view-cards').removeClass('active');
      currentViewMode = 'table';
      $('#view-mode-table').removeClass('d-none');
      $('#view-mode-cards').addClass('d-none');
    });

    $('#btn-view-cards').on('click', function () {
      $(this).addClass('active');
      $('#btn-view-table').removeClass('active');
      currentViewMode = 'cards';
      $('#view-mode-table').addClass('d-none');
      $('#view-mode-cards').removeClass('d-none');
      renderCardsGrid();
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
      renderCurrentView();
    });

    // Quick Search Input
    $('#quick-search-input').on('input', function () {
      currentSearchQuery = $(this).val().toLowerCase().trim();
      if (currentSearchQuery) {
        $('#btn-clear-search').removeClass('d-none');
      } else {
        $('#btn-clear-search').addClass('d-none');
      }
      if (currentViewMode === 'table' && dataTable) {
        dataTable.search(currentSearchQuery).draw();
      } else {
        renderCardsGrid();
      }
    });

    $('#btn-clear-search').on('click', function () {
      $('#quick-search-input').val('');
      currentSearchQuery = '';
      $(this).addClass('d-none');
      if (currentViewMode === 'table' && dataTable) {
        dataTable.search('').draw();
      } else {
        renderCardsGrid();
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

    // Dropzone upload events
    const $dropzone = $('#offer-dropzone');
    const $fileInput = $('#offer-image-file');

    $dropzone.on('click', function () {
      $fileInput.trigger('click');
    });

    $dropzone.on('dragover dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.addClass('dragover');
    });

    $dropzone.on('dragleave dragend', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.removeClass('dragover');
    });

    $dropzone.on('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.removeClass('dragover');
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

    // Form submission
    $('#offerForm').on('submit', function (e) {
      e.preventDefault();
      saveOffer();
    });

    // Table click delegation
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

    $('#offers-table-body').on('click', '.order-arrow-btn.up', function () {
      const id = $(this).data('id');
      moveOfferOrder(id, -1);
    });

    $('#offers-table-body').on('click', '.order-arrow-btn.down', function () {
      const id = $(this).data('id');
      moveOfferOrder(id, 1);
    });

    // Cards Grid Click Delegation
    $('#offers-cards-grid').on('click', '.btn-edit-card', function () {
      const id = $(this).data('id');
      const offer = allOffers.find((o) => String(o.id) === String(id));
      if (offer) openOfferModal(offer);
    });

    $('#offers-cards-grid').on('click', '.btn-delete-card', function () {
      const id = $(this).data('id');
      deleteOffer(id);
    });

    $('#offers-cards-grid').on('change', '.card-status-toggle', function () {
      const id = $(this).data('id');
      toggleOfferStatus(id, this);
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
        $cat.addClass('bg-purple text-white');
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
        $cat.addClass('bg-primary text-white');
    }
  }

  // Load offers from API
  async function loadOffers() {
    try {
      const res = await API.getOffers();
      if (res && res.success && Array.isArray(res.data)) {
        allOffers = res.data;
        updateMetrics();
        renderCurrentView();
      } else {
        Swal.fire('Notice', 'Unable to retrieve offers from server.', 'info');
      }
    } catch (err) {
      console.error('Error loading offers:', err);
      Swal.fire('Error', err.message || 'Failed to load offers.', 'error');
    }
  }

  // Update Metric Counters & Badges
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

    // Exact count with no awkward inner spaces
    $('#cat-count-all').text(total);
    $('#cat-count-skin').text(catCounts.Skin);
    $('#cat-count-hair').text(catCounts.Hair);
    $('#cat-count-laser').text(catCounts.Laser);
    $('#cat-count-body').text(catCounts.Body);
    $('#cat-count-bridal').text(catCounts.Bridal);
  }

  function renderCurrentView() {
    if (currentViewMode === 'table') {
      renderOffersTable();
    } else {
      renderCardsGrid();
    }
  }

  // Get filtered items array based on current category and search query
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

  // Render Table View
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
          <td colspan="8" class="text-center py-5 text-muted">
            <i class="bi bi-tag fs-1 d-block mb-2 text-slate-300"></i>
            <div class="fw-semibold text-slate-600">No offers found</div>
            <div class="small">Try changing category or clearing your search.</div>
          </td>
        </tr>
      `);
      return;
    }

    filtered.forEach((offer, idx) => {
      const orderNum = offer.displayOrder !== undefined ? offer.displayOrder : idx + 1;
      const resolvedImg = resolveImageUrl(offer.image);
      const catClass = getCategoryBadgeClass(offer.category);

      const html = `
        <tr data-id="${offer.id}">
          <td>
            <div class="order-handle">
              <span class="order-badge">#${orderNum < 10 ? '0' + orderNum : orderNum}</span>
              <div class="order-arrows">
                <button type="button" class="order-arrow-btn up" data-id="${offer.id}" title="Move Up">
                  <i class="bi bi-caret-up-fill"></i>
                </button>
                <button type="button" class="order-arrow-btn down" data-id="${offer.id}" title="Move Down">
                  <i class="bi bi-caret-down-fill"></i>
                </button>
              </div>
            </div>
          </td>
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
            <span class="cat-badge ${catClass}">
              <i class="bi bi-dot" style="font-size: 1.2rem; margin: -5px 0;"></i>
              ${offer.category || 'Skin'}
            </span>
          </td>
          <td>
            <span class="sparkle-badge">
              <i class="bi bi-stars text-warning"></i>
              <span>${escapeHtml(offer.badge || 'Special Offer')}</span>
            </span>
          </td>
          <td>
            <div class="text-slate-600 small line-clamp-2" style="max-width: 280px;" title="${escapeHtml(offer.description || '')}">
              ${escapeHtml(offer.description || '—')}
            </div>
          </td>
          <td>
            <a href="${escapeHtml(offer.slug || '/contact-us#appointment_form')}" target="_blank" class="cta-pill" title="Target: ${escapeHtml(offer.slug || '/contact-us#appointment_form')}">
              <span>${escapeHtml(offer.linkText || 'Claim Offer')}</span>
              <i class="bi bi-arrow-up-right" style="font-size: 10px;"></i>
            </a>
          </td>
          <td class="text-center">
            <div class="form-check form-switch d-inline-block">
              <input class="form-check-input offer-status-toggle" type="checkbox" data-id="${offer.id}" ${offer.isActive ? 'checked' : ''} title="Toggle active/inactive status">
            </div>
          </td>
          <td class="text-end">
            <div class="d-flex align-items-center justify-content-end gap-1.5">
              <button type="button" class="action-btn btn-edit-offer" data-id="${offer.id}" title="Edit Offer Details">
                <i class="bi bi-pencil-fill text-primary"></i>
              </button>
              <button type="button" class="action-btn action-btn-danger btn-delete-offer" data-id="${offer.id}" title="Delete Offer">
                <i class="bi bi-trash-fill text-danger"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(html);
    });

    // Initialize DataTable
    dataTable = $('#offers-table').DataTable({
      order: [[0, 'asc']],
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
        { orderable: false, targets: [1, 6, 7] },
      ],
    });
  }

  // Render Visual Cards Grid Preview Mode (Exact frontend look)
  function renderCardsGrid() {
    const filtered = getFilteredOffers();
    const $grid = $('#offers-cards-grid');
    $grid.empty();

    if (filtered.length === 0) {
      $grid.html(`
        <div class="col-12 text-center py-5">
          <i class="bi bi-grid fs-1 text-slate-300 d-block mb-2"></i>
          <h5 class="text-slate-600 fw-bold">No offers found</h5>
          <p class="text-muted small">Try switching categories or clear search.</p>
        </div>
      `);
      return;
    }

    filtered.forEach((offer) => {
      const resolvedImg = resolveImageUrl(offer.image);
      const catClass = getCategoryBadgeClass(offer.category);

      const html = `
        <div class="col-sm-6 col-lg-4 col-xl-3">
          <div class="offer-preview-card h-100">
            <div>
              <!-- Banner Image with Floating Overlays -->
              <div class="offer-preview-img-box">
                <img src="${resolvedImg}" alt="${escapeHtml(offer.title)}" onerror="this.onerror=null; this.src='assets/img/placeholder.svg';">
                <div class="offer-preview-overlay"></div>

                <!-- Floating Badge -->
                <div class="position-absolute bg-white rounded-pill px-2.5 py-1 shadow-sm border small fw-bold d-flex align-items-center gap-1.5" style="top: 12px; left: 12px; font-size: 11px;">
                  <i class="bi bi-tag-fill text-amber-500"></i>
                  <span>${escapeHtml(offer.badge || 'Special Offer')}</span>
                </div>

                <!-- Floating Category -->
                <div class="position-absolute bg-amber-500 text-slate-950 font-black rounded-pill px-2.5 py-0.5 shadow-sm uppercase" style="top: 12px; right: 12px; font-size: 10px; letter-spacing: 0.05em;">
                  ${offer.category || 'Skin'}
                </div>
              </div>

              <!-- Content Body -->
              <div class="p-3">
                <h6 class="fw-bold text-slate-900 font-serif mb-1 line-clamp-1" title="${escapeHtml(offer.title)}">
                  ${escapeHtml(offer.title)}
                </h6>
                <p class="text-muted small mb-0 line-clamp-2" style="font-size: 12px; min-height: 36px;">
                  ${escapeHtml(offer.description || 'Clinical package with experienced dermatologists.')}
                </p>
              </div>
            </div>

            <!-- Footer & Admin Controls -->
            <div class="p-3 pt-0">
              <div class="pt-2 border-top">
                <a href="${escapeHtml(offer.slug || '/contact-us#appointment_form')}" target="_blank" class="btn btn-teal btn-sm w-100 fw-bold d-flex align-items-center justify-content-center gap-2 mb-2">
                  <i class="bi bi-tag-fill"></i>
                  <span>${escapeHtml(offer.linkText || 'Claim Offer')}</span>
                  <i class="bi bi-arrow-right ms-auto"></i>
                </a>

                <!-- Card Admin Actions Bar -->
                <div class="d-flex align-items-center justify-content-between pt-1">
                  <div class="d-flex align-items-center gap-1">
                    <button type="button" class="btn btn-sm btn-light border py-0.5 px-2 btn-edit-card" data-id="${offer.id}" title="Edit Offer">
                      <i class="bi bi-pencil-fill text-primary" style="font-size: 11px;"></i> Edit
                    </button>
                    <button type="button" class="btn btn-sm btn-light border py-0.5 px-2 btn-delete-card" data-id="${offer.id}" title="Delete Offer">
                      <i class="bi bi-trash-fill text-danger" style="font-size: 11px;"></i>
                    </button>
                  </div>

                  <div class="form-check form-switch m-0">
                    <input class="form-check-input card-status-toggle" type="checkbox" data-id="${offer.id}" ${offer.isActive ? 'checked' : ''} title="Active Status">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      $grid.append(html);
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

  // Open Add/Edit Modal
  function openOfferModal(offer = null) {
    const $form = $('#offerForm');
    $form[0].reset();

    if (offer) {
      $('#offerModalLabel').html('<i class="bi bi-pencil-square text-teal me-2"></i><span>Edit Offer Details</span>');
      $('#offer-id').val(offer.id);
      $('#offer-title').val(offer.title || '').trigger('input');
      $('#offer-category').val(offer.category || 'Skin').trigger('change');
      $('#offer-badge').val(offer.badge || 'Special Offer').trigger('input');
      $('#offer-order').val(offer.displayOrder || 1);
      $('#offer-status').prop('checked', Boolean(offer.isActive));
      $('#offer-image-url').val(offer.image || '').trigger('input');
      $('#offer-description').val(offer.description || '').trigger('input');
      $('#offer-link-text').val(offer.linkText || 'Claim Offer').trigger('input');
      $('#offer-slug').val(offer.slug || '/contact-us#appointment_form');
      $('#preset-image-selector').val(offer.image || '');
    } else {
      $('#offerModalLabel').html('<i class="bi bi-stars text-warning me-2"></i><span>Add New Monthly Offer</span>');
      $('#offer-id').val('');
      const defaultCat = currentFilterCategory !== 'All' ? currentFilterCategory : 'Skin';
      $('#offer-category').val(defaultCat).trigger('change');
      $('#offer-badge').val('Limited Period').trigger('input');
      $('#offer-order').val(allOffers.length + 1);
      $('#offer-status').prop('checked', true);
      $('#offer-title').val('').trigger('input');
      $('#offer-description').val('').trigger('input');
      $('#offer-link-text').val('Claim Offer').trigger('input');
      $('#offer-slug').val('/contact-us#appointment_form');
      $('#offer-image-url').val('/images/offers/festive-package.png').trigger('input');
      $('#preset-image-selector').val('/images/offers/festive-package.png');
    }

    $('#offerModal').modal('show');
  }

  // Handle image file upload
  async function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
      Swal.fire('Invalid File', 'Please select a valid image file (PNG, JPG, WEBP).', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      Swal.fire({
        title: 'Uploading Banner...',
        text: 'Saving image to server media storage.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await API.uploadImage(formData);
      Swal.close();

      if (res && res.success && res.data && res.data.url) {
        $('#offer-image-url').val(res.data.url).trigger('input');
        Swal.fire({
          icon: 'success',
          title: 'Uploaded!',
          text: 'Offer banner uploaded and preview updated.',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      Swal.fire('Upload Failed', err.message || 'Could not upload image to server.', 'error');
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

  // Move Order Up or Down
  async function moveOfferOrder(id, delta) {
    const idx = allOffers.findIndex((o) => String(o.id) === String(id));
    if (idx === -1) return;
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= allOffers.length) return;

    // Swap items in local array
    const temp = allOffers[idx];
    allOffers[idx] = allOffers[targetIdx];
    allOffers[targetIdx] = temp;

    // Recalculate display_order sequentially
    allOffers.forEach((o, i) => {
      o.displayOrder = i + 1;
    });

    const newOrder = allOffers.map((o) => o.id);

    try {
      renderCurrentView();
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
      title: 'Delete Monthly Offer?',
      text: `Are you sure you want to permanently remove "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete offer',
      reverseButtons: true,
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
