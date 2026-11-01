"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Star, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  Award, 
  Sparkles,
  ArrowRight,
  Activity
} from "lucide-react";
import { CLINIC_STATS } from "@/data/clinicData";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/50 via-white to-slate-50/40 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-brand-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft border border-slate-200/80">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">
                {CLINIC_STATS.rating} / 5.0 Rating
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-brand-700">
                {CLINIC_STATS.reviewsCount} Google Reviews
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif leading-[1.15]">
                Best Dermatologist in Noida & Gurgaon
                <span className="block text-gradient-teal mt-1 text-2xl sm:text-3xl lg:text-4xl font-sans font-bold">
                  No. 1 Medical Aesthetics & Laser Clinic
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Led by celebrity dermatologist <strong className="text-slate-900 font-semibold">Dr. Ipshita Johri</strong> and senior MD specialists including <strong className="text-slate-900 font-semibold">Dr. Sukriti</strong>, our clinic provides evidence-based treatments for stubborn acne, US-FDA laser hair removal, hair loss, and anti-aging backed by an integrated pathology lab.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                <span>6 Senior MD Dermatologists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                <span>100% US-FDA Laser Technologies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                <span>In-House Lab & Pharmacy Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                <span>Clinics in Noida (Sec 36) & Gurgaon (Sec 28)</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/contact-us#appointment_form"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md hover:shadow-glow transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation Now
              </Link>
              <Link
                href="/#skin-analyser"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all duration-300"
              >
                <Activity className="w-4 h-4 text-brand-700" />
                Take Free Skin Health Test
              </Link>
            </div>

            {/* Quick Metrics Counters Bar */}
            <div className="pt-6 border-t border-slate-200/60 grid grid-cols-4 gap-3 text-center sm:text-left">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-900 font-serif">10+</span>
                <span className="text-[11px] text-slate-500 font-medium">Years Excellence</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-brand-700 font-serif">1 Lakh+</span>
                <span className="text-[11px] text-slate-500 font-medium">Happy Patients</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-amber-600 font-serif">3,200+</span>
                <span className="text-[11px] text-slate-500 font-medium">Verified Reviews</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-900 font-serif">100%</span>
                <span className="text-[11px] text-slate-500 font-medium">US-FDA Devices</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Floating Trust Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Banner Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/11] bg-slate-100">
                <Image
                  src="/images/hero/hero-banner.webp"
                  alt="Skinfinity Derma — Best Skin Specialist & Dermatologist in Noida and Gurgaon"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                {/* Floating caption on image */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 rounded-xl backdrop-blur-md bg-slate-900/70 border border-white/20">
                  <p className="text-xs font-bold">Skinfinity Derma Clinics</p>
                  <p className="text-[11px] text-slate-200">Dr. Ipshita Johri & Senior Dermatology Board</p>
                </div>
              </div>

              {/* Floating Doctor Badge */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 max-w-[240px]">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-brand-200">
                  <img
                    src="/images/doctors/dr-ipshita-johri.webp"
                    alt="Dr. Ipshita Johri"
                    className="w-full h-full object-cover block"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">Dr. Ipshita Johri</h4>
                  <p className="text-[10px] text-brand-700 font-medium">Founder & Director</p>
                  <p className="text-[9px] text-slate-500">Cardiff Univ, U.K.</p>
                </div>
              </div>

              {/* Floating Review Badge */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">3,200+ Verified</div>
                  <div className="text-[10px] text-slate-500">4.8★ Google Patient Reviews</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
