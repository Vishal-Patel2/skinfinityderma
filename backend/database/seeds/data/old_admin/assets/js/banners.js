/**
 * Skinfinity Derma Admin Dashboard
 * Banner Management Controller
 */

$(document).ready(function () {
  'use strict';

  let dataTable = null;
  let bannersData = [];

  // Dropzones
  $('#bannerDesktopDropzone').on('click', function () {
    $('#bannerDesktopFile').trigger('click');
  });

  $('#bannerMobileDropzone').on('click', function () {
    $('#bannerMobileFile').trigger('click');
  });

  // Setup desktop image preview
  window.App.setupImagePreview(
    '#bannerDesktopFile',
    '#bannerDesktopPreviewImg',
    '#btnRemoveBannerDesktopImg',
    '#bannerDesktopImageUrl'
  );

  // Setup mobile image preview
  window.App.setupImagePreview(
    '#bannerMobileFile',
    '#bannerMobilePreviewImg',
    '#btnRemoveBannerMobileImg',
    '#bannerMobileImageUrl'
  );

  // Load Banners
  function loadBanners() {
    const params = {
      location: $('#filterBannerLocation').val(),
      status: $('#filterBannerStatus').val()
    };

    window.API.getBanners(params)
      .done(function (res) {
        if (!res.success) return;
        bannersData = res.data;
        renderTable(bannersData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load banners');
      });
  }

  function renderTable(data) {
    if (dataTable) {
      dataTable.destroy();
    }

    const $tbody = $('#bannersTableBody');
    $tbody.empty();

    data.forEach(function (b) {
      const thumb = b.desktopImage ?
        `<img src="${b.desktopImage}" alt="${b.altText || b.title}" style="width: 95px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);">` :
        `<div style="width: 95px; height: 50px; background: var(--accent-soft); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--secondary);"><i class="bi bi-images"></i></div>`;

      const cta = b.buttonText ?
        `<span class="badge bg-light text-dark border"><i class="bi bi-link-45deg me-1"></i>${b.buttonText}</span>` :
        `<span class="text-muted small">—</span>`;

      const statusSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-banner-status" type="checkbox" data-id="${b.id}" ${b.isActive ? 'checked' : ''} title="Toggle Active">
        </div>
      `;

      const row = `
        <tr data-id="${b.id}">
          <td class="fw-bold text-muted">${b.displayOrder || 1}</td>
          <td>${thumb}</td>
          <td>
            <div class="fw-bold text-dark">${b.title}</div>
            <div class="small text-muted text-truncate" style="max-width: 280px;">${b.subtitle || '—'}</div>
          </td>
          <td><span class="badge badge-pill-soft">${b.displayLocation || 'Homepage'}</span></td>
          <td>${cta}</td>
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

    dataTable = $('#bannersTable').DataTable({
      responsive: true,
      order: [[0, 'asc']],
      pageLength: 10,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search banners..."
      }
    });
  }

  // Open Modal for Add
  $('#btnOpenAddBannerModal').on('click', function () {
    $('#bannerForm')[0].reset();
    $('#bannerId').val('');
    $('#bannerDesktopImageUrl').val('');
    $('#bannerDesktopPreviewImg').attr('src', '');
    $('#bannerDesktopPreviewWrap').addClass('d-none');
    $('#bannerMobileImageUrl').val('');
    $('#bannerMobilePreviewImg').attr('src', '');
    $('#bannerMobilePreviewWrap').addClass('d-none');
    $('#bannerIsActive').prop('checked', true);
    $('#bannerOrder').val(bannersData.length + 1);
    $('#bannerModalLabel').text('Add New Banner');
    $('#bannerModal').modal('show');
  });

  // Edit Banner
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const b = bannersData.find(item => item.id === id);
    if (!b) return;

    $('#bannerId').val(b.id);
    $('#bannerTitle').val(b.title);
    $('#bannerSubtitle').val(b.subtitle || '');
    $('#bannerAltText').val(b.altText || '');
    $('#bannerButtonText').val(b.buttonText || '');
    $('#bannerButtonUrl').val(b.buttonUrl || '');
    $('#bannerLocation').val(b.displayLocation || 'Homepage Hero');
    $('#bannerOrder').val(b.displayOrder || 1);
    $('#bannerIsActive').prop('checked', b.isActive);

    $('#bannerDesktopImageUrl').val(b.desktopImage || '');
    if (b.desktopImage) {
      $('#bannerDesktopPreviewImg').attr('src', b.desktopImage);
      $('#bannerDesktopPreviewWrap').removeClass('d-none');
    } else {
      $('#bannerDesktopPreviewWrap').addClass('d-none');
    }

    $('#bannerMobileImageUrl').val(b.mobileImage || '');
    if (b.mobileImage) {
      $('#bannerMobilePreviewImg').attr('src', b.mobileImage);
      $('#bannerMobilePreviewWrap').removeClass('d-none');
    } else {
      $('#bannerMobilePreviewWrap').addClass('d-none');
    }

    $('#bannerModalLabel').text('Edit Banner: ' + b.title);
    $('#bannerModal').modal('show');
  });

  // Save Banner
  $('#bannerForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#bannerId').val();
    const title = $('#bannerTitle').val().trim();
    const desktopImg = $('#bannerDesktopImageUrl').val().trim();

    if (!title) {
      window.App.toast('error', 'Banner title is required');
      return;
    }
    if (!desktopImg) {
      window.App.toast('error', 'Please upload or provide a desktop banner image');
      return;
    }

    const payload = {
      title: title,
      subtitle: $('#bannerSubtitle').val().trim(),
      desktopImage: desktopImg,
      mobileImage: $('#bannerMobileImageUrl').val().trim(),
      altText: $('#bannerAltText').val().trim() || title,
      buttonText: $('#bannerButtonText').val().trim(),
      buttonUrl: $('#bannerButtonUrl').val().trim(),
      displayLocation: $('#bannerLocation').val(),
      displayOrder: parseInt($('#bannerOrder').val()) || 1,
      isActive: $('#bannerIsActive').is(':checked')
    };

    const $btn = $('#btnSaveBanner');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateBanner(id, payload) : window.API.createBanner(payload);

    request.done(function (res) {
      if (res.success) {
        $('#bannerModal').modal('hide');
        window.App.toast('success', res.message || 'Banner saved successfully');
        loadBanners();
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save banner';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Banner');
    });
  });

  // Toggle Active Status
  $(document).on('change', '.btn-toggle-banner-status', function () {
    const id = $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleBannerStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update status');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Banner
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const b = bannersData.find(item => item.id === id);
    if (!b) return;

    window.App.confirm(
      'Delete Banner?',
      `Are you sure you want to remove "${b.title}"?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteBanner(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Banner deleted successfully');
              loadBanners();
            }
          })
          .fail(function () {
            window.App.toast('error', 'Error deleting banner');
          });
      }
    });
  });

  // Filters
  $('#filterBannerLocation, #filterBannerStatus').on('change', loadBanners);
  $('#btnResetBannerFilters').on('click', function () {
    $('#filterBannerLocation').val('');
    $('#filterBannerStatus').val('');
    loadBanners();
  });

  $('#btnReloadBanners').on('click', loadBanners);

  // Check URL params for ?action=new
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'new') {
    setTimeout(function () {
      $('#btnOpenAddBannerModal').trigger('click');
    }, 200);
  }

  // Initial Load
  loadBanners();
});
