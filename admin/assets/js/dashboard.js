/**
 * Skinfinity Derma Admin Dashboard
 * Real-Time Clinic Operations Controller & Analytics Engine
 */

$(document).ready(function () {
  'use strict';

  let trendsChart = null;

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
        $('#statPendingAppointments').text(`${stats.pendingAppointments || 0} Pending`);
        $('#statEnquiriesCount').text(stats.totalEnquiries || 0);
        $('#statNewEnquiries').text(`${stats.newEnquiries || 0} New`);
        $('#statTreatmentsCount').text(stats.totalTreatments || 0);
        $('#statActiveTreatments').text(`${stats.activeTreatments || 0} Active`);
        $('#statDoctorsCount').text(stats.totalDoctors || 0);
        $('#statActiveDoctors').text(`${stats.activeDoctors || 0} Active`);
        $('#statPatientsCount').text(stats.totalPatients || 0);
        $('#statConversionRate').text(stats.conversionRate || 0);

        // Render Monthly Trends Chart
        renderMonthlyChart(stats.monthlyTrends || []);

        // Render Popular Treatments
        renderPopularTreatments(stats.popularTreatments || []);

        // Render Recent Appointments
        renderRecentAppointments(stats.recentAppointments || []);

        // Render Recent Enquiries
        renderRecentEnquiries(stats.recentEnquiries || []);
      })
      .fail(function () {
        window.App.toast('error', 'Unable to fetch live dashboard metrics');
      });
  }

  function renderMonthlyChart(trends) {
    const ctx = document.getElementById('monthlyTrendsChart');
    if (!ctx) return;

    const labels = trends.map(t => t.month_label);
    const data = trends.map(t => t.count);

    if (trendsChart) {
      trendsChart.destroy();
    }

    trendsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Bookings & Procedures',
          data: data,
          borderColor: '#005b41',
          backgroundColor: 'rgba(0, 91, 65, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: '#005b41',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: { size: 11 }
            },
            grid: {
              color: '#F1F5F9'
            }
          },
          x: {
            ticks: {
              font: { size: 11 }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  function renderPopularTreatments(treatments) {
    const $tbody = $('#popularTreatmentsBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!treatments || treatments.length === 0) {
      $tbody.html('<tr><td class="text-center py-4 text-muted">No treatment booking data available.</td></tr>');
      return;
    }

    treatments.forEach(function (t, idx) {
      $tbody.append(`
        <tr>
          <td style="width: 32px;"><span class="badge bg-light text-dark border">#${idx + 1}</span></td>
          <td>
            <div class="fw-semibold text-dark text-truncate" style="max-width: 170px;" title="${t.name}">${t.name}</div>
            <div class="small text-muted">₹${Number(t.price || 0).toLocaleString('en-IN')}</div>
          </td>
          <td class="text-end">
            <span class="badge bg-success-subtle text-success fw-bold">${t.bookingCount || 0} Bookings</span>
          </td>
        </tr>
      `);
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
      let statusBadgeClass = 'bg-light text-dark border';
      if (a.status === 'confirmed') statusBadgeClass = 'bg-teal text-white';
      else if (a.status === 'pending') statusBadgeClass = 'bg-warning-subtle text-dark border';
      else if (a.status === 'completed') statusBadgeClass = 'bg-primary text-white';
      else if (a.status === 'cancelled') statusBadgeClass = 'bg-danger text-white';

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
          <td class="text-nowrap"><span class="badge ${statusBadgeClass} px-2 py-1 text-capitalize">${a.status.replace('_', ' ')}</span></td>
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

      let statusBadgeClass = 'bg-light text-dark border';
      if (e.status === 'new') statusBadgeClass = 'bg-warning-subtle text-dark border';
      else if (e.status === 'contacted') statusBadgeClass = 'bg-info-subtle text-info border';
      else if (e.status === 'converted') statusBadgeClass = 'bg-primary text-white';

      $tbody.append(`
        <tr>
          <td class="text-nowrap"><span class="fw-bold font-monospace text-dark">${e.enquiry_no || '#' + e.id}</span></td>
          <td class="text-nowrap"><span class="badge ${badgeTypeClass} text-uppercase px-2 py-1">${(e.type || 'Web').replace(/_/g, ' ')}</span></td>
          <td>
            <div class="fw-semibold text-dark text-nowrap">${e.name}</div>
            <div class="small text-muted text-nowrap"><i class="bi bi-telephone me-1"></i>${e.phone}</div>
          </td>
          <td class="text-nowrap"><span class="badge ${statusBadgeClass} px-2 py-1 text-capitalize">${(e.status || 'new').replace('_', ' ')}</span></td>
          <td class="text-nowrap"><div class="small text-muted">${e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</div></td>
        </tr>
      `);
    });
  }

  // Real-Time Notifications Center
  function loadNotifications() {
    API.getNotifications().done(function (res) {
      if (!res.success) return;
      const notifs = res.data || [];
      const unreadCount = res.unreadCount || 0;

      if (unreadCount > 0) {
        $('#notifBadge').text(unreadCount).removeClass('d-none');
      } else {
        $('#notifBadge').addClass('d-none');
      }

      if (notifs.length === 0) {
        $('#notifListContainer').html('<div class="text-center py-4 text-muted small">No notifications found.</div>');
        return;
      }

      const html = notifs.slice(0, 10).map(n => {
        const isUnread = !n.read_at;
        const iconClass = n.type === 'appointment_booking' ? 'bi-calendar-check-fill text-success' : 'bi-chat-left-dots-fill text-info';
        return `
          <div class="notif-item ${isUnread ? 'unread' : ''}" data-id="${n.id}">
            <div class="d-flex align-items-start gap-2">
              <i class="bi ${iconClass} fs-5 mt-1"></i>
              <div class="flex-grow-1">
                <div class="fw-semibold small text-dark">${n.title}</div>
                <div class="small text-muted" style="font-size: 0.76rem;">${n.message}</div>
                <div class="text-muted" style="font-size: 0.68rem; margin-top: 2px;">
                  ${new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      $('#notifListContainer').html(html);
    });
  }

  // Notification clicks
  $(document).on('click', '.notif-item.unread', function () {
    const id = $(this).data('id');
    const $item = $(this);
    API.markNotificationRead(id).done(function () {
      $item.removeClass('unread');
      loadNotifications();
    });
  });

  $('#btnMarkAllNotifsRead').on('click', function () {
    API.markAllNotificationsRead().done(function () {
      loadNotifications();
    });
  });

  // Init
  loadDashboardData();
  loadNotifications();
});
