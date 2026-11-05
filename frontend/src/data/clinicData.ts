export interface Doctor {
  id: string;
  name: string;
  role: string;
  qualifications: string;
  specialty: string;
  experience?: string;
  image: string;
  bio: string;
  slug: string;
  consultationFee: number;
  availableLocations: ("Noida" | "Gurgaon")[];
  availability: string;
}

export interface Treatment {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  indications: string[];
  benefits: string[];
  treatmentAreas: string[];
  procedureSteps: string[];
  youtubeVideoId?: string;
  faqs: { question: string; answer: string }[];
  bannerImage: string;
  priceGuide?: string;
}

export interface ClinicLocation {
  city: string;
  title: string;
  address: string;
  landmark: string;
  pincode: string;
  phones: string[];
  email: string;
  hours: string;
  mapEmbedUrl: string;
  mapLink?: string;
  highlights: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  treatment: string;
  rating: number;
  clinicLocation: string;
  reviewText: string;
  verified: boolean;
}

export interface RealResult {
  beforeImage?: string;
  id: string;
  patientName?: string;
  treatment: string;
  description: string;
  image: string;
  resultsType: string;
  timeframe?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  category: string;
  videoId: string;
  thumbnail?: string;
  doctor: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  color: string;
  badge: string;
  image?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  validity: string;
  tagline: string;
  popular?: boolean;
  color: string;
  passGradient: string;
  cardBg: string;
  badgeStyle: string;
  buttonStyle: string;
  accentText: string;
  features: string[];
}

export const CLINIC_STATS = {
  reviewsCount: "3,500+",
  rating: "4.8",
  yearsOfExcellence: "14+",
  totalPatients: "1,00,000+",
  expertDermatologists: "6+",
  successfulProcedures: "50,000+",
  safetyStandards: "100% US-FDA Approved"
};

export const CLINIC_LOCATIONS: ClinicLocation[] = [
  {
    city: "Noida",
    title: "Skinfinity Derma — Noida Clinic (HQ)",
    mapLink: "https://share.google/hUEpkQ6r4yLzV4KAA",
    address: "Basement Floor, House B1, Sector 36",
    landmark: "Near Logix City Centre Mall",
    pincode: "201303",
    phones: ["+91 9871941444", "+91 8929765785"],
    email: "skinfinityderma@gmail.com",
    hours: "Mon - Sun: 10:00 AM – 08:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.9449753!2d77.3473269149!3d28.5714399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a555555555%3A0x1017377320914!2sSkinfinity%20Derma%20Noida!5e0!3m2!1sen!2sin!4v166313",
    highlights: ["2 Min Walk from Wave City Center Metro", "In-House Diagnostic Lab & Pharmacy", "Full MD Dermatologist Presence", "Complete US-FDA Laser Suite"]
  },
  {
    city: "Gurgaon",
    title: "Skinfinity Derma — Gurgaon Clinic",
    mapLink: "https://share.google/lcTdjEdMmaSLRKDeF",
    address: "2nd Floor, SP1, Sector 28, Golf Course Road",
    landmark: "5 Min Drive from DLF Phase 1 & Phase 2",
    pincode: "122002",
    phones: ["+91 8591110110", "+91 9810458900"],
    email: "skinfinitygurgaonclinic@gmail.com",
    hours: "Mon - Sun: 10:00 AM – 08:00 PM",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.23!2d77.092!3d28.475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a555555555%3A0x1017377320914!2sSkinfinity%20Derma%20Gurgaon!5e0!3m2!1sen!2sin!4v167999",
    highlights: ["Prime Golf Course Road Corridor", "Orange Health Labs Partner Collection Point", "VIP Rejuvenation Suites", "Painless Diode & Alexandrite Lasers"]
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: "dr-ipshita-johri",
    name: "Dr. Ipshita Johri",
    role: "Founder, Medical Director & Chief Dermatologist",
    qualifications: "MBBS, DDV | PG Dip. Clinical Dermatology (Cardiff University, U.K.)",
    specialty: "Celebrity Dermatologist, Advanced Anti-Ageing, Facial Sculpting & Aesthetic Lasers",
    experience: "12+ Years Clinical Experience",
    image: "/images/doctors/dr-ipshita-johri.webp",
    bio: "Dr. Ipshita Johri is the visionary founder and medical director of Skinfinity Derma clinics in Noida and Gurgaon. An internationally trained clinical dermatologist holding prestigious credentials from Cardiff University UK, she is renowned for her holistic, root-cause treatment protocols, personalized aesthetics, and pioneering work in medical aesthetics across Delhi NCR. She was also crowned Ms. India Curvy 2020 Runner Up.",
    slug: "about-us",
    consultationFee: 1200,
    availableLocations: ["Noida", "Gurgaon"],
    availability: "Mon - Sun: 10:30 AM – 07:30 PM"
  },
  {
    id: "dr-sukriti",
    name: "Dr. Sukriti",
    role: "Senior Consultant Dermatologist & Aesthetic Physician",
    qualifications: "MBBS, MD - Dermatology, Venereology & Leprosy",
    specialty: "Clinical Dermatology, Melasma, Laser Skin Resurfacing & Hair Restoration",
    experience: "9+ Years Experience",
    image: "/images/doctors/dr-sukriti.webp",
    bio: "Dr. Sukriti is a senior consultant dermatologist with deep expertise in treating complex dermatological conditions, hormonal acne, melasma, and advanced laser aesthetics. She combines clinical precision with individualized treatment regimens for long-lasting skin and scalp health.",
    slug: "dr-sukriti",
    consultationFee: 1000,
    availableLocations: ["Noida", "Gurgaon"],
    availability: "Mon - Sun: 10:00 AM – 08:00 PM"
  },
  {
    id: "dr-aanchal-bansal",
    name: "Dr. Aanchal Bansal",
    role: "Senior Consultant Dermatologist",
    qualifications: "MBBS, MD - Dermatology, Venereology & Leprosy",
    specialty: "Clinical Dermatology, Acne Scar Revision & Pigmentary Disorders",
    experience: "8+ Years Experience",
    image: "/images/doctors/dr-aanchal-bansal.webp",
    bio: "Dr. Aanchal Bansal is an esteemed MD Dermatologist specializing in evidence-based treatments for stubborn acne, recalcitrant pigmentation, melasma, and surgical dermatology. She is dedicated to patient comfort and tailored therapeutic outcomes.",
    slug: "dr-aanchal-bansal",
    consultationFee: 1000,
    availableLocations: ["Noida", "Gurgaon"],
    availability: "Mon - Sat: 11:00 AM – 07:30 PM"
  },
  {
    id: "dr-neha-dhankar",
    name: "Dr. Neha Dhankar",
    role: "Consultant Dermatologist & Aesthetic Physician",
    qualifications: "MBBS, MD - Dermatology, Fellowship in Aesthetic Medicine",
    specialty: "Laser Hair Reduction, Chemical Peels, Anti-Ageing Therapies & Medi-Facials",
    experience: "7+ Years Experience",
    image: "/images/doctors/dr-neha-dhankar.webp",
    bio: "Dr. Neha Dhankar brings comprehensive expertise in advanced laser therapies and aesthetic skin rejuvenation. Her gentle approach and attention to individual skin types ensure natural, radiant outcomes.",
    slug: "dr-neha-dhankar",
    consultationFee: 1000,
    availableLocations: ["Noida", "Gurgaon"],
    availability: "Mon - Sun: 10:30 AM – 08:00 PM"
  },
  {
    id: "dr-shradha-gumber",
    name: "Dr. Shradha",
    role: "Consultant Dermatologist & Trichologist",
    qualifications: "MBBS, MD - Dermatology",
    specialty: "Hair Loss Reversal, PRP/GFC Therapies, Scalp Health & Skin Restoration",
    experience: "6+ Years Experience",
    image: "/images/doctors/dr-shradha-gumber.webp",
    bio: "Dr. Shradha is a specialist in trichology and cosmetic dermatology, dedicated to non-surgical hair restoration, cellular rejuvenation protocols, and customized medical management.",
    slug: "dr-shradha-gumber",
    consultationFee: 1000,
    availableLocations: ["Noida", "Gurgaon"],
    availability: "Tue - Sun: 10:30 AM – 07:30 PM"
  }
];

export function getDoctorByAuthorName(authorName?: string | null): {
  name: string;
  role: string;
  image: string;
  qualifications: string;
  specialty: string;
  consultTitle: string;
} {
  const raw = (authorName || "").toLowerCase().trim();

  if (raw.includes("aanchal") || raw.includes("anchal")) {
    const doc = DOCTORS.find((d) => d.id === "dr-aanchal-bansal");
    return {
      name: doc?.name || "Dr. Aanchal Bansal",
      role: doc?.role || "Senior Consultant Dermatologist",
      image: doc?.image || "/images/doctors/dr-aanchal-bansal.webp",
      qualifications: doc?.qualifications || "MBBS, MD - Dermatology, Venereology & Leprosy",
      specialty: doc?.specialty || "Clinical Dermatology, Acne Scar Revision & Pigmentary Disorders",
      consultTitle: `Consult ${doc?.name || "Dr. Aanchal Bansal"}`,
    };
  }

  if (raw.includes("sukriti")) {
    const doc = DOCTORS.find((d) => d.id === "dr-sukriti");
    return {
      name: doc?.name || "Dr. Sukriti",
      role: doc?.role || "Senior Consultant Dermatologist & Aesthetic Physician",
      image: doc?.image || "/images/doctors/dr-sukriti.webp",
      qualifications: doc?.qualifications || "MBBS, MD - Dermatology",
      specialty: doc?.specialty || "Clinical Dermatology & Laser Aesthetics",
      consultTitle: `Consult ${doc?.name || "Dr. Sukriti"}`,
    };
  }

  if (raw.includes("neha")) {
    const doc = DOCTORS.find((d) => d.id === "dr-neha-dhankar");
    return {
      name: doc?.name || "Dr. Neha Dhankar",
      role: doc?.role || "Consultant Dermatologist & Aesthetic Physician",
      image: doc?.image || "/images/doctors/dr-neha-dhankar.webp",
      qualifications: doc?.qualifications || "MBBS, MD - Dermatology",
      specialty: doc?.specialty || "Laser Hair Reduction & Skin Rejuvenation",
      consultTitle: `Consult ${doc?.name || "Dr. Neha Dhankar"}`,
    };
  }

  if (raw.includes("shradha") || raw.includes("shraddha")) {
    const doc = DOCTORS.find((d) => d.id === "dr-shradha-gumber");
    return {
      name: doc?.name || "Dr. Shradha",
      role: doc?.role || "Consultant Dermatologist & Trichologist",
      image: doc?.image || "/images/doctors/dr-shradha-gumber.webp",
      qualifications: doc?.qualifications || "MBBS, MD - Dermatology",
      specialty: doc?.specialty || "Trichology & Hair Loss Reversal",
      consultTitle: `Consult ${doc?.name || "Dr. Shradha"}`,
    };
  }

  // Default to Founder & Chief Dermatologist
  const doc = DOCTORS[0];
  return {
    name: doc?.name || "Dr. Ipshita Johri",
    role: "Senior MD Dermatologist • Founder & Medical Director",
    image: doc?.image || "/images/doctors/dr-ipshita-johri.webp",
    qualifications: doc?.qualifications || "MBBS, DDV | PG Dip. Clinical Dermatology (Cardiff Univ)",
    specialty: doc?.specialty || "Advanced Anti-Ageing, Facial Sculpting & Aesthetic Lasers",
    consultTitle: "Consult Dr. Ipshita Johri",
  };
}

export const YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: "yt-1",
    title: "Understanding Acne Scars & Subcision with Dr. Ipshita Johri",
    category: "Acne & Scars",
    videoId: "1WmieekXjG4",
    doctor: "Dr. Ipshita Johri"
  },
  {
    id: "yt-2",
    title: "Is Laser Hair Removal Permanent & Safe for Indian Skin?",
    category: "Laser Treatments",
    videoId: "h3r2K76Gb2E",
    doctor: "Dr. Ipshita Johri"
  },
  {
    id: "yt-3",
    title: "Sugarcane HydraFacial Live Treatment & Glow Demo",
    category: "Signature Medi-Facials",
    videoId: "hwjd6tDApmI",
    doctor: "Dr. Sukriti"
  },
  {
    id: "yt-4",
    title: "Hair Loss Reversal: GFC vs PRP Therapy Explained",
    category: "Hair Restoration",
    videoId: "vTJo_UtYjhI",
    doctor: "Dr. Shradha"
  },
  {
    id: "yt-5",
    title: "Non-Surgical Face Contouring with HIFU & Fillers",
    category: "Anti-Ageing",
    videoId: "FSDkGE-H3_M",
    doctor: "Dr. Ipshita Johri"
  },
  {
    id: "yt-6",
    title: "Melasma & Pigmentation Treatment Journey — Real Results",
    category: "Pigmentation",
    videoId: "jaPp0FVXt50",
    doctor: "Dr. Sukriti"
  }
];

export const TREATMENTS: Treatment[] = [
  {
    id: "acne-pimple-treatment-noida",
    slug: "acne-pimple-treatment-noida",
    name: "Acne & Acne Scar Treatment",
    category: "Skin Treatments",
    shortDesc: "Comprehensive clinical acne removal and scar remodeling using US-FDA approved lasers, subcision, MNRF, and chemical peels.",
    fullDesc: "Acne is more than a superficial condition; it is a complex inflammatory disorder influenced by hormones, sebum overproduction, microbial activity, and skin barrier compromise. At Skinfinity Derma, our board-certified dermatologists provide an individualized, root-cause approach combining targeted medical prescriptions, customized organic and medical peels, carbon laser therapy, subcision, and micro-needling radiofrequency (MNRF) to stop active breakouts and remodel stubborn atrophic or hypertrophic scars.",
    indications: ["Active cystic and pustular acne", "Hormonal breakouts", "Icepick, boxcar, and rolling scars", "Post-inflammatory hyperpigmentation (PIH)", "Congested pores and blackheads"],
    benefits: ["Treats the root cause rather than temporary surface symptoms", "Safe, US-FDA approved technologies with minimal downtime", "Noticeable texture and clarity improvement within 2-4 sessions", "Formulated specifically for Indian skin types to prevent PIH"],
    treatmentAreas: ["Full Face & Cheeks", "Forehead & Temples", "Jawline & Chin", "Upper Back & Shoulders", "Chest Area"],
    procedureSteps: [
      "Digital Skin Analysis & Dermatologist Consultation",
      "Custom Medical Grade Deep Cleansing & Extraction",
      "Active Acne Control (Medical Peels / Carbon Laser)",
      "Scar Revision via Subcision & Fractional Laser / MNRF",
      "Soothing Post-Procedure Barrier Repair & Home Regimen"
    ],
    youtubeVideoId: "1WmieekXjG4",
    faqs: [
      {
        question: "What is the best acne treatment in Noida?",
        answer: "The best treatment combines root-cause medical diagnostics with clinical procedures such as Salicylic/Glycolic peels, Carbon Q-Switched lasers, and MNRF tailored to your specific skin grading."
      },
      {
        question: "How much does acne and scar treatment cost in Noida?",
        answer: "Costs typically range from ₹2,500 to ₹7,500 per session depending on the grade of acne, severity of scarring, and whether laser resurfacing or MNRF is required."
      },
      {
        question: "Can acne scars be permanently treated?",
        answer: "Yes, collagen remodeling through fractional lasers, subcision, and MNRF provides permanent textural repair. Active breakouts are managed to prevent new scars from forming."
      },
      {
        question: "Is laser treatment safe for dark Indian skin tones?",
        answer: "Absolutely. At Skinfinity Derma, we calibrate laser wavelength, pulse width, and fluences precisely for Fitzpatrick skin types III to V to avoid hyperpigmentation."
      }
    ],
    bannerImage: "/images/treatments/banner-acne.webp",
    priceGuide: "Starting from ₹2,500 / session"
  },
  {
    id: "laser-hair-removal-noida",
    slug: "laser-hair-removal-noida",
    name: "US-FDA Laser Hair Removal",
    category: "Laser Treatments",
    shortDesc: "Triple-wavelength diode and Alexandrite laser hair reduction with advanced sapphire contact cooling for pain-free, permanent results.",
    fullDesc: "Eliminate unwanted facial and body hair permanently with Skinfinity Derma's gold-standard laser hair reduction. Using advanced multi-wavelength technology with integrated ice-chill contact cooling, our lasers target melanin in the hair bulb while protecting the surrounding epidermis. Safe for all Indian skin tones and effective on coarse as well as fine hair.",
    indications: ["Unwanted facial hair (upper lip, chin, sideburns)", "PCOS/hormonal hirsutism", "Body hair on arms, legs, back, chest, and bikini area", "Folliculitis and ingrown hairs from shaving or waxing"],
    benefits: ["Up to 90-95% permanent hair reduction", "Integrated cooling tip ensures practically painless treatment", "Prevents ingrown hairs, razor bumps, and skin irritation", "Significantly smoother skin and long-term cost savings compared to waxing"],
    treatmentAreas: ["Upper Lip, Chin & Sideburns", "Underarms", "Full Arms & Hands", "Full Legs & Feet", "Bikini & Brazilian", "Chest & Full Back", "Full Body"],
    procedureSteps: [
      "Hair Density & Follicle Assessment",
      "Precision Shaving & Area Mapping",
      "Application of Chilled Ultrasound Contact Gel",
      "Multi-Pass Gliding Laser Treatment with Continuous Cooling",
      "Calming Aloe Gel & High-SPF Broad-Spectrum Sun Protection"
    ],
    youtubeVideoId: "h3r2K76Gb2E",
    faqs: [
      {
        question: "Is laser hair removal permanent?",
        answer: "Laser hair reduction destroys the active hair follicles, providing 90-95% permanent reduction. Maintenance touch-ups once or twice a year maintain flawless results."
      },
      {
        question: "How many sessions are typically required?",
        answer: "Because hair grows in cycles (anagen, catagen, telogen), most patients achieve optimal clearance in 6 to 8 sessions spaced 4 to 6 weeks apart."
      },
      {
        question: "Is the treatment painful?",
        answer: "With our advanced sapphire contact cooling technology, patients typically feel only a mild warm tingling sensation, far more comfortable than waxing."
      }
    ],
    bannerImage: "/images/treatments/banner-laser.webp",
    priceGuide: "Sessions starting from ₹1,499"
  },
  {
    id: "sugarcane-hydrafacial",
    slug: "sugarcane-hydrafacial",
    name: "Sugarcane HydraFacial",
    category: "Medi-Facials & Glow",
    shortDesc: "Signature natural glycolic extraction and vortex antioxidant infusion for instant glass-skin radiance and unclogged pores.",
    fullDesc: "Skinfinity Derma's signature Sugarcane HydraFacial combines natural sugarcane-derived alpha-hydroxy acids (pure glycolic exfoliation) with vortex deep-pore suction and patented antioxidant serum infusions. Designed for patients who crave immediate luminous glow, deep cellular hydration, and refined skin texture without irritation or social downtime.",
    indications: ["Dull, fatigued, or dehydrated complexion", "Congested, enlarged pores and blackheads", "Uneven skin tone and superficial tan", "Pre-event or bridal skin preparation"],
    benefits: ["Immediate visible glow from the first session", "Deep lymphatic drainage and painless pore extraction", "Restores essential hyaluronic moisture and vitamins", "Zero downtime — walk out event-ready"],
    treatmentAreas: ["Full Face", "Neck & Décolletage", "Upper Back Glow", "Hands Rejuvenation"],
    procedureSteps: [
      "Vortex Cleansing & Gentle Exfoliation",
      "Sugarcane Pure Glycolic Peel Rejuvenation",
      "Painless Vacuum Extraction of Impurities",
      "Deep Hyaluronic Acid & Peptide Infusion",
      "LED Phototherapy for Collagen Activation"
    ],
    youtubeVideoId: "hwjd6tDApmI",
    faqs: [
      {
        question: "How is Sugarcane HydraFacial different from a salon facial?",
        answer: "Unlike salon facials that use superficial creams, Sugarcane HydraFacial uses medical-grade vacuum vortex technology and pure dermatological actives that penetrate deep into the dermis."
      },
      {
        question: "How frequently should I get a Sugarcane HydraFacial?",
        answer: "We recommend a monthly session to maintain clear pores, optimal skin cellular turnover, and consistent glass-skin luminosity."
      }
    ],
    bannerImage: "/images/treatments/banner-hydrafacial.webp",
    priceGuide: "Packages from ₹3,999"
  },
  {
    id: "hair-loss-treatment",
    slug: "hair-loss-treatment",
    name: "Advanced Hair Loss & PRP/GFC Therapy",
    category: "Hair Treatments",
    shortDesc: "Autologous Growth Factor Concentrate (GFC), Platelet-Rich Plasma (PRP), and medical trichology to stop hair shedding and stimulate thick regrowth.",
    fullDesc: "Hair thinning and androgenetic alopecia require scientifically proven cellular intervention. At Skinfinity Derma, our hair specialists utilize state-of-the-art Growth Factor Concentrate (GFC) and advanced Platelet-Rich Plasma (PRP) therapies, isolating high concentrations of vital growth factors (PDGF, VEGF, EGF) directly from your blood and delivering them to weakened follicular units to arrest shedding and awaken dormant follicles.",
    indications: ["Male and female pattern baldness (androgenetic alopecia)", "Telogen effluvium (post-COVID, stress, or nutritional hair loss)", "Crown thinning and widening partition", "Weak, brittle hair and patchy shedding"],
    benefits: ["100% natural, autologous therapy with zero risk of allergic reaction", "Stimulates thicker hair shaft diameter and increased follicle density", "Clinically proven to significantly reduce hair shedding within 3 sessions", "Combines with comprehensive nutritional and medical trichology"],
    treatmentAreas: ["Frontal Hairline & Temples", "Crown & Vertex", "Full Scalp", "Beard Thinning Areas"],
    procedureSteps: [
      "Digital Trichoscopy Scalp & Follicle Assessment",
      "Autologous Blood Collection & Precision Centrifugation",
      "Sterile Growth Factor Isolation (GFC / PRP)",
      "Targeted Micro-Injection into Scalp Dermis under Local Anaesthesia",
      "Low-Level Laser Light Therapy for Enhanced Absorption"
    ],
    youtubeVideoId: "vTJo_UtYjhI",
    faqs: [
      {
        question: "How many PRP or GFC sessions will I need?",
        answer: "A standard protocol consists of 4 to 6 sessions spaced 3 to 4 weeks apart, followed by maintenance sessions every 4 to 6 months."
      },
      {
        question: "Is PRP/GFC hair treatment painful?",
        answer: "We apply a strong topical anaesthetic cream or local nerve block, making the micro-injection procedure very comfortable."
      }
    ],
    bannerImage: "/images/treatments/banner-hairloss.webp",
    priceGuide: "Starting from ₹3,500 / session"
  },
  {
    id: "anti-ageing-facials",
    slug: "anti-ageing-facials",
    name: "Anti-Ageing & Non-Surgical Rejuvenation",
    category: "Anti-Ageing & Aesthetics",
    shortDesc: "High-Intensity Focused Ultrasound (HIFU), Botox, Dermal Fillers, and Profhilo bio-remodeling for lifted, sculpted contours.",
    fullDesc: "Restore facial volume, smooth out expression lines, and lift lax skin with Skinfinity Derma's customized anti-ageing protocols. Led by founder Dr. Ipshita Johri, our non-surgical rejuvenation encompasses US-FDA approved wrinkle relaxers (Botox), hyaluronic acid dermal fillers, thread lifting, and ultrasound skin tightening (HIFU) to deliver refined, natural-looking youthfulness without surgery.",
    indications: ["Forehead lines, crow's feet, and frown lines", "Nasolabial folds and volume loss in cheeks", "Sagging jawline and double chin", "Hollow under-eyes and tear troughs"],
    benefits: ["Natural, subtle results preserving your authentic expressions", "Stimulates long-term deep collagen and elastin synthesis", "Performed exclusively by certified senior MD Dermatologists", "Minimal to zero downtime"],
    treatmentAreas: ["Forehead & Glabella", "Crow's Feet & Tear Troughs", "Cheeks & Mid-Face", "Jawline & Submental (Double Chin)", "Neck Tightening"],
    procedureSteps: [
      "Facial Anatomy Mapping & Aesthetic Proportions Review",
      "Customized Multi-Modality Treatment Strategy",
      "Gentle Topical Numbing for Complete Comfort",
      "Precision Micro-Injection or Ultrasound Energy Delivery",
      "Immediate Post-Care Evaluation and Aftercare Guidance"
    ],
    youtubeVideoId: "FSDkGE-H3_M",
    faqs: [
      {
        question: "Will anti-ageing injections make my face look frozen?",
        answer: "Never at Skinfinity Derma. Dr. Ipshita Johri's signature micro-dosing technique softens wrinkles while preserving natural facial animation and genuine warmth."
      },
      {
        question: "How long do dermal fillers and Botox last?",
        answer: "Botox typically lasts 4 to 6 months, while hyaluronic acid dermal fillers last 9 to 18 months depending on the specific area treated."
      }
    ],
    bannerImage: "/images/treatments/banner-acne.webp",
    priceGuide: "Consultation & custom quote"
  }
];

export const REAL_RESULTS: RealResult[] = [
  {
    id: "result-1",
    patientName: "Patient A",
    treatment: "Acne Scar Revision & Skin Clarity",
    description: "Significant reduction in deep acne scar craters and post-inflammatory pigmentation after 4 sessions of MNRF and targeted peels.",
    image: "/images/results/acne-after.jpg",
    beforeImage: "/images/results/acne-before.jpg",
    resultsType: "Acne & Scars",
    timeframe: "3 Months (4 Sessions)"
  },
  {
    id: "result-2",
    patientName: "Patient B",
    treatment: "Hyperpigmentation & Melasma Clearance",
    description: "Marked lightening of stubborn facial melasma patches and restoration of even, radiant skin tone.",
    image: "/images/results/pigmentation-after.jpg",
    beforeImage: "/images/results/pigmentation-before.jpg",
    resultsType: "Pigmentation",
    timeframe: "8 Weeks (3 Sessions)"
  },
  {
    id: "result-3",
    patientName: "Patient C",
    treatment: "Non-Surgical Facial Rejuvenation",
    description: "Sharpened jawline definition and mid-face volume restoration using targeted dermal fillers and bio-stimulators.",
    image: "/images/results/facial-after.jpg",
    beforeImage: "/images/results/facial-before.jpg",
    resultsType: "Facial Aesthetics",
    timeframe: "Instant Result"
  },
  {
    id: "result-4",
    patientName: "Patient D",
    treatment: "Advanced Laser Skin Resurfacing",
    description: "Permanent reduction of skin irregularities and total elimination of recurring pigmentation and texture concerns.",
    image: "/images/results/laser-after.jpg",
    beforeImage: "/images/results/laser-before.jpg",
    resultsType: "Laser Treatments",
    timeframe: "5 Months (6 Sessions)"
  },
  {
    id: "result-5",
    patientName: "Patient E",
    treatment: "Sugarcane HydraFacial Glow",
    description: "Unclogged pores, blackhead extraction, and instant high-gloss skin radiance with deep hydration protocol.",
    image: "/images/results/hydrafacial-after.jpg",
    beforeImage: "/images/results/hydrafacial-before.jpg",
    resultsType: "Medi-Facial",
    timeframe: "Immediate Glow"
  },
  {
    id: "result-6",
    patientName: "Patient F",
    treatment: "GFC Scalp Hair Restoration",
    description: "Dramatic improvement in scalp hair density and reduction of thinning crown partition after 5 GFC sessions.",
    image: "/images/results/hair-after.jpg",
    beforeImage: "/images/results/hair-before.jpg",
    resultsType: "Hair Loss",
    timeframe: "4 Months (5 Sessions)"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    patientName: "Kavita Sharma",
    treatment: "Acne Scar Treatment",
    rating: 5,
    clinicLocation: "Noida Clinic",
    reviewText: "My dermatology visit with Dr. Ipshita's clinic exceeded all my expectations. Not only did I leave with a clear understanding of my skin concerns, but I also felt empowered to take control of my skincare regimen. The level of care, attention, and expertise displayed by Dr. Ipshita and her staff was truly exceptional.",
    verified: true
  },
  {
    id: "test-2",
    patientName: "Aman Singhal",
    treatment: "Laser Hair Reduction",
    rating: 5,
    clinicLocation: "Gurgaon Clinic",
    reviewText: "I had severe razor irritation on my neck and cheeks. Taking laser hair reduction at the Gurgaon branch on Golf Course Road was the best decision. The machine has an ice-cold cooling tip so it was practically painless, and after 5 sessions the bumps are completely gone. Highly recommend Skinfinity Derma!",
    verified: true
  },
  {
    id: "test-3",
    patientName: "Neha Aggarwal",
    treatment: "Sugarcane HydraFacial & Glow",
    rating: 5,
    clinicLocation: "Noida Clinic",
    reviewText: "The Sugarcane HydraFacial is pure magic! My skin looked glassy, plump, and deeply hydrated immediately. The clinic is spotless, welcoming, and the doctors explain every step transparently. 3200+ reviews for a reason!",
    verified: true
  },
  {
    id: "test-4",
    patientName: "Saurabh Kapoor",
    treatment: "Hair PRP & GFC Therapy",
    rating: 5,
    clinicLocation: "Noida Clinic",
    reviewText: "I was losing hair at an alarming rate due to stress. Dr. Sukriti and Dr. Ipshita performed a thorough trichoscopy and recommended 4 sessions of GFC therapy. My excessive shedding halted within 4 weeks and new hair growth is visible. True medical professionals.",
    verified: true
  }
];

export const SPECIAL_OFFERS = [
  {
    id: "offer-1",
    title: "Free Skin & Hair Doctor Consultation",
    badge: "Limited Period",
    desc: "Comprehensive digital skin analysis and consultation with our senior MD Dermatologists.",
    image: "/images/offers/free-consultation-offer.webp",
    linkText: "Claim Consultation",
    slug: "book-appointment"
  },
  {
    id: "offer-2",
    title: "Bridal Skin Preparation Package",
    badge: "Festive & Wedding",
    desc: "Customized multi-step bridal glow program: HydraFacial, laser toning, back polishing, and body radiance.",
    image: "/images/offers/bridal-package.webp",
    linkText: "Explore Package",
    slug: "book-appointment"
  },
  {
    id: "offer-3",
    title: "US-FDA Laser Hair Reduction Offer",
    badge: "Popular",
    desc: "Up to 50% off on full body and facial laser hair reduction packages with painless cooling technology.",
    image: "/images/offers/laser-hair-offer.webp",
    linkText: "Book Session",
    slug: "laser-hair-removal-noida"
  },
  {
    id: "offer-4",
    title: "Fat Loss & Skin Tightening Plan",
    badge: "Body Wellness",
    desc: "Non-invasive fat reduction and radiofrequency tissue firming for sculpted body contours.",
    image: "/images/offers/fat-loss.webp",
    linkText: "View Details",
    slug: "book-appointment"
  },
  {
    id: "offer-5",
    title: "GFC Advanced Hair Regain Booster",
    badge: "Hair Clinic",
    desc: "Special package for 4 GFC hair restoration sessions with digital trichoscopy tracking.",
    image: "/images/offers/gfc-festive-offer.webp",
    linkText: "Claim Offer",
    slug: "hair-loss-treatment"
  },
  {
    id: "offer-6",
    title: "Birthday & Weekday Glow Treats",
    badge: "Exclusive",
    desc: "Celebrate your birthday month with celebratory aesthetic packages and priority booking.",
    image: "/images/offers/birthday-offer.webp",
    linkText: "Inquire Now",
    slug: "book-appointment"
  }
];

export const MEDIA_PRESS = [
  {
    title: "Times of India Interview: Dr. Ipshita Johri on Root-Cause Clinical Dermatology & Laser Safety",
    outlet: "Times of India",
    date: "Oct 2026",
    doctor: "Dr. Ipshita Johri",
    type: "Featured Interview",
    image: "/images/media/times-of-india-logo-toi.webp",
    thumbnail: "/images/doctors/dr-ipshita-johri.jpg",
    link: "https://timesofindia.indiatimes.com/life-style/beauty",
    videoId: "1WmieekXjG4"
  },
  {
    title: "Femina India Exclusive: Expert Dermatologist Insights on Hair Thinning, GFC & Scalp Health",
    outlet: "Femina India",
    date: "Sep 2026",
    doctor: "Dr. Ipshita Johri & Team",
    type: "Expert Column",
    image: "/images/media/femina-logo-image.webp",
    thumbnail: "/images/doctors/dr-sukriti.webp",
    link: "https://www.femina.in/beauty/skin",
    videoId: "vTJo_UtYjhI"
  },
  {
    title: "India Today Health: Dealing With Stubborn Pigmentation & Melasma on Indian Skin Tones",
    outlet: "India Today",
    date: "Aug 2026",
    doctor: "Dr. Ipshita Johri",
    type: "Doctor Interview",
    image: "/images/media/india-today.webp",
    thumbnail: "/images/doctors/dr-aanchal-bansal.webp",
    link: "https://www.indiatoday.in/lifestyle/health",
    videoId: "jaPp0FVXt50"
  },
  {
    title: "Healthshots Video Feature: Sugarcane HydraFacial & Medical Barrier Repair Explained",
    outlet: "Healthshots",
    date: "Jul 2026",
    doctor: "Dr. Sukriti",
    type: "Clinical Feature",
    image: "/images/media/healthshots-logo-new-1.webp",
    thumbnail: "/images/doctors/dr-neha-dhankar.webp",
    link: "https://www.healthshots.com/beauty/skin-care/",
    videoId: "hwjd6tDApmI"
  },
  {
    title: "Vogue India: Modern Non-Surgical Facial Contouring, HIFU & Collagen Bio-Remodeling",
    outlet: "Vogue India",
    date: "Jun 2026",
    doctor: "Dr. Ipshita Johri",
    type: "Aesthetic Spotlight",
    image: "/images/media/vogue.webp",
    thumbnail: "/images/doctors/dr-ipshita-johri.webp",
    link: "https://www.vogue.in/beauty",
    videoId: "FSDkGE-H3_M"
  },
  {
    title: "Rediff Health: US-FDA Triple Wavelength Laser Hair Reduction Demystified by Dermatologists",
    outlet: "Rediff",
    date: "May 2026",
    doctor: "Dr. Shradha",
    type: "Medical Q&A",
    image: "/images/media/rediff-newlogo.webp",
    thumbnail: "/images/doctors/dr-shradha-gumber.webp",
    link: "https://www.rediff.com/getahead",
    videoId: "h3r2K76Gb2E"
  }
];

export const BRAND_JOURNEY: Milestone[] = [
  {
    year: "2017",
    title: "The Genesis",
    description: "Founded by Dr. Ipshita Johri in Noida with a focus on holistic, results-oriented care.",
    color: "from-brand-700 to-teal-600",
    badge: "Foundation",
    image: "/images/journey/journey-2017.jpg"
  },
  {
    year: "2019",
    title: "Infrastructure Leap",
    description: "Scaled to a state-of-the-art facility in Noida featuring 9 advanced procedure rooms.",
    color: "from-teal-600 to-brand-700",
    badge: "Scale-Up",
    image: "/images/journey/journey-2019.jpg"
  },
  {
    year: "2022",
    title: "Regional Growth",
    description: "Expanded footprint with the launch of a second full-scale center in Gurgaon.",
    color: "from-brand-700 to-teal-600",
    badge: "Expansion",
    image: "/images/journey/journey-2022.jpg"
  },
  {
    year: "2024",
    title: "Clinical Excellence",
    description: "Scaled operations powered by 4 full-time dermatologists, USA FDA-approved tech, and rigorous SOPs.",
    color: "from-teal-600 to-brand-700",
    badge: "US-FDA Tech",
    image: "/images/journey/journey-2024.jpg"
  },
  {
    year: "2025",
    title: "The Legacy",
    description: "Celebrating 8 years of excellence and rated as one of the most trusted clinics of Delhi NCR with 4,500+ Google reviews.",
    color: "from-brand-700 to-amber-600",
    badge: "4,500+ Reviews",
    image: "google-badge"
  },
  {
    year: "2026",
    title: "Franchise Expansion",
    description: "Now ready to expand Pan India via franchise route with proven clinical & business mastery.",
    color: "from-brand-700 to-teal-600",
    badge: "Pan-India",
    image: "/images/journey/journey-2026.jpg"
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "silver",
    name: "Silver Glow Pass",
    price: "₹9,999",
    period: "/ year",
    validity: "12 Months Validity",
    tagline: "Essential clinical maintenance for clear, healthy skin.",
    color: "border-slate-300 bg-gradient-to-b from-slate-50 via-white to-slate-50/70",
    passGradient: "from-slate-700 via-slate-600 to-slate-800",
    cardBg: "bg-gradient-to-br from-slate-50 via-white to-slate-100/80 border-slate-300",
    badgeStyle: "bg-slate-200 text-slate-800 border-slate-300",
    buttonStyle: "bg-slate-800 hover:bg-slate-900 text-white",
    accentText: "text-slate-700",
    features: [
      "1 Complimentary Sugarcane HydraFacial",
      "10% Flat Discount on all Laser Hair Removal Packages",
      "10% Discount on Chemical & Organic Peels",
      "Priority Appointment Booking",
      "Complimentary Digital Skin Health Analysis",
      "Annual Dermatology Consultation Pass for Self"
    ]
  },
  {
    id: "gold",
    name: "Gold Prestige Club",
    price: "₹24,999",
    period: "/ year",
    validity: "12 Months Validity",
    tagline: "Our most popular comprehensive aesthetic rejuvenation tier.",
    popular: true,
    color: "border-amber-400 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30",
    passGradient: "from-amber-600 via-yellow-500 to-amber-700",
    cardBg: "bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 border-amber-400",
    badgeStyle: "bg-amber-500 text-slate-950 border-amber-400",
    buttonStyle: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black",
    accentText: "text-amber-700",
    features: [
      "3 Complimentary Sugarcane HydraFacials or Laser Toning",
      "15% Flat Discount on all Lasers, Peels & Body Contouring",
      "10% Discount on Dermal Fillers & Botox Injections",
      "Free Consultations for Self + 2 Family Members",
      "Birthday Month Special Glow Treatment Gift",
      "Direct WhatsApp Hotline with Senior Doctor Assistant",
      "Free Home Sample Collection via Orange Health Labs"
    ]
  },
  {
    id: "platinum",
    name: "Platinum VIP Elite",
    price: "₹49,999",
    period: "/ year",
    validity: "12 Months VIP Concierge Validity",
    tagline: "Ultimate luxury bespoke medical aesthetics & concierge care.",
    color: "border-[#008081] bg-gradient-to-b from-teal-50/60 via-white to-emerald-50/30",
    passGradient: "from-[#042f2e] via-[#008081] to-emerald-900",
    cardBg: "bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/60 border-[#008081]",
    badgeStyle: "bg-[#008081] text-white border-teal-600",
    buttonStyle: "bg-gradient-to-r from-[#042f2e] via-[#008081] to-teal-800 hover:opacity-95 text-white",
    accentText: "text-[#008081]",
    features: [
      "6 Complimentary Signature Medi-Facials / Laser Glow Sessions",
      "20% Flat Discount on All Laser & Anti-Ageing Procedures",
      "15% Flat Discount on Botox, Fillers & Profhilo Bio-Remodeling",
      "Unlimited Doctor Consultations Across Noida & Gurgaon",
      "Dedicated Private Treatment Suite Access",
      "Orange Health Comprehensive Skin & Hormone Diagnostic Profile",
      "Complimentary Post-Procedure Barrier Repair Skincare Kit",
      "Invitations to VIP Aesthetic Masterclasses with Our Team of Dermatologists"
    ]
  }
];

export const ASSOCIATED_PARTNERS = [
  { name: "Orange Health Labs", type: "Diagnostic & Blood Testing Partner", badge: "Lab Partner" },
  { name: "HDFC Bank Health EMI", type: "0% Interest Medical Financing", badge: "Banking" },
  { name: "ICICI Health Care", type: "Flexible Aesthetic EMI Options", badge: "Banking" },
  { name: "Bajaj Finserv Health", type: "Instant Digital EMI Approvals", badge: "Financing" },
  { name: "Lumenis Medical Lasers", type: "US-FDA Laser Equipment Partner", badge: "Technology" },
  { name: "Candela Medical", type: "Gold Standard Aesthetic Lasers", badge: "Technology" },
  { name: "Allergan Aesthetics", type: "Authentic Botox & Juvederm Provider", badge: "Injectables" }
];

export const TOP_25_TREATMENTS = [
  "Acne & Pimple Treatment",
  "Acne Scar Subcision & MNRF",
  "US-FDA Laser Hair Removal",
  "Sugarcane HydraFacial",
  "Hair Loss & GFC Therapy",
  "Hair PRP Injections",
  "Chemical & Organic Peels",
  "Melasma & Pigmentation Removal",
  "HIFU Non-Surgical Face Lift",
  "Botox Anti-Wrinkle Injections",
  "Hyaluronic Acid Dermal Fillers",
  "Lip Lightening & Lip Plumping",
  "Bikini & Underarm Brightening",
  "Q-Switched Nd:YAG Laser Toning",
  "Laser Tattoo Removal",
  "Wart & Skin Tag Removal",
  "Carbon Laser Hollywood Peel",
  "Korean Glass Skin Facial",
  "Pre-Bridal Glow Transformation",
  "Underarm Fat & Sweat Reduction",
  "Inch Loss & Body Contouring",
  "Stretch Mark Laser Resurfacing",
  "Beard Growth & Line Shaping",
  "Glutathione Radiance Therapy",
  "Medical Skin Barrier Repair"
];

export const FRANCHISE_DATA = {
  brandStats: {
    experience: "10+ Years",
    patients: "1,00,000+",
    reviews: "4,500+ (4.5 ★)",
    clinics: "Flagship Centers in Noida & Gurgaon",
    investmentRange: "₹1.5 crore – ₹2 crore"
  },
  models: [
    {
      code: "FICO",
      name: "FICO (Franchise Invested, Company Operated)",
      idealFor: "Hands-off Investors & Business Professionals",
      investment: "₹1.5 crore – ₹2 crore",
      areaRequired: "1,500 - 2,200 sq.ft.",
      royalty: "Shared Revenue / Fixed Monthly Return",
      staffing: "100% Recruited & Managed by Skinfinity Derma HQ",
      expectedRoi: "38% - 44% Annualized",
      payback: "18 - 22 Months",
      features: [
        "Zero operational headache — Doctors and staff provided by HQ",
        "Centralized marketing, patient booking & CRM management",
        "Full US-FDA equipment procurement with manufacturer warranty",
        "Guaranteed minimum monthly floor return structure"
      ]
    },
    {
      code: "FOFO",
      name: "FOFO (Franchise Owned, Franchise Operated)",
      idealFor: "Doctor Entrepreneurs & Healthcare Operators",
      investment: "₹1.5 crore – ₹2 crore",
      areaRequired: "1,200 - 1,800 sq.ft.",
      royalty: "8% Monthly Revenue Royalty",
      staffing: "Partner Operated with HQ Clinical Training",
      expectedRoi: "42% - 50% Annualized",
      payback: "16 - 20 Months",
      features: [
        "Skinfinity Derma Brand Licensing & Territorial Exclusivity",
        "Clinical SOPs, protocols & senior dermatologist masterclass training",
        "Direct vendor supply chain for genuine injectables and lasers",
        "Hyperlocal digital marketing support & booking software"
      ]
    }
  ],
  cities: [
    { name: "Delhi NCR (South Delhi)", potential: "High Demand", tier: "Tier 1", estFootfall: "450+ patients/mo", status: "Priority Available" },
    { name: "Mumbai (Bandra / Andheri)", potential: "Extreme Demand", tier: "Tier 1", estFootfall: "600+ patients/mo", status: "Priority Available" },
    { name: "Bengaluru (Indiranagar / Koramangala)", potential: "High Demand", tier: "Tier 1", estFootfall: "500+ patients/mo", status: "Open for Partner" },
    { name: "Hyderabad (Jubilee Hills)", potential: "High Demand", tier: "Tier 1", estFootfall: "480+ patients/mo", status: "Open for Partner" },
    { name: "Chandigarh (Sector 8 / 9)", potential: "High Affinity", tier: "Tier 2", estFootfall: "380+ patients/mo", status: "High Potential" },
    { name: "Lucknow (Gomti Nagar)", potential: "Rapid Growth", tier: "Tier 2", estFootfall: "350+ patients/mo", status: "High Potential" },
    { name: "Jaipur (C-Scheme / Malviya Nagar)", potential: "High Affinity", tier: "Tier 2", estFootfall: "320+ patients/mo", status: "Open for Partner" },
    { name: "Pune (Koregaon Park)", potential: "High Demand", tier: "Tier 1", estFootfall: "420+ patients/mo", status: "Open for Partner" }
  ]
};

export const BLOG_POSTS = [
  {
    title: "Best Skin Clinic in Gurgaon: How to Choose the Right Dermatologist",
    date: "22 Oct",
    category: "Skin Clinic Guide",
    snippet: "A persistent rash or breakout requires accurate clinical diagnosis. Acne and pigmentation need an evidence-based roadmap that treats the root cause rather than temporary symptoms...",
    image: "/images/blog/blog-skin-clinic.webp",
    slug: "dermatologist-in-gurgaon"
  },
  {
    title: "Laser Hair Reduction in Gurgaon: Cost, Sessions, Benefits and Results",
    date: "22 Oct",
    category: "Laser Aesthetics",
    snippet: "Unwanted facial or body hair can be frustrating and costly with recurring waxing. Discover how modern triple-wavelength laser technology provides lasting smooth skin comfortably...",
    image: "/images/blog/blog-laser-hair.webp",
    slug: "laser-hair-removal-noida"
  },
  {
    title: "Root Causes of Stubborn Pigmentation & Melasma on Indian Skin",
    date: "18 Oct",
    category: "Dermatology Insights",
    snippet: "Understanding the role of UV exposure, hormonal triggers, and post-inflammatory melanocyte hyperactivity in treating dark spots effectively without rebound pigmentation...",
    image: "/images/blog/blog-pigmentation.webp",
    slug: "acne-pimple-treatment-noida"
  }
];
