/**
 * Skinfinity Derma Admin - Homepage Section-Wise CMS Controller
 */

$(document).ready(function () {
  'use strict';

  let sectionsData = {};
  let itemsData = {};

  function setupImagePreviewHandler(inputId, previewWrapId, previewImgId, previewTextId, removeBtnId, fileInputId) {
    $(inputId).on('input change', function () {
      const val = $(this).val().trim();
      if (val) {
        $(previewImgId).attr('src', val).removeClass('d-none');
        $(previewTextId).addClass('d-none');
      } else {
        $(previewImgId).attr('src', '').addClass('d-none');
        $(previewTextId).removeClass('d-none');
      }
    });

    $(removeBtnId).on('click', function () {
      $(inputId).val('').trigger('change');
      window.App.toast('info', 'Image removed. Click save to persist.');
    });

    $(fileInputId).on('change', function () {
      const file = this.files[0];
      if (!file) return;

      Swal.fire({
        title: 'Uploading Image...',
        html: '<div class="spinner-border text-success" role="status"></div>',
        allowOutsideClick: false,
        showConfirmButton: false
      });

      API.uploadMediaFile(file)
        .then(res => {
          Swal.close();
          const fileUrl = res.data ? res.data.file_url : (res.fileUrl || res.url);
          $(inputId).val(fileUrl).trigger('change');
          window.App.toast('success', 'Image uploaded successfully.');
        })
        .catch(err => {
          Swal.fire('Upload Error', err.message || 'Failed to upload.', 'error');
        });
    });
  }

  setupImagePreviewHandler('#aboutMediaUrl', '#previewWrapAbout', '#previewImgAbout', '#previewTextAbout', '#btnRemoveAboutImg', '#fileUploadAbout');
  setupImagePreviewHandler('#founderMediaUrl', '#previewWrapFounder', '#previewImgFounder', '#previewTextFounder', null, '#fileUploadFounder');

  function loadHomepageData() {
    API.getHomepageSections().done(function (res) {
      if (!res.success || !res.data) return;
      const secs = res.data.sections || [];

      secs.forEach(s => {
        sectionsData[s.sectionKey] = s;
      });

      // 1. Populate About Clinic
      const about = sectionsData['about_clinic'];
      if (about) {
        $('#aboutTitle').val(about.title || '');
        $('#aboutSubtitle').val(about.subtitle || '');
        $('#aboutBadge').val(about.badgeText || '');
        $('#aboutDesc').val(about.description || '');
        $('#aboutMediaUrl').val(about.mediaUrl || '').trigger('change');
        $('#aboutBtnText').val(about.buttonText || '');
        $('#aboutBtnUrl').val(about.buttonUrl || '');

        const extra = about.extra || {};
        const stats = extra.stats || [];
        if (stats[0]) { $('#stat1Val').val(stats[0].value); $('#stat1Label').val(stats[0].label); }
        if (stats[1]) { $('#stat2Val').val(stats[1].value); $('#stat2Label').val(stats[1].label); }
        if (stats[2]) { $('#stat3Val').val(stats[2].value); $('#stat3Label').val(stats[2].label); }
        if (stats[3]) { $('#stat4Val').val(stats[3].value); $('#stat4Label').val(stats[3].label); }
      }

      // 2. Populate Trust Ticker
      const trustSec = sectionsData['trust_ticker'];
      const trustItems = (trustSec && trustSec.items) ? trustSec.items : [];
      renderTrustItems(trustItems);

      // 3. Populate Founder
      const founder = sectionsData['doctor_founder'];
      if (founder) {
        $('#founderTitle').val(founder.title || '');
        $('#founderSubtitle').val(founder.subtitle || '');
        $('#founderDesc').val(founder.description || '');
        $('#founderMediaUrl').val(founder.mediaUrl || '').trigger('change');
      }

      // 4. Populate Diagnostic
      const diag = sectionsData['diagnostic_tools'];
      if (diag) {
        $('#diagTitle').val(diag.title || '');
        $('#diagSubtitle').val(diag.subtitle || '');
      }

      // 5. Populate Franchise
      const fran = sectionsData['franchise_banner'];
      if (fran) {
        $('#franchiseTitle').val(fran.title || '');
        $('#franchiseSubtitle').val(fran.subtitle || '');
        $('#franchiseBtnText').val(fran.buttonText || '');
        $('#franchiseBtnUrl').val(fran.buttonUrl || '');
      }
    });
  }

  function renderTrustItems(items) {
    const $tbody = $('#trustTickerBody').empty();
    if (items.length === 0) {
      $tbody.html('<tr><td colspan="4" class="text-center py-3 text-muted">No badges added yet.</td></tr>');
      return;
    }

    items.forEach(item => {
      $tbody.append(`
        <tr data-id="${item.id}">
          <td class="fw-bold text-dark">${item.title}</td>
          <td class="text-muted small">${item.subtitle || '—'}</td>
          <td><code>${item.icon || 'ShieldCheck'}</code></td>
          <td class="text-end">
            <button type="button" class="btn btn-outline-danger btn-sm btn-delete-item py-0 px-2" data-id="${item.id}" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `);
    });
  }

  // Save About Section
  $('#aboutClinicForm').on('submit', function (e) {
    e.preventDefault();
    const stats = [
      { value: $('#stat1Val').val().trim() || '1,00,000+', label: $('#stat1Label').val().trim() || 'Patients Treated' },
      { value: $('#stat2Val').val().trim() || '15+', label: $('#stat2Label').val().trim() || 'US-FDA Lasers' },
      { value: $('#stat3Val').val().trim() || '4.5★', label: $('#stat3Label').val().trim() || '4,500+ Reviews' },
      { value: $('#stat4Val').val().trim() || 'CMO', label: $('#stat4Label').val().trim() || 'Govt. Licensed' }
    ];

    const payload = {
      title: $('#aboutTitle').val().trim(),
      subtitle: $('#aboutSubtitle').val().trim(),
      badgeText: $('#aboutBadge').val().trim(),
      description: $('#aboutDesc').val().trim(),
      mediaUrl: $('#aboutMediaUrl').val().trim() || null,
      buttonText: $('#aboutBtnText').val().trim() || 'Book Free Consultation',
      buttonUrl: $('#aboutBtnUrl').val().trim() || '/treatments',
      extra: { stats: stats, award: 'No.1 Skin Clinic Noida' },
      isActive: true
    };

    const $btn = $('#btnSaveAbout');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    API.updateHomepageSection('about_clinic', payload)
      .done(function () {
        Swal.fire({
          icon: 'success',
          title: 'About Us Section Saved!',
          text: 'Changes are live on the Next.js homepage.',
          confirmButtonColor: '#005b41'
        });
      })
      .fail(function (xhr) {
        Swal.fire('Error', xhr.responseJSON ? xhr.responseJSON.message : 'Save failed', 'error');
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-cloud-check me-1"></i> Save About Us Section');
      });
  });

  // Save Founder Profile
  $('#founderForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      title: $('#founderTitle').val().trim(),
      subtitle: $('#founderSubtitle').val().trim(),
      description: $('#founderDesc').val().trim(),
      mediaUrl: $('#founderMediaUrl').val().trim() || null,
      isActive: true
    };

    const $btn = $('#btnSaveFounder');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    API.updateHomepageSection('doctor_founder', payload)
      .done(function () {
        Swal.fire('Saved!', 'Founder editorial showcase updated.', 'success');
      })
      .fail(function (xhr) {
        Swal.fire('Error', xhr.responseJSON ? xhr.responseJSON.message : 'Failed', 'error');
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-cloud-check me-1"></i> Save Founder Profile');
      });
  });

  // Save Diagnostics
  $('#diagnosticForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      title: $('#diagTitle').val().trim(),
      subtitle: $('#diagSubtitle').val().trim(),
      isActive: true
    };

    API.updateHomepageSection('diagnostic_tools', payload)
      .done(function () {
        Swal.fire('Saved!', 'Diagnostic tools section updated.', 'success');
      });
  });

  // Save Franchise
  $('#franchiseForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      title: $('#franchiseTitle').val().trim(),
      subtitle: $('#franchiseSubtitle').val().trim(),
      buttonText: $('#franchiseBtnText').val().trim(),
      buttonUrl: $('#franchiseBtnUrl').val().trim(),
      isActive: true
    };

    API.updateHomepageSection('franchise_banner', payload)
      .done(function () {
        Swal.fire('Saved!', 'Franchise banner updated.', 'success');
      });
  });

  // Add Trust Item
  $('#btnAddTrustItem').on('click', function () {
    Swal.fire({
      title: 'Add Trust Badge',
      html: `
        <input type="text" id="newBadgeTitle" class="swal2-input" placeholder="Badge Title (e.g. US-FDA Lasers)">
        <input type="text" id="newBadgeSub" class="swal2-input" placeholder="Subtitle (e.g. Gold Standard Tech)">
        <input type="text" id="newBadgeIcon" class="swal2-input" placeholder="Icon Name (e.g. ShieldCheck, Award)">
      `,
      showCancelButton: true,
      confirmButtonText: 'Add Badge',
      confirmButtonColor: '#005b41',
      preConfirm: () => {
        const title = $('#newBadgeTitle').val();
        if (!title) { Swal.showValidationMessage('Title is required'); return false; }
        return {
          title: title,
          subtitle: $('#newBadgeSub').val(),
          icon: $('#newBadgeIcon').val() || 'ShieldCheck'
        };
      }
    }).then(res => {
      if (res.isConfirmed) {
        API.addHomepageItem('trust_ticker', res.value)
          .done(function () {
            window.App.toast('success', 'Badge added');
            loadHomepageData();
          });
      }
    });
  });

  // Delete Trust Item
  $(document).on('click', '.btn-delete-item', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Badge?', 'Remove this trust badge from homepage ticker?').then(res => {
      if (res.isConfirmed) {
        API.deleteHomepageItem(id).done(function () {
          window.App.toast('success', 'Badge deleted');
          loadHomepageData();
        });
      }
    });
  });

  loadHomepageData();
});
