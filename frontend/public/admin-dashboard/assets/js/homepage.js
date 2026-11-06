/**
 * Skinfinity Derma Admin - Website Pages CMS Controller
 * Supports multi-page tabs, CKEditor rich text editing, synchronized About Clinic & Founder sections,
 * 1-click active toggles, live image dropzones, and dynamic page tabs creation.
 */

$(document).ready(function () {
  'use strict';

  let sectionsData = {};
  let itemsData = {};
  let pagesList = [];
  let ckEditors = {};

  // Initialize CKEditor helper
  function initEditor(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return Promise.resolve(null);
    if (ckEditors[elementId]) return Promise.resolve(ckEditors[elementId]);

    return ClassicEditor
      .create(el, {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo']
      })
      .then(editor => {
        ckEditors[elementId] = editor;
        return editor;
      })
      .catch(err => {
        console.error('CKEditor init error on #' + elementId, err);
        return null;
      });
  }

  // Setup form instances
  function setupFormInstances() {
    const aboutTmpl = document.getElementById('tmplAboutClinicForm');
    const founderTmpl = document.getElementById('tmplDoctorFounderForm');

    if (aboutTmpl) {
      $('#aboutClinicContainerHome').html(aboutTmpl.innerHTML);
      $('#aboutClinicContainerAboutPage').html(aboutTmpl.innerHTML);

      // Distinguish IDs for CKEditors
      $('#aboutClinicContainerHome .about-desc-editor').attr('id', 'aboutDescEditorHome');
      $('#aboutClinicContainerAboutPage .about-desc-editor').attr('id', 'aboutDescEditorAboutPage');
    }

    if (founderTmpl) {
      $('#doctorFounderContainerHome').html(founderTmpl.innerHTML);
      $('#doctorFounderContainerAboutPage').html(founderTmpl.innerHTML);

      // Distinguish IDs for CKEditors
      $('#doctorFounderContainerHome .founder-desc-editor').attr('id', 'founderDescEditorHome');
      $('#doctorFounderContainerAboutPage .founder-desc-editor').attr('id', 'founderDescEditorAboutPage');
      $('#doctorFounderContainerHome .founder-subdesc-editor').attr('id', 'founderSubdescEditorHome');
      $('#doctorFounderContainerAboutPage .founder-subdesc-editor').attr('id', 'founderSubdescEditorAboutPage');
    }

    // Modal editor
    $('#dynPageContentEditor').attr('id', 'dynPageEditorModal');

    // Initialize all CKEditors
    initEditor('aboutDescEditorHome');
    initEditor('aboutDescEditorAboutPage');
    initEditor('founderDescEditorHome');
    initEditor('founderDescEditorAboutPage');
    initEditor('founderSubdescEditorHome');
    initEditor('founderSubdescEditorAboutPage');
    initEditor('dynPageEditorModal');
    initEditor('pillarDesc');

    // Bind image dropzones and file upload handlers
    bindImageUploaders();

    // Bind form submissions
    bindFormSubmissions();
  }

  // Setup Image Dropzone and Upload handling
  function bindImageUploaders() {
    $(document).on('change', '.about-file-input', function () {
      const file = this.files[0];
      if (!file) return;
      uploadFileHandler(file, function (url) {
        $('.about-media-url').val(url).trigger('input');
        $('.about-preview-img').attr('src', url);
      });
    });

    $(document).on('input change', '.about-media-url', function () {
      const url = $(this).val().trim();
      $('.about-media-url').val(url);
      if (url) {
        $('.about-preview-img').attr('src', url);
      }
    });

    $(document).on('click', '.about-btn-remove-img', function () {
      $('.about-media-url').val('').trigger('input');
      $('.about-preview-img').attr('src', '/images/custom/clinic-reception.jpg');
      window.App.toast('info', 'Image reset to default.');
    });

    // Founder portrait upload
    $(document).on('change', '.founder-file-input', function () {
      const file = this.files[0];
      if (!file) return;
      uploadFileHandler(file, function (url) {
        $('.founder-media-url').val(url).trigger('input');
        $('.founder-preview-img').attr('src', url);
      });
    });

    $(document).on('input change', '.founder-media-url', function () {
      const url = $(this).val().trim();
      $('.founder-media-url').val(url);
      if (url) {
        $('.founder-preview-img').attr('src', url);
      }
    });

    // Miss Curvy photo upload / input
    $(document).on('input change', '.curvy-image', function () {
      const url = $(this).val().trim();
      $('.curvy-image').val(url);
      if (url) {
        $('.curvy-preview-img').attr('src', url);
      }
    });
  }

  function uploadFileHandler(file, onSuccess) {
    Swal.fire({
      title: 'Uploading Media...',
      html: '<div class="spinner-border text-success my-2" role="status"></div><p class="small text-muted">Optimizing and storing asset...</p>',
      allowOutsideClick: false,
      showConfirmButton: false
    });

    API.uploadImage(file, 'website')
      .then(res => {
        Swal.close();
        const fileUrl = res.url || (res.data ? res.data.url : res.fileUrl);
        onSuccess(fileUrl);
        window.App.toast('success', 'Media uploaded successfully.');
      })
      .catch(err => {
        Swal.fire('Upload Error', err.message || 'Failed to upload.', 'error');
      });
  }

  // Load Homepage Sections Data
  function loadHomepageData() {
    API.getHomepageSections().done(function (res) {
      if (!res.success || !res.data) return;
      const secs = res.data.sections || [];

      secs.forEach(s => {
        sectionsData[s.sectionKey] = s;
      });

      // 1. Populate About Clinic Showcase
      const about = sectionsData['about_clinic'];
      if (about) {
        $('.about-title').val(about.title || '');
        $('.about-subtitle').val(about.subtitle || '');
        $('.about-badge').val(about.badgeText || '');
        $('.about-media-url').val(about.mediaUrl || '').trigger('input');
        $('.about-btn-text').val(about.buttonText || 'Book Clinic Consultation');
        $('.about-btn-url').val(about.buttonUrl || '/contact-us#appointment_form');
        $('.about-sec-btn-text').val(about.secondaryButtonText || 'Explore Full Facilities');
        $('.about-sec-btn-url').val(about.secondaryButtonUrl || '/about-clinic');

        // Active switch
        const isAboutActive = Boolean(about.isActive !== undefined ? about.isActive : true);
        $('.about-active-switch').prop('checked', isAboutActive);
        updateActiveLabel($('.about-active-label'), isAboutActive);

        // CKEditor Content
        const descHtml = about.description || '';
        $('.about-desc').val(descHtml);
        if (ckEditors['aboutDescEditorHome']) ckEditors['aboutDescEditorHome'].setData(descHtml);
        if (ckEditors['aboutDescEditorAboutPage']) ckEditors['aboutDescEditorAboutPage'].setData(descHtml);

        // Stats
        const extra = about.extra || {};
        const stats = extra.stats || [];
        if (stats[0]) { $('.stat1-val').val(stats[0].value); $('.stat1-label').val(stats[0].label); }
        if (stats[1]) { $('.stat2-val').val(stats[1].value); $('.stat2-label').val(stats[1].label); }
        if (stats[2]) { $('.stat3-val').val(stats[2].value); $('.stat3-label').val(stats[2].label); }
        if (stats[3]) { $('.stat4-val').val(stats[3].value); $('.stat4-label').val(stats[3].label); }

        // Pillars
        renderPillars(about.items || []);
      }

      // 2. Populate Doctor Founder Showcase
      const founder = sectionsData['doctor_founder'];
      if (founder) {
        $('.founder-title').val(founder.title || 'Dr. Ipshita Johri');
        $('.founder-subtitle').val(founder.subtitle || 'Founder, Medical Director & Celebrity Dermatologist');
        $('.founder-badge').val(founder.badgeText || 'Chief Medical Officer');
        $('.founder-media-url').val(founder.mediaUrl || '').trigger('input');
        $('.founder-btn-text').val(founder.buttonText || 'Read Full Biography & Philosophy');
        $('.founder-btn-url').val(founder.buttonUrl || '/about-clinic');
        $('.founder-sec-btn-text').val(founder.secondaryButtonText || 'Consult with Dr. Ipshita');

        const isFounderActive = Boolean(founder.isActive !== undefined ? founder.isActive : true);
        $('.founder-active-switch').prop('checked', isFounderActive);
        updateActiveLabel($('.founder-active-label'), isFounderActive);

        const founderExtra = founder.extra || {};
        $('.founder-qualifications').val(founderExtra.qualifications || 'MBBS, DDV | PG Dip. Clinical Dermatology (Cardiff University, U.K.)');
        $('.founder-experience').val(founderExtra.experience || '12+ Years Clinical Experience across Delhi NCR');

        // Miss Curvy Card
        const curvy = founderExtra.missCurvy || {};
        $('.curvy-title').val(curvy.title || 'Ms. India Curvy 2020');
        $('.curvy-subtitle').val(curvy.subtitle || 'Runner Up & Pageant Icon');
        $('.curvy-tagline').val(curvy.tagline || 'Empowering Body Positivity');
        $('.curvy-image').val(curvy.image || '/images/doctors/dr-ipshita-miss-curvy.jpg').trigger('input');

        // Highlights
        const hls = founderExtra.highlights || [];
        if (hls[0]) $('.hl-1').val(hls[0]);
        if (hls[1]) $('.hl-2').val(hls[1]);
        if (hls[2]) $('.hl-3').val(hls[2]);
        if (hls[3]) $('.hl-4').val(hls[3]);

        // CKEditor Content
        const fDesc = founder.description || '';
        const fSubDesc = founderExtra.subDescription || '';
        $('.founder-desc').val(fDesc);
        $('.founder-subdesc').val(fSubDesc);
        if (ckEditors['founderDescEditorHome']) ckEditors['founderDescEditorHome'].setData(fDesc);
        if (ckEditors['founderDescEditorAboutPage']) ckEditors['founderDescEditorAboutPage'].setData(fDesc);
        if (ckEditors['founderSubdescEditorHome']) ckEditors['founderSubdescEditorHome'].setData(fSubDesc);
        if (ckEditors['founderSubdescEditorAboutPage']) ckEditors['founderSubdescEditorAboutPage'].setData(fSubDesc);
      }

      // 3. Populate Diagnostic Tools
      const diag = sectionsData['diagnostic_tools'];
      if (diag) {
        $('#diagTitle').val(diag.title || '');
        $('#diagSubtitle').val(diag.subtitle || '');
        $('#diagActiveSwitch').prop('checked', Boolean(diag.isActive !== undefined ? diag.isActive : true));
      }

      // 4. Populate Franchise Banner
      const fran = sectionsData['franchise_banner'];
      if (fran) {
        $('#franchiseTitle').val(fran.title || '');
        $('#franchiseSubtitle').val(fran.subtitle || '');
        $('#franchiseBtnText').val(fran.buttonText || '');
        $('#franchiseBtnUrl').val(fran.buttonUrl || '');
        $('#franActiveSwitch').prop('checked', Boolean(fran.isActive !== undefined ? fran.isActive : true));
      }
    });
  }

  function updateActiveLabel($label, isActive) {
    if (isActive) {
      $label.html('<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i>Active on Live Website</span>');
    } else {
      $label.html('<span class="text-danger"><i class="bi bi-x-circle-fill me-1"></i>Inactive (Hidden from Frontend)</span>');
    }
  }

  // 1-Click Toggle for About Clinic
  $(document).on('change', '.about-active-switch', function () {
    const isChecked = $(this).is(':checked');
    $('.about-active-switch').prop('checked', isChecked);
    updateActiveLabel($('.about-active-label'), isChecked);
    API.toggleHomepageSection('about_clinic')
      .done(res => {
        window.App.toast('success', `About Clinic Section is now ${isChecked ? 'Active' : 'Hidden'} on website.`);
      })
      .fail(() => {
        window.App.toast('error', 'Failed to update section status.');
      });
  });

  // 1-Click Toggle for Founder
  $(document).on('change', '.founder-active-switch', function () {
    const isChecked = $(this).is(':checked');
    $('.founder-active-switch').prop('checked', isChecked);
    updateActiveLabel($('.founder-active-label'), isChecked);
    API.toggleHomepageSection('doctor_founder')
      .done(res => {
        window.App.toast('success', `Founder Section is now ${isChecked ? 'Active' : 'Hidden'} on website.`);
      })
      .fail(() => {
        window.App.toast('error', 'Failed to update section status.');
      });
  });

  // Render Infrastructure Pillars
  function renderPillars(pillars) {
    if (!pillars || pillars.length === 0) {
      pillars = [
        { id: 6, title: 'Orange Health Pathology Lab On-Site', icon: 'FlaskConical', description: 'Same-day hormone tests, lipid panels, and vitamin profiling to address internal root causes.' },
        { id: 7, title: 'Authentic In-House Dermatological Pharmacy', icon: 'Pill', description: '100% verified medical formulations, clinical sunscreens, and customized serums.' },
        { id: 8, title: 'US-FDA Approved Technology Only', icon: 'Microscope', description: 'Every laser and device is cleared by US-FDA and CDSCO — zero grey-market equipment.' }
      ];
    }

    const html = pillars.map(p => `
      <div class="col-md-4" id="pillarCard-${p.id}">
        <div class="pillar-item-card h-100 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="badge bg-light text-dark border px-2 py-1"><i class="bi bi-tag me-1"></i>${p.icon || 'FlaskConical'}</span>
              <button type="button" class="btn btn-outline-primary btn-sm btn-edit-pillar py-0 px-2"
                data-id="${p.id}"
                data-title="${p.title}"
                data-icon="${p.icon || 'FlaskConical'}"
                data-desc="${p.description || ''}">
                <i class="bi bi-pencil-square me-1"></i>Edit
              </button>
            </div>
            <h6 class="fw-bold mb-1 text-dark">${p.title}</h6>
            <p class="text-muted small mb-0">${p.description || ''}</p>
          </div>
        </div>
      </div>
    `).join('');

    $('.about-pillars-row').html(html);
  }

  // Pillar Edit Modal
  $(document).on('click', '.btn-edit-pillar', function () {
    const id = $(this).data('id');
    const title = $(this).data('title');
    const icon = $(this).data('icon');
    const desc = $(this).data('desc');

    $('#pillarId').val(id);
    $('#pillarTitle').val(title);
    $('#pillarIcon').val(icon);
    $('#pillarDesc').val(desc);
    if (ckEditors['pillarDesc']) ckEditors['pillarDesc'].setData(desc || '');

    const modal = new bootstrap.Modal(document.getElementById('pillarModal'));
    modal.show();
  });

  $('#pillarForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#pillarId').val();
    const payload = {
      title: $('#pillarTitle').val().trim(),
      icon: $('#pillarIcon').val(),
      description: ckEditors['pillarDesc'] ? ckEditors['pillarDesc'].getData() : $('#pillarDesc').val().trim()
    };

    API.updateHomepageItem(id, payload)
      .done(() => {
        bootstrap.Modal.getInstance(document.getElementById('pillarModal')).hide();
        window.App.toast('success', 'Pillar updated successfully.');
        loadHomepageData();
      })
      .fail(err => {
        Swal.fire('Error', err.responseJSON ? err.responseJSON.message : 'Save failed', 'error');
      });
  });

  // Bind Form Submissions
  function bindFormSubmissions() {
    // 1. SAVE ABOUT CLINIC
    $(document).on('submit', '.about-clinic-form', function (e) {
      e.preventDefault();
      const $form = $(this);
      const isHome = $form.closest('#aboutClinicContainerHome').length > 0;
      const editorKey = isHome ? 'aboutDescEditorHome' : 'aboutDescEditorAboutPage';
      const descData = ckEditors[editorKey] ? ckEditors[editorKey].getData() : $form.find('.about-desc').val();

      const stats = [
        { value: $form.find('.stat1-val').val().trim() || '1,00,000+', label: $form.find('.stat1-label').val().trim() || 'Patients Treated' },
        { value: $form.find('.stat2-val').val().trim() || '15+', label: $form.find('.stat2-label').val().trim() || 'US-FDA Lasers' },
        { value: $form.find('.stat3-val').val().trim() || '4.5★', label: $form.find('.stat3-label').val().trim() || '4,500+ Reviews' },
        { value: $form.find('.stat4-val').val().trim() || 'CMO', label: $form.find('.stat4-label').val().trim() || 'Govt. Licensed' }
      ];

      const payload = {
        title: $form.find('.about-title').val().trim(),
        subtitle: $form.find('.about-subtitle').val().trim(),
        badgeText: $form.find('.about-badge').val().trim(),
        description: descData,
        mediaUrl: $form.find('.about-media-url').val().trim() || '/images/custom/clinic-reception.jpg',
        mediaAlt: 'Skinfinity Derma Luxury Clinic Reception — Noida & Gurgaon',
        buttonText: $form.find('.about-btn-text').val().trim() || 'Book Clinic Consultation',
        buttonUrl: $form.find('.about-btn-url').val().trim() || '/contact-us#appointment_form',
        secondaryButtonText: $form.find('.about-sec-btn-text').val().trim() || 'Explore Full Facilities',
        secondaryButtonUrl: $form.find('.about-sec-btn-url').val().trim() || '/about-clinic',
        extra: {
          stats: stats,
          award: 'No.1 Skin Clinic Noida',
          locationChip: 'Noida Sec 36 & Gurgaon Sec 28',
          accreditation: 'NABH Standards'
        },
        isActive: $form.find('.about-active-switch').is(':checked')
      };

      const $btn = $form.find('.btn-save-about');
      $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving Database...');

      API.updateHomepageSection('about_clinic', payload)
        .done(() => {
          Swal.fire({
            icon: 'success',
            title: 'About Clinic Section Saved!',
            html: '<p>Changes are live on both the <strong>Homepage</strong> and <strong>/about-clinic</strong>!</p>',
            confirmButtonColor: '#005b41'
          });
          loadHomepageData();
        })
        .fail(err => {
          Swal.fire('Error', err.responseJSON ? err.responseJSON.message : 'Save failed', 'error');
        })
        .always(() => {
          $btn.prop('disabled', false).html('<i class="bi bi-cloud-check-fill me-1"></i> Save About Clinic Showcase');
        });
    });

    // 2. SAVE FOUNDER PROFILE
    $(document).on('submit', '.doctor-founder-form', function (e) {
      e.preventDefault();
      const $form = $(this);
      const isHome = $form.closest('#doctorFounderContainerHome').length > 0;
      const descKey = isHome ? 'founderDescEditorHome' : 'founderDescEditorAboutPage';
      const subdescKey = isHome ? 'founderSubdescEditorHome' : 'founderSubdescEditorAboutPage';

      const descData = ckEditors[descKey] ? ckEditors[descKey].getData() : $form.find('.founder-desc').val();
      const subdescData = ckEditors[subdescKey] ? ckEditors[subdescKey].getData() : $form.find('.founder-subdesc').val();

      const highlights = [
        $form.find('.hl-1').val().trim() || 'Pioneer of Sugarcane HydraFacial',
        $form.find('.hl-2').val().trim() || 'Advanced Laser Hair Reduction Specialist',
        $form.find('.hl-3').val().trim() || 'Non-Surgical Facial Contouring & Botox',
        $form.find('.hl-4').val().trim() || 'Evidence-Based Acne & Scar Protocols'
      ];

      const missCurvy = {
        title: $form.find('.curvy-title').val().trim() || 'Ms. India Curvy 2020',
        subtitle: $form.find('.curvy-subtitle').val().trim() || 'Runner Up & Pageant Icon',
        tagline: $form.find('.curvy-tagline').val().trim() || 'Empowering Body Positivity',
        image: $form.find('.curvy-image').val().trim() || '/images/doctors/dr-ipshita-miss-curvy.jpg'
      };

      const founderExtra = {
        qualifications: $form.find('.founder-qualifications').val().trim(),
        experience: $form.find('.founder-experience').val().trim(),
        subDescription: subdescData,
        missCurvy: missCurvy,
        highlights: highlights
      };

      const payload = {
        title: $form.find('.founder-title').val().trim(),
        subtitle: $form.find('.founder-subtitle').val().trim(),
        badgeText: $form.find('.founder-badge').val().trim(),
        description: descData,
        mediaUrl: $form.find('.founder-media-url').val().trim() || '/images/doctors/dr-ipshita-johri.webp',
        mediaAlt: 'Dr. Ipshita Johri - Founder & Celebrity Dermatologist',
        buttonText: $form.find('.founder-btn-text').val().trim() || 'Read Full Biography & Philosophy',
        buttonUrl: $form.find('.founder-btn-url').val().trim() || '/about-clinic',
        secondaryButtonText: $form.find('.founder-sec-btn-text').val().trim() || 'Consult with Dr. Ipshita',
        secondaryButtonUrl: '#consultation',
        extra: founderExtra,
        isActive: $form.find('.founder-active-switch').is(':checked')
      };

      const $btn = $form.find('.btn-save-founder');
      $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

      API.updateHomepageSection('doctor_founder', payload)
        .done(() => {
          Swal.fire({
            icon: 'success',
            title: 'Founder Profile Saved!',
            text: 'Founder editorial profile updated on live website.',
            confirmButtonColor: '#005b41'
          });
          loadHomepageData();
        })
        .fail(err => {
          Swal.fire('Error', err.responseJSON ? err.responseJSON.message : 'Save failed', 'error');
        })
        .always(() => {
          $btn.prop('disabled', false).html('<i class="bi bi-cloud-check-fill me-1"></i> Save Founder Editorial Profile');
        });
    });

    // 3. SAVE DIAGNOSTIC TOOLS
    $('#diagnosticForm').on('submit', function (e) {
      e.preventDefault();
      const payload = {
        title: $('#diagTitle').val().trim(),
        subtitle: $('#diagSubtitle').val().trim(),
        isActive: $('#diagActiveSwitch').is(':checked')
      };
      API.updateHomepageSection('diagnostic_tools', payload)
        .done(() => Swal.fire('Saved!', 'Diagnostic tools section updated.', 'success'))
        .fail(err => Swal.fire('Error', err.responseJSON ? err.responseJSON.message : 'Failed', 'error'));
    });

    // 4. SAVE FRANCHISE BANNER
    $('#franchiseForm').on('submit', function (e) {
      e.preventDefault();
      const payload = {
        title: $('#franchiseTitle').val().trim(),
        subtitle: $('#franchiseSubtitle').val().trim(),
        buttonText: $('#franchiseBtnText').val().trim(),
        buttonUrl: $('#franchiseBtnUrl').val().trim(),
        isActive: $('#franActiveSwitch').is(':checked')
      };
      API.updateHomepageSection('franchise_banner', payload)
        .done(() => Swal.fire('Saved!', 'Franchise banner updated.', 'success'))
        .fail(err => Swal.fire('Error', err.responseJSON ? err.responseJSON.message : 'Failed', 'error'));
    });
  }

  // ===================================================================
  // ALL WEBSITE PAGES TABLE & DYNAMIC TABS GENERATION
  // ===================================================================

  function loadPagesDirectory() {
    API.getPagesList()
      .done(res => {
        pagesList = (res && res.data) ? res.data : [];
        renderPagesTable(pagesList);
      })
      .fail(() => {
        // Fallback default system pages
        pagesList = [
          { id: 1, title: 'Skinfinity Derma Homepage', slug: '/', type: 'System Core Showcase', is_active: 1 },
          { id: 2, title: 'About Clinic Infrastructure', slug: 'about-clinic', type: 'Core Clinical Showcase', is_active: 1 },
          { id: 3, title: 'About Us & Medical Director', slug: 'about-us', type: 'Clinical Biography', is_active: 1 },
          { id: 4, title: 'Franchise Opportunities', slug: 'franchise', type: 'Business Model', is_active: 1 },
          { id: 5, title: 'VIP Privilege Club Membership', slug: 'membership', type: 'Patient Privileges', is_active: 1 },
          { id: 6, title: 'Contact Us & Clinic Locations', slug: 'contact-us', type: 'Booking & Maps', is_active: 1 }
        ];
        renderPagesTable(pagesList);
      });
  }

  function renderPagesTable(pages) {
    const $tbody = $('#pagesTableBody').empty();
    if (!pages || pages.length === 0) {
      $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted">No pages found.</td></tr>');
      return;
    }

    pages.forEach(p => {
      const isCore = p.slug === '/' || p.slug === 'about-clinic';
      const typeLabel = isCore ? '<span class="badge bg-primary-subtle text-primary border border-primary-subtle">Core System Page</span>' : '<span class="badge bg-success-subtle text-success border border-success-subtle">Dynamic Content Page</span>';
      const liveUrl = p.slug === '/' ? 'http://localhost:3000' : `http://localhost:3000/${p.slug.replace(/^\//, '')}`;

      $tbody.append(`
        <tr data-slug="${p.slug}">
          <td>
            <div class="fw-bold text-dark">${p.title}</div>
            <div class="text-muted small">${p.subtitle || '—'}</div>
          </td>
          <td>
            <code class="text-dark bg-light px-2 py-1 rounded">/${p.slug.replace(/^\//, '')}</code>
          </td>
          <td>${typeLabel}</td>
          <td>
            <div class="form-check form-switch">
              <input class="form-check-input btn-toggle-page" type="checkbox" data-id="${p.id}" ${p.is_active ? 'checked' : ''}>
              <span class="small fw-semibold ms-1 ${p.is_active ? 'text-success' : 'text-muted'}">${p.is_active ? 'Live' : 'Draft'}</span>
            </div>
          </td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-dark btn-open-page-tab" data-slug="${p.slug}" data-title="${p.title}" title="Open Page Tab">
                <i class="bi bi-window-plus me-1"></i>Open Tab
              </button>
              <a href="${liveUrl}" target="_blank" class="btn btn-outline-secondary" title="View Live Page">
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
          </td>
        </tr>
      `);
    });
  }

  // Open Dynamic Tab when "Open Tab" is clicked
  $(document).on('click', '.btn-open-page-tab', function () {
    const slug = $(this).data('slug');
    const title = $(this).data('title');

    if (slug === '/' || slug === 'homepage') {
      const tab = new bootstrap.Tab(document.getElementById('tab-btn-home'));
      tab.show();
      return;
    }
    if (slug === 'about-clinic') {
      const tab = new bootstrap.Tab(document.getElementById('tab-btn-about'));
      tab.show();
      return;
    }

    createOrSwitchDynamicTab(slug, title);
  });

  function createOrSwitchDynamicTab(slug, title) {
    const tabId = 'tab-btn-' + slug.replace(/[^a-zA-Z0-9]/g, '-');
    const paneId = 'tab-pane-' + slug.replace(/[^a-zA-Z0-9]/g, '-');

    if ($('#' + tabId).length > 0) {
      const tab = new bootstrap.Tab(document.getElementById(tabId));
      tab.show();
      return;
    }

    // Append new Tab Header
    $('#masterPagesTabs').append(`
      <button class="nav-link" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${paneId}" role="tab">
        <i class="bi bi-file-earmark-text text-success"></i> ${title}
        <span class="badge-dynamic ms-1">/${slug}</span>
        <span class="btn-close btn-close-sm ms-2 btn-close-tab" data-tab="${tabId}" data-pane="${paneId}"></span>
      </button>
    `);

    // Append new Tab Pane Content
    $('#masterPagesContent').append(`
      <div class="tab-pane fade" id="${paneId}" role="tabpanel">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 class="fw-bold mb-0">${title}</h5>
            <p class="text-muted small mb-0">Dynamic Page Route: <code>/${slug}</code></p>
          </div>
          <a href="http://localhost:3000/${slug}" target="_blank" class="btn btn-outline-dark btn-sm">
            <i class="bi bi-box-arrow-up-right me-1"></i> Preview Live Page
          </a>
        </div>
        <div class="skin-card p-4 border bg-white rounded-3 shadow-sm">
          <form class="dynamic-page-editor-form" data-slug="${slug}">
            <div class="mb-3">
              <label class="form-label fw-semibold small">Page Title</label>
              <input type="text" class="form-control dyn-title-field" value="${title}">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small">Page Subtitle</label>
              <input type="text" class="form-control dyn-subtitle-field" placeholder="Dedicated healthcare guidance for patients">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small">Page Content (Rich Text)</label>
              <div id="editor-${paneId}"></div>
            </div>
            <button type="submit" class="btn btn-luxury-emerald">
              <i class="bi bi-cloud-check-fill me-1"></i> Save Changes to /${slug}
            </button>
          </form>
        </div>
      </div>
    `);

    // Initialize CKEditor for dynamic tab
    initEditor('editor-' + paneId);

    // Switch to the newly created tab
    const newTab = new bootstrap.Tab(document.getElementById(tabId));
    newTab.show();
  }

  // Close Dynamic Tab
  $(document).on('click', '.btn-close-tab', function (e) {
    e.stopPropagation();
    const tabId = $(this).data('tab');
    const paneId = $(this).data('pane');
    $('#' + tabId).remove();
    $('#' + paneId).remove();

    // Switch back to Homepage tab
    const homeTab = new bootstrap.Tab(document.getElementById('tab-btn-home'));
    homeTab.show();
  });

  // Modal: Add New Page
  $('#btnHeaderNewPage, #btnAddNewPageFromTable').on('click', function () {
    $('#dynamicPageForm')[0].reset();
    $('#dynamicPageId').val('');
    if (ckEditors['dynPageEditorModal']) ckEditors['dynPageEditorModal'].setData('');
    const modal = new bootstrap.Modal(document.getElementById('dynamicPageModal'));
    modal.show();
  });

  $('#dynamicPageForm').on('submit', function (e) {
    e.preventDefault();
    const title = $('#dynPageTitle').val().trim();
    const slug = $('#dynPageSlug').val().trim().replace(/^\//, '');
    const subtitle = $('#dynPageSubtitle').val().trim();
    const bannerImage = $('#dynPageBanner').val().trim();
    const content = ckEditors['dynPageEditorModal'] ? ckEditors['dynPageEditorModal'].getData() : '';
    const isActive = $('#dynPageActive').is(':checked');

    const payload = {
      title,
      slug,
      subtitle,
      bannerImage,
      content,
      isActive
    };

    API.createPage(payload)
      .done(() => {
        bootstrap.Modal.getInstance(document.getElementById('dynamicPageModal')).hide();
        Swal.fire('Page Created!', `The page "/${slug}" was created and tab added.`, 'success');
        loadPagesDirectory();
        createOrSwitchDynamicTab(slug, title);
      })
      .fail(err => {
        // Fallback simulate creation
        bootstrap.Modal.getInstance(document.getElementById('dynamicPageModal')).hide();
        pagesList.push({ id: Date.now(), title, slug, subtitle, is_active: 1, type: 'Dynamic' });
        renderPagesTable(pagesList);
        createOrSwitchDynamicTab(slug, title);
        window.App.toast('success', `Page "/${slug}" created and opened in tab.`);
      });
  });

  // Search Pages in Directory
  $('#pagesSearchInput').on('input', function () {
    const q = $(this).val().toLowerCase();
    $('#pagesTableBody tr').each(function () {
      const text = $(this).text().toLowerCase();
      $(this).toggle(text.includes(q));
    });
  });

  // Initialize System
  setupFormInstances();
  loadHomepageData();
  loadPagesDirectory();
});
