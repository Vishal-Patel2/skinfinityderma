"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";
import { GalleryItem } from "@/types/gallery.types";
import { useAuth } from "@/context/AuthContext";

interface GalleryLightboxProps {
  items: GalleryItem[];
  /** Index of the open item, or null when the lightbox is closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/**
 * Reusable Fancybox-style lightbox used by the Gallery page and the
 * About Clinic "Machines, Labs & Clinic" explorer.
 * Supports keyboard (← → Esc), touch swipe, thumbnails and body scroll lock.
 */
export default function GalleryLightbox({ items, index, onIndexChange, onClose }: GalleryLightboxProps) {
  const { openAppointmentModal } = useAuth();
  const touchStartX = useRef<number | null>(null);
  const total = items.length;

  const handleNext = useCallback(() => {
    if (index === null || total === 0) return;
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  const handlePrev = useCallback(() => {
    if (index === null || total === 0) return;
    onIndexChange(index === 0 ? total - 1 : index - 1);
  }, [index, total, onIndexChange]);

  useEffect(() => {
    if (index === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, handleNext, handlePrev, onClose]);

  const active = index !== null ? items[index] : null;
  if (!active || index === null) return null;

  const bookFacility = () => {
    onClose();
    openAppointmentModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) {
          if (delta < 0) handleNext();
          else handlePrev();
        }
        touchStartX.current = null;
      }}
    >
      {/* Top Controls Toolbar */}
      <div
        className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-teal-300 border border-white/20">
            {index + 1} of {total}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            {active.location || "Skinfinity Derma Clinic"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={bookFacility}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#008081] hover:bg-teal-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book This Facility</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#008081] text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-2xl"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#008081] text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-2xl"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Stage */}
      <div
        className="relative w-full max-w-5xl h-[80vh] flex flex-col justify-center items-center px-4 sm:px-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full flex-1 max-h-[62vh] rounded-2xl overflow-hidden bg-black/40 shadow-2xl border border-white/10">
          <Image src={active.image} alt={active.altText || active.title} fill sizes="100vw" className="object-contain" priority />
        </div>

        <div className="w-full mt-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700/80 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  {active.badge || active.category}
                </span>
                <span className="text-xs text-slate-400">{active.location || "Noida & Gurgaon"}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-serif text-white">{active.title}</h2>
              {active.description && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{active.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={bookFacility}
              className="sm:hidden w-full py-2.5 px-4 rounded-xl bg-[#008081] text-white text-xs font-bold uppercase tracking-wider text-center"
            >
              Book Consultation
            </button>
          </div>
        </div>

        {total > 1 && (
          <div className="w-full flex items-center justify-center gap-2 mt-3 overflow-x-auto py-1 max-w-full">
            {items.slice(0, 12).map((thumb, idx) => (
              <button
                type="button"
                key={`${thumb.id}-${idx}`}
                onClick={() => onIndexChange(idx)}
                aria-label={`View ${thumb.title}`}
                className={`relative w-12 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  index === idx
                    ? "border-teal-400 scale-105 shadow-md shadow-teal-500/50"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={thumb.image} alt={thumb.title} fill className="object-cover" sizes="48px" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
