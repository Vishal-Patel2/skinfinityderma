"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Clock,
  ChevronRight
} from "lucide-react";
import { TREATMENTS } from "@/data/clinicData";

export default function ServicesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Skin Treatments", "Laser Treatments", "Hair Treatments", "Medi-Facials & Glow", "Anti-Ageing & Aesthetics"];

  const filteredTreatments = selectedCategory === "All" 
    ? TREATMENTS 
    : TREATMENTS.filter(t => t.category === selectedCategory);

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Evidence-Based Clinical Procedures
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Advanced Skin & Hair Treatments
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              From severe acne and stubborn pigmentation to US-FDA laser hair removal and cellular hair restoration, our board-certified dermatologists provide customized clinical care for every aesthetic concern.
            </p>
          </div>

          <Link
            href="/contact-us#appointment_form"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors shrink-0"
          >
            <span>Consult for Personalized Regimen</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-brand-700 text-white shadow-md shadow-brand-700/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Banner Thumbnail */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={treatment.bannerImage}
                    alt={treatment.name}
                    fill
                    className="object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {treatment.category}
                  </span>

                  {treatment.priceGuide && (
                    <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-amber-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                      {treatment.priceGuide}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-serif">
                    {treatment.name}
                  </h3>
                  
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {treatment.shortDesc}
                  </p>

                  {/* Indications preview */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Key Indications:
                    </span>
                    {treatment.indications.slice(0, 2).map((ind, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                        <span className="line-clamp-1">{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 flex items-center justify-between gap-3">
                <Link
                  href={`/${treatment.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 group-hover:underline"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/contact-us#appointment_form`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 transition-colors shadow-sm"
                >
                  Book Session
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
