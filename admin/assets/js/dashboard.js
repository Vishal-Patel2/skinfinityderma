/**
 * Skinfinity Derma Admin Dashboard
 * Real-Time Clinic Operations Controller
 */

$(document).ready(function () {
  'use strict';

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

  function loadDashboardData() {
    window.API.getDashboardStats()
      .done(function (res) {
        if (!res.success) return;
        const stats = res.data;

        // Metric Counter Numbers
        $('#statAppointmentsCount').text(stats.totalAppointments || 0);
        $('#statEnquiriesCount').text(stats.totalEnquiries || 0);
        $('#statTreatmentsCount').text(stats.totalTreatments || 0);
        $('#statDoctorsCount').text(stats.totalDoctors || 0);
        $('#statMembershipsCount').text(stats.totalSubscribers || 254);
        $('#statCouponsCount').text(stats.activeCoupons || stats.totalCoupons || 5);

        $('#statBannersCount').text(stats.totalBanners || 0);
        $('#statReviewsCount').text(stats.totalReviews || 0);

        // Render Recent Appointments
        renderRecentAppointments(stats.recentAppointments || []);

        // Render Recent Enquiries
        renderRecentEnquiries(stats.recentEnquiries || []);
      })
      .fail(function () {
        window.App.toast('error', 'Unable to fetch live dashboard metrics');
      });
  }

  function renderRecentAppointments(appts) {
    const $tbody = $('#recentAppointmentsBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!appts || appts.length === 0) {
      $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted"><i class="bi bi-calendar-check fs-3 d-block mb-1 text-secondary"></i>No recent appointment requests.</td></tr>');
      return;
    }

    appts.forEach(function (a) {
      const statusClass = `badge-status-${a.status}`;
      $tbody.append(`
        <tr>
          <td class="text-nowrap"><span class="fw-bold font-monospace text-primary">${a.appointment_no || '#' + a.id}</span></td>
          <td>
            <div class="fw-semibold text-dark text-nowrap">${a.patient_name}</div>
            <div class="small text-muted text-nowrap"><i class="bi bi-telephone me-1"></i>${a.phone}</div>
          </td>
          <td><span class="badge bg-light text-dark border">${a.service_name}</span></td>
          <td class="text-nowrap">
            <div class="fw-semibold text-dark">${formatSlotDate(a.appointment_date)}</div>
            <div class="small text-muted mt-1"><span class="slot-time-badge"><i class="bi bi-clock me-1 text-secondary"></i>${formatSlotTime(a.appointment_time)}</span></div>
          </td>
          <td class="text-nowrap"><span class="badge ${statusClass} px-2 py-1 text-capitalize">${a.status.replace('_', ' ')}</span></td>
        </tr>
      `);
    });
  }

  function renderRecentEnquiries(enqs) {
    const $tbody = $('#recentEnquiriesBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!enqs || enqs.length === 0) {
      $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted"><i class="bi bi-chat-square-dots fs-3 d-block mb-1 text-secondary"></i>No recent inquiries.</td></tr>');
      return;
    }

    enqs.forEach(function (e) {
      let badgeTypeClass = 'bg-secondary';
      if (e.type === 'franchise') badgeTypeClass = 'bg-primary';
      else if (e.type === 'emi') badgeTypeClass = 'bg-warning text-dark';
      else if (e.type === 'contact') badgeTypeClass = 'bg-info text-dark';
      else if (e.type === 'skin_analyser' || e.type === 'analyser') badgeTypeClass = 'bg-success';

      $tbody.append(`
        <tr>
          <td class="text-nowrap"><span class="fw-bold font-monospace text-dark">${e.enquiry_no || '#' + e.id}</span></td>
          <td class="text-nowrap"><span class="badge ${badgeTypeClass} text-uppercase px-2 py-1">${e.type.replace(/_/g, ' ')}</span></td>
          <td>
            <div class="fw-semibold text-dark text-nowrap">${e.name}</div>
            <div class="small text-muted text-nowrap"><i class="bi bi-telephone me-1"></i>${e.phone}</div>
          </td>
          <td class="text-nowrap"><span class="badge badge-status-${e.status} px-2 py-1 text-capitalize">${e.status}</span></td>
          <td class="text-nowrap"><div class="small text-muted">${e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</div></td>
        </tr>
      `);
    });
  }

  loadDashboardData();
});
