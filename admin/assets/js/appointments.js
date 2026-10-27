/**
 * Skinfinity Derma Operations Portal
 * Advanced Patient Appointments & Doctor Scheduling Controller
 */

$(document).ready(function () {
  'use strict';

  let cachedDoctors = [];
  let appointmentsList = [];

  // Helper date & time formatters to guarantee no hyphen wrapping
  function formatSlotDate(dStr) {
    if (!dStr) return '—';
    try {
      const d = new Date(dStr);
      if (isNaN(d.getTime())) return dStr;
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dStr;
    }
  }

  function formatSlotTime(tStr) {
    if (!tStr) return '';
    const parts = tStr.split(':');
    if (parts.length >= 2) {
      let h = parseInt(parts[0], 10);
      const m = parts[1];
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    }
    return tStr;
  }

  function cleanPhoneDigits(p) {
    if (!p) return '';
    return p.replace(/\D/g, '').slice(-10);
  }

  // Pre-load doctors for assignment select
  function preloadDoctors() {
    window.API.getDoctors()
      .done(function (res) {
        if (res.success && res.data) {
          cachedDoctors = res.data;
          const $select = $('#editApptDoctor');
          $select.find('option:not(:first)').remove();

          cachedDoctors.forEach(function (d) {
            const fee = Number(d.consultationFee || 1000);
            $select.append(`<option value="${d.id}" data-fee="${fee}">${d.name} (${d.designation || 'Consultant'} — Fee: ₹${fee.toLocaleString('en-IN')})</option>`);
          });
        }
      });
  }

  // Load and render all appointments
  function loadAppointments() {
    const status = $('#filterStatus').val();
    const q = $('#filterSearch').val().trim();

    const params = {};
    if (status && status !== 'all') params.status = status;
    if (q) params.q = q;

    $('#appointmentsTableBody').html('<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-primary spinner-border-sm me-2"></div>Fetching clinical appointments...</td></tr>');

    window.API.getAppointments(params)
      .done(function (res) {
        if (!res.success) return;
        appointmentsList = res.data || [];
        $('#totalApptsCount').text(`${appointmentsList.length} Bookings`);

        if (appointmentsList.length === 0) {
          $('#appointmentsTableBody').html('<tr><td colspan="8" class="text-center py-5 text-muted"><i class="bi bi-calendar-x fs-2 d-block mb-2 text-secondary"></i>No clinical appointments found matching filter criteria.</td></tr>');
          return;
        }

        let html = '';
        appointmentsList.forEach(function (a) {
          const statusClass = `badge-status-${a.status}`;
          const cleanPhone = cleanPhoneDigits(a.phone);
          const docAssigned = a.doctorId && a.doctorName && a.doctorName !== 'Assigned on Arrival';
          const docFee = Number(a.doctorFee) || (docAssigned ? 1200 : 0);
          const procEstimate = Number(a.amountEstimate) || 0;
          const discount = Number(a.discountAmount) || 0;
          const totalPayable = Math.max(0, procEstimate + docFee - discount);

          html += `
            <tr data-id="${a.id}">
              <td class="text-nowrap">
                <span class="fw-bold text-primary font-monospace">${a.appointmentNo || '#' + a.id}</span>
                <div class="text-muted small mt-1"><i class="bi bi-broadcast me-1"></i>${a.source || 'Website'}</div>
              </td>
              <td>
                <div class="fw-bold text-dark text-nowrap">${a.patientName}</div>
                <div class="small text-muted text-nowrap mt-1">
                  <a href="tel:${cleanPhone}" class="text-secondary text-decoration-none me-2">
                    <i class="bi bi-telephone-fill me-1"></i>${a.phone}
                  </a>
                  ${cleanPhone ? `
                    <a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(a.patientName)}%2C%20greetings%20from%20Skinfinity%20Derma%20Clinics.%20Regarding%20your%20appointment%20${a.appointmentNo || ''}..." 
                       target="_blank" class="badge bg-success text-white text-decoration-none" title="Chat on WhatsApp">
                      <i class="bi bi-whatsapp"></i> Chat
                    </a>
                  ` : ''}
                </div>
                ${a.email ? `<div class="small text-muted text-truncate mt-1" style="max-width: 170px;"><i class="bi bi-envelope me-1"></i>${a.email}</div>` : ''}
              </td>
              <td>
                <span class="badge bg-light text-dark border px-2 py-1 text-wrap text-start">${a.serviceName}</span>
                <div class="small text-muted mt-1"><i class="bi bi-activity me-1"></i>${a.visitType === 'new' ? 'First Consultation' : 'Follow-up Procedure'}</div>
              </td>
              <td class="text-nowrap">
                <div class="fw-bold text-dark"><i class="bi bi-calendar3 me-1 text-primary"></i>${formatSlotDate(a.appointmentDate)}</div>
                <div class="mt-1">
                  <span class="slot-time-badge"><i class="bi bi-clock me-1 text-secondary"></i>${formatSlotTime(a.appointmentTime)}</span>
                </div>
              </td>
              <td>
                <div class="text-nowrap mb-1">
                  ${docAssigned ? `
                    <span class="doctor-pill-badge">
                      <i class="bi bi-person-check-fill text-success"></i> ${a.doctorName}
                    </span>
                  ` : `
                    <button class="btn btn-xs btn-outline-warning text-dark btn-assign-doctor" data-id="${a.id}" style="font-size: 0.76rem; padding: 2px 8px; border-radius: 20px;">
                      <i class="bi bi-person-plus-fill text-warning me-1"></i>Assign Doctor
                    </button>
                  `}
                </div>
                <div class="small text-muted text-nowrap">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i>${a.clinicName}
                </div>
                ${docAssigned ? `<div class="small text-success fw-semibold mt-1">Doctor Fee: ₹${docFee.toLocaleString('en-IN')}</div>` : ''}
              </td>
              <td class="text-nowrap">
                ${a.couponCode ? `
                  <div class="mb-1">
                    <span class="badge bg-warning-subtle text-dark border px-2 py-0">
                      <i class="bi bi-tag-fill text-warning me-1"></i>${a.couponCode} (-₹${discount})
                    </span>
                  </div>
                ` : ''}
                <div class="fw-bold fs-6 text-dark">₹${totalPayable.toLocaleString('en-IN')}</div>
                <div class="small text-muted" style="font-size: 0.72rem;">(Proc: ₹${procEstimate} + Doc: ₹${docFee})</div>
              </td>
              <td class="text-nowrap">
                <span class="badge ${statusClass} px-2 py-1 text-capitalize">${a.status.replace('_', ' ')}</span>
              </td>
              <td class="text-end text-nowrap">
                <button class="btn btn-sm btn-outline-primary me-1 btn-edit-appt" data-id="${a.id}" title="Assign Doctor & Manage Pricing">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary me-1 btn-print-slip" data-id="${a.id}" title="Print Clinical Appointment Slip">
                  <i class="bi bi-printer"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-appt" data-id="${a.id}" title="Cancel & Delete Record">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `;
        });

        $('#appointmentsTableBody').html(html);
      })
      .fail(function () {
        $('#appointmentsTableBody').html('<tr><td colspan="8" class="text-center py-4 text-danger">Failed to connect to appointments API. Please refresh.</td></tr>');
      });
  }

  // Calculation helper for Net Payable inside Edit Modal
  function recalculateModalNet() {
    const docFee = parseFloat($('#editDoctorFee').val()) || 0;
    const procPrice = parseFloat($('#editProcedurePrice').val()) || 0;
    const discount = parseFloat($('#editDiscountAmount').val()) || 0;
    const net = Math.max(0, procPrice + docFee - discount);
    $('#editNetPayable').text(`₹${net.toLocaleString('en-IN')}`);
  }

  // Doctor Select Change Listener inside Edit Modal
  $('#editApptDoctor').on('change', function () {
    const selectedOption = $(this).find('option:selected');
    const fee = selectedOption.data('fee') || 0;
    $('#editDoctorFee').val(fee);
    if (fee > 0) {
      $('#doctorFeeNotice').html(`<span class="text-success fw-semibold"><i class="bi bi-check2-circle me-1"></i>Appointed consultation fee of ₹${fee.toLocaleString('en-IN')} applied.</span>`);
    } else {
      $('#doctorFeeNotice').text('Doctor not selected. Consultation fee set to ₹0.');
    }
    recalculateModalNet();
  });

  $('#editProcedurePrice, #editDiscountAmount').on('input', function () {
    recalculateModalNet();
  });

  // Open Full Manage Appointment & Doctor Assignment Modal
  $(document).on('click', '.btn-edit-appt, .btn-assign-doctor', function () {
    const id = $(this).data('id');
    const appt = appointmentsList.find(a => a.id === String(id));
    if (!appt) return;

    $('#editApptId').val(appt.id);
    $('#editApptBookingNo').text(`Booking ${appt.appointmentNo || '#' + appt.id} • ${appt.source || 'Website'}`);
    $('#editPatientName').val(appt.patientName || '');
    $('#editPatientPhone').val(appt.phone || '');
    $('#editPatientEmail').val(appt.email || '');

    // Select Doctor
    $('#editApptDoctor').val(appt.doctorId || '');
    const selectedDoc = cachedDoctors.find(d => String(d.id) === String(appt.doctorId));
    const docFee = selectedDoc ? Number(selectedDoc.consultationFee || 1000) : (appt.doctorFee || 0);
    $('#editDoctorFee').val(docFee);

    $('#editApptClinic').val(appt.clinicId || '1');
    $('#editApptDate').val(appt.appointmentDate || '');
    $('#editApptTime').val(appt.appointmentTime || '');
    $('#editApptStatus').val(appt.status || 'pending');
    $('#editApptService').val(appt.serviceName || '');
    $('#editProcedurePrice').val(appt.amountEstimate || 0);
    $('#editDiscountAmount').val(appt.discountAmount || 0);

    if (appt.couponCode) {
      $('#editCouponBadge').text(`${appt.couponCode} (-₹${appt.discountAmount})`);
    } else {
      $('#editCouponBadge').text('None');
    }

    $('#editApptNotes').val(appt.notes || '');

    recalculateModalNet();
    const modal = new bootstrap.Modal(document.getElementById('editApptModal'));
    modal.show();
  });

  // Save Full Appointment Updates
  $('#editApptForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#editApptId').val();
    const doctorId = $('#editApptDoctor').val();
    const clinicId = $('#editApptClinic').val();

    const payload = {
      doctorId: doctorId ? parseInt(doctorId, 10) : null,
      clinicId: clinicId ? parseInt(clinicId, 10) : 1,
      patientName: $('#editPatientName').val().trim(),
      phone: $('#editPatientPhone').val().trim(),
      email: $('#editPatientEmail').val().trim(),
      serviceName: $('#editApptService').val().trim(),
      appointmentDate: $('#editApptDate').val(),
      appointmentTime: $('#editApptTime').val().trim(),
      amountEstimate: parseFloat($('#editProcedurePrice').val()) || 0,
      discountAmount: parseFloat($('#editDiscountAmount').val()) || 0,
      status: $('#editApptStatus').val(),
      notes: $('#editApptNotes').val().trim(),
    };

    const $btn = $('#btnSaveApptChanges');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Saving changes...');

    window.API.updateAppointment(id, payload)
      .done(function (res) {
        if (res.success) {
          bootstrap.Modal.getInstance(document.getElementById('editApptModal')).hide();
          window.App.toast('success', 'Appointment and Doctor schedule updated successfully!');
          loadAppointments();
        }
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update appointment';
        window.App.toast('error', msg);
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-check-circle-fill me-1"></i> Save Changes & Doctor Assignment');
      });
  });

  // Open Printable Clinical Slip Modal
  $(document).on('click', '.btn-print-slip', function () {
    const id = $(this).data('id');
    const appt = appointmentsList.find(a => a.id === String(id));
    if (!appt) return;

    const docFee = Number(appt.doctorFee) || (appt.doctorId ? 1200 : 0);
    const procPrice = Number(appt.amountEstimate) || 0;
    const discount = Number(appt.discountAmount) || 0;
    const total = Math.max(0, procPrice + docFee - discount);

    $('#slipBookingNo').text(appt.appointmentNo || '#' + appt.id);
    $('#slipGeneratedDate').text('Generated: ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    $('#slipPatientName').text(appt.patientName || 'Walk-in Patient');
    $('#slipPatientPhone').text(appt.phone || '—');
    $('#slipDate').text(formatSlotDate(appt.appointmentDate));
    $('#slipTime').text(formatSlotTime(appt.appointmentTime));
    $('#slipDoctorName').text(appt.doctorName && appt.doctorName !== 'Assigned on Arrival' ? appt.doctorName + (appt.doctorSpecialty ? ` (${appt.doctorSpecialty})` : '') : 'Doctor Assigned on Arrival');
    $('#slipServiceName').text(appt.serviceName || 'Clinical Consultation');

    $('#slipDoctorFee').text(`₹${docFee.toLocaleString('en-IN')}`);
    $('#slipProcedureFee').text(`₹${procPrice.toLocaleString('en-IN')}`);

    if (discount > 0) {
      $('#slipDiscountRow').show();
      $('#slipDiscountFee').text(`- ₹${discount.toLocaleString('en-IN')} (${appt.couponCode || 'Promo'})`);
    } else {
      $('#slipDiscountRow').hide();
    }

    $('#slipTotalPayable').text(`₹${total.toLocaleString('en-IN')}`);

    const modal = new bootstrap.Modal(document.getElementById('printSlipModal'));
    modal.show();
  });

  // Print Action
  $('#btnPrintSlip').on('click', function () {
    const printContent = document.getElementById('printableSlipArea').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <div style="max-width: 650px; margin: 40px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        ${printContent}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  });

  // Delete Appointment
  $(document).on('click', '.btn-delete-appt', function () {
    const id = $(this).data('id');
    const appt = appointmentsList.find(a => a.id === String(id));
    const no = appt ? appt.appointmentNo || '#' + appt.id : 'this appointment';

    window.App.confirm(
      'Cancel & Delete Appointment?',
      `Are you sure you want to permanently delete booking "${no}"?`,
      'Yes, Cancel & Delete'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteAppointment(id)
          .done(function (res) {
            if (res.success) {
              window.App.toast('success', 'Appointment deleted');
              loadAppointments();
            }
          })
          .fail(function () {
            window.App.toast('error', 'Failed to delete appointment');
          });
      }
    });
  });

  // Filter triggers
  $('#btnRefreshAppts, #btnFilterSubmit').on('click', function () {
    loadAppointments();
  });
  $('#filterStatus').on('change', function () {
    loadAppointments();
  });

  // Initialization
  preloadDoctors();
  loadAppointments();
});
