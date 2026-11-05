const bcrypt = require('bcryptjs');
const { query, one } = require('./db');

async function seedCrmData() {
  console.log('🌱 Seeding Clinical CRM Data & Patient Dossiers...');

  const passwordHash = await bcrypt.hash('Patient@123', 10);

  // 1. Core Clinical Patients
  const patientsData = [
    {
      code: 'PAT-00101',
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '9876543210',
      whatsapp: '9876543210',
      gender: 'Female',
      age: 28,
      dob: '1996-05-14',
      address: 'A-42, Sector 50',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      clinicId: 1, // Noida HQ
      history: 'Polycystic Ovarian Syndrome (PCOS). History of recurring hormonal acne on jawline.',
      allergies: 'Penicillin, Salicylic acid 20%+ hypersensitivity',
      concerns: 'Hormonal cystic acne, post-inflammatory erythema (PIE), hirsutism',
      emergency: 'Rajesh Verma (Father) - 9876500001',
      notes: 'Prefers female dermatologist. Interested in Soprano Titanium full body laser package.',
      status: 'Active',
      points: 1250,
      tier: 'Gold Prestige Club',
    },
    {
      code: 'PAT-00102',
      name: 'Vikram Mehta',
      email: 'vikram.m@example.com',
      phone: '9811223344',
      whatsapp: '9811223344',
      gender: 'Male',
      age: 34,
      dob: '1990-11-20',
      address: 'Tower 4, DLF Phase 5',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122002',
      clinicId: 2, // Gurgaon
      history: 'Norwood Grade 3 Male Pattern Baldness with bitemporal recession. No chronic illness.',
      allergies: 'None recorded',
      concerns: 'Hair thinning at vertex and crown, early dandruff/seborrheic dermatitis',
      emergency: 'Sanya Mehta (Spouse) - 9811229988',
      notes: 'Undergoing 3rd session of autologous GFC hair therapy. Very compliant with home care serums.',
      status: 'Active',
      points: 2100,
      tier: 'Platinum Elite',
    },
    {
      code: 'PAT-00103',
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '9871122334',
      whatsapp: '9871122334',
      gender: 'Female',
      age: 30,
      dob: '1994-08-25',
      address: 'Villa 12, Express Greens',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201305',
      clinicId: 1,
      history: 'Fitzpatrick Type IV. Moderate epidermal melasma post-pregnancy. Keloid negative.',
      allergies: 'Sulfa drugs',
      concerns: 'Bilateral malar pigmentation, dullness, uneven texture',
      emergency: 'Kunal Sharma (Spouse) - 9871199881',
      notes: 'Started on Q-Switch Nd:YAG laser toning + Sugarcane HydraFacial MD regimen.',
      status: 'Active',
      points: 850,
      tier: 'Silver',
    },
    {
      code: 'PAT-00104',
      name: 'Siddharth Malhotra',
      email: 'siddharth@example.com',
      phone: '9988776655',
      whatsapp: '9988776655',
      gender: 'Male',
      age: 32,
      dob: '1992-03-18',
      address: 'House 88, Sector 15',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      clinicId: 1,
      history: 'Rolling and boxcar acne scars from adolescence. Completed Accutane course 3 years ago.',
      allergies: 'None recorded',
      concerns: 'Depressed acne craters on bilateral cheeks, enlarged sebum pores',
      emergency: 'Neha Malhotra (Sister) - 9988771122',
      notes: 'Scheduled for Cannula Subcision with Secret RF MNRF remodeling.',
      status: 'Active',
      points: 1600,
      tier: 'Gold Prestige Club',
    },
    {
      code: 'PAT-00105',
      name: 'Kavita Singhania',
      email: 'kavita.s@example.com',
      phone: '9822334455',
      whatsapp: '9822334455',
      gender: 'Female',
      age: 26,
      dob: '1998-02-10',
      address: 'B-102, Nirvana Country',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122018',
      clinicId: 2,
      history: 'Bride-to-be (Wedding in 3 months). Sensitive skin with mild sun tanning.',
      allergies: 'Latex hypersensitivity',
      concerns: 'Bridal glow, tan removal on arms & neck, hydration boost',
      emergency: 'Rohit Singhania (Brother) - 9822330011',
      notes: 'Enrolled in 60-Day Luxury Bridal Skin Preparation Package.',
      status: 'Active',
      points: 3400,
      tier: 'VIP Diamond',
    },
    {
      code: 'PAT-00106',
      name: 'Rohan Deshmukh',
      email: 'rohan.d@example.com',
      phone: '9711882233',
      whatsapp: '9711882233',
      gender: 'Male',
      age: 29,
      dob: '1995-07-04',
      address: 'Flat 401, Grand Arch, Golf Course Ext',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122003',
      clinicId: 2,
      history: 'Beard foliculitis and coarse ingrown hairs on neck.',
      allergies: 'None',
      concerns: 'Beard line laser hair shaping, razor bump prevention',
      emergency: 'Alok Deshmukh (Father) - 9711880000',
      notes: 'Undergoing Soprano Titanium beard shaping session 3.',
      status: 'Active',
      points: 500,
      tier: 'Silver',
    }
  ];

  const createdPatientIds = {};

  for (const p of patientsData) {
    const existing = await one('SELECT id FROM sid_patients WHERE phone = ?', [p.phone]);
    let pid;
    if (existing) {
      pid = existing.id;
      await query(
        `UPDATE sid_patients 
            SET patient_code = ?, name = ?, email = ?, whatsapp_no = ?, gender = ?, age = ?, dob = ?,
                address = ?, city = ?, state = ?, pincode = ?, preferred_clinic_id = ?,
                medical_history = ?, allergies = ?, skin_concerns = ?, emergency_contact = ?,
                notes = ?, status = ?, loyalty_points = ?, member_tier = ?, password_hash = ?
          WHERE id = ?`,
        [
          p.code, p.name, p.email, p.whatsapp, p.gender, p.age, p.dob,
          p.address, p.city, p.state, p.pincode, p.clinicId,
          p.history, p.allergies, p.concerns, p.emergency,
          p.notes, p.status, p.points, p.tier, passwordHash,
          pid
        ]
      );
    } else {
      const res = await query(
        `INSERT INTO sid_patients 
          (patient_code, name, email, phone, whatsapp_no, gender, age, dob, address, city, state, pincode,
           preferred_clinic_id, medical_history, allergies, skin_concerns, emergency_contact, notes, status,
           password_hash, loyalty_points, member_tier)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.code, p.name, p.email, p.phone, p.whatsapp, p.gender, p.age, p.dob,
          p.address, p.city, p.state, p.pincode, p.clinicId,
          p.history, p.allergies, p.concerns, p.emergency, p.notes, p.status,
          passwordHash, p.points, p.tier
        ]
      );
      pid = res.insertId;
    }
    createdPatientIds[p.code] = pid;
    console.log(`👤 Seeded Patient: ${p.name} (#${pid} - ${p.code})`);
  }

  // 2. Link existing appointments to patients
  const p1Id = createdPatientIds['PAT-00101'];
  const p2Id = createdPatientIds['PAT-00102'];
  const p3Id = createdPatientIds['PAT-00103'];
  const p4Id = createdPatientIds['PAT-00104'];

  await query('UPDATE sid_appointments SET patient_id = ?, clinic_id = 1, doctor_id = 1, consultation_fee = 1200, final_amount = 15300, payment_status = "paid" WHERE appointment_no = "SKF-APP-1001"', [p1Id]);
  await query('UPDATE sid_appointments SET patient_id = ?, clinic_id = 2, doctor_id = 2, consultation_fee = 1000, final_amount = 5900, payment_status = "paid" WHERE appointment_no = "SKF-APP-1002"', [p2Id]);
  await query('UPDATE sid_appointments SET patient_id = ?, clinic_id = 1, doctor_id = 1, consultation_fee = 1200, final_amount = 3499, payment_status = "pending" WHERE appointment_no = "SKF-552387"', [p3Id]);
  await query('UPDATE sid_appointments SET patient_id = ?, clinic_id = 1, doctor_id = 1, consultation_fee = 1200, final_amount = 1000, payment_status = "pending" WHERE appointment_no = "SKF-457048"', [p4Id]);

  // 3. Seed Clinical Consultations
  await query('DELETE FROM sid_patient_consultations WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);
  
  await query(`
    INSERT INTO sid_patient_consultations 
      (patient_id, doctor_id, clinic_id, consultation_date, primary_concern, symptoms, skin_hair_assessment, diagnosis, treatment_recommendations, doctor_notes, follow_up_date, status)
    VALUES 
      (?, 1, 1, '2026-10-15', 'Hormonal Cystic Acne on Chin & Jawline', 'Painful inflamed papules, flares pre-menstruation', 'Fitzpatrick IV. Sebum index 82. Inflammatory acne lesions (Grade 3).', 'Hormonal Acne Vulgaris with Post-Inflammatory Erythema', 'Salicylic acid peel 20%, Topical Clindamycin + Nicotinamide gel, Soprano Titanium laser patch test.', 'Patient advised low glycemic diet. Mandatory broad-spectrum tinted mineral SPF 50.', '2026-11-15', 'Completed'),
      (?, 2, 2, '2026-10-20', 'Crown & Hairline Thinning', 'Excessive hair shed during shower (>100 hairs/day), widening parting line', 'Dermascope scalp examination shows >20% hair miniaturization at frontal & mid-scalp. Negative pull test on occipital zone.', 'Androgenetic Alopecia (Norwood Grade 3)', '3 sessions of autologous GFC (Growth Factor Concentrate) mesotherapy + Scalp microneedling at 1.2mm depth.', 'Explained autologous blood centrifugation process. Prescribed daily Procapil & Redensyl serum.', '2026-11-20', 'Completed'),
      (?, 1, 1, '2026-10-24', 'Cheek Pigmentation & Sun Spots', 'Brown patches on cheekbones worsening post-sun exposure', 'Wood lamp examination confirms epidermal melasma with scattered solar lentigines. Healthy skin barrier.', 'Bilateral Epidermal Melasma & Photo-damage', 'Q-Switched Nd:YAG Laser Toning (1064nm low fluence) combined with Sugarcane HydraFacial MD.', 'Strict broad-spectrum PA++++ sunscreen reapplication every 3 hours.', '2026-11-24', 'Completed'),
      (?, 1, 1, '2026-10-28', 'Deep Boxcar & Rolling Acne Scars', 'Indented craters on bilateral cheeks since age 19', 'Severe tethered dermal fibrotic bands causing visible dimpling under tangential light.', 'Grade 3 Atrophic Boxcar & Rolling Acne Scars', 'Blunt Cannula Subcision followed immediately by Secret RF Microneedling (depth 2.0mm).', 'Patient consented to procedure. Post-treatment mild edema expected for 48 hours.', '2026-11-28', 'Completed')
  `, [p1Id, p2Id, p3Id, p4Id]);
  console.log('✅ Seeded Clinical Consultations');

  // 4. Seed Skin Health Records
  await query('DELETE FROM sid_patient_skin_assessments WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);
  await query(`
    INSERT INTO sid_patient_skin_assessments
      (patient_id, doctor_id, assessment_date, skin_type, skin_concerns, acne_condition, pigmentation, melasma, skin_sensitivity, hair_concerns, previous_treatments, current_skincare_routine, assessment_notes)
    VALUES
      (?, 1, '2026-10-15', 'Oily / Combination (Fitzpatrick IV)', 'Acne breakout, open pores, sebum shine', 'Grade 3 Hormonal Papulopustular', 'Post-Inflammatory Hyperpigmentation (PIH)', 'None', 'Moderate (reacts to harsh alcohol cleansers)', 'Mild hair shedding', 'OTC Benzoyl Peroxide gel with peeling', 'Gentle foaming cleanser, Niacinamide 5% serum, lightweight gel moisturizer', 'Skin barrier slightly dehydrated; focused first on soothing hydration and inflammation control.'),
      (?, 2, '2026-10-20', 'Normal to Dry Scalp', 'Scalp thinning, follicle weakening', 'None', 'None', 'None', 'Low', 'Crown thinning, receding temple hairline', 'OTC Minoxidil 5% for 6 months with intermittent compliance', 'Ketoconazole 2% shampoo 2x/week, peptide leave-in serum', 'Good donor density at occipital scalp. Excellent candidate for GFC regenerative therapy.'),
      (?, 1, '2026-10-24', 'Dry & Sun Damaged (Fitzpatrick IV)', 'Melasma patches, uneven skin tone', 'None', 'Epidermal hyperpigmentation (Malar distribution)', 'Grade 2 Bilateral Melasma', 'Normal', 'None', 'Over-the-counter brightening creams', 'Cream cleanser, Vitamin C serum 10%, Hyaluronic Acid, SPF 50+', 'Melasma responding to gentle low-energy laser toning sessions.'),
      (?, 1, '2026-10-28', 'Thick Oily Sebaceous Skin', 'Atrophic acne scarring, enlarged pores', 'Quiescent (No active cysts)', 'PIE reddish scar marks', 'None', 'Resilient', 'None', 'Oral Isotretinoin completed in 2023', 'Gentle foaming cleanser, BHA 2% liquid 1x weekly, ceramides barrier cream', 'Deep scar fibrotic tethering requires manual blunt cannula subcision releases.')
  `, [p1Id, p2Id, p3Id, p4Id]);
  console.log('✅ Seeded Skin Health Records');

  // 5. Seed Prescriptions
  await query('DELETE FROM sid_patient_prescriptions WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);
  
  const rx1 = await query(`
    INSERT INTO sid_patient_prescriptions
      (prescription_no, patient_id, doctor_id, clinic_id, diagnosis, general_advice, follow_up_date, prescription_date)
    VALUES
      ('RX-2026-1001', ?, 1, 1, 'Hormonal Acne Vulgaris with Post-Inflammatory Erythema', 'Wash face twice daily with cool water. Do not pick or scratch active papules. Apply sunscreen 20 mins before stepping outdoors.', '2026-11-15', '2026-10-15')
  `, [p1Id]);
  const rx1Id = rx1.insertId;

  await query(`
    INSERT INTO sid_prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions)
    VALUES 
      (?, 'Clindamycin Phosphate 1% + Nicotinamide 4% Gel', 'Pea-sized amount', 'Twice daily (Morning & Evening)', '4 Weeks', 'Apply strictly on active lesions after face wash'),
      (?, 'Sebamed Clear Face Care Gel', 'Thin layer', 'Twice daily', 'Ongoing', 'Gentle barrier hydration for oily acne-prone skin'),
      (?, 'Skinfinity Mineral Tinted Sunscreen SPF 50+ PA++++', '2 finger lengths', 'Every 3 Hours', 'Daily Ongoing', 'Reapply before noon and afternoon outdoor exposure')
  `, [rx1Id, rx1Id, rx1Id]);

  const rx2 = await query(`
    INSERT INTO sid_patient_prescriptions
      (prescription_no, patient_id, doctor_id, clinic_id, diagnosis, general_advice, follow_up_date, prescription_date)
    VALUES
      ('RX-2026-1002', ?, 2, 2, 'Androgenetic Alopecia (Norwood Grade 3)', 'Avoid hot water showers on scalp. Maintain balanced protein intake. No intense scalp scratching for 48h after GFC session.', '2026-11-20', '2026-10-20')
  `, [p2Id]);
  const rx2Id = rx2.insertId;

  await query(`
    INSERT INTO sid_prescription_items (prescription_id, medicine_name, dosage, frequency, duration, instructions)
    VALUES 
      (?, 'Procapil 3% + Redensyl 3% Scalp Hair Density Serum', '1 ml (using dropper)', 'Once daily at night', '90 Days', 'Massage gently into crown and hairline with fingertips until absorbed'),
      (?, 'Keratin & Biotin Complex with Zinc Tablets', '1 Tablet', 'Once daily after breakfast', '60 Days', 'Oral nutritional hair supplement'),
      (?, 'Ketoconazole 2% Scalp Solution', 'Palm full', 'Twice a week', '4 Weeks', 'Leave on scalp for 5 minutes before rinsing thoroughly')
  `, [rx2Id, rx2Id, rx2Id]);

  console.log('✅ Seeded Prescriptions & Prescription Items');

  // 6. Seed Medical Documents
  await query('DELETE FROM sid_patient_documents WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);
  await query(`
    INSERT INTO sid_patient_documents
      (patient_id, document_type, document_name, file_url, file_size, file_mime, notes, uploaded_by)
    VALUES
      (?, 'Lab Report', 'Hormonal Profile & Thyroid Panel (TSH, Free Testosterone, DHEAS)', '/documents/lab-hormones-101.pdf', 342100, 'application/pdf', 'Elevated Free Testosterone correlating with chin acne flare.', 1),
      (?, 'Skin Analysis', 'Skinfinity 3D Facial Dermascan Topology Report', '/documents/dermascan-101.pdf', 812900, 'application/pdf', 'High sebum secretion score (84/100), moderate dermal redness.', 1),
      (?, 'Trichoscopy Report', 'Digital Scalp Trichogram & Follicular Unit Count', '/documents/trichogram-102.pdf', 542000, 'application/pdf', 'Hair density: 142 hairs/cm2 in crown, miniaturization ratio 22%.', 2),
      (?, 'Treatment Consent', 'Cannula Subcision & RF Microneedling Informed Consent Form', '/documents/consent-subcision-104.pdf', 215000, 'application/pdf', 'Signed medical informed consent on file.', 1)
  `, [p1Id, p1Id, p2Id, p4Id]);
  console.log('✅ Seeded Patient Medical Documents');

  // 7. Seed Before & After Gallery
  await query('DELETE FROM sid_patient_gallery WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);
  await query(`
    INSERT INTO sid_patient_gallery
      (patient_id, treatment_id, before_image_url, after_image_url, title, description, session_date, is_private)
    VALUES
      (?, 69, '/images/before-after/acne-before.png', '/images/before-after/acne-after.png', 'Cheek & Jawline Active Acne Resolution', 'Marked reduction in inflammatory papules and erythema after 3 chemical peels & clinical skincare protocol.', '2026-10-15', 1),
      (?, 4, '/images/before-after/hair-before.png', '/images/before-after/hair-after.png', 'Crown Hair Regrowth after 2 GFC Sessions', 'Noticeable thickening and follicular density enhancement along mid-scalp parting.', '2026-10-20', 1),
      (?, 71, '/images/before-after/pigment-before.png', '/images/before-after/pigment-after.png', 'Malar Melasma Lightening', 'Significant 60% lightening of epidermal hyperpigmentation following low-fluence Q-Switch laser toning.', '2026-10-24', 1)
  `, [p1Id, p2Id, p3Id]);
  console.log('✅ Seeded Patient Clinical Gallery');

  // 8. Seed Patient Treatment Packages
  await query('DELETE FROM sid_patient_packages WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);
  await query(`
    INSERT INTO sid_patient_packages
      (patient_id, treatment_id, package_name, total_sessions, used_sessions, amount_paid, purchase_date, expiry_date, status)
    VALUES
      (?, 69, 'Full Body Soprano Titanium Laser Hair Reduction (6 Sessions)', 6, 2, 39999.00, '2026-09-15', '2027-09-15', 'Active'),
      (?, 4, 'Autologous GFC Regenerative Hair Regrowth Therapy (3 Sessions)', 3, 2, 17500.00, '2026-10-01', '2027-04-01', 'Active'),
      (?, 3, 'Signature Sugarcane HydraFacial MD Glass Glow Package (4 Sessions)', 4, 1, 11999.00, '2026-10-10', '2027-04-10', 'Active'),
      (?, 69, 'Acne Scar Subcision + Secret RF Remodeling (3 Sessions)', 3, 1, 24000.00, '2026-10-25', '2027-10-25', 'Active')
  `, [p1Id, p2Id, p3Id, p4Id]);
  console.log('✅ Seeded Patient Treatment Packages');

  // 9. Seed Payments & Invoices
  await query('DELETE FROM sid_payments WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);
  await query('DELETE FROM sid_invoices WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);

  await query(`
    INSERT INTO sid_payments
      (payment_no, patient_id, amount, payment_method, transaction_ref, payment_type, payment_date, status, notes)
    VALUES
      ('PAY-SKIN-2026-8801', ?, 39999.00, 'Credit Card', 'HDFC-TXN-998822', 'package', '2026-09-15 14:30:00', 'successful', 'Full payment for 6 sessions laser package'),
      ('PAY-SKIN-2026-8802', ?, 1200.00, 'UPI', 'UPI-GPAY-772211', 'consultation', '2026-10-15 11:45:00', 'successful', 'Senior Dermatologist initial consultation fee'),
      ('PAY-SKIN-2026-8803', ?, 17500.00, 'UPI', 'PAYTM-TXN-661100', 'package', '2026-10-01 16:15:00', 'successful', '3-Session GFC autologous therapy package'),
      ('PAY-SKIN-2026-8804', ?, 1000.00, 'Cash', 'CASH-RCPT-55110', 'consultation', '2026-10-20 15:30:00', 'successful', 'Doctor consultation fee at Gurgaon Clinic'),
      ('PAY-SKIN-2026-8805', ?, 11999.00, 'Debit Card', 'ICICI-TXN-442200', 'package', '2026-10-10 12:00:00', 'successful', 'Sugarcane HydraFacial package payment'),
      ('PAY-SKIN-2026-8806', ?, 24000.00, 'EMI', 'BAJAJ-EMI-330011', 'package', '2026-10-25 17:00:00', 'successful', '0% Interest 6-month EMI for Scar Remodeling')
  `, [p1Id, p1Id, p2Id, p2Id, p3Id, p4Id]);

  await query(`
    INSERT INTO sid_invoices
      (invoice_no, patient_id, amount, tax_amount, total_amount, invoice_date, status)
    VALUES
      ('INV-SKIN-2026-001', ?, 33897.46, 6101.54, 39999.00, '2026-09-15', 'Paid'),
      ('INV-SKIN-2026-002', ?, 1016.95, 183.05, 1200.00, '2026-10-15', 'Paid'),
      ('INV-SKIN-2026-003', ?, 14830.51, 2669.49, 17500.00, '2026-10-01', 'Paid'),
      ('INV-SKIN-2026-004', ?, 847.46, 152.54, 1000.00, '2026-10-20', 'Paid'),
      ('INV-SKIN-2026-005', ?, 10168.64, 1830.36, 11999.00, '2026-10-10', 'Paid'),
      ('INV-SKIN-2026-006', ?, 20338.98, 3661.02, 24000.00, '2026-10-25', 'Paid')
  `, [p1Id, p1Id, p2Id, p2Id, p3Id, p4Id]);
  console.log('✅ Seeded Payments & Invoices');

  // 10. Seed Patient Activity Timeline
  await query('DELETE FROM sid_patient_activity_logs WHERE patient_id IN (?, ?, ?, ?)', [p1Id, p2Id, p3Id, p4Id]);
  await query(`
    INSERT INTO sid_patient_activity_logs
      (patient_id, user_id, activity_type, description, created_at)
    VALUES
      (?, 1, 'Patient Registration', 'Patient profile registered in Skinfinity Derma clinical directory.', '2026-09-10 10:00:00'),
      (?, 1, 'Treatment Purchased', 'Enrolled in Soprano Titanium Full Body Laser Hair Reduction (6 Sessions).', '2026-09-15 14:32:00'),
      (?, 1, 'Payment Received', 'Recorded successful payment of ₹39,999 via Credit Card. Invoice #INV-SKIN-2026-001 issued.', '2026-09-15 14:35:00'),
      (?, 1, 'Consultation Completed', 'Completed clinical consultation with Dr. Ipshita Johri for hormonal acne evaluation.', '2026-10-15 11:50:00'),
      (?, 1, 'Prescription Generated', 'Prescription #RX-2026-1001 issued by Dr. Ipshita Johri.', '2026-10-15 11:55:00'),
      (?, 1, 'Document Uploaded', 'Uploaded Lab Report: Hormonal Profile & Thyroid Panel.', '2026-10-16 16:20:00'),
      (?, 1, 'Appointment Confirmed', 'Appointment SKF-APP-1001 confirmed for 05 Nov 2026 at Noida Clinic.', '2026-10-26 18:07:04'),

      (?, 2, 'Patient Registration', 'Patient profile registered for scalp trichology evaluation.', '2026-09-28 11:15:00'),
      (?, 2, 'Package Purchased', 'Purchased GFC Regenerative Hair Regrowth Therapy (3 Sessions) @ ₹17,500.', '2026-10-01 16:15:00'),
      (?, 2, 'Consultation Completed', 'Completed trichology consultation with Dr. Sukriti Agarwal.', '2026-10-20 15:35:00'),
      (?, 2, 'Prescription Generated', 'Prescription #RX-2026-1002 issued by Dr. Sukriti Agarwal.', '2026-10-20 15:40:00'),
      (?, 2, 'Document Uploaded', 'Uploaded Digital Scalp Trichogram & Follicular Unit Count.', '2026-10-20 16:00:00')
  `, [p1Id, p1Id, p1Id, p1Id, p1Id, p1Id, p1Id, p2Id, p2Id, p2Id, p2Id, p2Id]);
  console.log('✅ Seeded Patient Activity Logs');

  console.log('🎉 Clinical CRM Seeding completed successfully!');
  if (require.main === module) {
    process.exit(0);
  }
  return true;
}

if (require.main === module) {
  seedCrmData().catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  });
}

module.exports = { seedCrmData };
