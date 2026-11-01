/**
 * Skinfinity Derma Admin - CRM & Leads Pipeline Controller
 */
$(document).ready(function () {
  'use strict';

  let currentStatusFilter = 'all';
  let enquiriesList = [];
  let staffUsersList = [];

  function cleanPhoneDigits(p) {
    if (!p) return '';
    return p.replace(/\D/g, '').slice(-10);
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  }

  // Pre-load staff users for assignment
  function loadStaff() {
    window.API.getUsers().done(function (res) {
      if (res.success && res.data) {
        staffUsersList = res.data;
        const $filter = $('#filterAssigned');
        const $modalSelect = $('#modalEnqAssignSelect');

        $filter.find('option:not(:first)').remove();
        $modalSelect.find('option:not(:first)').remove();

        staffUsersList.forEach(u => {
          $filter.append(`<option value="${u.id}">${u.name} (${u.role})</option>`);
          $modalSelect.append(`<option value="${u.id}">${u.name} (${u.role})</option>`);
        });
      }
    });
  }

  function loadEnquiries() {
    const type = $('#filterType').val();
    const assigned = $('#filterAssigned').val();
    const q = $('#filterSearch').val().trim();

    const params = {};
    if (type && type !== 'all') params.type = type;
    if (currentStatusFilter && currentStatusFilter !== 'all') params.status = currentStatusFilter;
    if (assigned) params.assignedTo = assigned;
    if (q) params.q = q;

    $('#enquiriesTableBody').html('<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-info spinner-border-sm me-2"></div>Loading lead pipeline...</td></tr>');

    window.API.getEnquiries(params)
      .done(function (res) {
        if (!res.success) return;
        enquiriesList = res.data || [];
        $('#totalEnquiriesCount').text(`${enquiriesList.length} Leads`);

        if (enquiriesList.length === 0) {
          $('#enquiriesTableBody').html('<tr><td colspan="8" class="text-center py-5 text-muted"><i class="bi bi-chat-square-dots fs-2 d-block mb-2 text-secondary"></i>No enquiries found in this pipeline stage.</td></tr>');
          return;
        }

        let html = '';
        enquiriesList.forEach(function (e) {
          let badgeTypeClass = 'bg-secondary';
          if (e.type === 'franchise') badgeTypeClass = 'bg-primary';
          else if (e.type === 'emi') badgeTypeClass = 'bg-warning text-dark';
          else if (e.type === 'contact') badgeTypeClass = 'bg-info text-dark';
          else if (e.type === 'treatment') badgeTypeClass = 'bg-teal text-white';

          let statusBadgeClass = 'bg-light text-dark border';
          if (e.status === 'new') statusBadgeClass = 'bg-warning-subtle text-dark border';
          else if (e.status === 'contacted') statusBadgeClass = 'bg-info-subtle text-info border';
          else if (e.status === 'interested') statusBadgeClass = 'bg-danger-subtle text-danger border';
          else if (e.status === 'appointment_scheduled') statusBadgeClass = 'bg-success text-white';
          else if (e.status === 'converted') statusBadgeClass = 'bg-primary text-white';
          else if (e.status === 'lost') statusBadgeClass = 'bg-dark text-white';

          const cleanPhone = cleanPhoneDigits(e.phone);

          html += `
            <tr data-id="${e.id}">
              <td class="text-nowrap">
                <span class="fw-bold font-monospace text-dark">${e.enquiryNo || '#' + e.id}</span>
                <div class="small text-muted"><i class="bi bi-broadcast me-1"></i>${e.source || 'Website'}</div>
              </td>
              <td>
                <span class="badge ${badgeTypeClass} text-uppercase">${(e.type || 'Inquiry').replace(/_/g, ' ')}</span>
              </td>
              <td>
                <div class="fw-semibold text-dark text-nowrap">${e.name}</div>
                <div class="small text-muted text-nowrap mt-1">
                  <a href="tel:${cleanPhone}" class="text-secondary text-decoration-none me-2">
                    <i class="bi bi-telephone-fill me-1"></i>${e.phone}
                  </a>
                  ${cleanPhone ? `
                    <a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(e.name)}%2C%20thank%20you%20for%20contacting%20Skinfinity%20Derma%20Clinics..." 
                       target="_blank" class="badge bg-success text-white text-decoration-none" title="Chat on WhatsApp">
                      <i class="bi bi-whatsapp"></i> Chat
                    </a>
                  ` : ''}
                </div>
                ${e.email ? `<div class="small text-muted text-truncate mt-1" style="max-width: 170px;"><i class="bi bi-envelope me-1"></i>${e.email}</div>` : ''}
              </td>
              <td>
                <div class="fw-medium text-dark">${e.subject || e.treatmentName || 'Clinical Consultation'}</div>
                <div class="small text-muted text-truncate" style="max-width: 250px;">${e.message || '—'}</div>
              </td>
              <td>
                <span class="badge bg-light text-dark border">
                  <i class="bi bi-person me-1"></i>${e.assignedUserName || 'Unassigned'}
                </span>
              </td>
              <td class="text-nowrap">
                ${e.followUpAt ? `
                  <div class="small fw-semibold text-danger"><i class="bi bi-calendar-event me-1"></i>${formatDateTime(e.followUpAt)}</div>
                ` : `<span class="text-muted small">Not scheduled</span>`}
              </td>
              <td>
                <span class="badge ${statusBadgeClass} text-capitalize px-2 py-1">${(e.status || 'new').replace('_', ' ')}</span>
              </td>
              <td class="text-end text-nowrap">
                <button class="btn btn-sm btn-outline-primary me-1 btn-manage-lead" data-id="${e.id}" title="Manage Lead & Notes">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-enq" data-id="${e.id}" title="Delete Lead">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `;
        });

        $('#enquiriesTableBody').html(html);
      })
      .fail(function () {
        $('#enquiriesTableBody').html('<tr><td colspan="8" class="text-center py-4 text-danger">Failed to load enquiries. Please refresh.</td></tr>');
      });
  }

  // Pipeline Tabs Click
  $('.pipeline-tab-btn').on('click', function () {
    $('.pipeline-tab-btn').removeClass('active');
    $(this).addClass('active');
    currentStatusFilter = $(this).data('status');
    loadEnquiries();
  });

  // Filter triggers
  $('#btnRefreshEnquiries, #btnFilterSubmit').on('click', loadEnquiries);
  $('#filterType, #filterAssigned').on('change', loadEnquiries);

  // Manage Lead Modal
  $(document).on('click', '.btn-manage-lead', function () {
    const id = $(this).data('id');
    const lead = enquiriesList.find(e => String(e.id) === String(id));
    if (!lead) return;

    $('#statusEnqId').val(lead.id);
    $('#modalLeadSubtitle').text(`Lead #${lead.enquiryNo || lead.id} • ${lead.type || 'Web Inquiry'}`);
    $('#leadSummaryName').text(lead.name);
    $('#leadSummaryPhone').text(lead.phone);
    $('#leadSummaryEmail').text(lead.email || '—');
    $('#leadSummaryMessage').text(lead.message || lead.subject || 'Direct inquiry submitted.');

    $('#modalEnqStatusSelect').val(lead.status || 'new');
    $('#modalEnqAssignSelect').val(lead.assignedTo || '');

    if (lead.followUpAt) {
      const dt = new Date(lead.followUpAt);
      const isoLocal = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      $('#modalEnqFollowUp').val(isoLocal);
    } else {
      $('#modalEnqFollowUp').val('');
    }

    $('#modalEnqNote').val('');

    // Fetch notes history
    $('#leadNotesHistoryContainer').html('<div class="text-muted small">Loading notes history...</div>');
    API.getEnquiryNotes(lead.id).done(function (res) {
      const notes = (res.success && res.data) ? res.data : [];
      if (notes.length === 0) {
        $('#leadNotesHistoryContainer').html('<div class="text-muted small fst-italic">No prior activity notes logged for this lead.</div>');
      } else {
        const html = notes.map(n => `
          <div class="lead-note-bubble">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <strong class="small text-dark">${n.userName}</strong>
              <span class="text-muted" style="font-size: 0.72rem;">${formatDateTime(n.createdAt)}</span>
            </div>
            <div class="small text-secondary">${n.note}</div>
          </div>
        `).join('');
        $('#leadNotesHistoryContainer').html(html);
      }
    });

    const modal = new bootstrap.Modal(document.getElementById('enqModal'));
    modal.show();
  });

  // Save Lead Status, Notes & Assignment
  $('#enqStatusForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#statusEnqId').val();
    const status = $('#modalEnqStatusSelect').val();
    const assignedTo = $('#modalEnqAssignSelect').val() || null;
    const followUpAt = $('#modalEnqFollowUp').val() || null;
    const note = $('#modalEnqNote').val().trim();

    const $btn = $('#btnSaveLeadChanges');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Updating...');

    // 1. Update Status & Follow-Up
    API.updateEnquiryStatus(id, status, note || undefined, followUpAt)
      .done(function () {
        // 2. Update Assignment
        API.assignEnquiry(id, assignedTo)
          .always(function () {
            bootstrap.Modal.getInstance(document.getElementById('enqModal')).hide();
            window.App.toast('success', 'Lead record updated successfully!');
            loadEnquiries();
          });
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Failed to update lead';
        window.App.toast('error', msg);
      })
      .always(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-check2-circle me-1"></i> Update Lead Status & Save Notes');
      });
  });

  // Delete Enquiry
  $(document).on('click', '.btn-delete-enq', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Lead Record?', 'Are you sure you want to permanently delete this lead?').then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteEnquiry(id).done(function (res) {
          window.App.toast('success', res.message || 'Deleted successfully');
          loadEnquiries();
        });
      }
    });
  });

  // Initialize
  loadStaff();
  loadEnquiries();
});
