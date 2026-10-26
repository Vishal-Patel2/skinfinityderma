import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Calendar, 
  ArrowRight, 
  ChevronRight,
  FlaskConical,
  Pill,
  Building2,
  Trophy
} from "lucide-react";
import { DOCTORS, CLINIC_STATS, ASSOCIATED_PARTNERS } from "@/data/clinicData";
import BrandJourneyRoadmap from "@/components/about/BrandJourneyRoadmap";
import DedicatedDoctorsCarousel from "@/components/about/DedicatedDoctorsCarousel";
import AppointmentForm from "@/components/modals/AppointmentForm";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";

export const metadata: Metadata = {
  title: "About Dr. Ipshita Johri & Senior Dermatologists | Skinfinity Derma",
  description: "Meet Dr. Ipshita Johri, Dr. Sukriti, and the senior MD dermatologists at Skinfinity Derma. Learn about our 10-year journey, integrated diagnostic lab with Orange Health, and clinical awards.",
  alternates: {
    canonical: "/about-us",
  },
};

export default function AboutUsPage() {
  const founder = DOCTORS[0]; // Dr. Ipshita Johri
  const doctors = DOCTORS;

  const awards = [
    { title: "Ms. India Curvy 2020 Runner Up", body: "Dr. Ipshita Johri recognized nationally for championing body positivity and inclusive clinical aesthetics." },
    { title: "Best Aesthetic Dermatology Clinic — Delhi NCR", body: "Awarded for highest clinical satisfaction, zero-contamination protocols, and advanced laser standards." },
    { title: "Excellence in Medical Trichology & Hair Rejuvenation", body: "Recognized for pioneering autologous Growth Factor Concentrate (GFC) cellular scalp protocols." },
    { title: "Pioneer of Sugarcane HydraFacial in North India", body: "Honored for introducing natural sugarcane glycolic vortex infusion technology." }
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumb Banner */}
      <PageBreadcrumbBanner
        image="/images/breadcrumbbanner/about-us.webp"
        breadcrumbs={[{ label: "About Dr. Ipshita Johri" }]}
        badge="Founder & Medical Director"
        title="About Dr. Ipshita Johri"
        highlight="& Senior Dermatologists"
        subtitle="Meet our Cardiff UK-trained founder and board-certified MD dermatologists dedicated to root-cause clinical dermatology and natural aesthetic artistry."
      />

      {/* Hero Section */}
      <section className="py-14 lg:py-20 bg-gradient-to-b from-brand-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] bg-slate-100">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-slate-900/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-amber-400/30">
                      Founder & Chief Dermatologist
                    </span>
                    <h1 className="text-2xl font-bold font-serif mt-1.5">{founder.name}</h1>
                    <p className="text-xs text-slate-300">{founder.qualifications}</p>
                  </div>
                </div>

                {/* Pageant Floating Card */}
                <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3 max-w-[260px]">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-amber-300">
                    <Image
                      src="/images/doctors/dr-ipshita-miss-curvy.jpg"
                      alt="Ms. India Curvy 2020 Runner Up"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Ms. India Curvy 2020</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium">Runner Up & Pageant Mentor</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography & Story */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                  Founder & Medical Director
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-serif leading-tight">
                  Dr. Ipshita Johri
                  <span className="block text-gradient-teal text-xl sm:text-2xl font-sans font-bold mt-1">
                    Celebrity Dermatologist & Anti-Ageing Expert in Noida & Delhi NCR
                  </span>
                </h2>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 text-xs sm:text-sm text-brand-900 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-brand-700 shrink-0" />
                <div>
                  <span className="font-bold block">MBBS, DDV | PG Dip. Clinical Dermatology (Cardiff University, U.K.)</span>
                  <span className="text-slate-600 text-xs">Over 12 years of specialized clinical excellence in cosmetic dermatology & facial rejuvenation</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Dr. Ipshita Johri is the visionary Founder and Medical Director of Skinfinity Derma clinics in Noida and Gurgaon. Having completed her advanced post-graduate clinical dermatology training from the renowned Cardiff University, United Kingdom, she is recognized as one of Delhi NCR’s foremost authorities in non-surgical facial sculpting, anti-aging therapies, and recalcitrant pigmentary disorders.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Her clinical journey is rooted in the belief that healthy skin is the ultimate reflection of internal balance and self-worth. Dr. Johri was also crowned <strong className="text-slate-800 font-semibold">Ms. India Curvy 2020 Runner Up</strong>, actively championing body positivity, inclusive aesthetics, and self-confidence across national platforms.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>Cardiff University UK Credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>4,500+ Verified Patient Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>In-House Pharmacy & Orange Health Lab</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>Over 1,00,000+ Treated Patients</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/contact-us#appointment_form"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md hover:shadow-glow transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation with Dr. Ipshita</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Journey – Interactive S-Curve Roadmap */}
      <BrandJourneyRoadmap />

      {/* Awards & Recognitions */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              Honors & Accolades
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
              Awards & National Recognitions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 font-serif">{award.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{award.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Lab & Pharmacy Spotlight */}
      <section className="py-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950 px-3.5 py-1 rounded-full border border-brand-800">
                In-House Facilities
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif">
                Integrated Diagnostic Lab & In-House Pharmacy
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We believe that dermatological healing requires deep internal diagnostics. Our strategic clinical partnership with <strong className="text-white">Orange Health Labs</strong> enables seamless on-site collection for hormonal, metabolic, and vitamin panels.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <FlaskConical className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>On-Site Pathology with Orange Health:</strong> Thyroid, PCOS, Vitamin D, Ferritin & hormone tests processed rapidly.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Pill className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>In-House Dermatological Pharmacy:</strong> 100% genuine medical-grade actives, sunscreens, and aftercare ointments.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-800/80 p-8 rounded-3xl border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-white font-serif">Our Associated Diagnostic & Technology Partners</h3>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {ASSOCIATED_PARTNERS.map((p, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/80">
                    <span className="text-[10px] text-amber-400 font-bold block">{p.badge}</span>
                    <h5 className="text-xs font-bold text-white mt-0.5">{p.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-1">{p.type}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Complete Doctor Team Carousel featuring Dr. Ipshita, Dr. Sukriti & Senior Dermatologists */}
      <DedicatedDoctorsCarousel />

      {/* Appointment CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}
