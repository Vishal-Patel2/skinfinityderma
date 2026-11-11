"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Cpu,
  FlaskConical,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Calendar,
  Eye,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { GalleryItem } from "@/types/gallery.types";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import { useAuth } from "@/context/AuthContext";
import SectionDivider from "@/components/common/SectionDivider";

interface GalleryViewProps {
  initialItems: GalleryItem[];
}

export default function GalleryView({ initialItems }: GalleryViewProps) {
  const { openAppointmentModal } = useAuth();
  const [items] = useState<GalleryItem[]>(initialItems);

  // Active Category & Location Filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");

  // Fancybox / Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchLoc =
        selectedLocation === "All" ||
        !item.location ||
        item.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        item.location.toLowerCase().includes("both");

      return matchCat && matchLoc;
    });
  }, [items, selectedCategory, selectedLocation]);

  return (
    <div className="bg-white min-h-screen">
      {/* ── 1. HERO & CLINICAL INFRASTRUCTURE EXPLORER HEADER ── */}
      <section className="relative pt-12 pb-10 lg:pt-16 lg:pb-14 bg-gradient-to-b from-[#f2f8f7] via-white to-white overflow-hidden">
        {/* Subtle decorative glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-50/50 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigator */}
          <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 mb-6 gap-2">
            <Link href="/" className="hover:text-[#008081] transition-colors">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/about-clinic" className="hover:text-[#008081] transition-colors">
              About Clinic
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Clinical Gallery</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
            <div className="max-w-3xl">
              {/* Category Pill Tag matching screenshot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8f6f3] border border-[#cbebe4] text-[#008081] text-xs font-extrabold uppercase tracking-widest mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>Clinical Infrastructure Explorer</span>
              </div>

              {/* Title matching screenshot */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif leading-tight">
                Explore Our <span className="text-[#008081]">Machines, Labs &amp; Clinic</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                Take a high-definition visual tour of our US-FDA approved laser technologies, on-site pathology &amp; GFC cellular laboratories, and luxury surgical procedure suites across Noida Flagship &amp; Gurgaon Center.
              </p>
            </div>

            {/* Primary Category Switcher Buttons (matching screenshot) */}
            <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === "All"
                    ? "bg-[#008081] text-white shadow-md shadow-[#008081]/30"
                    : "text-slate-700 hover:text-[#008081] hover:bg-white/80"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>All ({items.length})</span>
              </button>

              <button
                onClick={() => setSelectedCategory("Machines")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === "Machines"
                    ? "bg-[#008081] text-white shadow-md shadow-[#008081]/30"
                    : "text-slate-700 hover:text-[#008081] hover:bg-white/80"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Machines</span>
              </button>

              <button
                onClick={() => setSelectedCategory("Labs")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === "Labs"
                    ? "bg-[#008081] text-white shadow-md shadow-[#008081]/30"
                    : "text-slate-700 hover:text-[#008081] hover:bg-white/80"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Labs</span>
              </button>

              <button
                onClick={() => setSelectedCategory("Clinic")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === "Clinic"
                    ? "bg-[#008081] text-white shadow-md shadow-[#008081]/30"
                    : "text-slate-700 hover:text-[#008081] hover:bg-white/80"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Clinic</span>
              </button>
            </div>
          </div>

          {/* Secondary Sub-Filter: Clinic Location Pills */}
          <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-[#008081]" />
              <span>Filter by Facility:</span>
              <div className="inline-flex gap-1.5 ml-1">
                {["All", "Gurgaon", "Noida"].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      selectedLocation === loc
                        ? "bg-[#008081] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {loc === "All" ? "Both Centers" : `${loc} Clinic`}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Showing <strong className="text-slate-900 font-bold">{filteredItems.length}</strong> medical photographs
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. HIGH-DEFINITION GALLERY GRID (MATCHING SCREENSHOT LAYOUT) ── */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 font-serif">No Photos in This Filter</h3>
              <p className="text-xs text-slate-500 mt-1">Try switching to &quot;Both Centers&quot; or &quot;All&quot; categories.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedLocation("All");
                }}
                className="mt-4 px-4 py-2 bg-[#008081] text-white rounded-full text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-3xl overflow-hidden bg-slate-950 aspect-[16/11] sm:aspect-[4/3] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-200/80 hover:border-[#008081]"
                >
                  {/* Photo with smooth zoom on hover */}
                  <Image
                    src={item.image}
                    alt={item.altText || item.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-108 group-hover:brightness-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading={index < 6 ? "eager" : "lazy"}
                  />

                  {/* Dark Vignette / Gradient Overlay matching screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Top Tags Bar */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    {/* Badge Pill matching screenshot */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-white/95 text-slate-800 backdrop-blur-md shadow-sm border border-white/60 truncate max-w-[200px]">
                      {item.badge || item.category}
                    </span>

                    {/* Location Badge */}
                    {item.location && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-md border border-white/20 shrink-0">
                        <MapPin className="w-3 h-3 text-teal-300" />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Hover Inspect Icon (Center) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-[#008081] flex items-center justify-center shadow-xl border border-white transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Bottom Text Content matching screenshot */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 pointer-events-none">
                    <h3 className="text-base sm:text-lg font-bold text-white font-serif leading-snug drop-shadow-sm group-hover:text-teal-200 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2 drop-shadow-xs">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. FANCYBOX / LIGHTBOX MODAL POPUP ── */}
      <GalleryLightbox
        items={filteredItems}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      {/* ── 4. REUSABLE SECTION DIVIDER ── */}
      <SectionDivider />

      {/* ── 5. CONSULTATION APPOINTMENT BANNER ── */}
      <section className="py-12 lg:py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-300 bg-teal-950 border border-teal-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>US-FDA Approved Infrastructure</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif">
            Experience International-Standard Clinical Care
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every procedure at Skinfinity Derma is performed or supervised directly by certified MD dermatologists inside sterile, luxury procedure chambers.
          </p>
          <div className="pt-2">
            <button
              onClick={openAppointmentModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#008081] via-[#029697] to-[#046c6d] hover:from-[#006d6e] hover:to-[#008081] shadow-lg shadow-[#008081]/40 border border-emerald-300/40 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Priority Consultation in Noida or Gurgaon</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
