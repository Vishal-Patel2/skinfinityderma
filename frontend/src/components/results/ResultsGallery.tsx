"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  Award, 
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import PrivacyClinicalImage from "@/components/common/PrivacyClinicalImage";
import { REAL_RESULTS } from "@/data/clinicData";
import { getResults } from "@/lib/api";

interface BeforeAfterItem {
  id: string;
  treatment: string;
  patientName?: string;
  resultsType: string;
  timeframe?: string;
  description: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
}

// Interactive Before / After Dual Image Slider Component
function BeforeAfterCard({ item }: { item: BeforeAfterItem }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    const { left, width } = containerRef.current.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
  }, []);

  const afterSrc = item.afterImage || item.image;
  const beforeSrc = item.beforeImage || item.image;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Before/After Interactive Slider */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-ew-resize select-none"
        onMouseDown={(e) => {
          setDragging(true);
          setSliderPos(getPercent(e.clientX));
        }}
        onMouseMove={(e) => {
          if (dragging) setSliderPos(getPercent(e.clientX));
        }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => setSliderPos(getPercent(e.touches[0].clientX))}
        onTouchMove={(e) => setSliderPos(getPercent(e.touches[0].clientX))}
      >
        {/* AFTER Image: Base full view */}
        <div className="absolute inset-0">
          <PrivacyClinicalImage
            src={afterSrc}
            alt={`After — ${item.treatment}`}
          />
        </div>

        {/* BEFORE Image: Clipped left side */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <PrivacyClinicalImage
            src={beforeSrc}
            alt={`Before — ${item.treatment}`}
          />
        </div>

        {/* Dividing Vertical Line */}
        <div
          className="absolute top-0 bottom-0 w-[2.5px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Circular Drag Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl border-2 border-[#005B41] flex items-center justify-center z-30">
            <ChevronLeft className="w-3.5 h-3.5 text-[#005B41] -mr-0.5" />
            <ChevronRight className="w-3.5 h-3.5 text-[#005B41] -ml-0.5" />
          </div>
        </div>

        {/* BEFORE badge */}
        <div className="absolute top-3 left-3 z-10 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider pointer-events-none shadow-sm">
          Before
        </div>

        {/* AFTER badge */}
        <div className="absolute top-3 right-3 z-10 bg-[#005B41]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider pointer-events-none shadow-sm">
          After
        </div>

        {/* Category tag */}
        <div className="absolute bottom-3 left-3 z-10 bg-black/75 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest pointer-events-none">
          {item.resultsType}
        </div>

        {/* Patient tag */}
        {item.patientName && (
          <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm pointer-events-none flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{item.patientName}</span>
          </div>
        )}

        {/* Drag tooltip on hover */}
        <div className="absolute inset-0 flex items-end justify-center pb-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-lg">
            ← Drag slider to compare →
          </span>
        </div>
      </div>

      {/* Card Content & Clinical Notes */}
      <div className="p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-extrabold text-slate-900 font-serif group-hover:text-[#005B41] transition-colors leading-snug">
              {item.treatment}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          {item.timeframe ? (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#005B41] shrink-0" />
              <span>{item.timeframe}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Case
            </div>
          )}

          <Link
            href="/contact-us#appointment_form"
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#005B41] bg-[#005B41]/10 hover:bg-[#005B41] hover:text-white transition-all shadow-sm"
          >
            <span>Consult Doctor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsGallery({ initialResults }: { initialResults?: BeforeAfterItem[] }) {
  const [results, setResults] = useState<BeforeAfterItem[]>(
    initialResults && initialResults.length > 0 ? initialResults : (REAL_RESULTS as any)
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    getResults().then((data) => {
      if (active && data && Array.isArray(data) && data.length > 0) {
        setResults(data as any);
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Compute Categories Dynamically from Data
  const categories = ["All", ...Array.from(new Set(results.map((r) => r.resultsType).filter(Boolean)))];

  // Filtering by Category & Search query
  const filtered = results.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.resultsType === activeCategory;
    const matchesSearch = !searchQuery.trim() || [
      item.treatment || "",
      item.description || "",
      item.resultsType || "",
      item.patientName || ""
    ].join(" ").toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Filters & Search Control Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by concern, treatment or keyword (e.g. acne, laser, MNRF)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#005B41] focus:ring-2 focus:ring-[#005B41]/10 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Result Count Status */}
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 self-center">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Showing <strong className="text-slate-900">{filtered.length}</strong> authenticated cases</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 me-2 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#005B41] text-white shadow-md shadow-[#005B41]/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Interactive Before/After Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <BeforeAfterCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-800 font-serif">No clinical records found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or switch category filter to view all available transformations.
          </p>
          <button
            type="button"
            onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#005B41] text-white"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Clinical Verification Trust Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-700/60">
          <div className="pt-3 lg:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif">100%</div>
            <div className="text-xs text-slate-300 mt-1">Verified Clinical Cases</div>
          </div>
          <div className="pt-3 lg:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-serif">15+</div>
            <div className="text-xs text-slate-300 mt-1">US-FDA Gold Standard Lasers</div>
          </div>
          <div className="pt-3 lg:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-serif">1,00,000+</div>
            <div className="text-xs text-slate-300 mt-1">Patients Treated in NCR</div>
          </div>
          <div className="pt-3 lg:pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-serif">Zero</div>
            <div className="text-xs text-slate-300 mt-1">Digital Retouching Guarantee</div>
          </div>
        </div>
      </div>
    </div>
  );
}
