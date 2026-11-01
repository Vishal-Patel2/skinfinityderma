/**
 * Skinfinity Derma Admin - Doctors & Medical Board Controller
 * Features:
 * - Instant responsive search & branch filtering
 * - 1-Click active/inactive toggle with live status pill
 * - Comma-separated micro specialization badges
 * - Drag-and-drop file upload with live preview
 * - Clean modal form validation and auto-slug generation
 */

$(document).ready(function () {
  'use strict';

  let doctorsData = [];
  let currentStatusFilter = 'all';

  // Photo Upload via file input
  $('#doctorPhotoFileInput').on('change', function () {
    const file = this.files[0];
    if (!file) return;

    Swal.fire({
      title: 'Uploading Doctor Photo...',
      html: '<div class="spinner-border text-success my-2" role="status"></div><p class="small text-muted">Optimizing doctor portrait...</p>',
      allowOutsideClick: false,
      showConfirmButton: false
    });

    API.uploadMediaFile(file)
      .then(res => {
        Swal.close();
        const fileUrl = res.data ? res.data.file_url : (res.fileUrl || res.url);
        $('#doctorPhotoUrl').val(fileUrl);
        $('#doctorPhotoPreviewImg').attr('src', fileUrl);
        window.App.toast('success', 'Photo uploaded successfully.');
      })
      .catch(err => {
        Swal.fire('Upload Error', err.message || 'Failed to upload photo.', 'error');
      });
  });

  // Direct manual photo URL change
  $('#doctorPhotoUrl').on('input change', function () {
    const val = $(this).val().trim();
    if (val) {
      $('#doctorPhotoPreviewImg').attr('src', val);
    } else {
      $('#doctorPhotoPreviewImg').attr('src', '/images/doctors/dr-ipshita-johri.webp');
    }
  });

  // Remove photo button
  $('#btnRemoveDoctorPhoto').on('click', function () {
    $('#doctorPhotoUrl').val('').trigger('change');
    window.App.toast('info', 'Doctor photo reset to default.');
  });

  // Auto-slug generator when name is typed
  $('#doctorName').on('input', function () {
    if (!$('#doctorId').val()) {
      const slug = $(this).val().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      $('#doctorSlug').val(slug);
    }
  });

  // Load Doctors
  function loadDoctors() {
    window.API.getDoctors()
      .done(function (res) {
        if (!res.success) return;
        doctorsData = res.data || [];
        updateMetrics(doctorsData);
        renderTable();
      })
      .fail(function () {
        window.App.toast('error', 'Failed to load doctors list.');
      });
  }

  function updateMetrics(doctors) {
    const total = doctors.length;
    const active = doctors.filter(d => d.isActive).length;
    const inactive = total - active;

    $('#statTotalDoctors').text(total);
    $('#statActiveDoctors').text(active);
    $('#statInactiveDoctors').text(inactive);

    $('#pillCountAll').text(total);
    $('#pillCountActive').text(active);
    $('#pillCountInactive').text(inactive);
  }

  function renderTable() {
    const query = ($('#doctorGlobalSearch').val() || '').toLowerCase().trim();
    const branchFilter = ($('#filterDoctorClinic').val() || '').toLowerCase().trim();

    let filtered = doctorsData.filter(doc => {
      // Status filter
      if (currentStatusFilter === 'active' && !doc.isActive) return false;
      if (currentStatusFilter === 'inactive' && doc.isActive) return false;

      // Branch filter
      if (branchFilter) {
        const city = (doc.clinicCity || '').toLowerCase();
        if (!city.includes(branchFilter)) return false;
      }

      // Search query
      if (query) {
        const haystack = [
          doc.name || '',
          doc.role || doc.designation || '',
          doc.qualifications || '',
          doc.specialty || doc.specialization || '',
          doc.slug || ''
        ].join(' ').toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    const $tbody = $('#doctorsTableBody').empty();

    if (filtered.length === 0) {
      $tbody.html(`
        <tr>
          <td colspan="8" class="text-center py-5 text-muted">
            <i class="bi bi-search fs-1 d-block mb-2 text-secondary opacity-50"></i>
            <h6 class="fw-bold mb-1">No Specialists Found</h6>
            <p class="small text-muted mb-0">Try adjusting your search query or filter settings.</p>
          </td>
        </tr>
      `);
      return;
    }

    filtered.forEach(function (doc, index) {
      const photoSrc = doc.photo || doc.image || '/images/doctors/dr-ipshita-johri.webp';
      const photoHtml = `
        <div class="doctor-portrait-box">
          <img src="${photoSrc}" alt="${doc.name}" onerror="this.src='/images/doctors/dr-ipshita-johri.webp'">
        </div>
      `;

      // Specialization tags
      const rawSpec = doc.specialty || doc.specialization || '';
      const tags = rawSpec.split(/[,|•]/).map(s => s.trim()).filter(Boolean);
      const specHtml = tags.length > 0 ?
        tags.slice(0, 3).map(t => `<span class="specialty-tag">${t}</span>`).join('') + (tags.length > 3 ? `<span class="specialty-tag text-muted">+${tags.length - 3}</span>` : '') :
        '<span class="text-muted small">Clinical Dermatology</span>';

      // Location chips
      const rawLocs = doc.clinicCity || 'Noida, Gurgaon';
      const locChips = rawLocs.split(',').map(l => l.trim()).filter(Boolean).map(l => `
        <span class="location-pill"><i class="bi bi-geo-alt-fill text-danger" style="font-size: 0.65rem;"></i>${l}</span>
      `).join('');

      // Status switch
      const statusSwitch = `
        <div class="form-check form-switch m-0 d-inline-block">
          <input class="form-check-input btn-toggle-doctor-status cursor-pointer fs-5" type="checkbox" data-id="${doc.id}" ${doc.isActive ? 'checked' : ''} title="Toggle Visibility on Website">
        </div>
        <div class="small fw-semibold mt-1 ${doc.isActive ? 'text-success' : 'text-muted'}">
          ${doc.isActive ? '<i class="bi bi-circle-fill text-success me-1" style="font-size: 6px;"></i>Live' : '<i class="bi bi-circle text-muted me-1" style="font-size: 6px;"></i>Hidden'}
        </div>
      `;

      const liveUrl = `http://localhost:3000/doctors/${doc.slug || doc.id}`;

      const row = `
        <tr data-id="${doc.id}">
          <td class="text-muted fw-bold ps-3">
            <span class="badge bg-light text-secondary border px-2 py-1">#${doc.displayOrder || (index + 1)}</span>
          </td>
          <td>${photoHtml}</td>
          <td>
            <div class="fw-bold text-slate-900 fs-6 mb-0.5">${doc.name}</div>
            <div class="small text-brand-700 fw-semibold mb-1">${doc.role || doc.designation || 'Consultant Dermatologist'}</div>
            <a href="${liveUrl}" target="_blank" class="doctor-route-pill" title="Preview on live website">
              <i class="bi bi-link-45deg"></i> /doctors/${doc.slug || doc.id}
            </a>
          </td>
          <td>
            <div class="small text-slate-700 mb-1 fw-medium"><i class="bi bi-mortarboard-fill text-brand-700 me-1"></i>${doc.qualifications || 'Certified MD'}</div>
            <span class="experience-pill"><i class="bi bi-clock-history"></i> ${doc.experience || 'Experienced'}</span>
          </td>
          <td>
            <div class="d-flex flex-wrap align-items-center">${specHtml}</div>
          </td>
          <td>
            <div class="fw-bold text-slate-900 fs-6">₹${Number(doc.consultationFee || 1000).toLocaleString('en-IN')} <span class="text-muted small fw-normal">/ consult</span></div>
            <div class="mt-1 d-flex flex-wrap">${locChips}</div>
          </td>
          <td class="text-center">${statusSwitch}</td>
          <td class="text-end pe-3">
            <div class="d-inline-flex align-items-center gap-1.5">
              <a href="${liveUrl}" target="_blank" class="action-btn-circle" title="View Public Doctor Page">
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
              <button type="button" class="action-btn-circle btn-edit-doc" title="Edit Doctor Profile" data-id="${doc.id}">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button type="button" class="action-btn-circle btn-delete-doc" title="Delete Profile" data-id="${doc.id}">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });
  }

  // Filter Status Pill Click
  $('.filter-status-group .btn-filter-pill').on('click', function () {
    $('.filter-status-group .btn-filter-pill').removeClass('active');
    $(this).addClass('active');
    currentStatusFilter = $(this).data('status');
    renderTable();
  });

  // Search input with debounce
  $('#doctorGlobalSearch').on('input', function () {
    renderTable();
  });

  // Branch filter change
  $('#filterDoctorClinic').on('change', function () {
    renderTable();
  });

  // Open Modal for Add
  $('#btnOpenAddDoctorModal').on('click', function () {
    $('#doctorForm')[0].reset();
    $('#doctorId').val('');
    $('#doctorPhotoUrl').val('/images/doctors/dr-ipshita-johri.webp').trigger('change');
    $('#doctorConsultationFee').val('1000');
    $('#doctorExperience').val('8+ Years Clinical Experience');
    $('#doctorAvailability').val('Mon - Sat: 10:30 AM – 06:30 PM');
    $('#doctorClinicCity').val('Noida, Gurgaon');
    window.App.setCKData('doctorShortBio', '');
    $('#doctorIsActive').prop('checked', true);
    $('#doctorDisplayOrder').val(doctorsData.length + 1);
    $('#doctorModalLabel').text('Add Specialist Profile');
    $('#doctorModal').modal('show');
  });

  // Edit Doctor
  $(document).on('click', '.btn-edit-doc', function () {
    const id = $(this).data('id');
    const doc = doctorsData.find(d => String(d.id) === String(id));
    if (!doc) return;

    $('#doctorId').val(doc.id);
    $('#doctorName').val(doc.name);
    $('#doctorDesignation').val(doc.role || doc.designation || '');
    $('#doctorSlug').val(doc.slug || '');
    $('#doctorQualifications').val(doc.qualifications || '');
    $('#doctorSpecialization').val(doc.specialty || doc.specialization || '');
    $('#doctorConsultationFee').val(doc.consultationFee || 1000);
    $('#doctorExperience').val(doc.experience || '');
    $('#doctorAvailability').val(doc.availability || 'Mon - Sat: 10:30 AM – 06:30 PM');
    $('#doctorClinicCity').val(doc.clinicCity || 'Noida, Gurgaon');
    $('#doctorShortBio').val(doc.bio || doc.shortBio || '');
    window.App.setCKData('doctorShortBio', doc.bio || doc.shortBio || '');
    $('#doctorDisplayOrder').val(doc.displayOrder || 1);
    $('#doctorIsActive').prop('checked', Boolean(doc.isActive));

    const photo = doc.photo || doc.image || '/images/doctors/dr-ipshita-johri.webp';
    $('#doctorPhotoUrl').val(photo).trigger('change');

    $('#doctorModalLabel').text('Edit Specialist: ' + doc.name);
    $('#doctorModal').modal('show');
  });

  // Save Doctor Profile
  $('#doctorForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#doctorId').val();
    const name = $('#doctorName').val().trim();
    const designation = $('#doctorDesignation').val().trim();
    const slug = $('#doctorSlug').val().trim().replace(/^\/doctors\//, '').replace(/^\//, '');

    if (!name || !designation || !slug) {
      window.App.toast('error', 'Name, Designation and URL Route Slug are required.');
      return;
    }

    const payload = {
      name: name,
      role: designation,
      designation: designation,
      slug: slug,
      qualifications: $('#doctorQualifications').val().trim(),
      specialty: $('#doctorSpecialization').val().trim(),
      specialization: $('#doctorSpecialization').val().trim(),
      consultationFee: parseFloat($('#doctorConsultationFee').val()) || 1000,
      experience: $('#doctorExperience').val().trim(),
      availability: $('#doctorAvailability').val().trim(),
      clinicCity: $('#doctorClinicCity').val().trim(),
      bio: window.App.getCKData('doctorShortBio') || $('#doctorShortBio').val().trim(),
      image: $('#doctorPhotoUrl').val().trim() || '/images/doctors/dr-ipshita-johri.webp',
      photo: $('#doctorPhotoUrl').val().trim() || '/images/doctors/dr-ipshita-johri.webp',
      displayOrder: parseInt($('#doctorDisplayOrder').val()) || 1,
      isActive: $('#doctorIsActive').is(':checked')
    };

    const $btn = $('#btnSaveDoctor');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving Database...');

    const request = id ? window.API.updateDoctor(id, payload) : window.API.createDoctor(payload);

    request
      .done(function (res) {
        if (res.success) {
          $('#doctorModal').modal('hide');
          Swal.fire({
            icon: 'success',
            title: 'Specialist Profile Saved!',
            html: `<p>Profile for <strong>${name}</strong> is live and updated.</p>`,
            confirmButtonColor: '#005b41'
          });
          loadDoctors();
        }
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save doctor profile';
        Swal.fire('Error', msg, 'error');
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Doctor Profile');
      });
  });

  // Toggle Doctor Active Status (1-Click Switch)
  $(document).on('change', '.btn-toggle-doctor-status', function () {
    const id = $(this).data('id');
    const isChecked = $(this).is(':checked');

    window.API.toggleDoctorStatus(id)
      .done(function (res) {
        window.App.toast('success', res.message || `Specialist is now ${isChecked ? 'Active' : 'Hidden'} on website.`);
        loadDoctors();
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update visibility status.');
        $(this).prop('checked', !isChecked);
      });
  });

  // Delete Doctor Profile
  $(document).on('click', '.btn-delete-doc', function () {
    const id = $(this).data('id');
    const doc = doctorsData.find(d => String(d.id) === String(id));
    if (!doc) return;

    Swal.fire({
      title: 'Remove Specialist Profile?',
      html: `Are you sure you want to delete <strong>"${doc.name}"</strong>? This will remove their profile and live route.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Delete Profile'
    }).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteDoctor(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Specialist profile deleted.');
              loadDoctors();
            }
          })
          .fail(function () {
            window.App.toast('error', 'Error deleting specialist profile.');
          });
      }
    });
  });

  $('#btnReloadDoctors').on('click', loadDoctors);

  window.App.initCKEditor('#doctorShortBio');

  // Initial Load
  loadDoctors();
});
