const path = require('path');
const mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

const TREATMENT_HIGHLIGHTS = {
  'acne-pimple-treatment': [
    'Cannula Subcision & Gold-Tip MNRF for deep scar remodeling',
    'Custom anti-acne salicylic & azelaic peels to clear active pimples',
    'Prevents post-acne dark marks (PIH) with zero social downtime'
  ],
  'viscoderm': [
    'Hydrostretch action for dynamic facial expression lines',
    'Pure ultrapure hyaluronic acid restores skin elasticity',
    'Deep dermis hydration with instant natural radiance'
  ],
  'pigmentation-treatment': [
    'Targeted Q-Switched Nd:YAG laser fragments deep melanin',
    'Calibrated for Indian skin tones to fade hyperpigmentation',
    'Restores even skin tone with zero thermal peeling'
  ],
  'melasma-treatment': [
    'Multi-depth cocktail targeting hormonal and dermal melasma',
    'Tranexamic acid and gentle laser toning to inhibit tyrosinase',
    'Long-term control protocol with personalized home maintenance'
  ],
  'dark-spots-treatment': [
    'Precision spot targeting for sun damage and post-acne marks',
    'Advanced medical peels combined with laser photo-rejuvenation',
    'Reveals bright, uniform complexion in 3-4 sessions'
  ],
  'chemical-peels': [
    'Custom medical-grade salicylic, glycolic, lactic & yellow peels',
    'Exfoliates dull surface layers and decongests clogged pores',
    'Accelerates cellular turnover for smooth, radiant texture'
  ],
  'hydrafacial': [
    'Patented vortex vacuum extraction removes stubborn blackheads',
    'Infuses antioxidants, peptides and hyaluronic acid deep into dermis',
    'Instant glass-skin glow with zero redness or downtime'
  ],
  'anti-aging-treatment': [
    'Stimulates collagen synthesis and cellular remodeling',
    'Reduces fine lines, wrinkles and loss of facial elasticity',
    'Physician-tailored non-surgical rejuvenation protocols'
  ],
  'skin-tightening': [
    'Monopolar & bipolar radiofrequency contracts loose collagen fibers',
    'Lifts sagging jowls, cheeks and neck contours naturally',
    'Painless procedure with immediate firming and progressive lift'
  ],
  'open-pores-treatment': [
    'Carbon laser toning & fractional RF shrink enlarged sebaceous pores',
    'Controls excessive oiliness and smooths orange-peel skin texture',
    'Tightens pore walls without damaging surrounding tissue'
  ],
  'fibroblast': [
    'Precision plasma energy creates micro-arcs to contract skin tissue',
    'Non-surgical eyelid lift (blepharoplasty) and wrinkle reduction',
    'Triggers natural fibroblast proliferation for long-term firming'
  ],
  'iv-glutathione-therapy': [
    'Medical-grade Master Antioxidant infused directly into bloodstream',
    'Neutralizes free radicals and detoxifies liver cells',
    'Imparts luminous all-over skin brightening and cellular vitality'
  ],
  'profhilo': [
    '100% pure high & low molecular weight hyaluronic acid bio-remodeling',
    'Bio-stimulates 4 types of collagen and elastin in the dermis',
    '5 BAP injection points per side for total tissue hydration and bounce'
  ],
  'skin-boosters': [
    'Micro-droplet stabilized hyaluronic acid injections across face & neck',
    'Deep dermal hydro-balance cures dullness and chronic dryness',
    'Provides intense dewy glow and plumps crepey skin texture'
  ],
  'thread-lift': [
    'Dissolvable PDO & PCL barbed threads lift sagging facial vectors',
    'Instantly defines jawline, cheekbones and softens marionette folds',
    'Continuous collagen stimulation along thread tracks for 12-18 months'
  ],
  'botox': [
    'US-FDA approved botulinum toxin relaxes dynamic expression wrinkles',
    'Smooths forehead furrows, frown lines and crow\'s feet in 7-10 days',
    'Natural look preserved by celebrity injector Dr. Ipshita Johri'
  ],
  'fillers': [
    'Premium US-FDA hyaluronic acid dermal fillers (Juvederm/Restylane)',
    'Restores sunken under-eyes, hollow cheeks, and contours lip shape',
    'Immediate structural enhancement lasting 12 to 24 months'
  ],
  'tan-removal': [
    'Triple-action exfoliation and medical brightening peels',
    'Reverses UV-induced sun tanning on face, neck, arms & back',
    'Restores natural skin tone and prevents photo-ageing'
  ],
  'anti-agening-facials': [
    'Medical facial combining microcurrents, peptides and oxygen therapy',
    'Firms relaxed facial muscles and infuses youth-restoring serums',
    'Leaves skin visibly lifted, supple and glowing for special events'
  ],
  'laser-toning': [
    'Sub-nanosecond acoustic pulses stimulate collagen without thermal harm',
    'Even-outs skin discoloration and improves cellular texture',
    'No peeling, crusting or downtime; safe for all Indian skin types'
  ],
  'under-eye-treatment': [
    'Targets vascular, pigmented dark circles and hollow tear troughs',
    'Gentle polynucleotide/PRP micro-injections and specialized peels',
    'Fades shadows and smooths fine under-eye crepe lines'
  ],
  'hair-fall-treatment': [
    'Comprehensive trichological root-cause diagnosis (hormones/nutrients)',
    'Targeted peptide mesotherapy and US-FDA follicular stimulation',
    'Arrests excessive shedding and fortifies weak hair shafts'
  ],
  'prp-hair-treatment': [
    'Autologous platelet-rich plasma concentrated from your own blood',
    'Releases active growth factors (PDGF, VEGF, EGF) at the hair bulb',
    'Reactivates miniaturized follicles and promotes thicker regrowth'
  ],
  'gfc-hair-treatment': [
    'Next-gen Growth Factor Concentrate with 5x higher potency than PRP',
    '100% acellular, sterile and painless formulation without RBC/WBC',
    'Visible reduction in hair fall within 3-4 clinical sessions'
  ],
  'dandruff-treatment': [
    'Medical anti-fungal scalp peel clears stubborn Malassezia buildup',
    'Soothes scalp pruritus, flaking and restores healthy microbial balance',
    'Unclogs congested hair follicles to support unhindered growth'
  ],
  'non-surgical-hair-replacement-patch': [
    '100% natural human hair system custom-matched to your hair texture',
    'Breathable derma-base allows normal washing, swimming and styling',
    'Instant full-head density transformation with zero surgical downtime'
  ],
  'alopecia-treatment': [
    'Clinical management for Alopecia Areata, Androgenetic & Telogen Effluvium',
    'Targeted intralesional immunomodulators and growth factor therapy',
    'Halts autoimmune attack and reactivates dormant hair follicles'
  ],
  'qr678-treatment': [
    'Patented biomimetic polypeptide formulation bio-engineered for hair loss',
    'Proven efficacy in androgenetic alopecia and post-COVID hair shedding',
    'Micro-infusion delivery stimulates cellular differentiation in follicles'
  ],
  'scalp-treatment': [
    'Deep detoxifying scalp scaling and oxygen jet nutrient infusion',
    'Eliminates sebum buildup, product residues and improves microcirculation',
    'Creates the optimal scalp environment for healthy, resilient hair'
  ],
  'hair-transplant': [
    'Advanced Scarless Micro-FUE & Sapphire blade follicle extraction',
    'Maximum graft survival with natural hairline angle implantation',
    'Permanent, lifelong growing hair performed by senior transplant surgeons'
  ],
  'hair-exoxomes': [
    'Cutting-edge regenerative exosome nanovesicles loaded with mRNA & proteins',
    'Signals cellular communication to repair aging and damaged follicles',
    'Dramatically boosts follicle density and hair shaft thickness'
  ],
  'laser-hair-reduction': [
    'US-FDA approved Soprano Titanium triple-wavelength technology',
    'Painless ICE Plus cooling tip calibrated for Indian skin tones',
    '90-95% permanent reduction in unwanted hair over 6-8 sessions'
  ],
  'full-body-laser-hair-reduction': [
    'Comprehensive head-to-toe coverage: arms, legs, underarms, back & bikini',
    'In-Motion gliding technology completes full body sessions in 75 mins',
    'Eliminates shaving cuts, ingrown hairs and strawberry legs permanently'
  ],
  'stretch-mark': [
    'Fractional non-ablative laser & collagen induction therapy (CIT)',
    'Rebuilds ruptured elastin fibers in red (striae rubrae) and white marks',
    'Significantly blends and smooths stretch mark texture on body areas'
  ],
  'corn-removal': [
    'Radiofrequency ablation precisely vaporizes deep hyperkeratotic corn core',
    'Immediate relief from localized foot pressure and walking pain',
    'Sterile outpatient procedure with rapid, clean healing'
  ],
  'mole-removal': [
    'Precision RF radiosurgery or ablative laser with minimal scarring',
    'Clinical evaluation ensures benign status prior to complete excision',
    'Single session procedure with seamless cosmetic healing'
  ],
  'skin-tag-removal': [
    'Painless radiofrequency vaporization removes multiple tags in minutes',
    'Safe for delicate eyelid, neck, underarm and groin skin',
    'No bleeding or stitches; smooth skin restored within 5-7 days'
  ],
  'wart-removal': [
    'Targeted radiofrequency cautery or cryotherapy destroys viral warts',
    'Eliminates root HPV infection to prevent recurrence and spreading',
    'Quick outpatient procedure with rapid recovery'
  ],
  'facial-hair-reduction': [
    'Covers chin, upper lip, jawline, cheeks and sideburns',
    'Effective for stubborn hormonal and PCOS-driven facial hair',
    'Gentle cooling prevents paradoxical hair stimulation or burning'
  ],
  'beard-shaping-laser': [
    'Permanently outlines sharp, crisp neck and upper cheek beard lines',
    'Eliminates itchy razor bumps, ingrown hairs and folliculitis',
    'Quick 15-minute lunchtime sessions with zero social downtime'
  ],
  'laser-tattoo-removal': [
    'High-power Q-Switched Nd:YAG laser breaks ink into microscopic dust',
    'Multi-wavelength clearance for black, blue, red and green pigments',
    'Minimal thermal damage protects surrounding skin from scarring'
  ],
  'laser-skin-tightening': [
    'Deep dermal bulk heating stimulates neocollagenesis and elastin',
    'Firms loose lax skin across face, neck, abdomen and arms',
    'Non-ablative protocol with zero flaking or social downtime'
  ],
  'laser-face-rejuvenation': [
    'Dual-wavelength fractional laser targets sun damage and texture',
    'Refines pores, softens fine wrinkles and promotes radiant glow',
    'Collagen remodeling continues to improve skin over 3 months'
  ],
  'q-switch-ndyag-laser': [
    'Gold-standard 1064nm & 532nm photoacoustic pigment shatter',
    'Treats melasma, freckles, birthmarks, and post-inflammatory dark spots',
    'Clinically proven for safe, effective outcomes on Indian skin'
  ],
  'fine-beam-laser': [
    'Ultra-precise micro-beam technology for targeted spot correction',
    'Addresses tiny vascular lesions, telangiectasia and sun spots',
    'High precision ensures surrounding normal tissue is untouched'
  ],
  'skin-laser-resurfacing-treatment': [
    'Fractional ablative & non-ablative lasers rebuild damaged epidermal layers',
    'Smooths deep surgical scars, acne craters and severe sun photodamage',
    'Dramatically tightens tissue architecture with doctor-supervised recovery'
  ],
  'radio-frequency-rf-laser': [
    'Deep volumetric dermal heating contracts collagen matrix',
    'Stimulates cellular regeneration to smooth skin laxity and wrinkles',
    'Painless lunchtime treatment with zero recovery required'
  ],
  'body-contouring': [
    'Non-invasive vacuum radiofrequency & ultrasound cavitation',
    'Breaks stubborn localized fat deposits and tightens loose skin',
    'Shapes waistline, thighs, buttocks and abdomen contour'
  ],
  'fat-reduction': [
    'Targeted lipolysis destroys stubborn adipocytes without surgery',
    'Effective for diet-and-exercise resistant fat pockets',
    'Natural lymphatic clearance flushes fat cells permanently'
  ],
  'double-chin-reduction': [
    'Submental fat dissolution combined with HIFU/RF jawline tightening',
    'Chisels a sharp, defined jawline and eliminates chin fullness',
    'Non-surgical, needle-precision protocol with progressive definition'
  ],
  'hifu': [
    'High-Intensity Focused Ultrasound delivers energy to SMAS muscle layer',
    'Non-surgical facelift lifting sagging brows, jowls and neck',
    'Single session procedure with results improving over 60-90 days'
  ],
  'underarm-fat-reduction': [
    'Targets bra-line and anterior axillary fat bulges safely',
    'Slims and sculpts underarm contours with skin firming',
    'Non-invasive protocol with zero post-procedure downtime'
  ],
  'bridal-packages': [
    'Doctor-designed 3 to 6 month clinical pre-bridal roadmap',
    'Includes laser hair removal, HydraFacials, body polishing and glow peels',
    'Ensures flawless high-definition radiant skin on your wedding day'
  ],
  'bronze-package': [
    'Essential 4-week bridal skin prep with medi-facials and glow peels',
    'Exfoliates dullness and provides instant dewy camera-ready hydration',
    'Tailored by senior dermatologists for sensitive wedding-ready skin'
  ],
  'gold-package': [
    'Comprehensive 2-month wedding skin, hair and body revitalization',
    'Includes full body polishing, laser toning and customized hair spa',
    'Deep dermal radiance protocol designed for the bride and groom'
  ],
  'groom-packages': [
    'Tailored clinical grooming roadmap for men before weddings & events',
    'Includes beard shaping laser, carbon pore peel, and scalp detox',
    'Delivers crisp, oil-free, sharp and confident masculine appearance'
  ],
  'platinum-package': [
    'Ultimate luxury pre-bridal aesthetic makeover over 3 to 4 months',
    'Full body laser reduction, skin boosters, HydraFacial MD & hair PRP/GFC',
    'VIP executive dermatology suite access with Dr. Ipshita Johri'
  ],
  'silver-package': [
    'Balanced 6-week skin brightening and pore refinement package',
    'Combines microdermabrasion, yellow peel and deep hydration facial',
    'Restores fresh luminous texture with zero downtime'
  ]
};

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'skinfinity_derma',
  });

  console.log('Connected to database. Updating card_highlights for all treatments...');

  const [rows] = await pool.query('SELECT id, slug, name FROM sid_treatments');
  let updatedCount = 0;

  for (const row of rows) {
    const highlights = TREATMENT_HIGHLIGHTS[row.slug];
    if (highlights && highlights.length === 3) {
      await pool.query(
        'UPDATE sid_treatments SET card_highlights = ? WHERE id = ?',
        [JSON.stringify(highlights), row.id]
      );
      updatedCount++;
    } else {
      console.warn(`No specific highlights found for slug: ${row.slug}`);
    }
  }

  console.log(`✅ Successfully updated card_highlights for ${updatedCount} of ${rows.length} treatments in database!`);
  await pool.end();
}

main().catch((err) => {
  console.error('Error updating treatments:', err);
  process.exit(1);
});
