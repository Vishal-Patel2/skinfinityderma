/**
 * Skinfinity Derma Admin Dashboard
 * Real-Time Clinic Operations & Metrics Controller
 */

$(document).ready(function () {
  'use strict';

  function loadDashboardData() {
    window.API.getDashboardStats()
      .done(function (res) {
        if (!res.success) return;
        const stats = res.data || res.stats || {};

        // Metrics Counters
        $('#statAppointmentsCount').text(stats.totalAppointments || 0);
        $('#statPendingAppointments').text(`${stats.pendingAppointments || 0} Pending`);

        $('#statEnquiriesCount').text(stats.totalEnquiries || 0);
        $('#statNewEnquiries').text(`${stats.newEnquiries || 0} New`);

        $('#statTreatmentsCount').text(stats.totalTreatments || 0);
        $('#statActiveTreatments').text(`${stats.activeTreatments || 0} Active`);

        $('#statDoctorsCount').text(stats.totalDoctors || 0);
        $('#statActiveDoctors').text(`${stats.activeDoctors || 0} Active`);

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
          <td><span class="fw-bold font-monospace text-primary">${a.appointment_no || '#' + a.id}</span></td>
          <td>
            <div class="fw-semibold text-dark">${a.patient_name}</div>
            <div class="small text-muted">${a.phone}</div>
          </td>
          <td><span class="badge bg-light text-dark border">${a.service_name}</span></td>
          <td><div class="small text-dark">${a.appointment_date}</div><div class="small text-muted">${a.appointment_time}</div></td>
          <td><span class="badge ${statusClass} px-2 py-1 text-capitalize">${a.status}</span></td>
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

      $tbody.append(`
        <tr>
          <td><span class="fw-bold font-monospace text-dark">${e.enquiry_no || '#' + e.id}</span></td>
          <td><span class="badge ${badgeTypeClass} text-uppercase">${e.type.replace(/_/g, ' ')}</span></td>
          <td>
            <div class="fw-semibold text-dark">${e.name}</div>
            <div class="small text-muted">${e.phone}</div>
          </td>
          <td><span class="badge badge-status-${e.status} px-2 py-1 text-capitalize">${e.status}</span></td>
          <td><div class="small text-muted">${e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN') : '—'}</div></td>
        </tr>
      `);
    });
  }

  loadDashboardData();
});
