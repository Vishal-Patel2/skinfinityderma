"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Pill,
  ShieldCheck,
  Star,
  Trophy,
  Building2,
  Microscope,
  Calendar,
  HeartHandshake,
  Cpu,
  FileCheck2,
} from "lucide-react";
import {
  DOCTORS,
  ASSOCIATED_PARTNERS,
} from "@/data/clinicData";
import BrandJourneyRoadmap from "@/components/about/BrandJourneyRoadmap";
import { useAuth } from "@/context/AuthContext";

const TAB_ITEMS = {
  Machines: [
    {
      src: "/images/treatments/banner-laser.webp",
      title: "US-FDA Soprano Titanium Triple-Wavelength Laser",
      tag: "755nm + 810nm + 1064nm",
      desc: "Painless permanent hair reduction with -4°C ICE Plus continuous sapphire contact cooling, calibrated for Indian skin tones.",
    },
    {
      src: "/images/clinic/interior-4.jpg",
      title: "Q-Switched Nd:YAG 1064nm Nanosecond Laser",
      tag: "Melasma & Pigment Toning",
      desc: "Photoacoustic melanin shattering technology for stubborn melasma, sun spots, carbon laser peels, and epidermal brightening.",
    },
    {
      src: "/images/treatments/banner-acne.webp",
      title: "Gold-Insulated Fractional MNRF Platform",
      tag: "Collagen Scar Remodeling",
      desc: "Precision microneedling radiofrequency system that delivers controlled dermal thermal energy for deep acne scar elevation.",
    },
    {
      src: "/images/treatments/banner-hydrafacial.webp",
      title: "Vortex-Fusion Sugarcane HydraFacial MD System",
      tag: "Hydro-Dermabrasion & LED",
      desc: "Medical vacuum extraction and botanical glycolic-hyaluronic infusion platform with integrated phototherapy.",
    },
    {
      src: "/images/results/facial-after.jpg",
      title: "4D HIFU SMAS Ultrasound Lifting System",
      tag: "1.5mm • 3.0mm • 4.5mm Depth",
      desc: "Non-surgical focused ultrasound targeting the foundational SMAS layer for jawline contouring and double-chin reduction.",
    },
    {
      src: "/images/clinic/interior-2.jpg",
      title: "200x Digital Video Dermoscope & Trichoscope",
      tag: "AI-Assisted Diagnostics",
      desc: "High-magnification polarized optical analyzer for follicular unit density mapping and epidermal pigment depth grading.",
    },
  ],
  Labs: [
    {
      src: "/images/clinic/interior-6.jpg",
      title: "On-Site Orange Health Pathology Collection Lab",
      tag: "NABL Certified Diagnostics",
      desc: "Same-day hormonal, PCOS, thyroid (T3/T4/TSH), ferritin, and vitamin D3/B12 blood panels to diagnose internal root causes.",
    },
    {
      src: "/images/treatments/banner-hairloss.webp",
      title: "Sterile Autologous GFC & PRP Cellular Lab",
      tag: "Closed-System Centrifugation",
      desc: "Hospital-grade laminar hygiene zone for isolating 10x concentrated autologous growth factors from patient blood samples.",
    },
    {
      src: "/images/clinic/interior-2.jpg",
      title: "Wood's Lamp & Microscopic Trichology Lab",
      tag: "Root-Cause Evaluation",
      desc: "Differentiates epidermal vs. dermal melasma and evaluates hair bulb anagen-to-telogen ratios prior to treatment.",
    },
    {
      src: "/images/clinic/interior-1.jpg",
      title: "In-House Cold-Chain Dermatological Pharmacy",
      tag: "100% Batch-Verified Actives",
      desc: "Temperature-controlled storage for authentic Allergan biologics, peptide serums, medical peels, and prescription topicals.",
    },
  ],
  Clinic: [
    {
      src: "/images/custom/clinic-reception.jpg",
      title: "Luxury Flagship Reception & Welcome Lounge",
      tag: "Noida & Gurgaon Clinics",
      desc: "Warm architectural finishes, sanitized private seating, and seamless digital patient check-in.",
    },
    {
      src: "/images/clinic/interior-1.jpg",
      title: "Private US-FDA Laser & Peel Suites",
      tag: "Sterile Operatory",
      desc: "Dedicated single-patient procedure suites with disposable hygiene kits and hospital-grade sterilization.",
    },
    {
      src: "/images/clinic/interior-2.jpg",
      title: "Confidential MD Dermatologist Chambers",
      tag: "Doctor Consultation",
      desc: "Sound-insulated clinical examination chambers for 1-on-1 consultations and digital dermoscopy.",
    },
    {
      src: "/images/clinic/interior-5.jpg",
      title: "Signature Medi-Facial & Rejuvenation Studio",
      tag: "Calm Aesthetic Suite",
      desc: "Ergonomic treatment beds and soothing ambiance for HydraFacials, Korean Glass Skin protocols, and LED therapy.",
    },
    {
      src: "/images/clinic/interior-4.jpg",
      title: "Minor Dermatosurgery & Injectable Suite",
      tag: "CMO Licensed Facility",
      desc: "Aseptic minor procedure room for cannula subcision, Botox, dermal fillers, thread lifts, and mole/wart excisions.",
    },
    {
      src: "/images/clinic/interior-6.jpg",
      title: "Post-Procedure Recovery & Counselling Lounge",
      tag: "Patient Care",
      desc: "Dedicated post-care bay where patients receive SPF protection and personalized home-regimen guidance.",
    },
  ],
};

const AWARDS_LIST = [
  {
    title: "Government-Approved CMO Licence",
    badge: "Official Medical Registration",
    year: "Certified",
    desc: "Registered and licensed under the Chief Medical Officer (CMO) clinical establishment norms, ensuring strict medical compliance, bio-safety, and qualified MD dermatologist governance.",
    iconType: "licence",
  },
  {
    title: "Most Trusted Skin Clinic Award",
    badge: "Patient Trust & Excellence",
    year: "2024–2026",
    desc: "Honored as the Most Trusted Skin & Laser Clinic in Delhi NCR backed by 4,500+ verified reviews (4.5/5 rating) and over 1,00,000 successful clinical procedures.",
    iconType: "award",
  },
  {
    title: "Ms. India Curvy 2020 — Runner Up",
    badge: "National Pageant Icon",
    year: "2020",
    desc: "Dr. Ipshita Johri crowned nationally for championing body positivity, self-confidence, and inclusive clinical aesthetics.",
    iconType: "award",
  },
  {
    title: "Excellence in US-FDA Laser & Trichology Protocols",
    badge: "Clinical Innovation",
    year: "2023",
    desc: "Recognized for pioneering Sugarcane HydraFacial MD and high-concentration autologous GFC hair restoration protocols in North India.",
    iconType: "award",
  },
];

function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center py-1 bg-white">
      <Image
        src="/images/custom/section-divider.webp"
        alt="section divider"
        width={320}
        height={34}
        className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain opacity-90 select-none pointer-events-none"
      />
    </div>
  );
}

export default function AboutClinicInteractiveSections() {
  const { openAppointmentModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"Machines" | "Labs" | "Clinic">("Machines");
  const doctorScrollRef = useRef<HTMLDivElement>(null);
  const [isDocPaused, setIsDocPaused] = useState(false);

  const specialistDoctors = DOCTORS.map((doc) =>
    doc.id === "dr-ipshita-johri"
      ? { ...doc, image: "/images/doctors/dr-ipshita-johri.webp" }
      : doc
  );

  useEffect(() => {
    if (isDocPaused) return;
    const timer = setInterval(() => {
      const el = doctorScrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isDocPaused]);

  const scrollDocLeft = () =>
    doctorScrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollDocRight = () =>
    doctorScrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  const activeItems = TAB_ITEMS[activeTab];

  return (
    <div className="bg-white">
      {/* ── 1. INTERACTIVE TABBED SECTION: MACHINES, LABS, AND CLINIC ── */}
      <section className="py-14 lg:py-20 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
                <Building2 className="w-3.5 h-3.5" />
                <span>Clinical Infrastructure Explorer</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
                Explore Our <span className="text-brand-700">Machines, Labs &amp; Clinic</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
                Switch between tabs below to inspect our US-FDA approved medical machines, on-site pathology &amp; GFC laboratories, and luxury procedure suites in Noida &amp; Gurgaon.
              </p>
            </div>

            {/* Clean Responsive Tab Switcher: Machines | Labs | Clinic */}
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm self-start lg:self-auto">
              {(
                [
                  { id: "Machines", label: "Machines", icon: Cpu },
                  { id: "Labs", label: "Labs", icon: FlaskConical },
                  { id: "Clinic", label: "Clinic", icon: Building2 },
                ] as const
              ).map(({ id, label, icon: TabIcon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-[#008081] text-white shadow-md"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeItems.map((item, i) => (
              <div
                key={`${activeTab}-${i}`}
                className="group relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/3] bg-slate-100 flex flex-col justify-end p-6"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-brand-800 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {item.tag}
                </span>

                <div className="relative z-10 text-white">
                  <h3 className="text-base font-bold font-serif leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 2. OUR JOURNEY – INTERACTIVE S-CURVE ROADMAP ── */}
      <BrandJourneyRoadmap />

      <SectionDivider />

      {/* ── 3. AWARDS, LICENSING & RECOGNITIONS ── */}
      <section className="py-10 lg:py-14 bg-gradient-to-b from-white via-amber-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Licensing, Honors &amp; Accolades</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Awards, CMO Licence &amp; <span className="text-brand-700">Recognitions</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Government-approved medical licensing, national awards, and verified patient trust across Noida and Gurgaon.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Spotlight Card */}
            <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Government-Approved CMO Licence</span>
                </div>

                <h3 className="text-2xl font-extrabold font-serif leading-snug">
                  Most Trusted Skin Clinic Award &amp; CMO Licensed Center
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Skinfinity Derma operates as a fully registered, Government-Approved CMO Licensed dermatology facility, recipient of the Most Trusted Skin Clinic Award and led by Founder Dr. Ipshita Johri (Ms. India Curvy 2020 Runner Up).
                </p>
              </div>

              <div className="mt-6 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 relative z-10">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-amber-400">
                  <Image
                    src="/images/doctors/dr-ipshita-miss-curvy.jpg"
                    alt="Dr. Ipshita Johri Ms. India Curvy 2020"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-white mt-1">
                    Most Trusted Skin Clinic Award
                  </p>
                  <p className="text-[11px] text-slate-300">
                    4,500+ Verified 4.5★ Google Reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Right 2x2 Grid of Awards including Government-Approved CMO Licence & Most Trusted Skin Clinic Award */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {AWARDS_LIST.map((award, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                        {award.iconType === "licence" ? (
                          <FileCheck2 className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <Trophy className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        {award.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-serif leading-snug pt-1">
                      {award.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {award.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Verification Status</span>
                    <span className="text-brand-700">{award.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 4. DEDICATED DOCTOR PROFILES ── */}
      <section id="doctors" className="py-10 lg:py-14 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Senior Clinical Board</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
                Dedicated <span className="text-brand-700">Doctor Profiles</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
                Every consultation and procedure at Skinfinity Derma is performed directly by our board-certified dermatologists.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={scrollDocLeft}
                aria-label="Previous doctor"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollDocRight}
                aria-label="Next doctor"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={doctorScrollRef}
            onMouseEnter={() => setIsDocPaused(true)}
            onMouseLeave={() => setIsDocPaused(false)}
            onTouchStart={() => setIsDocPaused(true)}
            onTouchEnd={() => setIsDocPaused(false)}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
          >
            {specialistDoctors.map((doc) => (
              <div
                key={doc.id}
                className="flex-none w-[270px] sm:w-[285px] lg:w-[calc(25%-18px)] snap-start bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="block relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 mb-5"
                  >
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-sm">
                      {doc.experience || "MD Dermatologist"}
                    </div>
                  </Link>

                  <Link href={`/doctors/${doc.id}`}>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-serif">
                      {doc.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-brand-700 font-semibold mt-1">
                    {doc.role}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {doc.qualifications}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                    {doc.bio || doc.specialty}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/doctors/${doc.id}`}
                    className="flex-1 text-center py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => openAppointmentModal("General Dermatologist Consultation")}
                    className="flex-1 text-center py-2 px-2.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-700 hover:text-white transition-all cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 5. ASSOCIATED PARTNERS ── */}
      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Trusted Clinical Ecosystem</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Associated Healthcare &amp;{" "}
              <span className="text-brand-700">Technology Partners</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              We collaborate with world-leading diagnostic laboratories, US-FDA laser manufacturers, and medical financing institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ASSOCIATED_PARTNERS.map((partner, idx) => {
              const isOrangeHealth = partner.name
                .toLowerCase()
                .includes("orange");
              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                    isOrangeHealth
                      ? "bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-300 shadow-md sm:col-span-2"
                      : "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-brand-300 hover:shadow-lg"
                  }`}
                >
                  <div className="space-y-2.5">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isOrangeHealth
                          ? "bg-orange-500 text-white"
                          : "bg-brand-50 text-brand-700 border border-brand-200"
                      }`}
                    >
                      {partner.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-serif">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {partner.type}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-brand-700">
                    <span>Authorized Clinical Partner</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
