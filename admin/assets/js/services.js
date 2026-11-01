/**
 * Skinfinity Derma Admin - Services Controller
 */

$(document).ready(function () {
  'use strict';

  let servicesList = [];

  function loadServices() {
    API.getServicesList().done(function (res) {
      if (!res.success) return;
      servicesList = res.data || [];
      $('#totalServicesCount').text(`${servicesList.length} Services`);

      const $tbody = $('#servicesTableBody').empty();
      if (servicesList.length === 0) {
        $tbody.html('<tr><td colspan="6" class="text-center py-4 text-muted">No clinical services found.</td></tr>');
        return;
      }

      servicesList.forEach(s => {
        $tbody.append(`
          <tr data-id="${s.id}">
            <td class="fw-bold text-dark">${s.name}</td>
            <td><span class="badge bg-light text-dark border">${s.categoryName || 'General'}</span></td>
            <td><code class="small text-muted">/${s.slug}</code></td>
            <td class="small text-muted text-truncate" style="max-width: 280px;">${s.shortDesc || '—'}</td>
            <td><span class="badge ${s.isActive ? 'bg-success-subtle text-success' : 'bg-secondary'}">${s.isActive ? 'Active' : 'Draft'}</span></td>
            <td class="text-end">
              <button class="btn btn-outline-primary btn-sm me-1 btn-edit-service" data-id="${s.id}"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-outline-danger btn-sm btn-delete-service" data-id="${s.id}"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        `);
      });
    });
  }

  $('#btnOpenNewServiceModal').on('click', function () {
    $('#serviceId').val('');
    $('#serviceModalTitle').text('Add New Clinical Service');
    $('#serviceForm')[0].reset();
    const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
  });

  $('#serviceName').on('input', function () {
    if (!$('#serviceId').val()) {
      $('#serviceSlug').val(window.App.slugify($(this).val()));
    }
  });

  $(document).on('click', '.btn-edit-service', function () {
    const id = $(this).data('id');
    const s = servicesList.find(item => item.id === String(id));
    if (!s) return;

    $('#serviceId').val(s.id);
    $('#serviceModalTitle').text('Edit Clinical Service');
    $('#serviceName').val(s.name);
    $('#serviceSlug').val(s.slug);
    $('#serviceCategory').val(s.categoryName || '');
    $('#serviceShortDesc').val(s.shortDesc || '');
    $('#serviceFullDesc').val(s.fullDesc || '');
    $('#serviceImage').val(s.image || '');
    $('#serviceCtaText').val(s.ctaText || 'Schedule Service');
    $('#serviceCtaUrl').val(s.ctaUrl || '/treatments');

    const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
    modal.show();
  });

  $('#serviceForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#serviceId').val();
    const payload = {
      name: $('#serviceName').val().trim(),
      slug: $('#serviceSlug').val().trim(),
      shortDesc: $('#serviceShortDesc').val().trim(),
      fullDesc: $('#serviceFullDesc').val().trim(),
      image: $('#serviceImage').val().trim() || null,
      ctaText: $('#serviceCtaText').val().trim(),
      ctaUrl: $('#serviceCtaUrl').val().trim(),
      isActive: true
    };

    const promise = id ? API.updateService(id, payload) : API.createService(payload);
    promise.done(function () {
      bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
      window.App.toast('success', 'Service saved successfully!');
      loadServices();
    }).fail(function (xhr) {
      window.App.toast('error', xhr.responseJSON ? xhr.responseJSON.message : 'Save failed');
    });
  });

  $(document).on('click', '.btn-delete-service', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Service?', 'Remove this clinical service?').then(res => {
      if (res.isConfirmed) {
        API.deleteService(id).done(function () {
          window.App.toast('success', 'Service deleted');
          loadServices();
        });
      }
    });
  });

  loadServices();
});
