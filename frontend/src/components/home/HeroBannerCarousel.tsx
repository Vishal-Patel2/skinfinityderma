"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBanners, getTrustBadges } from "@/lib/api";
import { getImageUrl, DEFAULT_FALLBACKS } from "@/utils/imageUrl";
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck,
  Award,
  Stethoscope,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Star,
  Clock,
  FlaskConical,
  Zap,
  Droplets,
  Sparkles
} from "lucide-react";

interface HeroBannerCarouselProps {
  initialBanners?: any[] | null;
  initialTrustBadges?: any[] | null;
}

export default function HeroBannerCarousel({ initialBanners, initialTrustBadges }: HeroBannerCarouselProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const defaultSlides = [
    {
      id: "team-banner",
      alt: "Meet The Skinfinity Derma Team - Delhi NCR's Most Trusted Dermatologists",
      desktopImage: "/images/banners/team-banner-desktop.png",
      mobileImage: "/images/banners/team-banner-mobile.png",
      link: "/about-us",
    },
    {
      id: "laser-banner",
      alt: "Tired of shaving & waxing before every occasion? Laser Hair Reduction package at ₹39,999/-",
      desktopImage: "/images/banners/laser-banner-desktop.png",
      mobileImage: "/images/banners/laser-banner-mobile.png",
      link: "/laser-hair-reduction-noida",
    },
  ];

  const defaultTrustPills = [
    { icon: CheckCircle2, text: "Leading Choice for Aesthetic Solutions" },
    { icon: ShieldCheck, text: "Safe & Hygienic Clinical Protocols" },
    { icon: Award, text: "US-FDA Approved Technology" },
    { icon: Stethoscope, text: "Personalized Treatment Plans" },
    { icon: CreditCard, text: "0% Interest EMI Option Available" },
    { icon: UserCheck, text: "Senior MD Dermatologists Led Clinic" },
    { icon: Star, text: "3,500+ Verified 5-Star Google Reviews (4.8★)" },
    { icon: CheckCircle2, text: "Hospital-Grade Sanitation" },
    { icon: Clock, text: "14+ Years of Dermatology Excellence" },
    { icon: FlaskConical, text: "Integrated Pharmacy & Pathology Services" },
    { icon: Zap, text: "Painless US-FDA Laser Hair Removal" },
    { icon: Droplets, text: "Signature Sugarcane HydraFacial MD" },
  ];

  const getPillIcon = (iconName?: string | null) => {
    const key = (iconName || "").toLowerCase();
    if (key.includes("shield") || key.includes("safe") || key.includes("protocol")) return ShieldCheck;
    if (key.includes("award") || key.includes("certif") || key.includes("fda")) return Award;
    if (key.includes("steth") || key.includes("doctor") || key.includes("treatment")) return Stethoscope;
    if (key.includes("card") || key.includes("emi") || key.includes("payment")) return CreditCard;
    if (key.includes("user") || key.includes("md") || key.includes("team")) return UserCheck;
    if (key.includes("star") || key.includes("review") || key.includes("google")) return Star;
    if (key.includes("clock") || key.includes("year") || key.includes("time") || key.includes("experience")) return Clock;
    if (key.includes("flask") || key.includes("lab") || key.includes("pharmacy") || key.includes("pathology")) return FlaskConical;
    if (key.includes("zap") || key.includes("laser") || key.includes("flash")) return Zap;
    if (key.includes("drop") || key.includes("hydra") || key.includes("water")) return Droplets;
    if (key.includes("sparkle") || key.includes("happy") || key.includes("patient")) return Sparkles;
    return CheckCircle2;
  };

  const formattedInitial = initialBanners && initialBanners.length > 0
    ? initialBanners.map((b) => ({
        id: String(b.id),
        alt: "Skinfinity Derma Banner",
        desktopImage: getImageUrl(b.desktopImage, DEFAULT_FALLBACKS.bannerDesktop),
        mobileImage: getImageUrl(b.mobileImage || b.desktopImage, DEFAULT_FALLBACKS.bannerMobile),
        link: "/about-us",
      }))
    : defaultSlides;

  const formattedPills = Array.isArray(initialTrustBadges)
    ? initialTrustBadges.map((badge: any) => ({
        icon: getPillIcon(badge.icon || badge.title),
        iconUrl: badge.iconUrl ? getImageUrl(badge.iconUrl) : null,
        text: badge.title,
      }))
    : defaultTrustPills.map(p => ({ icon: p.icon, iconUrl: null, text: p.text }));

  const [slides, setSlides] = useState(formattedInitial);
  const [trustPills, setTrustPills] = useState(formattedPills);

  useEffect(() => {
    let active = true;
    getBanners().then((data) => {
      if (active && Array.isArray(data) && data.length > 0) {
        setSlides(
          data.map((b) => ({
            id: String(b.id),
            alt: "Skinfinity Derma Banner",
            desktopImage: getImageUrl(b.desktopImage, DEFAULT_FALLBACKS.bannerDesktop),
            mobileImage: getImageUrl(b.mobileImage || b.desktopImage, DEFAULT_FALLBACKS.bannerMobile),
            link: "/about-us",
          }))
        );
      } else if (active && Array.isArray(data) && data.length === 0) {
        setSlides(defaultSlides);
      }
    }).catch(() => {
      if (active) setSlides(defaultSlides);
    });

    if (typeof getTrustBadges === "function") {
      getTrustBadges().then((badges) => {
        if (active && Array.isArray(badges)) {
          setTrustPills(
            badges.map((badge: any) => ({
              icon: getPillIcon(badge.icon || badge.title),
              iconUrl: badge.iconUrl ? getImageUrl(badge.iconUrl) : null,
              text: badge.title,
            }))
          );
        }
      }).catch(() => {});
    }

    return () => {
      active = false;
    };
  }, []);

  // Auto rotate banner every 5.5 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Touch Swipe navigation for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      
      {/* 1. Complete Full Width Banner Slider (No max-width restriction, 100vw edge-to-edge) */}
      <div 
        className="relative w-full overflow-hidden bg-slate-950 group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Banner Slides Container with Device-Specific Aspect Ratios */}
        <div className="relative w-full aspect-[3/4] sm:aspect-[16/10] md:aspect-[3/1]">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                currentSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link 
                href={slide.link} 
                className="block relative w-full h-full cursor-pointer"
                aria-label={slide.alt}
              >
                {/* Mobile View: Dedicated Portrait Banner (3:4 ratio, crisp & readable) */}
                <div className="block md:hidden relative w-full h-full">
                  <Image
                    src={slide.mobileImage}
                    alt={slide.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover object-top"
                    sizes="100vw"
                  />
                </div>

                {/* Desktop View: Dedicated Ultra-Wide Banner (3:1 ratio, 100% full-bleed) */}
                <div className="hidden md:block relative w-full h-full">
                  <Image
                    src={slide.desktopImage}
                    alt={slide.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                </div>
              </Link>
            </div>
          ))}

          {/* Clean Glassmorphic Left Arrow (only if multiple slides) */}
          {slides.length > 1 && (
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-[#008081] text-white shadow-xl flex items-center justify-center transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 z-20 backdrop-blur-md border border-white/20"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Clean Glassmorphic Right Arrow (only if multiple slides) */}
          {slides.length > 1 && (
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-[#008081] text-white shadow-xl flex items-center justify-center transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 z-20 backdrop-blur-md border border-white/20"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Luxury Dot & Pill Indicators (only if multiple slides) */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 shadow-lg">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === idx 
                      ? "w-7 sm:w-8 h-2 sm:h-2.5 bg-gradient-to-r from-teal-400 to-emerald-400 shadow-glow" 
                      : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Below Banner: Continuous Infinite Auto-Slider Ticker with Icons (No scrollbar, smooth loop) */}
      {trustPills && trustPills.length > 0 && (
        <div className="w-full bg-gradient-to-r from-[#eef8f5] via-white to-[#eef8f5] border-y border-[#d5ebe4] py-3 sm:py-3.5 relative overflow-hidden shadow-sm">
          
          {/* Soft edge fade masks for seamless luxury appearance */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#eef8f5] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#eef8f5] to-transparent z-10" />

          {/* Continuous Auto-sliding Marquee Track */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex items-center gap-3 sm:gap-4 shrink-0">
              {/* First set of pills */}
              {trustPills.map((pill, idx) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={`first-${idx}`}
                    className="bg-white rounded-full px-3.5 py-2 sm:px-4 sm:py-2.5 border border-[#d6ebe4] shadow-sm hover:shadow-md hover:border-[#008081] transition-all flex items-center gap-2.5 shrink-0 group cursor-default"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#e8f6f3] text-[#008081] group-hover:bg-[#008081] group-hover:text-white transition-colors flex items-center justify-center shrink-0 overflow-hidden">
                      {pill.iconUrl ? (
                        <img src={pill.iconUrl} alt={pill.text} className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
                      ) : (
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-[#0c4445] whitespace-nowrap">
                      {pill.text}
                    </span>
                  </div>
                );
              })}

              {/* Duplicate set for gapless, infinite marquee loop */}
              {trustPills.map((pill, idx) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={`second-${idx}`}
                    className="bg-white rounded-full px-3.5 py-2 sm:px-4 sm:py-2.5 border border-[#d6ebe4] shadow-sm hover:shadow-md hover:border-[#008081] transition-all flex items-center gap-2.5 shrink-0 group cursor-default"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#e8f6f3] text-[#008081] group-hover:bg-[#008081] group-hover:text-white transition-colors flex items-center justify-center shrink-0 overflow-hidden">
                      {pill.iconUrl ? (
                        <img src={pill.iconUrl} alt={pill.text} className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
                      ) : (
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-[#0c4445] whitespace-nowrap">
                      {pill.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
