export interface TreatmentStep {
  stepNumber: string;
  title: string;
  desc: string;
  image: string;
}

export interface TreatmentGalleryItem {
  src: string;
  caption: string;
}

export interface RichTreatment {
  id: string;
  slug: string;
  aliases?: string[];
  name: string;
  category:
    | "Skin Treatments"
    | "Hair Treatments"
    | "Laser Treatments"
    | "Body Treatments"
    | "Wedding Packages"
    | string;
  bodyArea: "Full Body" | "Face" | "Face & Neck" | "Arms" | "Legs" | "Back & Chest" | "Scalp" | "Bikini" | string;
  tags: string[];
  rating: number;
  reviewsCount: number;
  duration: string;
  price: number;
  priceFormatted: string;
  originalPriceFormatted: string;
  discountBadge: string;
  emiMonthly: string;
  emiMonths: number;
  sessionsInfo: string;
  cardHighlights: string[];
  explainedSubtitle: string;
  shortDesc: string;
  fullDesc: string;
  bannerImage: string;
  galleryImages: TreatmentGalleryItem[];
  howItWorksSteps: TreatmentStep[];
  idealFrequency: string;
  idealFor: string[];
  notIdealFor: string[];
  beforeTreatment: string[];
  afterTreatment: string[];
  youtubeVideoId?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  image?: string;
  downtime?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  faqs: { question: string; answer: string }[];
}

export const TREATMENT_CATEGORIES = [
  "All Treatments",
  "Skin Treatments",
  "Hair Treatments",
  "Laser Treatments",
  "Body Treatments",
  "Wedding Packages",
] as const;

export const BODY_AREA_TYPES = [
  "All Areas",
  "Full Body",
  "Face",
  "Arms",
  "Legs",
  "Bikini",
  "Back & Chest",
  "Scalp",
] as const;

export const RICH_TREATMENTS: RichTreatment[] = [
  {
    id: "full-body-lhr",
    slug: "laser-hair-reduction",
    aliases: [
      "laser-hair-removal",
      "laser-hair-reduction-noida",
      "laser-hair-removal-noida",
      "full-body-laser-hair-reduction",
      "full-body-laser-reduction",
    ],
    name: "Full Body Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Full Body",
    tags: ["US-FDA SOPRANO TITANIUM", "PAINLESS ICE-COOL"],
    rating: 4.94,
    reviewsCount: 1420,
    duration: "90 mins",
    price: 6999,
    priceFormatted: "₹6,999",
    originalPriceFormatted: "₹9,999",
    discountBadge: "30% OFF",
    emiMonthly: "₹1,167",
    emiMonths: 6,
    sessionsInfo: "1 Full Body Session (6-Session Package @ ₹39,999)",
    cardHighlights: [
      "90–95% permanent reduction in hair growth over 6–8 sessions",
      "Covers full body including face, arms, underarms, legs, back & bikini",
      "US-FDA approved triple-wavelength diode with -4°C sapphire ice cooling",
    ],
    explainedSubtitle: "Painless, Permanent, Triple-Wavelength US-FDA Protocol",
    shortDesc:
      "Triple-wavelength diode and Alexandrite laser hair reduction with advanced sapphire contact cooling for pain-free, permanent full-body smoothness.",
    fullDesc:
      "Eliminate unwanted facial and body hair permanently with Skinfinity Derma's gold-standard Full Body Laser Hair Reduction. Powered by US-FDA approved triple-wavelength (755nm + 810nm + 1064nm) Soprano Titanium technology and continuous -4°C ICE Plus contact cooling, our protocol targets deep follicular melanin while keeping the epidermis completely cool and comfortable. Calibrated by senior MD Dermatologists specifically for Indian skin tones (Fitzpatrick III–V).",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      {
        src: "/images/treatments/banner-laser.webp",
        caption: "US-FDA Triple-Wavelength Painless Laser Hair Reduction",
      },
      {
        src: "/images/results/laser-after.jpg",
        caption: "Smooth, Ingrown-Free Skin After Clinical Laser Sessions",
      },
      {
        src: "/images/clinic/interior-4.jpg",
        caption: "Private, Sterile Laser Procedure Suites at Skinfinity Derma",
      },
      {
        src: "/images/clinic/interior-2.jpg",
        caption: "Supervised Directly by Board-Certified MD Dermatologists",
      },
    ],
    howItWorksSteps: [
      {
        stepNumber: "STEP 1",
        title: "Follicle & Skin Mapping",
        desc: "Dermatologist assesses hair density, thickness, and skin tone to calibrate laser fluence.",
        image: "/images/clinic/interior-1.jpg",
      },
      {
        stepNumber: "STEP 2",
        title: "Cleansing & Precision Prep",
        desc: "Target body zones are gently cleansed, mapped with white grid markers, and fine-shaved.",
        image: "/images/treatments/banner-laser.webp",
      },
      {
        stepNumber: "STEP 3",
        title: "Chilled Cooling Gel",
        desc: "Medical-grade cooling ultrasound gel is applied to maximize optical coupling and comfort.",
        image: "/images/clinic/interior-4.jpg",
      },
      {
        stepNumber: "STEP 4",
        title: "In-Motion Laser Gliding",
        desc: "Triple-wavelength sapphire tip glides smoothly, destroying hair bulbs with zero pain.",
        image: "/images/results/laser-after.jpg",
      },
      {
        stepNumber: "STEP 5",
        title: "Barrier Soothing & SPF",
        desc: "Post-laser calming aloe serum and broad-spectrum SPF 50+ photoprotection are applied.",
        image: "/images/clinic/interior-5.jpg",
      },
    ],
    idealFrequency:
      "1 session every 4–6 weeks, 6–8 sessions for 90–95% permanent hair reduction. For long-term maintenance, 1 touch-up session every 6–12 months.",
    idealFor: [
      "Unwanted coarse or fine body and facial hair",
      "PCOS or hormonal hirsutism hair growth",
      "Frequent ingrown hairs, razor bumps, or strawberry skin (keratosis pilaris)",
      "Sensitive skin that reacts to hot waxing or threading",
      "Brides, grooms, and professionals seeking effortless smooth skin",
    ],
    notIdealFor: [
      "Active skin infections, open wounds, or severe sunburn in the area",
      "Pregnant women (recommended to wait post-delivery)",
      "White or grey hair lacking melanin pigment",
      "History of photosensitizing medications (e.g., high-dose isotretinoin within 3 months)",
      "Uncontrolled keloidal tendency on target body site",
    ],
    beforeTreatment: [
      "Do not wax, pluck, or thread the treatment area for at least 3–4 weeks prior.",
      "Avoid direct sun tanning or tanning beds for 7 days before your session.",
      "Discontinue active retinoids, glycolic/salicylic acids, or bleaching creams 48 hours prior.",
      "Keep the skin clean and free from heavy body oils, deodorants, or shimmer lotions on procedure day.",
      "Inform your dermatologist about any hormonal supplements or recent medications.",
    ],
    afterTreatment: [
      "Apply broad-spectrum SPF 50+ sunscreen daily on exposed treated areas.",
      "Avoid hot showers, steam rooms, saunas, and swimming pools for 24–48 hours.",
      "Use a gentle, fragrance-free soothing moisturizer or aloe vera gel twice daily.",
      "Do not wax or pluck regrowth between sessions; only gentle shaving is permitted if needed.",
      "Exfoliate gently after 5–7 days to help shed treated hair shafts naturally.",
    ],
    youtubeVideoId: "h3r2K76Gb2E",
    faqs: [
      {
        question: "What results can I expect from Full Body Laser Hair Reduction?",
        answer:
          "You will notice finer, slower, and patchier hair regrowth right from the 1st or 2nd session. Over a complete course of 6–8 sessions, patients achieve 90–95% permanent reduction in hair density along with smoother, brighter pores free from razor bumps.",
      },
      {
        question: "Is the treatment painful?",
        answer:
          "Not at all. Our US-FDA approved Soprano Titanium laser features -4°C sapphire contact cooling and In-Motion gliding technology. Most patients describe the sensation as a cool, soothing massage with a mild warm prickle in denser areas.",
      },
      {
        question: "How many sessions are recommended?",
        answer:
          "Because hair grows in three biological phases (Anagen, Catagen, Telogen) and the laser targets follicles in the active Anagen phase, 6 to 8 sessions spaced 4–6 weeks apart are recommended for complete clearance.",
      },
      {
        question: "Is it suitable for all Indian skin types?",
        answer:
          "Yes! The triple-wavelength diode (755nm Alexandrite, 810nm Speed Diode, and 1064nm Nd:YAG) safely bypasses epidermal melanin, making it 100% safe for fair, wheatish, and dusky Indian skin tones.",
      },
      {
        question: "Is there any downtime?",
        answer:
          "Zero downtime. You can return to office, social events, or daily routines immediately after your session.",
      },
      {
        question: "Can I combine this with other facials or treatments?",
        answer:
          "Yes, it pairs wonderfully with HydraFacials or brightening peels, typically scheduled 5–7 days apart as advised by your dermatologist.",
      },
    ],
  },
  {
    id: "full-face-lhr",
    slug: "full-face-laser-hair-reduction",
    name: "Full Face Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Face",
    tags: ["FOR FACIAL HAIR", "PCOS SAFE"],
    rating: 4.89,
    reviewsCount: 980,
    duration: "35 mins",
    price: 2499,
    priceFormatted: "₹2,499",
    originalPriceFormatted: "₹3,200",
    discountBadge: "22% OFF",
    emiMonthly: "₹417",
    emiMonths: 6,
    sessionsInfo: "1 Facial Session (Includes Upper Lip, Chin, Sidelocks & Cheeks)",
    cardHighlights: [
      "Includes forehead, sidelocks, cheeks, upper lip, chin & jawline",
      "Safe for hormonal & PCOS facial hair without paradoxical stimulation",
      "US-FDA approved painless sapphire cooling technology",
    ],
    explainedSubtitle: "Precision Facial Hair Removal Without Threading Cuts or Bumps",
    shortDesc:
      "Complete facial laser hair reduction covering upper lip, chin, sidelocks, cheeks, and jawline with zero downtime.",
    fullDesc:
      "Say goodbye to painful weekly threading and upper-lip waxing. Our Full Face Laser Hair Reduction uses precision facial tips with continuous ice cooling to target both coarse chin hair and fine sidelock/cheek hair safely, leaving your complexion silky-smooth and makeup-ready.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Precision Facial Tip with Ice-Chill Epidermal Protection" },
      { src: "/images/results/facial-after.jpg", caption: "Even-Toned, Smooth Facial Contours" },
      { src: "/images/clinic/interior-2.jpg", caption: "Hygienic Dermatology Suites in Noida & Gurgaon" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Skin Cleansing", desc: "Gentle micellar cleansing to remove makeup, sunscreen, and sebum.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Zone Mapping & Dermaplaning", desc: "Facial zones are mapped and fine hair is delicately trimmed.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Cooling Gel Application", desc: "A soothing layer of chilled conductive gel protects delicate facial skin.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Targeted Laser Pulses", desc: "Calibrated diode pulses deactivate facial hair follicles painlessly.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "Post-Care Sunscreen", desc: "Calming barrier cream and mineral SPF 50+ are applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 4 weeks, 6–8 sessions for optimal facial hair reduction.",
    idealFor: ["Upper lip, chin, and jawline hair", "PCOS-related facial hair growth", "Post-threading breakouts and pigmentation", "Rough facial texture under makeup"],
    notIdealFor: ["Active cystic acne flare-up on the exact laser site", "Recent deep chemical peel within 7 days", "Photosensitive conditions"],
    beforeTreatment: ["Stop threading, waxing, or bleaching facial hair 3 weeks prior.", "Pause retinol or AHA/BHA serums 48 hours before.", "Arrive with a clean face or our team will cleanse it for you."],
    afterTreatment: ["Apply SPF 50+ sunscreen every 4 hours when outdoors.", "Avoid facial scrubs or bleach for 7 days post-session.", "Use a gentle non-comedogenic moisturizer."],
    youtubeVideoId: "h3r2K76Gb2E",
    faqs: [
      { question: "Does facial laser work if I have PCOS?", answer: "Yes, laser hair reduction is the gold-standard treatment for PCOS facial hair. While hormonal balance may require 1–2 extra maintenance sessions, it dramatically reduces thickness and growth speed." },
      { question: "Can I wear makeup after the session?", answer: "Yes, light mineral makeup can be worn after 12–24 hours, and sunscreen is applied immediately after your procedure." },
      { question: "Is there any redness after facial laser?", answer: "Any mild pinkness subsides within 15–30 minutes thanks to our -4°C ice cooling tip." },
    ],
  },
  {
    id: "chin-upper-neck-lhr",
    slug: "chin-upper-neck-laser-hair-reduction",
    name: "Chin & Upper Neck Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Face",
    tags: ["TARGETED ZONE", "INGROWN RELIEF"],
    rating: 4.91,
    reviewsCount: 640,
    duration: "25 mins",
    price: 1499,
    priceFormatted: "₹1,499",
    originalPriceFormatted: "₹1,999",
    discountBadge: "25% OFF",
    emiMonthly: "₹250",
    emiMonths: 6,
    sessionsInfo: "1 Targeted Session",
    cardHighlights: [
      "Includes chin, lower lip area, and upper neck zone",
      "Eliminates coarse, stubborn hormonal chin hair & tweeter marks",
      "US-FDA approved painless and safe technology",
    ],
    explainedSubtitle: "Targeted Clearance for Stubborn Chin & Neck Follicles",
    shortDesc: "Focused laser hair reduction for stubborn chin and upper neck hair, preventing dark plucking marks and ingrowns.",
    fullDesc: "The chin and upper neck are highly prone to coarse hormonal bristles and dark hyperpigmentation caused by frequent tweezing. Our targeted diode protocol destroys deep-seated chin follicles while evening out skin texture.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Focused Chin & Neck Laser Tip" },
      { src: "/images/results/laser-after.jpg", caption: "Clear Jawline & Chin Contour" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Area Preparation", desc: "Cleansing and gentle trimming of chin and neck hairs.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Chilled Gel", desc: "Application of cooling gel over chin and submental crease.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Deep Follicle Targeting", desc: "1064nm + 810nm wavelengths target deep coarse chin roots.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Ice-Tip Soothing", desc: "Sapphire chill tip cools the epidermis instantly.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "SPF Application", desc: "Broad-spectrum UV protection applied before you leave.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 3–4 weeks for 6–8 sessions.",
    idealFor: ["Coarse chin bristles", "Dark marks from tweezing", "Ingrown hairs along the jawline and neck"],
    notIdealFor: ["White/grey chin hairs", "Open cuts or active infection on the chin"],
    beforeTreatment: ["Stop plucking or tweezing chin hairs at least 2–3 weeks before.", "Do not apply harsh spot treatments 24 hours prior."],
    afterTreatment: ["Never tweeze between sessions.", "Apply sunscreen daily on chin and neck."],
    youtubeVideoId: "h3r2K76Gb2E",
    faqs: [
      { question: "How soon will coarse chin hair stop growing?", answer: "Coarse chin hair responds rapidly because it has high melanin content. You will see 30–40% reduction after just 2 sessions." },
      { question: "Will the dark marks from tweezing fade?", answer: "Yes! Once you stop tweezing and the ingrown inflammation resolves, the post-inflammatory dark spots fade significantly." },
    ],
  },
  {
    id: "underarms-lhr",
    slug: "underarms-laser-hair-reduction",
    name: "Underarms Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Arms",
    tags: ["QUICK 15-MIN", "BRIGHTENS UNDERARMS"],
    rating: 4.95,
    reviewsCount: 1850,
    duration: "20 mins",
    price: 1299,
    priceFormatted: "₹1,299",
    originalPriceFormatted: "₹1,800",
    discountBadge: "28% OFF",
    emiMonthly: "₹217",
    emiMonths: 6,
    sessionsInfo: "1 Both-Underarms Session",
    cardHighlights: [
      "Includes both underarms with quick 15-minute lunch-break procedure",
      "90–95% reduction in hair growth over 6 sessions",
      "Prevents dark underarm pigmentation & razor bumps from shaving",
    ],
    explainedSubtitle: "Smooth, Sweat-Fresh & Brighter Underarms in Just 6 Sessions",
    shortDesc: "Quick, painless underarm laser hair removal that eliminates stubble, razor bumps, and waxing darkness.",
    fullDesc: "Underarm waxing and daily shaving cause friction, folliculitis, and dark underarm pigmentation. Our 15-minute Underarms Laser Hair Reduction permanently disables hair follicles while leaving underarm skin softer, lighter, and bump-free.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Painless Underarm Laser Hair Removal" },
      { src: "/images/results/laser-after.jpg", caption: "Smooth, Bump-Free Underarm Skin" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Deodorant Removal", desc: "Underarms are cleansed of antiperspirant and residue.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Gentle Shave", desc: "Surface hair is neatly trimmed so energy reaches the root.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Ultrasound Gel", desc: "Cool conductive gel is applied.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Laser Gliding", desc: "5 minutes per side with ice-cold sapphire tip.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "Calming Lotion", desc: "Soothing post-laser lotion applied for instant comfort.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 4–6 weeks, 6 sessions recommended.",
    idealFor: ["Dark shadow or stubble even after shaving", "Painful underarm boils or ingrown hairs", "Anyone wanting sleeveless confidence year-round"],
    notIdealFor: ["Active underarm infection or open cuts", "Use of strong AHA roll-ons on the same day"],
    beforeTreatment: ["Do not apply roll-on deodorant or perfume right before the session.", "Avoid waxing underarms for 3 weeks prior."],
    afterTreatment: ["Skip alcohol-based deodorants for 24 hours.", "Wear loose breathable cotton tops on procedure day."],
    youtubeVideoId: "h3r2K76Gb2E",
    faqs: [
      { question: "Does underarm laser help with dark underarms?", answer: "Yes, by eliminating repeated waxing trauma and razor friction, underarm skin naturally lightens and becomes smoother." },
      { question: "Is underarm laser safe for lymph nodes?", answer: "100% safe. Laser light only penetrates 2–4 millimeters into the dermis where hair follicles reside and never reaches deeper tissues or lymph nodes." },
    ],
  },
  {
    id: "full-arms-lhr",
    slug: "full-arms-laser-hair-reduction",
    name: "Full Arms Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Arms",
    tags: ["SILKY ARMS", "NO WAXING PAIN"],
    rating: 4.88,
    reviewsCount: 720,
    duration: "45 mins",
    price: 2999,
    priceFormatted: "₹2,999",
    originalPriceFormatted: "₹3,999",
    discountBadge: "25% OFF",
    emiMonthly: "₹500",
    emiMonths: 6,
    sessionsInfo: "1 Full Arms & Hands Session",
    cardHighlights: [
      "Includes full arms from shoulders to wrists, hands & fingers",
      "90–95% reduction in hair growth over 6 sessions",
      "US-FDA approved In-Motion gliding for rapid, even coverage",
    ],
    explainedSubtitle: "Effortless, Silky-Smooth Arms Without Monthly Salon Appointments",
    shortDesc: "Complete laser hair reduction for upper arms, forearms, hands, and fingers using painless ice-cooling diode technology.",
    fullDesc: "Our Full Arms Laser Hair Reduction covers shoulders, upper arms, forearms, wrists, and fingers with uniform gliding energy, eliminating strawberry skin and post-waxing bumps.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Full Arms Gliding Laser Protocol" },
      { src: "/images/results/laser-after.jpg", caption: "Even, Smooth Arm Texture" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Skin Assessment", desc: "Checking arm skin tone and hair thickness.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Grid Mapping", desc: "Dividing upper and lower arms into uniform sections.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Chilled Gel", desc: "Applying cooling gel across forearms and upper arms.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "In-Motion Laser", desc: "Continuous gliding laser pass with sapphire cooling.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "Moisturizer & SPF", desc: "Hydrating barrier lotion and SPF 50+ protection.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 4–6 weeks, 6 sessions for complete reduction.",
    idealFor: ["Dense or noticeable arm hair", "Post-waxing folliculitis bumps on arms", "Busy individuals tired of monthly waxing"],
    notIdealFor: ["Fresh sunburn or tan on arms", "Active eczema flare on arms"],
    beforeTreatment: ["Avoid sun tanning on arms for 1 week prior.", "Do not wax arms for 3–4 weeks before session."],
    afterTreatment: ["Apply sunscreen on arms before stepping outdoors.", "Moisturize daily for silky skin."],
    faqs: [
      { question: "Are hands and fingers included?", answer: "Yes, Full Arms Laser Hair Reduction includes shoulders down to the back of hands and fingers." },
    ],
  },
  {
    id: "full-legs-lhr",
    slug: "full-legs-laser-hair-reduction",
    name: "Full Legs Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Legs",
    tags: ["GOODBYE STRAWBERRY LEGS", "PAINLESS"],
    rating: 4.92,
    reviewsCount: 890,
    duration: "60 mins",
    price: 3999,
    priceFormatted: "₹3,999",
    originalPriceFormatted: "₹5,499",
    discountBadge: "27% OFF",
    emiMonthly: "₹667",
    emiMonths: 6,
    sessionsInfo: "1 Full Legs & Feet Session",
    cardHighlights: [
      "Includes thighs, knees, calves, ankles, and feet/toes",
      "90–95% reduction in hair growth & cures 'strawberry legs'",
      "US-FDA Soprano Titanium large spot-size for fast comfort",
    ],
    explainedSubtitle: "Flawless, Poreless Legs Free from Ingrown Hairs & Razor Nicks",
    shortDesc: "Complete laser hair removal for thighs, knees, lower legs, and feet — the permanent cure for strawberry skin.",
    fullDesc: "Shaving and waxing legs often leads to dark dotted pores ('strawberry legs') and painful ingrown hairs. Full Legs Laser Hair Reduction destroys the dark hair bulb inside the pore, leaving legs remarkably clear, smooth, and radiant.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Large Spot-Size Painless Leg Laser" },
      { src: "/images/results/laser-after.jpg", caption: "Zero Ingrown Hairs or Strawberry Pores" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Leg Cleansing & Mapping", desc: "Thighs and calves are mapped into precision grids.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Fine Shaving", desc: "Gentle surface prep without skin irritation.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Cooling Gel", desc: "Generous layer of chilled ultrasound gel.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Triple-Wavelength Sweep", desc: "Fast, painless gliding across thighs, knees, and shins.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "Hydrating Post-Care", desc: "Soothing ceramide lotion applied to both legs.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 6 weeks, 6 sessions recommended.",
    idealFor: ["Strawberry legs (dark dotted pores)", "Coarse shin and calf hair", "Painful ingrown hairs after waxing"],
    notIdealFor: ["Severe varicose ulcers", "Recent sunburn from beach vacation"],
    beforeTreatment: ["Avoid waxing legs for 4 weeks prior.", "Do not apply self-tanner or shimmer oils."],
    afterTreatment: ["Moisturize legs daily.", "Avoid hot jacuzzi or steam for 48 hours."],
    faqs: [
      { question: "Does laser really cure strawberry legs?", answer: "Yes! Strawberry legs are caused by dark hair follicles and oxidized oil trapped inside enlarged pores from shaving. Once the laser destroys the follicle, the dark dots disappear." },
    ],
  },
  {
    id: "bikini-lhr",
    slug: "bikini-laser-hair-reduction",
    name: "Bikini & Brazilian Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Bikini",
    tags: ["100% FEMALE THERAPISTS", "HYGIENIC & PAINLESS"],
    rating: 4.93,
    reviewsCount: 610,
    duration: "30 mins",
    price: 2799,
    priceFormatted: "₹2,799",
    originalPriceFormatted: "₹3,800",
    discountBadge: "26% OFF",
    emiMonthly: "₹467",
    emiMonths: 6,
    sessionsInfo: "1 Complete Bikini / Brazilian Session",
    cardHighlights: [
      "Customizable coverage: Bikini line or complete Brazilian hygiene",
      "Performed exclusively by trained female medical therapists in private suites",
      "US-FDA ice-cooling tip makes sensitive zones completely comfortable",
    ],
    explainedSubtitle: "Complete Intimate Hygiene & Freedom from Painful Bikini Waxing",
    shortDesc: "Safe, private, and painless bikini & Brazilian laser hair reduction with disposable hygiene protocols.",
    fullDesc: "Intimate waxing is painful and frequently causes ingrown boils and darkening. At Skinfinity Derma, Bikini Laser Hair Reduction is performed in 100% private suites by senior female therapists using disposable hygiene kits and -4°C ice cooling.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "100% Private Suites & Disposable Hygiene Kits" },
      { src: "/images/clinic/interior-4.jpg", caption: "Ice-Cool Sapphire Comfort for Sensitive Skin" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Private Consultation", desc: "Discuss bikini line vs. full Brazilian preference in complete privacy.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Sterile Preparation", desc: "Single-use disposable sheets and gentle cleansing.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Chilled Gel", desc: "Thick cooling gel ensures zero heat discomfort.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Cooled Laser Delivery", desc: "Gentle calibrated pulses target coarse follicles safely.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "Soothing Barrier Cream", desc: "Calming antibacterial & soothing cream applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 4–6 weeks, 6–8 sessions for lasting smoothness.",
    idealFor: ["Recurrent bikini line ingrown hairs and bumps", "Intimate hygiene and comfort", "Avoiding painful bikini waxing"],
    notIdealFor: ["Active skin infection or irritation", "During menstruation (can be scheduled right after)"],
    beforeTreatment: ["Do not wax for 3–4 weeks prior.", "Wear comfortable, loose cotton undergarments."],
    afterTreatment: ["Avoid tight synthetic gym wear and swimming pools for 24–48 hours.", "Use a mild pH-balanced cleanser."],
    faqs: [
      { question: "Is bikini laser painful on sensitive skin?", answer: "Our Soprano Titanium ice-tip stays at -4°C throughout the session, numbing the skin on contact so you only feel a cool glide." },
    ],
  },
  {
    id: "chest-back-lhr",
    slug: "chest-back-laser-hair-reduction",
    name: "Full Back & Chest Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Back & Chest",
    tags: ["MEN & WOMEN", "FOLLICULITIS RELIEF"],
    rating: 4.86,
    reviewsCount: 530,
    duration: "50 mins",
    price: 3499,
    priceFormatted: "₹3,499",
    originalPriceFormatted: "₹4,800",
    discountBadge: "27% OFF",
    emiMonthly: "₹583",
    emiMonths: 6,
    sessionsInfo: "1 Back or Chest Session",
    cardHighlights: [
      "Includes full upper & lower back or complete chest & abdomen",
      "Prevents sweat-induced back acne and truncal folliculitis",
      "High-speed large spot laser completes treatment in under 45 mins",
    ],
    explainedSubtitle: "Clear, Athletic & Acne-Free Back and Torso",
    shortDesc: "Rapid laser hair reduction for back, shoulders, chest, and abdomen for both men and women.",
    fullDesc: "Dense hair on the back or chest traps sweat and bacteria, leading to stubborn back acne and folliculitis. Our deep-penetrating 1064nm + 810nm laser clears coarse torso hair smoothly and painlessly.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "High-Speed Torso & Back Laser Coverage" },
      { src: "/images/results/laser-after.jpg", caption: "Clear, Smooth Skin Without Folliculitis" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Zone Mapping", desc: "Shoulders, back, or chest are gridded for 100% coverage.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Surface Trimming", desc: "Hygienic trimming of torso hair.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Cooling Ultrasound Gel", desc: "Chilled gel application across the torso.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "In-Motion Laser", desc: "Deep diode pulses clear thick roots painlessly.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "Soothing Spray", desc: "Calming anti-inflammatory mist applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 5–6 weeks, 6–8 sessions.",
    idealFor: ["Back acne caused by trapped sweat and hair", "Coarse chest or shoulder hair", "Swimmers, athletes, and brides/grooms"],
    notIdealFor: ["Fresh sunburn from outdoor sports", "Active open pustules"],
    beforeTreatment: ["Avoid sun exposure on back/chest for 7 days prior.", "Do not wax for 4 weeks."],
    afterTreatment: ["Avoid heavy sweaty gym workouts for 24 hours.", "Wear clean breathable cotton shirts."],
    faqs: [
      { question: "Can men opt for beard line shaping or chest thinning instead of full removal?", answer: "Absolutely! In 3–4 sessions, men can achieve natural hair thinning and finer texture without complete baldness if preferred." },
    ],
  },
  {
    id: "sugarcane-hydrafacial",
    slug: "sugarcane-hydrafacial",
    aliases: ["sugarcane-hydrafacial-noida"],
    name: "Signature Sugarcane HydraFacial MD",
    category: "Medi-Facials & Glow",
    bodyArea: "Face",
    tags: ["INSTANT GLASS SKIN", "CELEBRITY FAVORITE"],
    rating: 4.96,
    reviewsCount: 2180,
    duration: "45 mins",
    price: 3499,
    priceFormatted: "₹3,499",
    originalPriceFormatted: "₹4,999",
    discountBadge: "30% OFF",
    emiMonthly: "₹583",
    emiMonths: 6,
    sessionsInfo: "1 Complete 6-Step Medi-Facial",
    cardHighlights: [
      "Patented vortex blackhead extraction + pure sugarcane glycolic exfoliation",
      "Infuses hyaluronic acid, peptides & antioxidants deep into the dermis",
      "Instant glass-skin glow with zero redness or social downtime",
    ],
    explainedSubtitle: "Deep Pore Purification, Hydrating Infusion & Instant Red-Carpet Radiance",
    shortDesc:
      "Signature natural glycolic extraction and vortex antioxidant infusion for instant glass-skin radiance and unclogged pores.",
    fullDesc:
      "Skinfinity Derma's signature Sugarcane HydraFacial MD combines botanical sugarcane-derived alpha-hydroxy acids (pure glycolic resurfacing) with medical vortex suction and patented super-serum infusions. Designed by Dr. Ipshita Johri for patients who desire immediate luminous glass skin, deep cellular hydration, and refined pore texture with zero downtime.",
    bannerImage: "/images/treatments/banner-hydrafacial.webp",
    galleryImages: [
      { src: "/images/treatments/banner-hydrafacial.webp", caption: "Signature 6-Step Sugarcane HydraFacial MD" },
      { src: "/images/results/hydrafacial-after.jpg", caption: "Immediate Glass-Skin Radiance & Pore Clarity" },
      { src: "/images/clinic/interior-5.jpg", caption: "Luxury Rejuvenation Suites at Skinfinity Derma" },
    ],
    howItWorksSteps: [
      {
        stepNumber: "STEP 1",
        title: "Lymphatic Drainage & Cleanse",
        desc: "Detoxifies facial puffiness and gently removes surface dead skin cells.",
        image: "/images/treatments/banner-hydrafacial.webp",
      },
      {
        stepNumber: "STEP 2",
        title: "Sugarcane Glycolic Peel",
        desc: "Botanical sugarcane AHA loosens deep-seated dirt and dullness without stinging.",
        image: "/images/clinic/interior-2.jpg",
      },
      {
        stepNumber: "STEP 3",
        title: "Painless Vortex Extraction",
        desc: "Vacuum spiral tip painlessly suctions out blackheads, whiteheads, and sebum from T-zone.",
        image: "/images/clinic/interior-4.jpg",
      },
      {
        stepNumber: "STEP 4",
        title: "Hyaluronic & Peptide Boost",
        desc: "Drenches open pores with low-molecular hyaluronic acid, vitamin C, and peptides.",
        image: "/images/results/hydrafacial-after.jpg",
      },
      {
        stepNumber: "STEP 5",
        title: "LED Collagen Phototherapy",
        desc: "Red & Blue LED light therapy calms skin, stimulates collagen, and locks in glow.",
        image: "/images/clinic/interior-5.jpg",
      },
    ],
    idealFrequency:
      "1 session every 3–4 weeks for continuous cellular turnover and glass-skin glow. Ideal 2–3 days before any major wedding or event.",
    idealFor: [
      "Dull, dehydrated, or tired complexion",
      "Congested T-zone, blackheads, and enlarged pores",
      "Superficial sun tan and uneven skin texture",
      "Pre-bridal, party, or red-carpet instant glow",
      "Early fine lines and loss of skin bounce",
    ],
    notIdealFor: [
      "Severe grade-4 active pustular acne (medical acne control recommended first)",
      "Active cold sores or open facial wounds",
      "Severe rosacea flare-up on the day of procedure",
      "Allergy to glycolic/salicylic actives (custom sensitive booster used instead)",
    ],
    beforeTreatment: [
      "Keep a clean, makeup-free face before the treatment.",
      "Stay well-hydrated before your session.",
      "Pause prescription tretinoin/retinol or strong home exfoliants 48 hours prior.",
      "Inform your dermatologist about any recent injectables (wait 7 days post-Botox/fillers).",
      "Avoid threading or facial waxing for 3 days before your HydraFacial.",
    ],
    afterTreatment: [
      "Drink 2–3L of water over the next 24–48 hours to amplify hyaluronic plumping.",
      "Apply gentle moisturizer and broad-spectrum SPF 50+ sunscreen daily.",
      "Avoid harsh scrubs, retinols, or AHA/BHA serums for 48 hours.",
      "Avoid steam rooms, saunas, and heavy sweating for 24 hours.",
      "Enjoy your dewy glow—you can apply makeup the very next morning (or even same evening if needed!).",
    ],
    youtubeVideoId: "hwjd6tDApmI",
    faqs: [
      {
        question: "How is Sugarcane HydraFacial different from a salon facial?",
        answer:
          "Salon facials only massage creams onto the outer dead skin layer and use painful metal pins for blackheads. Sugarcane HydraFacial uses medical-grade vacuum vortex hydro-dermabrasion and pharmaceutical-grade sugarcane glycolic & hyaluronic actives that penetrate deep into the dermis.",
      },
      {
        question: "Is this a good option for a pre-event or bridal glow-up?",
        answer:
          "It is our #1 recommended pre-event treatment! Because there is zero peeling or redness, getting it 1–3 days before a wedding or party gives your skin an unmistakable glassy luminosity.",
      },
      {
        question: "Is the blackhead extraction painful?",
        answer:
          "Zero pain. Instead of manual squeezing, the spiral vortex nozzle uses gentle vacuum suction with salicylic-honey solution to glide out blackheads effortlessly.",
      },
      {
        question: "Is it suitable for oily as well as dry skin?",
        answer:
          "Yes! Our dermatologists customize the serum boosters—oil-control salicylic for acne-prone skin, or intense hyaluronic-ceramide for dry skin.",
      },
    ],
  },
  {
    id: "slimming-facial-contouring",
    slug: "slimming-facial-for-women",
    aliases: ["slimming-facial", "facial-contouring-lifting"],
    name: "Slimming & RF Sculpting Medi-Facial",
    category: "Anti-Ageing & Contouring",
    bodyArea: "Face",
    tags: ["FOR FACE FAT", "PUFFINESS", "JAWLINE SCULPT"],
    rating: 4.88,
    reviewsCount: 540,
    duration: "60 mins",
    price: 4050,
    priceFormatted: "₹4,050",
    originalPriceFormatted: "₹5,000",
    discountBadge: "20% OFF",
    emiMonthly: "₹675",
    emiMonths: 6,
    sessionsInfo: "1 Sculpting Session",
    cardHighlights: [
      "Combines Multipolar Radiofrequency (RF) skin tightening with lymphatic drainage",
      "Reduces facial puffiness, double chin fullness & sharpens jawline contour",
      "Gentle, sculpted, non-invasive lifting with zero downtime",
    ],
    explainedSubtitle: "Gentle, Sculpted, Non-Invasive Facial Contouring",
    shortDesc:
      "Non-invasive facial sculpting with RF skin tightening, lymphatic drainage, and EMS microcurrent to reduce puffiness, define the jawline, and lift contours instantly.",
    fullDesc:
      "Non-invasive facial sculpting combining Multipolar Radiofrequency (RF) thermal collagen tightening, Electric Muscle Stimulation (EMS), and deep lymphatic drainage massage. Reduces fluid retention and puffiness, melts submental fullness (double chin), defines the jawline, and lifts mid-face contours instantly with zero downtime.",
    bannerImage: "/images/results/facial-after.jpg",
    galleryImages: [
      { src: "/images/results/facial-after.jpg", caption: "Gel Massage & RF Thermal Tightening to Reduce Puffiness" },
      { src: "/images/treatments/banner-hydrafacial.webp", caption: "Jawline Sculpting & Lymphatic Contouring" },
      { src: "/images/clinic/interior-2.jpg", caption: "Performances by Trained Dermatology Therapists" },
    ],
    howItWorksSteps: [
      {
        stepNumber: "STEP 1",
        title: "Deep Cleansing Prep",
        desc: "The skin is prepared by deep enzymatic cleansing to remove impurities.",
        image: "/images/clinic/interior-1.jpg",
      },
      {
        stepNumber: "STEP 2",
        title: "Radiofrequency Tightening",
        desc: "Multipolar radiofrequency is performed to contract collagen and tighten lax skin.",
        image: "/images/treatments/banner-hydrafacial.webp",
      },
      {
        stepNumber: "STEP 3",
        title: "EMS Muscle Toning",
        desc: "Electric muscle stimulation (EMS) is used to lift zygomatic and jawline muscles.",
        image: "/images/results/facial-after.jpg",
      },
      {
        stepNumber: "STEP 4",
        title: "Lymphatic Sculpt Massage",
        desc: "Manual myofascial and lymphatic drainage massage flushes retained facial fluid.",
        image: "/images/clinic/interior-4.jpg",
      },
      {
        stepNumber: "STEP 5",
        title: "Firming Peptide & SPF",
        desc: "Cryo-firming peptide mask and broad-spectrum sunscreen are applied.",
        image: "/images/clinic/interior-5.jpg",
      },
    ],
    idealFrequency:
      "1 session every 7–10 days, 4–6 sessions for visible sculpted results. For maintenance, 1 session/month post desired results.",
    idealFor: [
      "Double chin and submental fullness",
      "Puffy cheeks and morning facial fluid retention",
      "Mild sagging or loss of jawline contour",
      "Early ageing signs and nasolabial heaviness",
      "Pre-shoot or pre-bridal V-line jawline definition",
    ],
    notIdealFor: [
      "Active cystic acne or facial infection",
      "Pregnant or breastfeeding women",
      "Presence of metallic implants or pacemakers",
      "Individuals under 18 years of age",
      "Photosensitive medications (e.g., high-dose Accutane)",
    ],
    beforeTreatment: [
      "Keep a clean, makeup-free face before the treatment.",
      "Stay well-hydrated before the session.",
      "Avoid alcohol, smoking, and excess salt/caffeine 24 hours before to reduce water retention.",
      "Inform your practitioner about any recent dental work, fillers, or threads.",
      "Do not exfoliate or use strong retinols/AHAs the night before your facial.",
    ],
    afterTreatment: [
      "Drink 2–3L of water for the next 24–48 hours to support lymphatic drainage.",
      "Apply gentle moisturizers and SPF 50+ sunscreen daily.",
      "Follow dermatologist-recommended firming skincare for prolonged benefits.",
      "Avoid vigorous facial massages or steam/sauna for 24–48 hours.",
      "Do not use harsh exfoliants or strong actives for at least 48 hours.",
    ],
    youtubeVideoId: "FSDkGE-H3_M",
    faqs: [
      { question: "What results can I expect from a Slimming Facial?", answer: "Immediate reduction in facial bloating and puffiness with a visibly lifted cheekbone and sharper jawline right after the first session, with cumulative collagen tightening over 4–6 sessions." },
      { question: "Is the treatment painful?", answer: "Not at all! The RF handpiece feels like a warm, relaxing hot-stone massage, and the EMS gives a gentle lifting pulse." },
      { question: "Can I get this done if I have fillers or Botox?", answer: "We recommend waiting at least 2–3 weeks after Botox or dermal fillers before scheduling RF treatments so injectables remain undisturbed." },
    ],
  },
  {
    id: "acne-scar-subcision-mnrf",
    slug: "acne-pimple-treatment",
    aliases: [
      "acne-pimple-treatment-noida",
      "acne-treatment",
      "acne-treatment-noida",
      "acne-scar-treatment",
      "subcision-mnrf-acne-scars",
    ],
    name: "Acne & Pimple Treatment",
    category: "Acne & Scar Revision",
    bodyArea: "Face",
    tags: ["MD DERMATOLOGIST PERFORMED", "DEEP SCAR REPAIR"],
    rating: 4.93,
    reviewsCount: 1120,
    duration: "60 mins",
    price: 4999,
    priceFormatted: "₹4,999",
    originalPriceFormatted: "₹6,500",
    discountBadge: "23% OFF",
    emiMonthly: "₹833",
    emiMonths: 6,
    sessionsInfo: "1 Clinical Session (Peels from ₹2,500 / MNRF from ₹4,999)",
    cardHighlights: [
      "Releases tethered rolling & boxcar scars via precision cannula subcision",
      "Gold-insulated Microneedling Radiofrequency (MNRF) rebuilds deep dermal collagen",
      "Calibrated for Indian skin to clear active pimples & prevent dark marks (PIH)",
    ],
    explainedSubtitle: "Root-Cause Acne Control & Permanent Collagen Scar Remodeling",
    shortDesc:
      "Comprehensive clinical acne removal and scar remodeling using US-FDA approved lasers, cannula subcision, MNRF, and salicylic/azelaic medical peels.",
    fullDesc:
      "Acne and depressed acne scars require targeted medical intervention in the deep dermis. At Skinfinity Derma, our senior MD Dermatologists combine customized anti-acne medical peels with Blunt Cannula Subcision (to release fibrotic bands pulling scars down) and Gold-Tipped Microneedling Radiofrequency (MNRF) to stimulate fresh Type-I and Type-III collagen—permanently elevating indented scars.",
    bannerImage: "/images/treatments/banner-acne.webp",
    galleryImages: [
      { src: "/images/treatments/banner-acne.webp", caption: "Clinical Acne & Scar Remodeling Protocol" },
      { src: "/images/results/acne-after.jpg", caption: "Real Patient Transformation After 4 Sessions" },
      { src: "/images/clinic/interior-1.jpg", caption: "Sterile Dermatology Procedure Suite" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "3D Dermoscopy & Grading", desc: "Dermatologist maps active acne grade and boxcar, icepick, or rolling scar depth.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Topical Anaesthesia", desc: "45-minute medical numbing cream ensures a comfortable, pain-free procedure.", image: "/images/treatments/banner-acne.webp" },
      { stepNumber: "STEP 3", title: "Cannula Subcision", desc: "Doctor gently releases tethered fibrotic scar bands beneath depressed craters.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Gold-Tip MNRF Delivery", desc: "Fractional radiofrequency energy stimulates deep neocollagenesis without epidermal burn.", image: "/images/results/acne-after.jpg" },
      { stepNumber: "STEP 5", title: "Growth Factor & Antibiotic Care", desc: "Regenerative exosomes/PRP and soothing barrier repair cream are applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency:
      "1 session every 4 weeks, 4–6 sessions for 60–85% permanent improvement in deep acne scars.",
    idealFor: [
      "Rolling, boxcar, and icepick acne scars",
      "Persistent cystic, hormonal, or pustular acne",
      "Enlarged pores and uneven cratered skin texture",
      "Post-acne red (PIE) and brown (PIH) spots",
    ],
    notIdealFor: [
      "Keloidal scar tendency on the face",
      "Active herpes simplex (cold sore) infection",
      "Uncontrolled bleeding disorders",
      "Pregnancy (for retinoid/MNRF protocols; pregnancy-safe peels available)",
    ],
    beforeTreatment: [
      "Discontinue retinoids, benzoyl peroxide, and AHA/BHA acids 3–5 days prior.",
      "Avoid sunburn or outdoor tanning for 7 days before MNRF.",
      "Inform your doctor if you are on blood thinners or oral isotretinoin.",
      "Arrive with a clean face; numbing takes 40 minutes prior to procedure.",
    ],
    afterTreatment: [
      "Use only the prescribed sterile cleanser, antibiotic cream, and barrier moisturizer for 3 days.",
      "Strict broad-spectrum tinted SPF 50+ sunscreen is mandatory.",
      "Expect mild redness for 24–48 hours—do not pick or scrub micro-crusts.",
      "Avoid gym workouts, swimming, and makeup for 48 hours.",
    ],
    youtubeVideoId: "1WmieekXjG4",
    faqs: [
      { question: "Can deep acne scars be permanently removed?", answer: "While no treatment erases scars 100%, combining Cannula Subcision with MNRF and fractional lasers permanently remodels dermal collagen, delivering 65–85% smoother, flatter skin texture that never regresses." },
      { question: "How much downtime does MNRF have?", answer: "Unlike older CO2 lasers that caused 7 days of crusting, Gold-Insulated MNRF has minimal social downtime—typically 24 to 36 hours of mild sunburn-like pinkness." },
    ],
  },
  {
    id: "q-switched-melasma-laser",
    slug: "pigmentation-treatment",
    aliases: [
      "pigmentation-treatment-noida",
      "melasma-pigmentation-laser",
      "q-switched-laser-toning",
      "melasma-treatment",
      "pigmentation-melasma",
    ],
    name: "Pigmentation & Melasma Treatment",
    category: "Pigmentation & Lasers",
    bodyArea: "Face",
    tags: ["MELASMA & TAN", "SAFE FOR INDIAN SKIN"],
    rating: 4.90,
    reviewsCount: 960,
    duration: "35 mins",
    price: 3499,
    priceFormatted: "₹3,499",
    originalPriceFormatted: "₹4,500",
    discountBadge: "22% OFF",
    emiMonthly: "₹583",
    emiMonths: 6,
    sessionsInfo: "1 Laser Toning Session",
    cardHighlights: [
      "Nanosecond photoacoustic 1064nm energy shatters deep melanin clusters",
      "Clears stubborn melasma, sun spots, freckles & uneven skin tone",
      "Zero epidermal peeling or downtime — safe for Fitzpatrick III–V skin",
    ],
    explainedSubtitle: "Photoacoustic Melanin Clearance Without Rebound Pigmentation",
    shortDesc:
      "US-FDA Q-Switched Nd:YAG 1064nm laser toning and depigmenting peels to shatter stubborn melasma, sun spots, and dark patches safely.",
    fullDesc:
      "Pigmentation and hormonal melasma on Indian skin require gentle, non-thermal pigment shattering so the melanocytes are never irritated. Our Q-Switched Nd:YAG 1064nm laser delivers ultra-short nanosecond pulses that pulverize excess melanin granules into microscopic particles, which your body's lymphatic system naturally clears away.",
    bannerImage: "/images/results/pigmentation-after.jpg",
    galleryImages: [
      { src: "/images/results/pigmentation-after.jpg", caption: "Visible Clearance of Melasma & Hyperpigmentation" },
      { src: "/images/clinic/interior-4.jpg", caption: "US-FDA 1064nm Q-Switched Laser Suite" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Wood's Lamp Pigment Depth Check", desc: "Identifies whether pigment is epidermal, dermal, or mixed melasma.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Gentle Cleansing", desc: "Removes surface oils and UV filters.", image: "/images/treatments/banner-acne.webp" },
      { stepNumber: "STEP 3", title: "1064nm Laser Toning Pass", desc: "Collimated laser beam shatters melanin clusters with zero thermal burn.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Tranexamic / Vitamin C Infusion", desc: "Antioxidant brightening serum stabilizes melanocytes.", image: "/images/results/pigmentation-after.jpg" },
      { stepNumber: "STEP 5", title: "Iron-Oxide SPF 50+ Shield", desc: "Blocks both UV rays and visible blue light to prevent rebound.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 2–3 weeks for 6 sessions, paired with home depigmenting maintenance.",
    idealFor: ["Malar & forehead melasma", "Freckles, lentigines, and sun spots", "Post-acne brown marks (PIH)", "Perioral (around mouth) darkness"],
    notIdealFor: ["Active skin infection", "Unprotected daily harsh sun exposure without sunscreen compliance"],
    beforeTreatment: ["Stop hydroquinone or tretinoin creams 48 hours prior.", "Avoid direct sun tanning before session."],
    afterTreatment: ["Reapply broad-spectrum SPF 50+ every 3–4 hours.", "Avoid steam, hot yoga, and harsh kitchen heat for 24 hours."],
    youtubeVideoId: "jaPp0FVXt50",
    faqs: [
      { question: "Will melasma come back after laser toning?", answer: "Melasma has a hormonal and UV trigger. By combining low-fluence Q-Switched toning with oral antioxidants, tranexamic acid, and strict sunscreen, we keep melasma clear and prevent rebound." },
    ],
  },
  {
    id: "hollywood-carbon-peel",
    slug: "carbon-laser-peel",
    aliases: [
      "carbon-laser-peel-noida",
      "q-switch-laser",
      "q-switch-nd-yag-laser",
      "hollywood-peel",
    ],
    name: "Hollywood Carbon Laser Porcelain Facial",
    category: "Pigmentation & Lasers",
    bodyArea: "Face",
    tags: ["OIL & PORE CONTROL", "INSTANT MATTE GLOW"],
    rating: 4.87,
    reviewsCount: 620,
    duration: "40 mins",
    price: 2999,
    priceFormatted: "₹2,999",
    originalPriceFormatted: "₹3,999",
    discountBadge: "25% OFF",
    emiMonthly: "₹500",
    emiMonths: 6,
    sessionsInfo: "1 Carbon Laser Session",
    cardHighlights: [
      "Medical activated carbon mask binds to sebum, blackheads & dead cells",
      "Q-Switched laser vaporizes carbon particles, shrinking enlarged pores instantly",
      "Zero downtime — leaves skin matte, bright, and porcelain-smooth",
    ],
    explainedSubtitle: "Activated Carbon + Laser Vaporization for Poreless Matte Radiance",
    shortDesc: "The famous 'Red Carpet Hollywood Peel' that vaporizes oil, unclogs pores, and brightens dull skin in 40 minutes.",
    fullDesc: "A medical liquid carbon mask is applied to the face, penetrating deep into enlarged pores. As the Q-Switched laser passes over, it photo-acoustically vaporizes the carbon along with trapped sebum, acne bacteria, and dead skin cells.",
    bannerImage: "/images/clinic/interior-5.jpg",
    galleryImages: [
      { src: "/images/clinic/interior-5.jpg", caption: "Hollywood Carbon Laser Peel in Progress" },
      { src: "/images/results/hydrafacial-after.jpg", caption: "Instant Pore Refinement & Brightening" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Deep Cleansing", desc: "Prepares skin and removes surface oil.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Activated Carbon Mask", desc: "Organic medical carbon lotion absorbs into pores for 10 mins.", image: "/images/clinic/interior-5.jpg" },
      { stepNumber: "STEP 3", title: "Quasi-Long Pulse Warming", desc: "Heats carbon inside pores to shrink sebaceous glands.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Q-Switched Vaporization", desc: "Laser snaps away carbon along with blackheads and dead cells.", image: "/images/results/hydrafacial-after.jpg" },
      { stepNumber: "STEP 5", title: "Hydrating Niacinamide Gel", desc: "Pore-tightening serum and SPF 50+ applied.", image: "/images/clinic/interior-2.jpg" },
    ],
    idealFrequency: "1 session every 2–3 weeks, 4–6 sessions for oil & pore control.",
    idealFor: ["Oily, shiny T-zone", "Enlarged open pores", "Comedonal acne (blackheads & whiteheads)", "Instant party brightness"],
    notIdealFor: ["Extremely dry, flaking eczema", "Open skin abrasions"],
    beforeTreatment: ["Stop retinols 48 hours prior.", "Keep face clean before arrival."],
    afterTreatment: ["Use oil-free moisturizer and SPF 50+.", "Avoid heavy oil-based foundations for 24 hours."],
    faqs: [
      { question: "Does the snapping sound of the carbon laser hurt?", answer: "Not at all! You hear a light snapping sound as the carbon vaporizes, but on the skin it only feels like gentle warm tingles." },
    ],
  },
  {
    id: "gfc-prp-hair-loss",
    slug: "hair-loss-treatment",
    aliases: ["hair-loss-prp-treatment-noida", "gfc-hair-treatment"],
    name: "Advanced GFC & Autologous PRP Hair Restoration",
    category: "Hair Restoration",
    bodyArea: "Scalp",
    tags: ["100% NATURAL GROWTH FACTORS", "STOPS HAIR FALL"],
    rating: 4.91,
    reviewsCount: 890,
    duration: "45 mins",
    price: 4499,
    priceFormatted: "₹4,499",
    originalPriceFormatted: "₹5,999",
    discountBadge: "25% OFF",
    emiMonthly: "₹750",
    emiMonths: 6,
    sessionsInfo: "1 GFC / PRP Scalp Session",
    cardHighlights: [
      "Extracts 10x concentrated autologous growth factors (VEGF, PDGF, EGF) from your own blood",
      "Halts excessive hair shedding within 3–4 weeks and thickens miniaturized shafts",
      "Performed under topical/local anaesthesia for a virtually painless experience",
    ],
    explainedSubtitle: "Cellular Follicle Revival for Male & Female Pattern Hair Thinning",
    shortDesc:
      "Autologous Growth Factor Concentrate (GFC), Platelet-Rich Plasma (PRP), and medical trichology to stop hair shedding and stimulate thick regrowth.",
    fullDesc:
      "Hair thinning and androgenetic alopecia require cellular intervention at the follicular bulb. At Skinfinity Derma, our trichologists use closed-system US-FDA sterile kits to isolate pure Growth Factor Concentrate (GFC)—free from red blood cells that cause inflammation—and micro-infuse it directly into thinning scalp zones to awaken dormant hair follicles.",
    bannerImage: "/images/treatments/banner-hairloss.webp",
    galleryImages: [
      { src: "/images/treatments/banner-hairloss.webp", caption: "Precision GFC Scalp Micro-Infusion" },
      { src: "/images/results/hair-after.jpg", caption: "Visible Scalp Density & Crown Regrowth After 5 Sessions" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Digital Trichoscopy", desc: "200x magnification camera analyzes hair shaft diameter and follicle density.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Blood Draw & Centrifugation", desc: "15ml blood is spun in a sterile GFC tube to isolate pure growth factors.", image: "/images/treatments/banner-hairloss.webp" },
      { stepNumber: "STEP 3", title: "Scalp Anaesthesia", desc: "Numbing cream and vibration analgesia ensure complete comfort.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Micro-Infusion into Dermis", desc: "Doctor delivers growth factors directly to the bulge area of weak follicles.", image: "/images/results/hair-after.jpg" },
      { stepNumber: "STEP 5", title: "Low-Level Laser Helmet", desc: "15-minute red light photobiomodulation boosts cellular ATP absorption.", image: "/images/clinic/interior-2.jpg" },
    ],
    idealFrequency: "1 session every 3–4 weeks for 4–6 sessions, followed by maintenance every 6 months.",
    idealFor: [
      "Male and female pattern hair thinning (Grades I–IV)",
      "Widening central partition or thinning crown",
      "Post-COVID, post-pregnancy, or stress-induced hair fall (Telogen Effluvium)",
      "Pre- and post-hair transplant graft strengthening",
    ],
    notIdealFor: [
      "Completely scarred or shiny bald scalp with zero live follicles",
      "Severe platelet disorders or active scalp infection",
      "Uncontrolled anticoagulation therapy",
    ],
    beforeTreatment: [
      "Shampoo your hair the morning of your session; do not apply hair oil, wax, or fibers.",
      "Eat a healthy breakfast and drink 2 glasses of water before blood draw.",
      "Avoid aspirin, ibuprofen, or alcohol 24–48 hours prior.",
    ],
    afterTreatment: [
      "Do not wash your hair for 24 hours post-procedure.",
      "Resume topical minoxidil or hair serums after 48 hours as advised.",
      "Avoid hair coloring, chemical straightening, or steam for 7 days.",
      "Stay hydrated and follow your prescribed nutritional vitamin regimen.",
    ],
    youtubeVideoId: "vTJo_UtYjhI",
    faqs: [
      { question: "What is the difference between PRP and GFC?", answer: "GFC (Growth Factor Concentrate) is the next-generation evolution of PRP. Unlike traditional PRP which contains platelets and cellular debris, GFC extracts only the acellular pure growth factors in 10x higher concentration, resulting in less soreness and faster results in 4 sessions instead of 6–8." },
      { question: "When will I see new hair growth?", answer: "Hair shedding reduces noticeably after the 1st or 2nd session (3–4 weeks). Visible improvement in hair volume, shaft thickness, and baby hair sprouts appears by the 3rd to 4th month." },
    ],
  },
  {
    id: "botox-fillers-contouring",
    slug: "anti-ageing-facials",
    aliases: ["anti-ageing-treatment-noida", "botox-dermal-fillers"],
    name: "Botox, Dermal Fillers & Liquid Face Lift",
    category: "Anti-Ageing & Contouring",
    bodyArea: "Face",
    tags: ["DR. IPSHITA JOHRI SIGNATURE", "ALLERGAN US-FDA"],
    rating: 4.95,
    reviewsCount: 750,
    duration: "45 mins",
    price: 7999,
    priceFormatted: "₹7,999",
    originalPriceFormatted: "₹9,999",
    discountBadge: "20% OFF",
    emiMonthly: "₹1,333",
    emiMonths: 6,
    sessionsInfo: "Customized Units / Syringe Protocol",
    cardHighlights: [
      "Performed exclusively by Founder Dr. Ipshita Johri & Senior MD Dermatologists",
      "100% authentic US-FDA Allergan Botox, Juvederm & Profhilo bio-remodeling",
      "Micro-droplet technique preserves natural facial expressions without stiffness",
    ],
    explainedSubtitle: "Subtle, Natural-Looking Rejuvenation That Preserves Your Authentic Beauty",
    shortDesc:
      "US-FDA approved wrinkle relaxers (Botox), hyaluronic acid dermal fillers, and Profhilo bio-remodeling for lifted, youthful contours.",
    fullDesc:
      "Ageing involves dynamic muscle lines as well as structural volume loss in the mid-face, under-eyes, and jawline. Led by celebrity dermatologist Dr. Ipshita Johri (Cardiff University, UK), our injectables protocol uses facial golden-ratio mapping and blunt micro-cannulas to smooth forehead/crow's feet lines, restore cheek and tear-trough volume, and sculpt a sharp jawline with natural grace.",
    bannerImage: "/images/results/facial-after.jpg",
    galleryImages: [
      { src: "/images/results/facial-after.jpg", caption: "Natural Jawline & Mid-Face Rejuvenation" },
      { src: "/images/doctors/dr-ipshita-johri.jpg", caption: "Performed by Dr. Ipshita Johri (UK-Trained Dermatologist)" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Golden Ratio Facial Mapping", desc: "Dynamic muscle movement and structural shadow zones are mapped.", image: "/images/doctors/dr-ipshita-johri.jpg" },
      { stepNumber: "STEP 2", title: "Topical Numbing", desc: "30-minute anaesthetic cream ensures pinch-free comfort.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 3", title: "Authentic Vial Verification", desc: "Sealed US-FDA Allergan/Juvederm batch hologram is shown to you.", image: "/images/clinic/interior-2.jpg" },
      { stepNumber: "STEP 4", title: "Micro-Droplet / Cannula Placement", desc: "Precise anatomical delivery for instant lift and wrinkle softening.", image: "/images/results/facial-after.jpg" },
      { stepNumber: "STEP 5", title: "Symmetry Check & Post-Care", desc: "Immediate contour review and 2-week follow-up touch-up included.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "Botox: once every 5–6 months. Hyaluronic Acid Fillers: once every 12–18 months.",
    idealFor: ["Forehead lines, frown lines (11s), and crow's feet", "Hollow under-eyes (tear troughs) and tired look", "Sagging jowls, marionette lines, and weak chin", "Lip hydration and subtle lip border definition"],
    notIdealFor: ["Pregnancy or breastfeeding", "Neuromuscular disorders", "Active infection at injection site"],
    beforeTreatment: ["Avoid blood-thinning supplements (Vitamin E, fish oil, aspirin) and alcohol 48 hours prior to minimize bruising.", "Schedule at least 2 weeks before a major wedding or photoshoot."],
    afterTreatment: ["Remain upright for 4 hours post-Botox; do not rub or massage treated areas for 24 hours.", "Avoid heavy workouts, saunas, and facials for 48 hours."],
    youtubeVideoId: "FSDkGE-H3_M",
    faqs: [
      { question: "Will Botox make my face look frozen or unnatural?", answer: "Never at Skinfinity Derma. Dr. Ipshita Johri specializes in 'Baby Botox' and balanced anatomical dosing—your wrinkles soften beautifully while your smile and brow expressions remain 100% natural." },
    ],
  },
  {
    id: "hifu-non-surgical-facelift",
    slug: "hifu-non-surgical-facelift",
    name: "HIFU 4D Non-Surgical Face & Jawline Lift",
    category: "Anti-Ageing & Contouring",
    bodyArea: "Face",
    tags: ["SMAS LAYER LIFT", "SINGLE SESSION LIFT"],
    rating: 4.91,
    reviewsCount: 480,
    duration: "60 mins",
    price: 9999,
    priceFormatted: "₹9,999",
    originalPriceFormatted: "₹14,999",
    discountBadge: "33% OFF",
    emiMonthly: "₹1,667",
    emiMonths: 6,
    sessionsInfo: "1 Full Face & Submental Jawline Session",
    cardHighlights: [
      "Targets deep 4.5mm SMAS fibromuscular layer—the same layer tightened in surgical facelifts",
      "Melts stubborn double-chin fat while tightening sagging jowls & neck",
      "Zero needles, zero incisions, and zero downtime",
    ],
    explainedSubtitle: "Deep Ultrasound SMAS Lifting Without Needles or Surgery",
    shortDesc: "High-Intensity Focused Ultrasound (HIFU) that reaches 1.5mm, 3.0mm, and 4.5mm depth to lift sagging cheeks, jowls, and double chin.",
    fullDesc: "HIFU delivers focused ultrasound energy to the foundational SMAS layer (4.5mm deep) without harming the skin surface. Thermal coagulation points trigger immediate tissue contraction followed by 90 days of intense neocollagenesis.",
    bannerImage: "/images/results/facial-after.jpg",
    galleryImages: [
      { src: "/images/results/facial-after.jpg", caption: "Defined V-Line Jawline & Lifted Cheek Contours" },
      { src: "/images/clinic/interior-4.jpg", caption: "Advanced Multi-Depth Ultrasound Transducers" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Vector Mapping", desc: "Lifting vectors and nerve safety zones are marked on the face and neck.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Ultrasound Gel", desc: "Conductive gel applied for acoustic energy transmission.", image: "/images/treatments/banner-hydrafacial.webp" },
      { stepNumber: "STEP 3", title: "4.5mm SMAS Pass", desc: "Deep transducer lifts the foundational muscle fascia layer.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "3.0mm & 1.5mm Dermis Pass", desc: "Tightens dermal collagen and melts submental double-chin fat.", image: "/images/results/facial-after.jpg" },
      { stepNumber: "STEP 5", title: "Peptide Recovery", desc: "Collagen-boosting serum and SPF 50+ applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1–2 sessions per year (results continue building over 8–12 weeks and last 10–12 months).",
    idealFor: ["Sagging jawline and jowls", "Double chin fullness", "Drooping eyebrows and nasolabial folds", "Patients wanting a lift without needles"],
    notIdealFor: ["Metal dental implants directly in the ultrasound path (covered with gauze)", "Severe surgical skin laxity", "Pregnancy"],
    beforeTreatment: ["Avoid fillers in the same zone for 4 weeks prior.", "Keep skin well hydrated."],
    afterTreatment: ["Drink plenty of water and take vitamin C to support collagen synthesis.", "Zero downtime—resume work immediately."],
    youtubeVideoId: "FSDkGE-H3_M",
    faqs: [
      { question: "When will I see the full HIFU lift?", answer: "You see 20–25% immediate tightening right off the table, and the peak lifted contour develops over 6 to 12 weeks as fresh collagen matures." },
    ],
  },
  {
    id: "medical-chemical-peels",
    slug: "chemical-peel",
    aliases: [
      "chemical-peel-noida",
      "chemical-peels",
      "peel-treatment",
      "yellow-peel",
    ],
    name: "Medical Chemical Peels",
    category: "Acne & Scar Revision",
    bodyArea: "Face",
    tags: ["ACNE & TAN REMOVAL", "DERMATOLOGIST FORMULATED"],
    rating: 4.88,
    reviewsCount: 840,
    duration: "30 mins",
    price: 1999,
    priceFormatted: "₹1,999",
    originalPriceFormatted: "₹2,500",
    discountBadge: "20% OFF",
    emiMonthly: "₹333",
    emiMonths: 6,
    sessionsInfo: "1 Customized Medical Peel Session",
    cardHighlights: [
      "Pharmaceutical-grade Salicylic, Mandelic, Glycolic, Black, or Retinol Yellow peels",
      "Dries active acne within 48 hours, unclogs comedones & fades dark spots",
      "Custom pH-buffered for Indian skin to ensure safe cellular renewal",
    ],
    explainedSubtitle: "Controlled Cellular Resurfacing for Clear, Even-Toned Skin",
    shortDesc: "Dermatologist-administered clinical peels to clear active breakouts, remove stubborn tan, and fade post-acne pigmentation.",
    fullDesc: "Medical chemical peels use purified organic acids (AHA, BHA, TCA, Azelaic, Kojic, and Retinol) at precise pH concentrations to dissolve the bonds holding dull, pigmented, or acne-congested surface cells—revealing fresh, clear skin underneath.",
    bannerImage: "/images/treatments/banner-acne.webp",
    galleryImages: [
      { src: "/images/treatments/banner-acne.webp", caption: "Customized Medical Peel Application" },
      { src: "/images/results/acne-after.jpg", caption: "Clear, Even Skin Tone Post-Peel Series" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Skin Degreasing & Prep", desc: "Pre-peel cleanser balances skin pH for uniform penetration.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Sensitive Zone Protection", desc: "Corners of eyes, nose, and lips are sealed with barrier ointment.", image: "/images/treatments/banner-acne.webp" },
      { stepNumber: "STEP 3", title: "Sequential Peel Coat", desc: "Dermatologist applies selected peel solution for calibrated minutes.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Neutralization & Cooling", desc: "Peel is neutralized and cooled with soothing thermal water.", image: "/images/results/acne-after.jpg" },
      { stepNumber: "STEP 5", title: "Ceramide & SPF Seal", desc: "Rich barrier repair cream and SPF 50+ sunscreen are applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 2–3 weeks for 4–6 sessions.",
    idealFor: ["Active pimples and oily skin", "Post-acne dark marks", "Sun tan on face, neck, back, or arms", "Dull, rough skin texture"],
    notIdealFor: ["Broken or sunburned skin", "Active facial eczema or rosacea flare"],
    beforeTreatment: ["Stop retinoids, waxing, threading, and scrubs 3 days before your peel."],
    afterTreatment: ["Do not pull or peel flaking skin; keep it moisturized.", "Apply SPF 50+ every 3–4 hours."],
    faqs: [
      { question: "Will my skin visibly peel like a sheet?", answer: "Most modern party peels (Mandelic, Glycolic, Lactic) cause zero visible flaking—only microscopic cellular renewal. Only deep Retinol Yellow peels have 2–3 days of light flaking." },
    ],
  },
  {
    id: "korean-glass-skin-facial",
    slug: "korean-glass-skin-facial",
    name: "Korean Glass Skin Glutathione & Bio-Cellulose Facial",
    category: "Medi-Facials & Glow",
    bodyArea: "Face",
    tags: ["BRIDAL FAVORITE", "DEWY TRANSLUCENCE"],
    rating: 4.94,
    reviewsCount: 790,
    duration: "60 mins",
    price: 4499,
    priceFormatted: "₹4,499",
    originalPriceFormatted: "₹5,999",
    discountBadge: "25% OFF",
    emiMonthly: "₹750",
    emiMonths: 6,
    sessionsInfo: "1 Luxury 7-Step Korean Protocol",
    cardHighlights: [
      "Combines oxy-jet infusion, ultrasound electroporation & pure glutathione-niacinamide ampoules",
      "Delivers intense moisture barrier repair and translucent poreless 'glass' finish",
      "Ideal for brides, grooms & dull dehydrated skin with zero downtime",
    ],
    explainedSubtitle: "Multi-Layer Hydration & Glutathione Brightening for Poreless Luminosity",
    shortDesc: "7-step Korean dermatology protocol combining oxygen jet exfoliation, cryo-electroporation, and glutathione-peptide infusion.",
    fullDesc: "Inspired by Seoul's premier dermatology clinics, our Korean Glass Skin Facial layers enzymatic micro-polishing, high-pressure oxygen infusion, cryo-electroporation of glutathione & PDRN salmon/botanical boosters, and a cooling bio-cellulose hydrogel mask.",
    bannerImage: "/images/treatments/banner-hydrafacial.webp",
    galleryImages: [
      { src: "/images/treatments/banner-hydrafacial.webp", caption: "Korean Glass Skin Oxy-Jet & Cryo Infusion" },
      { src: "/images/results/hydrafacial-after.jpg", caption: "Dewy, Translucent Complexion" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Double Enzyme Cleanse", desc: "Melts sebum and pollution particles gently.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Oxy-Jet Saline Polish", desc: "Supersonic oxygen & saline mist refines pores.", image: "/images/treatments/banner-hydrafacial.webp" },
      { stepNumber: "STEP 3", title: "Glutathione Electroporation", desc: "Cryo-probe pushes glutathione & niacinamide 10x deeper.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Bio-Cellulose Hydro-Mask", desc: "Locks in ceramides and peptides under LED light.", image: "/images/results/hydrafacial-after.jpg" },
      { stepNumber: "STEP 5", title: "Glass-Skin Dewy Seal", desc: "Finished with barrier essence and tone-up SPF 50+.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 3–4 weeks, or 2 days before a major celebration.",
    idealFor: ["Brides and grooms", "Dry, dull, or flaky skin", "Uneven tone and tired complexion", "Sensitive skin wanting glow without harsh acids"],
    notIdealFor: ["Active open skin infections"],
    beforeTreatment: ["Arrive with a clean face.", "Avoid facial waxing 48 hours prior."],
    afterTreatment: ["Let the infused serums absorb overnight before washing with a mild cleanser.", "Wear SPF 50+ daily."],
    faqs: [
      { question: "Can sensitive skin get the Korean Glass Skin Facial?", answer: "Yes! Because it relies on oxygen mist, cryo-cooling, and barrier ceramides rather than strong acids, even sensitive skin loves this treatment." },
    ],
  },
  {
    id: "lower-face-lhr",
    slug: "lower-face-laser-hair-reduction",
    name: "Lower Face Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Face",
    tags: ["CHIN & JAWLINE", "HORMONAL HAIR"],
    rating: 4.89,
    reviewsCount: 510,
    duration: "30 mins",
    price: 1999,
    priceFormatted: "₹1,999",
    originalPriceFormatted: "₹2,600",
    discountBadge: "23% OFF",
    emiMonthly: "₹333",
    emiMonths: 6,
    sessionsInfo: "1 Lower Face Session",
    cardHighlights: [
      "Includes chin, sidelocks, upper lip, jawline & upper neck",
      "90–95% reduction in stubborn hormonal lower-face hair",
      "US-FDA approved painless ice-cooling technology",
    ],
    explainedSubtitle: "Complete Lower-Face Smoothness for Jawline, Chin & Upper Lip",
    shortDesc: "Targeted laser hair removal for the lower half of the face including upper lip, chin, sidelocks, and jawline.",
    fullDesc: "Lower Face Laser Hair Reduction targets hormonally sensitive zones—upper lip, chin, jawline, and sidelocks—using triple-wavelength diode pulses and continuous sapphire cooling.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Lower Face & Jawline Laser Hair Reduction" },
      { src: "/images/results/laser-after.jpg", caption: "Smooth Lower Facial Contour" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Cleansing", desc: "Removes makeup and sunscreen from lower face.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Fine Trimming", desc: "Delicate surface shaving of chin and upper lip.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Cooling Gel", desc: "Chilled ultrasound gel protects the epidermis.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Diode Laser Pass", desc: "Targets deep roots along jawline and chin.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "SPF 50+ Finish", desc: "Calming moisturizer and sunscreen applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 4 weeks for 6–8 sessions.",
    idealFor: ["Jawline, upper lip, and chin hair", "PCOS lower face hair", "Ingrown bumps along the chin"],
    notIdealFor: ["Active open breakouts on the chin", "White/grey hair"],
    beforeTreatment: ["Do not thread, wax, or pluck for 3 weeks prior."],
    afterTreatment: ["Apply SPF 50+ daily and avoid facial bleach."],
    faqs: [
      { question: "Why choose Lower Face over individual upper lip and chin?", answer: "Lower Face covers the entire transition zone including jawline and sidelocks at a much better package value." },
    ],
  },
  {
    id: "upper-lip-chin-lhr",
    slug: "upper-lip-and-chin-laser-hair-reduction",
    name: "Upper Lip & Chin Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Face",
    tags: ["QUICK 15-MIN", "NO THREADING CUTS"],
    rating: 4.92,
    reviewsCount: 1290,
    duration: "20 mins",
    price: 1199,
    priceFormatted: "₹1,199",
    originalPriceFormatted: "₹1,600",
    discountBadge: "25% OFF",
    emiMonthly: "₹200",
    emiMonths: 6,
    sessionsInfo: "1 Upper Lip + Chin Session",
    cardHighlights: [
      "Includes upper lip, lower lip crease, and full chin area",
      "Eliminates greenish upper-lip shadow & painful weekly threading",
      "Painless -4°C sapphire chill tip protects delicate lip skin",
    ],
    explainedSubtitle: "Freedom from Weekly Threading Pain & Upper-Lip Darkness",
    shortDesc: "Fast 15-minute laser hair reduction for upper lip and chin with zero redness.",
    fullDesc: "Upper lip threading causes pain, cuts, and post-inflammatory darkening around the mouth. Our cooled diode tip clears upper lip and chin follicles gently in just 15 minutes.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Precision Upper Lip & Chin Laser" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Lip & Chin Cleanse", desc: "Gentle cleansing around the mouth.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Micro-Trimming", desc: "Precision dermaplaning of upper lip and chin.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Ice-Chill Gel", desc: "Cooling gel applied.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Laser Pulses", desc: "Quick painless pulses deactivate hair roots.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "Sunscreen", desc: "Soothing balm and SPF 50+ applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 3–4 weeks for 6–8 sessions.",
    idealFor: ["Upper lip shadow", "Coarse chin hair", "Sensitive skin that turns red from threading"],
    notIdealFor: ["Active cold sore on the lip"],
    beforeTreatment: ["Stop threading or waxing upper lip 2–3 weeks prior."],
    afterTreatment: ["Wear sunscreen daily."],
    faqs: [
      { question: "Does upper lip laser hurt?", answer: "Unlike threading which pulls hairs out by the root, our ice-cooled laser tip numbs the upper lip instantly so you barely feel a pinch." },
    ],
  },
  {
    id: "half-arms-lhr",
    slug: "half-arms-laser-hair-reduction",
    name: "Half Arms Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Arms",
    tags: ["FOREARMS & HANDS", "PAINLESS"],
    rating: 4.87,
    reviewsCount: 440,
    duration: "30 mins",
    price: 1999,
    priceFormatted: "₹1,999",
    originalPriceFormatted: "₹2,700",
    discountBadge: "26% OFF",
    emiMonthly: "₹333",
    emiMonths: 6,
    sessionsInfo: "1 Half Arms Session",
    cardHighlights: [
      "Includes forearms from elbows down to wrists, hands & fingers (or upper arms)",
      "90–95% reduction in hair growth over 6 sessions",
      "US-FDA approved painless In-Motion technology",
    ],
    explainedSubtitle: "Smooth Forearms & Hands Ready for Every Outfit",
    shortDesc: "Laser hair reduction covering elbows to fingertips (or shoulders to elbows) with painless cooling.",
    fullDesc: "Forearms are the most visible part of the arms. Our Half Arms Laser Hair Reduction clears forearm, wrist, and finger hair rapidly with zero waxing mess.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Forearm & Hand Laser Hair Reduction" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Mapping", desc: "Forearms, wrists, and hands are mapped.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Prep", desc: "Gentle surface shave.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Cooling Gel", desc: "Ultrasound gel applied.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Gliding Laser", desc: "15-minute smooth gliding pass per arm.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "SPF Lotion", desc: "Hydrating sunscreen lotion applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 4–6 weeks, 6 sessions.",
    idealFor: ["Visible forearm hair", "Post-waxing bumps on forearms"],
    notIdealFor: ["Fresh sunburn on forearms"],
    beforeTreatment: ["Avoid waxing for 3 weeks prior."],
    afterTreatment: ["Apply SPF on forearms when outdoors."],
    faqs: [
      { question: "Are elbows and hands included in Half Arms?", answer: "Yes, lower half arms includes the elbow joint all the way down to the back of the hands and fingers." },
    ],
  },
  {
    id: "half-legs-lhr",
    slug: "half-legs-laser-hair-reduction",
    name: "Half Legs Laser Hair Reduction",
    category: "Laser Hair Reduction",
    bodyArea: "Legs",
    tags: ["CALVES & KNEES", "NO INGROWNS"],
    rating: 4.90,
    reviewsCount: 590,
    duration: "40 mins",
    price: 2699,
    priceFormatted: "₹2,699",
    originalPriceFormatted: "₹3,600",
    discountBadge: "25% OFF",
    emiMonthly: "₹450",
    emiMonths: 6,
    sessionsInfo: "1 Half Legs Session",
    cardHighlights: [
      "Includes knees, lower legs (shins & calves), ankles, and feet/toes",
      "Eliminates coarse lower-leg stubble and strawberry pores",
      "US-FDA approved painless sapphire cooling",
    ],
    explainedSubtitle: "Smooth, Stubble-Free Lower Legs & Knees",
    shortDesc: "Laser hair reduction for knees, calves, shins, ankles, and feet.",
    fullDesc: "Lower legs tend to have the coarsest hair and the highest rate of razor nicks and ingrown bumps. Half Legs Laser Hair Reduction targets from above the knees down to the toes.",
    bannerImage: "/images/treatments/banner-laser.webp",
    galleryImages: [
      { src: "/images/treatments/banner-laser.webp", caption: "Half Legs Painless Laser Protocol" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Grid Mapping", desc: "Knees, shins, and calves are mapped.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Gentle Shave", desc: "Prepared without razor burn.", image: "/images/treatments/banner-laser.webp" },
      { stepNumber: "STEP 3", title: "Chilled Gel", desc: "Cooling gel applied.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Laser Sweep", desc: "Triple-wavelength diode clears coarse shin hair.", image: "/images/results/laser-after.jpg" },
      { stepNumber: "STEP 5", title: "Ceramide Balm", desc: "Soothing moisturizer applied.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 6 weeks, 6 sessions.",
    idealFor: ["Coarse shin and calf hair", "Strawberry legs on calves"],
    notIdealFor: ["Open cuts on shins"],
    beforeTreatment: ["Do not wax lower legs for 4 weeks prior."],
    afterTreatment: ["Moisturize daily."],
    faqs: [
      { question: "Does Half Legs include knees and feet?", answer: "Yes! Lower Half Legs covers the entire knee cap, shins, calves, ankles, feet, and toes." },
    ],
  },
];

export function getTreatmentBySlug(slug: string): RichTreatment {
  const normalized = slug.toLowerCase().trim();

  // 1. Detect location suffix or keyword
  const isGurgaon =
    /(?:-in-gurgaon|-in-gurugram|-gurgaon|-gurugram)$/i.test(normalized) ||
    normalized.includes("gurgaon") ||
    normalized.includes("gurugram");
  const isNoida =
    !isGurgaon &&
    (/(?:-in-noida|-noida)$/i.test(normalized) || normalized.includes("noida"));
  const isLocation = isGurgaon || isNoida;
  const cityName = isGurgaon ? "Gurgaon" : (isNoida ? "Noida" : "");
  const clinicTag = isGurgaon ? "GURGAON GOLF COURSE RD" : (isNoida ? "NOIDA SECTOR 36" : "NOIDA & GURGAON");

  // 2. Extract clean core slug (without city suffixes)
  const coreSlug = normalized
    .replace(/-in-gurgaon|-in-gurugram|-gurgaon|-gurugram|-in-noida|-noida/gi, "")
    .replace(/^[-]+|[-]+$/g, "");

  // 3. For pure non-location slug, check if exact match exists in RICH_TREATMENTS
  if (!isLocation) {
    const exact = RICH_TREATMENTS.find(
      (t) =>
        t.slug.toLowerCase() === normalized ||
        t.id.toLowerCase() === normalized ||
        t.aliases?.some((a) => a.toLowerCase() === normalized)
    );
    if (exact) {
      const cleanName = exact.name.replace(/\s*in\s*(Noida|Gurgaon|Gurugram)/gi, "").trim();
      return {
        ...exact,
        name: cleanName,
      };
    }
  }

  // 4. Special rich doctor clinic consultation profile for location landing pages
  if (
    coreSlug.includes("dermatologist") ||
    coreSlug === "skin-clinic" ||
    coreSlug === "skin-clinic-in"
  ) {
    const docName = isLocation
      ? `Senior Dermatologist Clinic & Consultation in ${cityName}`
      : "Senior Dermatologist Clinic & Consultation";
    const docShortDesc = isLocation
      ? `Comprehensive clinical skin & hair consultation with Senior MD Dermatologists at Skinfinity Derma ${cityName}.`
      : "Comprehensive clinical skin & hair consultation with Senior MD Dermatologists at Skinfinity Derma Noida & Gurgaon.";
    const docFullDesc = isLocation
      ? `Welcome to Skinfinity Derma ${cityName}. Led by Dr. Ipshita Johri (Cardiff University, U.K.) and our team of senior MD dermatologists, our clinic offers world-class clinical dermatology, US-FDA laser hair removal, acne scar remodeling, pigmentation therapy, and non-surgical facial rejuvenation.`
      : "Welcome to Skinfinity Derma. Led by Dr. Ipshita Johri (Cardiff University, U.K.) and our team of senior MD dermatologists, our clinics in Noida Sector 36 and Gurgaon Golf Course Road offer world-class clinical dermatology, US-FDA laser hair removal, acne scar remodeling, pigmentation therapy, and non-surgical facial rejuvenation.";

    return {
      id: slug,
      slug,
      name: docName,
      category: "Skin Treatments",
      bodyArea: "Face, Scalp & Body",
      tags: ["MD DERMATOLOGIST LED", "CARDIFF U.K. TRAINED", clinicTag],
      rating: 4.96,
      reviewsCount: 1250,
      duration: "30-45 mins",
      price: 1000,
      priceFormatted: "₹1,000",
      originalPriceFormatted: "₹1,500",
      discountBadge: "33% OFF",
      emiMonthly: "₹500",
      emiMonths: 2,
      sessionsInfo: "1 Comprehensive Consultation",
      cardHighlights: [
        `Detailed digital skin, hair & scalp assessment by Senior MD Dermatologists${isLocation ? ` in ${cityName}` : ""}`,
        "Personalized root-cause diagnosis and evidence-based prescription",
        "Confidential clinical consultation led by Dr. Ipshita Johri & expert team",
      ],
      explainedSubtitle: isLocation
        ? `Premier Medical Cosmetology & Clinical Dermatology Center in ${cityName}`
        : "Premier Medical Cosmetology & Clinical Dermatology Centers (Noida & Gurgaon)",
      shortDesc: docShortDesc,
      fullDesc: docFullDesc,
      bannerImage: "/images/doctors/dr-ipshita-johri.webp",
      galleryImages: [
        { src: "/images/doctors/dr-ipshita-johri.webp", caption: "Dr. Ipshita Johri — Founder & Celebrity Dermatologist" },
        { src: "/images/breadcrumbbanner/service.webp", caption: `Skinfinity Derma ${isLocation ? cityName : "Noida & Gurgaon"} Consultation Suite` },
        { src: "/images/clinic/interior-4.jpg", caption: "Sterilized Medical Dermatology Suites" },
        { src: "/images/treatments/banner-hydrafacial.webp", caption: "US-FDA Approved Diagnostic Technology" },
      ],
      howItWorksSteps: [
        { stepNumber: "STEP 1", title: "Patient History & Intake", desc: `Comprehensive evaluation of lifestyle, previous treatments, and symptoms at our clinic.`, image: "/images/clinic/interior-1.jpg" },
        { stepNumber: "STEP 2", title: "Digital Skin & Scalp Analysis", desc: "Detailed dermascopic assessment to map sebum, pigmentation, follicle density and scar depth.", image: "/images/doctors/dr-ipshita-johri.webp" },
        { stepNumber: "STEP 3", title: "Dermatologist Consultation", desc: "One-on-one session with Senior MD Dermatologist to formulate a tailored clinical roadmap.", image: "/images/clinic/interior-4.jpg" },
        { stepNumber: "STEP 4", title: "Prescription & Protocol", desc: "Evidence-based clinical skincare regimen, lifestyle guidance, and procedure recommendations.", image: "/images/clinic/interior-5.jpg" },
      ],
      idealFrequency: "Initial consultation followed by quarterly follow-up evaluations.",
      idealFor: [
        `Individuals seeking expert dermatological advice and diagnosis${isLocation ? ` in ${cityName}` : ""}`,
        "Patients with persistent acne, stubborn scars, hair loss, or pigmentation",
        "Anyone looking for custom doctor-formulated medical skincare protocols",
        "Pre-wedding and bridal skin preparation assessment",
      ],
      notIdealFor: [
        "Routine non-medical spa pampering without clinical indications",
      ],
      beforeTreatment: [
        "Arrive with clean skin free from heavy cosmetic makeup.",
        "Bring previous medical records, prescriptions, or blood work if available.",
        "List all current topical active serums and oral medications.",
      ],
      afterTreatment: [
        "Follow prescribed dermatologist protocol diligently.",
        "Apply broad-spectrum mineral SPF 50+ sunscreen daily.",
        "Attend scheduled review to track clinical progress.",
      ],
      faqs: [
        {
          question: `Why choose Skinfinity Derma for dermatology${isLocation ? ` in ${cityName}` : ""}?`,
          answer: `Skinfinity Derma is led by Dr. Ipshita Johri (Cardiff University, U.K.) and senior MD dermatologists with 14+ years of clinical excellence. We focus on accurate diagnosis, treating root causes, and providing US-FDA approved technologies.`,
        },
        {
          question: `What concerns are treated at the clinic?`,
          answer: `We specialize in acne & scar revision, laser hair removal, melasma & pigmentation, hair fall & PRP/GFC therapy, non-surgical anti-ageing, and medical facials.`,
        },
        {
          question: "Can I book a consultation online?",
          answer: "Yes, you can schedule a priority consultation directly through our website or via WhatsApp.",
        },
      ],
    };
  }

  // 5. Try matching a rich base treatment from the catalog by core name
  const baseTreatment = RICH_TREATMENTS.find((t) => {
    const tSlug = t.slug.toLowerCase();
    const tCore = tSlug.replace(/-in-noida|-in-gurgaon|-noida|-gurgaon/gi, "").trim();
    if (tSlug === normalized || t.id.toLowerCase() === normalized) return true;
    if (tCore === coreSlug || t.id.toLowerCase() === coreSlug) return true;
    if (
      t.aliases?.some((a) => {
        const aNorm = a.toLowerCase();
        const aCore = aNorm.replace(/-in-noida|-in-gurgaon|-noida|-gurgaon/gi, "").trim();
        return aNorm === normalized || aNorm === coreSlug || aCore === coreSlug;
      })
    )
      return true;
    if (coreSlug.startsWith("acne") && tSlug.includes("acne")) return true;
    if (coreSlug.startsWith("laser-hair") && tSlug.includes("laser-hair")) return true;
    if (coreSlug.startsWith("pigmentation") && tSlug.includes("pigment")) return true;
    if (coreSlug.startsWith("hydra") && tSlug.includes("hydra")) return true;
    if (coreSlug.startsWith("chemical-peel") && tSlug.includes("chemical-peel")) return true;
    if (
      coreSlug.startsWith("hair-fall") &&
      (tSlug.includes("hair-loss") || tSlug.includes("hair-fall"))
    )
      return true;
    if (coreSlug.startsWith("anti-ageing") && tSlug.includes("anti-ageing")) return true;
    if (coreSlug.startsWith("hifu") && tSlug.includes("hifu")) return true;
    return false;
  });

  if (baseTreatment) {
    const cleanBaseName = baseTreatment.name
      .replace(/\s*in\s*(Noida|Gurgaon|Gurugram)/gi, "")
      .trim();

    if (isLocation) {
      const locationTreatmentName = `${cleanBaseName} in ${cityName}`;
      return {
        ...baseTreatment,
        id: slug,
        slug: slug,
        name: locationTreatmentName,
      };
    } else {
      return {
        ...baseTreatment,
        id: slug,
        slug: slug,
        name: cleanBaseName,
      };
    }
  }

  // 6. Dynamic fallback for any other treatment/location slug
  const cleanTitle = coreSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  const displayName = isLocation ? `${cleanTitle} in ${cityName}` : cleanTitle;
  const shortDesc = isLocation
    ? `Doctor-certified clinical protocol for ${cleanTitle} in ${cityName} at Skinfinity Derma. US-FDA approved technologies with zero downtime.`
    : `Doctor-certified clinical protocol for ${cleanTitle} at Skinfinity Derma. US-FDA approved technologies with zero downtime.`;
  const fullDesc = isLocation
    ? `At Skinfinity Derma ${cityName}, our board-certified dermatologists provide tailored clinical protocols for ${cleanTitle}. By combining root-cause medical diagnostics with US-FDA approved gold standard technologies, we deliver safe, predictable, and transformative results.`
    : `At Skinfinity Derma, our board-certified dermatologists provide tailored clinical protocols for ${cleanTitle}. By combining root-cause medical diagnostics with US-FDA approved gold standard technologies, we deliver safe, predictable, and transformative results.`;

  // Derive Category and Banner image from spreadsheet keywords
  let category: RichTreatment["category"] = "Skin Treatments" as any;
  let bannerImage = "/images/treatments/banner-acne.webp";

  if (/hair|prp|gfc|alopecia|scalp|dandruff/i.test(normalized)) {
    category = "Hair Restoration";
    bannerImage = "/images/treatments/banner-hair.webp";
  } else if (/laser|tattoo|wart|mole|tag|beard|q-switch/i.test(normalized)) {
    category = "Laser Hair Reduction";
    bannerImage = "/images/treatments/banner-laser.webp";
  } else if (/body|fat|chin|contouring|hifu/i.test(normalized)) {
    category = "Anti-Ageing & Contouring";
    bannerImage = "/images/treatments/banner-laser.webp";
  } else if (/wedding|bridal|groom|package/i.test(normalized)) {
    category = "Medi-Facials & Glow";
    bannerImage = "/images/treatments/banner-hydrafacial.webp";
  } else if (/hydra|facial|glow|peel|anti-ageing|anti-aging/i.test(normalized)) {
    category = "Medi-Facials & Glow";
    bannerImage = "/images/treatments/banner-hydrafacial.webp";
  } else if (/pigment|melasma|dark|spots/i.test(normalized)) {
    category = "Pigmentation & Lasers";
    bannerImage = "/images/treatments/banner-acne.webp";
  }

  return {
    id: slug,
    slug,
    name: displayName,
    category,
    bodyArea: "Face & Body",
    tags: isLocation
      ? ["US-FDA APPROVED", "MD DERMATOLOGIST LED", clinicTag]
      : ["US-FDA APPROVED", "MD DERMATOLOGIST LED"],
    rating: 4.93,
    reviewsCount: 680,
    duration: "45-60 mins",
    price: 3499,
    priceFormatted: "₹3,499",
    originalPriceFormatted: "₹5,000",
    discountBadge: "30% OFF",
    emiMonthly: "₹583",
    emiMonths: 6,
    sessionsInfo: "1 Clinical Session",
    cardHighlights: isLocation
      ? [
          `US-FDA approved clinical protocol for ${cleanTitle} in ${cityName}`,
          `Senior MD dermatologist consultation available at our ${cityName} clinic`,
          "Personalized root-cause diagnosis with zero social downtime",
        ]
      : [
          `US-FDA approved clinical protocol for ${cleanTitle}`,
          "Senior MD dermatologist consultation available at our clinics",
          "Personalized root-cause diagnosis with zero social downtime",
        ],
    explainedSubtitle: isLocation
      ? `Evidence-Based, Safe & Doctor-Supervised Clinical Excellence in ${cityName}`
      : "Evidence-Based, Safe & Doctor-Supervised Clinical Excellence",
    shortDesc,
    fullDesc,
    bannerImage: bannerImage,
    galleryImages: [
      { src: bannerImage, caption: isLocation ? `${cleanTitle} at Skinfinity Derma ${cityName}` : `${cleanTitle} at Skinfinity Derma` },
      { src: "/images/clinic/interior-4.jpg", caption: isLocation ? `US-FDA Certified Dermatology Suites in ${cityName}` : "US-FDA Certified Dermatology Suites" },
      { src: "/images/clinic/interior-2.jpg", caption: "Hygienic Sterilized Consultation & Procedure Rooms" },
    ],
    howItWorksSteps: [
      { stepNumber: "STEP 1", title: "Digital Dermoscopy", desc: isLocation ? `Detailed skin & follicle diagnostic analysis by senior MD Dermatologist in ${cityName}.` : "Detailed skin & follicle diagnostic analysis by senior MD Dermatologist.", image: "/images/clinic/interior-1.jpg" },
      { stepNumber: "STEP 2", title: "Medical Cleansing & Prep", desc: "Deep enzymatic cleansing, topical sanitization, and pH preparation of target zone.", image: bannerImage },
      { stepNumber: "STEP 3", title: "Calibrated Procedure", desc: "Delivery of US-FDA approved laser, peel, or bio-remodeling energy calibrated to Indian skin.", image: "/images/clinic/interior-4.jpg" },
      { stepNumber: "STEP 4", title: "Active Infusion & Healing", desc: "Targeted soothing peptides, growth factors, and cold-compress barrier recovery.", image: "/images/results/hydrafacial-after.jpg" },
      { stepNumber: "STEP 5", title: "Doctor Review & Post-Care", desc: "Personalized home skincare regimen and broad-spectrum SPF 50+ application.", image: "/images/clinic/interior-5.jpg" },
    ],
    idealFrequency: "1 session every 3–4 weeks (4–6 sessions for permanent remodeling & lasting clinical results).",
    idealFor: [
      isLocation ? `Patients seeking certified clinical ${cleanTitle} in ${cityName}` : `Patients seeking certified clinical ${cleanTitle}`,
      "Individuals with persistent texture, tone, or hair concerns",
      "Safe for Indian skin types with customized dermatologist calibration",
      "Zero downtime and immediate return to work or social schedule",
    ],
    notIdealFor: [
      "Active open skin lesions or untreated herpes cold sores",
      "Uncontrolled photosensitivity or recent chemical peeling within 5 days",
      "Pregnancy or breastfeeding without prior physician clearance",
    ],
    beforeTreatment: [
      "Arrive with clean skin free from heavy cosmetic makeup or retinoids.",
      "Avoid direct outdoor sun tanning or beach exposure 48 hours prior.",
      "Inform the dermatologist about any active oral prescriptions.",
    ],
    afterTreatment: [
      "Strict application of prescribed broad-spectrum SPF 50+ sunscreen.",
      "Avoid hot saunas, steam rooms, or vigorous workouts for 24-48 hours.",
      "Use only recommended medical gentle cleanser and barrier repair cream.",
    ],
    youtubeVideoId: "BdJ7l2v26e0",
    faqs: isLocation
      ? [
          {
            question: `How many sessions of ${cleanTitle} in ${cityName} are recommended?`,
            answer: `Most patients at our ${cityName} clinic observe visible results after the very first session. A typical protocol consists of 4 to 6 sessions spaced 3 to 4 weeks apart for optimal, long-lasting outcomes.`,
          },
          {
            question: `Is the procedure painful or does it involve downtime?`,
            answer: "No. Our treatments use genuine US-FDA approved equipment equipped with contact cooling and topical numbing where necessary, ensuring a virtually painless experience with zero social downtime.",
          },
          {
            question: `Why choose Skinfinity Derma for ${cleanTitle} in ${cityName}?`,
            answer: `Skinfinity Derma is founded by celebrity dermatologist Dr. Ipshita Johri and operates NABH-grade clinics in ${cityName}. Every procedure is performed or directly supervised by board-certified MD dermatologists using genuine US-FDA technology.`,
          },
        ]
      : [
          {
            question: `How many sessions of ${cleanTitle} are recommended?`,
            answer: "Most patients observe visible results after the very first session. A typical protocol consists of 4 to 6 sessions spaced 3 to 4 weeks apart for optimal, long-lasting outcomes.",
          },
          {
            question: "Is the procedure painful or does it involve downtime?",
            answer: "No. Our treatments use genuine US-FDA approved equipment equipped with contact cooling and topical numbing where necessary, ensuring a virtually painless experience with zero social downtime.",
          },
          {
            question: `Why choose Skinfinity Derma for ${cleanTitle}?`,
            answer: "Skinfinity Derma is founded by celebrity dermatologist Dr. Ipshita Johri and operates NABH-grade clinics in Noida and Gurgaon. Every procedure is performed or directly supervised by board-certified MD dermatologists.",
          },
        ],
  };
}
