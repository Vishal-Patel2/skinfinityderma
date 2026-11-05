/**
 * Skinfinity Derma Admin Dashboard
 * Clinical Treatment 4-Tab Detail Configurator & Real-Time Card Synchronizer
 */

$(document).ready(function () {
  'use strict';

  const urlParams = new URLSearchParams(window.location.search);
  let treatmentId = urlParams.get('id');

  let categoriesData = [];
  let concernsData = [];
  let mediaGallery = [];
  let procedureSteps = [];
  let faqList = [];
  let coverImageSrc = '/images/treatments/banner-acne.webp';

  // Initialize Select2 for Target Concerns
  $('#treatmentConcerns').select2({
    theme: 'bootstrap-5',
    placeholder: 'Select target skin & hair concerns...',
    width: '100%',
    allowClear: true
  });

  function itemsToHtml(items) {
    if (!items) return '';
    if (typeof items === 'string') {
      if (items.trim().startsWith('<')) return items;
      items = items.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(items) || items.length === 0) return '';
    return '<ul>' + items.map(it => `<li>${it}</li>`).join('') + '</ul>';
  }

  function htmlToItems(html) {
    if (!html) return [];
    const div = document.createElement('div');
    div.innerHTML = html;
    const lis = div.querySelectorAll('li');
    if (lis.length > 0) {
      return Array.from(lis).map(li => li.innerHTML.trim()).filter(Boolean);
    }
    const ps = div.querySelectorAll('p');
    if (ps.length > 0) {
      return Array.from(ps).map(p => p.innerHTML.trim()).filter(Boolean);
    }
    return html.split('\n').map(s => s.trim()).filter(Boolean);
  }

  const compactToolbar = ['bold', 'italic', 'underline', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'];

  // Initialize CKEditor on Full Clinical Description
  window.App.initCKEditor('#treatmentFullDesc', {
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'underline', 'link', '|',
      'bulletedList', 'numberedList', 'blockQuote', '|',
      'undo', 'redo'
    ]
  });

  // Initialize CKEditors for Card Highlights, Suitability, Guidelines
  window.App.initCKEditor('#treatmentCardHighlights', { toolbar: compactToolbar });
  window.App.initCKEditor('#treatmentSuitability', { toolbar: compactToolbar });
  window.App.initCKEditor('#treatmentPrecautions', { toolbar: compactToolbar });
  window.App.initCKEditor('#treatmentBeforeCare', { toolbar: compactToolbar });
  window.App.initCKEditor('#treatmentAfterCare', { toolbar: compactToolbar });

  // Handle Tab Switch To Ensure CKEditors Resize Beautifully
  $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
    window.dispatchEvent(new Event('resize'));
  });

  // Slug sync
  $('#treatmentName').on('input', function () {
    if (!treatmentId) {
      $('#treatmentSlug').val(window.App.slugify($(this).val()));
    }
    updateLivePreview();
  });

  $('#btnRegenerateSlug').on('click', function () {
    $('#treatmentSlug').val(window.App.slugify($('#treatmentName').val()));
  });

  // Real-Time Live Preview Sync Listeners
  $('#treatmentCategory, #treatmentPrice, #treatmentOriginalPrice, #treatmentDiscountLabel, #treatmentDuration, #treatmentRating, #treatmentShortDesc, #treatmentIsActive').on('input change', function () {
    updateLivePreview();
  });

  $('#treatmentConcerns').on('change', function () {
    updateLivePreview();
  });

  function updateLivePreview() {
    // Title
    const name = $('#treatmentName').val().trim() || 'Acne & Scar Remodeling (Subcision + MNRF)';
    $('#previewCardTitle').text(name);

    // Category
    const catText = $('#treatmentCategory option:selected').text();
    $('#previewCardCategoryBadge').text(catText && catText !== 'Select Category...' ? catText : 'Acne & Scar Revision');

    // Discount
    const discount = $('#treatmentDiscountLabel').val().trim();
    if (discount) {
      $('#previewCardDiscountBadge').text(discount).removeClass('d-none');
    } else {
      $('#previewCardDiscountBadge').text('Featured').removeClass('d-none');
    }

    // Rating
    const rating = $('#treatmentRating').val().trim() || '4.93';
    $('#previewCardRating').text(rating);

    // Subtitle / Short summary
    const shortDesc = $('#treatmentShortDesc').val().trim() || 'Root-Cause Acne Control & Permanent Collagen Scar Remodeling';
    $('#previewCardSubtitle').text(shortDesc);

    // Concerns Pills
    const selectedConcerns = $('#treatmentConcerns option:selected').map(function () {
      return $(this).text();
    }).get();

    const $concernsWrap = $('#previewCardConcerns').empty();
    if (selectedConcerns.length > 0) {
      selectedConcerns.slice(0, 3).forEach(function (c) {
        $concernsWrap.append(`<span class="badge bg-light text-muted border small">${c}</span>`);
      });
    } else {
      $concernsWrap.append('<span class="badge bg-light text-muted border small">Acne & Pimples</span><span class="badge bg-light text-muted border small">Acne Scars</span>');
    }

    // Prices
    const priceVal = $('#treatmentPrice').val();
    const origVal = $('#treatmentOriginalPrice').val();
    if (priceVal) {
      $('#previewCardPrice').text(window.App.formatCurrency(Number(priceVal)));
    } else {
      $('#previewCardPrice').text('₹49,994');
    }

    if (origVal && Number(origVal) > Number(priceVal)) {
      $('#previewCardOriginalPrice').text(window.App.formatCurrency(Number(origVal))).removeClass('d-none');
    } else {
      $('#previewCardOriginalPrice').addClass('d-none');
    }

    // Duration
    const duration = $('#treatmentDuration').val().trim() || '60 mins';
    $('#previewCardDuration').html(`<i class="bi bi-clock me-1 text-success"></i>${duration}`);

    // Status Badge
    const isActive = $('#treatmentIsActive').is(':checked');
    if (isActive) {
      $('#sidebarStatusBadge').text('Active').removeClass('bg-secondary text-secondary').addClass('bg-success-subtle text-success border-success-subtle');
    } else {
      $('#sidebarStatusBadge').text('Draft / Inactive').removeClass('bg-success-subtle text-success border-success-subtle').addClass('bg-secondary text-white');
    }

    // Cover Image
    if (coverImageSrc) {
      $('#previewCardImg').attr('src', coverImageSrc);
    }
  }

  /* ========================================================================== */
  /* HERO MEDIA GALLERY                                                        */
  /* ========================================================================== */

  function renderMediaGallery() {
    const $container = $('#galleryGridContainer').empty();

    if (mediaGallery.length === 0) {
      $container.html('<div class="col-12 text-muted small p-2 fst-italic">No hero images or videos added yet. Upload images or add a YouTube link above.</div>');
      return;
    }

    // Ensure coverImageSrc is strictly a valid image (never YouTube, never null if an image exists)
    const imagesOnly = mediaGallery.filter(function (m) { return m.type === 'image'; });
    const hasValidCover = imagesOnly.some(function (m) { return m.src === coverImageSrc; });
    if (!hasValidCover) {
      coverImageSrc = imagesOnly.length > 0 ? imagesOnly[0].src : '';
    }

    mediaGallery.forEach(function (item, idx) {
      const isCover = item.type === 'image' && item.src === coverImageSrc;

      const badge = item.type === 'youtube' ?
        '<span class="media-card-badge bg-danger text-white"><i class="bi bi-youtube me-1"></i>YOUTUBE</span>' :
        '<span class="media-card-badge bg-primary text-white"><i class="bi bi-image me-1"></i>IMAGE</span>';

      let coverBtn = '';
      if (item.type === 'youtube') {
        coverBtn = '<span class="badge bg-light text-muted w-100 py-1 border d-inline-block text-center" style="font-size: 0.65rem;"><i class="bi bi-play-circle me-1"></i>Video Link</span>';
      } else if (isCover) {
        coverBtn = '<button type="button" class="btn btn-xs btn-success w-100 py-1 fw-bold" style="font-size: 0.7rem;"><i class="bi bi-star-fill me-1"></i>Cover Media</button>';
      } else {
        coverBtn = `<button type="button" class="btn btn-xs btn-outline-secondary w-100 py-1 btn-set-cover" data-index="${idx}" style="font-size: 0.7rem;">Set as Cover</button>`;
      }

      const cardHtml = `
        <div class="col-6 col-md-4 col-xl-2-4 gallery-card-col" style="flex: 0 0 20%; max-width: 20%; cursor: grab;" draggable="true" data-index="${idx}">
          <div class="media-card-item">
            ${badge}
            <button type="button" class="media-card-remove btn-remove-media" data-index="${idx}" title="Remove media">
              <i class="bi bi-x"></i>
            </button>
            <img src="${item.src}" alt="${item.caption || 'Media'}" class="media-card-thumb" onerror="this.src='assets/img/avatar-default.svg'" draggable="false">
            <div class="p-2 bg-white">
              <input type="text" class="form-control form-control-sm mb-1 media-caption-input" data-index="${idx}" value="${item.caption || ''}" placeholder="Alt text / Caption" style="font-size: 0.7rem; padding: 0.2rem 0.4rem;">
              <div class="d-flex justify-content-between align-items-center">
                <div class="flex-grow-1 me-1">
                  ${coverBtn}
                </div>
                <div class="d-flex align-items-center text-muted" title="Drag to reorder" style="cursor: grab;">
                  <i class="bi bi-grip-vertical me-0.5" style="font-size: 0.85rem;"></i>
                  <span class="small fw-bold" style="font-size: 0.65rem;">#${idx + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      $container.append(cardHtml);
    });

    updateLivePreview();
  }

  // High-fidelity image compression: preserves crisp medical details while keeping payload size tiny (~250-400KB)
  function compressImageFile(file, maxWidth, maxHeight, quality) {
    maxWidth = maxWidth || 1920;
    maxHeight = maxHeight || 1920;
    quality = quality || 0.88;

    return new Promise(function (resolve) {
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = function (e) { resolve(e.target.result); };
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          let w = img.width;
          let h = img.height;

          if (w > maxWidth || h > maxHeight) {
            if (w / h > maxWidth / maxHeight) {
              h = Math.round((h * maxWidth) / w);
              w = maxWidth;
            } else {
              w = Math.round((w * maxHeight) / h);
              h = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob(function (blob) {
            resolve({
              dataUrl: canvas.toDataURL('image/jpeg', quality),
              blob: blob || file
            });
          }, 'image/jpeg', quality);
        };
        img.onerror = function () {
          resolve({ dataUrl: e.target.result, blob: file });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Upload button trigger
  $('#btnUploadImageModal').on('click', function () {
    $('#treatmentImageFileInput').trigger('click');
  });

  // Handle local file uploads with high-fidelity client compression & server storage
  $('#treatmentImageFileInput').on('change', async function (e) {
    const files = e.target.files;
    if (!files || !files.length) return;

    if (window.App && window.App.toast) {
      window.App.toast('info', `Optimizing & saving ${files.length} image(s)...`);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressed = await compressImageFile(file, 1600, 1600, 0.85);
        let finalSrc = compressed.dataUrl;

        // Upload compressed file to /uploads/treatments/ with treatmentId prefix for uniqueness
        if (window.API && typeof window.API.uploadTreatmentImage === 'function' && compressed.blob) {
          try {
            const cleanBase = file.name.replace(/\.[^/.]+$/, '');
            const uploadFile = new File([compressed.blob], cleanBase + '.jpg', { type: 'image/jpeg' });
            const uploadRes = await window.API.uploadTreatmentImage(uploadFile, treatmentId || '');
            if (uploadRes && uploadRes.url) {
              finalSrc = uploadRes.url;
            }
          } catch (uploadErr) {
            console.warn('Direct upload failed, using optimized data URL', uploadErr);
          }
        }

        mediaGallery.push({
          type: 'image',
          src: finalSrc,
          caption: file.name.replace(/\.[^/.]+$/, '')
        });
        if (!coverImageSrc) coverImageSrc = finalSrc;
      } catch (err) {
        console.error('Error compressing image:', err);
      }
    }
    renderMediaGallery();
    if (window.App && window.App.toast) {
      window.App.toast('success', `${files.length} image(s) processed & added to gallery!`);
    }
    $(this).val('');
  });

  // Add YouTube video to carousel
  $('#btnAddYtToCarousel').on('click', function () {
    const url = $('#treatmentVideoUrl').val().trim();
    if (!url) {
      window.App.toast('warning', 'Please paste a valid YouTube video link');
      return;
    }

    let ytId = '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) ytId = match[1];
    else if (url.length === 11) ytId = url;

    const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'assets/img/avatar-default.svg';

    mediaGallery.push({
      type: 'youtube',
      src: thumb,
      videoUrl: url,
      youtubeId: ytId,
      caption: 'Procedure Demonstration Video'
    });

    $('#treatmentVideoUrl').val('');
    renderMediaGallery();
    window.App.toast('success', 'YouTube video added to gallery');
  });

  // Remove media (deletes from database & server folder)
  $(document).on('click', '.btn-remove-media', async function () {
    const idx = parseInt($(this).data('index'), 10);
    const item = mediaGallery[idx];
    if (!item) return;

    // If it's an uploaded server image (/uploads/...), delete from server folder & DB
    if (item.type === 'image' && item.src && item.src.startsWith('/uploads/')) {
      const confirmDelete = await Swal.fire({
        title: 'Delete Image?',
        text: 'This image will be permanently removed from this treatment and deleted from the server folder.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel'
      });

      if (!confirmDelete.isConfirmed) {
        return;
      }

      try {
        if (window.API && typeof window.API.deleteTreatmentMediaFile === 'function') {
          await window.API.deleteTreatmentMediaFile(item.src, treatmentId || '');
          if (window.App && window.App.toast) {
            window.App.toast('success', 'Image deleted from server folder and database');
          }
        }
      } catch (err) {
        console.warn('Error deleting image from server:', err);
      }
    }

    const removed = mediaGallery.splice(idx, 1)[0];
    const remainingImages = mediaGallery.filter(function (m) { return m.type === 'image'; });
    if (removed && removed.src === coverImageSrc) {
      coverImageSrc = remainingImages.length > 0 ? remainingImages[0].src : '';
    }
    renderMediaGallery();
  });

  // Set as Cover (Strictly allowed for images only, never videos)
  $(document).on('click', '.btn-set-cover', function () {
    const idx = parseInt($(this).data('index'), 10);
    if (mediaGallery[idx] && mediaGallery[idx].type === 'image') {
      coverImageSrc = mediaGallery[idx].src;
      renderMediaGallery();
    }
  });

  // Caption edit
  $(document).on('input', '.media-caption-input', function () {
    const idx = parseInt($(this).data('index'), 10);
    if (mediaGallery[idx]) {
      mediaGallery[idx].caption = $(this).val();
    }
  });

  // HTML5 Drag and Drop Gallery Reordering
  let dragSrcIndex = null;

  $(document).on('dragstart', '.gallery-card-col', function (e) {
    if ($(e.target).closest('input, button, .media-card-remove, .btn').length) {
      e.preventDefault();
      return false;
    }
    dragSrcIndex = parseInt($(this).data('index'), 10);
    $(this).addClass('dragging');
    if (e.originalEvent && e.originalEvent.dataTransfer) {
      e.originalEvent.dataTransfer.effectAllowed = 'move';
      e.originalEvent.dataTransfer.setData('text/plain', String(dragSrcIndex));
    }
  });

  $(document).on('dragend', '.gallery-card-col', function () {
    $('.gallery-card-col').removeClass('dragging drag-over');
    dragSrcIndex = null;
  });

  $(document).on('dragover', '.gallery-card-col', function (e) {
    e.preventDefault();
    if (e.originalEvent && e.originalEvent.dataTransfer) {
      e.originalEvent.dataTransfer.dropEffect = 'move';
    }
    $(this).addClass('drag-over');
  });

  $(document).on('dragleave', '.gallery-card-col', function () {
    $(this).removeClass('drag-over');
  });

  $(document).on('drop', '.gallery-card-col', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass('drag-over');
    const targetIndex = parseInt($(this).data('index'), 10);
    if (dragSrcIndex !== null && !isNaN(targetIndex) && dragSrcIndex !== targetIndex) {
      // Sync any uncommitted caption inputs from DOM
      $('.media-caption-input').each(function () {
        const cIdx = parseInt($(this).data('index'), 10);
        if (mediaGallery[cIdx]) {
          mediaGallery[cIdx].caption = $(this).val();
        }
      });
      const movedItem = mediaGallery.splice(dragSrcIndex, 1)[0];
      mediaGallery.splice(targetIndex, 0, movedItem);
      renderMediaGallery();
      if (window.App && window.App.toast) {
        window.App.toast('info', 'Media order updated');
      }
    }
    dragSrcIndex = null;
  });

  /* ========================================================================== */
  /* PROCEDURE STEPS MANAGEMENT (TAB 3)                                         */
  /* ========================================================================== */

  function syncStepsFromDOM() {
    procedureSteps.forEach(function (step, idx) {
      const $title = $(`.step-title-input[data-index="${idx}"]`);
      if ($title.length) step.title = $title.val();
      const desc = window.App.getCKData(`step_desc_${idx}`);
      if (desc !== undefined && desc !== null && desc !== '') {
        step.description = desc;
      }
    });
  }

  function renderProcedureSteps() {
    const $container = $('#procedureStepsContainer').empty();

    if (procedureSteps.length === 0) {
      // Default clinical steps if empty
      procedureSteps = [
        { title: 'Consultation & Mapping', description: 'Clinical mapping and dermascope scar topology evaluation.', image: '/images/treatments/banner-acne.webp' },
        { title: 'Topical Anaesthesia', description: '45-minute medical numbing cream ensures a comfortable, pain-free procedure.', image: '/images/treatments/banner-acne.webp' },
        { title: 'Cannula Subcision', description: 'Doctor gently releases tethered fibrotic scar bands beneath depressed craters.', image: '/images/treatments/banner-acne.webp' }
      ];
    }

    procedureSteps.forEach(function (step, idx) {
      const stepNum = String(idx + 1).padStart(2, '0');
      const stepHtml = `
        <div class="procedure-step-card" data-index="${idx}">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center gap-2 flex-grow-1 me-3">
              <span class="procedure-step-badge">Step ${stepNum}</span>
              <input type="text" class="form-control form-control-sm fw-bold step-title-input" data-index="${idx}" value="${step.title || ''}" placeholder="Step Title (e.g. Consultation & Mapping)">
            </div>
            <div class="d-flex align-items-center gap-2">
              <div class="position-relative">
                <img src="${step.image || 'assets/img/avatar-default.svg'}" alt="Step ${stepNum}" class="step-img-thumb" onerror="this.src='assets/img/avatar-default.svg'">
              </div>
              <button type="button" class="btn btn-sm btn-outline-danger btn-remove-step px-2" data-index="${idx}" title="Remove Step">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <div class="mb-1">
            <label class="form-label small text-muted mb-1 fw-semibold"><i class="bi bi-pencil-square me-1"></i>Clinical Protocol Description</label>
            <textarea class="form-control form-control-sm step-desc-input" id="step_desc_${idx}" data-index="${idx}" rows="2" placeholder="Describe clinical protocol performed in this step...">${step.description || ''}</textarea>
          </div>
        </div>
      `;
      $container.append(stepHtml);

      // Initialize CKEditor on step description
      setTimeout(function () {
        window.App.initCKEditor(`#step_desc_${idx}`, {
          toolbar: ['bold', 'italic', 'underline', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
        });
      }, 50);
    });
  }

  $('#btnAddProcedureStep').on('click', function () {
    syncStepsFromDOM();
    procedureSteps.push({
      title: 'New Clinical Step',
      description: 'Step explanation and physician protocol instructions.',
      image: '/images/treatments/banner-acne.webp'
    });
    renderProcedureSteps();
  });

  $(document).on('click', '.btn-remove-step', function () {
    syncStepsFromDOM();
    const idx = parseInt($(this).data('index'), 10);
    procedureSteps.splice(idx, 1);
    renderProcedureSteps();
  });

  $(document).on('input', '.step-title-input', function () {
    const idx = parseInt($(this).data('index'), 10);
    if (procedureSteps[idx]) procedureSteps[idx].title = $(this).val();
  });

  $(document).on('input', '.step-desc-input', function () {
    const idx = parseInt($(this).data('index'), 10);
    if (procedureSteps[idx]) procedureSteps[idx].description = $(this).val();
  });

  /* ========================================================================== */
  /* FAQ REPEATER MANAGEMENT (TAB 3)                                            */
  /* ========================================================================== */

  function syncFaqsFromDOM() {
    faqList.forEach(function (faq, idx) {
      const $q = $(`.faq-q-input[data-index="${idx}"]`);
      if ($q.length) faq.question = $q.val();
      const ans = window.App.getCKData(`faq_a_${idx}`);
      if (ans !== undefined && ans !== null && ans !== '') {
        faq.answer = ans;
      }
    });
  }

  function renderFaqs() {
    const $container = $('#faqsContainer').empty();

    if (faqList.length === 0) {
      faqList = [
        { question: 'Can deep acne scars be permanently removed?', answer: 'While no treatment erases scars 100%, combining Cannula Subcision with MNRF and fractional lasers permanently remodels dermal collagen, delivering 65-85% smoother, flatter skin texture.' },
        { question: 'How much downtime does MNRF have?', answer: 'Unlike older CO2 lasers that caused 7 days of crusting, Gold-Insulated MNRF has minimal social downtime-typically 24 to 36 hours of mild sunburn-like pinkness.' }
      ];
    }

    faqList.forEach(function (faq, idx) {
      const faqHtml = `
        <div class="card p-3 mb-2 border rounded-3 bg-white" data-index="${idx}">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <input type="text" class="form-control form-control-sm fw-bold faq-q-input me-2" data-index="${idx}" value="${faq.question || ''}" placeholder="Question...">
            <button type="button" class="btn btn-sm btn-outline-danger btn-remove-faq px-2" data-index="${idx}" title="Remove FAQ">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div>
            <label class="form-label small text-muted mb-1 fw-semibold"><i class="bi bi-pencil-square me-1"></i>Clinical Answer / Clarification</label>
            <textarea class="form-control form-control-sm faq-a-input" id="faq_a_${idx}" data-index="${idx}" rows="2" placeholder="Answer...">${faq.answer || ''}</textarea>
          </div>
        </div>
      `;
      $container.append(faqHtml);

      // Initialize CKEditor on FAQ answer
      setTimeout(function () {
        window.App.initCKEditor(`#faq_a_${idx}`, {
          toolbar: ['bold', 'italic', 'underline', 'link', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
        });
      }, 50);
    });
  }

  $('#btnAddFaqItem').on('click', function () {
    syncFaqsFromDOM();
    faqList.push({ question: '', answer: '' });
    renderFaqs();
  });

  $(document).on('click', '.btn-remove-faq', function () {
    syncFaqsFromDOM();
    const idx = parseInt($(this).data('index'), 10);
    faqList.splice(idx, 1);
    renderFaqs();
  });

  $(document).on('input', '.faq-q-input', function () {
    const idx = parseInt($(this).data('index'), 10);
    if (faqList[idx]) faqList[idx].question = $(this).val();
  });

  $(document).on('input', '.faq-a-input', function () {
    const idx = parseInt($(this).data('index'), 10);
    if (faqList[idx]) faqList[idx].answer = $(this).val();
  });

  /* ========================================================================== */
  /* INITIAL DATA LOAD                                                          */
  /* ========================================================================== */

  function loadTaxonomiesAndTreatment() {
    $.when(
      window.API.getCategories(),
      window.API.getConcerns()
    ).done(function (catRes, conRes) {
      // 1. Categories
      categoriesData = catRes[0].data || [];
      const $catSelect = $('#treatmentCategory');
      $catSelect.empty().append('<option value="">Select Category...</option>');
      categoriesData.forEach(function (c) {
        $catSelect.append(`<option value="${c.id}">${c.name}</option>`);
      });

      // 2. Concerns
      concernsData = conRes[0].data || [];
      const $conSelect = $('#treatmentConcerns').empty();
      concernsData.forEach(function (c) {
        $conSelect.append(`<option value="${c.id}">${c.name}</option>`);
      });
      $conSelect.trigger('change');

      // 3. If Edit Mode, Fetch Treatment
      if (treatmentId) {
        $('#pageHeadingTitle').text('Edit Treatment');
        $('#breadcrumbCurrent').text('Edit Treatment');
        $('#treatmentId').val(treatmentId);

        window.API.getTreatment(treatmentId).done(function (res) {
          if (!res.success || !res.data) return;
          const t = res.data;

          // Tab 1: General Info
          $('#treatmentName').val(t.name || '');
          $('#treatmentHeroBadge').val(t.tags && t.tags[0] ? t.tags[0] : 'MD DERMATOLOGIST PERFORMED');
          $('#treatmentHighlightTags').val(Array.isArray(t.tags) ? t.tags.join(', ') : (t.tags || ''));
          $('#treatmentSlug').val(t.slug || '');
          $('#treatmentCategory').val(t.categoryId || '');
          $('#treatmentBodyArea').val(t.bodyArea || 'Face');
          $('#treatmentConcerns').val(t.concernIds || []).trigger('change');
          $('#treatmentExplainedSubtitle').val(t.explainedSubtitle || '');
          $('#treatmentShortDesc').val(t.shortDescription || '');
          $('#treatmentFullDesc').val(t.fullDescription || '');
          window.App.setCKData('treatmentFullDesc', t.fullDescription || '');

          // Media Gallery
          mediaGallery = [];
          coverImageSrc = t.bannerImage || '';

          if (Array.isArray(t.galleryImages) && t.galleryImages.length > 0) {
            t.galleryImages.forEach(function (g) {
              const src = typeof g === 'string' ? g : (g && g.src);
              const caption = typeof g === 'object' && g ? (g.caption || '') : '';
              if (src && !mediaGallery.some(function (m) { return m.src === src; })) {
                mediaGallery.push({ type: 'image', src: src, caption: caption });
              }
            });
            [t.bannerImage, t.subImage1, t.subImage2, t.subImage3].forEach(function (s) {
              if (s && !mediaGallery.some(function (m) { return m.src === s; })) {
                mediaGallery.push({ type: 'image', src: s, caption: '' });
              }
            });
          } else {
            if (t.bannerImage) {
              mediaGallery.push({ type: 'image', src: t.bannerImage, caption: t.imageAltText || 'Cover Media' });
            }
            if (t.subImage1) mediaGallery.push({ type: 'image', src: t.subImage1, caption: 'Clinical angle 1' });
            if (t.subImage2) mediaGallery.push({ type: 'image', src: t.subImage2, caption: 'Clinical angle 2' });
            if (t.subImage3) mediaGallery.push({ type: 'image', src: t.subImage3, caption: 'Clinical angle 3' });
          }
          if (t.videoUrl || t.youtubeVideoId) {
            const ytId = t.youtubeVideoId || '';
            const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : (t.videoThumbnail || 'assets/img/avatar-default.svg');
            mediaGallery.push({
              type: 'youtube',
              src: thumb,
              videoUrl: t.videoUrl,
              youtubeId: ytId,
              caption: t.videoTitle || 'Procedure Demonstration Video'
            });
          }
          renderMediaGallery();

          // Tab 2: Pricing & Meta
          $('#treatmentPrice').val(t.price || '');
          $('#treatmentOriginalPrice').val(t.originalPrice || '');
          $('#treatmentDiscountLabel').val(t.discountLabel || t.discountBadge || '23% OFF');
          $('#treatmentCouponNote').val('3000');
          $('#treatmentDuration').val(t.estimatedDuration || t.duration || '60 mins');
          $('#treatmentRating').val(t.displayRating || 4.93);
          $('#treatmentPatientsTreated').val(11204);
          $('#treatmentSessionsInfo').val(t.sessionsInfo || '1 session every 4 weeks, 4-6 sess');
          $('#treatmentEmiMonthly').val(t.emiMonthly || '1666');
          $('#treatmentConsultingDoctor').val('Dr. Sukriti Agarwal (Senior Consultant)');
          $('#treatmentCardHighlights').val(Array.isArray(t.cardHighlights) ? t.cardHighlights.join('\n') : (t.cardHighlights || ''));
          window.App.setCKData('treatmentCardHighlights', itemsToHtml(t.cardHighlights));
          $('#treatmentOrder').val(t.displayOrder || 1);
          $('#treatmentIsActive').prop('checked', t.isActive);
          $('#treatmentIsFeatured').prop('checked', t.isFeatured);

          // Tab 3: Clinical Sections
          $('#treatmentStepHeading').val(`How ${t.name} works`);
          $('#treatmentStepSubtitle').val('5-step dermatologist-calibrated clinical protocol');
          if (Array.isArray(t.process) && t.process.length > 0) {
            procedureSteps = t.process.map(function (p) {
              return { title: p.title || p.step, description: p.description || p.desc, image: p.image || '/images/treatments/banner-acne.webp' };
            });
          }
          renderProcedureSteps();

          $('#treatmentIdealFrequency').val(t.idealFrequency || '1 session every 4 weeks (4-6 sessions for permanent remodeling)');
          $('#treatmentSuitability').val(Array.isArray(t.idealFor) ? t.idealFor.join('\n') : (t.suitability || ''));
          window.App.setCKData('treatmentSuitability', itemsToHtml(t.idealFor || t.suitability));
          $('#treatmentPrecautions').val(Array.isArray(t.notIdealFor) ? t.notIdealFor.join('\n') : (t.precautions || ''));
          window.App.setCKData('treatmentPrecautions', itemsToHtml(t.notIdealFor || t.precautions));
          $('#treatmentBeforeCare').val(Array.isArray(t.beforeTreatment) ? t.beforeTreatment.join('\n') : '');
          window.App.setCKData('treatmentBeforeCare', itemsToHtml(t.beforeTreatment));
          $('#treatmentAfterCare').val(Array.isArray(t.afterTreatment) ? t.afterTreatment.join('\n') : (t.aftercare || ''));
          window.App.setCKData('treatmentAfterCare', itemsToHtml(t.afterTreatment || t.aftercare));

          if (Array.isArray(t.faqs) && t.faqs.length > 0) {
            faqList = t.faqs;
          }
          renderFaqs();

          // Tab 4: SEO
          $('#treatmentH1Tag').val(`Best ${t.name} in Delhi NCR`);
          $('#treatmentCanonicalUrl').val(t.canonicalUrl || `https://www.skinfinityderma.com/treatments/${t.slug}`);
          $('#treatmentSeoTitle').val(t.seoTitle || `${t.name} in Delhi | Skinfinity Derma`);
          $('#treatmentSeoDesc').val(t.seoDescription || t.shortDescription || '');
          $('#treatmentSeoKeywords').val(t.seoKeywords || '');
          $('#treatmentOgTitle').val(t.seoTitle || t.name);
          $('#treatmentOgUrl').val(t.canonicalUrl || `https://www.skinfinityderma.com/treatments/${t.slug}`);
          $('#treatmentOgImage').val(t.ogImage || t.bannerImage || '');
          $('#treatmentOgDesc').val(t.seoDescription || t.shortDescription || '');

          updateLivePreview();
        });
      } else {
        // Add Mode Defaults
        $('#pageHeadingTitle').text('Add New Treatment');
        $('#breadcrumbCurrent').text('New Treatment');
        window.App.setCKData('treatmentCardHighlights', '<ul><li>US-FDA Gold Standard Technology</li><li>Zero Social Downtime</li><li>Visible Improvement from Session 1</li></ul>');
        window.App.setCKData('treatmentSuitability', '<ul><li>Rolling, boxcar, and icepick acne scars</li><li>Persistent cystic or hormonal acne</li><li>Enlarged pores and uneven skin texture</li></ul>');
        window.App.setCKData('treatmentPrecautions', '<ul><li>Keloidal scar tendency on the face</li><li>Active herpes simplex infection</li><li>Uncontrolled bleeding disorders</li></ul>');
        window.App.setCKData('treatmentBeforeCare', '<ul><li>Discontinue retinoids and AHA/BHA acids 3-5 days prior</li><li>Avoid sunburn or outdoor tanning for 7 days before procedure</li></ul>');
        window.App.setCKData('treatmentAfterCare', '<ul><li>Use only prescribed sterile cleanser and barrier cream for 3 days</li><li>Strict broad-spectrum tinted SPF 50+ sunscreen is mandatory</li></ul>');
        renderMediaGallery();
        renderProcedureSteps();
        renderFaqs();
        updateLivePreview();
      }
    });
  }

  /* ========================================================================== */
  /* SAVE & PUBLISH HANDLER                                                     */
  /* ========================================================================== */

  function collectFormData() {
    syncStepsFromDOM();
    syncFaqsFromDOM();

    const name = $('#treatmentName').val().trim();
    const slug = $('#treatmentSlug').val().trim() || window.App.slugify(name);
    const categoryId = $('#treatmentCategory').val();
    const shortDesc = $('#treatmentShortDesc').val().trim();

    if (!name) {
      window.App.toast('error', 'Treatment Name is required.');
      $('#tab-general-btn').click();
      $('#treatmentName').focus();
      return null;
    }
    if (!categoryId) {
      window.App.toast('error', 'Please select a Category.');
      $('#tab-general-btn').click();
      $('#treatmentCategory').focus();
      return null;
    }

    // Media
    const imagesOnly = mediaGallery.filter(function (m) { return m.type === 'image'; });
    const videoItem = mediaGallery.find(function (m) { return m.type === 'youtube'; });

    // Ensure cover image is strictly an image, never a video
    const coverItem = imagesOnly.find(function (m) { return m.src === coverImageSrc; }) || (imagesOnly.length ? imagesOnly[0] : null);
    const bannerImage = coverItem ? coverItem.src : null;

    // Sub-images for legacy columns (remaining images in gallery order, excluding bannerImage)
    const otherImages = imagesOnly.filter(function (m) { return m.src !== bannerImage; });
    const subImage1 = otherImages.length > 0 ? otherImages[0].src : null;
    const subImage2 = otherImages.length > 1 ? otherImages[1].src : null;
    const subImage3 = otherImages.length > 2 ? otherImages[2].src : null;

    // Highlights
    const tagsVal = $('#treatmentHighlightTags').val().trim();
    const tags = tagsVal ? tagsVal.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];

    // Card highlights from CKEditor
    const cardHighlights = htmlToItems(window.App.getCKData('treatmentCardHighlights') || $('#treatmentCardHighlights').val());

    // Suitability & guidelines from CKEditor
    const idealFor = htmlToItems(window.App.getCKData('treatmentSuitability') || $('#treatmentSuitability').val());
    const notIdealFor = htmlToItems(window.App.getCKData('treatmentPrecautions') || $('#treatmentPrecautions').val());
    const beforeTreatment = htmlToItems(window.App.getCKData('treatmentBeforeCare') || $('#treatmentBeforeCare').val());
    const afterTreatment = htmlToItems(window.App.getCKData('treatmentAfterCare') || $('#treatmentAfterCare').val());

    return {
      name: name,
      slug: slug,
      categoryId: categoryId,
      bodyArea: $('#treatmentBodyArea').val(),
      concernIds: $('#treatmentConcerns').val() || [],
      tags: tags,
      explainedSubtitle: $('#treatmentExplainedSubtitle').val().trim(),
      shortDescription: shortDesc,
      fullDescription: window.App.getCKData('treatmentFullDesc') || $('#treatmentFullDesc').val().trim(),

      // Pricing & Meta
      price: $('#treatmentPrice').val() ? Number($('#treatmentPrice').val()) : 0,
      originalPrice: $('#treatmentOriginalPrice').val() ? Number($('#treatmentOriginalPrice').val()) : null,
      discountLabel: $('#treatmentDiscountLabel').val().trim(),
      discountBadge: $('#treatmentDiscountLabel').val().trim(),
      estimatedDuration: $('#treatmentDuration').val().trim() || '60 mins',
      duration: $('#treatmentDuration').val().trim() || '60 mins',
      displayRating: Number($('#treatmentRating').val()) || 4.93,
      sessionsInfo: $('#treatmentSessionsInfo').val().trim(),
      emiMonthly: $('#treatmentEmiMonthly').val() ? parseFloat($('#treatmentEmiMonthly').val()) : null,
      cardHighlights: cardHighlights,
      displayOrder: parseInt($('#treatmentOrder').val(), 10) || 1,
      isActive: $('#treatmentIsActive').is(':checked') ? 1 : 0,
      isFeatured: $('#treatmentIsFeatured').is(':checked') ? 1 : 0,

      // Media
      bannerImage: bannerImage,
      featuredImage: bannerImage,
      subImage1: subImage1,
      subImage2: subImage2,
      subImage3: subImage3,
      galleryImages: imagesOnly.map(function (img) { return { src: img.src, caption: img.caption }; }),
      videoUrl: videoItem ? videoItem.videoUrl : null,
      videoTitle: videoItem ? videoItem.caption : null,
      youtubeVideoId: videoItem ? videoItem.youtubeId : null,

      // Clinical
      process: procedureSteps,
      howItWorksSteps: procedureSteps,
      idealFrequency: $('#treatmentIdealFrequency').val().trim(),
      idealFor: idealFor,
      suitability: idealFor,
      notIdealFor: notIdealFor,
      beforeTreatment: beforeTreatment,
      afterTreatment: afterTreatment,
      aftercare: afterTreatment,
      faqs: faqList.filter(function (f) { return f.question.trim(); }),

      // SEO
      seoTitle: $('#treatmentSeoTitle').val().trim() || null,
      seoDescription: $('#treatmentSeoDesc').val().trim() || null,
      seoKeywords: $('#treatmentSeoKeywords').val().trim() || null,
      canonicalUrl: $('#treatmentCanonicalUrl').val().trim() || null,
      ogImage: $('#treatmentOgImage').val().trim() || bannerImage
    };
  }

  function saveTreatment() {
    const payload = collectFormData();
    if (!payload) return;

    Swal.fire({
      title: 'Saving Treatment...',
      html: '<div class="spinner-border text-success" role="status"></div>',
      allowOutsideClick: false,
      showConfirmButton: false
    });

    const promise = treatmentId ?
      window.API.updateTreatment(treatmentId, payload) :
      window.API.createTreatment(payload);

    promise.done(function (res) {
      Swal.close();
      if (!treatmentId && res.id) {
        treatmentId = res.id;
        $('#treatmentId').val(treatmentId);
        window.history.replaceState({}, '', `treatment-form.html?id=${treatmentId}`);
        $('#pageHeadingTitle').text('Edit Treatment');
        $('#breadcrumbCurrent').text('Edit Treatment');
      }

      Swal.fire({
        icon: 'success',
        title: 'Treatment Saved & Published!',
        text: `"${payload.name}" is securely updated and live on website.`,
        confirmButtonColor: '#005b41',
        confirmButtonText: 'Great, Stay Here'
      });
    }).fail(function (xhr) {
      Swal.close();
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save treatment';
      Swal.fire('Save Failed', msg, 'error');
    });
  }

  // Trigger Save
  $('#btnTopSavePublish, #btnSidebarSave').on('click', function () {
    saveTreatment();
  });

  $('#treatmentMasterForm').on('submit', function (e) {
    e.preventDefault();
    saveTreatment();
  });

  // Delete Treatment
  $('#btnSidebarDelete').on('click', function () {
    if (!treatmentId) {
      window.App.toast('info', 'No treatment saved to delete.');
      return;
    }

    const title = $('#treatmentName').val() || 'this treatment';

    Swal.fire({
      title: 'Delete Treatment?',
      text: `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete Permanently'
    }).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteTreatment(treatmentId).done(function (res) {
          if (res.success) {
            window.location.href = 'treatments.html';
          } else {
            window.App.toast('error', res.message || 'Failed to delete');
          }
        }).fail(function () {
          window.App.toast('error', 'Error deleting treatment');
        });
      }
    });
  });

  // Kick off initialization
  loadTaxonomiesAndTreatment();
});
