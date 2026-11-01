"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, MapPin, CheckCircle2 } from "lucide-react";
import { getHomepageData } from "@/lib/api";

export default function AssociatedPartners() {
  const [banner, setBanner] = useState({
    title: "Most Trusted Aesthetic Brands of Delhi-NCR",
    subtitle: "Explore Franchise Opportunities",
    badgeText: "Now Expanding Pan India",
    buttonText: "Now Expanding Pan India",
    buttonUrl: "/franchise",
    mediaUrl: "/images/custom/clinic-reception.jpg",
  });

  useEffect(() => {
    let active = true;
    getHomepageData().then((hp) => {
      if (!active) return;
      const f = hp?.franchiseBanner || hp?.sections?.franchise_banner;
      if (f) {
        setBanner((prev) => ({
          ...prev,
          title: f.title || prev.title,
          subtitle: f.subtitle || prev.subtitle,
          badgeText: f.badgeText || prev.badgeText,
          buttonText: f.buttonText || prev.buttonText,
          buttonUrl: f.buttonUrl || prev.buttonUrl,
          mediaUrl: f.mediaUrl || prev.mediaUrl,
        }));
      }
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-8 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={banner.buttonUrl || "/franchise"}
          className="group relative block w-full rounded-3xl overflow-hidden border border-teal-200/80 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#f4fbf9] via-white to-[#e6f6f4]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[320px] lg:min-h-[380px] items-stretch">

            {/* Left Content Area */}
            <div className="lg:col-span-6 relative z-20 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
              {/* Subtle radial glow */}
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-900/5 border border-teal-700/20 text-brand-800 text-[11px] font-bold uppercase tracking-widest w-fit mb-4">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{banner.badgeText || "Now Expanding Pan India"}</span>
              </div>

              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-[#1e266d] mb-1.5">
                Join One Of The
              </p>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black leading-[1.15] tracking-tight uppercase">
                <span className="bg-gradient-to-r from-[#4eb86b] via-[#189b9c] to-[#0882b8] bg-clip-text text-transparent">
                  Most Trusted Aesthetic Brands
                </span>{" "}
                <span className="text-[#167c8a] normal-case font-extrabold">
                  of Delhi-NCR
                </span>
              </h2>

              <p className="text-base sm:text-lg font-extrabold text-[#1e266d] mt-2.5 tracking-tight">
                {banner.subtitle || "Explore Franchise Opportunities"}
              </p>

              {/* Location & Action Pills */}
              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#57c278] via-[#22a699] to-[#0284c7] text-white text-xs sm:text-sm font-extrabold tracking-wide shadow-md">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Delhi &bull; Noida &bull; Gurugram</span>
                </div>

                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e266d] group-hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all">
                  <span>{banner.buttonText || "Now Expanding Pan India"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

              {/* Quick Franchise Highlights */}
              <div className="mt-6 pt-4 border-t border-teal-900/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Turnkey Clinic Setup
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  US-FDA Laser Suite
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  High ROI Models
                </span>
              </div>
            </div>

            {/* Right Visual Showcase: Clinic Reception + Doctor Procedure Cameo */}
            <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-full overflow-hidden">
              {/* Background: Authentic Skinfinity Derma Reception Lounge */}
              <Image
                src={banner.mediaUrl || "/images/custom/clinic-reception.jpg"}
                alt="Skinfinity Derma Luxury Clinic Reception"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark/warm vignette for contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f4fbf9] via-[#f4fbf9]/40 to-transparent lg:via-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/15" />

              {/* Decorative Curved Wave Ribbon on Desktop */}
              <svg
                viewBox="0 0 120 400"
                preserveAspectRatio="none"
                className="hidden lg:block absolute top-0 bottom-0 -left-1 h-full w-28 z-10 pointer-events-none"
              >
                <path
                  d="M0,0 L45,0 C95,120 95,280 45,400 L0,400 Z"
                  fill="#ffffff"
                  fillOpacity="0.92"
                />
                <path
                  d="M42,0 C92,120 92,280 42,400"
                  fill="none"
                  stroke="url(#franchiseWaveGrad)"
                  strokeWidth="6"
                />
                <defs>
                  <linearGradient id="franchiseWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#57c278" />
                    <stop offset="50%" stopColor="#189b9c" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Foreground Clinical Procedure Cameo Card */}
              <div className="absolute bottom-4 left-4 sm:left-8 lg:left-6 z-20 flex items-center gap-3 bg-white/95 backdrop-blur-md p-2.5 pr-4 rounded-2xl shadow-xl border border-teal-100 max-w-[270px]">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-teal-500">
                  <Image
                    src="/images/treatments/banner-hydrafacial.webp"
                    alt="Doctor Aesthetic Procedure"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 block">
                    Proven Clinical Model
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    1,00,000+ Happy Patients
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    FOFO &amp; Master Franchise Open
                  </p>
                </div>
              </div>

              {/* Top-Right Glass Badge on Clinic Image */}
              <div className="absolute top-4 right-4 z-20 bg-slate-950/65 backdrop-blur-md border border-white/20 text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide shadow-lg">
                Skinfinity Derma Flagship Clinics
              </div>
            </div>

          </div>
        </Link>
      </div>
    </section>
  );
}
