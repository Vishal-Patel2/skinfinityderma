/**
 * Skinfinity Derma Admin - Treatment Multi-Step Configurator (Steps 1-6)
 */
$(document).ready(function () {
  'use strict';

  const urlParams = new URLSearchParams(window.location.search);
  let treatmentId = urlParams.get('id');

  let currentStep = 1;
  let categoriesData = [];
  let concernsData = [];
  let allTreatmentsData = [];

  // Initialize Select2
  $('#treatmentConcerns').select2({
    theme: 'bootstrap-5',
    placeholder: 'Select target skin & hair concerns...',
    width: '100%',
    allowClear: true
  });

  $('#treatmentRelated').select2({
    theme: 'bootstrap-5',
    placeholder: 'Select related treatments to recommend...',
    width: '100%',
    allowClear: true
  });

  // Stepper Navigation Logic
  function goToStep(step) {
    if (step < 1 || step > 6) return;
    currentStep = step;

    // Toggle step panes
    $('.step-pane').addClass('d-none');
    $(`#step-pane-${step}`).removeClass('d-none');

    // Update Stepper Nav
    $('.stepper-item').removeClass('active');
    $(`.stepper-item[data-step="${step}"]`).addClass('active');

    // Mark previous steps as completed
    $('.stepper-item').each(function () {
      const s = parseInt($(this).data('step'));
      if (s < step) {
        $(this).addClass('completed');
      } else {
        $(this).removeClass('completed');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $('.stepper-item').on('click', function () {
    const targetStep = parseInt($(this).data('step'));
    goToStep(targetStep);
  });

  $('.btn-next-step').on('click', function () {
    const nextStep = parseInt($(this).data('next'));
    // Basic validation for Step 1
    if (currentStep === 1) {
      const name = $('#treatmentName').val().trim();
      const slug = $('#treatmentSlug').val().trim();
      const cat = $('#treatmentCategory').val();
      const shortDesc = $('#treatmentShortDesc').val().trim();

      if (!name || !slug) {
        window.App.toast('error', 'Treatment Name and URL Slug are required.');
        return;
      }
      if (!cat) {
        window.App.toast('error', 'Please select a Category.');
        return;
      }
      if (!shortDesc) {
        window.App.toast('error', 'Please provide a short description.');
        return;
      }
    }
    goToStep(nextStep);
  });

  $('.btn-prev-step').on('click', function () {
    const prevStep = parseInt($(this).data('prev'));
    goToStep(prevStep);
  });

  // Slugify Helper
  $('#treatmentName').on('input', function () {
    if (!treatmentId) {
      $('#treatmentSlug').val(window.App.slugify($(this).val()));
    }
  });

  $('#btnRegenerateSlug').on('click', function () {
    $('#treatmentSlug').val(window.App.slugify($('#treatmentName').val()));
  });

  // Media Preview and Upload Handlers
  function setupMediaPreview(inputId, previewWrapId, previewImgId, previewTextId) {
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
  }

  setupMediaPreview('#treatmentBannerImage', '#previewWrapMain', '#previewImgMain', '#previewTextMain');
  setupMediaPreview('#treatmentSubImage1', '#previewWrapSub1', '#previewImgSub1', '#previewTextSub1');
  setupMediaPreview('#treatmentSubImage2', '#previewWrapSub2', '#previewImgSub2', '#previewTextSub2');
  setupMediaPreview('#treatmentSubImage3', '#previewWrapSub3', '#previewImgSub3', '#previewTextSub3');

  function handleDirectUpload(fileInputId, targetInputId) {
    $(fileInputId).on('change', function () {
      const file = this.files[0];
      if (!file) return;

      Swal.fire({
        title: 'Uploading Media File...',
        html: `<div class="spinner-border text-success" role="status"></div>`,
        allowOutsideClick: false,
        showConfirmButton: false
      });

      API.uploadMediaFile(file)
        .then(res => {
          Swal.close();
          const fileUrl = res.data ? res.data.file_url : (res.fileUrl || res.url);
          $(targetInputId).val(fileUrl).trigger('change');
          window.App.toast('success', 'File uploaded and attached.');
        })
        .catch(err => {
          Swal.fire('Upload Error', err.message || 'Failed to upload image.', 'error');
        });
    });
  }

  handleDirectUpload('#fileUploadMain', '#treatmentBannerImage');
  handleDirectUpload('#fileUploadSub1', '#treatmentSubImage1');
  handleDirectUpload('#fileUploadSub2', '#treatmentSubImage2');
  handleDirectUpload('#fileUploadSub3', '#treatmentSubImage3');

  // YouTube Thumbnail Auto-Extraction
  $('#treatmentVideoUrl').on('blur change', function () {
    const url = $(this).val().trim();
    if (!url) return;
    let videoId = '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    } else if (url.length === 11) {
      videoId = url;
    }
    if (videoId && !$('#treatmentVideoThumbnail').val()) {
      $('#treatmentVideoThumbnail').val(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    }
  });

  // Benefits Repeater
  function addBenefit(text = '') {
    const id = 'ben_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const html = `
      <div class="repeater-card benefit-item" id="${id}">
        <button type="button" class="btn btn-outline-danger btn-sm repeater-remove-btn py-0 px-2 btn-remove-benefit" title="Remove Benefit">
          <i class="bi bi-trash"></i>
        </button>
        <div class="pe-4">
          <input type="text" class="form-control benefit-text" placeholder="e.g. Stimulates neo-collagenesis deep within the dermis" value="${text.replace(/"/g, '&quot;')}">
        </div>
      </div>
    `;
    $('#benefitsContainer').append(html);
  }

  $('#btnAddBenefit').on('click', () => addBenefit());
  $(document).on('click', '.btn-remove-benefit', function () {
    $(this).closest('.benefit-item').remove();
  });

  // Procedure Steps Repeater
  function addProcessStep(title = '', desc = '') {
    const id = 'step_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const html = `
      <div class="repeater-card process-step-item" id="${id}">
        <button type="button" class="btn btn-outline-danger btn-sm repeater-remove-btn py-0 px-2 btn-remove-step" title="Remove Step">
          <i class="bi bi-trash"></i>
        </button>
        <div class="row g-2 pe-4">
          <div class="col-md-5">
            <input type="text" class="form-control step-title" placeholder="Step Title (e.g. Cleanse & Topical Numbing)" value="${title.replace(/"/g, '&quot;')}">
          </div>
          <div class="col-md-7">
            <input type="text" class="form-control step-desc" placeholder="Step Description (e.g. Skin sanitized and medical-grade anesthetic applied for 40 mins)" value="${desc.replace(/"/g, '&quot;')}">
          </div>
        </div>
      </div>
    `;
    $('#processStepsContainer').append(html);
  }

  $('#btnAddProcessStep').on('click', () => addProcessStep());
  $(document).on('click', '.btn-remove-step', function () {
    $(this).closest('.process-step-item').remove();
  });

  // FAQs Repeater
  function addFaq(q = '', a = '') {
    const id = 'faq_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const html = `
      <div class="repeater-card faq-item" id="${id}">
        <button type="button" class="btn btn-outline-danger btn-sm repeater-remove-btn py-0 px-2 btn-remove-faq" title="Remove FAQ">
          <i class="bi bi-trash"></i>
        </button>
        <div class="pe-4">
          <input type="text" class="form-control mb-2 faq-question" placeholder="Question (e.g. How many sessions will I need?)" value="${q.replace(/"/g, '&quot;')}">
          <textarea class="form-control faq-answer" rows="2" placeholder="Answer (e.g. Most patients see significant improvement after 3-4 sessions)...">${a}</textarea>
        </div>
      </div>
    `;
    $('#faqsContainer').append(html);
  }

  $('#btnAddFaq').on('click', () => addFaq());
  $(document).on('click', '.btn-remove-faq', function () {
    $(this).closest('.faq-item').remove();
  });

  // Gather Form Payload
  function getPayload(asDraft = false) {
    const benefits = [];
    $('#benefitsContainer .benefit-text').each(function () {
      const v = $(this).val().trim();
      if (v) benefits.push(v);
    });

    const processSteps = [];
    $('#processStepsContainer .process-step-item').each(function () {
      const t = $(this).find('.step-title').val().trim();
      const d = $(this).find('.step-desc').val().trim();
      if (t || d) processSteps.push({ title: t, desc: d });
    });

    const faqs = [];
    $('#faqsContainer .faq-item').each(function () {
      const q = $(this).find('.faq-question').val().trim();
      const a = $(this).find('.faq-answer').val().trim();
      if (q || a) faqs.push({ q, a });
    });

    const isActive = asDraft ? false : $('#treatmentPublishSwitch').is(':checked');

    return {
      name: $('#treatmentName').val().trim(),
      slug: $('#treatmentSlug').val().trim(),
      categoryId: $('#treatmentCategory').val() || null,
      concernIds: $('#treatmentConcerns').val() || [],
      shortDescription: $('#treatmentShortDesc').val().trim(),
      fullDescription: $('#treatmentFullDesc').val().trim(),
      displayOrder: parseInt($('#treatmentOrder').val()) || 1,
      isFeatured: $('#treatmentIsFeatured').is(':checked'),
      isActive: isActive,

      // Step 2
      price: $('#treatmentPrice').val() || 0,
      originalPrice: $('#treatmentOriginalPrice').val() || null,
      discountLabel: $('#treatmentDiscount').val().trim(),
      estimatedDuration: $('#treatmentDuration').val().trim(),
      sessionsInfo: $('#treatmentSessionsInfo').val().trim(),
      displayRating: parseFloat($('#treatmentRating').val()) || 4.9,
      emiMonths: parseInt($('#treatmentEmiMonths').val()) || 3,
      emiMonthly: parseFloat($('#treatmentEmiMonthly').val()) || null,
      explainedSubtitle: $('#treatmentExplainedSubtitle').val().trim(),

      // Step 3
      featuredImage: $('#treatmentBannerImage').val().trim() || null,
      bannerImage: $('#treatmentBannerImage').val().trim() || null,
      imageAltText: $('#treatmentImageAlt').val().trim() || null,
      subImage1: $('#treatmentSubImage1').val().trim() || null,
      subImage2: $('#treatmentSubImage2').val().trim() || null,
      subImage3: $('#treatmentSubImage3').val().trim() || null,
      videoUrl: $('#treatmentVideoUrl').val().trim() || null,
      videoTitle: $('#treatmentVideoTitle').val().trim() || null,
      videoThumbnail: $('#treatmentVideoThumbnail').val().trim() || null,

      // Step 4
      benefits: benefits,
      process: processSteps,
      howItWorksSteps: processSteps,
      suitability: $('#treatmentSuitability').val().trim(),
      idealFor: $('#treatmentSuitability').val().trim() ? $('#treatmentSuitability').val().trim().split('\n').filter(Boolean) : [],
      precautions: $('#treatmentPrecautions').val().trim(),
      notIdealFor: $('#treatmentPrecautions').val().trim() ? $('#treatmentPrecautions').val().trim().split('\n').filter(Boolean) : [],
      expectedResults: $('#treatmentExpectedResults').val().trim(),
      aftercare: $('#treatmentAftercare').val().trim(),
      afterTreatment: $('#treatmentAftercare').val().trim() ? $('#treatmentAftercare').val().trim().split('\n').filter(Boolean) : [],

      // Step 5
      faqs: faqs,
      relatedTreatmentIds: $('#treatmentRelated').val() || [],

      // Step 6
      seoTitle: $('#treatmentSeoTitle').val().trim() || null,
      seoKeywords: $('#treatmentSeoKeywords').val().trim() || null,
      seoDescription: $('#treatmentSeoDesc').val().trim() || null,
      canonicalUrl: $('#treatmentCanonicalUrl').val().trim() || null,
      ogImage: $('#treatmentOgImage').val().trim() || null
    };
  }

  // Save Function (Draft or Final)
  function saveTreatment(asDraft = false) {
    const payload = getPayload(asDraft);

    if (!payload.name) {
      window.App.toast('error', 'Treatment Name is required before saving.');
      goToStep(1);
      return;
    }
    if (!payload.slug) {
      window.App.toast('error', 'Unique Slug is required before saving.');
      goToStep(1);
      return;
    }

    Swal.fire({
      title: asDraft ? 'Saving Draft...' : 'Publishing Treatment...',
      html: '<div class="spinner-border text-success" role="status"></div>',
      allowOutsideClick: false,
      showConfirmButton: false
    });

    const promise = treatmentId ?
      API.updateTreatment(treatmentId, payload) :
      API.createTreatment(payload);

    promise.done(function (res) {
      Swal.close();
      if (!treatmentId && res.id) {
        treatmentId = res.id;
        $('#treatmentId').val(treatmentId);
        window.history.replaceState({}, '', `treatment-form.html?id=${treatmentId}`);
      }

      Swal.fire({
        icon: 'success',
        title: asDraft ? 'Draft Saved Successfully' : 'Treatment Published!',
        text: `"${payload.name}" is securely updated in the database.`,
        confirmButtonColor: '#005b41',
        confirmButtonText: 'Stay on Page'
      });
    }).fail(function (xhr) {
      Swal.close();
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save treatment';
      Swal.fire('Save Failed', msg, 'error');
    });
  }

  $('#btnSaveDraft, #btnSaveDraftStep6').on('click', () => saveTreatment(true));

  $('#treatmentForm').on('submit', function (e) {
    e.preventDefault();
    saveTreatment(false);
  });

  // Initialize Data
  function initData() {
    return $.when(
      API.getCategories(),
      API.getConcerns(),
      API.getTreatments()
    ).done(function (catRes, conRes, trtRes) {
      // Categories
      categoriesData = catRes[0].data || [];
      const $catSelect = $('#treatmentCategory');
      $catSelect.empty().append('<option value="">Select Category...</option>');
      categoriesData.forEach(c => {
        $catSelect.append(`<option value="${c.id}">${c.name}</option>`);
      });

      // Concerns
      concernsData = conRes[0].data || [];
      const $conSelect = $('#treatmentConcerns').empty();
      concernsData.forEach(c => {
        $conSelect.append(`<option value="${c.id}">${c.name}</option>`);
      });
      $conSelect.trigger('change');

      // Related Treatments
      allTreatmentsData = trtRes[0].data || [];
      const $relSelect = $('#treatmentRelated').empty();
      allTreatmentsData.forEach(t => {
        if (!treatmentId || t.id !== treatmentId) {
          $relSelect.append(`<option value="${t.id}">${t.name}</option>`);
        }
      });
      $relSelect.trigger('change');

      // If Edit Mode, Load Existing Data
      if (treatmentId) {
        $('#pageTitleHeading').text('Edit Clinical Treatment');
        $('#breadcrumbCurrent').text('Edit Treatment');
        $('#treatmentId').val(treatmentId);

        API.getTreatment(treatmentId).done(function (res) {
          if (!res.success || !res.data) return;
          const t = res.data;

          // Step 1
          $('#treatmentName').val(t.name);
          $('#treatmentSlug').val(t.slug);
          $('#treatmentCategory').val(t.categoryId);
          $('#treatmentConcerns').val(t.concernIds || []).trigger('change');
          $('#treatmentShortDesc').val(t.shortDescription);
          $('#treatmentFullDesc').val(t.fullDescription || '');
          $('#treatmentOrder').val(t.displayOrder || 1);
          $('#treatmentIsFeatured').prop('checked', t.isFeatured);
          $('#treatmentIsActive').prop('checked', t.isActive);

          // Step 2
          $('#treatmentPrice').val(t.price !== null ? t.price : '');
          $('#treatmentOriginalPrice').val(t.originalPrice !== null ? t.originalPrice : '');
          $('#treatmentDiscount').val(t.discountLabel || t.discountBadge || '');
          $('#treatmentDuration').val(t.estimatedDuration || t.duration || '');
          $('#treatmentSessionsInfo').val(t.sessionsInfo || '');
          $('#treatmentRating').val(t.displayRating || 4.9);
          $('#treatmentEmiMonths').val(t.emiMonths || 3);
          $('#treatmentEmiMonthly').val(t.emiMonthly || '');
          $('#treatmentExplainedSubtitle').val(t.explainedSubtitle || '');

          // Step 3
          const heroImg = t.featuredImage || t.bannerImage || '';
          $('#treatmentBannerImage').val(heroImg).trigger('change');
          $('#treatmentImageAlt').val(t.imageAltText || '');
          $('#treatmentSubImage1').val(t.subImage1 || '').trigger('change');
          $('#treatmentSubImage2').val(t.subImage2 || '').trigger('change');
          $('#treatmentSubImage3').val(t.subImage3 || '').trigger('change');
          $('#treatmentVideoUrl').val(t.videoUrl || t.youtubeVideoId || '');
          $('#treatmentVideoTitle').val(t.videoTitle || '');
          $('#treatmentVideoThumbnail').val(t.videoThumbnail || '');

          // Step 4
          $('#treatmentSuitability').val(Array.isArray(t.idealFor) ? t.idealFor.join('\n') : (t.suitability || ''));
          $('#treatmentPrecautions').val(Array.isArray(t.notIdealFor) ? t.notIdealFor.join('\n') : (t.precautions || ''));
          $('#treatmentExpectedResults').val(t.expectedResults || '');
          $('#treatmentAftercare').val(Array.isArray(t.afterTreatment) ? t.afterTreatment.join('\n') : (t.aftercare || ''));

          if (Array.isArray(t.benefits) && t.benefits.length > 0) {
            t.benefits.forEach(b => addBenefit(b));
          } else {
            addBenefit('Deep collagen & elastin synthesis remodeling');
            addBenefit('Subcises tethered scar tissue with targeted radiofrequency');
          }

          if (Array.isArray(t.process) && t.process.length > 0) {
            t.process.forEach(p => addProcessStep(p.title, p.desc));
          } else {
            addProcessStep('Cleanse & Topical Preparation', 'Skin sanitized and medical-grade anesthetic applied.');
            addProcessStep('Core Procedure Delivery', 'Targeted acoustic or energy delivery under clinical monitoring.');
          }

          // Step 5
          if (Array.isArray(t.faqs) && t.faqs.length > 0) {
            t.faqs.forEach(f => addFaq(f.q, f.a));
          } else {
            addFaq('Is the treatment painful?', 'Topical anesthetic ensures comfort throughout the protocol.');
            addFaq('What is the expected recovery time?', 'Mild erythema subsides within 24-48 hours.');
          }

          $('#treatmentRelated').val(t.relatedTreatmentIds || []).trigger('change');

          // Step 6
          $('#treatmentSeoTitle').val(t.seoTitle || '');
          $('#treatmentSeoKeywords').val(t.seoKeywords || '');
          $('#treatmentSeoDesc').val(t.seoDescription || '');
          $('#treatmentCanonicalUrl').val(t.canonicalUrl || '');
          $('#treatmentOgImage').val(t.ogImage || '');
          $('#treatmentPublishSwitch').prop('checked', t.isActive);
        });
      } else {
        // Defaults for new treatment
        addBenefit('Deep dermal rejuvenation and texture smoothing');
        addBenefit('Non-invasive with minimal to zero downtime');
        addProcessStep('Consultation & Diagnostic Analysis', 'Detailed 3D skin evaluation and parameter calibration.');
        addProcessStep('Therapeutic Session', 'Sterile precision treatment delivered by senior specialists.');
        addProcessStep('Post-Procedure Calming Mask', 'Application of cooling peptides and broad-spectrum photoprotection.');
        addFaq('How soon are clinical results visible?', 'Gradual refinement appears within 1-2 weeks, peaking at 4-6 weeks.');
      }
    });
  }

  initData();
});
