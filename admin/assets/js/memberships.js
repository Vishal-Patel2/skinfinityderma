/**
 * Skinfinity Derma Admin Dashboard
 * VIP Memberships & Loyalty Plans Controller
 * Fully Dynamic Database-Driven Architecture
 */

(function (window, $) {
  'use strict';

  let currentPlans = [];
  let membershipModal = null;

  $(document).ready(function () {
    const modalEl = document.getElementById('membershipModal');
    if (modalEl) {
      membershipModal = new bootstrap.Modal(modalEl);
    }
    loadMemberships();
    initEvents();
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initEvents() {
    $('#btnOpenAddMembership').on('click', function () {
      resetForm();
      $('#membershipModalTitle').html('<i class="bi bi-award me-2"></i>Create New Membership Plan');
      if (membershipModal) membershipModal.show();
    });

    $('#membershipForm').on('submit', function (e) {
      e.preventDefault();
      saveMembership();
    });

    // Auto slug from name
    $('#planName').on('input', function () {
      if (!$('#membershipId').val() && !$('#planSlug').data('manual')) {
        const generated = $(this).val().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        $('#planSlug').val(generated);
      }
    });

    $('#planSlug').on('input', function () {
      $(this).data('manual', true);
    });

    // Add Benefit Row button
    $('#btnAddBenefitRow').on('click', function () {
      addBenefitRow('');
    });

    // Remove Benefit Row
    $(document).on('click', '.btn-remove-benefit', function () {
      $(this).closest('.benefit-row').remove();
      updateBenefitBadge();
    });

    // Toggle Bulk Features Paste
    $('#btnToggleBulkFeatures').on('click', function () {
      $('#bulkFeaturesWrap').slideToggle(150);
    });

    // Apply Bulk Features
    $('#btnApplyBulkFeatures').on('click', function () {
      const text = $('#planFeaturesBulk').val().trim();
      if (!text) return;
      const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
      lines.forEach(function (line) {
        addBenefitRow(line);
      });
      $('#planFeaturesBulk').val('');
      $('#bulkFeaturesWrap').slideUp(150);
    });

    // Edit button click
    $(document).on('click', '.btn-edit-plan', function () {
      const id = $(this).data('id');
      const plan = currentPlans.find((p) => String(p.id) === String(id));
      if (plan) openEditModal(plan);
    });

    // Delete button click
    $(document).on('click', '.btn-delete-plan', function () {
      const id = $(this).data('id');
      const plan = currentPlans.find((p) => String(p.id) === String(id));
      if (plan) confirmDelete(plan);
    });

    // Status toggle in table
    $(document).on('change', '.plan-toggle-active', function () {
      const id = $(this).data('id');
      const isActive = $(this).is(':checked');
      updatePlanStatus(id, isActive);
    });
  }

  function addBenefitRow(text) {
    const rowHtml = `
      <div class="input-group input-group-sm benefit-row">
        <span class="input-group-text bg-white text-success"><i class="bi bi-check-circle-fill"></i></span>
        <input type="text" class="form-control benefit-input" placeholder="e.g. 1 Complimentary Sugarcane HydraFacial" value="${escapeHtml(text || '')}" required>
        <button type="button" class="btn btn-outline-danger btn-remove-benefit" title="Remove Benefit"><i class="bi bi-x-lg"></i></button>
      </div>
    `;
    const $row = $(rowHtml).appendTo('#benefitRowsContainer');
    updateBenefitBadge();
    if (!text) {
      $row.find('.benefit-input').focus();
    }
  }

  function updateBenefitBadge() {
    const count = $('#benefitRowsContainer .benefit-row').length;
    $('#benefitCountBadge').text(count + (count === 1 ? ' Benefit' : ' Benefits'));
    if (count >= 6 && count <= 7) {
      $('#benefitCountBadge').removeClass('bg-warning-subtle text-warning bg-primary-subtle text-primary').addClass('bg-success-subtle text-success');
    } else {
      $('#benefitCountBadge').removeClass('bg-success-subtle text-success').addClass('bg-primary-subtle text-primary');
    }
  }

  function loadMemberships() {
    window.API.get('/memberships')
      .then(function (res) {
        currentPlans = res.data || [];
        renderCards(currentPlans);
        renderTable(currentPlans);
        updateStats(currentPlans);
      })
      .catch(function (err) {
        console.error('Failed to load memberships:', err);
        $('#membershipsTableBody').html(
          '<tr><td colspan="7" class="text-center py-4 text-danger"><i class="bi bi-exclamation-triangle me-2"></i>Failed to load membership plans.</td></tr>'
        );
      });
  }

  function updateStats(plans) {
    let totalSubs = 0;
    let maxSub = 0;
    let popularName = 'Gold Prestige';

    plans.forEach(function (p) {
      const subs = Number(p.subscribersCount) || 0;
      totalSubs += subs;
      if (subs > maxSub) {
        maxSub = subs;
        popularName = p.name;
      }
    });

    $('#statTotalSubscribers').text(totalSubs);
    $('#statPopularTier').text(popularName);
    $('#totalPlansBadge').text(plans.length + ' Tiers Configured');
  }

  function resolveThemeClass(plan) {
    const slug = (plan.slug || '').toLowerCase();
    const passGrad = (plan.passGradient || '').toLowerCase();

    if (slug.includes('silver') || passGrad.includes('slate')) {
      return { cardClass: 'vip-pass-silver', badgeClass: 'bg-secondary text-white' };
    }
    if (slug.includes('platinum') || passGrad.includes('teal') || passGrad.includes('008081')) {
      return { cardClass: 'vip-pass-platinum', badgeClass: 'bg-teal text-white' };
    }
    if (slug.includes('rosegold') || passGrad.includes('rose')) {
      return { cardClass: 'vip-pass-rosegold', badgeClass: 'bg-danger text-white' };
    }
    if (slug.includes('sapphire') || passGrad.includes('blue')) {
      return { cardClass: 'vip-pass-sapphire', badgeClass: 'bg-primary text-white' };
    }
    return { cardClass: 'vip-pass-gold', badgeClass: 'bg-amber-500 text-dark' };
  }

  function renderCards(plans) {
    const $grid = $('#membershipCardsGrid').empty();
    if (!plans.length) {
      $grid.html('<div class="col-12 text-center py-4 text-muted">No membership plans configured. Click "Add Membership Plan" to create one.</div>');
      return;
    }

    plans.forEach(function (plan) {
      const themeInfo = resolveThemeClass(plan);
      const perks = Array.isArray(plan.features) ? plan.features : [];

      const cardHtml = `
        <div class="col-md-4">
          <div class="vip-pass-card ${themeInfo.cardClass} h-100 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="small text-uppercase fw-bold opacity-75 letter-spacing-1">Skinfinity Privilege Pass</span>
                <span class="vip-pass-chip"></span>
              </div>
              
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge ${themeInfo.badgeClass} mb-2">${plan.isPopular ? '⭐ Most Popular Tier' : 'VIP Member Tier'}</span>
                  ${!plan.isActive ? '<span class="badge bg-danger mb-2">Hidden / Inactive</span>' : ''}
                </div>
                <h3 class="font-serif fw-bold mb-1">${escapeHtml(plan.name)}</h3>
                <div class="small opacity-75">${escapeHtml(plan.tagline || 'Clinical Rejuvenation Pass')}</div>
              </div>

              <div class="my-3 py-2 border-top border-bottom border-white border-opacity-25">
                <div class="fs-2 font-serif fw-bold">${plan.priceFormatted || '₹' + plan.price} <span class="fs-6 opacity-75 fw-normal">${escapeHtml(plan.period || '/ year')}</span></div>
                <div class="small opacity-75">${escapeHtml(plan.validity || '12 Months Validity')} • <strong>${plan.subscribersCount || 0}</strong> Active Patients</div>
              </div>

              <ul class="list-unstyled small mb-3 opacity-90" style="min-height: 140px;">
                ${perks.slice(0, 6).map(p => `<li class="mb-1 d-flex align-items-start gap-1"><i class="bi bi-check-circle-fill text-warning flex-shrink-0 mt-1"></i><span>${escapeHtml(p)}</span></li>`).join('')}
                ${perks.length > 6 ? `<li class="opacity-75 mt-1 small">+ ${perks.length - 6} more privileges</li>` : ''}
              </ul>
            </div>

            <div class="pt-3 border-top border-white border-opacity-10 mt-auto">
              <button class="btn btn-sm btn-light w-100 fw-bold btn-edit-plan" data-id="${plan.id}">
                <i class="bi bi-pencil me-1"></i> Edit Tier
              </button>
            </div>
          </div>
        </div>
      `;
      $grid.append(cardHtml);
    });
  }

  function renderTable(plans) {
    const $tbody = $('#membershipsTableBody').empty();
    if (!plans.length) {
      $tbody.html('<tr><td colspan="7" class="text-center py-4 text-muted">No membership tiers configured.</td></tr>');
      return;
    }

    plans.forEach(function (plan) {
      const perksCount = Array.isArray(plan.features) ? plan.features.length : 0;
      const previewPerks = Array.isArray(plan.features) ? plan.features.slice(0, 2).join(', ') + '...' : '-';

      const tr = `
        <tr>
          <td>
            <div class="fw-bold text-dark font-serif">${escapeHtml(plan.name)}</div>
            <div class="small text-muted font-monospace">slug: ${escapeHtml(plan.slug)} ${plan.isPopular ? '<span class="badge bg-warning-subtle text-warning-emphasis ms-1">Popular</span>' : ''}</div>
          </td>
          <td>
            <span class="fw-bold text-dark fs-6">${plan.priceFormatted || '₹' + plan.price}</span>
            <div class="small text-muted">${escapeHtml(plan.period || '/ year')}</div>
          </td>
          <td>
            <span class="badge bg-light text-dark border">${escapeHtml(plan.validity || '12 Months')}</span>
          </td>
          <td>
            <span class="badge bg-primary-subtle text-primary fw-bold px-2 py-1">${plan.subscribersCount || 0} Patients</span>
          </td>
          <td>
            <span class="small text-muted text-truncate d-inline-block" style="max-width: 260px;" title="${escapeHtml(previewPerks)}">${escapeHtml(previewPerks)}</span>
            <div class="badge bg-secondary-subtle text-secondary small">${perksCount} Perks Configured</div>
          </td>
          <td>
            <div class="form-check form-switch">
              <input class="form-check-input plan-toggle-active" type="checkbox" data-id="${plan.id}" ${plan.isActive ? 'checked' : ''}>
            </div>
          </td>
          <td class="text-end">
            <button class="btn btn-outline-primary btn-sm btn-edit-plan me-1" data-id="${plan.id}" title="Edit Plan"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn btn-outline-danger btn-sm btn-delete-plan" data-id="${plan.id}" title="Delete Plan"><i class="bi bi-trash-fill"></i></button>
          </td>
        </tr>
      `;
      $tbody.append(tr);
    });
  }

  function resetForm() {
    $('#membershipId').val('');
    $('#planName').val('');
    $('#planSlug').val('').data('manual', false);
    $('#planPrice').val('');
    $('#planPeriod').val('/ year');
    $('#planValidity').val('12 Months Validity');
    $('#planTagline').val('');
    $('#planTheme').val('gold');
    $('#planDisplayOrder').val(currentPlans.length + 1);
    $('#benefitRowsContainer').empty();
    $('#planFeaturesBulk').val('');
    $('#bulkFeaturesWrap').hide();
    $('#planIsPopular').prop('checked', false);
    $('#planIsActive').prop('checked', true);

    // Provide 6 starter benefit rows for convenience
    addBenefitRow('1 Complimentary Sugarcane HydraFacial');
    addBenefitRow('15% Flat Discount on all Lasers & Peels');
    addBenefitRow('10% Discount on Dermal Fillers & Botox');
    addBenefitRow('Complimentary Digital Skin Health Analysis');
    addBenefitRow('Priority Appointment Booking Hotline');
    addBenefitRow('Doctor Consultation Pass for Self + Family');
  }

  function openEditModal(plan) {
    $('#membershipId').val(plan.id);
    $('#planName').val(plan.name);
    $('#planSlug').val(plan.slug).data('manual', true);
    $('#planPrice').val(plan.price);
    $('#planPeriod').val(plan.period || '/ year');
    $('#planValidity').val(plan.validity || '12 Months Validity');
    $('#planTagline').val(plan.tagline || '');
    $('#planDisplayOrder').val(plan.displayOrder || 1);

    let theme = 'gold';
    const slug = (plan.slug || '').toLowerCase();
    if (slug.includes('silver')) theme = 'silver';
    else if (slug.includes('platinum')) theme = 'platinum';
    else if (slug.includes('rosegold') || slug.includes('rose')) theme = 'rosegold';
    else if (slug.includes('sapphire') || slug.includes('blue')) theme = 'sapphire';
    $('#planTheme').val(theme);

    $('#benefitRowsContainer').empty();
    const features = Array.isArray(plan.features) ? plan.features : [];
    if (features.length) {
      features.forEach(function (f) {
        addBenefitRow(f);
      });
    } else {
      addBenefitRow('');
    }

    $('#planIsPopular').prop('checked', Boolean(plan.isPopular));
    $('#planIsActive').prop('checked', Boolean(plan.isActive));

    $('#membershipModalTitle').html('<i class="bi bi-pencil-square me-2"></i>Edit Membership: ' + escapeHtml(plan.name));
    if (membershipModal) membershipModal.show();
  }

  function saveMembership() {
    const id = $('#membershipId').val();
    const name = $('#planName').val().trim();
    const slug = $('#planSlug').val().trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const price = parseFloat($('#planPrice').val());
    const period = $('#planPeriod').val().trim() || '/ year';
    const validity = $('#planValidity').val().trim() || '12 Months Validity';
    const tagline = $('#planTagline').val().trim();
    const theme = $('#planTheme').val();
    const displayOrder = parseInt($('#planDisplayOrder').val(), 10) || 1;
    const isPopular = $('#planIsPopular').is(':checked') ? 1 : 0;
    const isActive = $('#planIsActive').is(':checked') ? 1 : 0;

    // Collect all benefit points from individual rows
    const benefits = [];
    $('#benefitRowsContainer .benefit-input').each(function () {
      const val = $(this).val().trim();
      if (val) benefits.push(val);
    });

    if (!benefits.length) {
      window.App.toast('error', 'Please configure at least one benefit point.');
      return;
    }

    const payload = {
      name: name,
      slug: slug,
      price: price,
      priceFormatted: '₹' + Math.round(price).toLocaleString('en-IN'),
      period: period,
      validity: validity,
      tagline: tagline,
      theme: theme,
      displayOrder: displayOrder,
      isPopular: isPopular,
      isActive: isActive,
      features: benefits,
    };

    const isEdit = Boolean(id);
    const endpoint = isEdit ? '/memberships/' + id : '/memberships';
    const method = isEdit ? window.API.put : window.API.post;

    $('#btnSaveMembership').prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Saving to MySQL...');

    method(endpoint, payload)
      .then(function () {
        if (membershipModal) membershipModal.hide();
        window.App.toast('success', isEdit ? 'Membership plan updated successfully!' : 'Membership plan created successfully!');
        loadMemberships();
      })
      .catch(function (err) {
        window.App.toast('error', err.message || 'Failed to save membership plan.');
      })
      .finally(function () {
        $('#btnSaveMembership').prop('disabled', false).html('<i class="bi bi-check-lg me-1"></i> Save Membership Plan');
      });
  }

  function updatePlanStatus(id, isActive) {
    window.API.put('/memberships/' + id, { isActive: isActive ? 1 : 0 })
      .then(function () {
        window.App.toast('success', 'Plan visibility updated.');
      })
      .catch(function (err) {
        window.App.toast('error', 'Failed to update plan status.');
        loadMemberships();
      });
  }

  function confirmDelete(plan) {
    window.App.confirm(
      'Delete ' + plan.name + '?',
      'Are you sure you want to delete this membership plan from the database? Patients currently enrolled will maintain their active privileges.',
      'Yes, Delete Plan'
    ).then(function (result) {
      if (result.isConfirmed) {
        window.API.delete('/memberships/' + plan.id)
          .then(function () {
            window.App.toast('success', 'Membership plan deleted.');
            loadMemberships();
          })
          .catch(function (err) {
            window.App.toast('error', err.message || 'Failed to delete plan.');
          });
      }
    });
  }

})(window, jQuery);
