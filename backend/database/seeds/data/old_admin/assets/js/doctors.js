/**
 * Skinfinity Derma Admin Dashboard
 * Doctor Management Controller
 */

$(document).ready(function () {
  'use strict';

  let dataTable = null;
  let doctorsData = [];

  // Dropzone trigger
  $('#doctorPhotoDropzone').on('click', function () {
    $('#doctorPhotoFile').trigger('click');
  });

  // Setup Photo Preview
  window.App.setupImagePreview(
    '#doctorPhotoFile',
    '#doctorPhotoPreviewImg',
    '#btnRemoveDoctorPhoto',
    '#doctorPhotoUrl'
  );

  // Load Doctors
  function loadDoctors() {
    const params = {
      clinic: $('#filterDoctorClinic').val(),
      specialization: $('#filterDoctorSpec').val()
    };

    window.API.getDoctors(params)
      .done(function (res) {
        if (!res.success) return;
        doctorsData = res.data;
        renderTable(doctorsData);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load doctors');
      });
  }

  function renderTable(data) {
    if (dataTable) {
      dataTable.destroy();
    }

    const $tbody = $('#doctorsTableBody');
    $tbody.empty();

    data.forEach(function (doc) {
      const photo = doc.photo ?
        `<img src="${doc.photo}" alt="${doc.name}" style="width: 52px; height: 52px; object-fit: cover; border-radius: 50%; border: 2px solid var(--border);">` :
        `<img src="assets/images/avatar-default.svg" alt="Doctor" style="width: 52px; height: 52px; border-radius: 50%;">`;

      const statusSwitch = `
        <div class="form-check form-switch m-0">
          <input class="form-check-input btn-toggle-doctor-status" type="checkbox" data-id="${doc.id}" ${doc.isActive ? 'checked' : ''} title="Toggle Active">
        </div>
      `;

      const row = `
        <tr data-id="${doc.id}">
          <td class="fw-bold text-muted">${doc.displayOrder || 1}</td>
          <td>${photo}</td>
          <td>
            <div class="fw-bold text-dark">${doc.name}</div>
            <div class="small text-secondary">${doc.designation}</div>
          </td>
          <td><span class="small text-muted">${doc.qualifications || '—'}</span></td>
          <td><span class="badge badge-pill-soft text-wrap text-start">${doc.specialization || 'General Dermatology'}</span></td>
          <td><span class="small text-muted"><i class="bi bi-geo-alt me-1"></i>${doc.clinicCity || 'All Branches'}</span></td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary btn-edit" title="Edit Doctor" data-id="${doc.id}">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete" title="Delete Doctor" data-id="${doc.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    dataTable = $('#doctorsTable').DataTable({
      responsive: true,
      order: [[0, 'asc']],
      pageLength: 10,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search doctors by name or designation..."
      }
    });
  }

  // Open Modal for Add
  $('#btnOpenAddDoctorModal').on('click', function () {
    $('#doctorForm')[0].reset();
    $('#doctorId').val('');
    $('#doctorPhotoUrl').val('');
    $('#doctorPhotoPreviewImg').attr('src', '');
    $('#doctorPhotoPreviewWrap').addClass('d-none');
    $('#doctorIsActive').prop('checked', true);
    $('#doctorDisplayOrder').val(doctorsData.length + 1);
    $('#doctorModalLabel').text('Add New Doctor Profile');
    $('#doctorModal').modal('show');
  });

  // Edit Doctor
  $(document).on('click', '.btn-edit', function () {
    const id = $(this).data('id');
    const doc = doctorsData.find(d => d.id === id);
    if (!doc) return;

    $('#doctorId').val(doc.id);
    $('#doctorName').val(doc.name);
    $('#doctorDesignation').val(doc.designation);
    $('#doctorQualifications').val(doc.qualifications || '');
    $('#doctorSpecialization').val(doc.specialization || '');
    $('#doctorClinicCity').val(doc.clinicCity || '');
    $('#doctorProfileUrl').val(doc.profileUrl || '');
    $('#doctorShortBio').val(doc.shortBio || '');
    $('#doctorFullBio').val(doc.fullBio || '');
    $('#doctorDisplayOrder').val(doc.displayOrder || 1);
    $('#doctorIsActive').prop('checked', doc.isActive);

    $('#doctorPhotoUrl').val(doc.photo || '');
    if (doc.photo) {
      $('#doctorPhotoPreviewImg').attr('src', doc.photo);
      $('#doctorPhotoPreviewWrap').removeClass('d-none');
    } else {
      $('#doctorPhotoPreviewImg').attr('src', '');
      $('#doctorPhotoPreviewWrap').addClass('d-none');
    }

    $('#doctorModalLabel').text('Edit Doctor: ' + doc.name);
    $('#doctorModal').modal('show');
  });

  // Save Doctor
  $('#doctorForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#doctorId').val();
    const name = $('#doctorName').val().trim();
    const designation = $('#doctorDesignation').val().trim();

    if (!name || !designation) {
      window.App.toast('error', 'Name and Designation are required');
      return;
    }

    const payload = {
      name: name,
      designation: designation,
      qualifications: $('#doctorQualifications').val().trim(),
      specialization: $('#doctorSpecialization').val().trim(),
      clinicCity: $('#doctorClinicCity').val().trim(),
      profileUrl: $('#doctorProfileUrl').val().trim(),
      shortBio: $('#doctorShortBio').val().trim(),
      fullBio: $('#doctorFullBio').val().trim(),
      photo: $('#doctorPhotoUrl').val().trim(),
      displayOrder: parseInt($('#doctorDisplayOrder').val()) || 1,
      isActive: $('#doctorIsActive').is(':checked')
    };

    const $btn = $('#btnSaveDoctor');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving...');

    const request = id ? window.API.updateDoctor(id, payload) : window.API.createDoctor(payload);

    request.done(function (res) {
      if (res.success) {
        $('#doctorModal').modal('hide');
        window.App.toast('success', res.message || 'Doctor saved successfully');
        loadDoctors();
      }
    }).fail(function (xhr) {
      const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save doctor profile';
      window.App.toast('error', msg);
    }).always(function () {
      $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Doctor Profile');
    });
  });

  // Toggle Doctor Active Status
  $(document).on('change', '.btn-toggle-doctor-status', function () {
    const id = $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleDoctorStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message);
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update status');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Doctor Profile
  $(document).on('click', '.btn-delete', function () {
    const id = $(this).data('id');
    const doc = doctorsData.find(d => d.id === id);
    if (!doc) return;

    window.App.confirm(
      'Delete Doctor Profile?',
      `Are you sure you want to remove "${doc.name}" from the website?`,
      'Yes, Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteDoctor(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Doctor profile deleted');
              loadDoctors();
            }
          })
          .fail(function () {
            window.App.toast('error', 'Error deleting doctor');
          });
      }
    });
  });

  // Filter change handlers
  $('#filterDoctorClinic').on('change', loadDoctors);
  $('#filterDoctorSpec').on('input', loadDoctors);
  $('#btnResetDoctorFilters').on('click', function () {
    $('#filterDoctorClinic').val('');
    $('#filterDoctorSpec').val('');
    loadDoctors();
  });

  $('#btnReloadDoctors').on('click', loadDoctors);

  // Check URL params for ?action=new
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('action') === 'new') {
    setTimeout(function () {
      $('#btnOpenAddDoctorModal').trigger('click');
    }, 200);
  }

  // Initial Load
  loadDoctors();
});
