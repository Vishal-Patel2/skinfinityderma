/**
 * Skinfinity Derma Admin - Patient Directory & Medical Records Controller
 */
(function (window, $) {
  'use strict';

  let allPatients = [];

  function loadPatients() {
    const q = $('#patientSearchInput').val().trim();
    const gender = $('#patientGenderFilter').val();

    window.API.getPatients({ q })
      .done(function (res) {
        if (!res.success) return;
        allPatients = res.data;
        renderPatients(gender);
      })
      .fail(function () {
        $('#patientsTableBody').html(`
          <tr>
            <td colspan="8" class="text-center py-4 text-danger">
              <i class="bi bi-exclamation-triangle me-1"></i> Failed to retrieve patient directory.
            </td>
          </tr>
        `);
      });
  }

  function renderPatients(genderFilter) {
    let list = allPatients;
    if (genderFilter) {
      list = list.filter((p) => p.gender === genderFilter);
    }

    $('#patientCountBadge').text(list.length);

    if (list.length === 0) {
      $('#patientsTableBody').html(`
        <tr>
          <td colspan="8" class="text-center py-5 text-muted">
            <i class="bi bi-person-x fs-2 d-block mb-2 text-secondary"></i>
            No matching patient records found in clinic database.
          </td>
        </tr>
      `);
      return;
    }

    const html = list.map((p) => {
      const visitsBadge = p.appointmentCount > 0
        ? `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">${p.appointmentCount} Visit${p.appointmentCount > 1 ? 's' : ''}</span>`
        : `<span class="badge bg-light text-muted border">New</span>`;

      return `
        <tr>
          <td class="ps-4">
            <span class="badge bg-dark font-monospace text-light">${p.patientCode}</span>
          </td>
          <td>
            <div class="fw-bold text-dark">${p.name}</div>
            <div class="text-muted small">${p.city}</div>
          </td>
          <td>
            <a href="tel:${p.phone}" class="text-decoration-none fw-semibold text-dark">
              <i class="bi bi-telephone text-success me-1"></i> ${p.phone}
            </a>
          </td>
          <td>
            <span class="text-muted small">${p.email}</span>
          </td>
          <td>
            <span class="badge bg-light text-dark border">${p.gender}</span>
            <span class="small text-muted ms-1">${p.age !== '—' ? p.age + ' yrs' : ''}</span>
          </td>
          <td>${visitsBadge}</td>
          <td>
            <span class="small text-muted">${p.lastVisitDate ? p.lastVisitDate.slice(0, 10) : 'Never visited'}</span>
          </td>
          <td class="text-end pe-4">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-primary btn-view-patient" data-id="${p.id}" title="View Dossier">
                <i class="bi bi-eye"></i>
              </button>
              <button type="button" class="btn btn-outline-secondary btn-edit-patient" data-id="${p.id}" title="Edit Profile">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete-patient" data-id="${p.id}" data-name="${p.name}" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    $('#patientsTableBody').html(html);
  }

  $(document).ready(function () {
    loadPatients();

    let searchTimer;
    $('#patientSearchInput').on('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(loadPatients, 300);
    });

    $('#patientGenderFilter').on('change', function () {
      renderPatients($(this).val());
    });

    // View Dossier
    $(document).on('click', '.btn-view-patient', function () {
      const id = $(this).data('id');
      window.API.getPatient(id).done(function (res) {
        if (!res.success) return;
        const p = res.data;

        const apptsHtml = (p.appointments || []).length > 0
          ? p.appointments.map((a) => `
              <div class="p-2 border rounded-2 mb-2 bg-white d-flex justify-content-between align-items-center">
                <div>
                  <strong class="text-dark">${a.service}</strong>
                  <div class="small text-muted">${a.date} at ${a.time} • ${a.doctorName}</div>
                </div>
                <span class="badge bg-success-subtle text-success border">${a.status}</span>
              </div>
            `).join('')
          : '<div class="text-muted small py-2">No historical consultations recorded yet.</div>';

        const notesHtml = (p.clinicalNotes || []).length > 0
          ? p.clinicalNotes.map((n) => `
              <div class="p-2 bg-light border rounded mb-2 small">
                <div class="text-dark">${n.note}</div>
                <div class="text-muted text-end" style="font-size: 0.72rem;">${n.user_name} • ${n.created_at.slice(0, 16)}</div>
              </div>
            `).join('')
          : '<div class="text-muted small py-2">No clinical consultation notes recorded.</div>';

        const dossier = `
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <div class="p-3 bg-light rounded-3 border">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="avatar-sq bg-success text-white rounded-circle p-2 fs-4" style="width: 48px; height: 48px; display:flex; align-items:center; justify-content:center;">
                    ${p.name.charAt(0)}
                  </div>
                  <div>
                    <h5 class="fw-bold mb-0 text-dark">${p.name}</h5>
                    <span class="badge bg-dark font-monospace">${p.patientCode}</span>
                  </div>
                </div>
                <div class="small mb-1"><strong>Phone:</strong> ${p.phone}</div>
                <div class="small mb-1"><strong>Email:</strong> ${p.email || '—'}</div>
                <div class="small mb-1"><strong>Gender / Age:</strong> ${p.gender || 'Not specified'} (${p.age || '—'} yrs)</div>
                <div class="small"><strong>City / Address:</strong> ${p.city} ${p.address ? '• ' + p.address : ''}</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-3 bg-light rounded-3 border h-100">
                <h6 class="fw-bold text-danger mb-2"><i class="bi bi-shield-exclamation me-1"></i> Allergies & Sensitivities</h6>
                <div class="small mb-3 text-dark">${p.allergies || 'No known allergies reported.'}</div>
                <h6 class="fw-bold text-dark mb-1"><i class="bi bi-heart-pulse me-1 text-primary"></i> Medical History</h6>
                <div class="small text-muted">${p.medicalHistory || 'No previous chronic dermatological conditions noted.'}</div>
              </div>
            </div>
          </div>

          <div class="row g-3">
            <div class="col-md-7">
              <h6 class="fw-bold text-dark mb-2"><i class="bi bi-calendar2-check text-success me-1"></i> Appointment Records (${(p.appointments || []).length})</h6>
              ${apptsHtml}
            </div>
            <div class="col-md-5">
              <h6 class="fw-bold text-dark mb-2"><i class="bi bi-journal-text text-info me-1"></i> Doctor & Clinical Notes</h6>
              ${notesHtml}
            </div>
          </div>
        `;

        $('#patientDetailBody').html(dossier);
        const modal = new bootstrap.Modal(document.getElementById('patientDetailModal'));
        modal.show();
      });
    });

    // Open Register Modal
    $('#btnOpenNewPatientModal').on('click', function () {
      $('#patientForm')[0].reset();
      $('#formPatientId').val('');
      $('#patientFormModalTitle').text('Register New Patient');
      const modal = new bootstrap.Modal(document.getElementById('patientFormModal'));
      modal.show();
    });

    // Edit Profile Modal
    $(document).on('click', '.btn-edit-patient', function () {
      const id = $(this).data('id');
      window.API.getPatient(id).done(function (res) {
        if (!res.success) return;
        const p = res.data;
        $('#formPatientId').val(p.id);
        $('#formPatientName').val(p.name);
        $('#formPatientPhone').val(p.phone);
        $('#formPatientEmail').val(p.email);
        $('#formPatientGender').val(p.gender || 'Female');
        $('#formPatientAge').val(p.age);
        $('#formPatientAllergies').val(p.allergies);
        $('#formPatientMedicalHistory').val(p.medicalHistory);
        $('#formPatientNotes').val(p.notes);
        $('#patientFormModalTitle').text('Edit Patient Profile: ' + p.name);

        const modal = new bootstrap.Modal(document.getElementById('patientFormModal'));
        modal.show();
      });
    });

    // Save Patient Form
    $('#patientForm').on('submit', function (e) {
      e.preventDefault();
      const id = $('#formPatientId').val();
      const payload = {
        name: $('#formPatientName').val().trim(),
        phone: $('#formPatientPhone').val().trim(),
        email: $('#formPatientEmail').val().trim(),
        gender: $('#formPatientGender').val(),
        age: $('#formPatientAge').val(),
        allergies: $('#formPatientAllergies').val().trim(),
        medicalHistory: $('#formPatientMedicalHistory').val().trim(),
        notes: $('#formPatientNotes').val().trim(),
      };

      if (!payload.name || !payload.phone) {
        Swal.fire('Required Fields', 'Patient name and phone number are required.', 'warning');
        return;
      }

      const $btn = $('#btnSavePatient').prop('disabled', true).text('Saving...');
      const req = id ? window.API.updatePatient(id, payload) : window.API.createPatient(payload);

      req
        .done(function () {
          Swal.fire('Success', 'Patient profile successfully saved.', 'success');
          bootstrap.Modal.getInstance(document.getElementById('patientFormModal')).hide();
          loadPatients();
        })
        .fail(function (xhr) {
          const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save patient.';
          Swal.fire('Error', msg, 'error');
        })
        .always(function () {
          $btn.prop('disabled', false).text('Save Patient');
        });
    });

    // Delete Patient
    $(document).on('click', '.btn-delete-patient', function () {
      const id = $(this).data('id');
      const name = $(this).data('name');

      Swal.fire({
        title: 'Delete Patient Record?',
        text: `Are you sure you want to remove the medical record for ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete',
      }).then(function (result) {
        if (result.isConfirmed) {
          window.API.deletePatient(id).done(function () {
            Swal.fire('Deleted', 'Patient record has been removed.', 'success');
            loadPatients();
          });
        }
      });
    });
  });
})(window, jQuery);
