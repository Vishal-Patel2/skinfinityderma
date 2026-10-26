"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Star,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  Rocket,
  Award,
} from "lucide-react";
import { BRAND_JOURNEY, Milestone } from "@/data/clinicData";

function GoogleRatingCircle({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-3 text-center select-none transition-transform duration-500 ${
        isActive ? "scale-105" : "group-hover:scale-105"
      }`}
    >
      {/* Top rating score + stars */}
      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full mb-1">
        <span className="text-xs sm:text-sm font-black text-slate-900">4.5</span>
        <div className="flex items-center text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>

      {/* Google colored wordmark */}
      <div className="text-xs sm:text-sm font-extrabold tracking-tight leading-none mt-0.5">
        <span className="text-[#4285F4]">G</span>
        <span className="text-[#EA4335]">o</span>
        <span className="text-[#FBBC05]">o</span>
        <span className="text-[#4285F4]">g</span>
        <span className="text-[#34A853]">l</span>
        <span className="text-[#EA4335]">e</span>
        <span className="text-slate-700 font-bold ml-1 text-[10px] sm:text-xs">
          Overall Rating
        </span>
      </div>

      <div className="w-12 h-px bg-slate-200 my-1.5" />

      <p className="text-[11px] sm:text-xs font-extrabold text-[#2b7a75] uppercase tracking-wider leading-tight">
        Skinfinity Derma
      </p>
      <span className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2b7a75] text-white text-[10px] font-extrabold tracking-wide shadow-sm">
        4,500+ Reviews
      </span>
    </div>
  );
}

interface StageNodeProps {
  step: Milestone;
  index: number;
  imagePosition: "top" | "bottom";
  isActive: boolean;
  onSelect: (index: number) => void;
  onHoverChange: (hovering: boolean) => void;
}

function StageNode({
  step,
  index,
  imagePosition,
  isActive,
  onSelect,
  onHoverChange,
}: StageNodeProps) {
  const renderImageCircle = () => (
    <div className="relative flex flex-col items-center">
      {/* Step index floating pill */}
      <span
        className={`mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
          isActive
            ? "bg-[#2b7a75] text-white shadow-md scale-105"
            : "bg-slate-100 text-slate-600 group-hover:bg-[#2b7a75]/15 group-hover:text-[#2b7a75]"
        }`}
      >
        <span>0{index + 1}</span>
        <span>•</span>
        <span>{step.badge}</span>
      </span>

      {/* Circular Photo Frame with animated halo on hover / active */}
      <div className="relative">
        {/* Animated outer pulse ring when active or hovered */}
        <div
          className={`absolute -inset-2 rounded-full transition-all duration-500 pointer-events-none ${
            isActive
              ? "opacity-100 bg-gradient-to-tr from-[#2b7a75]/30 via-teal-400/20 to-amber-400/30 blur-md scale-105"
              : "opacity-0 group-hover:opacity-100 bg-[#2b7a75]/20 blur-md"
          }`}
        />

        {/* Rotating dashed decorative ring */}
        <div
          className={`absolute -inset-1.5 rounded-full border-2 border-dashed transition-all duration-700 pointer-events-none ${
            isActive
              ? "border-[#2b7a75] opacity-80 rotate-45 scale-105"
              : "border-slate-300 opacity-40 group-hover:border-[#2b7a75]/70 group-hover:rotate-45"
          }`}
        />

        <div
          className={`relative w-36 h-36 xl:w-40 xl:h-40 rounded-full overflow-hidden border-4 transition-all duration-500 bg-white ${
            isActive
              ? "border-[#2b7a75] shadow-[0_18px_40px_-10px_rgba(43,122,117,0.55)] -translate-y-1.5 scale-105"
              : "border-white shadow-lg group-hover:border-[#2b7a75] group-hover:shadow-xl group-hover:-translate-y-1 group-hover:scale-105"
          }`}
        >
          {step.image === "google-badge" ? (
            <GoogleRatingCircle isActive={isActive} />
          ) : (
            <>
              <Image
                src={step.image || "/images/journey/journey-2017.jpg"}
                alt={`${step.year} - ${step.title}`}
                fill
                sizes="160px"
                className={`object-cover transition-transform duration-700 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              {/* Subtle vignette + active shine */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? "bg-gradient-to-t from-[#1b534f]/35 via-transparent to-transparent opacity-100"
                    : "bg-slate-950/10 group-hover:opacity-0"
                }`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderTextCard = () => (
    <div
      className={`w-full max-w-[250px] rounded-2xl p-4 text-center transition-all duration-500 border relative overflow-hidden ${
        isActive
          ? "bg-white border-[#2b7a75] shadow-[0_14px_32px_-10px_rgba(43,122,117,0.28)] -translate-y-1"
          : "bg-white/90 border-slate-200/90 shadow-sm group-hover:border-[#2b7a75]/60 group-hover:shadow-md group-hover:-translate-y-0.5"
      }`}
    >
      {/* Top active accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${
          isActive
            ? "bg-gradient-to-r from-[#1b534f] via-[#2b7a75] to-amber-500 opacity-100"
            : "bg-[#2b7a75]/30 opacity-0 group-hover:opacity-100"
        }`}
      />
      <h3
        className={`text-base xl:text-lg font-extrabold font-serif transition-colors duration-300 ${
          isActive
            ? "text-[#1b534f]"
            : "text-slate-900 group-hover:text-[#2b7a75]"
        }`}
      >
        {step.title}
      </h3>
      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
        {step.description}
      </p>
    </div>
  );

  return (
    <div
      onClick={() => onSelect(index)}
      onMouseEnter={() => {
        onHoverChange(true);
        onSelect(index);
      }}
      onMouseLeave={() => onHoverChange(false)}
      className="group relative flex flex-col items-center cursor-pointer select-none"
    >
      {/* ── TOP SLOT (Fixed height so middle year circles align on the horizontal track) ── */}
      <div className="h-[210px] flex flex-col items-center justify-end pb-2 w-full">
        {imagePosition === "top" ? renderImageCircle() : renderTextCard()}
      </div>

      {/* Upper Vertical Connector Stem */}
      <div className="flex flex-col items-center">
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            isActive
              ? "bg-[#2b7a75] ring-4 ring-[#2b7a75]/20"
              : "bg-slate-400 group-hover:bg-[#2b7a75]"
          }`}
        />
        <div
          className={`w-0.5 h-5 transition-colors duration-300 ${
            isActive
              ? "bg-[#2b7a75]"
              : "bg-slate-300 group-hover:bg-[#2b7a75]/70"
          }`}
        />
      </div>

      {/* ── CENTER YEAR NODE (Sits directly on the horizontal roadmap track) ── */}
      <div className="relative z-20 my-0.5">
        {isActive && (
          <span className="absolute -inset-1.5 rounded-full bg-[#2b7a75]/25 animate-ping pointer-events-none" />
        )}
        <div
          style={{
            background: isActive
              ? "linear-gradient(135deg, #164e4a 0%, #2b7a75 60%, #0d9488 100%)"
              : "#2b7a75",
          }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white font-serif font-extrabold text-base xl:text-lg tracking-tight border-4 transition-all duration-300 ${
            isActive
              ? "border-amber-300 shadow-[0_0_25px_rgba(43,122,117,0.6)] scale-110"
              : "border-white shadow-md group-hover:scale-110 group-hover:border-teal-100"
          }`}
        >
          {step.year}
        </div>
      </div>

      {/* Lower Vertical Connector Stem */}
      <div className="flex flex-col items-center">
        <div
          className={`w-0.5 h-5 transition-colors duration-300 ${
            isActive
              ? "bg-[#2b7a75]"
              : "bg-slate-300 group-hover:bg-[#2b7a75]/70"
          }`}
        />
        <span
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            isActive
              ? "bg-[#2b7a75] ring-4 ring-[#2b7a75]/20"
              : "bg-slate-400 group-hover:bg-[#2b7a75]"
          }`}
        />
      </div>

      {/* ── BOTTOM SLOT ── */}
      <div className="h-[210px] flex flex-col items-center justify-start pt-2 w-full">
        {imagePosition === "bottom" ? renderImageCircle() : renderTextCard()}
      </div>
    </div>
  );
}

export default function BrandJourneyRoadmap() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance along the connected journey: 2017 -> 2019 -> 2022 -> 2024 -> 2025 -> 2026
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % BRAND_JOURNEY.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused]);

  const row1 = BRAND_JOURNEY.slice(0, 3); // 2017, 2019, 2022 (Left -> Right)
  const row2 = BRAND_JOURNEY.slice(3, 6); // 2024, 2025, 2026 (Rendered Right -> Left!)
  const activeStep = BRAND_JOURNEY[activeIdx] || BRAND_JOURNEY[0];

  return (
    <section className="py-10 lg:py-14 bg-gradient-to-b from-[#f9fbfb] via-white to-[#f4f9f8] overflow-hidden border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#2b7a75] bg-[#2b7a75]/10 px-4 py-1.5 rounded-full border border-[#2b7a75]/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Our Journey: 9 Years of Excellence</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 font-serif leading-tight">
            A Decade of{" "}
            <span className="text-[#2b7a75]">
              Clinical Mastery
            </span>{" "}
            &amp; Strategic Growth
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            Follow our continuous roadmap from our 2017 genesis in Noida to our
            2026 Pan-India franchise expansion. Hover or click any milestone to
            inspect that stage.
          </p>

          {/* Quick Year Jump Pills + Auto-Play Toggle */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
            {BRAND_JOURNEY.map((item, idx) => {
              const selected = activeIdx === idx;
              return (
                <button
                  key={item.year}
                  onClick={() => setActiveIdx(idx)}
                  style={
                    selected
                      ? {
                          background:
                            "linear-gradient(135deg, #1b534f 0%, #2b7a75 100%)",
                          color: "#ffffff",
                        }
                      : undefined
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    selected
                      ? "shadow-md scale-105"
                      : "text-slate-600 hover:text-[#2b7a75] hover:bg-slate-50"
                  }`}
                >
                  <span>{item.year}</span>
                  {idx < BRAND_JOURNEY.length - 1 && (
                    <span
                      className={`text-[10px] ${
                        selected ? "text-amber-300" : "text-slate-300"
                      }`}
                    >
                      →
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={() => setIsPaused((p) => !p)}
              className="ml-1 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title={isPaused ? "Resume auto-tour" : "Pause auto-tour"}
              aria-label={isPaused ? "Resume auto-tour" : "Pause auto-tour"}
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Pause className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP S-CURVE / SNAKE WINDING ROADMAP (lg and above)
            Row 1: Left -> Right (2017 -> 2019 -> 2022)
            Right U-Turn Curve Connector: Downward from 2022 (Right) to 2024 (Right)
            Row 2: Right -> Left (2024 -> 2025 -> 2026)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:block px-6 xl:px-12">
          <div className="relative">
            {/* ── RIGHT-SIDE CONTINUOUS S-CURVE CONNECTOR (Bridges Row 1 Right -> Row 2 Right seamlessly) ── */}
            <div
              className="absolute right-0 top-[270px] h-[524px] w-24 border-y-[4px] border-r-[4px] border-[#2b7a75] rounded-r-[48px] pointer-events-none z-10"
            >
              {/* Animated glowing flow indicator on the right vertical curve */}
              <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-6 h-12 rounded-full bg-[#2b7a75] text-white flex flex-col items-center justify-center shadow-md border-2 border-white">
                <span className="text-[10px] leading-none font-black animate-bounce">
                  ↓
                </span>
              </div>
            </div>

            {/* ── ROW 1: LEFT TO RIGHT (2017 ➔ 2019 ➔ 2022) ── */}
            <div className="relative h-[544px]">
              {/* Horizontal Track Line for Row 1 */}
              <div className="absolute left-4 right-12 top-[270px] h-[4px] bg-[#2b7a75] z-10 rounded-l-full">
                {/* START Badge on Far Left */}
                <div className="absolute -left-2 -top-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1b534f] text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md border border-white">
                  <span>Start</span>
                  <ArrowRight className="w-2.5 h-2.5 text-amber-300" />
                </div>

                {/* Directional Arrow 1 (Between 2017 and 2019 — Left to Right) */}
                <div className="absolute left-[31%] -top-3 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-[#2b7a75]/40 shadow-sm text-[#2b7a75]">
                  <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                  <ArrowRight className="w-3.5 h-3.5 -ml-2 opacity-60" />
                </div>

                {/* Directional Arrow 2 (Between 2019 and 2022 — Left to Right) */}
                <div className="absolute left-[65%] -top-3 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-[#2b7a75]/40 shadow-sm text-[#2b7a75]">
                  <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                  <ArrowRight className="w-3.5 h-3.5 -ml-2 opacity-60" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 relative z-20">
                {/* 2017: Image Top, Text Bottom */}
                <StageNode
                  step={row1[0]}
                  index={0}
                  imagePosition="top"
                  isActive={activeIdx === 0}
                  onSelect={setActiveIdx}
                  onHoverChange={setIsPaused}
                />
                {/* 2019: Text Top, Image Bottom */}
                <StageNode
                  step={row1[1]}
                  index={1}
                  imagePosition="bottom"
                  isActive={activeIdx === 1}
                  onSelect={setActiveIdx}
                  onHoverChange={setIsPaused}
                />
                {/* 2022: Image Top, Text Bottom */}
                <StageNode
                  step={row1[2]}
                  index={2}
                  imagePosition="top"
                  isActive={activeIdx === 2}
                  onSelect={setActiveIdx}
                  onHoverChange={setIsPaused}
                />
              </div>
            </div>

            {/* ── ROW 2: RIGHT TO LEFT (2026 ⬅ 2025 ⬅ 2024) ── */}
            <div className="relative h-[544px] mt-[-24px]">
              {/* Horizontal Track Line for Row 2 */}
              <div className="absolute left-6 right-12 top-[270px] h-[4px] bg-[#2b7a75] z-10 rounded-l-full">
                {/* Directional Arrow 3 (Between 2024 on Right and 2025 in Center — Right to Left!) */}
                <div className="absolute left-[65%] -top-3 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-[#2b7a75]/40 shadow-sm text-[#2b7a75]">
                  <ArrowLeft className="w-3.5 h-3.5 animate-pulse" />
                  <ArrowLeft className="w-3.5 h-3.5 -ml-2 opacity-60" />
                </div>

                {/* Directional Arrow 4 (Between 2025 in Center and 2026 on Left — Right to Left!) */}
                <div className="absolute left-[31%] -top-3 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-[#2b7a75]/40 shadow-sm text-[#2b7a75]">
                  <ArrowLeft className="w-3.5 h-3.5 animate-pulse" />
                  <ArrowLeft className="w-3.5 h-3.5 -ml-2 opacity-60" />
                </div>

                {/* END / FUTURE Badge on Far Left of Row 2 */}
                <div className="absolute -left-3 -top-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-widest shadow-md border border-white">
                  <Rocket className="w-2.5 h-2.5" />
                  <span>Next Era</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 relative z-20">
                {/* Left Column: 2026 (Franchise Expansion) — Image Top, Text Bottom */}
                <StageNode
                  step={row2[2]}
                  index={5}
                  imagePosition="top"
                  isActive={activeIdx === 5}
                  onSelect={setActiveIdx}
                  onHoverChange={setIsPaused}
                />
                {/* Middle Column: 2025 (The Legacy - 4,500+ Google Reviews) — Text Top, Image Bottom */}
                <StageNode
                  step={row2[1]}
                  index={4}
                  imagePosition="bottom"
                  isActive={activeIdx === 4}
                  onSelect={setActiveIdx}
                  onHoverChange={setIsPaused}
                />
                {/* Right Column: 2024 (Clinical Excellence) — Image Top, Text Bottom */}
                <StageNode
                  step={row2[0]}
                  index={3}
                  imagePosition="top"
                  isActive={activeIdx === 3}
                  onSelect={setActiveIdx}
                  onHoverChange={setIsPaused}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE & TABLET CONNECTED TIMELINE (< lg)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:hidden relative pl-6 sm:pl-8 border-l-4 border-[#2b7a75] space-y-8 my-6 ml-3">
          {BRAND_JOURNEY.map((step, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={step.year}
                onClick={() => setActiveIdx(idx)}
                className={`relative rounded-3xl p-5 border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white border-[#2b7a75] shadow-xl ring-2 ring-[#2b7a75]/20"
                    : "bg-white/90 border-slate-200 shadow-sm"
                }`}
              >
                {/* Year node on the left vertical line */}
                <div
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #1b534f 0%, #2b7a75 100%)"
                      : "#2b7a75",
                  }}
                  className="absolute -left-[42px] sm:-left-[50px] top-6 w-12 h-12 rounded-full border-4 border-white text-white font-serif font-extrabold text-xs flex items-center justify-center shadow-md"
                >
                  {step.year}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#2b7a75] shrink-0 bg-white shadow-md">
                    {step.image === "google-badge" ? (
                      <GoogleRatingCircle isActive={isActive} />
                    ) : (
                      <Image
                        src={step.image || "/images/journey/journey-2017.jpg"}
                        alt={step.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#2b7a75] bg-[#2b7a75]/10 px-2.5 py-0.5 rounded-full">
                      Step 0{idx + 1} • {step.badge}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 font-serif mt-1">
                      {step.year}: {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ACTIVE MILESTONE LIVE SPOTLIGHT BAR (Explicit teal gradient — zero purge issues)
           ══════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #133c39 0%, #1f5f5b 50%, #2b7a75 100%)",
          }}
          className="mt-10 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-teal-400/20 transition-all duration-500"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Active circular miniature preview */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-300 shadow-lg shrink-0 bg-white">
                {activeStep.image === "google-badge" ? (
                  <GoogleRatingCircle isActive={true} />
                ) : (
                  <Image
                    src={activeStep.image || "/images/journey/journey-2017.jpg"}
                    alt={activeStep.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                  <Award className="w-3.5 h-3.5" />
                  <span>
                    Stage 0{activeIdx + 1} of {BRAND_JOURNEY.length} •{" "}
                    {activeStep.year} ({activeStep.badge})
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-serif text-white">
                  {activeStep.year} — {activeStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-teal-50/90 leading-relaxed">
                  {activeStep.description}
                </p>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() =>
                  setActiveIdx(
                    (prev) =>
                      (prev - 1 + BRAND_JOURNEY.length) % BRAND_JOURNEY.length
                  )
                }
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer border border-white/20"
                aria-label="Previous stage"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center px-2">
                <span className="block text-xs font-extrabold tracking-wider text-amber-300">
                  {activeStep.year}
                </span>
                <span className="block text-[10px] text-teal-100">
                  {activeIdx + 1} / {BRAND_JOURNEY.length}
                </span>
              </div>
              <button
                onClick={() =>
                  setActiveIdx((prev) => (prev + 1) % BRAND_JOURNEY.length)
                }
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer border border-white/20"
                aria-label="Next stage"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
