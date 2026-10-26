"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, FlaskConical, Pill, Activity } from "lucide-react";

export default function AboutClinicSection() {
  const clinicImages = [
    { src: "/images/clinic/interior-1.jpg", title: "Modern Treatment Suites", desc: "Private, hygienic procedure rooms with US-FDA laser systems." },
    { src: "/images/clinic/interior-2.jpg", title: "Doctor Consultation Chambers", desc: "Confidential diagnostic rooms with digital skin analysis." },
    { src: "/images/clinic/interior-3.jpg", title: "Reception & Patient Lounge", desc: "Warm, welcoming, and relaxed reception lounge." },
    { src: "/images/clinic/interior-4.jpg", title: "Laser Hair Reduction Operatory", desc: "Dedicated triple-wavelength laser reduction workstations." },
    { src: "/images/clinic/interior-5.jpg", title: "HydraFacial Suite", desc: "Signature Sugarcane HydraFacial and glow infusion stations." },
    { src: "/images/clinic/interior-6.jpg", title: "Trichology & Hair Restoration Bay", desc: "Centrifugation and sterile GFC/PRP preparation units." },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Complete Medical Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              About Dermatology Clinic & Integrated Diagnostic Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
              Skinfinity Derma is committed to providing comprehensive dermatology and aesthetic solutions for healthy skin, hair, and nails. Our clinics feature an <strong className="text-slate-900">in-house dermatological pharmacy</strong> and on-site <strong className="text-slate-900">diagnostic sample collection partnered with Orange Health Labs</strong> for rapid, accurate blood work.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <Link
              href="/about-clinic"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              <span>Explore Full Clinic Facilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Interior Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicImages.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] bg-slate-100 flex flex-col justify-end p-5"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              <div className="relative z-10 text-white">
                <h4 className="text-sm font-bold font-serif">{item.title}</h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Strip Highlighting Lab & Pharmacy */}
        <div className="mt-10 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Orange Health Lab Partner</span>
              <span className="text-slate-500">On-site hormone & blood diagnostics</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">In-House Pharmacy</span>
              <span className="text-slate-500">Authentic dermatological formulations</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Hospital-Grade Sterilization</span>
              <span className="text-slate-500">Autoclaved surgical-grade suites</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Full MD Dermatologist Presence</span>
              <span className="text-slate-500">Every treatment supervised by experts</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
