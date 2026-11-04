import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Award,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Star,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { DOCTORS, CLINIC_LOCATIONS, TESTIMONIALS } from "@/data/clinicData";
import { API_BASE } from "@/lib/api";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";
import AppointmentForm from "@/components/modals/AppointmentForm";

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return DOCTORS.map((doc) => ({
    slug: doc.id,
  }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let doctor: any = null;
  try {
    const res = await fetch(`${API_BASE}/doctors/${encodeURIComponent(params.slug)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) doctor = json.data;
    }
  } catch {}

  if (!doctor) {
    doctor = DOCTORS.find((d) => d.id === params.slug || d.slug === params.slug);
  }

  if (!doctor) {
    return {
      title: "Doctor Profile | Skinfinity Derma Clinic",
    };
  }
  return {
    title: `${doctor.name} — ${doctor.role} | Skinfinity Derma`,
    description: doctor.bio,
  };
}

const DOCTOR_EXTENDED_DETAILS: Record<
  string,
  {
    highlights: string[];
    FocusAreas: string[];
    education: string[];
    memberships: string[];
    languages: string;
    consultationTimings: string;
  }
> = {
  "dr-ipshita-johri": {
    highlights: [
      "12+ Years of Clinical & Aesthetic Dermatology Leadership",
      "Post-Graduate Clinical Dermatology — Cardiff University, U.K.",
      "Over 1,00,000+ Successful Skin & Hair Patient Transformations",
      "Crowned Ms. India Curvy 2020 Runner Up & National Pageant Mentor",
    ],
    FocusAreas: [
      "Non-Surgical Facial Sculpting, Botox & Dermal Fillers",
      "Pioneer of Signature Sugarcane HydraFacial MD",
      "Recalcitrant Melasma & Q-Switched Laser Toning",
      "Advanced Acne Scar Subcision & MNRF Remodeling",
      "US-FDA Triple-Wavelength Laser Hair Reduction",
      "Holistic Anti-Ageing & Regenerative Exosome Therapies",
    ],
    education: [
      "MBBS — Certified Medical Graduate",
      "DDV — Diploma in Dermatology & Venereology",
      "PG Diploma in Clinical Dermatology — Cardiff University, United Kingdom",
    ],
    memberships: [
      "International Society of Dermatology (ISD)",
      "Cosmetic Dermatology Society of India (CDSI)",
      "Association of Cutaneous Surgeons of India (ACSI)",
    ],
    languages: "English, Hindi",
    consultationTimings: "Mon – Sun: 11:00 AM – 07:00 PM (Noida & Gurgaon by Appointment)",
  },
  "dr-sukriti": {
    highlights: [
      "9+ Years Specialized Experience in Clinical & Laser Dermatology",
      "Board-Certified MD in Dermatology, Venereology & Leprosy",
      "Expert in Indian Fitzpatrick III–V Pigmentary & Scar Protocols",
      "Over 18,000+ Laser & Injectable Procedures Performed",
    ],
    FocusAreas: [
      "Hormonal & Cystic Acne Root-Cause Management",
      "Stubborn Facial Melasma & Post-Inflammatory Hyperpigmentation",
      "Fractional CO2 & MNRF Acne Scar Resurfacing",
      "Autologous GFC & PRP Scalp Hair Regrowth",
      "Chemical Peels & Medical Barrier Restoration",
      "Non-Surgical Skin Tightening (HIFU & Bio-Remodeling)",
    ],
    education: [
      "MBBS — Bachelor of Medicine and Bachelor of Surgery",
      "MD — Dermatology, Venereology & Leprosy",
      "Advanced Fellowship in Medical Lasers & Dermatosurgery",
    ],
    memberships: [
      "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
      "Cosmetic Dermatology Society of India (CDSI)",
    ],
    languages: "English, Hindi",
    consultationTimings: "Mon – Sun: 10:30 AM – 07:30 PM",
  },
  "dr-aanchal-bansal": {
    highlights: [
      "8+ Years Clinical Experience in Medical & Surgical Dermatology",
      "MD Dermatologist Specializing in Acne Scar Revision & Pigmentary Disorders",
      "Precision Dermatosurgery, Subcision & Laser Calibration Specialist",
      "Trusted for Personalized, Evidence-Based Skin Regimens",
    ],
    FocusAreas: [
      "Grade 3 & 4 Acne Scar Revision (Subcision + MNRF)",
      "Recalcitrant Pigmentation, Freckles & Solar Lentigines",
      "Dermatosurgery (Mole, Wart, Cyst & Skin Tag Excision)",
      "Medical-Grade Salicylic, Glycolic & Yellow Peels",
      "Pediatric & Sensitive Skin Clinical Dermatology",
      "Laser Toning & Carbon Porcelain Facials",
    ],
    education: [
      "MBBS — Bachelor of Medicine and Bachelor of Surgery",
      "MD — Dermatology, Venereology & Leprosy",
      "Specialized Training in Dermatosurgery & Aesthetic Lasers",
    ],
    memberships: [
      "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
      "Association of Cutaneous Surgeons of India (ACSI)",
    ],
    languages: "English, Hindi",
    consultationTimings: "Mon – Sat: 10:30 AM – 07:00 PM",
  },
  "dr-neha-dhankar": {
    highlights: [
      "7+ Years Experience in Aesthetic Medicine & Laser Therapies",
      "MD Dermatologist & Fellowship-Trained in Facial Rejuvenation",
      "Specialist in Painless US-FDA Laser Hair Reduction Protocols",
      "Renowned for Gentle, Natural-Looking Aesthetic Enhancements",
    ],
    FocusAreas: [
      "US-FDA Triple-Wavelength Laser Hair Removal",
      "Signature Sugarcane HydraFacial & Korean Glass Glow",
      "Anti-Ageing Collagen Induction & Microneedling",
      "Bridal & Pre-Event Skin Illumination Programs",
      "Custom Organic & Medical Chemical Peels",
      "Under-Eye Dark Circle & Lip Brightening Protocols",
    ],
    education: [
      "MBBS — Bachelor of Medicine and Bachelor of Surgery",
      "MD — Dermatology",
      "Fellowship in Aesthetic Medicine & Medical Lasers",
    ],
    memberships: [
      "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
      "Cosmetic Dermatology Society of India (CDSI)",
    ],
    languages: "English, Hindi",
    consultationTimings: "Mon – Sun: 10:00 AM – 07:00 PM",
  },
  "dr-shradha-gumber": {
    highlights: [
      "6+ Years Experience in Clinical Trichology & Cosmetic Dermatology",
      "MD Dermatologist Dedicated to Non-Surgical Hair Restoration",
      "Digital Trichoscopy & Follicular Regenerative Medicine Specialist",
      "Holistic Internal + Topical Protocols for Chronic Hair Fall",
    ],
    FocusAreas: [
      "Androgenetic Alopecia & Female Pattern Hair Thinning",
      "Growth Factor Concentrate (GFC) & Autologous PRP Therapy",
      "Alopecia Areata, Telogen Effluvium & Post-Partum Hair Loss",
      "Scalp Psoriasis, Seborrheic Dermatitis & Dandruff Cure",
      "Exosome Cellular Scalp & Skin Rejuvenation",
      "Nutritional & Hormonal Root-Cause Diagnostics",
    ],
    education: [
      "MBBS — Bachelor of Medicine and Bachelor of Surgery",
      "MD — Dermatology",
      "Advanced Certification in Clinical Trichology & Regenerative PRP/GFC",
    ],
    memberships: [
      "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
      "Hair Research Society of India (HRSI)",
    ],
    languages: "English, Hindi",
    consultationTimings: "Tue – Sun: 10:30 AM – 07:30 PM",
  },
};

export default async function DoctorProfilePage({ params }: Props) {
  let doctor: any = null;
  let allDoctors: any[] = [];
  try {
    const [resDoc, resAll] = await Promise.all([
      fetch(`${API_BASE}/doctors/${encodeURIComponent(params.slug)}`, { cache: "no-store" }),
      fetch(`${API_BASE}/doctors`, { cache: "no-store" })
    ]);
    if (resDoc.ok) {
      const json = await resDoc.json();
      if (json?.data) doctor = json.data;
    }
    if (resAll.ok) {
      const jsonAll = await resAll.json();
      if (jsonAll?.data) allDoctors = jsonAll.data;
    }
  } catch {}

  if (!doctor) {
    doctor = DOCTORS.find((d) => d.id === params.slug || d.slug === params.slug);
  }

  if (!doctor) {
    notFound();
  }

  const doctorKey = doctor.id || doctor.slug;
  const details =
    DOCTOR_EXTENDED_DETAILS[doctorKey] ||
    DOCTOR_EXTENDED_DETAILS[doctor.slug] ||
    DOCTOR_EXTENDED_DETAILS["dr-sukriti"] || {
      highlights: [
        "10+ Years of Specialized Dermatological Experience",
        "Expert in Advanced Laser & Aesthetic Protocols",
        "Personalized Patient Consultation & Evidence-Based Regimens",
      ],
      FocusAreas: [
        "Clinical Dermatology & Acne Protocols",
        "Laser Aesthetics & Pigmentation Resurfacing",
        "Hair Loss Diagnostics & Scalp Health",
      ],
      education: [
        doctor.qualifications || "MBBS, MD - Dermatology",
        "Specialized Clinical Aesthetics Fellowship",
      ],
      memberships: [
        "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
        "Cosmetic Dermatology Society of India (CDSI)",
      ],
      languages: "English, Hindi",
      consultationTimings: doctor.availability || "Mon – Sat: 10:30 AM – 07:00 PM",
    };

  const pool = allDoctors.length > 0 ? allDoctors : DOCTORS;
  const otherDoctors = pool.filter((d: any) => d.slug !== doctor.slug && d.id !== doctor.id && d.name !== doctor.name);

  return (
    <div className="bg-white">
      {/* Breadcrumb Banner */}
      <PageBreadcrumbBanner
        image="/images/breadcrumbbanner/about-us.webp"
        breadcrumbs={[
          { label: "About Clinic", href: "/about-clinic" },
          { label: doctor.name },
        ]}
        title={doctor.name}
        subtitle={`${doctor.role} • ${doctor.qualifications}`}
      />

      {/* Main Doctor Profile Section */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

            {/* Left Column: Doctor Portrait & Quick Info Card */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 mb-5">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top block"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/85 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                    {doctor.experience || "Senior Dermatologist"}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Medical Specialist
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 font-serif">
                    {doctor.name}
                  </h2>
                  <p className="text-xs font-semibold text-brand-700">
                    {doctor.role}
                  </p>
                  <p className="text-xs text-slate-500">{doctor.qualifications}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                    <span>{details.consultationTimings}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                    <span>Skinfinity Derma — Noida (Sec 36) &amp; Gurgaon (Sec 28)</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href="#doctor-booking-form"
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment with {doctor.name.split(" ")[1] || doctor.name}</span>
                  </a>
                  <a
                    href="tel:+919871941444"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-700" />
                    <span>Direct Clinic Line: +91 98719 41444</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Biography, Qualifications, Specialties & Booking */}
            <div className="lg:col-span-8 space-y-10">

              {/* Clinical Overview */}
              <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                  <Stethoscope className="w-4 h-4" />
                  <span>Clinical Biography &amp; Approach</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 font-serif">
                  About {doctor.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {doctor.bio}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  At Skinfinity Derma, {doctor.name} follows a strict root-cause diagnostic protocol—combining comprehensive clinical evaluation, on-site blood and hormonal profiling with Orange Health Labs, and calibrated US-FDA approved laser and injectable technologies tailored specifically for Indian skin tones.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {details.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-sm text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Clinical Specialties */}
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                    Areas of Expertise
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 font-serif">
                    Specialized Procedures &amp; Conditions Treated
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {details.FocusAreas.map((area, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#e8f6f3] text-[#006d6e] flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Professional Memberships */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-serif">
                      Education &amp; Credentials
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {details.education.map((edu, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-700 mt-1.5 shrink-0" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-serif">
                      Affiliations &amp; Boards
                    </h4>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {details.memberships.map((mem, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{mem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Direct Appointment Booking Form */}
              <div id="doctor-booking-form" className="pt-4">
                <AppointmentForm className="shadow-xl border-brand-100" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Other Senior Doctors */}
      <section className="py-14 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                Meet Our Other Senior Dermatologists
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore profiles of our certified dermatology &amp; trichology specialists.
              </p>
            </div>
            <Link
              href="/about-clinic#doctors"
              className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
            >
              <span>View All Doctors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex lg:grid lg:grid-cols-4 gap-5 lg:gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none scroll-smooth snap-x snap-mandatory">
            {otherDoctors.slice(0, 4).map((doc: any) => (
              <Link
                key={doc.id || doc.slug}
                href={`/doctors/${doc.slug || doc.id}`}
                className="flex-none w-[265px] sm:w-[290px] lg:w-auto snap-start bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100 mb-3.5">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 block"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 font-serif">
                    {doc.name}
                  </h4>
                  <p className="text-[11px] text-brand-700 font-medium mt-0.5">
                    {doc.role}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {doc.qualifications}
                  </p>
                </div>
                <span className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] font-bold text-brand-700 flex items-center justify-between">
                  <span>View Doctor Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
