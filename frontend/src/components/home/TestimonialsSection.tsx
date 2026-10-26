"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Star, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS, CLINIC_STATS } from "@/data/clinicData";

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -310, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 310, behavior: "smooth" });

  return (
    <section className="py-16 lg:py-24 bg-slate-50/70 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:items-center md:text-center max-w-3xl md:mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft border border-slate-200 mb-3 w-fit">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-800">
              {CLINIC_STATS.rating} / 5.0 Rating ({CLINIC_STATS.reviewsCount} Google Reviews)
            </span>
          </div>

          <div className="flex items-end justify-between w-full md:justify-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif">
                Patient Stories &amp; Google Reviews
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Read authentic feedback from patients who entrusted their skin, hair, and aesthetic transformations to Skinfinity Derma clinics.
              </p>
            </div>

            {/* Mobile Carousel Controls */}
            <div className="flex md:hidden items-center gap-2 shrink-0 ml-3">
              <button
                onClick={scrollLeft}
                aria-label="Previous testimonial"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Next testimonial"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel on Mobile / 2-Col Grid on Desktop */}
        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-2 gap-5 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="flex-none w-[300px] sm:w-[340px] md:w-auto snap-start bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                    {t.clinicLocation}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.reviewText}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">{t.patientName}</h4>
                  <p className="text-[11px] text-slate-500">{t.treatment}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Patient</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 md:mt-12 text-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md"
          >
            <span>Explore All 4,500+ Patient Reviews &amp; Testimonials</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

      </div>
    </section>
  );
}
