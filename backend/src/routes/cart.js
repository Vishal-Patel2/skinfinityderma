const express = require('express');
const { query, one, tx } = require('../config/db');
const { authenticatePatient } = require('../middleware/auth');
const { asyncHandler, HttpError } = require('../middleware/error');

const router = express.Router();

// Strict Authentication Rule: Every cart endpoint requires a logged in patient
router.use(authenticatePatient);

/**
 * Helper: Retrieve or create active cart for the authenticated patient
 */
async function getOrCreateCart(patientId) {
  let cart = await one('SELECT * FROM sid_carts WHERE patient_id = ?', [patientId]);
  if (!cart) {
    const res = await query('INSERT INTO sid_carts (patient_id) VALUES (?)', [patientId]);
    cart = { id: res.insertId, patient_id: patientId, coupon_code: null, discount_amount: 0.0 };
  }
  return cart;
}

/**
 * Helper: Compute cart calculations with database-backed prices
 */
async function getCartFullData(cartId) {
  const items = await query(
    `SELECT ci.id, ci.cart_id, ci.item_type, ci.item_id, ci.item_name, ci.item_slug,
            ci.price, ci.quantity, ci.session_info, ci.image_url,
            (ci.price * ci.quantity) AS total_item_price
       FROM sid_cart_items ci
      WHERE ci.cart_id = ?
      ORDER BY ci.id ASC`,
    [cartId]
  );

  let subtotal = 0;
  let totalItemsCount = 0;
  for (const it of items) {
    subtotal += Number(it.total_item_price) || 0;
    totalItemsCount += Number(it.quantity) || 0;
  }

  const cart = await one('SELECT * FROM sid_carts WHERE id = ?', [cartId]);
  let discount = Number(cart.discount_amount) || 0;
  if (discount > subtotal) discount = subtotal;
  const total = Math.max(0, subtotal - discount);

  return {
    cartId: cart.id,
    items: items.map((it) => ({
      id: String(it.id),
      cartItemId: it.id,
      itemId: it.item_id,
      itemType: it.item_type,
      name: it.item_name,
      slug: it.item_slug,
      price: Number(it.price),
      priceFormatted: `₹${Number(it.price).toLocaleString('en-IN')}`,
      quantity: it.quantity,
      sessions: it.session_info || '1 Clinical Session',
      image: it.image_url || '/images/treatments/banner-acne.webp',
      totalItemPrice: Number(it.total_item_price),
      totalItemPriceFormatted: `₹${Number(it.total_item_price).toLocaleString('en-IN')}`,
    })),
    cartCount: totalItemsCount,
    subtotal,
    subtotalFormatted: `₹${subtotal.toLocaleString('en-IN')}`,
    discount,
    discountFormatted: `₹${discount.toLocaleString('en-IN')}`,
    discountCode: cart.coupon_code || null,
    total,
    totalFormatted: `₹${total.toLocaleString('en-IN')}`,
  };
}

/**
 * GET /api/cart
 * Retrieve logged-in patient's persistent cart
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.patientId);
    const data = await getCartFullData(cart.id);
    res.json({ success: true, data });
  })
);

/**
 * POST /api/cart/add
 * Add verified treatment or package to cart
 * VALIDATES PRICE FROM DATABASE - NEVER TRUSTS FRONTEND SUBMITTED PRICE
 */
router.post(
  '/add',
  asyncHandler(async (req, res) => {
    const itemType = req.body.itemType || 'treatment';
    const itemId = req.body.itemId || req.body.treatmentId;
    const quantity = req.body.quantity || 1;
    if (!itemId) throw new HttpError(400, 'Treatment or product ID is required');

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const cart = await getOrCreateCart(req.patientId);

    let dbPrice = 0;
    let itemName = '';
    let itemSlug = '';
    let itemImage = '/images/treatments/banner-acne.webp';
    let sessionInfo = '1 Clinical Session';

    if (itemType === 'treatment') {
      const treatment = await one(
        `SELECT id, name, slug, price, banner_image, duration 
           FROM sid_treatments 
          WHERE id = ? AND is_active = 1`,
        [itemId]
      );
      if (!treatment) {
        throw new HttpError(404, 'The selected treatment is currently unavailable.');
      }
      dbPrice = Number(treatment.price);
      itemName = treatment.name;
      itemSlug = treatment.slug;
      itemImage = treatment.banner_image || itemImage;
      sessionInfo = treatment.duration || '60 mins Clinical Session';
    } else {
      // Check offers or service
      const offer = await one(
        `SELECT id, title, slug, image 
           FROM sid_offers 
          WHERE id = ? AND is_active = 1`,
        [itemId]
      );
      if (offer) {
        dbPrice = 3499;
        itemName = offer.title;
        itemSlug = offer.slug || 'promotional-offer';
        itemImage = offer.image || itemImage;
        sessionInfo = 'Promotional Package';
      } else {
        throw new HttpError(404, 'Selected item could not be found.');
      }
    }

    // Upsert into sid_cart_items
    const existing = await one(
      'SELECT id, quantity FROM sid_cart_items WHERE cart_id = ? AND item_type = ? AND item_id = ?',
      [cart.id, itemType, itemId]
    );

    if (existing) {
      await query(
        'UPDATE sid_cart_items SET quantity = quantity + ?, price = ?, updated_at = NOW() WHERE id = ?',
        [qty, dbPrice, existing.id]
      );
    } else {
      await query(
        `INSERT INTO sid_cart_items 
          (cart_id, item_type, item_id, item_name, item_slug, price, quantity, session_info, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [cart.id, itemType, itemId, itemName, itemSlug, dbPrice, qty, sessionInfo, itemImage]
      );
    }

    const data = await getCartFullData(cart.id);
    res.json({
      success: true,
      message: `${itemName} added to your cart!`,
      data,
    });
  })
);

/**
 * PUT /api/cart/item/:id
 * Update item quantity in cart
 */
router.put(
  '/item/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.patientId);

    const cartItem = await one('SELECT * FROM sid_cart_items WHERE id = ? AND cart_id = ?', [id, cart.id]);
    if (!cartItem) throw new HttpError(404, 'Cart item not found');

    const newQty = parseInt(quantity, 10);
    if (newQty <= 0) {
      await query('DELETE FROM sid_cart_items WHERE id = ?', [id]);
    } else {
      await query('UPDATE sid_cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?', [newQty, id]);
    }

    const data = await getCartFullData(cart.id);
    res.json({ success: true, message: 'Cart updated', data });
  })
);

/**
 * DELETE /api/cart/item/:id
 * Remove item from cart
 */
router.delete(
  '/item/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cart = await getOrCreateCart(req.patientId);

    await query('DELETE FROM sid_cart_items WHERE id = ? AND cart_id = ?', [id, cart.id]);
    const data = await getCartFullData(cart.id);
    res.json({ success: true, message: 'Item removed from cart', data });
  })
);

/**
 * POST /api/cart/apply-coupon
 * Apply promo code with database validation
 */
router.post(
  '/apply-coupon',
  asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code || !code.trim()) throw new HttpError(400, 'Please enter a coupon code');

    const cleanCode = code.trim().toUpperCase();
    const cart = await getOrCreateCart(req.patientId);

    const coupon = await one(
      `SELECT * FROM sid_coupons 
        WHERE code = ? AND is_active = 1 
          AND (start_date IS NULL OR start_date <= CURDATE())
          AND (end_date IS NULL OR end_date >= CURDATE())`,
      [cleanCode]
    );

    if (!coupon) {
      throw new HttpError(400, `Coupon "${cleanCode}" is invalid or expired.`);
    }

    // Get current subtotal
    const items = await query('SELECT price, quantity FROM sid_cart_items WHERE cart_id = ?', [cart.id]);
    let subtotal = 0;
    for (const it of items) subtotal += Number(it.price) * Number(it.quantity);

    if (subtotal === 0) {
      throw new HttpError(400, 'Your cart is empty. Please add treatments first.');
    }

    if (coupon.min_order_amount && subtotal < Number(coupon.min_order_amount)) {
      throw new HttpError(
        400,
        `Coupon requires a minimum order of ₹${Number(coupon.min_order_amount).toLocaleString('en-IN')}`
      );
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * Number(coupon.discount_value)) / 100;
      if (coupon.max_discount_amount && discount > Number(coupon.max_discount_amount)) {
        discount = Number(coupon.max_discount_amount);
      }
    } else {
      discount = Number(coupon.discount_value);
    }

    discount = Math.min(discount, subtotal);

    await query('UPDATE sid_carts SET coupon_code = ?, discount_amount = ? WHERE id = ?', [
      cleanCode,
      discount,
      cart.id,
    ]);

    const data = await getCartFullData(cart.id);
    res.json({
      success: true,
      message: `Coupon ${cleanCode} applied! You saved ₹${discount.toLocaleString('en-IN')}`,
      data,
    });
  })
);

/**
 * POST /api/cart/remove-coupon
 */
router.post(
  '/remove-coupon',
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.patientId);
    await query('UPDATE sid_carts SET coupon_code = NULL, discount_amount = 0 WHERE id = ?', [cart.id]);
    const data = await getCartFullData(cart.id);
    res.json({ success: true, message: 'Coupon removed', data });
  })
);

/**
 * POST /api/cart/checkout
 * Process checkout: creates order, records transaction, awards loyalty points, clears cart
 */
router.post(
  '/checkout',
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.patientId);
    const cartData = await getCartFullData(cart.id);

    if (!cartData.items || cartData.items.length === 0) {
      throw new HttpError(400, 'Cannot checkout with an empty cart.');
    }

    const { paymentMethod = 'UPI', clinicId, notes } = req.body;
    const orderNo = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const result = await tx(async (q) => {
      // 1. Create order
      const orderRes = await q(
        `INSERT INTO sid_orders 
          (order_no, patient_id, subtotal, discount, total_amount, coupon_code, payment_status, order_status, clinic_id, notes)
         VALUES (?, ?, ?, ?, ?, ?, 'paid', 'confirmed', ?, ?)`,
        [
          orderNo,
          req.patientId,
          cartData.subtotal,
          cartData.discount,
          cartData.total,
          cartData.discountCode,
          clinicId ? Number(clinicId) : req.patient.preferred_clinic_id || 1,
          notes || 'Online treatment checkout',
        ]
      );
      const orderId = orderRes.insertId;

      // 2. Transfer items
      for (const item of cartData.items) {
        await q(
          `INSERT INTO sid_order_items 
            (order_id, item_type, item_id, item_name, price, quantity, total)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.itemType, item.itemId, item.name, item.price, item.quantity, item.totalItemPrice]
        );

        // If treatment, also create a patient package record for session tracking
        await q(
          `INSERT INTO sid_patient_packages
            (patient_id, treatment_id, package_name, total_sessions, used_sessions, amount_paid, purchase_date, status)
           VALUES (?, ?, ?, ?, 0, ?, CURDATE(), 'Active')`,
          [req.patientId, item.itemId, item.name, item.quantity, item.totalItemPrice]
        );
      }

      // 3. Record Payment
      const paymentNo = `PAY-SKIN-${Date.now().toString().slice(-7)}`;
      const payRes = await q(
        `INSERT INTO sid_payments
          (payment_no, order_id, patient_id, amount, payment_method, payment_type, status, notes)
         VALUES (?, ?, ?, ?, ?, 'treatment', 'successful', 'Paid online via checkout')`,
        [paymentNo, orderId, req.patientId, cartData.total, paymentMethod]
      );
      const paymentId = payRes.insertId;

      // 4. Generate Invoice
      const invoiceNo = `INV-${new Date().getFullYear()}-${String(orderId).padStart(5, '0')}`;
      const taxAmount = Math.round((cartData.total * 0.18) / 1.18 * 100) / 100;
      const baseAmount = cartData.total - taxAmount;

      await q(
        `INSERT INTO sid_invoices
          (invoice_no, order_id, payment_id, patient_id, amount, tax_amount, total_amount, invoice_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Paid')`,
        [invoiceNo, orderId, paymentId, req.patientId, baseAmount, taxAmount, cartData.total]
      );

      // 5. Award Loyalty Points (5% of order value)
      const earnedPoints = Math.floor(cartData.total * 0.05);
      if (earnedPoints > 0) {
        await q('UPDATE sid_patients SET loyalty_points = loyalty_points + ? WHERE id = ?', [
          earnedPoints,
          req.patientId,
        ]);
        await q(
          `INSERT INTO sid_loyalty_transactions (patient_id, points, transaction_type, description, reference_order_id)
           VALUES (?, ?, 'earned', ?, ?)`,
          [req.patientId, earnedPoints, `Earned ${earnedPoints} loyalty credits on order ${orderNo}`, orderId]
        );
      }

      // 6. Clear cart
      await q('DELETE FROM sid_cart_items WHERE cart_id = ?', [cart.id]);
      await q('UPDATE sid_carts SET coupon_code = NULL, discount_amount = 0 WHERE id = ?', [cart.id]);

      // 7. Activity Log
      await q(
        `INSERT INTO sid_patient_activity_logs (patient_id, activity_type, description)
         VALUES (?, 'Treatment Purchased', ?)`,
        [req.patientId, `Completed checkout for order ${orderNo}. Total Paid: ₹${cartData.total.toLocaleString('en-IN')}`]
      );

      return { orderId, orderNo, invoiceNo, total: cartData.total, earnedPoints };
    });

    res.json({
      success: true,
      message: 'Treatment package order confirmed successfully!',
      data: result,
    });
  })
);

/**
 * POST /api/cart/clear
 */
router.post(
  '/clear',
  asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.patientId);
    await query('DELETE FROM sid_cart_items WHERE cart_id = ?', [cart.id]);
    await query('UPDATE sid_carts SET coupon_code = NULL, discount_amount = 0 WHERE id = ?', [cart.id]);
    const data = await getCartFullData(cart.id);
    res.json({ success: true, message: 'Cart cleared', data });
  })
);

module.exports = router;
