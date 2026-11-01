/**
 * Skinfinity Derma Admin - Blogs & Articles Controller
 */
(function (window, $) {
  'use strict';

  function loadBlogs() {
    window.API.getBlogs()
      .done(function (res) {
        if (!res.success) return;
        renderBlogs(res.data);
      })
      .fail(function () {
        $('#blogsTableBody').html('<tr><td colspan="7" class="text-center py-4 text-danger">Failed to load articles.</td></tr>');
      });
  }

  function renderBlogs(blogs) {
    if (blogs.length === 0) {
      $('#blogsTableBody').html('<tr><td colspan="7" class="text-center py-4 text-muted">No blog articles found.</td></tr>');
      return;
    }

    const html = blogs.map((b) => {
      const statusBadge = b.isPublished
        ? '<span class="badge bg-success-subtle text-success border">Published</span>'
        : '<span class="badge bg-warning-subtle text-warning border">Draft</span>';

      return `
        <tr>
          <td class="ps-4">
            <div class="d-flex align-items-center gap-3">
              <img src="${b.featuredImage || 'assets/img/logo.png'}" class="rounded-2 border" style="width: 48px; height: 36px; object-fit: cover;">
              <div>
                <div class="fw-bold text-dark">${b.title}</div>
                <code class="small text-muted">/${b.slug}</code>
              </div>
            </div>
          </td>
          <td><span class="badge bg-light text-dark border">${b.category || 'General'}</span></td>
          <td><span class="small text-muted">${b.authorName}</span></td>
          <td><span class="small fw-semibold text-muted"><i class="bi bi-eye me-1"></i> ${b.viewsCount || 0}</span></td>
          <td>${statusBadge}</td>
          <td><span class="small text-muted">${b.publishedAt ? b.publishedAt.slice(0, 10) : 'Not Published'}</span></td>
          <td class="text-end pe-4">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit-blog" data-id="${b.id}" title="Edit"><i class="bi bi-pencil"></i></button>
              <button type="button" class="btn btn-outline-danger btn-delete-blog" data-id="${b.id}" data-title="${b.title}" title="Delete"><i class="bi bi-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    $('#blogsTableBody').html(html);
  }

  $(document).ready(function () {
    loadBlogs();

    $('#btnCreateBlog').on('click', function () {
      $('#blogForm')[0].reset();
      $('#formBlogId').val('');
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
        $('#blogExcerptInput').val(b.excerpt);
        $('#blogContentInput').val(b.content);
        $('#blogTagsInput').val((b.tags || []).join(', '));
        $('#blogPublishedInput').val(b.isPublished ? '1' : '0');
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
        content: $('#blogContentInput').val().trim(),
        tags: $('#blogTagsInput').val().split(',').map((t) => t.trim()).filter(Boolean),
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
  });
})(window, jQuery);
