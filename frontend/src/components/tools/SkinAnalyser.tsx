"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw,
  Activity,
  Calendar,
  Lock
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SkinAnalyser() {
  const { addLead } = useAuth();
  const [gender, setGender] = useState<"Female" | "Male" | "Other">("Female");
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(["Combination"]);
  const [primaryConcern, setPrimaryConcern] = useState("Acne & Bumps");
  const [ageGroup, setAgeGroup] = useState("20-30");
  const [sunExposure, setSunExposure] = useState("Moderate (1-3 hrs)");
  
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    phone: "",
    email: "",
    location: "Noida"
  });

  const [step, setStep] = useState<"form" | "lead" | "results">("form");
  const [formError, setFormError] = useState("");

  const toggleSkinType = (type: string) => {
    setSelectedSkinTypes((prev) => {
      if (prev.includes(type)) {
        return prev.length > 1 ? prev.filter((t) => t !== type) : prev;
      }
      return [...prev, type];
    });
  };

  const calculateReport = () => {
    let score = 72;
    let recommendation = "Sugarcane HydraFacial + Salicylic Medical Peel";
    let planSummary = "Mild to moderate epidermal congestion with early barrier dehydration.";

    if (primaryConcern === "Acne & Bumps") {
      score = 64;
      recommendation = "Active Acne Protocol (Salicylic Peel + Blue LED Therapy + Carbon Laser)";
      planSummary = "Active follicular inflammation with sebum hyperactivity requiring gentle keratolytics.";
    } else if (primaryConcern === "Pigmentation / Melasma") {
      score = 68;
      recommendation = "Q-Switched Nd:YAG Laser Toning + Tranexamic Acid Medical Infusion";
      planSummary = "Deep dermal melanocyte hyper-activity aggravated by UV exposure.";
    } else if (primaryConcern === "Acne Scars / Texture") {
      score = 60;
      recommendation = "Subcision + Micro-Needling Radio Frequency (MNRF) Collagen Remodeling";
      planSummary = "Dermal tethering and atrophic tissue loss requiring fractional collagen stimulation.";
    } else if (primaryConcern === "Dullness / Tanning") {
      score = 76;
      recommendation = "Signature Sugarcane HydraFacial with Pure Glycolic Actives";
      planSummary = "Superficial dead cell stratum accumulation and UV tan.";
    } else if (primaryConcern === "Fine Lines & Ageing") {
      score = 66;
      recommendation = "HIFU Ultrasound Skin Tightening + Hyaluronic Skin Boosters";
      planSummary = "Gradual elastin reduction and SMAS laxity responsive to non-surgical lifting.";
    }

    return { score, recommendation, planSummary };
  };

  const report = calculateReport();

  const handleUnlockEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = patientDetails.phone.replace(/\D/g, "");
    if (!patientDetails.name.trim() || patientDetails.name.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (cleanPhone.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setFormError("");

    addLead({
      toolType: "Skin Analyser",
      name: patientDetails.name.trim(),
      phone: cleanPhone,
      gender,
      age: ageGroup,
      skinTypes: selectedSkinTypes,
      primaryConcern,
      estimateSummary: `${report.recommendation} (Score: ${report.score}/100)`,
    });

    setStep("results");
  };

  return (
    <section id="skin-analyser" className="py-16 lg:py-24 bg-gradient-to-b from-white via-brand-50/30 to-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
            By Our Team of Dermatologists
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
            Interactive Skin Health Analyser Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Identify your multi-factor skin profile and receive an educational dermatology assessment tailored for Indian skin.
          </p>
        </div>

        {/* Analyser Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-10">
          
          {step === "form" && (
            <div className="space-y-8">
              {/* Gender Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  1. Select Your Gender
                </label>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {(["Female", "Male", "Other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all ${
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
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. What describes your skin type? (Select all that apply)
                  </label>
                  <span className="text-xs font-bold text-brand-700">
                    {selectedSkinTypes.join(", ")}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {["Oily", "Dry", "Combination", "Sensitive", "Normal", "Acne-Prone"].map((t) => {
                    const isSelected = selectedSkinTypes.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleSkinType(t)}
                        className={`py-3 px-3 rounded-xl text-xs font-semibold border flex items-center justify-between gap-1.5 transition-all ${
                          isSelected
                            ? "bg-brand-700 text-white border-brand-700 shadow-md"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{t}</span>
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-emerald-300" : "text-slate-300"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Primary Concern */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  3. What is your primary dermatological concern?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    "Acne & Bumps",
                    "Acne Scars / Texture",
                    "Pigmentation / Melasma",
                    "Dullness / Tanning",
                    "Fine Lines & Ageing",
                    "Enlarged Open Pores"
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPrimaryConcern(c)}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold border text-left transition-all ${
                        primaryConcern === c
                          ? "bg-brand-700 text-white border-brand-700 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4 & 5: Age & Sun Exposure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    4. Age Group
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Under 20", "20-30", "31-40", "41-50", "50+"].map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAgeGroup(a)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                          ageGroup === a
                            ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    5. Daily Sun &amp; UV Exposure
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Low (<1 hr)", "Moderate (1-3 hrs)", "High (>3 hrs)"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSunExposure(s)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                          sunExposure === s
                            ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep("lead")}
                  className="px-8 py-3.5 rounded-full text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md hover:shadow-glow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Activity className="w-4 h-4" />
                  <span>Proceed to Personalized Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === "lead" && (
            <form onSubmit={handleUnlockEstimate} className="space-y-6 max-w-xl mx-auto py-4">
              <div className="p-5 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Enter Your Details to View Your Personalized Treatment Estimate
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Profile Selected: <strong className="text-slate-900">{gender} • {selectedSkinTypes.join(", ")} Skin • {primaryConcern}</strong>.
                  </p>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={patientDetails.phone}
                    onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-full text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md transition-all flex items-center gap-2"
                >
                  <span>View Personalized Skin Estimate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === "results" && (
            <div className="space-y-8">
              {/* Score Display Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 rounded-full bg-brand-700 text-white flex flex-col items-center justify-center shadow-lg shrink-0">
                    <span className="text-2xl font-black font-serif leading-none">{report.score}</span>
                    <span className="text-[10px] uppercase font-bold text-brand-200 mt-0.5">/ 100</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100/60 px-2.5 py-0.5 rounded">
                      Prepared for {patientDetails.name} ({gender})
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-serif mt-1">
                      {selectedSkinTypes.join(" + ")} Skin • {primaryConcern} Focus
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-md">
                      {report.planSummary}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStep("form")}
                  className="text-xs font-bold text-slate-600 hover:text-brand-700 flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </button>
              </div>

              {/* Recommended Protocol */}
              <div className="p-6 rounded-2xl bg-brand-50/50 border border-brand-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Recommended Clinical Protocol — By Our Team of Dermatologists</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 font-serif">
                  {report.recommendation}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Tailored specifically for Indian skin tone (Fitzpatrick III-V) to prevent rebound hyperpigmentation and preserve epidermal moisture integrity. Note: This automated assessment provides educational guidance and is not a substitute for an in-person clinical evaluation.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-serif">
                    ✓ Assessment Saved for {patientDetails.name} ({patientDetails.phone})
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Our clinic coordinator will assist you with scheduling your 1-on-1 dermatologist consultation at Noida or Gurgaon.
                  </p>
                </div>
                <a
                  href="#appointment_form"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Appointment Request</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
