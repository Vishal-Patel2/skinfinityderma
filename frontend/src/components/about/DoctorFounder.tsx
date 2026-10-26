"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DOCTORS } from "@/data/clinicData";
import { useAuth } from "@/context/AuthContext";

export default function DoctorFounder() {
  const { openAppointmentModal } = useAuth();
  const founder = DOCTORS[0]; // Dr. Ipshita Johri
  const teamDoctors = DOCTORS.map((doc) =>
    doc.id === "dr-ipshita-johri"
      ? { ...doc, image: "/images/doctors/dr-ipshita-johri.webp" }
      : doc
  );

  const doctorScrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide on desktop and mobile carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const el = doctorScrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollLeft = () => {
    doctorScrollRef.current?.scrollBy({ left: -310, behavior: "smooth" });
  };

  const scrollRight = () => {
    doctorScrollRef.current?.scrollBy({ left: 310, behavior: "smooth" });
  };

  return (
    <section className="py-10 lg:py-14 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Founder Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-10">

          {/* Visual Col with Founder Portrait and Miss Curvy Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">

              {/* Founder Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[3/4] bg-slate-100">
                <Image
                  src={founder.image}
                  alt="Dr. Ipshita Johri - Founder & Celebrity Dermatologist"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-slate-900/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-amber-400/30">
                    Founder &amp; Medical Director
                  </span>
                  <h3 className="text-xl font-bold font-serif mt-1.5">{founder.name}</h3>
                  <p className="text-xs text-slate-300 font-sans">{founder.qualifications}</p>
                </div>
              </div>

              {/* Miss India Curvy 2020 Runner Up Floating Badge */}
              <div className="absolute -bottom-6 right-2 sm:-right-6 bg-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 max-w-[235px] sm:max-w-[250px]">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-amber-300">
                  <Image
                    src="/images/doctors/dr-ipshita-miss-curvy.jpg"
                    alt="Dr. Ipshita Johri Ms. India Curvy 2020 Runner Up"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                    <Award className="w-3.5 h-3.5" />
                    <span>Ms. India Curvy 2020</span>
                  </div>
                  <p className="text-[10px] text-slate-700 font-semibold">Runner Up &amp; Pageant Icon</p>
                  <p className="text-[9px] text-slate-500">Empowering Body Positivity</p>
                </div>
              </div>

            </div>
          </div>

          {/* Text & Credentials Col */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Medical Expertise &amp; Leadership
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2 font-serif leading-tight">
                Dr. Ipshita Johri
                <span className="block text-gradient-teal text-xl sm:text-2xl font-sans font-bold mt-1">
                  Founder, Celebrity Dermatologist &amp; Anti-Ageing Expert
                </span>
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 text-xs sm:text-sm text-brand-900 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-brand-700 shrink-0" />
              <div>
                <span className="font-bold block">MBBS, DDV | PG Dip. Clinical Dermatology (Cardiff University, U.K.)</span>
                <span className="text-slate-600 text-xs">Over 12 years of specialized aesthetic clinical experience in Delhi NCR</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Dr. Ipshita Johri is the visionary founder and medical director of Skinfinity Derma clinics in Noida and Gurgaon. Widely recognized as one of Delhi NCR’s premier dermatologists, she combines rigorous clinical training from Cardiff University, UK with an artistic eye for natural facial aesthetics.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Her signature medical philosophy rests on four core pillars: <strong className="text-slate-800 font-semibold">Accurate Diagnosis</strong>, <strong className="text-slate-800 font-semibold">Root-Cause Eradication</strong>, <strong className="text-slate-800 font-semibold">Prevention of Recurrence</strong>, and <strong className="text-slate-800 font-semibold">Empowered Patient Education</strong>. Under her leadership, Skinfinity Derma has treated over 1,00,000 satisfied patients across India and internationally.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                <span>Pioneer of Sugarcane HydraFacial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                <span>Advanced Laser Hair Reduction Specialist</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                <span>Non-Surgical Facial Contouring &amp; Botox</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                <span>Evidence-Based Acne &amp; Scar Protocols</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md hover:shadow-glow transition-all"
              >
                <span>Read Full Biography &amp; Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => openAppointmentModal("General Dermatologist Consultation")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-brand-700 transition-colors cursor-pointer"
              >
                <span>Consult with Dr. Ipshita</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Clinical Team Section with Mobile Carousel + Desktop 4-Column Grid */}
        <div className="pt-4">
          {/* Divider */}
          <div className="w-full flex items-center justify-center py-3 mb-4">
            <Image
              src="/images/custom/section-divider.webp"
              alt="section divider"
              width={320}
              height={34}
              className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain opacity-90 select-none pointer-events-none"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Expertise You Can Trust
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
                Senior Consultant Dermatologists &amp; Specialists
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl">
                Every procedure at Skinfinity Derma is performed or supervised directly by certified MD dermatologists.
              </p>
            </div>

            {/* Left/Right Carousel Buttons (Desktop & Mobile) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={scrollLeft}
                aria-label="Previous doctor"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Next doctor"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Carousel (Desktop & Mobile) */}
          <div
            ref={doctorScrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="flex gap-6 overflow-x-auto pb-5 scrollbar-none scroll-smooth snap-x snap-mandatory"
          >
            {teamDoctors.map((doc) => (
              <div
                key={doc.id}
                className="flex-none w-[275px] sm:w-[290px] lg:w-[calc(25%-18px)] snap-start bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <Link href={`/doctors/${doc.id}`} className="block relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 mb-4">
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
                  <p className="text-xs text-brand-700 font-semibold mt-1">{doc.role}</p>
                  <p className="text-xs text-slate-500 mt-1">{doc.qualifications}</p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">{doc.bio}</p>
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

      </div>
    </section>
  );
}
