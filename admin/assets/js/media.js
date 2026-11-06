/**
 * Skinfinity Derma Admin - Centralized Media Storage & File Management Controller
 */
(function (window, $) {
  'use strict';

  let currentMediaList = [];
  let storageAuditData = null;

  function loadStorageAudit() {
    API.getStorageAudit()
      .then(res => {
        if (!res.success) return;
        storageAuditData = res.data;

        $('#statTotalFiles').text(storageAuditData.totalFiles || 0);
        $('#statFileBreakdown').text(`${storageAuditData.totalImages || 0} Images • ${storageAuditData.totalDocuments || 0} Docs`);
        $('#statTotalStorage').text(storageAuditData.totalSizeFormatted || '0 KB');

        const moduleKeys = Object.keys(storageAuditData.storageByModule || {});
        $('#statActiveModules').text(moduleKeys.length);

        const orphanCnt = storageAuditData.orphanCount || 0;
        $('#statOrphanFiles').text(orphanCnt);

        if (orphanCnt > 0) {
          $('#btnQuickCleanupOrphans').removeClass('d-none');
        } else {
          $('#btnQuickCleanupOrphans').addClass('d-none');
        }
      })
      .catch(err => {
        console.warn('Storage audit notice:', err);
      });
  }

  function renderMediaGrid(items, isOrphanMode = false) {
    const $container = $('#mediaGridContainer');
    $('#mediaTotalCount').text(items ? items.length : 0);

    if (!items || items.length === 0) {
      const q = $('#mediaSearchInput').val().trim();
      const mod = $('#mediaModuleFilter').val();
      const isFiltered = Boolean(q || mod !== 'all');

      $container.html(`
        <div class="text-center py-5 w-100" style="grid-column: 1/-1;">
          <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-light border p-3 mb-3 text-success">
            <i class="bi bi-images fs-2"></i>
          </div>
          <h5 class="fw-bold text-dark mb-1">${isFiltered ? 'No matching media assets found' : 'No media files uploaded yet'}</h5>
          <p class="text-muted small mb-3 mx-auto" style="max-width: 420px;">
            ${isFiltered ? 'Try clearing your search query or module filters to see all files.' : 'Upload clinical procedure photos, doctor portraits, banners, or patient documents.'}
          </p>
          ${!isFiltered ? `
            <button type="button" class="btn btn-luxury-emerald btn-sm px-3 shadow-sm" onclick="$('#mediaUploadInput').click()">
              <i class="bi bi-cloud-arrow-up-fill me-1.5"></i> Upload New File
            </button>
          ` : `
            <button type="button" class="btn btn-light btn-sm border px-3" onclick="$('#mediaSearchInput').val(''); $('#mediaModuleFilter').val('all'); $('#mediaTypeFilter').val('all'); loadMedia();">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
            </button>
          `}
        </div>
      `);
      return;
    }

    const html = items.map(file => {
      const isImg = file.fileType === 'image' || (file.mimeType && file.mimeType.startsWith('image/')) || (file.mime_type && file.mime_type.startsWith('image/'));
      const fileUrl = file.url || file.file_url || `/uploads/${file.relPath}`;
      const sizeStr = file.sizeFormatted || file.sizeBytes || file.file_size || '';
      const name = file.originalName || file.name || file.filename || file.file_name || 'Media File';
      const alt = file.altText || file.alt_text || '';
      const mod = file.module || (fileUrl.split('/')[2]) || 'root';

      const isOrphan = isOrphanMode || file.isOrphan;

      return `
        <div class="media-card ${isOrphan ? 'orphan-card' : ''}" data-id="${file.id || ''}" data-url="${fileUrl}">
          <div class="media-thumb-wrap">
            ${isImg 
              ? `<img src="${fileUrl}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='assets/img/avatar-default.svg';">` 
              : `<div class="p-4 text-center text-secondary"><i class="bi bi-file-earmark-pdf fs-1 text-danger"></i><div class="small mt-1 text-light">${file.ext || 'Doc'}</div></div>`
            }
            ${isOrphan ? `<span class="badge bg-danger position-absolute top-2 start-2" style="font-size: 0.65rem;">Unused Orphan</span>` : ''}
          </div>
          <div class="media-info">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="badge bg-light text-dark border media-module-badge">${mod}</span>
                <span class="text-muted" style="font-size: 0.72rem;">${sizeStr}</span>
              </div>
              <div class="media-name" title="${name}">${name}</div>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <a href="${fileUrl}" target="_blank" class="btn btn-outline-secondary btn-sm py-0 px-2 text-decoration-none" title="Open file in new tab">
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary btn-sm py-0 px-2 btn-copy-url" data-url="${fileUrl}" title="Copy Link">
                  <i class="bi bi-link-45deg"></i>
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm py-0 px-2 btn-delete-media" data-id="${file.id || ''}" data-url="${fileUrl}" data-name="${name}" title="Delete File">
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

  function loadMedia() {
    const q = $('#mediaSearchInput').val().trim();
    const mod = $('#mediaModuleFilter').val();
    const fileType = $('#mediaTypeFilter').val();

    // If user selected Orphan view
    if (mod === '_orphans') {
      if (storageAuditData && storageAuditData.orphanFiles) {
        let list = storageAuditData.orphanFiles;
        if (q) {
          list = list.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
        }
        renderMediaGrid(list, true);
      } else {
        API.getStorageAudit().then(res => {
          storageAuditData = res.data;
          renderMediaGrid(storageAuditData.orphanFiles || [], true);
        });
      }
      return;
    }

    const params = {};
    if (q) params.q = q;
    if (mod && mod !== 'all') params.module = mod;
    if (fileType && fileType !== 'all') params.fileType = fileType;

    $('#mediaGridContainer').html(`
      <div class="text-center py-5 text-muted w-100" style="grid-column: 1/-1;">
        <div class="spinner-border text-success spinner-border-sm me-2" role="status"></div>
        Loading media catalog...
      </div>
    `);

    API.getMediaList(params)
      .then(res => {
        currentMediaList = res.data || [];
        renderMediaGrid(currentMediaList, false);
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
    loadStorageAudit();
    loadMedia();

    // Search with debounce
    let searchTimer = null;
    $('#mediaSearchInput').on('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        loadMedia();
      }, 300);
    });

    // Filters
    $('#mediaModuleFilter, #mediaTypeFilter').on('change', function () {
      loadMedia();
    });

    // Manual Scan Storage button
    $('#btnScanStorage').on('click', function () {
      const $btn = $(this);
      $btn.prop('disabled', true).html('<div class="spinner-border spinner-border-sm me-1" role="status"></div> Auditing...');

      API.getStorageAudit()
        .then(res => {
          storageAuditData = res.data;
          loadStorageAudit();
          Swal.fire({
            icon: 'success',
            title: 'Storage Audit Complete',
            html: `
              <div class="text-start small">
                <p><strong>Total Files:</strong> ${storageAuditData.totalFiles}</p>
                <p><strong>Total Size:</strong> ${storageAuditData.totalSizeFormatted}</p>
                <p><strong>Orphan Unused Files:</strong> ${storageAuditData.orphanCount}</p>
              </div>
            `,
            confirmButtonColor: '#005b41',
          });
          loadMedia();
        })
        .finally(() => {
          $btn.prop('disabled', false).html('<i class="bi bi-search me-1 text-primary"></i> Scan Storage');
        });
    });

    // Cleanup Orphans Action
    $('#btnQuickCleanupOrphans').on('click', function () {
      if (!storageAuditData || storageAuditData.orphanCount === 0) return;

      Swal.fire({
        title: 'Clean Up Unused Files?',
        text: `Permanently delete ${storageAuditData.orphanCount} orphan files not referenced in any database table?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Clean Up Files'
      }).then(result => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Cleaning up storage...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
          });

          API.cleanupOrphans()
            .then(res => {
              Swal.fire({
                icon: 'success',
                title: 'Cleanup Complete',
                text: `${res.deletedCount} orphan files deleted (${res.freedFormatted} freed).`,
              });
              loadStorageAudit();
              loadMedia();
            })
            .catch(err => {
              Swal.fire('Cleanup Failed', err.message || 'Error deleting orphan files.', 'error');
            });
        }
      });
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
            text: 'Asset stored and synchronized in media catalog.',
            timer: 1800,
            showConfirmButton: false
          });
          $('#mediaUploadInput').val('');
          loadStorageAudit();
          loadMedia();
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

    // Delete Media with database-to-folder synchronization
    $(document).on('click', '.btn-delete-media', function () {
      const id = $(this).data('id');
      const url = $(this).data('url');
      const name = $(this).data('name') || 'this asset';

      Swal.fire({
        title: 'Delete Asset?',
        text: `Are you sure you want to permanently delete "${name}"? Physical file and database reference will be removed.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Delete'
      }).then(result => {
        if (result.isConfirmed) {
          if (id) {
            API.deleteMediaFile(id)
              .then(() => {
                Swal.fire('Deleted!', 'The file and its reference have been removed.', 'success');
                loadStorageAudit();
                loadMedia();
              })
              .catch(err => {
                Swal.fire('Deletion Error', err.responseJSON?.message || err.message || 'Failed to delete file.', 'error');
              });
          } else if (url) {
            // Orphan file direct cleanup
            API.cleanupOrphans([url])
              .then(() => {
                Swal.fire('Deleted!', 'The orphan file has been removed from server storage.', 'success');
                loadStorageAudit();
                loadMedia();
              })
              .catch(err => {
                Swal.fire('Deletion Error', err.message || 'Failed to delete file.', 'error');
              });
          }
        }
      });
    });
  });
})(window, jQuery);
