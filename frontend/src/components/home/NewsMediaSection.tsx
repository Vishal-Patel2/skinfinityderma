"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Newspaper, ChevronLeft, ChevronRight, ExternalLink, PlayCircle, FileText, Stethoscope } from "lucide-react";
import { MEDIA_PRESS } from "@/data/clinicData";

const MEDIA_LOGOS = [
  { name: "Times of India",   src: "/images/media/times-of-india-logo-toi.webp", tag: "National Daily" },
  { name: "India Today",      src: "/images/media/india-today.webp",             tag: "Leading Magazine" },
  { name: "Femina",           src: "/images/media/femina-logo-image.webp",       tag: "Beauty & Lifestyle" },
  { name: "Vogue India",      src: "/images/media/vogue.webp",                   tag: "Luxury Fashion" },
  { name: "Zee News",         src: "/images/media/zee-news.webp",                tag: "National TV" },
  { name: "News18",           src: "/images/media/news18-logo.webp",             tag: "Broadcast Media" },
  { name: "Healthshots",      src: "/images/media/healthshots-logo-new-1.webp",  tag: "Health & Wellness" },
  { name: "The Week",         src: "/images/media/the-week-logo.webp",           tag: "Editorial" },
  { name: "Rediff",           src: "/images/media/rediff-newlogo.webp",          tag: "Digital Portal" },
  { name: "Inshorts",         src: "/images/media/logo-inshorts.webp",           tag: "News App" },
  { name: "Times Now",        src: "/images/media/timesnews.webp",               tag: "Prime Time TV" },
  { name: "Brides Today",     src: "/images/media/brides-today.webp",            tag: "Bridal & Couture" },
  { name: "Voice of Fashion", src: "/images/media/voice-of-fashion.webp",        tag: "Fashion Journal" },
  { name: "ABP Live",         src: "/images/media/abvp-live.webp",               tag: "National Network" },
  { name: "India.com",        src: "/images/media/india-logo.webp",              tag: "Digital Media" },
];

const DOUBLED = [...MEDIA_LOGOS, ...MEDIA_LOGOS];

export default function NewsMediaSection() {
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 2400);
    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollLeft = () => {
    cardsScrollRef.current?.scrollBy({ left: -340, behavior: "smooth" });
    scrollRef.current?.scrollBy({ left: -520, behavior: "smooth" });
  };
  const scrollRight = () => {
    cardsScrollRef.current?.scrollBy({ left: 340, behavior: "smooth" });
    scrollRef.current?.scrollBy({ left: 520, behavior: "smooth" });
  };

  return (
    <section className="py-10 lg:py-14 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f6f3] border border-[#d2eee7] text-[#006d6e] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Newspaper className="w-3.5 h-3.5 text-[#006d6e]" />
              <span>National Recognition &amp; Doctor Interviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif">
              Featured In <span className="text-brand-700">News, Media &amp; Press</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
              Explore featured interviews, clinical dermatology articles, and broadcast segments with our doctors across India&apos;s top publications.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={scrollLeft}
              aria-label="Previous media logos"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Next media logos"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clickable Doctor Interview & Press Feature Cards — Single Row Horizontal Carousel */}
        <div
          ref={cardsScrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {MEDIA_PRESS.map((item, idx) => {
            const isVideo = item.type.toLowerCase().includes("video") || item.type.toLowerCase().includes("tv") || item.type.toLowerCase().includes("interview");
            return (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none w-[280px] sm:w-[300px] lg:w-[calc(25%-15px)] snap-start group bg-white rounded-3xl border border-slate-200/90 hover:border-[#008081] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Doctor & Publication Header */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <Image
                      src={item.thumbnail || "/images/doctors/dr-ipshita-johri.jpg"}
                      alt={item.doctor}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-900 shadow-sm">
                      {item.outlet}
                    </div>

                    <div className="absolute top-3 right-3 bg-[#008081]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      {isVideo ? (
                        <>
                          <PlayCircle className="w-3 h-3" />
                          <span>Video Interview</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3" />
                          <span>Press Article</span>
                        </>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold text-teal-300 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        {item.doctor}
                      </span>
                      <span className="text-[10px] text-slate-300 block">{item.date}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006d6e] bg-[#e8f6f3] px-2.5 py-0.5 rounded-full">
                      {item.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#008081] transition-colors font-serif leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      Featured clinical insights and medical dermatology discussion by {item.doctor} on {item.outlet}.
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#008081] group-hover:text-teal-800">
                    <span>{isVideo ? "Watch Doctor Interview" : "Read Full Interview"}</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Row 1: Interactive Auto-Sliding Publication Logo Cards */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {MEDIA_LOGOS.map((logo, idx) => (
            <div
              key={idx}
              className="flex-none w-[220px] sm:w-[240px] snap-start bg-white rounded-2xl border border-slate-200/80 hover:border-brand-600 shadow-sm hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center justify-between gap-3 group"
            >
              <div className="relative w-full h-20 flex items-center justify-center px-2">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  unoptimized
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-full pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 truncate">{logo.name}</span>
                <span className="text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
                  {logo.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Row 2: Seamless Infinite Marquee Strip */}
      <div className="relative w-full mt-6 py-5 bg-slate-50/70 border-t border-slate-100">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div className="flex gap-6 animate-marquee-left whitespace-nowrap items-center">
            {DOUBLED.map((logo, i) => (
              <div
                key={`strip-${i}`}
                className="relative flex-none flex items-center justify-center w-44 h-16 bg-white rounded-xl border border-slate-200/60 px-4 py-2 shadow-sm hover:border-brand-400 transition-all"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  unoptimized
                  className="object-contain p-2.5 opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
