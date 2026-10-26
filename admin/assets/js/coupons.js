$(document).ready(function () {
  'use strict';

  function loadCoupons() {
    $('#couponsTableBody').html('<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-warning spinner-border-sm me-2"></div>Loading coupons...</td></tr>');

    window.API.getCoupons()
      .done(function (res) {
        if (!res.success) return;
        const list = res.data || [];
        $('#totalCouponsCount').text(`${list.length} Coupons`);

        if (list.length === 0) {
          $('#couponsTableBody').html('<tr><td colspan="8" class="text-center py-5 text-muted"><i class="bi bi-tag fs-2 d-block mb-2 text-secondary"></i>No promotional coupons found.</td></tr>');
          return;
        }

        let html = '';
        list.forEach(function (c) {
          const discountStr = c.discountType === 'percent' ? `${c.discountValue}% OFF` : `₹${c.discountValue} Flat`;
          html += `
            <tr>
              <td>
                <span class="badge bg-warning-subtle text-warning-emphasis border border-warning px-3 py-2 font-monospace fs-6">
                  <i class="bi bi-tag-fill me-1"></i>${c.code}
                </span>
              </td>
              <td>
                <div class="fw-semibold text-dark">${c.title}</div>
                <div class="small text-muted">${c.description || '—'}</div>
              </td>
              <td>
                <span class="fw-bold text-success">${discountStr}</span>
                ${c.maxDiscount ? `<div class="small text-muted">Cap: ₹${c.maxDiscount}</div>` : ''}
              </td>
              <td>
                <div class="fw-medium">${c.minOrder ? '₹' + Number(c.minOrder).toLocaleString('en-IN') : 'None (₹0)'}</div>
              </td>
              <td>
                <span class="badge bg-light text-dark border text-capitalize">${c.appliesTo}</span>
              </td>
              <td>
                <span class="badge bg-secondary-subtle text-secondary">${c.usedCount || 0} Uses</span>
              </td>
              <td>
                <div class="form-check form-switch">
                  <input class="form-check-input btn-toggle-coupon" type="checkbox" data-id="${c.id}" ${c.isActive ? 'checked' : ''}>
                </div>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-danger btn-delete-coupon" data-id="${c.id}">
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

  $('#btnOpenAddCoupon').on('click', function () {
    $('#couponId').val('');
    $('#couponForm')[0].reset();
    $('#couponIsActive').prop('checked', true);
    $('#couponModalTitle').text('Create Promo Code');
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
          window.App.toast('success', 'Coupon created successfully');
          loadCoupons();
        }
      })
      .fail(function (xhr) {
        const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error creating coupon';
        window.App.toast('error', msg);
      });
  });

  $(document).on('change', '.btn-toggle-coupon', function () {
    const id = $(this).data('id');
    window.API.toggleCoupon(id).done(function (res) {
      window.App.toast('success', res.message || 'Status updated');
    });
  });

  $(document).on('click', '.btn-delete-coupon', function () {
    const id = $(this).data('id');
    window.App.confirm('Delete Coupon?', 'Patients will no longer be able to use this promo code.').then(function (result) {
      if (result.isConfirmed) {
        window.API.deleteCoupon(id).done(function (res) {
          window.App.toast('success', res.message || 'Coupon deleted');
          loadCoupons();
        });
      }
    });
  });

  loadCoupons();
});
