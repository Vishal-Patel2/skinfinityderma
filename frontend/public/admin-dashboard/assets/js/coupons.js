/**
 * Skinfinity Derma Admin Dashboard
 * Coupons & Promo Code Rules Engine Controller
 */

$(document).ready(function () {
  'use strict';

  let allCoupons = [];

  function loadCoupons() {
    $('#couponsTableBody').html('<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-warning spinner-border-sm me-2"></div>Loading coupons...</td></tr>');

    window.API.getCoupons()
      .done(function (res) {
        if (!res.success) return;
        allCoupons = res.data || [];
        $('#totalCouponsCount').text(`${allCoupons.length} Promo Codes`);

        updateStats(allCoupons);

        if (allCoupons.length === 0) {
          $('#couponsTableBody').html('<tr><td colspan="8" class="text-center py-5 text-muted"><i class="bi bi-tag fs-2 d-block mb-2 text-secondary"></i>No promotional coupons found.</td></tr>');
          return;
        }

        let html = '';
        allCoupons.forEach(function (c) {
          const discountStr = c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${Number(c.discountValue).toLocaleString('en-IN')} Flat`;
          html += `
            <tr>
              <td>
                <span class="badge bg-warning-subtle text-warning-emphasis border border-warning px-3 py-2 font-monospace fs-6">
                  <i class="bi bi-tag-fill me-1"></i>${c.code}
                </span>
              </td>
              <td>
                <div class="fw-semibold text-dark font-serif">${c.title}</div>
                <div class="small text-muted text-truncate" style="max-width: 200px;">${c.description || '—'}</div>
              </td>
              <td>
                <span class="fw-bold text-success">${discountStr}</span>
                ${c.maxDiscount ? `<div class="small text-muted">Cap: ₹${Number(c.maxDiscount).toLocaleString('en-IN')}</div>` : ''}
              </td>
              <td>
                <div class="fw-medium">${c.minOrder ? '₹' + Number(c.minOrder).toLocaleString('en-IN') : 'None (₹0)'}</div>
              </td>
              <td>
                <span class="badge bg-light text-dark border text-capitalize">${c.appliesTo || 'All'}</span>
              </td>
              <td>
                <span class="badge bg-primary-subtle text-primary fw-bold px-2 py-1">${c.usedCount || 0} Uses</span>
              </td>
              <td>
                <div class="form-check form-switch">
                  <input class="form-check-input btn-toggle-coupon" type="checkbox" data-id="${c.id}" ${c.isActive ? 'checked' : ''}>
                </div>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-danger btn-delete-coupon" data-id="${c.id}" title="Delete Promo Code">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `;
        });

        $('#couponsTableBody').html(html);
      })
      .fail(function () {
        $('#couponsTableBody').html('<tr><td colspan="8" class="text-center py-4 text-danger">Failed to load coupons.</td></tr>');
      });
  }

  function updateStats(coupons) {
    let active = 0;
    let totalUses = 0;
    let estSavings = 0;

    coupons.forEach(function (c) {
      if (c.isActive) active++;
      const uses = Number(c.usedCount) || 0;
      totalUses += uses;
      // Estimate savings: if percent, ~10% of ₹5000 * uses; if flat, flat * uses
      const val = Number(c.discountValue) || 10;
      if (c.discountType === 'percent') {
        estSavings += Math.round((5000 * val / 100) * uses);
      } else {
        estSavings += (val * uses);
      }
    });

    $('#statActiveCoupons').text(active);
    $('#statTotalRedemptions').text(totalUses);
    if (estSavings > 100000) {
      $('#statTotalSavings').text('₹' + (estSavings / 100000).toFixed(1) + ' Lakh');
    } else {
      $('#statTotalSavings').text('₹' + estSavings.toLocaleString('en-IN'));
    }
  }

  // Interactive Live Voucher Preview updating on user typing
  function updateLivePreview() {
    const code = $('#couponCode').val().trim().toUpperCase() || 'DERMA10';
    const title = $('#couponTitle').val().trim() || '10% Clinical Discount';
    const type = $('#couponType').val();
    const val = $('#couponValue').val().trim() || '10';
    const min = $('#couponMinOrder').val().trim() || '0';
    const applies = $('#couponAppliesTo option:selected').text();
    const desc = $('#couponDesc').val().trim() || 'Valid on clinical consultations and procedures across clinics.';
    const isActive = $('#couponIsActive').is(':checked');

    $('#previewCode').text(code);
    $('#previewTitle').text(title);
    $('#previewRate').text(type === 'percent' ? `${val}% OFF` : `₹${val} OFF`);
    $('#previewMin').text(`₹${Number(min).toLocaleString('en-IN')}`);
    $('#previewApplies').text(applies);
    $('#previewDesc').text(desc);
    $('#previewStatus').text(isActive ? 'Active' : 'Draft / Inactive')
      .removeClass('text-success text-danger')
      .addClass(isActive ? 'text-success' : 'text-danger');
  }

  $('#couponCode, #couponTitle, #couponValue, #couponMinOrder, #couponDesc').on('input', updateLivePreview);
  $('#couponType, #couponAppliesTo, #couponIsActive').on('change', updateLivePreview);

  $('#btnOpenAddCoupon').on('click', function () {
    $('#couponId').val('');
    $('#couponForm')[0].reset();
    $('#couponIsActive').prop('checked', true);
    $('#couponModalTitle').html('<i class="bi bi-tag-fill me-2"></i>Create New Promo Code');
    updateLivePreview();
    const modal = new bootstrap.Modal(document.getElementById('couponModal'));
    modal.show();
  });

  $('#couponForm').on('submit', function (e) {
    e.preventDefault();
    const data = {
      code: $('#couponCode').val().trim().toUpperCase(),
      title: $('#couponTitle').val().trim(),
      discountType: $('#couponType').val(),
      discountValue: Number($('#couponValue').val()),
      minOrder: Number($('#couponMinOrder').val() || 0),
      maxDiscount: $('#couponMaxDiscount').val() ? Number($('#couponMaxDiscount').val()) : null,
      appliesTo: $('#couponAppliesTo').val(),
      description: $('#couponDesc').val().trim(),
      isActive: $('#couponIsActive').is(':checked') ? 1 : 0,
    };

    window.API.createCoupon(data)
      .done(function (res) {
        if (res.success) {
          bootstrap.Modal.getInstance(document.getElementById('couponModal')).hide();
          window.App.toast('success', 'Promo code created successfully!');
          loadCoupons();
        }
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error creating promo code';
        window.App.toast('error', msg);
      });
  });

  // Toggle active/inactive
  $(document).on('change', '.btn-toggle-coupon', function () {
    const id = $(this).data('id');
    const $switch = $(this);

    window.API.patch(`/coupons/${id}/toggle`)
      .done(function (res) {
        if (res.success) {
          window.App.toast('success', res.message);
          loadCoupons();
        }
      })
      .fail(function () {
        $switch.prop('checked', !$switch.is(':checked'));
        window.App.toast('error', 'Failed to update promo status');
      });
  });

  // Delete coupon
  $(document).on('click', '.btn-delete-coupon', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Promo Code?', 'Patients will no longer be able to apply this coupon code at checkout.', 'Yes, Delete')
      .then(function (result) {
        if (result.isConfirmed) {
          window.API.delete(`/coupons/${id}`)
            .done(function (res) {
              if (res.success) {
                window.App.toast('success', 'Coupon deleted successfully');
                loadCoupons();
              }
            })
            .fail(function () {
              window.App.toast('error', 'Failed to delete coupon');
            });
        }
      });
  });

  // Test Simulator Runner
  $('#btnRunSimulator').on('click', function () {
    const code = ($('#simCode').val() || '').trim().toUpperCase();
    const subtotal = Number($('#simSubtotal').val()) || 0;

    if (!code) {
      window.App.toast('error', 'Please enter a test coupon code');
      return;
    }

    const $btn = $(this);
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Validating...');

    window.API.validateCoupon({ code: code, subtotal: subtotal })
      .done(function (res) {
        if (res.success && res.data && res.data.valid) {
          const d = res.data;
          $('#simStatusBadge').text('Valid & Applicable').removeClass('bg-danger bg-warning').addClass('bg-success');
          $('#simDiscountLabel').text(d.title || `${d.discountValue}% OFF`).removeClass('text-danger').addClass('text-success');
          
          const disc = d.discountAmount || 0;
          const final = d.finalAmount || (subtotal - disc);
          $('#simMathDetails').html(`Cart: ₹${subtotal.toLocaleString('en-IN')} • Discount: <span class="text-success fw-bold">-₹${disc.toLocaleString('en-IN')}</span> • Patient Pays: <strong>₹${final.toLocaleString('en-IN')}</strong>`);
          window.App.toast('success', `Valid coupon! Discount calculated: ₹${disc.toLocaleString('en-IN')}`);
        } else {
          $('#simStatusBadge').text('Invalid / Inapplicable').removeClass('bg-success bg-warning').addClass('bg-danger');
          $('#simDiscountLabel').text(res.message || 'Coupon not valid for this subtotal').removeClass('text-success').addClass('text-danger');
          $('#simMathDetails').html(`Patient Pays: <strong>₹${subtotal.toLocaleString('en-IN')}</strong> (No discount applied)`);
          window.App.toast('error', res.message || 'Invalid or expired coupon code');
        }
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Coupon validation failed';
        $('#simStatusBadge').text('Error').removeClass('bg-success').addClass('bg-danger');
        $('#simDiscountLabel').text(msg).removeClass('text-success').addClass('text-danger');
        $('#simMathDetails').html(`Patient Pays: <strong>₹${subtotal.toLocaleString('en-IN')}</strong>`);
        window.App.toast('error', msg);
      })
      .finally(function () {
        $btn.prop('disabled', false).html('<i class="bi bi-check-circle me-1"></i> Simulate Cart Validation');
      });
  });

  $('.quick-sim-code').on('click', function () {
    const code = $(this).data('code');
    $('#simCode').val(code);
    $('#btnRunSimulator').trigger('click');
  });

  loadCoupons();
});
