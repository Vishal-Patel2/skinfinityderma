/**
 * Skinfinity Derma Admin Dashboard
 * Dashboard Overview Controller
 */

$(document).ready(function () {
  'use strict';

  function loadDashboardData() {
    window.API.getDashboardStats()
      .done(function (res) {
        if (!res.success) return;

        const stats = res.stats;

        // Metric Counters
        $('#statBannersCount').text(stats.totalBanners);
        $('#statActiveBanners').text(`${stats.activeBanners} Active`);
        $('#navBadgeBanners').text(stats.totalBanners);

        $('#statDoctorsCount').text(stats.totalDoctors);
        $('#statActiveDoctors').text(`${stats.activeDoctors} Active`);
        $('#navBadgeDoctors').text(stats.totalDoctors);

        $('#statTreatmentsCount').text(stats.totalTreatments);
        $('#statActiveTreatments').text(`${stats.activeTreatments} Active`);
        $('#statFeaturedTreatments').text(`${stats.featuredTreatments} Featured`);
        $('#navBadgeTreatments').text(stats.totalTreatments);

        $('#statCategoriesCount').text(stats.totalCategories);
        $('#statConcernsCount').text(`${stats.totalConcerns} Concerns`);

        $('#statGalleryCount').text(stats.totalGallery);
        $('#statBeforeAfterCount').text(stats.totalBeforeAfter);

        $('#statReviewsCount').text(stats.totalReviews || 0);
        $('#statActiveReviews').text(`${stats.activeReviews || 0} Active`);
        $('#navBadgeReviews').text(stats.totalReviews || 0);

        $('#statVideoCount').text(stats.totalVideoTestimonials || 0);
        $('#statActiveVideo').text(`${stats.activeVideoTestimonials || 0} Active`);
        $('#navBadgeVideoTestimonials').text(stats.totalVideoTestimonials || 0);

        // Render Category Distribution
        renderCategoryDistribution(res.treatmentsByCategory, stats.totalTreatments);

        // Render Recent Activity Records
        renderRecentActivity(res.recentActivity);
      })
      .fail(function () {
        App.toast('error', 'Unable to fetch live dashboard metrics');
      });
  }

  function renderCategoryDistribution(categories, totalTreatments) {
    const $container = $('#categoryDistributionContainer');
    $container.empty();

    if (!categories || categories.length === 0) {
      $container.html('<div class="text-muted text-center py-3">No categories found.</div>');
      return;
    }

    categories.forEach(function (cat) {
      const percentage = totalTreatments > 0 ? Math.round((cat.count / totalTreatments) * 100) : 0;
      const html = `
        <div class="category-dist-item">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="fw-semibold text-dark small">${cat.categoryName}</span>
            <span class="small text-muted">${cat.count} Treatments (${percentage}%)</span>
          </div>
          <div class="progress" style="height: 8px; background-color: var(--accent-soft);">
            <div class="progress-bar" role="progressbar" style="width: ${percentage}%; background-color: var(--secondary);" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      `;
      $container.append(html);
    });
  }

  function renderRecentActivity(items) {
    const $tbody = $('#recentActivityTableBody');
    $tbody.empty();

    if (!items || items.length === 0) {
      $tbody.html('<tr><td colspan="5" class="text-center py-3 text-muted">No recent activity records.</td></tr>');
      return;
    }

    items.forEach(function (item) {
      let badgeClass = 'badge-active';
      if (item.status === 'Inactive' || item.status === 'Pending Review') {
        badgeClass = 'badge-inactive';
      }

      let typeBadge = '<span class="badge bg-light text-dark border">' + item.type + '</span>';
      if (item.type === 'Treatment') {
        typeBadge = '<span class="badge bg-primary-subtle text-primary border border-primary-subtle">Treatment</span>';
      } else if (item.type === 'Doctor') {
        typeBadge = '<span class="badge bg-success-subtle text-success border border-success-subtle">Doctor</span>';
      } else if (item.type === 'Banner') {
        typeBadge = '<span class="badge bg-info-subtle text-info border border-info-subtle">Banner</span>';
      } else if (item.type === 'Before & After') {
        typeBadge = '<span class="badge bg-warning-subtle text-warning border border-warning-subtle">Before/After</span>';
      } else if (item.type === 'Google Review') {
        typeBadge = '<span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="bi bi-google me-1"></i>Review</span>';
      } else if (item.type === 'Video Story') {
        typeBadge = '<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="bi bi-play-circle me-1"></i>Story</span>';
      }

      const relativeTime = window.App.formatRelativeTime(item.updatedAt);

      const row = `
        <tr>
          <td>${typeBadge}</td>
          <td><span class="fw-semibold text-dark">${item.name}</span></td>
          <td><span class="badge ${badgeClass}">${item.status}</span></td>
          <td class="text-muted small">${relativeTime}</td>
          <td class="text-end">
            <a href="${item.url}" class="btn btn-sm btn-icon btn-soft text-secondary" title="View / Edit">
              <i class="bi bi-arrow-right"></i>
            </a>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });
  }

  // Refresh stats
  $('#refreshStatsBtn').on('click', function () {
    $(this).find('i').addClass('spin');
    loadDashboardData();
    setTimeout(() => {
      $('#refreshStatsBtn i').removeClass('spin');
    }, 600);
  });

  // Initial fetch
  loadDashboardData();
});
