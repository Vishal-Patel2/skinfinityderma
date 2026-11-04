/**
 * Skinfinity Derma Admin - Pages Controller
 */

$(document).ready(function () {
  'use strict';

  let pagesList = [];

  function loadPages() {
    API.getPagesList().done(function (res) {
      if (!res.success) return;
      pagesList = res.data || [];
      $('#totalPagesCount').text(`${pagesList.length} Pages`);

      const $tbody = $('#pagesTableBody').empty();
      if (pagesList.length === 0) {
        $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted">No dynamic pages found.</td></tr>');
        return;
      }

      pagesList.forEach(p => {
        $tbody.append(`
          <tr data-id="${p.id}">
            <td class="fw-bold text-dark">${p.title}</td>
            <td><code class="small text-muted">/${p.slug}</code></td>
            <td class="small text-muted text-truncate" style="max-width: 280px;">${p.subtitle || '—'}</td>
            <td><span class="badge ${p.isActive ? 'bg-success-subtle text-success' : 'bg-secondary'}">${p.isActive ? 'Active' : 'Draft'}</span></td>
            <td class="text-end">
              <button class="btn btn-outline-primary btn-sm me-1 btn-edit-page" data-id="${p.id}"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-outline-danger btn-sm btn-delete-page" data-id="${p.id}"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        `);
      });
    });
  }

  $(document).ready(function () {
    loadPages();
    window.App.initCKEditor('#pageContent');
  });

  $('#btnOpenNewPageModal').on('click', function () {
    $('#pageId').val('');
    $('#pageModalTitle').text('Create New Dynamic Page');
    $('#pageForm')[0].reset();
    window.App.setCKData('pageContent', '');
    const modal = new bootstrap.Modal(document.getElementById('pageModal'));
    modal.show();
  });

  $('#pageTitle').on('input', function () {
    if (!$('#pageId').val()) {
      $('#pageSlug').val(window.App.slugify($(this).val()));
    }
  });

  $(document).on('click', '.btn-edit-page', function () {
    const id = $(this).data('id');
    const p = pagesList.find(item => item.id === String(id));
    if (!p) return;

    $('#pageId').val(p.id);
    $('#pageModalTitle').text('Edit Dynamic Page');
    $('#pageTitle').val(p.title);
    $('#pageSlug').val(p.slug);
    $('#pageSubtitle').val(p.subtitle || '');
    $('#pageBanner').val(p.bannerImage || '');
    $('#pageContent').val(p.content || '');
    window.App.setCKData('pageContent', p.content || '');
    $('#pageSeoTitle').val(p.seoTitle || '');
    $('#pageSeoDesc').val(p.seoDesc || '');

    const modal = new bootstrap.Modal(document.getElementById('pageModal'));
    modal.show();
  });

  $('#pageForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#pageId').val();
    const payload = {
      title: $('#pageTitle').val().trim(),
      slug: $('#pageSlug').val().trim(),
      subtitle: $('#pageSubtitle').val().trim(),
      bannerImage: $('#pageBanner').val().trim() || null,
      content: window.App.getCKData('pageContent') || $('#pageContent').val().trim(),
      seoTitle: $('#pageSeoTitle').val().trim(),
      seoDesc: $('#pageSeoDesc').val().trim(),
      isActive: true
    };

    const promise = id ? API.updatePage(id, payload) : API.createPage(payload);
    promise.done(function () {
      bootstrap.Modal.getInstance(document.getElementById('pageModal')).hide();
      window.App.toast('success', 'Page saved successfully!');
      loadPages();
    }).fail(function (xhr) {
      window.App.toast('error', xhr.responseJSON ? xhr.responseJSON.message : 'Save failed');
    });
  });

  $(document).on('click', '.btn-delete-page', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Page?', 'Remove this page?').then(res => {
      if (res.isConfirmed) {
        API.deletePage(id).done(function () {
          window.App.toast('success', 'Page deleted');
          loadPages();
        });
      }
    });
  });

  loadPages();
});
