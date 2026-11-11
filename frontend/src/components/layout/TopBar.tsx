"use client";

import React from "react";
import { Phone, Clock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TopBar() {
  const { adminSettings } = useAuth();

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800">
      <div className="max-w-[1536px] mx-auto px-1 sm:px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-1 md:gap-2">
        {/* Trust Information */}
        <div className="flex items-center gap-3 sm:gap-4 justify-center w-full md:w-auto">
          {/* Mobile: Compact single-line shortened text without awkward wrapping */}
          <span className="md:hidden inline-flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>10+ Years • 1L+ Patients • 4.5K+ Reviews (4.5★)</span>
          </span>

          {/* Desktop: Full text */}
          <span className="hidden md:inline-flex items-center gap-1.5 text-amber-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            10+ Years • 1 Lakh+ Patients • {adminSettings?.googleReviewsCount || "4,500+"} Verified Reviews ({adminSettings?.googleRating || "4.5"} ★)
          </span>
          <span className="hidden lg:inline-block text-slate-600">•</span>
          <span className="hidden lg:inline-flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            Mon - Sun: 10:00 AM – 08:00 PM
          </span>
        </div>

        {/* Quick Contact Numbers - Compact on mobile, single line */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-300 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10px] sm:text-xs">Noida:</span>
            <a
              href="tel:+919871941444"
              className="text-white hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <Phone className="w-2.5 h-2.5 text-teal-400 shrink-0" />
              <span>+91 98719 41444</span>
            </a>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10px] sm:text-xs">Gurgaon:</span>
            <a
              href="tel:+918591110110"
              className="text-white hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <Phone className="w-2.5 h-2.5 text-teal-400 shrink-0" />
              <span>+91 85911 10110</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
