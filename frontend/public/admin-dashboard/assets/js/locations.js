/**
 * Skinfinity Derma Admin - Locations Controller
 */

$(document).ready(function () {
  'use strict';

  let locationsList = [];

  function loadLocations() {
    API.getLocationsList().done(function (res) {
      if (!res.success) return;
      locationsList = res.data || [];
      $('#totalLocationsCount').text(`${locationsList.length} Facilities`);

      const $tbody = $('#locationsTableBody').empty();
      if (locationsList.length === 0) {
        $tbody.html('<tr><td colspan="7" class="text-center py-4 text-muted">No clinic locations found.</td></tr>');
        return;
      }

      locationsList.forEach(loc => {
        const phoneStr = Array.isArray(loc.phones) ? loc.phones.join(', ') : (loc.phones || '—');
        $tbody.append(`
          <tr data-id="${loc.id}">
            <td class="fw-bold text-dark">${loc.title}</td>
            <td><span class="badge bg-primary-subtle text-primary">${loc.city}</span></td>
            <td class="small text-muted text-truncate" style="max-width: 260px;">${loc.address}</td>
            <td class="small text-muted">${phoneStr}</td>
            <td class="small text-dark">${loc.hours || '10:00 AM - 8:00 PM'}</td>
            <td><span class="badge ${loc.isActive ? 'bg-success-subtle text-success' : 'bg-secondary'}">${loc.isActive ? 'Active' : 'Closed'}</span></td>
            <td class="text-end text-nowrap">
              <button class="btn btn-outline-primary btn-sm me-1 btn-edit-loc" data-id="${loc.id}"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-outline-danger btn-sm btn-delete-loc" data-id="${loc.id}"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
        `);
      });
    });
  }

  $('#btnOpenNewLocationModal').on('click', function () {
    $('#locationId').val('');
    $('#locationModalTitle').text('Add New Clinic Facility');
    $('#locationForm')[0].reset();
    const modal = new bootstrap.Modal(document.getElementById('locationModal'));
    modal.show();
  });

  $('#locTitle').on('input', function () {
    if (!$('#locationId').val()) {
      $('#locSlug').val(window.App.slugify($(this).val()));
    }
  });

  $(document).on('click', '.btn-edit-loc', function () {
    const id = $(this).data('id');
    const loc = locationsList.find(l => l.id === String(id));
    if (!loc) return;

    $('#locationId').val(loc.id);
    $('#locationModalTitle').text('Edit Clinic Location');
    $('#locTitle').val(loc.title);
    $('#locCity').val(loc.city);
    $('#locSlug').val(loc.slug);
    $('#locHours').val(loc.hours || '');
    $('#locAddress').val(loc.address || '');
    $('#locPhones').val(Array.isArray(loc.phones) ? loc.phones.join(', ') : (loc.phones || ''));
    $('#locEmail').val(loc.email || '');
    $('#locMapUrl').val(loc.mapEmbedUrl || '');
    $('#locSeoTitle').val(loc.seoTitle || '');
    $('#locSeoDesc').val(loc.seoDesc || '');

    const modal = new bootstrap.Modal(document.getElementById('locationModal'));
    modal.show();
  });

  $('#locationForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#locationId').val();
    const phoneInput = $('#locPhones').val().trim();
    const phonesArr = phoneInput ? phoneInput.split(',').map(p => p.trim()) : [];

    const payload = {
      title: $('#locTitle').val().trim(),
      city: $('#locCity').val().trim(),
      slug: $('#locSlug').val().trim(),
      hours: $('#locHours').val().trim(),
      address: $('#locAddress').val().trim(),
      phones: phonesArr,
      email: $('#locEmail').val().trim(),
      mapEmbedUrl: $('#locMapUrl').val().trim(),
      seoTitle: $('#locSeoTitle').val().trim(),
      seoDesc: $('#locSeoDesc').val().trim(),
      isActive: true
    };

    const promise = id ? API.updateLocation(id, payload) : API.createLocation(payload);
    promise.done(function () {
      bootstrap.Modal.getInstance(document.getElementById('locationModal')).hide();
      window.App.toast('success', 'Clinic location saved successfully!');
      loadLocations();
    }).fail(function (xhr) {
      window.App.toast('error', xhr.responseJSON ? xhr.responseJSON.message : 'Save failed');
    });
  });

  $(document).on('click', '.btn-delete-loc', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Location?', 'Remove this clinic facility?').then(res => {
      if (res.isConfirmed) {
        API.deleteLocation(id).done(function () {
          window.App.toast('success', 'Location deleted');
          loadLocations();
        });
      }
    });
  });

  loadLocations();
});
