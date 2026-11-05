/**
 * Skinfinity Derma Admin - Patient Directory & Medical Records CRM Controller
 */
(function (window, $) {
  'use strict';

  let currentActivePatientId = null;
  let currentPage = 1;
  let searchTimer = null;

  function loadPatients(page) {
    if (page) currentPage = page;

    const q = $('#patientSearchInput').val().trim();
    const gender = $('#patientGenderFilter').val();
    const clinicId = $('#patientBranchFilter').val();
    const status = $('#patientStatusFilter').val();
    const limit = parseInt($('#patientLimitSelect').val(), 10) || 20;

    $('#patientsTableBody').html(`
      <tr>
        <td colspan="11" class="text-center py-5 text-muted">
          <div class="spinner-border spinner-border-sm text-success me-2" role="status"></div>
          Loading patient directory...
        </td>
      </tr>
    `);

    window.API.getPatients({
      q: q,
      gender: gender,
      clinicId: clinicId,
      status: status,
      page: currentPage,
      limit: limit,
      sortBy: 'id',
      sortOrder: 'DESC'
    })
      .done(function (res) {
        if (!res.success) return;
        renderPatientsTable(res.data, res.total, res.page, res.limit, res.totalPages);
      })
      .fail(function () {
        $('#patientsTableBody').html(`
          <tr>
            <td colspan="11" class="text-center py-4 text-danger">
              <i class="bi bi-exclamation-triangle me-1"></i> Failed to retrieve patient directory.
            </td>
          </tr>
        `);
      });
  }

  function renderPatientsTable(list, total, page, limit, totalPages) {
    $('#patientCountBadge').text(`${total} Profile${total !== 1 ? 's' : ''}`);

    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    $('#paginationInfo').text(`Showing ${start} to ${end} of ${total} entries`);

    renderPagination(page, totalPages);

    if (!list || list.length === 0) {
      $('#patientsTableBody').html(`
        <tr>
          <td colspan="11" class="text-center py-5 text-muted">
            <i class="bi bi-person-x fs-2 d-block mb-2 text-secondary"></i>
            No matching patient records found in clinic database.
          </td>
        </tr>
      `);
      return;
    }

    const html = list.map(function (p) {
      const visitsBadge = p.appointmentCount > 0
        ? `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">${p.appointmentCount} Visit${p.appointmentCount > 1 ? 's' : ''}</span>`
        : `<span class="badge bg-light text-muted border">New</span>`;

      const statusBadge = p.status === 'Active'
        ? '<span class="badge bg-success-subtle text-success border">Active</span>'
        : (p.status === 'Blocked'
            ? '<span class="badge bg-danger-subtle text-danger border">Blocked</span>'
            : '<span class="badge bg-secondary-subtle text-secondary border">Inactive</span>');

      return `
        <tr>
          <td class="ps-4 text-muted small fw-bold">${p.sn}</td>
          <td>
            <span class="badge bg-dark font-monospace text-light">${p.patientCode}</span>
          </td>
          <td>
            <div class="fw-bold text-dark">${p.name}</div>
            <div class="text-muted small">${p.city}, ${p.state}</div>
          </td>
          <td>
            <a href="tel:${p.phone}" class="text-decoration-none fw-semibold text-dark d-block">
              <i class="bi bi-telephone text-success me-1"></i> ${p.phone}
            </a>
            ${p.whatsappNo ? `<small class="text-muted"><i class="bi bi-whatsapp text-success me-1"></i> ${p.whatsappNo}</small>` : ''}
          </td>
          <td>
            <span class="small text-muted">${p.email}</span>
          </td>
          <td>
            <span class="badge bg-light text-dark border">${p.gender}</span>
            <span class="small text-muted ms-1">${p.age !== '—' ? p.age + ' yrs' : ''}</span>
          </td>
          <td>
            <span class="badge bg-light text-dark border"><i class="bi bi-geo-alt text-danger me-1"></i>${p.preferredClinicName}</span>
          </td>
          <td>${visitsBadge}</td>
          <td>
            <span class="small text-muted">${p.lastVisitDate ? p.lastVisitDate.slice(0, 10) : 'Never'}</span>
          </td>
          <td>${statusBadge}</td>
          <td class="text-end pe-4">
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-primary btn-view-patient" data-id="${p.id}" title="View 14-Tab Clinical Dossier">
                <i class="bi bi-eye"></i>
              </button>
              <button type="button" class="btn btn-outline-secondary btn-edit-patient" data-id="${p.id}" title="Edit Profile">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="btn btn-outline-danger btn-delete-patient" data-id="${p.id}" data-name="${p.name}" title="Delete Record">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    $('#patientsTableBody').html(html);
  }

  function renderPagination(page, totalPages) {
    if (totalPages <= 1) {
      $('#paginationControls').empty();
      return;
    }

    let html = '';
    html += `
      <li class="page-item ${page === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${page - 1}">Previous</a>
      </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
        html += `
          <li class="page-item ${i === page ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a>
          </li>
        `;
      } else if (i === page - 3 || i === page + 3) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }

    html += `
      <li class="page-item ${page === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${page + 1}">Next</a>
      </li>
    `;

    $('#paginationControls').html(html);
  }

  /* ========================================================================== */
  /* COMPLETE 14-TAB PATIENT CLINICAL DOSSIER                                   */
  /* ========================================================================== */

  function openPatientDossier(patientId) {
    currentActivePatientId = patientId;

    Swal.fire({
      title: 'Loading Dossier...',
      text: 'Retrieving medical records, prescriptions, and clinical history...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    window.API.getPatient(patientId)
      .done(function (res) {
        Swal.close();
        if (!res.success || !res.data) return;
        const d = res.data;
        const p = d.personalDetails;
        const ov = d.overview;

        // Header
        $('#dossierAvatar').text(p.name ? p.name.charAt(0).toUpperCase() : 'P');
        $('#dossierPatientName').text(p.name);
        $('#dossierPatientCode').text(p.patientCode);
        $('#dossierPatientStatus').text(ov.status);
        $('#dossierPatientTier').text(ov.memberTier);
        $('#dossierPhone').text(p.phone);
        $('#dossierWhatsapp').text(p.whatsappNo || p.phone);
        $('#dossierEmail').text(p.email || 'No email');
        $('#dossierLocation').text(`${p.city || 'Noida'}, ${p.preferredClinicName || 'Noida HQ'}`);

        // Tab 1: Overview
        $('#ovTotalAppts').text(ov.totalAppointments || 0);
        $('#ovCompletedAppts').text(`${ov.completedTreatments || 0} completed`);
        $('#ovTotalSpent').text(ov.totalSpentFormatted || '₹0');
        $('#ovActivePackages').text(ov.activePackagesCount || 0);
        $('#ovLoyaltyPoints').text(ov.loyaltyPoints || 0);
        $('#ovMemberTier').text(ov.memberTier || 'Silver');
        $('#ovAllergies').text(d.medicalRecords.allergies || 'None recorded');
        $('#ovHistory').text(d.medicalRecords.medicalHistory || 'No chronic history');
        $('#ovConcerns').text(d.medicalRecords.skinConcerns || 'None');
        $('#ovBranch').text(ov.preferredClinicName || 'Noida HQ');
        $('#ovRegistered').text(ov.registrationDate ? ov.registrationDate.slice(0, 10) : '—');
        $('#ovLastVisit').text(ov.lastVisitDate ? ov.lastVisitDate.slice(0, 10) : 'Never');

        // Tab 2: Personal Details
        $('#pdName').text(p.name);
        $('#pdCode').text(p.patientCode);
        $('#pdGenderAge').text(`${p.gender || 'Not specified'} • ${p.age !== '—' ? p.age + ' years' : ''}`);
        $('#pdDob').text(p.dob ? p.dob.slice(0, 10) : '—');
        $('#pdPhone').text(p.phone);
        $('#pdWhatsapp').text(p.whatsappNo || p.phone);
        $('#pdEmail').text(p.email || '—');
        $('#pdClinic').text(p.preferredClinicName || 'Noida HQ');
        $('#pdEmergency').text(p.emergencyContact || '—');
        $('#pdAddress').text(`${p.address || '—'}, ${p.city || ''} ${p.pincode || ''}`);

        // Tab 3: Appointments
        renderDossierAppointments(d.appointments || []);

        // Tab 4: Consultations
        renderDossierConsultations(d.consultations || []);

        // Tab 5: Treatment History
        renderDossierPackages(d.treatmentHistory || []);

        // Tab 6: Medical Records & Gallery
        $('#medAllergies').text(d.medicalRecords.allergies || 'None recorded');
        $('#medHistory').text(d.medicalRecords.medicalHistory || 'No chronic contraindications recorded.');
        $('#medConcerns').text(d.medicalRecords.skinConcerns || 'None specified.');
        renderDossierGallery(d.gallery || []);

        // Tab 7: Prescriptions
        renderDossierPrescriptions(d.prescriptions || []);

        // Tab 8: Skin Health
        renderDossierSkinHealth(d.skinHealthRecords || []);

        // Tab 9: Documents
        renderDossierDocuments(d.documents || []);

        // Tab 10: Payments & Invoices
        renderDossierPayments(d.payments || []);
        renderDossierInvoices(d.invoices || []);

        // Tab 11: Membership & Loyalty
        $('#dossierMemTier').text(d.membership.tier);
        $('#dossierMemPoints').text(d.membership.loyaltyPoints);
        renderDossierLoyalty(d.membership.transactions || []);

        // Tab 12: Enquiries
        renderDossierEnquiries(d.enquiries || []);

        // Tab 13: Notes
        renderDossierNotes(d.internalNotes || []);

        // Tab 14: Activity Timeline
        renderDossierTimeline(d.activityTimeline || []);

        // Reset to first tab & show modal
        $('.dossier-nav-tabs .nav-link:first').tab('show');
        const modal = new bootstrap.Modal(document.getElementById('patientDossierModal'));
        modal.show();
      })
      .fail(function () {
        Swal.close();
        window.App.toast('error', 'Failed to retrieve patient clinical dossier');
      });
  }

  function renderDossierAppointments(appts) {
    if (!appts.length) {
      $('#dossierApptsBody').html('<tr><td colspan="7" class="text-center py-4 text-muted">No appointments recorded yet.</td></tr>');
      return;
    }
    const html = appts.map(a => `
      <tr>
        <td class="fw-bold font-monospace">${a.appointment_no || `APP-${a.id}`}</td>
        <td>${a.appointment_date} <small class="text-muted">${a.appointment_time || ''}</small></td>
        <td><strong>${a.service_name || 'General Consultation'}</strong></td>
        <td>${a.doctor_name || 'Assigned Doctor'}</td>
        <td><small class="text-muted">${a.clinic_name || 'Noida HQ'}</small></td>
        <td>₹${Number(a.final_amount || a.consultation_fee || 0).toLocaleString('en-IN')}</td>
        <td><span class="badge bg-light text-dark border">${a.status}</span></td>
      </tr>
    `).join('');
    $('#dossierApptsBody').html(html);
  }

  function renderDossierConsultations(list) {
    if (!list.length) {
      $('#dossierConsultationsList').html('<div class="text-center py-4 text-muted">No clinical consultations recorded yet. Click "+ Record New Consultation" to add one.</div>');
      return;
    }
    const html = list.map(c => `
      <div class="border rounded-3 p-3 bg-light mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <div>
            <h6 class="fw-bold text-dark mb-0">${c.diagnosis || 'Clinical Consultation'}</h6>
            <div class="small text-muted"><i class="bi bi-person-badge me-1"></i>${c.doctor_name || 'Doctor'} • <i class="bi bi-calendar me-1"></i>${c.consultation_date} • ${c.clinic_name || 'Main Clinic'}</div>
          </div>
          <span class="badge bg-success-subtle text-success border">${c.status || 'Completed'}</span>
        </div>
        <div class="small mb-2"><strong>Primary Concern:</strong> ${c.primary_concern || '—'}</div>
        <div class="small mb-2"><strong>Symptoms & Presentation:</strong> ${c.symptoms || '—'}</div>
        <div class="small mb-2"><strong>Skin / Scalp Assessment:</strong> ${c.skin_hair_assessment || '—'}</div>
        <div class="small mb-2"><strong>Recommendations:</strong> ${c.treatment_recommendations || '—'}</div>
        ${c.follow_up_date ? `<div class="small text-primary"><strong>Next Review Date:</strong> ${c.follow_up_date.slice(0, 10)}</div>` : ''}
      </div>
    `).join('');
    $('#dossierConsultationsList').html(html);
  }

  function renderDossierPackages(list) {
    if (!list.length) {
      $('#dossierPackagesList').html('<div class="col-12 text-center py-4 text-muted">No treatment packages purchased yet.</div>');
      return;
    }
    const html = list.map(pkg => `
      <div class="col-md-6">
        <div class="border rounded-3 p-3 bg-light h-100">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="fw-bold text-dark mb-0">${pkg.package_name}</h6>
            <span class="badge bg-success-subtle text-success border">${pkg.status}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center my-3">
            <div>
              <span class="text-muted small">Sessions:</span>
              <strong class="fs-5 ms-1">${pkg.used_sessions} / ${pkg.total_sessions}</strong>
            </div>
            <button type="button" class="btn btn-outline-success btn-xs py-1 btn-use-session" data-pkg-id="${pkg.id}" ${pkg.used_sessions >= pkg.total_sessions ? 'disabled' : ''}>
              <i class="bi bi-check2-circle me-1"></i> Complete Session
            </button>
          </div>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar bg-success" style="width: ${Math.round((pkg.used_sessions / pkg.total_sessions) * 100)}%;"></div>
          </div>
          <div class="d-flex justify-content-between text-muted small mt-2">
            <span>Purchased: ${pkg.purchase_date}</span>
            <span>Paid: ₹${Number(pkg.amount_paid).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    `).join('');
    $('#dossierPackagesList').html(html);
  }

  function renderDossierGallery(list) {
    if (!list.length) {
      $('#dossierGalleryList').html('<div class="col-12 text-center py-4 text-muted">No before & after photos recorded yet.</div>');
      return;
    }
    const html = list.map(g => `
      <div class="col-md-6">
        <div class="border rounded-3 overflow-hidden bg-light p-2">
          <div class="d-flex gap-2">
            <div class="w-50 text-center">
              <span class="badge bg-dark small mb-1">Before</span>
              <img src="${g.before_image_url || 'assets/img/avatar-default.svg'}" class="w-100 rounded object-fit-cover" style="height: 130px;" alt="Before">
            </div>
            <div class="w-50 text-center">
              <span class="badge bg-success small mb-1">After</span>
              <img src="${g.after_image_url || 'assets/img/avatar-default.svg'}" class="w-100 rounded object-fit-cover" style="height: 130px;" alt="After">
            </div>
          </div>
          <div class="p-2">
            <strong class="d-block text-dark small">${g.title || 'Clinical Result'}</strong>
            <small class="text-muted">${g.description || ''}</small>
          </div>
        </div>
      </div>
    `).join('');
    $('#dossierGalleryList').html(html);
  }

  function renderDossierPrescriptions(list) {
    if (!list.length) {
      $('#dossierPrescriptionsList').html('<div class="text-center py-4 text-muted">No prescriptions issued yet. Click "+ Issue New Prescription" to create one.</div>');
      return;
    }
    const html = list.map(rx => `
      <div class="border rounded-3 p-3 bg-light mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <div>
            <strong class="text-dark font-monospace">${rx.prescription_no}</strong>
            <span class="text-muted small ms-2"><i class="bi bi-calendar me-1"></i>${rx.prescription_date} • Dr. ${rx.doctor_name || 'Specialist'}</span>
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm py-1 btn-print-rx" data-rx-id="${rx.id}">
            <i class="bi bi-printer me-1"></i> View &amp; Print
          </button>
        </div>
        <div class="small mb-2"><strong>Diagnosis:</strong> ${rx.diagnosis || 'Clinical Prescription'}</div>
        <div class="table-responsive bg-white rounded border">
          <table class="table table-sm table-hover align-middle mb-0">
            <thead class="table-light small">
              <tr>
                <th>Medicine / Product</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody class="small">
              ${(rx.items || []).map(it => `
                <tr>
                  <td><strong>${it.medicine_name}</strong></td>
                  <td>${it.dosage || '—'}</td>
                  <td>${it.frequency || '—'}</td>
                  <td>${it.duration || '—'}</td>
                  <td class="text-muted">${it.instructions || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('');
    $('#dossierPrescriptionsList').html(html);
  }

  function renderDossierSkinHealth(list) {
    if (!list.length) {
      $('#dossierSkinHealthList').html('<div class="text-center py-4 text-muted">No skin health assessments recorded yet. Click "+ Record New Assessment" to add one.</div>');
      return;
    }
    const html = list.map((s, idx) => `
      <div class="border rounded-3 p-3 bg-light mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span class="badge bg-luxury-emerald me-2" style="background:#005B41; color:#fff;">Assessment Version #${list.length - idx}</span>
            <strong class="text-dark">${s.skin_type || 'Skin Assessment'}</strong>
          </div>
          <small class="text-muted">${s.assessment_date} • ${s.doctor_name || 'Doctor'}</small>
        </div>
        <div class="row g-2 small mt-2">
          <div class="col-md-4"><strong>Acne Condition:</strong> ${s.acne_condition || 'None'}</div>
          <div class="col-md-4"><strong>Pigmentation:</strong> ${s.pigmentation || 'None'}</div>
          <div class="col-md-4"><strong>Melasma:</strong> ${s.melasma || 'None'}</div>
          <div class="col-md-4"><strong>Sensitivity:</strong> ${s.skin_sensitivity || 'Normal'}</div>
          <div class="col-md-8"><strong>Current Routine:</strong> ${s.current_skincare_routine || '—'}</div>
          <div class="col-12 mt-2"><strong>Doctor Assessment Notes:</strong> <div class="p-2 bg-white rounded border text-muted">${s.assessment_notes || 'No notes'}</div></div>
        </div>
      </div>
    `).join('');
    $('#dossierSkinHealthList').html(html);
  }

  function renderDossierDocuments(list) {
    if (!list.length) {
      $('#dossierDocumentsBody').html('<tr><td colspan="6" class="text-center py-4 text-muted">No uploaded documents on file.</td></tr>');
      return;
    }
    const html = list.map(d => `
      <tr>
        <td><strong><i class="bi bi-file-earmark-pdf text-danger me-2"></i>${d.document_name}</strong></td>
        <td><span class="badge bg-light text-dark border">${d.document_type}</span></td>
        <td>${Math.round((d.file_size || 0) / 1024)} KB</td>
        <td>${d.created_at ? d.created_at.slice(0, 10) : '—'}</td>
        <td>${d.uploaded_by_name || 'Staff'}</td>
        <td class="text-end">
          <a href="${d.file_url}" target="_blank" class="btn btn-outline-secondary btn-xs py-1">
            <i class="bi bi-box-arrow-up-right me-1"></i> View
          </a>
        </td>
      </tr>
    `).join('');
    $('#dossierDocumentsBody').html(html);
  }

  function renderDossierPayments(payments) {
    if (!payments.length) {
      $('#dossierPaymentsBody').html('<tr><td colspan="6" class="text-center py-3 text-muted">No payment transactions recorded yet.</td></tr>');
      return;
    }
    const html = payments.map(p => `
      <tr>
        <td class="font-monospace fw-bold">${p.payment_no}</td>
        <td class="fw-bold text-success">₹${Number(p.amount).toLocaleString('en-IN')}</td>
        <td><span class="badge bg-light text-dark border">${p.payment_method}</span></td>
        <td><span class="badge bg-info-subtle text-info border">${p.payment_type}</span></td>
        <td>${p.payment_date ? p.payment_date.replace('T', ' ').slice(0, 16) : '—'}</td>
        <td><span class="badge bg-success-subtle text-success border">${p.status}</span></td>
      </tr>
    `).join('');
    $('#dossierPaymentsBody').html(html);
  }

  function renderDossierInvoices(invoices) {
    if (!invoices.length) {
      $('#dossierInvoicesBody').html('<tr><td colspan="6" class="text-center py-3 text-muted">No invoices generated yet.</td></tr>');
      return;
    }
    const html = invoices.map(i => `
      <tr>
        <td class="font-monospace fw-bold">${i.invoice_no}</td>
        <td>₹${Number(i.amount).toLocaleString('en-IN')}</td>
        <td>₹${Number(i.tax_amount).toLocaleString('en-IN')}</td>
        <td class="fw-bold text-dark">₹${Number(i.total_amount).toLocaleString('en-IN')}</td>
        <td>${i.invoice_date}</td>
        <td><span class="badge bg-success-subtle text-success border">${i.status}</span></td>
      </tr>
    `).join('');
    $('#dossierInvoicesBody').html(html);
  }

  function renderDossierLoyalty(list) {
    if (!list.length) {
      $('#dossierLoyaltyBody').html('<tr><td colspan="4" class="text-center py-3 text-muted">No loyalty transactions recorded yet.</td></tr>');
      return;
    }
    const html = list.map(l => `
      <tr>
        <td>${l.created_at ? l.created_at.slice(0, 10) : '—'}</td>
        <td class="fw-bold text-success">+${l.points} Credits</td>
        <td><span class="badge bg-light text-dark border">${l.transaction_type}</span></td>
        <td class="small text-muted">${l.description}</td>
      </tr>
    `).join('');
    $('#dossierLoyaltyBody').html(html);
  }

  function renderDossierEnquiries(list) {
    if (!list.length) {
      $('#dossierEnquiriesBody').html('<tr><td colspan="5" class="text-center py-3 text-muted">No inbound enquiries received from this patient.</td></tr>');
      return;
    }
    const html = list.map(e => `
      <tr>
        <td class="font-monospace fw-bold">${e.enquiry_no || `ENQ-${e.id}`}</td>
        <td><span class="badge bg-light text-dark border">${e.type || 'Website'}</span></td>
        <td>${e.created_at ? e.created_at.slice(0, 16) : '—'}</td>
        <td><span class="badge bg-info-subtle text-info border">${e.status}</span></td>
        <td class="small text-muted">${e.message || 'General inquiry'}</td>
      </tr>
    `).join('');
    $('#dossierEnquiriesBody').html(html);
  }

  function renderDossierNotes(notes) {
    if (!notes.length) {
      $('#dossierInternalNotesList').html('<div class="text-center py-3 text-muted">No internal notes added yet.</div>');
      return;
    }
    const html = notes.map(n => `
      <div class="p-3 bg-light rounded border mb-2">
        <div class="text-dark small">${n.note}</div>
        <div class="text-muted text-end small mt-1" style="font-size: 0.72rem;">
          <i class="bi bi-person me-1"></i>${n.author_name || 'Staff'} • ${n.created_at ? n.created_at.slice(0, 16) : '—'}
        </div>
      </div>
    `).join('');
    $('#dossierInternalNotesList').html(html);
  }

  function renderDossierTimeline(logs) {
    if (!logs.length) {
      $('#dossierTimelineList').html('<div class="text-center py-3 text-muted">No timeline activities recorded yet.</div>');
      return;
    }
    const html = logs.map(act => `
      <div class="timeline-dot-item">
        <div class="timeline-dot-circle"></div>
        <div class="fw-bold text-dark small">${act.activity_type}</div>
        <div class="text-muted small mt-0.5">${act.description}</div>
        <div class="text-muted" style="font-size: 0.7rem;">
          ${act.created_at ? act.created_at.replace('T', ' ').slice(0, 16) : '—'} • ${act.user_name || 'System / Desk'}
        </div>
      </div>
    `).join('');
    $('#dossierTimelineList').html(html);
  }

  /* ========================================================================== */
  /* EVENT LISTENERS                                                            */
  /* ========================================================================== */

  $(document).ready(function () {
    loadPatients(1);

    // Search with debounce
    $('#patientSearchInput').on('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => loadPatients(1), 300);
    });

    // Filters
    $('#patientGenderFilter, #patientBranchFilter, #patientStatusFilter, #patientLimitSelect').on('change', function () {
      loadPatients(1);
    });

    $('#btnResetFilters').on('click', function () {
      $('#patientSearchInput').val('');
      $('#patientGenderFilter').val('');
      $('#patientBranchFilter').val('');
      $('#patientStatusFilter').val('');
      $('#patientLimitSelect').val('20');
      loadPatients(1);
    });

    // Pagination Click
    $(document).on('click', '#paginationControls a', function (e) {
      e.preventDefault();
      const p = parseInt($(this).data('page'), 10);
      if (p && !isNaN(p)) loadPatients(p);
    });

    // Export CSV
    $('#btnExportPatients').on('click', function () {
      const q = encodeURIComponent($('#patientSearchInput').val().trim());
      const gender = encodeURIComponent($('#patientGenderFilter').val());
      const clinicId = encodeURIComponent($('#patientBranchFilter').val());
      const status = encodeURIComponent($('#patientStatusFilter').val());
      const url = `${window.API.baseUrl}/patients/export?q=${q}&gender=${gender}&clinicId=${clinicId}&status=${status}`;
      window.location.href = url;
    });

    // View Dossier
    $(document).on('click', '.btn-view-patient', function () {
      const id = $(this).data('id');
      openPatientDossier(id);
    });

    // Open Registration Modal
    $('#btnOpenNewPatientModal').on('click', function () {
      $('#patientFormModalTitle').text('Register Walk-in Patient');
      $('#formPatientId').val('');
      $('#patientForm')[0].reset();
      $('#formPatientClinic').val('1');
      $('#formPatientStatus').val('Active');
      const modal = new bootstrap.Modal(document.getElementById('patientFormModal'));
      modal.show();
    });

    // Edit Patient Profile Click
    $(document).on('click', '.btn-edit-patient, #btnEditCurrentPatient', function () {
      const id = $(this).data('id') || currentActivePatientId;
      window.API.getPatient(id).done(function (res) {
        if (!res.success) return;
        const p = res.data.personalDetails;
        $('#patientFormModalTitle').text(`Edit Patient: ${p.name}`);
        $('#formPatientId').val(p.id);
        $('#formPatientName').val(p.name);
        $('#formPatientEmail').val(p.email);
        $('#formPatientPhone').val(p.phone);
        $('#formPatientWhatsapp').val(p.whatsappNo || p.phone);
        $('#formPatientGender').val(p.gender || 'Female');
        $('#formPatientDob').val(p.dob ? p.dob.slice(0, 10) : '');
        $('#formPatientAge').val(p.age !== '—' ? p.age : '');
        $('#formPatientClinic').val(p.preferredClinicId || 1);
        $('#formPatientCity').val(p.city || 'Noida');
        $('#formPatientState').val(p.state || 'Uttar Pradesh');
        $('#formPatientPincode').val(p.pincode || '');
        $('#formPatientAddress').val(p.address || '');
        $('#formPatientEmergency').val(p.emergencyContact || '');
        $('#formPatientAllergies').val(res.data.medicalRecords.allergies || '');
        $('#formPatientSkinConcerns').val(res.data.medicalRecords.skinConcerns || '');
        $('#formPatientMedicalHistory').val(res.data.medicalRecords.medicalHistory || '');

        const modal = new bootstrap.Modal(document.getElementById('patientFormModal'));
        modal.show();
      });
    });

    // Dynamic age calculation from DOB in Form
    $('#formPatientDob').on('change', function () {
      const dobVal = $(this).val();
      if (dobVal) {
        const birth = new Date(dobVal);
        if (!isNaN(birth.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
          $('#formPatientAge').val(Math.max(0, age));
        }
      }
    });

    // Save Patient (Create / Update)
    $('#patientForm').on('submit', function (e) {
      e.preventDefault();
      const id = $('#formPatientId').val();
      const payload = {
        name: $('#formPatientName').val().trim(),
        email: $('#formPatientEmail').val().trim(),
        phone: $('#formPatientPhone').val().trim(),
        whatsappNo: $('#formPatientWhatsapp').val().trim(),
        gender: $('#formPatientGender').val(),
        dob: $('#formPatientDob').val(),
        age: $('#formPatientAge').val(),
        preferredClinicId: $('#formPatientClinic').val(),
        city: $('#formPatientCity').val().trim(),
        state: $('#formPatientState').val().trim(),
        pincode: $('#formPatientPincode').val().trim(),
        address: $('#formPatientAddress').val().trim(),
        emergencyContact: $('#formPatientEmergency').val().trim(),
        allergies: $('#formPatientAllergies').val().trim(),
        skinConcerns: $('#formPatientSkinConcerns').val().trim(),
        medicalHistory: $('#formPatientMedicalHistory').val().trim(),
        notes: $('#formPatientNotes').val().trim(),
        status: $('#formPatientStatus').val()
      };

      if (!payload.name || !payload.phone) {
        window.App.toast('error', 'Full Name and Phone Number are required');
        return;
      }

      const promise = id ? window.API.updatePatient(id, payload) : window.API.createPatient(payload);
      promise.done(function (res) {
        if (!res.success) return;
        window.App.toast('success', res.message || 'Patient profile saved successfully');
        bootstrap.Modal.getInstance(document.getElementById('patientFormModal')).hide();
        loadPatients();
        if (id && currentActivePatientId === id) openPatientDossier(id);
      }).fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to save patient profile';
        window.App.toast('error', msg);
      });
    });

    // Delete Patient
    $(document).on('click', '.btn-delete-patient', function () {
      const id = $(this).data('id');
      const name = $(this).data('name');

      Swal.fire({
        title: `Archive / Delete Patient?`,
        text: `Are you sure you want to delete patient record for ${name}? This will remove all linked clinical records.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC2626',
        confirmButtonText: 'Yes, Delete Patient',
        cancelButtonText: 'Cancel'
      }).then(function (result) {
        if (result.isConfirmed) {
          window.API.deletePatient(id).done(function () {
            window.App.toast('success', 'Patient record deleted');
            loadPatients();
          });
        }
      });
    });

    // Add Consultation Modal
    $('#btnOpenNewConsultationModal').on('click', function () {
      $('#consultationForm')[0].reset();
      $('#consDate').val(new Date().toISOString().slice(0, 10));
      const modal = new bootstrap.Modal(document.getElementById('newConsultationModal'));
      modal.show();
    });

    $('#consultationForm').on('submit', function (e) {
      e.preventDefault();
      const payload = {
        doctorId: $('#consDoctorId').val(),
        consultationDate: $('#consDate').val(),
        primaryConcern: $('#consConcern').val().trim(),
        symptoms: $('#consSymptoms').val().trim(),
        skinHairAssessment: $('#consAssessment').val().trim(),
        diagnosis: $('#consDiagnosis').val().trim(),
        treatmentRecommendations: $('#consRecommendations').val().trim(),
        followUpDate: $('#consFollowUp').val(),
        status: $('#consStatus').val()
      };

      window.API.addPatientConsultation(currentActivePatientId, payload).done(function () {
        window.App.toast('success', 'Clinical consultation recorded');
        bootstrap.Modal.getInstance(document.getElementById('newConsultationModal')).hide();
        openPatientDossier(currentActivePatientId);
      });
    });

    // Issue Prescription Modal & Medicine Rows
    $('#btnOpenNewPrescriptionModal').on('click', function () {
      $('#prescriptionForm')[0].reset();
      $('#rxDate').val(new Date().toISOString().slice(0, 10));
      $('#rxItemsContainer').empty();
      addRxItemRow();
      const modal = new bootstrap.Modal(document.getElementById('newPrescriptionModal'));
      modal.show();
    });

    function addRxItemRow() {
      const row = `
        <div class="row g-2 align-items-center rx-item-row p-2 bg-light border rounded">
          <div class="col-md-4">
            <input type="text" class="form-control form-control-sm rx-name" placeholder="Medicine / Gel Name" required>
          </div>
          <div class="col-md-2">
            <input type="text" class="form-control form-control-sm rx-dosage" placeholder="Dosage (e.g. 1 tab / pea-sized)">
          </div>
          <div class="col-md-2">
            <input type="text" class="form-control form-control-sm rx-freq" placeholder="Freq (e.g. 2x daily)">
          </div>
          <div class="col-md-2">
            <input type="text" class="form-control form-control-sm rx-dur" placeholder="Duration (e.g. 30 days)">
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn btn-outline-danger btn-sm py-1 btn-remove-rx-row"><i class="bi bi-trash"></i></button>
          </div>
          <div class="col-12 mt-1">
            <input type="text" class="form-control form-control-sm rx-inst" placeholder="Special application instructions (e.g. apply after cleanser, avoid eye contour)...">
          </div>
        </div>
      `;
      $('#rxItemsContainer').append(row);
    }

    $('#btnAddRxItemRow').on('click', addRxItemRow);
    $(document).on('click', '.btn-remove-rx-row', function () {
      $(this).closest('.rx-item-row').remove();
    });

    $('#prescriptionForm').on('submit', function (e) {
      e.preventDefault();
      const items = [];
      $('.rx-item-row').each(function () {
        const name = $(this).find('.rx-name').val().trim();
        if (name) {
          items.push({
            medicineName: name,
            dosage: $(this).find('.rx-dosage').val().trim(),
            frequency: $(this).find('.rx-freq').val().trim(),
            duration: $(this).find('.rx-dur').val().trim(),
            instructions: $(this).find('.rx-inst').val().trim()
          });
        }
      });

      const payload = {
        doctorId: $('#rxDoctorId').val(),
        diagnosis: $('#rxDiagnosis').val().trim(),
        generalAdvice: $('#rxAdvice').val().trim(),
        prescriptionDate: $('#rxDate').val(),
        followUpDate: $('#rxFollowUp').val(),
        items: items
      };

      window.API.addPatientPrescription(currentActivePatientId, payload).done(function () {
        window.App.toast('success', 'Prescription generated');
        bootstrap.Modal.getInstance(document.getElementById('newPrescriptionModal')).hide();
        openPatientDossier(currentActivePatientId);
      });
    });

    // Print Prescription Dossier
    $(document).on('click', '.btn-print-rx', function () {
      const rxId = $(this).data('rx-id');
      window.API.getPrescriptionPrintData(rxId).done(function (res) {
        if (!res.success) return;
        const rx = res.data;

        const printHtml = `
          <div class="border p-4 bg-white" style="font-family: 'Inter', sans-serif;">
            <!-- Clinic Letterhead Header -->
            <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div>
                <h3 class="fw-bold font-serif text-dark mb-0" style="color: #005B41 !important;">SKINFINITY DERMA</h3>
                <div class="small text-muted">Advanced Clinical Dermatology, Laser &amp; Aesthetic Medicine</div>
                <div class="small text-dark mt-1">${rx.clinic_name || 'Noida HQ Clinic'} • Sector 36, Noida | Phone: +91 98719 41444</div>
              </div>
              <div class="text-end">
                <h5 class="fw-bold mb-0 text-dark">${rx.doctor_name || 'Dr. Ipshita Johri'}</h5>
                <div class="small text-muted">${rx.doctor_specialty || 'Chief MD Dermatologist'}</div>
                <div class="badge bg-dark mt-1 font-monospace">${rx.prescription_no}</div>
              </div>
            </div>

            <!-- Patient Info Bar -->
            <div class="row g-2 bg-light p-3 rounded mb-3 small">
              <div class="col-4"><strong>Patient:</strong> ${rx.patient_name} (${rx.patient_code})</div>
              <div class="col-4"><strong>Age / Gender:</strong> ${rx.patientAge || '—'} yrs / ${rx.gender || '—'}</div>
              <div class="col-4 text-end"><strong>Date:</strong> ${rx.prescription_date}</div>
              <div class="col-4"><strong>Phone:</strong> ${rx.patient_phone}</div>
              <div class="col-4"><strong>City:</strong> ${rx.city || 'Noida'}</div>
              <div class="col-4 text-end"><strong>Known Allergies:</strong> <span class="text-danger">${rx.allergies || 'None'}</span></div>
            </div>

            <div class="mb-3">
              <strong class="text-dark">Diagnosis / Clinical Impression:</strong>
              <div class="p-2 border rounded bg-white mt-1 fw-bold text-dark">${rx.diagnosis || 'Clinical Assessment'}</div>
            </div>

            <h6 class="fw-bold text-dark mt-4 mb-2"><i class="bi bi-prescription2 text-primary me-1"></i> Rx Prescribed Medications</h6>
            <table class="table table-bordered align-middle small mb-4">
              <thead class="table-light">
                <tr>
                  <th style="width: 40px;">#</th>
                  <th>Medication / Dermaceutical Product</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                ${(rx.items || []).map((it, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td><strong>${it.medicine_name}</strong></td>
                    <td>${it.dosage || '—'}</td>
                    <td>${it.frequency || '—'}</td>
                    <td>${it.duration || '—'}</td>
                    <td class="text-muted">${it.instructions || '—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            ${rx.general_advice ? `
              <div class="p-3 bg-light rounded border mb-4 small">
                <strong>General Advice &amp; Precautions:</strong>
                <p class="mb-0 text-muted mt-1">${rx.general_advice}</p>
              </div>
            ` : ''}

            <div class="d-flex justify-content-between align-items-end mt-5 pt-4 border-top">
              <div class="small text-muted">
                ${rx.follow_up_date ? `<strong>Next Follow-up Review:</strong> ${rx.follow_up_date.slice(0, 10)}<br>` : ''}
                * This is a computerized clinical prescription from Skinfinity Derma EMR.
              </div>
              <div class="text-center" style="min-width: 180px;">
                <div style="font-family: 'Brush Script MT', cursive; font-size: 1.6rem; color: #005B41;">Dr. Ipshita Johri</div>
                <div class="border-top pt-1 small fw-bold text-dark">Authorized Doctor Signature</div>
              </div>
            </div>
          </div>
        `;

        $('#printablePrescriptionArea').html(printHtml);
        const modal = new bootstrap.Modal(document.getElementById('printPrescriptionModal'));
        modal.show();
      });
    });

    // Record Payment
    $('#btnOpenRecordPaymentModal').on('click', function () {
      $('#recordPaymentForm')[0].reset();
      const modal = new bootstrap.Modal(document.getElementById('recordPaymentModal'));
      modal.show();
    });

    $('#recordPaymentForm').on('submit', function (e) {
      e.preventDefault();
      const payload = {
        amount: $('#payAmount').val(),
        paymentMethod: $('#payMethod').val(),
        paymentType: $('#payType').val(),
        transactionRef: $('#payRef').val().trim(),
        notes: $('#payNotes').val().trim()
      };

      window.API.addPatientPayment(currentActivePatientId, payload).done(function (res) {
        window.App.toast('success', 'Payment recorded & invoice issued!');
        bootstrap.Modal.getInstance(document.getElementById('recordPaymentModal')).hide();
        openPatientDossier(currentActivePatientId);
      });
    });

    // Complete Session on Package
    $(document).on('click', '.btn-use-session', function () {
      const pkgId = $(this).data('pkg-id');
      window.API.usePackageSession(currentActivePatientId, pkgId).done(function (res) {
        window.App.toast('success', res.message || 'Treatment session marked completed');
        openPatientDossier(currentActivePatientId);
      });
    });

    // Add Internal Note
    $('#btnAddInternalNoteBtn').on('click', function () {
      const note = $('#newInternalNoteInput').val().trim();
      if (!note) return;
      window.API.addPatientNote(currentActivePatientId, note).done(function () {
        $('#newInternalNoteInput').val('');
        window.App.toast('success', 'Internal note added');
        openPatientDossier(currentActivePatientId);
      });
    });
  });

})(window, jQuery);
