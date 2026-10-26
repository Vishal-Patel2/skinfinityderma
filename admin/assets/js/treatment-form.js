/**
 * Skinfinity Derma Admin Dashboard
 * Treatment Form Controller (Add / Edit / Preview)
 */

$(document).ready(function () {
  'use strict';

  const urlParams = new URLSearchParams(window.location.search);
  const treatmentId = urlParams.get('id');

  let categoriesData = [];
  let concernsData = [];

  // Initialize Select2 with Bootstrap 5 theme
  $('#treatmentConcerns').select2({
    theme: 'bootstrap-5',
    placeholder: 'Select target concerns...',
    width: '100%',
    allowClear: true
  });

  // Dropzone setup
  $('#treatmentDropzone').on('click', function () {
    $('#treatmentFeaturedFile').trigger('click');
  });

  // Image preview setup
  window.App.setupImagePreview(
    '#treatmentFeaturedFile',
    '#treatmentPreviewImg',
    '#btnRemoveTreatmentImg',
    '#treatmentFeaturedImageUrl'
  );

  // Sync Featured Image preview to the Live Card
  $('#treatmentFeaturedImageUrl').on('change input', function () {
    const url = $(this).val();
    if (url) {
      $('#cardPreviewImg').attr('src', url);
    }
  });

  // Observe src changes on #treatmentPreviewImg
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === 'src') {
        const src = $('#treatmentPreviewImg').attr('src');
        if (src) {
          $('#cardPreviewImg').attr('src', src);
        }
      }
    });
  });
  if (document.getElementById('treatmentPreviewImg')) {
    observer.observe(document.getElementById('treatmentPreviewImg'), { attributes: true });
  }

  // Auto slugify
  $('#treatmentName').on('input', function () {
    if (!treatmentId) {
      $('#treatmentSlug').val(window.App.slugify($(this).val()));
    }
    updateLivePreview();
  });

  $('#btnRegenerateSlug').on('click', function () {
    $('#treatmentSlug').val(window.App.slugify($('#treatmentName').val()));
  });

  // Live Card Preview Sync
  function updateLivePreview() {
    const name = $('#treatmentName').val().trim() || 'Treatment Name';
    const shortDesc = $('#treatmentShortDesc').val().trim() || 'Short summary of the procedure and clinical advantages...';
    const price = $('#treatmentPrice').val();
    const origPrice = $('#treatmentOriginalPrice').val();
    const discount = $('#treatmentDiscount').val().trim();
    const duration = $('#treatmentDuration').val().trim() || '45 Mins';
    const rating = $('#treatmentRating').val();
    const isFeatured = $('#treatmentIsFeatured').is(':checked');
    const isActive = $('#treatmentIsActive').is(':checked');

    // Selected Category Name
    const catId = $('#treatmentCategory').val();
    const cat = categoriesData.find(c => c.id === catId);
    $('#cardPreviewCat').text(cat ? cat.name : 'Category');

    // Selected Concerns Badges
    const selectedConcernIds = $('#treatmentConcerns').val() || [];
    const $concernsContainer = $('#cardPreviewConcerns').empty();
    if (selectedConcernIds.length === 0) {
      $concernsContainer.append('<span class="badge badge-pill-soft">Dermatology</span>');
    } else {
      selectedConcernIds.forEach(cid => {
        const con = concernsData.find(c => c.id === cid);
        if (con) {
          $concernsContainer.append(`<span class="badge badge-pill-soft">${con.name}</span>`);
        }
      });
    }

    $('#cardPreviewName').text(name);
    $('#cardPreviewShortDesc').text(shortDesc);

    if (price) {
      $('#cardPreviewPrice').text(window.App.formatCurrency(price));
    } else {
      $('#cardPreviewPrice').text('On Consultation');
    }

    if (origPrice && Number(origPrice) > Number(price)) {
      $('#cardPreviewOrigPrice').text(window.App.formatCurrency(origPrice)).removeClass('d-none');
    } else {
      $('#cardPreviewOrigPrice').addClass('d-none');
    }

    if (discount) {
      $('#cardPreviewDiscount').text(discount).removeClass('d-none');
    } else {
      $('#cardPreviewDiscount').addClass('d-none');
    }

    $('#cardPreviewDuration').html(`<i class="bi bi-clock me-1"></i>${duration}`);

    if (rating) {
      $('#cardPreviewRating').html(`<i class="bi bi-star-fill me-1"></i>${rating}`).removeClass('d-none');
    } else {
      $('#cardPreviewRating').addClass('d-none');
    }

    if (isFeatured) {
      $('#previewFeaturedTag').removeClass('d-none');
    } else {
      $('#previewFeaturedTag').addClass('d-none');
    }

    if (isActive) {
      $('#previewStatusBadge').removeClass('badge-inactive').addClass('badge-active').text('Active');
    } else {
      $('#previewStatusBadge').removeClass('badge-active').addClass('badge-inactive').text('Draft / Inactive');
    }
  }

  // Bind input listeners for live card preview
  $('#treatmentShortDesc, #treatmentPrice, #treatmentOriginalPrice, #treatmentDiscount, #treatmentDuration, #treatmentRating, #treatmentCategory, #treatmentConcerns, #treatmentIsFeatured, #treatmentIsActive')
    .on('input change', updateLivePreview);

  // -------------------------------------------------------------
  // Repeaters: Process Steps & FAQs
  // -------------------------------------------------------------
  function addProcessStep(title, desc) {
    const index = $('#processStepsContainer .repeater-card').length + 1;
    const html = `
      <div class="repeater-card">
        <button type="button" class="btn btn-sm btn-icon btn-outline-danger repeater-remove-btn" title="Remove Step">
          <i class="bi bi-x"></i>
        </button>
        <div class="fw-bold small text-secondary mb-2">Step ${index}</div>
        <div class="mb-2">
          <input type="text" class="form-control form-control-sm step-title" placeholder="Step Title (e.g. Cleansing & Resurfacing)" value="${title || ''}" required>
        </div>
        <div>
          <textarea class="form-control form-control-sm step-desc" rows="2" placeholder="Description of what occurs during this step...">${desc || ''}</textarea>
        </div>
      </div>
    `;
    $('#processStepsContainer').append(html);
  }

  $('#btnAddProcessStep').on('click', function () {
    addProcessStep('', '');
  });

  function addFaq(q, a) {
    const html = `
      <div class="repeater-card">
        <button type="button" class="btn btn-sm btn-icon btn-outline-danger repeater-remove-btn" title="Remove FAQ">
          <i class="bi bi-x"></i>
        </button>
        <div class="mb-2">
          <input type="text" class="form-control form-control-sm faq-question" placeholder="Question (e.g. Is there any recovery downtime?)" value="${q || ''}" required>
        </div>
        <div>
          <textarea class="form-control form-control-sm faq-answer" rows="2" placeholder="Answer...">${a || ''}</textarea>
        </div>
      </div>
    `;
    $('#faqsContainer').append(html);
  }

  $('#btnAddFaq').on('click', function () {
    addFaq('', '');
  });

  $(document).on('click', '.repeater-remove-btn', function () {
    $(this).closest('.repeater-card').remove();
  });

  // -------------------------------------------------------------
  // Data Loading: Categories, Concerns & Existing Treatment Data
  // -------------------------------------------------------------
  function initializeForm() {
    return $.when(
      window.API.getCategories(),
      window.API.getConcerns()
    ).done(function (catRes, conRes) {
      if (catRes[0].success) {
        categoriesData = catRes[0].data;
        const $catSelect = $('#treatmentCategory');
        $catSelect.empty().append('<option value="">Select Category...</option>');
        categoriesData.forEach(function (cat) {
          $catSelect.append(`<option value="${cat.id}">${cat.name}</option>`);
        });
      }

      if (conRes[0].success) {
        concernsData = conRes[0].data;
        const $conSelect = $('#treatmentConcerns');
        $conSelect.empty();
        concernsData.forEach(function (con) {
          $conSelect.append(`<option value="${con.id}">${con.name}</option>`);
        });
        $conSelect.trigger('change');
      }

      if (treatmentId) {
        // Edit Mode
        $('#pageTitleHeading').text('Edit Treatment');
        $('#breadcrumbCurrent').text('Edit Treatment');
        $('#treatmentId').val(treatmentId);
        $('#btnDeleteTreatment').removeClass('d-none');

        window.API.getTreatment(treatmentId).done(function (res) {
          if (!res.success) return;
          const t = res.data;

          $('#treatmentName').val(t.name);
          $('#treatmentSlug').val(t.slug);
          $('#treatmentCategory').val(t.categoryId);
          $('#treatmentConcerns').val(t.concernIds || []).trigger('change');
          $('#treatmentShortDesc').val(t.shortDescription);
          $('#treatmentFullDesc').val(t.fullDescription || '');

          if (t.featuredImage) {
            $('#treatmentFeaturedImageUrl').val(t.featuredImage);
            $('#treatmentPreviewImg').attr('src', t.featuredImage);
            $('#treatmentPreviewWrap').removeClass('d-none');
            $('#cardPreviewImg').attr('src', t.featuredImage);
          }

          $('#treatmentPrice').val(t.price !== null ? t.price : '');
          $('#treatmentOriginalPrice').val(t.originalPrice !== null ? t.originalPrice : '');
          $('#treatmentDiscount').val(t.discountLabel || '');
          $('#treatmentDuration').val(t.estimatedDuration || '');
          $('#treatmentRating').val(t.displayRating !== null ? t.displayRating : '');
          $('#treatmentOrder').val(t.displayOrder || 1);
          $('#treatmentIsActive').prop('checked', t.isActive);
          $('#treatmentIsFeatured').prop('checked', t.isFeatured);

          $('#treatmentSuitability').val(t.suitability || '');
          $('#treatmentAftercare').val(t.aftercare || '');

          $('#treatmentSeoH1').val(t.seoH1 || '');
          $('#treatmentSeoUrl').val(t.seoUrl || '');
          $('#treatmentSeoTitle').val(t.seoTitle || '');
          $('#treatmentSeoDesc').val(t.seoDescription || '');
          $('#treatmentSeoKeywords').val(t.seoKeywords || '');
          $('#treatmentSeoRobots').val(t.seoRobots || 'index, follow');

          $('#treatmentOgTitle').val(t.ogTitle || '');
          $('#treatmentOgType').val(t.ogType || 'website');
          $('#treatmentOgSiteName').val(t.ogSiteName || 'Skinfinity Derma');
          $('#treatmentOgUrl').val(t.ogUrl || '');
          $('#treatmentOgImage').val(t.ogImage || '');
          $('#treatmentOgDesc').val(t.ogDescription || '');

          $('#treatmentSchemaType').val(t.schemaType || 'MedicalProcedure');
          $('#treatmentSchemaMarkup').val(t.schemaMarkup || '');

          // Render existing Process Steps
          if (Array.isArray(t.process) && t.process.length > 0) {
            t.process.forEach(p => addProcessStep(p.title, p.desc));
          } else {
            addProcessStep('Cleanse & Prepare', 'Deep cleansing and topical preparation of the treatment area.');
          }

          // Render existing FAQs
          if (Array.isArray(t.faqs) && t.faqs.length > 0) {
            t.faqs.forEach(f => addFaq(f.q, f.a));
          } else {
            addFaq('Is there any downtime?', 'None. Patients can return to daily activities immediately.');
          }

          updateLivePreview();
        });
      } else {
        // Create Mode defaults
        addProcessStep('Cleanse & Prepare', 'Deep cleansing and topical preparation of the treatment area.');
        addProcessStep('Core Procedure', 'Application of targeted therapeutic energy or active serum delivery.');
        addFaq('Is the treatment painful?', 'The treatment is virtually painless and very well tolerated.');
        updateLivePreview();
      }
    });
  }

  // -------------------------------------------------------------
  // Form Submission
  // -------------------------------------------------------------
  $('#treatmentForm').on('submit', function (e) {
    e.preventDefault();

    const name = $('#treatmentName').val().trim();
    const slug = $('#treatmentSlug').val().trim();
    const categoryId = $('#treatmentCategory').val();
    const shortDesc = $('#treatmentShortDesc').val().trim();
    const featuredImage = $('#treatmentFeaturedImageUrl').val().trim() || $('#cardPreviewImg').attr('src');

    if (!name || !slug) {
      window.App.toast('error', 'Treatment Name and URL Slug are required');
      $('#tab-general').tab('show');
      return;
    }

    if (!categoryId) {
      window.App.toast('error', 'Please select a Category');
      $('#tab-general').tab('show');
      return;
    }

    if (!shortDesc) {
      window.App.toast('error', 'Please provide a short description for the treatment');
      $('#tab-general').tab('show');
      return;
    }

    // Collect process steps
    const processSteps = [];
    $('#processStepsContainer .repeater-card').each(function () {
      const title = $(this).find('.step-title').val().trim();
      const desc = $(this).find('.step-desc').val().trim();
      if (title) {
        processSteps.push({ title, desc });
      }
    });

    // Collect FAQs
    const faqs = [];
    $('#faqsContainer .repeater-card').each(function () {
      const q = $(this).find('.faq-question').val().trim();
      const a = $(this).find('.faq-answer').val().trim();
      if (q) {
        faqs.push({ q, a });
      }
    });

    const payload = {
      name: name,
      slug: slug,
      categoryId: categoryId,
      concernIds: $('#treatmentConcerns').val() || [],
      shortDescription: shortDesc,
      fullDescription: $('#treatmentFullDesc').val().trim(),
      featuredImage: featuredImage,
      price: $('#treatmentPrice').val() || null,
      originalPrice: $('#treatmentOriginalPrice').val() || null,
      discountLabel: $('#treatmentDiscount').val().trim(),
      estimatedDuration: $('#treatmentDuration').val().trim(),
      displayRating: $('#treatmentRating').val() || null,
      displayOrder: parseInt($('#treatmentOrder').val()) || 1,
      isActive: $('#treatmentIsActive').is(':checked'),
      isFeatured: $('#treatmentIsFeatured').is(':checked'),
      suitability: $('#treatmentSuitability').val().trim(),
      aftercare: $('#treatmentAftercare').val().trim(),
      process: processSteps,
      faqs: faqs,
      seoH1: $('#treatmentSeoH1').val().trim(),
      seoUrl: $('#treatmentSeoUrl').val().trim(),
      seoTitle: $('#treatmentSeoTitle').val().trim(),
      seoDescription: $('#treatmentSeoDesc').val().trim(),
      seoKeywords: $('#treatmentSeoKeywords').val().trim(),
      seoRobots: $('#treatmentSeoRobots').val() || 'index, follow',
      ogTitle: $('#treatmentOgTitle').val().trim(),
      ogType: $('#treatmentOgType').val() || 'website',
      ogSiteName: $('#treatmentOgSiteName').val().trim(),
      ogUrl: $('#treatmentOgUrl').val().trim(),
      ogImage: $('#treatmentOgImage').val().trim(),
      ogDescription: $('#treatmentOgDesc').val().trim(),
      schemaType: $('#treatmentSchemaType').val() || 'MedicalProcedure',
      schemaMarkup: $('#treatmentSchemaMarkup').val().trim()
    };

    const $btn = $('#btnSaveTreatment');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = treatmentId ?
      window.API.updateTreatment(treatmentId, payload) :
      window.API.createTreatment(payload);

    request.done(function (res) {
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Treatment Saved!',
          text: `"${name}" has been published to the clinic catalog.`,
          confirmButtonColor: '#124432',
          confirmButtonText: 'Return to Treatments'
        }).then(function () {
          window.location.href = 'treatments.html';
        });
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save treatment';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-cloud-check-fill me-1"></i> Save & Publish Treatment');
    });
  });

  // Delete Action in Edit Mode
  $('#btnDeleteTreatment').on('click', function () {
    if (!treatmentId) return;

    window.App.confirm(
      'Delete Treatment?',
      'Are you sure you want to delete this treatment? It will be removed from website listings.',
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteTreatment(treatmentId).done(function (res) {
          if (res.success) {
            window.App.toast('success', 'Treatment deleted');
            window.location.href = 'treatments.html';
          }
        });
      }
    });
  });

  // Initialize
  initializeForm();
});
