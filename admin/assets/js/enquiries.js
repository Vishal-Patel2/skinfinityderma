$(document).ready(function () {
  'use strict';

  function loadEnquiries() {
    const type = $('#filterType').val();
    const status = $('#filterStatus').val();
    const q = $('#filterSearch').val().trim();

    const params = {};
    if (type && type !== 'all') params.type = type;
    if (status && status !== 'all') params.status = status;
    if (q) params.q = q;

    $('#enquiriesTableBody').html('<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-info spinner-border-sm me-2"></div>Loading enquiries...</td></tr>');

    window.API.getEnquiries(params)
      .done(function (res) {
        if (!res.success) return;
        const list = res.data || [];
        $('#totalEnquiriesCount').text(`${list.length} Records`);

        if (list.length === 0) {
          $('#enquiriesTableBody').html('<tr><td colspan="7" class="text-center py-5 text-muted"><i class="bi bi-chat-square-dots fs-2 d-block mb-2 text-secondary"></i>No enquiries found.</td></tr>');
          return;
        }

        let html = '';
        list.forEach(function (e) {
          let badgeTypeClass = 'bg-secondary';
          if (e.type === 'franchise') badgeTypeClass = 'bg-primary';
          else if (e.type === 'emi') badgeTypeClass = 'bg-warning text-dark';
          else if (e.type === 'contact') badgeTypeClass = 'bg-info text-dark';
          else if (e.type.includes('tool') || e.type.includes('analysis')) badgeTypeClass = 'bg-purple text-white';

          html += `
            <tr>
              <td>
                <span class="fw-bold font-monospace text-dark">${e.enquiryNo || '#' + e.id}</span>
                <div class="small text-muted">${e.source || 'Website'}</div>
              </td>
              <td>
                <span class="badge ${badgeTypeClass} text-uppercase">${e.type.replace(/_/g, ' ')}</span>
              </td>
              <td>
                <div class="fw-semibold text-dark">${e.name}</div>
                <div class="small text-muted"><i class="bi bi-telephone me-1"></i>${e.phone}</div>
                ${e.email ? `<div class="small text-muted"><i class="bi bi-envelope me-1"></i>${e.email}</div>` : ''}
                ${e.city ? `<div class="small text-muted"><i class="bi bi-geo-alt me-1"></i>${e.city}</div>` : ''}
              </td>
              <td>
                <div class="fw-medium text-dark">${e.subject || 'Direct Inquiry'}</div>
                <div class="small text-muted text-truncate" style="max-width: 320px;">${e.message || '—'}</div>
              </td>
              <td>
                <div class="small text-dark">${e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-IN') : '—'}</div>
                <div class="small text-muted">${e.createdAt ? new Date(e.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
              </td>
              <td>
                <span class="badge badge-status-${e.status} px-2 py-1 text-capitalize">${e.status}</span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1 btn-edit-enq" data-id="${e.id}" data-status="${e.status}">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-enq" data-id="${e.id}">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `;
        });

        $('#enquiriesTableBody').html(html);
      })
      .fail(function () {
        $('#enquiriesTableBody').html('<tr><td colspan="7" class="text-center py-4 text-danger">Failed to load enquiries.</td></tr>');
      });
  }

  $('#btnRefreshEnquiries, #btnFilterSubmit').on('click', loadEnquiries);
  $('#filterType, #filterStatus').on('change', loadEnquiries);

  $(document).on('click', '.btn-edit-enq', function () {
    const id = $(this).data('id');
    const status = $(this).data('status');
    $('#statusEnqId').val(id);
    $('#modalEnqStatusSelect').val(status);
    $('#modalEnqNote').val('');
    const modal = new bootstrap.Modal(document.getElementById('enqModal'));
    modal.show();
  });

  $('#enqStatusForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#statusEnqId').val();
    const status = $('#modalEnqStatusSelect').val();
    const note = $('#modalEnqNote').val().trim();

    window.API.updateEnquiryStatus(id, status, note)
      .done(function (res) {
        if (res.success) {
          bootstrap.Modal.getInstance(document.getElementById('enqModal')).hide();
          window.App.toast('success', res.message || 'Lead status updated');
          loadEnquiries();
        }
      })
      .fail(function () {
        window.App.toast('error', 'Failed to update lead');
      });
  });

  $(document).on('click', '.btn-delete-enq', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Enquiry?', 'Are you sure you want to delete this inquiry record?').then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteEnquiry(id).done(function (res) {
          window.App.toast('success', res.message || 'Deleted successfully');
          loadEnquiries();
        });
      }
    });
  });

  loadEnquiries();
});
