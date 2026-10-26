"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Calendar,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LaserPriceEstimator() {
  const { openEmiModal } = useAuth();
  const [gender, setGender] = useState<"female" | "male">("female");
  const [selectedArea, setSelectedArea] = useState<string>("Underarms");
  const [sessions, setSessions] = useState<number>(6);

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
  const monthlyEmi = Math.round(discountedTotal / 6);

  return (
    <section id="laser-estimator" className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
            By Our Team of Dermatologists • Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
            Laser Hair Removal Price Estimator Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Calculate package pricing for triple-wavelength US-FDA painless laser hair reduction with sapphire contact cooling.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-slate-50/80 rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Gender Switch */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Gender:
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                      gender === "female"
                        ? "bg-brand-700 text-white border-brand-700 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                      gender === "male"
                        ? "bg-brand-700 text-white border-brand-700 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Male
                  </button>
                </div>
              </div>

              {/* Area Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Choose Treatment Area:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.keys(pricingData).map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => setSelectedArea(area)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                        selectedArea === area
                          ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sessions Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  3. Select Session Package:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { count: 1, label: "Single Trial", disc: "Standard Rate" },
                    { count: 3, label: "3 Sessions", disc: "Save 15%" },
                    { count: 6, label: "6 Sessions (Full)", disc: "Save 35% ★" }
                  ].map((s) => (
                    <button
                      key={s.count}
                      type="button"
                      onClick={() => setSessions(s.count)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        sessions === s.count
                          ? "bg-white border-brand-700 ring-2 ring-brand-700/20 shadow-md"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{s.label}</div>
                      <div className="text-[10px] font-semibold text-amber-600 mt-0.5">{s.disc}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded">
                  US-FDA Triple Laser
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {current.duration} per session
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  {selectedArea} ({gender === "female" ? "Female" : "Male"})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Package for {sessions} {sessions === 1 ? "Session" : "Sessions"}
                </p>
              </div>

              <div className="py-4 border-y border-slate-100 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Standard Price:</span>
                  <span className="line-through">₹{rawTotal.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                    <span>Package Savings ({discountPct}% Off):</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase">Estimated Total:</span>
                  <span className="text-2xl font-black text-brand-700 font-serif">
                    ₹{discountedTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Flexible EMI starting ~₹{monthlyEmi.toLocaleString()}/mo
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      openEmiModal({
                        treatmentName: `Laser Hair Reduction — ${selectedArea} (${sessions} Sessions)`,
                        priceFormatted: `₹${discountedTotal.toLocaleString()}`,
                        emiMonthly: `₹${monthlyEmi.toLocaleString()}/mo`,
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:text-brand-900 underline"
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>Apply for EMI</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                  <span>Integrated Sapphire Contact Cooling (Pain-Free)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                  <span>Safe for all Fitzpatrick III to V skin tones</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                  <span>Administered under MD Dermatologist supervision</span>
                </div>
              </div>

              <Link
                href="/contact-us#appointment_form"
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md flex items-center justify-center gap-2 transition-all block text-center"
              >
                <Calendar className="w-4 h-4" />
                <span>Get a Free Consultation</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
