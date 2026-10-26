$(document).ready(function () {
  'use strict';

  function loadAppointments() {
    const status = $('#filterStatus').val();
    const q = $('#filterSearch').val().trim();

    const params = {};
    if (status && status !== 'all') params.status = status;
    if (q) params.q = q;

    $('#appointmentsTableBody').html('<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-primary spinner-border-sm me-2"></div>Loading appointments...</td></tr>');

    window.API.getAppointments(params)
      .done(function (res) {
        if (!res.success) return;
        const list = res.data || [];
        $('#totalApptsCount').text(`${list.length} Records`);

        if (list.length === 0) {
          $('#appointmentsTableBody').html('<tr><td colspan="8" class="text-center py-5 text-muted"><i class="bi bi-calendar-x fs-2 d-block mb-2 text-secondary"></i>No appointments found matching your filter criteria.</td></tr>');
          return;
        }

        let html = '';
        list.forEach(function (a) {
          const statusClass = `badge-status-${a.status}`;
          html += `
            <tr>
              <td>
                <span class="fw-bold text-primary font-monospace">${a.appointmentNo || '#' + a.id}</span>
                <div class="text-muted small">${a.source || 'Website'}</div>
              </td>
              <td>
                <div class="fw-semibold text-dark">${a.patientName}</div>
                <div class="small text-muted"><i class="bi bi-telephone me-1"></i>${a.phone}</div>
                ${a.email ? `<div class="small text-muted"><i class="bi bi-envelope me-1"></i>${a.email}</div>` : ''}
              </td>
              <td>
                <span class="badge bg-light text-dark border">${a.serviceName}</span>
                <div class="small text-muted">${a.visitType === 'new' ? 'First Consultation' : 'Follow-up'}</div>
              </td>
              <td>
                <div class="fw-medium">${a.appointmentDate}</div>
                <div class="small text-muted"><i class="bi bi-clock me-1"></i>${a.appointmentTime}</div>
              </td>
              <td>
                <div class="small fw-semibold"><i class="bi bi-geo-alt me-1 text-danger"></i>${a.clinicName}</div>
                <div class="small text-muted"><i class="bi bi-person me-1"></i>${a.doctorName}</div>
              </td>
              <td>
                ${a.couponCode ? `<span class="badge bg-warning-subtle text-warning-emphasis border"><i class="bi bi-tag-fill me-1"></i>${a.couponCode} (-₹${a.discountAmount})</span>` : '<span class="text-muted small">No coupon</span>'}
                ${a.amountEstimate ? `<div class="small fw-semibold text-success">Est: ₹${Number(a.amountEstimate).toLocaleString('en-IN')}</div>` : ''}
              </td>
              <td>
                <span class="badge ${statusClass} px-2 py-1 text-capitalize">${a.status}</span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1 btn-edit-status" data-id="${a.id}" data-status="${a.status}">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-appt" data-id="${a.id}">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `;
        });

        $('#appointmentsTableBody').html(html);
      })
      .fail(function () {
        $('#appointmentsTableBody').html('<tr><td colspan="8" class="text-center py-4 text-danger">Failed to load appointments. Please check connection.</td></tr>');
      });
  }

  // Refresh and filters
  $('#btnRefreshAppts, #btnFilterSubmit').on('click', function () {
    loadAppointments();
  });
  $('#filterStatus').on('change', function () {
    loadAppointments();
  });

  // Open Status modal
  $(document).on('click', '.btn-edit-status', function () {
    const id = $(this).data('id');
    const status = $(this).data('status');
    $('#statusApptId').val(id);
    $('#modalStatusSelect').val(status);
    $('#modalStatusNotes').val('');
    const modal = new bootstrap.Modal(document.getElementById('statusModal'));
    modal.show();
  });

  // Save Status
  $('#statusForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#statusApptId').val();
    const status = $('#modalStatusSelect').val();
    const notes = $('#modalStatusNotes').val().trim();

    window.API.updateAppointmentStatus(id, status, notes)
      .done(function (res) {
        if (res.success) {
          bootstrap.Modal.getInstance(document.getElementById('statusModal')).hide();
          window.App.toast('success', res.message || 'Status updated');
          loadAppointments();
        }
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update status');
      });
  });

  // Delete
  $(document).on('click', '.btn-delete-appt', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Appointment?', 'Are you sure you want to delete this booking record?').then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteAppointment(id).done(function (res) {
          window.App.toast('success', res.message || 'Deleted successfully');
          loadAppointments();
        });
      }
    });
  });

  loadAppointments();
});
