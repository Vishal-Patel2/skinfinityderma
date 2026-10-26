"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Gift, 
  Star 
} from "lucide-react";
import { MEMBERSHIP_PLANS } from "@/data/clinicData";
import AppointmentForm from "@/components/modals/AppointmentForm";

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState("gold");

  return (
    <div className="bg-white">
      {/* Breadcrumb Header */}
      <div className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">Premium Membership Tiers</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="py-14 lg:py-20 bg-gradient-to-b from-amber-50/50 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold border border-amber-300 mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Skinfinity Derma Privilege Club</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif">
            VIP Aesthetic & Skin Health Memberships
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Invest in year-round clinical radiance. Enjoy complimentary signature medi-facials, priority doctor consultations, and exclusive discounts on US-FDA lasers and injectables.
          </p>
        </div>
      </section>

      {/* Pricing Cards with Distinct Visual Membership Passes */}
      <section className="py-16 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MEMBERSHIP_PLANS.map((plan, idx) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 border-2 shadow-lg transition-all flex flex-col justify-between relative overflow-hidden ${
                  plan.cardBg || "bg-white border-slate-200"
                }`}
              >
                <div className="space-y-5">
                  {/* Visual Luxury Membership Pass Card */}
                  <div
                    className={`rounded-2xl p-5 bg-gradient-to-br ${
                      plan.passGradient || "from-slate-700 to-slate-900 text-white"
                    } shadow-md relative overflow-hidden`}
                  >
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">
                        SKINFINITY PRIVILEGE PASS
                      </span>
                      <Crown className="w-4 h-4 opacity-90" />
                    </div>

                    <div className="my-3">
                      <span
                        className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 ${
                          plan.badgeStyle || "bg-white/20 text-white border-white/30"
                        }`}
                      >
                        {plan.popular ? "Most Popular Tier" : `Tier 0${idx + 1} Pass`}
                      </span>
                      <h3 className="text-xl font-extrabold font-serif tracking-tight">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-white/20 flex items-end justify-between">
                      <div>
                        <span className="block text-[9px] uppercase tracking-widest opacity-75">
                          Annual Membership Fee
                        </span>
                        <span className="text-2xl font-black font-serif">{plan.price}</span>
                        <span className="text-[11px] opacity-80 ml-1">{plan.period}</span>
                      </div>
                      <span className="text-[10px] font-mono tracking-widest opacity-85">
                        •••• {2026 + idx * 111}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{plan.tagline}</p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-200/70">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Included Member Privileges:
                    </span>
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.id === "gold"
                              ? "text-amber-600"
                              : plan.id === "platinum"
                              ? "text-emerald-700"
                              : "text-slate-600"
                          }`}
                        />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/70">
                  <a
                    href="#enroll"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs text-center block transition-all shadow-sm ${
                      plan.buttonStyle || "bg-brand-700 hover:bg-brand-800 text-white font-bold"
                    }`}
                  >
                    Enroll in {plan.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Booking Form */}
      <section id="enroll" className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm initialTreatment="General Dermatologist Consultation" />
        </div>
      </section>
    </div>
  );
}
