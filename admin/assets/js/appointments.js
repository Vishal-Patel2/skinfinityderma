/**
 * Skinfinity Derma Operations Portal
 * Advanced Patient Appointments & Doctor Scheduling Controller
 * Fully integrated with Calendar Views, Dynamic Slot Engines & Double Booking Prevention
 */

$(document).ready(function () {
  'use strict';

  let cachedDoctors = [];
  let cachedTreatments = [];
  let appointmentsList = [];
  let calendarInstance = null;

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

  // Pre-load doctors & treatments for assignment and booking modals
  function preloadDependencies() {
    window.API.getDoctors().done(function (res) {
      if (res.success && res.data) {
        cachedDoctors = res.data;
        const $editSelect = $('#editApptDoctor');
        const $newSelect = $('#newApptDoctor');

        $editSelect.find('option:not(:first)').remove();
        $newSelect.find('option:not(:first)').remove();

        cachedDoctors.forEach(function (d) {
          const fee = Number(d.consultationFee || 1000);
          const opt = `<option value="${d.id}" data-fee="${fee}">${d.name} (${d.designation || 'Consultant'} — ₹${fee.toLocaleString('en-IN')})</option>`;
          $editSelect.append(opt);
          $newSelect.append(opt);
        });
      }
    });

    window.API.getTreatments().done(function (res) {
      if (res.success && res.data) {
        cachedTreatments = res.data;
        const $newTrt = $('#newApptTreatment');
        $newTrt.find('option:not(:first)').remove();

        cachedTreatments.forEach(function (t) {
          $newTrt.append(`<option value="${t.id}" data-price="${t.price || 0}" data-name="${t.name}">${t.name} (₹${(t.price || 0).toLocaleString('en-IN')})</option>`);
        });
      }
    });
  }

  // Load and render all appointments in Table View
  function loadAppointments() {
    const status = $('#filterStatus').val();
    const date = $('#filterDate').val();
    const q = $('#filterSearch').val().trim();

    const params = {};
    if (status && status !== 'all') params.status = status;
    if (date) params.date = date;
    if (q) params.q = q;

    $('#appointmentsTableBody').html('<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-success spinner-border-sm me-2"></div>Fetching clinical appointments...</td></tr>');

    window.API.getAppointments(params)
      .done(function (res) {
        if (!res.success) return;
        appointmentsList = res.data || [];
        $('#totalApptsCount').text(`${appointmentsList.length} Bookings`);

        if (appointmentsList.length === 0) {
          const isFiltered = Boolean((status && status !== 'all') || date || q);
          const emptyTitle = isFiltered ? 'No matching appointments found' : 'No appointments found.';
          const emptyDesc = isFiltered 
            ? 'Try adjusting your search query, status or date filters.' 
            : 'There are no active or scheduled patient appointments in the clinic system.';

          $('#appointmentsTableBody').html(`
            <tr>
              <td colspan="8" class="text-center py-5">
                <div class="py-4">
                  <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-light border p-3 mb-3 text-success">
                    <i class="bi bi-calendar2-x fs-2"></i>
                  </div>
                  <h5 class="fw-bold text-dark mb-1">${emptyTitle}</h5>
                  <p class="text-muted small mb-3 mx-auto" style="max-width: 440px;">${emptyDesc}</p>
                  ${!isFiltered ? `
                    <button type="button" class="btn btn-luxury-emerald btn-sm px-3 shadow-sm" data-bs-toggle="modal" data-bs-target="#newApptModal">
                      <i class="bi bi-calendar-plus me-1.5"></i> Create Appointment
                    </button>
                  ` : `
                    <button type="button" class="btn btn-light btn-sm border px-3" onclick="$('#filterStatus').val('all'); $('#filterDate').val(''); $('#filterSearch').val(''); $('#filterSearch').trigger('input');">
                      <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
                    </button>
                  `}
                </div>
              </td>
            </tr>
          `);
          return;
        }

        let html = '';
        appointmentsList.forEach(function (a) {
          let statusBadgeClass = 'badge-secondary';
          if (a.status === 'confirmed') statusBadgeClass = 'bg-teal text-white';
          else if (a.status === 'pending') statusBadgeClass = 'bg-warning-subtle text-dark border';
          else if (a.status === 'completed') statusBadgeClass = 'bg-primary text-white';
          else if (a.status === 'cancelled') statusBadgeClass = 'bg-danger text-white';
          else if (a.status === 'no_show') statusBadgeClass = 'bg-dark text-white';

          const cleanPhone = cleanPhoneDigits(a.phone);
          const docAssigned = a.doctorId && a.doctorName && a.doctorName !== 'Assigned on Arrival';
          const docFee = Number(a.doctorFee) || (docAssigned ? 1200 : 0);
          const procEstimate = Number(a.amountEstimate) || 0;
          const discount = Number(a.discountAmount) || 0;
          const totalPayable = Math.max(0, procEstimate + docFee - discount);

          html += `
            <tr data-id="${a.id}">
              <td class="text-nowrap">
                <span class="fw-bold text-success font-monospace">${a.appointmentNo || '#' + a.id}</span>
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
                      <i class="bi bi-whatsapp"></i>
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
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i>${a.clinicName || 'Noida Clinic'}
                </div>
              </td>
              <td class="text-nowrap">
                <div class="fw-bold fs-6 text-dark">₹${totalPayable.toLocaleString('en-IN')}</div>
                <div class="small text-muted" style="font-size: 0.72rem;">(Proc: ₹${procEstimate} + Doc: ₹${docFee})</div>
              </td>
              <td class="text-nowrap">
                <span class="badge ${statusBadgeClass} px-2 py-1 text-capitalize">${(a.status || 'pending').replace('_', ' ')}</span>
              </td>
              <td class="text-end text-nowrap">
                <button class="btn btn-sm btn-outline-primary me-1 btn-edit-appt" data-id="${a.id}" title="Manage Details & Doctor">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary me-1 btn-print-slip" data-id="${a.id}" title="Print Clinical Slip">
                  <i class="bi bi-printer"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-appt" data-id="${a.id}" title="Cancel & Delete">
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

  // FullCalendar Setup
  function initCalendar() {
    const calendarEl = document.getElementById('fullCalendarWrap');
    if (!calendarEl) return;

    calendarInstance = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
      },
      events: function (info, successCallback, failureCallback) {
        window.API.getAppointmentsCalendar({ start: info.startStr, end: info.endStr })
          .done(function (res) {
            successCallback(res.data || []);
          })
          .fail(function (err) {
            failureCallback(err);
          });
      },
      eventClick: function (info) {
        const id = info.event.id;
        openEditModalById(id);
      }
    });

    calendarInstance.render();
  }

  // View Switching (Table vs Calendar)
  $('#btnViewTable').on('click', function () {
    $(this).addClass('active');
    $('#btnViewCalendar').removeClass('active');
    $('#tableFilterSection, #tableViewContainer').removeClass('d-none');
    $('#calendarViewContainer').addClass('d-none');
  });

  $('#btnViewCalendar').on('click', function () {
    $(this).addClass('active');
    $('#btnViewTable').removeClass('active');
    $('#tableFilterSection, #tableViewContainer').addClass('d-none');
    $('#calendarViewContainer').removeClass('d-none');

    if (!calendarInstance) {
      initCalendar();
    } else {
      calendarInstance.render();
      calendarInstance.refetchEvents();
    }
  });

  // Dynamic Available Slots Loader for Modals
  function loadAvailableSlots(clinicId, date, targetContainerId, selectedSlotHiddenId) {
    const $container = $(targetContainerId);
    $container.html('<div class="text-muted small p-2"><span class="spinner-border spinner-border-sm text-success me-2"></span>Checking clinic slot availability...</div>');
    $(selectedSlotHiddenId).val('');

    API.getSlots({ clinicId: clinicId, date: date })
      .done(function (res) {
        if (!res.success || !res.slots || res.slots.length === 0) {
          $container.html('<div class="text-danger small p-2"><i class="bi bi-calendar-x me-1"></i>No slots available on this date or clinic is closed.</div>');
          return;
        }

        let html = '';
        res.slots.forEach(function (slot) {
          html += `
            <button type="button" class="slot-pill-btn" data-time="${slot.time}" data-target="${selectedSlotHiddenId}">
              <i class="bi bi-clock me-1"></i>${slot.label}
            </button>
          `;
        });
        $container.html(html);
      })
      .fail(function () {
        $container.html('<div class="text-danger small p-2">Failed to check slot availability.</div>');
      });
  }

  // New Booking Modal Handler
  $('#btnOpenNewApptModal').on('click', function () {
    const today = new Date().toISOString().split('T')[0];
    $('#newApptDate').attr('min', today).val(today);
    loadAvailableSlots($('#newApptClinic').val(), today, '#newSlotsPillsContainer', '#newSelectedSlot');
    const modal = new bootstrap.Modal(document.getElementById('newApptModal'));
    modal.show();
  });

  $('#newApptDate, #newApptClinic').on('change', function () {
    const date = $('#newApptDate').val();
    const clinicId = $('#newApptClinic').val();
    if (date && clinicId) {
      loadAvailableSlots(clinicId, date, '#newSlotsPillsContainer', '#newSelectedSlot');
    }
  });

  $('#newApptTreatment').on('change', function () {
    const selected = $(this).find('option:selected');
    const price = selected.data('price') || 0;
    $('#newApptAmount').val(price);
  });

  // Slot Pill Selection
  $(document).on('click', '.slot-pill-btn', function () {
    const $this = $(this);
    const time = $this.data('time');
    const targetHidden = $this.data('target');

    $this.siblings('.slot-pill-btn').removeClass('selected');
    $this.addClass('selected');
    $(targetHidden).val(time);
  });

  // Submit New Booking
  $('#newApptForm').on('submit', function (e) {
    e.preventDefault();
    const slotTime = $('#newSelectedSlot').val();
    if (!slotTime) {
      window.App.toast('error', 'Please select an available appointment slot.');
      return;
    }

    const payload = {
      patientName: $('#newPatientName').val().trim(),
      phone: $('#newPatientPhone').val().trim(),
      email: $('#newPatientEmail').val().trim() || null,
      serviceName: $('#newApptTreatment option:selected').data('name') || $('#newApptTreatment option:selected').text(),
      treatmentId: $('#newApptTreatment').val() ? parseInt($('#newApptTreatment').val()) : null,
      clinicId: parseInt($('#newApptClinic').val()) || 1,
      doctorId: $('#newApptDoctor').val() ? parseInt($('#newApptDoctor').val()) : null,
      appointmentDate: $('#newApptDate').val(),
      appointmentTime: slotTime,
      amountEstimate: parseFloat($('#newApptAmount').val()) || 0,
      status: $('#newApptStatus').val() || 'confirmed',
      notes: $('#newApptNotes').val().trim() || 'Booked directly via admin operations portal.'
    };

    const $btn = $('#btnSubmitNewBooking');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Reserving slot...');

    API.createAppointment(payload)
      .done(function (res) {
        bootstrap.Modal.getInstance(document.getElementById('newApptModal')).hide();
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed!',
          text: `Appointment registered for ${payload.patientName} at ${payload.appointmentTime}.`,
          confirmButtonColor: '#005b41'
        });
        $('#newApptForm')[0].reset();
        loadAppointments();
        if (calendarInstance) calendarInstance.refetchEvents();
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to book appointment';
        Swal.fire('Booking Failed', msg, 'error');
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-calendar-check me-1"></i> Confirm & Book Slot');
      });
  });

  // Open Edit Modal by ID helper
  function openEditModalById(id) {
    API.getAppointment(id).done(function (res) {
      if (!res.success || !res.data) return;
      const appt = res.data;

      $('#editApptId').val(appt.id);
      $('#editApptBookingNo').text(`Booking ${appt.appointmentNo || '#' + appt.id} • ${appt.source || 'Website'}`);
      $('#editPatientName').val(appt.patientName || '');
      $('#editPatientPhone').val(appt.phone || '');
      $('#editPatientEmail').val(appt.email || '');

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

      const net = Math.max(0, (parseFloat(appt.amountEstimate) || 0) + docFee - (parseFloat(appt.discountAmount) || 0));
      $('#editNetPayable').text(`₹${net.toLocaleString('en-IN')}`);

      const modal = new bootstrap.Modal(document.getElementById('editApptModal'));
      modal.show();
    });
  }

  $(document).on('click', '.btn-edit-appt, .btn-assign-doctor', function () {
    openEditModalById($(this).data('id'));
  });

  // Doctor Select listener in Edit Modal
  $('#editApptDoctor').on('change', function () {
    const fee = $(this).find('option:selected').data('fee') || 0;
    $('#editDoctorFee').val(fee);
    const proc = parseFloat($('#editProcedurePrice').val()) || 0;
    const disc = parseFloat($('#editDiscountAmount').val()) || 0;
    $('#editNetPayable').text(`₹${Math.max(0, proc + fee - disc).toLocaleString('en-IN')}`);
  });

  $('#editProcedurePrice, #editDiscountAmount').on('input', function () {
    const docFee = parseFloat($('#editDoctorFee').val()) || 0;
    const proc = parseFloat($('#editProcedurePrice').val()) || 0;
    const disc = parseFloat($('#editDiscountAmount').val()) || 0;
    $('#editNetPayable').text(`₹${Math.max(0, proc + docFee - disc).toLocaleString('en-IN')}`);
  });

  // Save Edit Modal Updates
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
        bootstrap.Modal.getInstance(document.getElementById('editApptModal')).hide();
        window.App.toast('success', 'Appointment updated successfully!');
        loadAppointments();
        if (calendarInstance) calendarInstance.refetchEvents();
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update appointment';
        window.App.toast('error', msg);
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-check-circle-fill me-1"></i> Save Changes');
      });
  });

  // Reschedule Modal Trigger
  $('#btnOpenRescheduleModal').on('click', function () {
    const id = $('#editApptId').val();
    $('#rescheduleApptId').val(id);
    $('#rescheduleBookingNo').text($('#editApptBookingNo').text());

    const today = new Date().toISOString().split('T')[0];
    $('#rescheduleDate').attr('min', today).val(today);
    loadAvailableSlots($('#editApptClinic').val() || 1, today, '#rescheduleSlotsContainer', '#rescheduleSelectedSlot');

    bootstrap.Modal.getInstance(document.getElementById('editApptModal')).hide();
    const modal = new bootstrap.Modal(document.getElementById('rescheduleModal'));
    modal.show();
  });

  $('#rescheduleDate').on('change', function () {
    const date = $(this).val();
    const clinicId = $('#editApptClinic').val() || 1;
    if (date) {
      loadAvailableSlots(clinicId, date, '#rescheduleSlotsContainer', '#rescheduleSelectedSlot');
    }
  });

  // Submit Reschedule
  $('#rescheduleForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#rescheduleApptId').val();
    const newSlot = $('#rescheduleSelectedSlot').val();
    const newDate = $('#rescheduleDate').val();

    if (!newSlot) {
      window.App.toast('error', 'Please pick an available time slot.');
      return;
    }

    const payload = {
      newDate: newDate,
      newTime: newSlot,
      reason: $('#rescheduleReason').val().trim()
    };

    const $btn = $('#btnSubmitReschedule');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Rescheduling...');

    API.rescheduleAppointment(id, payload)
      .done(function (res) {
        bootstrap.Modal.getInstance(document.getElementById('rescheduleModal')).hide();
        Swal.fire({
          icon: 'success',
          title: 'Rescheduled Successfully',
          text: `Booking shifted to ${newDate} at ${newSlot}.`,
          confirmButtonColor: '#005b41'
        });
        loadAppointments();
        if (calendarInstance) calendarInstance.refetchEvents();
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to reschedule';
        Swal.fire('Reschedule Failed', msg, 'error');
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-clock-history me-1"></i> Update & Reschedule');
      });
  });

  // Printable Slip
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
              if (calendarInstance) calendarInstance.refetchEvents();
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
  $('#filterStatus, #filterDate').on('change', function () {
    loadAppointments();
  });

  // Initialize
  preloadDependencies();
  loadAppointments();
});
