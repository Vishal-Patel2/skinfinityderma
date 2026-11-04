/**
 * Skinfinity Derma Admin Dashboard
 * Real-Time Clinic Operations Controller & Executive Analytics Engine
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

        // Metric Counters
        $('#statAppointmentsCount').text(stats.totalAppointments || 0);
        $('#statPendingAppointments').text(`${stats.pendingAppointments || 0} Pending`);
        $('#statEnquiriesCount').text(stats.totalEnquiries || 0);
        $('#statNewEnquiries').text(`${stats.newEnquiries || 0} Inbound New`);
        $('#statTreatmentsCount').text(stats.totalTreatments || 0);
        $('#statActiveTreatments').text(`${stats.activeTreatments || 0} Active`);
        $('#statDoctorsCount').text(stats.totalDoctors || 0);
        $('#statActiveDoctors').text(`${stats.activeDoctors || 0} Active MDs`);
        $('#statPatientsCount').text(stats.totalPatients || 0);
        $('#statConversionRate').text(stats.conversionRate || 0);

        // Render High-End Monthly Trends Chart
        renderMonthlyChart(stats.monthlyTrends || []);

        // Render Popular Treatments with Rank Badges
        renderPopularTreatments(stats.popularTreatments || []);

        // Render Recent Appointments Table
        renderRecentAppointments(stats.recentAppointments || []);

        // Render Recent Enquiries Table
        renderRecentEnquiries(stats.recentEnquiries || []);
      })
      .fail(function () {
        window.App.toast('error', 'Unable to fetch live dashboard metrics');
      });
  }

  /* ========================================================================== */
  /* HIGH-END EXECUTIVE CHART.JS LINE GRAPH                                     */
  /* ========================================================================== */

  function renderMonthlyChart(trends) {
    const canvas = document.getElementById('monthlyTrendsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const labels = trends.map(t => t.month_label);
    const data = trends.map(t => t.count);

    if (trendsChart) {
      trendsChart.destroy();
    }

    // Emerald gradient area fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 91, 65, 0.28)');
    gradient.addColorStop(0.65, 'rgba(0, 91, 65, 0.06)');
    gradient.addColorStop(1, 'rgba(0, 91, 65, 0.00)');

    trendsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Patient Consultations & Bookings',
          data: data,
          borderColor: '#005B41',
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.42,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#005B41',
          pointBorderWidth: 2.5,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#005B41',
          pointHoverBorderColor: '#FFFFFF',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              label: function (context) {
                return ` ${context.parsed.y} Clinical Bookings`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: { size: 11, weight: '500' },
              color: '#94A3B8',
              padding: 8
            },
            grid: {
              color: '#F1F5F9',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              font: { size: 11, weight: '600' },
              color: '#64748B',
              padding: 8
            },
            grid: {
              display: false,
              drawBorder: false
            }
          }
        }
      }
    });
  }

  /* ========================================================================== */
  /* TOP BOOKED TREATMENTS WIDGET                                              */
  /* ========================================================================== */

  function renderPopularTreatments(treatments) {
    const $tbody = $('#popularTreatmentsBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!treatments || treatments.length === 0) {
      $tbody.html('<tr><td colspan="3" class="text-center py-4 text-muted small">No treatment booking data recorded yet.</td></tr>');
      return;
    }

    const maxCount = Math.max(...treatments.map(t => t.bookingCount || 0), 1);

    treatments.slice(0, 5).forEach(function (t, idx) {
      const rank = idx + 1;
      let medalClass = 'rank-medal-other';
      if (rank === 1) medalClass = 'rank-medal-1';
      else if (rank === 2) medalClass = 'rank-medal-2';
      else if (rank === 3) medalClass = 'rank-medal-3';

      const pct = Math.round(((t.bookingCount || 0) / maxCount) * 100);

      $tbody.append(`
        <tr>
          <td style="width: 44px; padding-left: 1.25rem;">
            <span class="rank-medal-badge ${medalClass}">#${rank}</span>
          </td>
          <td>
            <div class="fw-bold text-dark text-truncate font-serif" style="max-width: 200px;" title="${t.name}">${t.name}</div>
            <div class="d-flex align-items-center gap-2 mt-1">
              <span class="small text-muted" style="font-size: 0.725rem;">₹${Number(t.price || 0).toLocaleString('en-IN')}</span>
              <div class="progress flex-grow-1" style="height: 4px; max-width: 70px; background: #F1F5F9;">
                <div class="progress-bar bg-success" style="width: ${pct}%;"></div>
              </div>
            </div>
          </td>
          <td class="text-end" style="padding-right: 1.25rem;">
            <span class="badge bg-success-subtle text-success fw-bold px-2 py-1" style="font-size: 0.725rem;">${t.bookingCount || 0} Bookings</span>
          </td>
        </tr>
      `);
    });
  }

  /* ========================================================================== */
  /* RECENT APPOINTMENTS TABLE                                                  */
  /* ========================================================================== */

  function renderRecentAppointments(appts) {
    const $tbody = $('#recentAppointmentsBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!appts || appts.length === 0) {
      $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted"><i class="bi bi-calendar-check fs-3 d-block mb-1 text-secondary"></i>No recent appointment requests.</td></tr>');
      return;
    }

    appts.forEach(function (a) {
      let statusBadge = '<span class="badge bg-light text-dark border px-2 py-1 text-capitalize">Scheduled</span>';
      if (a.status === 'confirmed') statusBadge = '<span class="badge bg-success text-white px-2 py-1 text-capitalize"><i class="bi bi-check-circle-fill me-1"></i>Confirmed</span>';
      else if (a.status === 'pending') statusBadge = '<span class="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 text-capitalize"><i class="bi bi-clock me-1"></i>Pending</span>';
      else if (a.status === 'completed') statusBadge = '<span class="badge bg-primary text-white px-2 py-1 text-capitalize"><i class="bi bi-check2-all me-1"></i>Completed</span>';
      else if (a.status === 'cancelled') statusBadge = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 text-capitalize">Cancelled</span>';

      const initial = (a.patient_name || 'P').charAt(0).toUpperCase();

      $tbody.append(`
        <tr>
          <td class="text-nowrap">
            <span class="fw-bold font-monospace text-primary">${a.appointment_no || '#' + a.id}</span>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <span class="patient-initial-badge">${initial}</span>
              <div>
                <div class="fw-bold text-dark text-nowrap">${a.patient_name}</div>
                <div class="small text-muted text-nowrap"><i class="bi bi-telephone me-1 text-success"></i>${a.phone}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge bg-light text-dark border fw-normal py-1 px-2">${a.service_name}</span>
          </td>
          <td class="text-nowrap">
            <div class="fw-semibold text-dark small">${formatSlotDate(a.appointment_date)}</div>
            <div class="small text-muted mt-0.5"><i class="bi bi-clock me-1 text-muted"></i>${formatSlotTime(a.appointment_time)}</div>
          </td>
          <td class="text-center text-nowrap">${statusBadge}</td>
        </tr>
      `);
    });
  }

  /* ========================================================================== */
  /* RECENT ENQUIRIES TABLE                                                     */
  /* ========================================================================== */

  function renderRecentEnquiries(enqs) {
    const $tbody = $('#recentEnquiriesBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!enqs || enqs.length === 0) {
      $tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted"><i class="bi bi-chat-square-dots fs-3 d-block mb-1 text-secondary"></i>No recent inquiries.</td></tr>');
      return;
    }

    enqs.forEach(function (e) {
      let badgeTypeClass = 'bg-secondary text-white';
      if (e.type === 'franchise') badgeTypeClass = 'bg-primary text-white';
      else if (e.type === 'emi') badgeTypeClass = 'bg-warning text-dark';
      else if (e.type === 'contact') badgeTypeClass = 'bg-info text-white';

      let statusBadge = '<span class="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 text-capitalize">New</span>';
      if (e.status === 'contacted') statusBadge = '<span class="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 text-capitalize">Contacted</span>';
      else if (e.status === 'converted' || e.status === 'qualified') statusBadge = '<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 text-capitalize">Qualified</span>';

      $tbody.append(`
        <tr>
          <td class="text-nowrap">
            <span class="fw-bold font-monospace text-dark">${e.enquiry_no || '#' + e.id}</span>
          </td>
          <td class="text-nowrap">
            <span class="badge ${badgeTypeClass} text-uppercase px-2 py-1 fw-bold" style="font-size: 0.68rem; letter-spacing: 0.05em;">${(e.type || 'Web').replace(/_/g, ' ')}</span>
          </td>
          <td>
            <div class="fw-bold text-dark text-nowrap">${e.name}</div>
            <div class="small text-muted text-nowrap"><i class="bi bi-telephone me-1 text-success"></i>${e.phone}</div>
          </td>
          <td class="text-nowrap">${statusBadge}</td>
          <td class="text-end text-nowrap">
            <div class="small text-muted">${e.created_at ? new Date(e.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</div>
          </td>
        </tr>
      `);
    });
  }

  /* ========================================================================== */
  /* REAL-TIME NOTIFICATIONS                                                    */
  /* ========================================================================== */

  function loadNotifications() {
    window.API.getNotifications().done(function (res) {
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
          <div class="notif-item p-2 border-bottom ${isUnread ? 'bg-light' : ''}" data-id="${n.id}">
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

  // Notification click handlers
  $(document).on('click', '.notif-item', function () {
    const id = $(this).data('id');
    const $item = $(this);
    window.API.markNotificationRead(id).done(function () {
      $item.removeClass('bg-light');
      loadNotifications();
    });
  });

  $('#btnMarkAllNotifsRead').on('click', function () {
    window.API.markAllNotificationsRead().done(function () {
      loadNotifications();
    });
  });

  // Initial load
  loadDashboardData();
  loadNotifications();
});
