/**
 * Skinfinity Derma Admin Dashboard
 * Dynamic Promotional Banner Controller
 * Features:
 * - Direct image rendering for desktop & mobile
 * - Drag-and-drop row reordering with instant MySQL update
 * - 1-click active/inactive toggle switch
 * - Simplified form: Desktop Image, Mobile Image, Order & Active Status
 * - Robust Edit & Delete handlers
 */

$(document).ready(function () {
  'use strict';

  let bannersData = [];
  let draggedRow = null;

  // Drag and drop setup for file dropzones
  function setupDropzoneEvents(dropzoneId, inputId) {
    const $dropzone = $(dropzoneId);
    const $input = $(inputId);

    $dropzone.on('dragover dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.addClass('border-primary bg-light');
    });

    $dropzone.on('dragleave dragend', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.removeClass('border-primary bg-light');
    });

    $dropzone.on('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dropzone.removeClass('border-primary bg-light');
      const files = e.originalEvent.dataTransfer ? e.originalEvent.dataTransfer.files : null;
      if (files && files.length > 0) {
        $input[0].files = files;
        $input.trigger('change');
      }
    });
  }

  setupDropzoneEvents('#bannerDesktopDropzone', '#bannerDesktopFile');
  setupDropzoneEvents('#bannerMobileDropzone', '#bannerMobileFile');

  // When desktop file selected -> upload via /api/upload
  $('#bannerDesktopFile').on('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    uploadBannerFile(file, function (url, name) {
      $('#bannerDesktopImageUrl').val(url);
      $('#bannerDesktopPreviewImg').attr('src', url);
      $('#bannerDesktopFileName').text(name || 'Desktop Banner Creative');
      $('#bannerDesktopDropzone').addClass('d-none');
      $('#bannerDesktopPreviewWrap').removeClass('d-none');
    });
  });

  // When mobile file selected -> upload via /api/upload
  $('#bannerMobileFile').on('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    uploadBannerFile(file, function (url, name) {
      $('#bannerMobileImageUrl').val(url);
      $('#bannerMobilePreviewImg').attr('src', url);
      $('#bannerMobileFileName').text(name || 'Mobile Banner Creative');
      $('#bannerMobileDropzone').addClass('d-none');
      $('#bannerMobilePreviewWrap').removeClass('d-none');
    });
  });

  // Remove preview buttons (Change Image)
  $('#btnRemoveBannerDesktopImg').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#bannerDesktopImageUrl').val('');
    $('#bannerDesktopPreviewImg').attr('src', '');
    $('#bannerDesktopFile').val('');
    $('#bannerDesktopPreviewWrap').addClass('d-none');
    $('#bannerDesktopDropzone').removeClass('d-none');
  });

  $('#btnRemoveBannerMobileImg').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#bannerMobileImageUrl').val('');
    $('#bannerMobilePreviewImg').attr('src', '');
    $('#bannerMobileFile').val('');
    $('#bannerMobilePreviewWrap').addClass('d-none');
    $('#bannerMobileDropzone').removeClass('d-none');
  });

  function uploadBannerFile(file, onSuccess) {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      window.App.toast('error', 'Image size exceeds 10MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'banners');

    const token = window.API.getToken();

    $.ajax({
      url: '/api/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      beforeSend: function () {
        window.App.toast('info', 'Uploading creative...');
      },
      success: function (res) {
        if (res.success && res.url) {
          window.App.toast('success', 'Image uploaded successfully');
          onSuccess(res.url, file.name);
        } else {
          window.App.toast('error', res.message || 'Upload failed');
        }
      },
      error: function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Upload failed';
        window.App.toast('error', msg);
      }
    });
  }

  // Load Banners from API
  function loadBanners() {
    const params = {
      status: $('#filterBannerStatus').val()
    };

    window.API.getBanners(params)
      .done(function (res) {
        if (!res.success) return;
        bannersData = res.data || [];
        $('#bannerCountBadge').text(bannersData.length);
        renderTable(bannersData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load banners from database');
      });
  }

  function renderTable(data) {
    const $tbody = $('#bannersTableBody');
    $tbody.empty();

    if (!data || data.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="5" class="text-center py-5 text-muted">
            <i class="bi bi-images fs-1 d-block mb-2 text-secondary opacity-50"></i>
            No banners found. Click <strong>Add Banner</strong> to upload your first banner.
          </td>
        </tr>
      `);
      return;
    }

    data.forEach(function (b, index) {
      const orderNum = b.displayOrder !== undefined ? b.displayOrder : (index + 1);

      // Desktop Thumbnail
      const desktopThumb = b.desktopImage ? `
        <div class="banner-thumb-wrap position-relative" style="width: 220px; height: 70px; overflow: hidden; border-radius: 8px; border: 1px solid #e2e8f0; background: #0f172a;">
          <img src="${b.desktopImage}" alt="Desktop Banner" 
               style="width: 100%; height: 100%; object-fit: cover;" 
               onerror="this.onerror=null; this.src='assets/img/placeholder.svg';">
        </div>
      ` : `<span class="badge bg-light text-muted border">No Desktop Image</span>`;

      // Mobile Thumbnail
      const mobileThumb = b.mobileImage ? `
        <div class="banner-thumb-wrap position-relative" style="width: 54px; height: 70px; overflow: hidden; border-radius: 6px; border: 1px solid #e2e8f0; background: #0f172a;">
          <img src="${b.mobileImage}" alt="Mobile Banner" 
               style="width: 100%; height: 100%; object-fit: cover;" 
               onerror="this.onerror=null; this.src='assets/img/placeholder.svg';">
        </div>
      ` : `<span class="text-muted small">Auto (Desktop)</span>`;

      // Active / Inactive Switch
      const statusSwitch = `
        <div class="form-check form-switch m-0 d-flex justify-content-center">
          <input class="form-check-input btn-toggle-banner-status" type="checkbox" data-id="${b.id}" ${b.isActive ? 'checked' : ''} style="cursor: pointer; width: 2.5em; height: 1.3em;">
        </div>
      `;

      const row = `
        <tr data-id="${b.id}" class="banner-draggable-row" draggable="true" style="cursor: move;">
          <td>
            <div class="d-flex align-items-center gap-1.5">
              <i class="bi bi-grip-vertical text-muted fs-5 drag-handle" title="Drag to reorder"></i>
              <span class="fw-bold text-dark order-badge">${orderNum}</span>
            </div>
          </td>
          <td>${desktopThumb}</td>
          <td>${mobileThumb}</td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit" title="Edit Banner" data-id="${b.id}">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" title="Delete Banner" data-id="${b.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    initDragAndDrop();
  }

  // Drag and Drop Table Rows for Reordering
  function initDragAndDrop() {
    const rows = document.querySelectorAll('#bannersTableBody tr.banner-draggable-row');

    rows.forEach(function (row) {
      row.addEventListener('dragstart', function (e) {
        draggedRow = this;
        this.classList.add('table-active', 'opacity-50');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
      });

      row.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('border-primary', 'border-2');
      });

      row.addEventListener('dragleave', function () {
        this.classList.remove('border-primary', 'border-2');
      });

      row.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('border-primary', 'border-2');
        if (draggedRow && draggedRow !== this) {
          const tbody = document.getElementById('bannersTableBody');
          const allRows = Array.from(tbody.querySelectorAll('tr.banner-draggable-row'));
          const draggedIndex = allRows.indexOf(draggedRow);
          const targetIndex = allRows.indexOf(this);

          if (draggedIndex < targetIndex) {
            tbody.insertBefore(draggedRow, this.nextSibling);
          } else {
            tbody.insertBefore(draggedRow, this);
          }

          saveNewOrder();
        }
      });

      row.addEventListener('dragend', function () {
        this.classList.remove('table-active', 'opacity-50', 'border-primary', 'border-2');
        draggedRow = null;
      });
    });
  }

  function saveNewOrder() {
    const tbody = document.getElementById('bannersTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr.banner-draggable-row'));
    const orderList = [];

    rows.forEach(function (row, idx) {
      const id = row.getAttribute('data-id');
      const newOrder = idx + 1;
      $(row).find('.order-badge').text(newOrder);
      orderList.push({ id: id, displayOrder: newOrder });
    });

    window.API.reorderBanners(orderList)
      .done(function () {
        window.App.toast('success', 'Banner order updated live on website!');
      })
      .fail(function () {
        window.App.toast('error', 'Failed to save new banner sequence');
      });
  }

  // Open Modal for Add
  $('#btnOpenAddBannerModal').on('click', function () {
    $('#bannerForm')[0].reset();
    $('#bannerId').val('');
    $('#bannerDesktopImageUrl').val('');
    $('#bannerDesktopPreviewImg').attr('src', '');
    $('#bannerDesktopFile').val('');
    $('#bannerDesktopDropzone').removeClass('d-none');
    $('#bannerDesktopPreviewWrap').addClass('d-none');

    $('#bannerMobileImageUrl').val('');
    $('#bannerMobilePreviewImg').attr('src', '');
    $('#bannerMobileFile').val('');
    $('#bannerMobileDropzone').removeClass('d-none');
    $('#bannerMobilePreviewWrap').addClass('d-none');

    $('#bannerModalLabel').text('Add New Banner');
    $('#bannerModal').modal('show');
  });

  // Edit Banner (Exact Match by ID string)
  $(document).on('click', '.btn-edit', function (e) {
    e.preventDefault();
    const id = String($(this).data('id'));
    const b = bannersData.find(item => String(item.id) === id);

    if (!b) {
      window.App.toast('error', 'Banner record not found');
      return;
    }

    $('#bannerId').val(b.id);
    $('#bannerDesktopImageUrl').val(b.desktopImage || '');
    if (b.desktopImage) {
      $('#bannerDesktopPreviewImg').attr('src', b.desktopImage);
      $('#bannerDesktopFileName').text(b.desktopImage.split('/').pop() || 'Desktop Creative');
      $('#bannerDesktopDropzone').addClass('d-none');
      $('#bannerDesktopPreviewWrap').removeClass('d-none');
    } else {
      $('#bannerDesktopDropzone').removeClass('d-none');
      $('#bannerDesktopPreviewWrap').addClass('d-none');
    }

    $('#bannerMobileImageUrl').val(b.mobileImage || '');
    if (b.mobileImage) {
      $('#bannerMobilePreviewImg').attr('src', b.mobileImage);
      $('#bannerMobileFileName').text(b.mobileImage.split('/').pop() || 'Mobile Creative');
      $('#bannerMobileDropzone').addClass('d-none');
      $('#bannerMobilePreviewWrap').removeClass('d-none');
    } else {
      $('#bannerMobileDropzone').removeClass('d-none');
      $('#bannerMobilePreviewWrap').addClass('d-none');
    }

    $('#bannerModalLabel').text('Edit Banner (#' + b.id + ')');
    $('#bannerModal').modal('show');
  });

  // Save Banner Form (Upload creative only - order & status managed on table)
  $('#bannerForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#bannerId').val();
    const desktopImg = $('#bannerDesktopImageUrl').val().trim();

    if (!desktopImg) {
      window.App.toast('error', 'Please upload a desktop banner image');
      return;
    }

    const payload = {
      desktopImage: desktopImg,
      mobileImage: $('#bannerMobileImageUrl').val().trim() || null
    };

    if (!id) {
      payload.displayOrder = bannersData.length + 1;
      payload.isActive = 1;
    }

    const $btn = $('#btnSaveBanner');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateBanner(id, payload) : window.API.createBanner(payload);

    request.done(function (res) {
      if (res.success) {
        $('#bannerModal').modal('hide');
        window.App.toast('success', res.message || 'Banner saved successfully');
        loadBanners();
      } else {
        window.App.toast('error', res.message || 'Failed to save');
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error saving banner';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-cloud-check-fill me-1"></i> Save Banner');
    });
  });

  // Toggle Active Status
  $(document).on('change', '.btn-toggle-banner-status', function () {
    const id = String($(this).data('id'));
    const isChecked = $(this).is(':checked');

    window.API.toggleBannerStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message || (isChecked ? 'Banner is now active' : 'Banner is now inactive'));
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update banner status');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Banner (Exact Match by ID string)
  $(document).on('click', '.btn-delete', function (e) {
    e.preventDefault();
    const id = String($(this).data('id'));
    const b = bannersData.find(item => String(item.id) === id);

    window.App.confirm(
      'Delete Banner?',
      `Are you sure you want to permanently delete this banner?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteBanner(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Banner deleted successfully');
              loadBanners();
            } else {
              window.App.toast('error', res.message || 'Could not delete banner');
            }
          })
          .fail(function () {
            window.App.toast('error', 'Error deleting banner from database');
          });
      }
    });
  });

  // Filter
  $('#filterBannerStatus').on('change', loadBanners);
  $('#btnResetBannerFilters').on('click', function () {
    $('#filterBannerStatus').val('');
    loadBanners();
  });

  $('#btnReloadBanners').on('click', loadBanners);

  // Tab switching button & counters
  let activeTab = 'banners';

  $('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
    const target = $(e.target).attr('data-bs-target');
    if (target === '#pane-trust-badges') {
      activeTab = 'trust-badges';
      $('#btnDynamicTabAdd').html('<i class="bi bi-plus-lg me-1"></i> <span>Add Trust Badge</span>');
    } else {
      activeTab = 'banners';
      $('#btnDynamicTabAdd').html('<i class="bi bi-plus-lg me-1"></i> <span>Add Banner</span>');
    }
  });

  $('#btnDynamicTabAdd').on('click', function () {
    if (activeTab === 'trust-badges') {
      $('#btnOpenAddBadgeModal').trigger('click');
    } else {
      $('#btnOpenAddBannerModal').trigger('click');
    }
  });

  $('#btnOpenAddBannerModalInside').on('click', function () {
    $('#btnOpenAddBannerModal').trigger('click');
  });

  /* ========================================================================== */
  /* BELOW-BANNER TRUST TICKER BADGES CONTROLLER                               */
  /* ========================================================================== */

  let trustBadgesData = [];
  let draggedBadgeRow = null;

  const badgeIconMap = {
    'CheckCircle2': 'bi-check-circle-fill',
    'ShieldCheck': 'bi-shield-check',
    'Award': 'bi-award-fill',
    'Stethoscope': 'bi-heart-pulse-fill',
    'CreditCard': 'bi-credit-card-fill',
    'UserCheck': 'bi-person-check-fill',
    'Star': 'bi-star-fill',
    'Clock': 'bi-clock-fill',
    'FlaskConical': 'bi-flask-fill',
    'Zap': 'bi-lightning-charge-fill',
    'Droplets': 'bi-droplet-fill',
    'Sparkles': 'bi-stars',
    'Building': 'bi-hospital-fill',
    'HeartPulse': 'bi-heart-pulse-fill',
  };

  function getBadgeIconHtml(iconName) {
    const cls = badgeIconMap[iconName] || 'bi-check-circle-fill';
    return `<i class="bi ${cls}"></i>`;
  }

  // Radio button switch: Preset Icon vs Upload Custom Icon
  $('input[name="iconTypeRadio"]').on('change', function () {
    const isUpload = $(this).val() === 'upload';
    if (isUpload) {
      $('#sectionPresetIcon').addClass('d-none');
      $('#sectionUploadIcon').removeClass('d-none');
    } else {
      $('#sectionUploadIcon').addClass('d-none');
      $('#sectionPresetIcon').removeClass('d-none');
    }
    updateBadgeModalPreview();
  });

  // Custom Icon File Upload & Drag-and-drop
  setupDropzoneEvents('#badgeCustomIconDropzone', '#trustBadgeCustomIconFile');

  $('#trustBadgeCustomIconFile').on('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    uploadBannerFile(file, function (url, name) {
      $('#trustBadgeCustomIconUrl').val(url);
      $('#badgeCustomIconPreviewImg').attr('src', url);
      $('#badgeCustomIconFileName').text(name || 'custom-icon.png');
      $('#badgeCustomIconDropzone').addClass('d-none');
      $('#badgeCustomIconPreviewWrap').removeClass('d-none');
      updateBadgeModalPreview();
    });
  });

  $('#btnRemoveBadgeCustomIcon').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#trustBadgeCustomIconUrl').val('');
    $('#trustBadgeCustomIconFile').val('');
    $('#badgeCustomIconPreviewImg').attr('src', '');
    $('#badgeCustomIconPreviewWrap').addClass('d-none');
    $('#badgeCustomIconDropzone').removeClass('d-none');
    updateBadgeModalPreview();
  });

  function updateBadgeModalPreview() {
    const isUpload = $('#iconTypeUpload').is(':checked');
    const customUrl = $('#trustBadgeCustomIconUrl').val();
    const iconName = $('#trustBadgeIcon').val() || 'CheckCircle2';
    const titleText = $('#trustBadgeTitle').val().trim() || 'Hospital-Grade Sanitation';

    if (isUpload && customUrl) {
      $('#trustBadgeIconPreview').html(`<img src="${customUrl}" style="width: 28px; height: 28px; object-fit: contain;">`);
      $('#trustBadgePillIcon').html(`<img src="${customUrl}" style="width: 16px; height: 16px; object-fit: contain;">`);
    } else {
      const iconHtml = getBadgeIconHtml(iconName);
      $('#trustBadgeIconPreview').html(iconHtml);
      $('#trustBadgePillIcon').html(iconHtml);
    }
    $('#trustBadgePillText').text(titleText);
  }

  $('#trustBadgeIcon').on('change', updateBadgeModalPreview);
  $('#trustBadgeTitle').on('input', updateBadgeModalPreview);

  function loadTrustBadges() {
    window.API.getTrustBadges()
      .done(function (res) {
        if (!res.success) return;
        trustBadgesData = res.data || [];
        $('#badgeCountBadge').text(trustBadgesData.length);
        renderTrustBadgesTable(trustBadgesData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load trust badges');
      });
  }

  function renderTrustBadgesTable(data) {
    const $tbody = $('#trustBadgesTableBody');
    $tbody.empty();

    if (!data || data.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="5" class="text-center py-4 text-muted">
            <i class="bi bi-shield-x fs-1 d-block mb-1 opacity-50"></i>
            No trust badges found. Click <strong>Add Trust Badge</strong> to create one.
          </td>
        </tr>
      `);
      return;
    }

    data.forEach(function (b, index) {
      const orderNum = b.displayOrder !== undefined ? b.displayOrder : (index + 1);
      const iconDisplay = b.iconUrl ? `
        <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background: #eef8f5; border: 1px solid #b2e2d8; overflow: hidden;">
          <img src="${b.iconUrl}" alt="Badge Icon" style="width: 20px; height: 20px; object-fit: contain;">
        </div>
      ` : `
        <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background: #eef8f5; color: #008081; font-size: 1.15rem;">
          ${getBadgeIconHtml(b.icon)}
        </div>
      `;

      const iconLabel = b.iconUrl ? '<span class="text-primary small fw-semibold">Uploaded Icon</span>' : `<span class="text-muted small fw-medium">${b.icon || 'CheckCircle2'}</span>`;

      const statusSwitch = `
        <div class="form-check form-switch m-0 d-flex justify-content-center">
          <input class="form-check-input btn-toggle-badge-status" type="checkbox" data-id="${b.id}" ${b.isActive ? 'checked' : ''} style="cursor: pointer; width: 2.5em; height: 1.3em;">
        </div>
      `;

      const row = `
        <tr data-id="${b.id}" class="badge-draggable-row" draggable="true" style="cursor: move;">
          <td>
            <div class="d-flex align-items-center gap-1.5">
              <i class="bi bi-grip-vertical text-muted fs-5 drag-handle" title="Drag to reorder"></i>
              <span class="fw-bold text-dark badge-order-num">${orderNum}</span>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center gap-2">
              ${iconDisplay}
              ${iconLabel}
            </div>
          </td>
          <td>
            <div class="fw-semibold text-dark">${b.title}</div>
          </td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit-badge" title="Edit Badge" data-id="${b.id}">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete-badge" title="Delete Badge" data-id="${b.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    initBadgeDragAndDrop();
  }

  function initBadgeDragAndDrop() {
    const rows = document.querySelectorAll('#trustBadgesTableBody tr.badge-draggable-row');

    rows.forEach(function (row) {
      row.addEventListener('dragstart', function (e) {
        draggedBadgeRow = this;
        this.classList.add('table-active', 'opacity-50');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
      });

      row.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('border-primary', 'border-2');
      });

      row.addEventListener('dragleave', function () {
        this.classList.remove('border-primary', 'border-2');
      });

      row.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('border-primary', 'border-2');
        if (draggedBadgeRow && draggedBadgeRow !== this) {
          const tbody = document.getElementById('trustBadgesTableBody');
          const allRows = Array.from(tbody.querySelectorAll('tr.badge-draggable-row'));
          const draggedIndex = allRows.indexOf(draggedBadgeRow);
          const targetIndex = allRows.indexOf(this);

          if (draggedIndex < targetIndex) {
            tbody.insertBefore(draggedBadgeRow, this.nextSibling);
          } else {
            tbody.insertBefore(draggedBadgeRow, this);
          }

          saveNewBadgeOrder();
        }
      });

      row.addEventListener('dragend', function () {
        this.classList.remove('table-active', 'opacity-50', 'border-primary', 'border-2');
        draggedBadgeRow = null;
      });
    });
  }

  function saveNewBadgeOrder() {
    const tbody = document.getElementById('trustBadgesTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr.badge-draggable-row'));
    const orderList = [];

    rows.forEach(function (row, idx) {
      const id = row.getAttribute('data-id');
      const newOrder = idx + 1;
      $(row).find('.badge-order-num').text(newOrder);
      orderList.push({ id: id, displayOrder: newOrder });
    });

    window.API.reorderTrustBadges(orderList)
      .done(function () {
        window.App.toast('success', 'Badge sequence updated live on website ticker!');
      })
      .fail(function () {
        window.App.toast('error', 'Failed to save new badge sequence');
      });
  }

  // Open Add Badge Modal
  $('#btnOpenAddBadgeModal').on('click', function () {
    $('#trustBadgeForm')[0].reset();
    $('#trustBadgeId').val('');
    $('#iconTypePreset').prop('checked', true).trigger('change');
    $('#trustBadgeIcon').val('CheckCircle2');
    $('#trustBadgeCustomIconUrl').val('');
    $('#trustBadgeCustomIconFile').val('');
    $('#badgeCustomIconPreviewImg').attr('src', '');
    $('#badgeCustomIconPreviewWrap').addClass('d-none');
    $('#badgeCustomIconDropzone').removeClass('d-none');

    updateBadgeModalPreview();
    $('#trustBadgeModalLabel').text('Add Trust Badge');
    $('#trustBadgeModal').modal('show');
  });

  // Open Edit Badge Modal
  $(document).on('click', '.btn-edit-badge', function (e) {
    e.preventDefault();
    const id = String($(this).data('id'));
    const b = trustBadgesData.find(item => String(item.id) === id);

    if (!b) {
      window.App.toast('error', 'Trust badge record not found');
      return;
    }

    $('#trustBadgeId').val(b.id);
    $('#trustBadgeTitle').val(b.title || '');

    if (b.iconUrl) {
      $('#iconTypeUpload').prop('checked', true).trigger('change');
      $('#trustBadgeCustomIconUrl').val(b.iconUrl);
      $('#badgeCustomIconPreviewImg').attr('src', b.iconUrl);
      $('#badgeCustomIconFileName').text(b.iconUrl.split('/').pop() || 'custom-icon.png');
      $('#badgeCustomIconDropzone').addClass('d-none');
      $('#badgeCustomIconPreviewWrap').removeClass('d-none');
    } else {
      $('#iconTypePreset').prop('checked', true).trigger('change');
      $('#trustBadgeIcon').val(b.icon || 'CheckCircle2');
      $('#trustBadgeCustomIconUrl').val('');
      $('#badgeCustomIconPreviewWrap').addClass('d-none');
      $('#badgeCustomIconDropzone').removeClass('d-none');
    }

    updateBadgeModalPreview();
    $('#trustBadgeModalLabel').text('Edit Trust Badge (#' + b.id + ')');
    $('#trustBadgeModal').modal('show');
  });

  // Submit Badge Form
  $('#trustBadgeForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#trustBadgeId').val();
    const title = $('#trustBadgeTitle').val().trim();
    const isUpload = $('#iconTypeUpload').is(':checked');
    const customUrl = $('#trustBadgeCustomIconUrl').val().trim();
    const iconName = $('#trustBadgeIcon').val() || 'CheckCircle2';

    if (!title) {
      window.App.toast('error', 'Please enter badge title');
      return;
    }

    const payload = {
      title: title,
      icon: isUpload ? 'Custom' : iconName,
      iconUrl: isUpload ? (customUrl || null) : null
    };

    if (!id) {
      payload.displayOrder = trustBadgesData.length + 1;
      payload.isActive = 1;
    }

    const $btn = $('#btnSaveTrustBadge');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1.5"></span>Saving...');

    const request = id ? window.API.updateTrustBadge(id, payload) : window.API.createTrustBadge(payload);

    request.done(function (res) {
      if (res.success) {
        $('#trustBadgeModal').modal('hide');
        window.App.toast('success', res.message || 'Trust badge saved successfully');
        loadTrustBadges();
      } else {
        window.App.toast('error', res.message || 'Failed to save badge');
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error saving trust badge';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-cloud-check-fill me-1"></i> Save Badge');
    });
  });

  // Toggle Badge Status
  $(document).on('change', '.btn-toggle-badge-status', function () {
    const id = String($(this).data('id'));
    const isChecked = $(this).is(':checked');

    window.API.toggleTrustBadgeStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message || (isChecked ? 'Badge is now active' : 'Badge is now inactive'));
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update badge status');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Badge
  $(document).on('click', '.btn-delete-badge', function (e) {
    e.preventDefault();
    const id = String($(this).data('id'));

    window.App.confirm(
      'Delete Trust Badge?',
      `Are you sure you want to delete this trust badge?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteTrustBadge(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Trust badge deleted successfully');
              loadTrustBadges();
            } else {
              window.App.toast('error', res.message || 'Could not delete badge');
            }
          })
          .fail(function () {
            window.App.toast('error', 'Error deleting badge from database');
          });
      }
    });
  });

  // Initial Load
  loadBanners();
  loadTrustBadges();
});
