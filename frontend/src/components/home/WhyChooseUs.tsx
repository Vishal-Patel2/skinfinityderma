"use client";

import React from "react";
import { 
  ShieldCheck, 
  Award, 
  UserCheck, 
  Microscope, 
  HeartHandshake, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import AppointmentForm from "@/components/modals/AppointmentForm";
import { CLINIC_STATS } from "@/data/clinicData";

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "US-FDA Approved Technologies",
      desc: "Patient safety and proven clinical efficacy are paramount. We exclusively invest in authentic, world-class laser and aesthetic devices."
    },
    {
      icon: UserCheck,
      title: "Full-Time MD Dermatologist-Led",
      desc: "Every diagnosis, consultation, and invasive procedure is handled directly by board-certified MD Dermatologists, not unsupervised technicians."
    },
    {
      icon: Award,
      title: "9+ Years of Clinical Excellence",
      desc: "Trusted by over 45,000 satisfied patients across Noida, Gurgaon, Delhi NCR, and international medical travelers."
    },
    {
      icon: Microscope,
      title: "Root-Cause Diagnostics",
      desc: "We analyze hormonal markers, lifestyle triggers, and deep epidermal layers to stop recurring acne, hair fall, and pigmentation permanently."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-900/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Why Choose Us Content */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950 px-3.5 py-1 rounded-full border border-brand-800">
                Pillars of Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-3 font-serif leading-tight">
                Why Patients Choose Our Skin Clinic in Noida & Gurgaon
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                We believe that aesthetic dermatology should be grounded in genuine clinical science, uncompromising ethics, and compassionate individual care.
              </p>
            </div>

            {/* 4 Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div key={idx} className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-brand-700/30 text-brand-400 flex items-center justify-center border border-brand-600/40">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-serif">{p.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick trust metrics */}
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-around gap-4 text-center">
              <div>
                <span className="block text-xl font-bold text-amber-400 font-serif">4.8 ★</span>
                <span className="text-[11px] text-slate-400">Google Rating</span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="block text-xl font-bold text-brand-400 font-serif">3,200+</span>
                <span className="text-[11px] text-slate-400">Verified Reviews</span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="block text-xl font-bold text-white font-serif">100%</span>
                <span className="text-[11px] text-slate-400">Sterile Protocols</span>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Form */}
          <div className="lg:col-span-6">
            <AppointmentForm className="shadow-2xl" />
          </div>

        </div>
      </div>
    </section>
  );
}
