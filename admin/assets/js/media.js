/**
 * Skinfinity Derma Admin - Centralized Media Library Controller
 */
(function (window, $) {
  'use strict';

  let mediaFiles = [];

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function renderMediaGrid(items) {
    const $container = $('#mediaGridContainer');
    $('#mediaTotalCount').text(items ? items.length : 0);

    if (!items || items.length === 0) {
      $container.html(`
        <div class="text-center py-5 text-muted w-100" style="grid-column: 1/-1;">
          <i class="bi bi-images fs-1 d-block mb-3 text-secondary"></i>
          <h5>No Media Files Found</h5>
          <p class="small text-muted">Upload high-resolution clinical images, banners, or video assets above.</p>
        </div>
      `);
      return;
    }

    const html = items.map(file => {
      const isImg = file.mime_type && file.mime_type.startsWith('image/');
      const fileUrl = file.file_url;
      const sizeStr = formatBytes(file.file_size);
      const name = file.original_name || file.file_name || 'Media File';
      const alt = file.alt_text || '';

      return `
        <div class="media-card" data-id="${file.id}">
          <div class="media-thumb-wrap">
            ${isImg 
              ? `<img src="${fileUrl}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='assets/img/avatar-default.svg';">` 
              : `<div class="p-4 text-center text-secondary"><i class="bi bi-file-earmark-play fs-1"></i><div class="small mt-1">${file.mime_type || 'File'}</div></div>`
            }
          </div>
          <div class="media-info">
            <div class="media-name" title="${name}">${name}</div>
            <div class="d-flex justify-content-between align-items-center mt-1">
              <span class="text-muted" style="font-size: 0.72rem;">${sizeStr}</span>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary btn-sm py-0 px-1 btn-copy-url" data-url="${fileUrl}" title="Copy URL">
                  <i class="bi bi-link-45deg"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm py-0 px-1 btn-edit-alt" data-id="${file.id}" data-alt="${alt}" title="Edit Alt Text">
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm py-0 px-1 btn-delete-media" data-id="${file.id}" title="Delete">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    $container.html(html);
  }

  function loadMedia(query) {
    const params = {};
    if (query && query.trim()) {
      params.search = query.trim();
    }

    API.getMediaList(params)
      .then(res => {
        mediaFiles = res.data || [];
        renderMediaGrid(mediaFiles);
      })
      .catch(err => {
        console.error('Failed to load media files:', err);
        $('#mediaGridContainer').html(`
          <div class="text-center py-5 text-danger w-100" style="grid-column: 1/-1;">
            <i class="bi bi-exclamation-triangle fs-2 d-block mb-2"></i>
            Failed to load media files. Please refresh the page.
          </div>
        `);
      });
  }

  $(document).ready(function () {
    loadMedia();

    // Search with debounce
    let searchTimer = null;
    $('#mediaSearchInput').on('input', function () {
      const q = $(this).val();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        loadMedia(q);
      }, 300);
    });

    // Upload Handler
    $('#mediaUploadInput').on('change', function () {
      const file = this.files[0];
      if (!file) return;

      Swal.fire({
        title: 'Uploading Media Asset...',
        html: `<div class="spinner-border text-success" role="status"></div><div class="mt-2 text-muted small">${file.name}</div>`,
        allowOutsideClick: false,
        showConfirmButton: false
      });

      API.uploadMediaFile(file)
        .then(res => {
          Swal.fire({
            icon: 'success',
            title: 'Uploaded Successfully',
            text: 'Asset has been saved to the centralized media catalog.',
            timer: 1800,
            showConfirmButton: false
          });
          $('#mediaUploadInput').val('');
          loadMedia($('#mediaSearchInput').val());
        })
        .catch(err => {
          Swal.fire('Upload Failed', err.message || 'Unable to store file.', 'error');
          $('#mediaUploadInput').val('');
        });
    });

    // Copy URL
    $(document).on('click', '.btn-copy-url', function () {
      const url = $(this).data('url');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Link Copied!',
            text: url,
            timer: 1500,
            showConfirmButton: false
          });
        });
      } else {
        prompt('Copy media link:', url);
      }
    });

    // Edit Alt Text
    $(document).on('click', '.btn-edit-alt', function () {
      const id = $(this).data('id');
      const currentAlt = $(this).data('alt') || '';

      Swal.fire({
        title: 'Edit Image Alt Text',
        input: 'text',
        inputValue: currentAlt,
        inputPlaceholder: 'Enter descriptive SEO alt text...',
        showCancelButton: true,
        confirmButtonText: 'Save',
        confirmButtonColor: '#005b41'
      }).then(result => {
        if (result.isConfirmed) {
          API.updateMediaMeta(id, { altText: result.value })
            .then(() => {
              Swal.fire('Saved', 'Alt text updated.', 'success');
              loadMedia($('#mediaSearchInput').val());
            })
            .catch(err => {
              Swal.fire('Error', err.message || 'Failed to update alt text.', 'error');
            });
        }
      });
    });

    // Delete Media
    $(document).on('click', '.btn-delete-media', function () {
      const id = $(this).data('id');
      Swal.fire({
        title: 'Delete Asset?',
        text: 'This file will be permanently removed from the storage library.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Delete'
      }).then(result => {
        if (result.isConfirmed) {
          API.deleteMediaFile(id)
            .then(() => {
              Swal.fire('Deleted!', 'The file has been deleted.', 'success');
              loadMedia($('#mediaSearchInput').val());
            })
            .catch(err => {
              Swal.fire('Error', err.message || 'Failed to delete file.', 'error');
            });
        }
      });
    });
  });
})(window, jQuery);
