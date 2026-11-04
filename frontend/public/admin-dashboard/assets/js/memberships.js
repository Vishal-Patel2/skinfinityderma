/**
 * Skinfinity Derma Admin Dashboard
 * VIP Memberships & Loyalty Plans Controller
 */

(function (window, $) {
  'use strict';

  let currentPlans = [];
  let membershipModal = null;

  $(document).ready(function () {
    membershipModal = new bootstrap.Modal(document.getElementById('membershipModal'));
    loadMemberships();
    initEvents();
  });

  function initEvents() {
    $('#btnOpenAddMembership').on('click', function () {
      resetForm();
      $('#membershipModalTitle').html('<i class="bi bi-award me-2"></i>Create New Membership Plan');
      membershipModal.show();
    });

    $('#membershipForm').on('submit', function (e) {
      e.preventDefault();
      saveMembership();
    });

    $(document).on('click', '.btn-edit-plan', function () {
      const id = $(this).data('id');
      const plan = currentPlans.find((p) => String(p.id) === String(id));
      if (plan) openEditModal(plan);
    });

    $(document).on('click', '.btn-delete-plan', function () {
      const id = $(this).data('id');
      const plan = currentPlans.find((p) => String(p.id) === String(id));
      if (plan) confirmDelete(plan);
    });

    $(document).on('change', '.plan-toggle-active', function () {
      const id = $(this).data('id');
      const isActive = $(this).is(':checked');
      updatePlanStatus(id, isActive);
    });
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

  function renderCards(plans) {
    const $grid = $('#membershipCardsGrid').empty();
    if (!plans.length) {
      $grid.html('<div class="col-12 text-center py-4 text-muted">No membership plans available.</div>');
      return;
    }

    plans.forEach(function (plan) {
      let cardTheme = 'vip-pass-gold';
      let badgeTheme = 'bg-amber-500 text-dark';
      const slug = (plan.slug || '').toLowerCase();

      if (slug.includes('silver')) {
        cardTheme = 'vip-pass-silver';
        badgeTheme = 'bg-secondary text-white';
      } else if (slug.includes('platinum')) {
        cardTheme = 'vip-pass-platinum';
        badgeTheme = 'bg-teal text-white';
      }

      const perks = Array.isArray(plan.features) ? plan.features.slice(0, 4) : [];

      const cardHtml = `
        <div class="col-md-4">
          <div class="vip-pass-card ${cardTheme}">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="small text-uppercase fw-bold opacity-75 letter-spacing-1">Skinfinity Privilege Pass</span>
              <span class="vip-pass-chip"></span>
            </div>
            
            <div class="mb-3">
              <span class="badge ${badgeTheme} mb-2">${plan.isPopular ? '⭐ Most Popular Tier' : 'VIP Member Tier'}</span>
              <h3 class="font-serif fw-bold mb-1">${plan.name}</h3>
              <div class="small opacity-75">${plan.tagline || 'Clinical Rejuvenation Pass'}</div>
            </div>

            <div class="my-3 py-2 border-top border-bottom border-white border-opacity-25">
              <div class="fs-2 font-serif fw-bold">${plan.priceFormatted || '₹' + plan.price} <span class="fs-6 opacity-75 fw-normal">${plan.period}</span></div>
              <div class="small opacity-75">${plan.validity} • <strong>${plan.subscribersCount || 0}</strong> Active Patients</div>
            </div>

            <ul class="list-unstyled small mb-3 opacity-90">
              ${perks.map(p => `<li><i class="bi bi-check-circle-fill me-1.5 text-warning"></i>${p}</li>`).join('')}
              ${plan.features.length > 4 ? `<li class="opacity-75 mt-1">+ ${plan.features.length - 4} more benefits</li>` : ''}
            </ul>

            <div class="d-flex gap-2 pt-2 border-top border-white border-opacity-10">
              <button class="btn btn-sm btn-light w-100 fw-bold btn-edit-plan" data-id="${plan.id}"><i class="bi bi-pencil me-1"></i> Edit Tier</button>
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
            <div class="fw-bold text-dark font-serif">${plan.name}</div>
            <div class="small text-muted font-monospace">slug: ${plan.slug} ${plan.isPopular ? '<span class="badge bg-warning-subtle text-warning-emphasis ms-1">Popular</span>' : ''}</div>
          </td>
          <td>
            <span class="fw-bold text-dark fs-6">${plan.priceFormatted || '₹' + plan.price}</span>
            <div class="small text-muted">${plan.period}</div>
          </td>
          <td>
            <span class="badge bg-light text-dark border">${plan.validity}</span>
          </td>
          <td>
            <span class="badge bg-primary-subtle text-primary fw-bold px-2 py-1">${plan.subscribersCount || 0} Patients</span>
          </td>
          <td>
            <span class="small text-muted text-truncate d-inline-block" style="max-width: 260px;" title="${previewPerks}">${previewPerks}</span>
            <div class="badge bg-secondary-subtle text-secondary small">${perksCount} Perks Included</div>
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
    $('#planSlug').val('');
    $('#planPrice').val('');
    $('#planPeriod').val('/ year');
    $('#planValidity').val('12 Months Validity');
    $('#planTagline').val('');
    $('#planTheme').val('gold');
    $('#planFeatures').val('');
    $('#planIsPopular').prop('checked', false);
    $('#planIsActive').prop('checked', true);
  }

  function openEditModal(plan) {
    $('#membershipId').val(plan.id);
    $('#planName').val(plan.name);
    $('#planSlug').val(plan.slug);
    $('#planPrice').val(plan.price);
    $('#planPeriod').val(plan.period || '/ year');
    $('#planValidity').val(plan.validity || '12 Months Validity');
    $('#planTagline').val(plan.tagline || '');
    
    let theme = 'gold';
    if ((plan.slug || '').includes('silver')) theme = 'silver';
    if ((plan.slug || '').includes('platinum')) theme = 'platinum';
    $('#planTheme').val(theme);

    const featuresText = Array.isArray(plan.features) ? plan.features.join('\n') : '';
    $('#planFeatures').val(featuresText);
    $('#planIsPopular').prop('checked', Boolean(plan.isPopular));
    $('#planIsActive').prop('checked', Boolean(plan.isActive));

    $('#membershipModalTitle').html('<i class="bi bi-pencil-square me-2"></i>Edit Membership: ' + plan.name);
    membershipModal.show();
  }

  function saveMembership() {
    const id = $('#membershipId').val();
    const name = $('#planName').val().trim();
    const slug = $('#planSlug').val().trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const price = parseFloat($('#planPrice').val());
    const period = $('#planPeriod').val().trim();
    const validity = $('#planValidity').val().trim();
    const tagline = $('#planTagline').val().trim();
    const isPopular = $('#planIsPopular').is(':checked') ? 1 : 0;
    const isActive = $('#planIsActive').is(':checked') ? 1 : 0;

    const rawFeatures = $('#planFeatures').val().split('\n').map(s => s.trim()).filter(Boolean);
    if (!rawFeatures.length) {
      window.App.toast('error', 'Please enter at least one perk or feature.');
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
      isPopular: isPopular,
      isActive: isActive,
      features: rawFeatures
    };

    const isEdit = Boolean(id);
    const endpoint = isEdit ? '/memberships/' + id : '/memberships';
    const method = isEdit ? window.API.put : window.API.post;

    $('#btnSaveMembership').prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Saving...');

    method(endpoint, payload)
      .then(function () {
        membershipModal.hide();
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
      'Are you sure you want to delete this membership plan? Patients currently enrolled will maintain their active benefits.',
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
