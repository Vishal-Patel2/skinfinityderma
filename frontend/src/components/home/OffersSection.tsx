"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Tag, Sparkles } from "lucide-react";
import { SPECIAL_OFFERS } from "@/data/clinicData";
import { getOffers } from "@/lib/api";

const CATEGORIES = ["All", "Skin", "Hair", "Laser", "Body", "Bridal"];

// Map offer id → category tag
const OFFER_CATEGORY: Record<string, string> = {
  "offer-1": "Skin",
  "offer-2": "Bridal",
  "offer-3": "Laser",
  "offer-4": "Body",
  "offer-5": "Hair",
};

export default function OffersSection({ initialOffers }: { initialOffers?: any[] }) {
  const [offers, setOffers] = useState<any[]>(initialOffers && initialOffers.length > 0 ? initialOffers : SPECIAL_OFFERS);
  const [activeCategory, setActiveCategory] = useState("All");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let active = true;
    getOffers().then((data) => {
      if (active && data && Array.isArray(data) && data.length > 0) {
        setOffers(data);
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filtered = activeCategory === "All"
    ? offers
    : offers.filter((o) => (o.category || OFFER_CATEGORY[o.id] || "All") === activeCategory);

  // Auto-scroll left → right, wrap on end
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [isPaused, filtered.length]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });

  return (
    <section className="py-10 lg:py-14 bg-gradient-to-b from-white via-slate-50/60 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row — title left, arrows right (same as SKU section) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Period Specials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif">
              Best Offers this Month
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Take advantage of our exclusive seasonal packages for bridal skin preparation, laser hair reduction, and cellular hair regrowth.
            </p>
          </div>

          {/* Left / Right arrow controls — top right */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700 shadow-sm flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700 shadow-sm flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Auto-scrolling horizontal carousel track */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {filtered.map((offer) => (
            <div
              key={offer.id}
              className="flex-none w-[300px] sm:w-[330px] md:w-[350px] snap-start bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                  {/* Badge top-left */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-slate-100">
                    <Tag className="w-3 h-3 text-amber-600" />
                    <span className="text-[10px] font-bold text-slate-800">{offer.badge}</span>
                  </div>

                  {/* Category tag top-right */}
                  <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                    {OFFER_CATEGORY[offer.id] ?? "Offer"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-serif line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {offer.desc}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href="/contact-us#appointment_form"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{offer.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
