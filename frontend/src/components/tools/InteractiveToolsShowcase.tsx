"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Activity, 
  Calculator, 
  Zap, 
  Calendar, 
  Phone, 
  User, 
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Lock
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function InteractiveToolsShowcase() {
  const [activeModal, setActiveModal] = useState<"skin" | "hair" | "laser" | null>(null);
  const toolsScrollRef = useRef<HTMLDivElement>(null);

  const scrollTools = (dir: "left" | "right") => {
    if (!toolsScrollRef.current) return;
    const step = 300;
    toolsScrollRef.current.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  // Live automated ticker state for Skin Analyser preview
  const [skinMetrics, setSkinMetrics] = useState({
    acne: 72,
    pigment: 58,
    pore: 24,
    texture: 64,
    hydration: 38
  });

  // Live automated ticker state for Hair Graft preview (Grades 1 to 5 only)
  const [hairGradeIdx, setHairGradeIdx] = useState(1);
  const hairCycles = [
    { grade: "Grade 2 (Hairline Recession)", grafts: "1,200 - 1,500", density: "Natural" },
    { grade: "Grade 3 (Front + Temples)", grafts: "1,800 - 2,200", density: "High Density" },
    { grade: "Grade 4 (Front + Crown)", grafts: "2,400 - 3,000", density: "Full Coverage" },
  ];

  // Live automated ticker state for Laser Estimator preview
  const [laserAreaIdx, setLaserAreaIdx] = useState(0);
  const laserCycles = [
    { area: "Full Body Gold", price: "₹14,999", save: "35% OFF (6 Sessions)" },
    { area: "Underarms (Painless)", price: "₹1,999", save: "Includes Free Patch Test" },
    { area: "Full Legs & Arms", price: "₹8,999", save: "-4°C ICE Plus Cooling" },
  ];

  useEffect(() => {
    const skinTimer = setInterval(() => {
      setSkinMetrics({
        acne: 70 + Math.floor(Math.random() * 6),
        pigment: 56 + Math.floor(Math.random() * 5),
        pore: 22 + Math.floor(Math.random() * 5),
        texture: 62 + Math.floor(Math.random() * 5),
        hydration: 36 + Math.floor(Math.random() * 6),
      });
    }, 2800);

    const hairTimer = setInterval(() => {
      setHairGradeIdx((prev) => (prev + 1) % hairCycles.length);
    }, 3200);

    const laserTimer = setInterval(() => {
      setLaserAreaIdx((prev) => (prev + 1) % laserCycles.length);
    }, 3000);

    return () => {
      clearInterval(skinTimer);
      clearInterval(hairTimer);
      clearInterval(laserTimer);
    };
  }, [hairCycles.length, laserCycles.length]);

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Smart Aesthetic Diagnostic Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif">
            Interactive Clinical Self-Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Preview simulated metrics in real-time below, or click any card to launch your comprehensive individual assessment model with personalized guidance By Our Team of Dermatologists.
          </p>
        </div>

        {/* Mobile Carousel Controls */}
        <div className="flex md:hidden items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Swipe or use arrows ({3} Tools)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTools("left")}
              aria-label="Previous tool"
              className="w-9 h-9 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={() => scrollTools("right")}
              aria-label="Next tool"
              className="w-9 h-9 rounded-full border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center shadow-sm transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>

        {/* 3 Interactive Cards */}
        <div
          ref={toolsScrollRef}
          className="flex md:grid md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          
          {/* Card 1: Skin Analyser */}
          <div
            onClick={() => setActiveModal("skin")}
            className="flex-none w-[290px] sm:w-[320px] md:w-auto snap-start group cursor-pointer bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <Image
                  src="/images/custom/tool-skin-analyser.png"
                  alt="Skin Analyser - AI Based Skin Analysis"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />

                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_12px_#34d399] animate-[scanner_3s_ease-in-out_infinite] pointer-events-none" />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Skin care insights</span>
                </div>

                <div className="absolute top-3 right-3 bg-emerald-100/90 backdrop-blur-md text-emerald-900 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-300/80 shadow-sm">
                  AI Based Skin Analysis
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/30 text-white text-[10px]">
                  <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live AI Facial Analysis
                    </span>
                    <span>By Our Team of Dermatologists</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] text-slate-300 font-medium">
                    <div className="bg-white/10 rounded p-1">
                      <span className="block text-amber-400 font-bold">{skinMetrics.acne}%</span>
                      <span>Acne Risk</span>
                    </div>
                    <div className="bg-white/10 rounded p-1">
                      <span className="block text-emerald-400 font-bold">{skinMetrics.pigment}%</span>
                      <span>Pigment</span>
                    </div>
                    <div className="bg-white/10 rounded p-1">
                      <span className="block text-cyan-400 font-bold">{skinMetrics.hydration}%</span>
                      <span>Hydration</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors font-serif">
                  Skin Analyser
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Explore your multi-dimensional skin profile and discover a personalised starting point for your skincare journey.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white transition-all flex items-center justify-between font-bold text-xs shadow-sm">
                <span>Launch Interactive Skin Analyser Model</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Hair Graft Calculator */}
          <div
            onClick={() => setActiveModal("hair")}
            className="flex-none w-[290px] sm:w-[320px] md:w-auto snap-start group cursor-pointer bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <Image
                  src="/images/custom/tool-hair-graft.png"
                  alt="Hair & Baldness Assessment - Hair restoration"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Hair restoration</span>
                </div>

                <div className="absolute top-3 right-3 bg-emerald-100/90 backdrop-blur-md text-emerald-900 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-300/80 shadow-sm">
                  Grades 1 – 5 Model
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/30 text-white text-[10px]">
                  <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {hairCycles[hairGradeIdx].grade}
                    </span>
                    <span className="text-amber-300">{hairCycles[hairGradeIdx].density}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded p-1.5 text-xs font-bold">
                    <span className="text-slate-300 font-normal text-[10px]">Estimated Grafts:</span>
                    <span className="text-emerald-300 text-sm">{hairCycles[hairGradeIdx].grafts}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors font-serif">
                  Hair &amp; Baldness Assessment
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Evaluate your Grade of Baldness (Grade 1–5), hair thickness, and pattern with visual follicle graphs.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white transition-all flex items-center justify-between font-bold text-xs shadow-sm">
                <span>Calculate Grafts in Interactive Model</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Laser Hair Removal Estimator */}
          <div
            onClick={() => setActiveModal("laser")}
            className="flex-none w-[290px] sm:w-[320px] md:w-auto snap-start group cursor-pointer bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <Image
                  src="/images/custom/tool-laser-estimator.png"
                  alt="Laser Hair Removal Estimator - Treatment planner"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Treatment planner</span>
                </div>

                <div className="absolute top-3 right-3 bg-emerald-100/90 backdrop-blur-md text-emerald-900 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-300/80 shadow-sm">
                  US-FDA Triple Wave
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/30 text-white text-[10px]">
                  <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Area: {laserCycles[laserAreaIdx].area}
                    </span>
                    <span className="text-cyan-300">-4°C ICE Cooling</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded p-1.5 text-xs font-bold">
                    <span className="text-slate-300 font-normal text-[10px]">Package Rate:</span>
                    <span className="text-emerald-300">{laserCycles[laserAreaIdx].price}</span>
                    <span className="text-amber-300 text-[10px]">{laserCycles[laserAreaIdx].save}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors font-serif">
                  Laser Hair Removal Estimator
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Explore treatment areas and get an estimated plan based on your preferences.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2">
              <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white transition-all flex items-center justify-between font-bold text-xs shadow-sm">
                <span>Plan Treatment &amp; View Pricing Model</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

      </div>

      {activeModal === "skin" && (
        <SkinAnalyserModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "hair" && (
        <HairGraftModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "laser" && (
        <LaserEstimatorModal onClose={() => setActiveModal(null)} />
      )}

      <style jsx global>{`
        @keyframes scanner {
          0%, 100% { top: 0%; opacity: 0.8; }
          50% { top: 75%; opacity: 1; }
        }
      `}</style>
    </section>
  );
}

// =====================================================================
// SUBCOMPONENT: Skin Analyser Interactive Model
// =====================================================================
function SkinAnalyserModal({ onClose }: { onClose: () => void }) {
  const { addLead } = useAuth();
  const [gender, setGender] = useState<"Female" | "Male" | "Other">("Female");
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(["Combination"]);
  const [primaryConcern, setPrimaryConcern] = useState("Acne & Breakouts");
  const [ageGroup, setAgeGroup] = useState("20-30");
  const [sunExposure, setSunExposure] = useState("Moderate (1-3 hrs)");

  // Lead capture before revealing personalized treatment estimate
  const [patient, setPatient] = useState({ name: "", phone: "", location: "Noida" });
  const [formError, setFormError] = useState("");
  const [assessmentDone, setAssessmentDone] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal", "Acne-Prone"];
  const concerns = [
    "Acne & Breakouts",
    "Acne Scars & Texture",
    "Pigmentation / Melasma",
    "Dullness & Tan",
    "Fine Lines & Ageing",
    "Enlarged Open Pores"
  ];

  const toggleSkinType = (type: string) => {
    setSelectedSkinTypes((prev) => {
      if (prev.includes(type)) {
        return prev.length > 1 ? prev.filter((t) => t !== type) : prev;
      }
      return [...prev, type];
    });
  };

  const handleProceedToEstimate = () => {
    if (selectedSkinTypes.length === 0) {
      setFormError("Please select at least one skin type.");
      return;
    }
    setFormError("");
    setAssessmentDone(true);
  };

  const handleUnlockEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = patient.phone.replace(/\D/g, "");
    if (!patient.name.trim() || patient.name.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (cleanPhone.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setFormError("");

    const recommendation =
      primaryConcern === "Acne & Breakouts"
        ? "Active Salicylic Medical Peel + Carbon Laser Therapy"
        : primaryConcern === "Pigmentation / Melasma"
        ? "Q-Switched Nd:YAG Laser Toning + Tranexamic Infusion"
        : primaryConcern === "Acne Scars & Texture"
        ? "Subcision + MNRF (Micro-Needling Radio Frequency)"
        : "Signature Sugarcane HydraFacial MD & Glow Infusion";

    addLead({
      toolType: "Skin Analyser",
      name: patient.name.trim(),
      phone: cleanPhone,
      gender,
      age: ageGroup,
      skinTypes: selectedSkinTypes,
      primaryConcern,
      estimateSummary: `${recommendation} (${selectedSkinTypes.join(", ")} Skin • ${gender})`,
    });

    setLeadCaptured(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-brand-700 via-teal-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Clinical Skin Health Diagnostic Model</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">Comprehensive Skin Analysis</h3>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            By Our Team of Dermatologists
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {!assessmentDone ? (
            <>
              {/* Gender Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Select Gender:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["Female", "Male", "Other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`p-2.5 rounded-2xl text-xs font-bold border text-center transition-all ${
                        gender === g
                          ? "bg-brand-700 text-white border-brand-700 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Multi-Select Skin Type */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    2. Select Your Skin Type(s) (Multi-Selection Enabled):
                  </label>
                  <span className="text-[11px] font-semibold text-brand-700">
                    {selectedSkinTypes.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {skinTypes.map((type) => {
                    const isSelected = selectedSkinTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleSkinType(type)}
                        className={`p-3 rounded-2xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-brand-700 text-white border-brand-700 shadow-md"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{type}</span>
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-emerald-300" : "text-slate-300"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Primary Concern */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  3. Select Your Primary Skin Concern:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {concerns.map((con) => (
                    <button
                      key={con}
                      type="button"
                      onClick={() => setPrimaryConcern(con)}
                      className={`p-3 rounded-2xl text-xs font-semibold border text-left flex items-center gap-2 transition-all ${
                        primaryConcern === con
                          ? "bg-brand-700 text-white border-brand-700 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${primaryConcern === con ? "text-white" : "text-slate-300"}`} />
                      <span>{con}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Age & Sun */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Age Group
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-brand-700"
                  >
                    <option value="Under 20">Under 20</option>
                    <option value="20-30">20 - 30 Years</option>
                    <option value="31-45">31 - 45 Years</option>
                    <option value="46+">46+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Daily Sun Exposure
                  </label>
                  <select
                    value={sunExposure}
                    onChange={(e) => setSunExposure(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-brand-700"
                  >
                    <option value="Low (<1 hr)">Low (&lt; 1 hour/day)</option>
                    <option value="Moderate (1-3 hrs)">Moderate (1 - 3 hours/day)</option>
                    <option value="High (3+ hrs)">High (&gt; 3 hours/day)</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              <button
                type="button"
                onClick={handleProceedToEstimate}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-lg hover:shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Proceed to Personalized Skin Assessment</span>
              </button>
            </>
          ) : !leadCaptured ? (
            /* Lead Capture Gate Before Personalized Treatment Estimate */
            <form onSubmit={handleUnlockEstimate} className="space-y-5">
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-start gap-3">
                <Lock className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">
                    Unlock Your Personalized Skin Assessment &amp; Estimate
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Your clinical profile (<strong className="text-slate-900">{gender} • {selectedSkinTypes.join(", ")} • {primaryConcern}</strong>) is ready. Enter your details below to view your customized dermatological guidance.
                  </p>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-brand-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={patient.phone}
                    onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-brand-700"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                By proceeding, you consent to Skinfinity Derma storing your assessment profile to assist with your clinical consultation.
              </p>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setAssessmentDone(false)}
                  className="px-4 py-3 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>View Personalized Skin Estimate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Results Screen (No repeated form after submission) */
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                    Prepared for {patient.name} • By Our Team of Dermatologists
                  </span>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif mt-0.5">
                    Skin Health Score: 72 / 100
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Profile: <strong className="text-slate-900">{gender}</strong> • <strong className="text-slate-900">{selectedSkinTypes.join(" + ")} Skin</strong> • <strong className="text-slate-900">{primaryConcern}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAssessmentDone(false);
                    setLeadCaptured(false);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recommended Clinical Protocol (By Our Team of Dermatologists):
                </h5>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-brand-700 font-serif">
                    <Sparkles className="w-4 h-4 text-brand-700 shrink-0" />
                    <span>
                      {primaryConcern === "Acne & Breakouts"
                        ? "Active Salicylic Medical Peel + Carbon Laser Therapy"
                        : primaryConcern === "Pigmentation / Melasma"
                        ? "Q-Switched Nd:YAG Laser Toning + Tranexamic Infusion"
                        : primaryConcern === "Acne Scars & Texture"
                        ? "Subcision + MNRF (Micro-Needling Radio Frequency)"
                        : "Signature Sugarcane HydraFacial MD & Glow Infusion"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Targeted in-clinic dermatological care tailored for Fitzpatrick III–V skin types. Please note that this automated assessment provides educational guidance and is not a substitute for an in-person clinical diagnosis.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold block">✓ Assessment Saved for {patient.name} ({patient.phone})</span>
                  <span className="text-[11px] text-emerald-700">Our dermatology desk has received your skin profile and will assist with your consultation.</span>
                </div>
                <a
                  href="/contact-us#appointment_form"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-xs whitespace-nowrap hover:bg-brand-800"
                >
                  Appointment Request
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// =====================================================================
// SUBCOMPONENT: Hair & Baldness Assessment Interactive Model (Grades 1–5)
// =====================================================================
function HairGraftModal({ onClose }: { onClose: () => void }) {
  const { addLead } = useAuth();
  const [age, setAge] = useState("28");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [baldnessPattern, setBaldnessPattern] = useState("Hairline Recession");
  const [hairThickness, setHairThickness] = useState<"Thick" | "Medium" | "Thin">("Medium");
  const [hairLossDuration, setHairLossDuration] = useState("1 - 3 Years");
  const [grade, setGrade] = useState(2); // Strictly Grade 1 to Grade 5
  const [includeGfc, setIncludeGfc] = useState(true);

  // Lead Capture Gate
  const [step, setStep] = useState<"form" | "lead" | "results">("form");
  const [patient, setPatient] = useState({ name: "", phone: "" });
  const [formError, setFormError] = useState("");

  // Maximum 5 Grades: Grade 1 through Grade 5 (No Grade 6 or Grade 7)
  const grades = [
    { num: 1, title: "Grade 1", desc: "Minimal hairline recession with early follicular miniaturization", baseGrafts: 950, retentionPct: 85, crownRetention: 92 },
    { num: 2, title: "Grade 2", desc: "Symmetrical frontotemporal M-shaped recession", baseGrafts: 1500, retentionPct: 72, crownRetention: 85 },
    { num: 3, title: "Grade 3", desc: "Deepening frontal recession and noticeable temple thinning", baseGrafts: 2150, retentionPct: 58, crownRetention: 74 },
    { num: 4, title: "Grade 4", desc: "Pronounced frontal & mid-scalp thinning with vertex/crown loss", baseGrafts: 2850, retentionPct: 44, crownRetention: 55 },
    { num: 5, title: "Grade 5", desc: "Advanced fronto-vertex thinning separated by a narrow follicular bridge", baseGrafts: 3600, retentionPct: 32, crownRetention: 38 },
  ];

  const patterns = [
    "Hairline Recession",
    "Crown Thinning",
    "Top Thinning",
    "Diffuse Thinning"
  ];

  const durations = [
    "Less than 6 Months",
    "6 – 12 Months",
    "1 – 3 Years",
    "More than 3 Years"
  ];

  const currentGrade = grades[grade - 1];
  const thicknessMultiplier = hairThickness === "Thin" ? 1.15 : hairThickness === "Medium" ? 1.0 : 0.9;
  const patternMultiplier = baldnessPattern === "Diffuse Thinning" ? 1.1 : baldnessPattern === "Front + Crown" ? 1.08 : 1.0;
  const calculatedGrafts = Math.round(currentGrade.baseGrafts * thicknessMultiplier * patternMultiplier);
  const costPerGraft = 25;
  const totalCost = calculatedGrafts * costPerGraft + (includeGfc ? 12000 : 0);

  const handleProceedToLead = () => {
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 16 || parsedAge > 85) {
      setFormError("Please enter a valid age between 16 and 85.");
      return;
    }
    setFormError("");
    setStep("lead");
  };

  const handleUnlockEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = patient.phone.replace(/\D/g, "");
    if (!patient.name.trim() || patient.name.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (cleanPhone.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setFormError("");

    addLead({
      toolType: "Hair & Baldness Assessment",
      name: patient.name.trim(),
      phone: cleanPhone,
      gender,
      age,
      baldnessGrade: `Grade ${grade}`,
      baldnessPattern,
      hairThickness,
      hairLossDuration,
      estimateSummary: `Grade ${grade} (${baldnessPattern}, ${hairThickness} Hair) • ~${calculatedGrafts.toLocaleString()} Grafts • Est. ₹${totalCost.toLocaleString()}`,
    });

    setStep("results");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-brand-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>Clinical Trichology Assessment Model</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">Hair &amp; Baldness Assessment</h3>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            By Our Team of Dermatologists • Grade 1 to Grade 5 Follicular Evaluation
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {step === "form" && (
            <>
              {/* Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    1. Your Age (Years)
                  </label>
                  <input
                    type="number"
                    min={16}
                    max={85}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                    placeholder="e.g. 28"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    2. Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Male", "Female", "Other"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          gender === g
                            ? "bg-brand-700 text-white border-brand-700"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grade of Baldness (Grade 1 to Grade 5 ONLY) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    3. Select Grade of Baldness (Grade 1 – Grade 5):
                  </label>
                  <span className="text-xs font-bold text-brand-700">Grade {grade} Selected</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {grades.map((gr) => (
                    <button
                      key={gr.num}
                      type="button"
                      onClick={() => setGrade(gr.num)}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all border ${
                        grade === gr.num
                          ? "bg-brand-700 text-white border-brand-700 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {gr.title}
                    </button>
                  ))}
                </div>
                <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-900">{currentGrade.title}:</strong> {currentGrade.desc}
                </div>
              </div>

              {/* Pattern of Baldness */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  4. Pattern of Baldness:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {patterns.map((pat) => (
                    <button
                      key={pat}
                      type="button"
                      onClick={() => setBaldnessPattern(pat)}
                      className={`p-2.5 rounded-2xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                        baldnessPattern === pat
                          ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{pat}</span>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${baldnessPattern === pat ? "text-emerald-300" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Thickness & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    5. Existing Hair Thickness:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Thick", "Medium", "Thin"] as const).map((th) => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setHairThickness(th)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                          hairThickness === th
                            ? "bg-brand-700 text-white border-brand-700"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {th}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    6. Since when has hair loss occurred?
                  </label>
                  <select
                    value={hairLossDuration}
                    onChange={(e) => setHairLossDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
                  >
                    {durations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <button
                type="button"
                onClick={handleProceedToLead}
                className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Generate Baldness Grade Graphs &amp; Estimate</span>
              </button>
            </>
          )}

          {step === "lead" && (
            <form onSubmit={handleUnlockEstimate} className="space-y-5">
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-start gap-3">
                <Lock className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">
                    Enter Details to View Your Grade {grade} Assessment Graphs &amp; Estimate
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Selected Profile: <strong className="text-slate-900">Grade {grade} • {baldnessPattern} • {hairThickness} Hair ({hairLossDuration})</strong>.
                  </p>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={patient.name}
                    onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={patient.phone}
                    onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Your contact information is securely stored to coordinate your trichology consultation and share your personalised estimate.
              </p>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="px-4 py-3 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Unlock Grade {grade} Graphs &amp; Treatment Estimate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === "results" && (
            <div className="space-y-5">
              {/* Summary Header */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-teal-300 uppercase tracking-wider font-bold">
                    Assessment for {patient.name} ({gender}, {age} yrs)
                  </span>
                  <div className="text-xl font-extrabold font-serif text-white mt-0.5">
                    Grade {grade} Baldness • {baldnessPattern}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Hair Thickness: <strong>{hairThickness}</strong> • Duration: <strong>{hairLossDuration}</strong>
                  </p>
                </div>
                <div className="sm:text-right bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-teal-300 uppercase font-bold block">Est. Follicular Units</span>
                  <span className="text-lg font-extrabold font-serif text-amber-300">
                    ~{calculatedGrafts.toLocaleString()} Grafts
                  </span>
                  <span className="block text-[10px] text-slate-300">Est. ₹{totalCost.toLocaleString()}*</span>
                </div>
              </div>

              {/* Interactive Baldness Grade Graphs */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-brand-700" />
                    <span>Follicular Density &amp; Restoration Projection (Grade {grade})</span>
                  </h5>
                  <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    Live Assessment Graph
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700">Current Frontal / Temple Follicle Retention</span>
                      <span className="font-bold text-slate-900">{currentGrade.retentionPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentGrade.retentionPct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700">Crown &amp; Mid-Scalp Density Index ({hairThickness} Shaft)</span>
                      <span className="font-bold text-slate-900">{currentGrade.crownRetention}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${currentGrade.crownRetention}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700">Projected Post-Restoration Coverage (FUE + GFC)</span>
                      <span className="font-bold text-emerald-700">{Math.min(96, currentGrade.retentionPct + 38)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(96, currentGrade.retentionPct + 38)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Grade 1 to Grade 5 Comparison Bar Chart */}
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Graft Requirement Across Grades 1 – 5 (Your Grade Highlighted)
                  </span>
                  <div className="grid grid-cols-5 gap-2 items-end h-24 pt-2 px-2 bg-white rounded-xl border border-slate-100">
                    {grades.map((g) => {
                      const heightPct = Math.round((g.baseGrafts / 3600) * 100);
                      const isCurrent = g.num === grade;
                      return (
                        <div key={g.num} className="flex flex-col items-center justify-end h-full gap-1">
                          <span className={`text-[9px] font-bold ${isCurrent ? "text-brand-700" : "text-slate-400"}`}>
                            {g.baseGrafts}
                          </span>
                          <div
                            className={`w-full rounded-t-md transition-all ${
                              isCurrent ? "bg-brand-700" : "bg-slate-200"
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                          <span className={`text-[10px] font-bold ${isCurrent ? "text-brand-700" : "text-slate-500"}`}>
                            G{g.num}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Educational Guidance Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Educational Guidance Note:</strong> This automated Grade {grade} assessment is for general educational guidance only and does not constitute a definitive medical diagnosis. In-person video trichoscopy by our dermatologists is recommended to evaluate donor follicle density and scalp health.
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Modify Assessment
                </button>
                <a
                  href="/contact-us#appointment_form"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-sm"
                >
                  Appointment Request
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// =====================================================================
// SUBCOMPONENT: Laser Price Estimator Interactive Model
// =====================================================================
function LaserEstimatorModal({ onClose }: { onClose: () => void }) {
  const { addLead } = useAuth();
  const [gender, setGender] = useState<"female" | "male">("female");
  const [selectedArea, setSelectedArea] = useState<string>("Underarms");
  const [sessions, setSessions] = useState<number>(6);
  const [booked, setBooked] = useState(false);
  const [patient, setPatient] = useState({ name: "", phone: "" });

  const pricingData: Record<string, { female: number; male: number; duration: string }> = {
    "Upper Lip & Chin": { female: 1499, male: 1999, duration: "15 Mins" },
    "Underarms": { female: 1999, male: 2499, duration: "20 Mins" },
    "Full Face": { female: 3499, male: 4299, duration: "30 Mins" },
    "Bikini Line / Intimate": { female: 3999, male: 4999, duration: "30 Mins" },
    "Full Arms & Hands": { female: 4999, male: 5999, duration: "45 Mins" },
    "Full Legs & Feet": { female: 6999, male: 8499, duration: "60 Mins" },
    "Full Body Gold Package": { female: 14999, male: 17999, duration: "120 Mins" }
  };

  const current = pricingData[selectedArea] || pricingData["Underarms"];
  const singleSessionPrice = current[gender];

  let discountPct = 0;
  if (sessions === 3) discountPct = 15;
  if (sessions === 6) discountPct = 35;

  const rawTotal = singleSessionPrice * sessions;
  const discountedTotal = Math.round(rawTotal * (1 - discountPct / 100));
  const savings = rawTotal - discountedTotal;

  const handleBookLaser = () => {
    if (!patient.name.trim() || patient.phone.replace(/\D/g, "").length < 10) {
      return;
    }
    addLead({
      toolType: "Laser Estimator",
      name: patient.name.trim(),
      phone: patient.phone.replace(/\D/g, ""),
      gender: gender === "female" ? "Female" : "Male",
      estimateSummary: `${selectedArea} (${sessions} Sessions) • ₹${discountedTotal.toLocaleString()}`,
    });
    setBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-brand-700 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>US-FDA Triple Wavelength Laser Pricing Model</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">Laser Hair Removal Estimator</h3>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            By Our Team of Dermatologists • Ice Cool Soprano Titanium Technology
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Gender:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`p-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    gender === g
                      ? "bg-brand-700 text-white border-brand-700 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {g === "female" ? "Female Patient" : "Male Patient"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Treatment Area:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(pricingData).map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSelectedArea(area)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                    selectedArea === area
                      ? "bg-brand-700 text-white border-brand-700 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="block line-clamp-1">{area}</span>
                  <span className={`text-[10px] block ${selectedArea === area ? "text-teal-200" : "text-slate-400"}`}>
                    ₹{pricingData[area][gender]} / ses
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Session Plan:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { s: 1, label: "1 Session", tag: "Trial / Single" },
                { s: 3, label: "3 Sessions", tag: "15% OFF" },
                { s: 6, label: "6 Sessions", tag: "35% OFF (Recommended)" },
              ].map((item) => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setSessions(item.s)}
                  className={`p-3 rounded-2xl text-xs font-semibold border text-center transition-all ${
                    sessions === item.s
                      ? "bg-brand-700 text-white border-brand-700 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="block font-bold">{item.label}</span>
                  <span className="text-[10px] font-bold text-amber-400">{item.tag}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-teal-300 uppercase tracking-wider font-bold">Total Estimated Package</span>
                <div className="text-2xl font-extrabold font-serif text-white mt-0.5">
                  ₹{discountedTotal.toLocaleString()}
                </div>
                {discountPct > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{rawTotal.toLocaleString()}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div className="text-right bg-emerald-500/20 border border-emerald-400/40 p-2.5 rounded-xl">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold block">Instant Savings</span>
                  <span className="text-base font-extrabold text-emerald-300">₹{savings.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="text-[11px] text-slate-300 border-t border-slate-800 pt-2 flex items-center justify-between">
              <span>Duration: ~{current.duration} per visit</span>
              <span>Flexible EMI: ~₹{Math.round(discountedTotal / 6).toLocaleString()}/mo</span>
            </div>
          </div>

          {!booked ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Full Name *"
                  value={patient.name}
                  onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                  className="p-3 text-xs rounded-xl border border-slate-200"
                />
                <input
                  type="tel"
                  placeholder="10-Digit Mobile Number *"
                  value={patient.phone}
                  onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                  className="p-3 text-xs rounded-xl border border-slate-200"
                />
              </div>
              <button
                type="button"
                onClick={handleBookLaser}
                className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md hover:shadow-glow transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Get a Free Consultation</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
              ✓ Package enquiry saved! Our clinic team will connect with you to schedule your consultation.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
