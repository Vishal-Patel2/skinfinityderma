"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Clock } from "lucide-react";
import { REAL_RESULTS } from "@/data/clinicData";
import PrivacyClinicalImage from "@/components/common/PrivacyClinicalImage";
import { getResults } from "@/lib/api";

const CATEGORIES = ["All", "Acne & Scars", "Pigmentation", "Facial Aesthetics", "Laser Treatments", "Hair Loss", "Medi-Facial"];
const CARDS_PER_PAGE = 3;

// True Before/After slider with TWO different images
function BeforeAfterCard({ item }: { item: typeof REAL_RESULTS[0] }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    const { left, width } = containerRef.current.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
  }, []);

  const afterSrc = item.image;
  const beforeSrc = (item as any).beforeImage || item.image;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">

      {/* Before/After Slider */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-ew-resize select-none"
        onMouseDown={(e) => { setDragging(true); setSliderPos(getPercent(e.clientX)); }}
        onMouseMove={(e) => { if (dragging) setSliderPos(getPercent(e.clientX)); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => setSliderPos(getPercent(e.touches[0].clientX))}
        onTouchMove={(e) => setSliderPos(getPercent(e.touches[0].clientX))}
      >
        {/* AFTER image — full width base with baked-in privacy eye-blur & watermark */}
        <div className="absolute inset-0">
          <PrivacyClinicalImage
            src={afterSrc}
            alt={`After — ${item.treatment}`}
          />
        </div>

        {/* BEFORE image — clipped to left portion using clip-path */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <PrivacyClinicalImage
            src={beforeSrc}
            alt={`Before — ${item.treatment}`}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Handle knob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border-2 border-brand-200 flex items-center justify-center z-30">
            <ChevronLeft className="w-3 h-3 text-brand-700 -mr-0.5" />
            <ChevronRight className="w-3 h-3 text-brand-700 -ml-0.5" />
          </div>
        </div>

        {/* BEFORE label */}
        <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider pointer-events-none">
          Before
        </div>
        {/* AFTER label */}
        <div className="absolute top-3 right-3 z-10 bg-brand-700/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider pointer-events-none">
          After
        </div>

        {/* Category tag */}
        <div className="absolute bottom-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest pointer-events-none">
          {item.resultsType}
        </div>

        {/* Patient name */}
        {item.patientName && (
          <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-semibold px-2.5 py-1 rounded shadow-sm pointer-events-none">
            Patient: {item.patientName}
          </div>
        )}

        {/* Drag hint */}
        <div className="absolute inset-0 flex items-end justify-center pb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1.5 rounded-full">
            ← Drag to compare →
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-serif leading-snug">
            {item.treatment}
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {(item as any).timeframe && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              {(item as any).timeframe}
            </div>
          )}
          <Link
            href="/contact-us#appointment_form"
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-700 hover:text-white transition-all"
          >
            Consult for Similar Concern
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RealResultsSection({ initialResults }: { initialResults?: any[] }) {
  const [results, setResults] = useState<any[]>(initialResults && initialResults.length > 0 ? initialResults : REAL_RESULTS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getResults().then((data) => {
      if (active && data && Array.isArray(data) && data.length > 0) {
        setResults(data);
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const filtered = activeFilter === "All"
    ? results
    : results.filter(r => r.resultsType === activeFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const visible = filtered.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  useEffect(() => {
    setPage(0);
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeFilter]);

  const scrollMobile = (dir: "left" | "right") => {
    if (!mobileCarouselRef.current) return;
    const step = 300;
    mobileCarouselRef.current.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section id="results" className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Verified Clinical Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Real Results &amp; <span className="text-brand-700">Patient Transformations</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Authentic before-and-after photographic documentation showing actual patient improvements under Dr. Ipshita Johri and our senior dermatology team.
            </p>
          </div>
          <Link href="/results" className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors shrink-0">
            View Complete Results Archive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter tabs + Nav arrows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === cat
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Mobile Carousel Arrows */}
          <div className="flex sm:hidden items-center justify-between w-full pt-1">
            <span className="text-xs font-semibold text-slate-500">
              Swipe or use arrows ({filtered.length} cases)
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollMobile("left")}
                aria-label="Previous result"
                className="w-9 h-9 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </button>
              <button
                type="button"
                onClick={() => scrollMobile("right")}
                aria-label="Next result"
                className="w-9 h-9 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>

          {/* Desktop Pagination Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <span className="text-xs text-slate-500 font-medium w-10 text-center">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="w-9 h-9 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Carousel */}
        <div
          ref={mobileCarouselRef}
          className="flex sm:hidden gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {filtered.map(item => (
            <div key={item.id} className="flex-none w-[290px] snap-start">
              <BeforeAfterCard item={item} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="w-full text-center py-12 text-slate-400 text-sm">
              No results found for this filter.
            </div>
          )}
        </div>

        {/* Desktop Cards grid — 3 per page (100% unchanged) */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map(item => <BeforeAfterCard key={item.id} item={item} />)}
          {visible.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400 text-sm">
              No results found for this filter.
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <p>* Clinical results may vary. Images published with full patient consent.</p>
        </div>

      </div>
    </section>
  );
}
