const { pool } = require('../src/config/db');

async function cleanDemoData() {
  console.log('🧹 Beginning Clean Production Sanitization of Demo & Test Data...');
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const counts = {};

    // 1. Prescription items
    const [delRxItems] = await conn.query('DELETE FROM sid_prescription_items');
    counts['sid_prescription_items'] = delRxItems.affectedRows;

    // 2. Patient prescriptions
    const [delRx] = await conn.query('DELETE FROM sid_patient_prescriptions');
    counts['sid_patient_prescriptions'] = delRx.affectedRows;

    // 3. Patient consultations
    const [delConsult] = await conn.query('DELETE FROM sid_patient_consultations');
    counts['sid_patient_consultations'] = delConsult.affectedRows;

    // 4. Patient skin assessments
    const [delSkin] = await conn.query('DELETE FROM sid_patient_skin_assessments');
    counts['sid_patient_skin_assessments'] = delSkin.affectedRows;

    // 5. Patient documents
    const [delDocs] = await conn.query('DELETE FROM sid_patient_documents');
    counts['sid_patient_documents'] = delDocs.affectedRows;

    // 6. Patient gallery
    const [delGal] = await conn.query('DELETE FROM sid_patient_gallery');
    counts['sid_patient_gallery'] = delGal.affectedRows;

    // 7. Patient packages
    const [delPkg] = await conn.query('DELETE FROM sid_patient_packages');
    counts['sid_patient_packages'] = delPkg.affectedRows;

    // 8. Patient activity logs
    const [delAct] = await conn.query('DELETE FROM sid_patient_activity_logs');
    counts['sid_patient_activity_logs'] = delAct.affectedRows;

    // 9. Loyalty transactions
    const [delLoyal] = await conn.query('DELETE FROM sid_loyalty_transactions');
    counts['sid_loyalty_transactions'] = delLoyal.affectedRows;

    // 10. Invoices (linked to demo orders/appointments)
    const [delInv] = await conn.query('DELETE FROM sid_invoices');
    counts['sid_invoices'] = delInv.affectedRows;

    // 11. Payments (demo payments)
    const [delPmt] = await conn.query('DELETE FROM sid_payments');
    counts['sid_payments'] = delPmt.affectedRows;

    // 12. Order items
    const [delOrderItems] = await conn.query('DELETE FROM sid_order_items');
    counts['sid_order_items'] = delOrderItems.affectedRows;

    // 13. Orders
    const [delOrders] = await conn.query('DELETE FROM sid_orders');
    counts['sid_orders'] = delOrders.affectedRows;

    // 14. Cart items
    const [delCartItems] = await conn.query('DELETE FROM sid_cart_items');
    counts['sid_cart_items'] = delCartItems.affectedRows;

    // 15. Carts
    const [delCarts] = await conn.query('DELETE FROM sid_carts');
    counts['sid_carts'] = delCarts.affectedRows;

    // 16. Appointments (all 4 were demo records)
    const [delApp] = await conn.query('DELETE FROM sid_appointments');
    counts['sid_appointments'] = delApp.affectedRows;

    // 17. Patients (all 6 were demo records from seed)
    const [delPat] = await conn.query('DELETE FROM sid_patients');
    counts['sid_patients'] = delPat.affectedRows;

    // Reset auto_increments for clean start
    await conn.query('ALTER TABLE sid_patients AUTO_INCREMENT = 1');
    await conn.query('ALTER TABLE sid_appointments AUTO_INCREMENT = 1');
    await conn.query('ALTER TABLE sid_orders AUTO_INCREMENT = 1');
    await conn.query('ALTER TABLE sid_invoices AUTO_INCREMENT = 1');
    await conn.query('ALTER TABLE sid_payments AUTO_INCREMENT = 1');

    await conn.commit();
    console.log('✅ Demo & Test Data Cleanup Completed Successfully!');
    console.log('📊 Cleanup Summary by Table:', JSON.stringify(counts, null, 2));

    return counts;
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error during demo data cleanup:', err);
    throw err;
  } finally {
    conn.release();
  }
}

if (require.main === module) {
  cleanDemoData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { cleanDemoData };
