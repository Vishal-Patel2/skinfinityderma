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
        const kpis = stats.kpis || {};
        const rev = stats.revenueAnalytics || {};
        const apptAnalytics = stats.appointmentAnalytics || {};

        // 12 Core KPI Metric Counters
        $('#statPatientsCount').text(kpis.totalPatients || stats.totalPatients || 0);
        $('#statNewPatientsMonth').text(`+${kpis.newPatientsThisMonth || 0} New This Month`);
        $('#statNewPatientsNum').text(kpis.newPatientsThisMonth || 0);
        $('#statAppointmentsCount').text(kpis.totalAppointments || stats.totalAppointments || 0);
        $('#statApptsTodaySub').text(`${kpis.todayAppointments || 0} Scheduled Today`);
        $('#statTodayAppts').text(kpis.todayAppointments || stats.todayAppointments || 0);
        $('#statPendingAppointments').text(kpis.pendingAppointments || stats.pendingAppointments || 0);
        $('#statCompletedAppts').text(kpis.completedAppointments || stats.completedAppointments || 0);
        $('#statTreatmentsCount').text(kpis.totalTreatments || stats.totalTreatments || 0);
        $('#statActiveTreatments').text(`${stats.activeTreatments || 0} Active on Site`);
        $('#statActivePackages').text(kpis.activePackages || 0);
        $('#statTotalRevenue').text(kpis.totalRevenueFormatted || `₹${Number(kpis.totalRevenue || 0).toLocaleString('en-IN')}`);
        $('#statPendingPayments').text(kpis.pendingPaymentsFormatted || `₹${Number(kpis.pendingPayments || 0).toLocaleString('en-IN')}`);
        $('#statEnquiriesCount').text(kpis.totalEnquiries || stats.totalEnquiries || 0);
        $('#statNewEnquiries').text(`${stats.newEnquiries || 0} Inbound Leads`);
        $('#statVipMembers').text(kpis.activeVipMembers || 0);

        // Revenue Breakdown
        $('#revTotal').text(`₹${Number(rev.total || 0).toLocaleString('en-IN')}`);
        $('#revConsult').text(`₹${Number(rev.consultation || 0).toLocaleString('en-IN')}`);
        $('#revTreatment').text(`₹${Number(rev.treatment || 0).toLocaleString('en-IN')}`);
        $('#revPackage').text(`₹${Number(rev.package || 0).toLocaleString('en-IN')}`);
        $('#revPending').text(`₹${Number(rev.pending || 0).toLocaleString('en-IN')}`);
        $('#revRefund').text(`₹${Number(rev.refunded || 0).toLocaleString('en-IN')}`);

        // Branch Performance
        renderBranchPerformance(stats.branchPerformance || []);

        // Patient Demographics
        renderPatientDemographics(stats.patientAnalytics || {});

        // Render Monthly Trends Chart
        renderMonthlyChart(apptAnalytics.monthlyTrends || stats.monthlyTrends || []);

        // Render Popular Treatments
        renderPopularTreatments(stats.popularTreatments || []);

        // Render Recent Appointments Table
        renderRecentAppointments(stats.recentAppointments || []);

        // Render Recent Payments Table
        renderRecentPayments(stats.recentPayments || []);

        // Render Recent Enquiries Table
        renderRecentEnquiries(stats.recentEnquiries || []);
      })
      .fail(function () {
        window.App.toast('error', 'Unable to fetch live dashboard metrics');
      });
  }

  /* ========================================================================== */
  /* BRANCH PERFORMANCE MATRIX (NOIDA HQ VS GURGAON)                            */
  /* ========================================================================== */

  function renderBranchPerformance(branches) {
    const $tbody = $('#branchPerformanceBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!branches || !branches.length) {
      $tbody.html('<tr><td colspan="6" class="text-center py-3 text-muted">No branch matrix records available.</td></tr>');
      return;
    }

    branches.forEach(function (b) {
      $tbody.append(`
        <tr>
          <td>
            <div class="fw-bold text-dark font-serif">${b.title}</div>
            <small class="text-muted"><i class="bi bi-geo-alt-fill text-danger me-1"></i>Sector 36, ${b.city}</small>
          </td>
          <td><span class="badge bg-light text-dark border">${b.city}</span></td>
          <td class="text-center fw-semibold">${b.total_patients || 0}</td>
          <td class="text-center fw-semibold">${b.total_appointments || 0}</td>
          <td class="text-center"><span class="badge bg-success-subtle text-success border">${b.completed_treatments || 0}</span></td>
          <td class="text-end fw-bold text-success">₹${Number(b.branch_revenue || 0).toLocaleString('en-IN')}</td>
        </tr>
      `);
    });
  }

  /* ========================================================================== */
  /* PATIENT DEMOGRAPHICS (AGE GROUPS & GENDER)                                 */
  /* ========================================================================== */

  function renderPatientDemographics(analytics) {
    const ages = analytics.ageGroups || {};
    $('#ageUnder25').text(ages.under_25 || 0);
    $('#age2535').text(ages.age_25_35 || 0);
    $('#age3650').text(ages.age_36_50 || 0);
    $('#ageOver50').text(ages.over_50 || 0);

    const genders = analytics.genderDistribution || [];
    const totalGenders = genders.reduce((sum, g) => sum + (Number(g.count) || 0), 0) || 1;

    const $bars = $('#patientGenderBars').empty();
    genders.forEach(function (g) {
      const pct = Math.round(((Number(g.count) || 0) / totalGenders) * 100);
      $bars.append(`
        <div>
          <div class="d-flex justify-content-between small text-muted mb-1">
            <span><strong>${g.gender || 'Not Specified'}</strong> (${g.count})</span>
            <span>${pct}%</span>
          </div>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar ${g.gender === 'Female' ? 'bg-danger' : 'bg-primary'}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `);
    });
  }

  /* ========================================================================== */
  /* MONTHLY TRENDS CHART                                                       */
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
          legend: { display: false },
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
            ticks: { precision: 0, font: { size: 11, weight: '500' }, color: '#94A3B8', padding: 8 },
            grid: { color: '#F1F5F9', drawBorder: false }
          },
          x: {
            ticks: { font: { size: 11, weight: '600' }, color: '#64748B', padding: 8 },
            grid: { display: false, drawBorder: false }
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
      $tbody.html('<tr><td colspan="7" class="text-center py-4 text-muted"><i class="bi bi-calendar-check fs-3 d-block mb-1 text-secondary"></i>No recent appointment requests.</td></tr>');
      return;
    }

    appts.forEach(function (a) {
      let statusBadge = '<span class="badge bg-light text-dark border px-2 py-1 text-capitalize">Scheduled</span>';
      if (a.status === 'confirmed') statusBadge = '<span class="badge bg-success text-white px-2 py-1 text-capitalize"><i class="bi bi-check-circle-fill me-1"></i>Confirmed</span>';
      else if (a.status === 'pending') statusBadge = '<span class="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 text-capitalize"><i class="bi bi-clock me-1"></i>Pending</span>';
      else if (a.status === 'completed') statusBadge = '<span class="badge bg-primary text-white px-2 py-1 text-capitalize"><i class="bi bi-check2-all me-1"></i>Completed</span>';
      else if (a.status === 'cancelled') statusBadge = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 text-capitalize">Cancelled</span>';

      $tbody.append(`
        <tr>
          <td class="text-nowrap">
            <span class="fw-bold font-monospace text-primary">${a.appointment_no || '#' + a.id}</span>
          </td>
          <td>
            <div class="fw-bold text-dark text-nowrap">${a.patient_name}</div>
            <div class="small text-muted text-nowrap"><i class="bi bi-telephone me-1 text-success"></i>${a.phone}</div>
          </td>
          <td>
            <span class="badge bg-light text-dark border fw-normal py-1 px-2">${a.service_name}</span>
          </td>
          <td><small class="text-dark fw-semibold">${a.doctor_name || 'Assigned Doctor'}</small></td>
          <td><small class="text-muted">${a.clinic_name || 'Noida HQ'}</small></td>
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
  /* RECENT LIVE PAYMENTS TABLE                                                 */
  /* ========================================================================== */

  function renderRecentPayments(payments) {
    const $tbody = $('#recentPaymentsBody');
    if (!$tbody.length) return;
    $tbody.empty();

    if (!payments || !payments.length) {
      $tbody.html('<tr><td colspan="5" class="text-center py-3 text-muted">No recent payment transactions.</td></tr>');
      return;
    }

    payments.forEach(function (p) {
      $tbody.append(`
        <tr>
          <td class="font-monospace fw-bold small">${p.payment_no}</td>
          <td>
            <div class="fw-bold text-dark small">${p.patient_name}</div>
            <div class="text-muted" style="font-size: 0.7rem;">${p.patient_code}</div>
          </td>
          <td class="fw-bold text-success small">₹${Number(p.amount).toLocaleString('en-IN')}</td>
          <td><span class="badge bg-light text-dark border" style="font-size: 0.7rem;">${p.payment_method}</span></td>
          <td><span class="badge bg-success-subtle text-success border" style="font-size: 0.7rem;">${p.status}</span></td>
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
      $tbody.html('<tr><td colspan="4" class="text-center py-3 text-muted"><i class="bi bi-chat-square-dots fs-3 d-block mb-1 text-secondary"></i>No recent inquiries.</td></tr>');
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
            <span class="fw-bold font-monospace text-dark small">${e.enquiry_no || '#' + e.id}</span>
          </td>
          <td>
            <div class="fw-bold text-dark text-nowrap small">${e.name}</div>
            <div class="small text-muted text-nowrap"><i class="bi bi-telephone me-1 text-success"></i>${e.phone}</div>
          </td>
          <td class="text-nowrap">
            <span class="badge ${badgeTypeClass} text-uppercase px-2 py-1 fw-bold" style="font-size: 0.65rem;">${(e.type || 'Web').replace(/_/g, ' ')}</span>
          </td>
          <td class="text-nowrap">${statusBadge}</td>
        </tr>
      `);
    });
  }

  // Load live data
  loadDashboardData();
});
