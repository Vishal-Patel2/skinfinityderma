/**
 * Skinfinity Derma Admin - Blogs & Articles Controller
 */
(function (window, $) {
  'use strict';

  let allBlogs = [];
  let currentPage = 1;
  const pageSize = 15;

  function loadBlogs() {
    window.API.getBlogs()
      .done(function (res) {
        if (!res.success) return;
        allBlogs = res.data || [];
        updateStats();
        populateCategoryFilter();
        renderFilteredBlogs();
      })
      .fail(function () {
        $('#blogsTableBody').html('<tr><td colspan="7" class="text-center py-4 text-danger">Failed to load articles.</td></tr>');
      });
  }

  function updateStats() {
    $('#statTotalBlogs').text(allBlogs.length);
    const published = allBlogs.filter(b => b.isPublished).length;
    $('#statPublishedBlogs').text(published);
    const totalViews = allBlogs.reduce((acc, b) => acc + (b.viewsCount || 0), 0);
    $('#statTotalViews').text(totalViews.toLocaleString());
    const uniqueCats = new Set(allBlogs.map(b => b.category).filter(Boolean));
    $('#statTotalCats').text(uniqueCats.size);
  }

  function populateCategoryFilter() {
    const uniqueCats = Array.from(new Set(allBlogs.map(b => b.category).filter(Boolean))).sort();
    const currentVal = $('#filterBlogCategory').val();
    let opts = '<option value="">All Categories (' + uniqueCats.length + ')</option>';
    uniqueCats.forEach(cat => {
      opts += `<option value="${cat}">${cat}</option>`;
    });
    $('#filterBlogCategory').html(opts);
    if (currentVal) $('#filterBlogCategory').val(currentVal);
  }

  function getFilteredBlogs() {
    const q = ($('#searchBlogInput').val() || '').toLowerCase().trim();
    const cat = $('#filterBlogCategory').val();
    const status = $('#filterBlogStatus').val();

    return allBlogs.filter(b => {
      const matchSearch = !q ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.slug && b.slug.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q));

      const matchCat = !cat || b.category === cat;
      const matchStatus = !status ||
        (status === 'published' && b.isPublished) ||
        (status === 'draft' && !b.isPublished);

      return matchSearch && matchCat && matchStatus;
    });
  }

  function formatDoctorName(raw) {
    if (!raw) return 'Dr. Ipshita Johri';
    const l = raw.toLowerCase().trim();
    if (l.includes('aanchal') || l.includes('anchal')) return 'Dr. Aanchal Bansal';
    if (l.includes('sukriti')) return 'Dr. Sukriti';
    if (l.includes('neha')) return 'Dr. Neha Dhankar';
    if (l.includes('shradha') || l.includes('shraddha')) return 'Dr. Shradha';
    if (l.includes('ipshita')) return 'Dr. Ipshita Johri';
    return raw;
  }

  function renderFilteredBlogs() {
    const filtered = getFilteredBlogs();
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, total);
    const pageItems = filtered.slice(startIdx, endIdx);

    if (total === 0) {
      $('#blogsTableBody').html('<tr><td colspan="7" class="text-center py-5 text-muted"><i class="bi bi-search fs-3 d-block mb-2"></i>No matching articles found.</td></tr>');
      $('#blogsShowingText').text('Showing 0 of 0 articles');
      $('#blogsPagination').html('');
      return;
    }

    const html = pageItems.map((b) => {
      const statusBadge = b.isPublished
        ? '<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1" style="font-size: 0.72rem;"><i class="bi bi-check-circle-fill me-1"></i>Live</span>'
        : '<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1" style="font-size: 0.72rem;"><i class="bi bi-hourglass-split me-1"></i>Draft</span>';

      const imgSrc = b.featuredImage && b.featuredImage.trim().length > 3
        ? b.featuredImage
        : 'assets/img/logo.png';

      return `
        <tr>
          <td class="ps-4">
            <div class="d-flex align-items-center gap-3">
              <div class="blog-thumbnail-wrap">
                <img src="${imgSrc}" alt="${b.title}" onerror="this.src='assets/img/logo.png'">
              </div>
              <div style="min-width: 0; max-width: 380px;">
                <a href="http://localhost:3000/${b.slug}" target="_blank" class="blog-title-link" title="View Article on Live Site">
                  ${b.title}
                </a>
                <span class="blog-slug-text">/${b.slug}</span>
              </div>
            </div>
          </td>
          <td><span class="badge bg-light text-secondary border px-2 py-1 fw-semibold" style="font-size: 0.72rem;">${b.category || 'Clinical'}</span></td>
          <td><span class="small text-muted fw-semibold" style="font-size: 0.78rem;"><i class="bi bi-person-circle me-1 text-teal"></i>${formatDoctorName(b.authorName)}</span></td>
          <td><span class="badge bg-light text-dark border px-2 py-1" style="font-size: 0.75rem;"><i class="bi bi-eye me-1 text-primary"></i>${b.viewsCount || 0}</span></td>
          <td>${statusBadge}</td>
          <td><span class="small text-muted font-monospace" style="font-size: 0.75rem;">${b.publishedAt ? b.publishedAt.slice(0, 10) : 'Draft'}</span></td>
          <td class="text-end pe-4">
            <div class="btn-group btn-group-sm">
              <a href="http://localhost:3000/${b.slug}" target="_blank" class="btn btn-outline-info" title="View Live on Website"><i class="bi bi-box-arrow-up-right"></i></a>
              <button type="button" class="btn btn-outline-secondary btn-edit-blog" data-id="${b.id}" title="Edit Article"><i class="bi bi-pencil"></i></button>
              <button type="button" class="btn btn-outline-danger btn-delete-blog" data-id="${b.id}" data-title="${b.title}" title="Delete"><i class="bi bi-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    $('#blogsTableBody').html(html);
    $('#blogsShowingText').text(`Showing ${startIdx + 1}–${endIdx} of ${total} articles`);

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      $('#blogsPagination').html('');
      return;
    }

    let pagHtml = '';
    // Previous button
    pagHtml += `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <button class="page-link btn-page" data-page="${currentPage - 1}">&laquo; Prev</button>
      </li>
    `;

    // Pages numbers window
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    if (currentPage <= 3) endPage = Math.min(5, totalPages);
    if (currentPage >= totalPages - 2) startPage = Math.max(1, totalPages - 4);

    if (startPage > 1) {
      pagHtml += `<li class="page-item"><button class="page-link btn-page" data-page="1">1</button></li>`;
      if (startPage > 2) pagHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }

    for (let p = startPage; p <= endPage; p++) {
      pagHtml += `
        <li class="page-item ${p === currentPage ? 'active' : ''}">
          <button class="page-link btn-page" data-page="${p}">${p}</button>
        </li>
      `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pagHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      pagHtml += `<li class="page-item"><button class="page-link btn-page" data-page="${totalPages}">${totalPages}</button></li>`;
    }

    // Next button
    pagHtml += `
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <button class="page-link btn-page" data-page="${currentPage + 1}">Next &raquo;</button>
      </li>
    `;

    $('#blogsPagination').html(pagHtml);
  }

  function updateImagePreview(url) {
    if (url && url.trim().length > 3) {
      $('#blogImagePreview').attr('src', url);
      $('#blogImagePreviewName').text(url.split('/').pop() || 'Selected image');
      $('#blogImagePreviewWrap').removeClass('d-none');
    } else {
      $('#blogImagePreviewWrap').addClass('d-none');
    }
  }

  $(document).ready(function () {
    loadBlogs();

    // Initialize CKEditor for Blog Content
    window.App.initCKEditor('#blogContentInput');

    // Instant image preview on URL typing
    $('#blogImageInput').on('input change', function () {
      updateImagePreview($(this).val().trim());
    });

    // Image file upload handler
    $('#blogImageFile, #btnUploadBlogImg').on('change click', function (e) {
      const file = $('#blogImageFile')[0].files[0];
      if (!file) {
        if (e.type === 'click') $('#blogImageFile').click();
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const $btn = $('#btnUploadBlogImg').prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span>');

      $.ajax({
        url: '/api/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
      })
      .done(function (res) {
        const url = res.url || res.path || (res.data && res.data.url);
        if (url) {
          $('#blogImageInput').val(url);
          updateImagePreview(url);
          Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Image uploaded', timer: 2000, showConfirmButton: false });
        }
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Upload failed';
        Swal.fire('Upload Error', msg, 'error');
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-cloud-arrow-up"></i> Upload');
      });
    });

    $('#btnCreateBlog').on('click', function () {
      $('#blogForm')[0].reset();
      $('#formBlogId').val('');
      window.App.setCKData('blogContentInput', '');
      $('#blogImagePreviewWrap').addClass('d-none');
      $('#blogModalTitle').text('Write New Article');
      const modal = new bootstrap.Modal(document.getElementById('blogModal'));
      modal.show();
    });

    $(document).on('click', '.btn-edit-blog', function () {
      const id = $(this).data('id');
      window.API.getBlog(id).done(function (res) {
        if (!res.success) return;
        const b = res.data;
        $('#formBlogId').val(b.id);
        $('#blogTitleInput').val(b.title);
        $('#blogCategoryInput').val(b.category);
        $('#blogAuthorInput').val(b.authorName);
        $('#blogImageInput').val(b.featuredImage);
        updateImagePreview(b.featuredImage);
        $('#blogExcerptInput').val(b.excerpt);
        $('#blogContentInput').val(b.content);
        window.App.setCKData('blogContentInput', b.content || '');
        $('#blogTagsInput').val((b.tags || []).join(', '));
        $('#blogPublishedInput').val(b.isPublished ? '1' : '0');

        // SEO Fields
        $('#blogMetaTitleInput').val(b.metaTitle || b.title || '');
        $('#blogMetaKeywordsInput').val(b.metaKeywords || (b.tags || []).join(', ') || '');
        $('#blogMetaDescInput').val(b.metaDescription || b.excerpt || '');
        $('#blogCanonicalUrlInput').val(b.canonicalUrl || '');

        $('#blogModalTitle').text('Edit Article: ' + b.title);

        const modal = new bootstrap.Modal(document.getElementById('blogModal'));
        modal.show();
      });
    });

    $('#blogForm').on('submit', function (e) {
      e.preventDefault();
      const id = $('#formBlogId').val();
      const payload = {
        title: $('#blogTitleInput').val().trim(),
        category: $('#blogCategoryInput').val(),
        authorName: $('#blogAuthorInput').val().trim(),
        featuredImage: $('#blogImageInput').val().trim(),
        excerpt: $('#blogExcerptInput').val().trim(),
        content: window.App.getCKData('blogContentInput') || $('#blogContentInput').val().trim(),
        tags: $('#blogTagsInput').val().split(',').map((t) => t.trim()).filter(Boolean),
        metaTitle: $('#blogMetaTitleInput').val().trim(),
        metaKeywords: $('#blogMetaKeywordsInput').val().trim(),
        metaDescription: $('#blogMetaDescInput').val().trim(),
        canonicalUrl: $('#blogCanonicalUrlInput').val().trim(),
        isPublished: $('#blogPublishedInput').val() === '1',
      };

      if (!payload.title || !payload.content) {
        Swal.fire('Required Fields', 'Title and content are required.', 'warning');
        return;
      }

      const $btn = $('#btnSaveBlog').prop('disabled', true).text('Saving...');
      const req = id ? window.API.updateBlog(id, payload) : window.API.createBlog(payload);

      req
        .done(function () {
          Swal.fire('Saved', 'Article saved successfully.', 'success');
          bootstrap.Modal.getInstance(document.getElementById('blogModal')).hide();
          loadBlogs();
        })
        .fail(function (xhr) {
          const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save article.';
          Swal.fire('Error', msg, 'error');
        })
        .always(function () {
          $btn.prop('disabled', false).text('Save Article');
        });
    });

    $(document).on('click', '.btn-delete-blog', function () {
      const id = $(this).data('id');
      const title = $(this).data('title');

      Swal.fire({
        title: 'Delete Article?',
        text: `Delete "${title}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete',
      }).then(function (result) {
        if (result.isConfirmed) {
          window.API.deleteBlog(id).done(function () {
            Swal.fire('Deleted', 'Article removed.', 'success');
            loadBlogs();
          });
        }
      });
    });

    // Search & Filter listeners
    $('#searchBlogInput').on('input', function () {
      currentPage = 1;
      renderFilteredBlogs();
    });

    $('#filterBlogCategory, #filterBlogStatus').on('change', function () {
      currentPage = 1;
      renderFilteredBlogs();
    });

    $('#btnResetBlogFilters').on('click', function () {
      $('#searchBlogInput').val('');
      $('#filterBlogCategory').val('');
      $('#filterBlogStatus').val('');
      currentPage = 1;
      renderFilteredBlogs();
    });

    // Pagination click handler
    $(document).on('click', '.btn-page', function () {
      const page = parseInt($(this).data('page'), 10);
      if (page && page !== currentPage) {
        currentPage = page;
        renderFilteredBlogs();
      }
    });
  });
})(window, jQuery);
