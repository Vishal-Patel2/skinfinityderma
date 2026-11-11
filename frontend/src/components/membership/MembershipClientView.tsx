"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Star,
  Phone,
  MessageCircle,
  CreditCard,
  Minus,
  ChevronDown,
  Award,
} from "lucide-react";
import { MembershipPlan } from "@/data/clinicData";
import AppointmentForm from "@/components/modals/AppointmentForm";
import SectionDivider from "@/components/shared/SectionDivider";
import { useAuth } from "@/context/AuthContext";

interface MembershipClientViewProps {
  initialPlans: MembershipPlan[];
}

interface DynamicComparisonRow {
  feature: string;
  highlight?: boolean;
  values: Record<string, string | boolean>;
}

const FAQS = [
  {
    q: "How do I activate my Skinfinity Derma Privilege Membership?",
    a: "Upon completing enrollment online or at our clinics in Noida or Gurgaon, your digital membership pass is activated immediately. You can start redeeming your complimentary medi-facials and enjoying discounts right away.",
  },
  {
    q: "Can I share my membership benefits with family members?",
    a: "Yes! The Gold Prestige Club allows complimentary consultations and benefits for yourself plus up to 2 family members. The Platinum VIP Elite offers comprehensive family coverage and unlimited consultations.",
  },
  {
    q: "Are the membership benefits valid at both Noida and Gurgaon clinics?",
    a: "Absolutely. Your Skinfinity Privilege Pass is universally valid across all Skinfinity Derma flagship centers, including our Noida Sector 36 and Gurgaon Sector 28 clinics.",
  },
  {
    q: "Which treatments are eligible for the membership discounts?",
    a: "All US-FDA approved laser hair reduction, Q-Switched laser toning, chemical & organic peels, HydraFacials, and anti-aging treatments are covered under the flat discount structure. In Gold and Platinum tiers, injectables like Botox, Juvederm, and Profhilo are also discounted.",
  },
  {
    q: "How do complimentary medi-facials work?",
    a: "Complimentary treatments can be scheduled at your convenience throughout your 12-month membership period. Simply book via your dedicated WhatsApp concierge or call our clinic desk.",
  },
  {
    q: "What is the Orange Health pathology lab benefit?",
    a: "Because internal hormonal balance and nutritional levels directly dictate skin and hair health, Gold members receive complimentary home blood sample collection, while Platinum members receive an in-depth clinical skin & hormone diagnostic panel.",
  },
];

const MEMBER_REVIEWS = [
  {
    name: "Pooja Malhotra",
    tier: "Gold Prestige Club Member",
    clinic: "Gurgaon Flagship",
    text: "The Gold membership pays for itself with the 3 HydraFacials alone! Having priority appointments and 15% off laser toning has transformed my skin routine without breaking the bank.",
    rating: 5,
  },
  {
    name: "Dr. Rohit Aggarwal",
    tier: "Platinum VIP Elite Member",
    clinic: "Noida Sector 36",
    text: "As someone who values sterile protocols and expert dermatologist supervision, the Platinum pass is unmatched. The private treatment suite and inclusive family consultations are brilliant.",
    rating: 5,
  },
  {
    name: "Ananya Sen",
    tier: "Gold Prestige Club Member",
    clinic: "Noida Sector 36",
    text: "Enrolled before my wedding year. The birthday gift, the Orange Health blood tests, and the continuous discounts on peels saved me over ₹45,000 across my bridal aesthetic roadmap.",
    rating: 5,
  },
];

export default function MembershipClientView({ initialPlans }: MembershipClientViewProps) {
  const { openAppointmentModal } = useAuth();
  const [plans] = useState<MembershipPlan[]>(initialPlans);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    initialPlans.find((p) => p.popular)?.id || initialPlans[0]?.id || "gold"
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) || plans[0];
  }, [plans, selectedPlanId]);

  // Dynamically generate comparison table rows based on real database plans and their features
  const dynamicComparisonRows = useMemo(() => {
    if (!plans || plans.length === 0) return [];

    const rows: DynamicComparisonRow[] = [
      {
        feature: "Annual Privilege Investment",
        highlight: true,
        values: Object.fromEntries(plans.map((p) => [p.id, `${p.price} ${p.period || "/ year"}`])),
      },
      {
        feature: "Validity Period",
        values: Object.fromEntries(plans.map((p) => [p.id, p.validity || "12 Months Validity"])),
      },
      {
        feature: "Plan Focus & Tagline",
        values: Object.fromEntries(plans.map((p) => [p.id, p.tagline || "Clinical Maintenance"])),
      },
    ];

    // Standard clinical privileges dimensions to extract from each plan's features list
    const dimensionMatchers = [
      {
        name: "Complimentary Medi-Facials & Lasers",
        highlight: true,
        pattern: /(hydrafacial|medi-facial|facial|laser toning|complimentary)/i,
      },
      {
        name: "US-FDA Lasers & Anti-Ageing Discount",
        pattern: /(laser|peel|anti-ageing|flat discount)/i,
      },
      {
        name: "Botox, Dermal Fillers & Injectables",
        pattern: /(botox|filler|profhilo|injectable)/i,
      },
      {
        name: "MD Dermatologist Consultations",
        highlight: true,
        pattern: /(consultation|doctor)/i,
      },
      {
        name: "Digital Dermoscopy Skin & Hair Diagnostics",
        pattern: /(analysis|diagnostic|dermoscopy)/i,
      },
      {
        name: "Orange Health Pathology Lab Integration",
        pattern: /(orange health|pathology|blood|sample)/i,
      },
      {
        name: "Priority Hotline & VIP Concierge Booking",
        pattern: /(priority|whatsapp|hotline|concierge|suite)/i,
      },
      {
        name: "Bespoke Gifts & Post-Care Skincare Kit",
        pattern: /(gift|kit|masterclass|birthday)/i,
      },
    ];

    dimensionMatchers.forEach((dim) => {
      const rowValues: Record<string, string | boolean> = {};
      let hasAny = false;

      plans.forEach((plan) => {
        const found = (plan.features || []).find((f) => dim.pattern.test(f));
        if (found) {
          rowValues[plan.id] = found;
          hasAny = true;
        } else {
          rowValues[plan.id] = false;
        }
      });

      if (hasAny) {
        rows.push({
          feature: dim.name,
          highlight: dim.highlight,
          values: rowValues,
        });
      }
    });

    return rows;
  }, [plans]);

  const handleEnrollClick = (plan: MembershipPlan) => {
    setSelectedPlanId(plan.id);
    const target = document.getElementById("enroll");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDirectModal = (planName: string) => {
    openAppointmentModal(`VIP Membership Enrollment - ${planName}`);
  };

  return (
    <div className="bg-white text-slate-900">
      {/* ── 1. BREADCRUMB NAVIGATION ── */}
      <div className="bg-slate-50/80 border-b border-slate-200/60 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#008081] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">
              VIP Membership Club
            </span>
          </nav>
        </div>
      </div>

      {/* ── 2. HERO SECTION ── */}
      <section className="relative pt-12 pb-14 lg:pt-16 lg:pb-20 bg-gradient-to-b from-amber-50/60 via-amber-50/20 to-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 bg-gradient-to-r from-amber-200/20 via-yellow-100/30 to-teal-100/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-amber-50 to-yellow-100 border border-amber-300/80 text-amber-950 text-xs font-extrabold uppercase tracking-widest shadow-xs mb-4">
            <Crown className="w-4 h-4 text-amber-600" />
            <span>Skinfinity Derma Privilege Club</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif leading-tight max-w-4xl mx-auto">
            VIP Aesthetic &amp; Skin Health{" "}
            <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
              Memberships
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            Invest in year-round clinical radiance. Enjoy complimentary signature
            medi-facials, priority doctor consultations, and exclusive savings
            on US-FDA lasers and injectables across Noida &amp; Gurgaon.
          </p>

          {/* Trust Highlights Strip */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { label: "1,00,000+ Treated Patients", icon: ShieldCheck },
              { label: "14+ Years Clinical Mastery", icon: Award },
              { label: "4.8★ Rating (3,500+ Reviews)", icon: Star },
              { label: "Priority WhatsApp Concierge", icon: MessageCircle },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-white border border-amber-200/60 shadow-xs text-xs font-semibold text-slate-800"
                >
                  <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. DYNAMIC PRIVILEGE TIERS (EQUAL HEIGHT & WIDTH CARDS) ── */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3.5 py-1 rounded-full border border-amber-300">
              Curated Privilege Tiers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Select Your Privilege Tier
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every pass is fully personalized, digitally activated, and honored at all Skinfinity Derma clinics.
            </p>
          </div>

          {/* Equal Dimension Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, idx) => {
              const isPopular = Boolean(plan.popular);

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col h-full rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${
                    isPopular
                      ? "border-amber-400 ring-2 ring-amber-400/50 shadow-xl bg-white relative z-10"
                      : "border-slate-200/90 shadow-md bg-white hover:border-slate-300"
                  }`}
                >
                  {/* Card Top / Metallic Pass Header (Fixed consistent height) */}
                  <div
                    className={`relative p-6 text-white overflow-hidden shrink-0 h-[190px] flex flex-col justify-between ${
                      plan.passGradient || "bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700"
                    }`}
                  >
                    {/* Metallic Glow */}
                    <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
                        SKINFINITY PRIVILEGE PASS
                      </span>
                      <Crown className="w-4 h-4 text-white/90" />
                    </div>

                    <div className="flex items-center gap-3 my-1">
                      <div className="w-9 h-6 rounded-md bg-gradient-to-tr from-amber-200 to-yellow-100 border border-amber-300 shadow-inner flex items-center justify-center">
                        <div className="w-5 h-3 border border-amber-400/80 rounded-xs" />
                      </div>
                      <span className="text-[10px] font-mono tracking-widest text-white/80">
                        •••• {2026 + idx * 111}
                      </span>
                    </div>

                    <div>
                      <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 mb-1">
                        {plan.validity || "12 Months Validity"}
                      </span>
                      <h3 className="text-xl font-extrabold font-serif tracking-tight text-white line-clamp-1">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body - flex-1 flex flex-col justify-between to keep CTA aligned at bottom */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                    <div className="flex-1 flex flex-col">
                      {/* Tagline / Subtitle */}
                      <p className="text-xs text-slate-600 leading-relaxed min-h-[40px] mb-4">
                        {plan.tagline || "Clinical aesthetic privilege pass."}
                      </p>

                      {/* Price Block */}
                      <div className="mb-5 pb-4 border-b border-slate-100 flex items-baseline justify-between">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                            Annual Privilege Fee
                          </span>
                          <span className="text-3xl font-extrabold font-serif text-slate-900">
                            {plan.price}
                          </span>
                          <span className="text-xs text-slate-500 font-medium ml-1">
                            {plan.period || "/ year"}
                          </span>
                        </div>
                        {isPopular && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 border border-amber-400 shadow-xs">
                            ⭐ Most Popular
                          </span>
                        )}
                      </div>

                      {/* Benefits List (6-7 benefits supported) */}
                      <div className="space-y-3 mb-6 flex-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                          Included Privileges ({(plan.features || []).length} points):
                        </span>
                        {(plan.features || []).map((feature, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                            <span className="break-words leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions - Pinned to bottom of card */}
                    <div className="pt-4 border-t border-slate-100 mt-auto space-y-2">
                      <button
                        type="button"
                        onClick={() => handleEnrollClick(plan)}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs text-center font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
                          plan.buttonStyle || (isPopular ? "bg-amber-500 hover:bg-amber-600 text-slate-950 font-black" : "bg-slate-900 hover:bg-black text-white")
                        }`}
                      >
                        Enroll in {plan.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDirectModal(plan.name)}
                        className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-[#008081] transition-colors py-1 cursor-pointer block"
                      >
                        Instant Doctor Booking with this Pass →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 4. HOW MEMBERSHIP WORKS (3 STEPS) ── */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008081] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
              Simple 3-Step Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 font-serif">
              How Your Skinfinity Privilege Pass Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Select & Activate Pass",
                description:
                  "Choose your desired tier online or at our Noida/Gurgaon clinics. Your digital membership pass activates instantly.",
                icon: Crown,
              },
              {
                step: "02",
                title: "Dermatologist Consultation",
                description:
                  "Meet with our expert MD dermatologists for a root-cause skin & hair diagnosis and custom clinical roadmap.",
                icon: ShieldCheck,
              },
              {
                step: "03",
                title: "Enjoy Year-Round Benefits",
                description:
                  "Redeem complimentary medi-facials and enjoy flat savings on US-FDA lasers and treatments all year long.",
                icon: Sparkles,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 shadow-xs relative overflow-hidden"
                >
                  <span className="text-4xl font-extrabold font-serif text-slate-200 absolute top-4 right-4">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-5 border border-amber-300/60 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 5. FULLY DYNAMIC PLAN COMPARISON TABLE ── */}
      <section className="py-12 lg:py-16 bg-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3.5 py-1 rounded-full border border-amber-300">
              Detailed Feature Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Compare Membership Privileges
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Transparent, database-driven comparison across all active tiers with zero hidden costs.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80">
                    <th className="py-4 px-5 font-bold text-slate-800 min-w-[200px]">
                      Privilege / Service
                    </th>
                    {plans.map((p) => {
                      const isPop = Boolean(p.popular);
                      return (
                        <th
                          key={p.id}
                          className={`py-4 px-4 font-bold text-center min-w-[160px] ${
                            isPop
                              ? "bg-amber-50/80 text-amber-900 border-x border-amber-200/70 font-black"
                              : "text-slate-800"
                          }`}
                        >
                          {isPop && "⭐ "}
                          {p.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dynamicComparisonRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={
                        row.highlight
                          ? "bg-amber-50/20 font-medium"
                          : "hover:bg-slate-50/50"
                      }
                    >
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {row.feature}
                      </td>
                      {plans.map((plan) => {
                        const val = row.values[plan.id];
                        const isPop = Boolean(plan.popular);
                        return (
                          <td
                            key={plan.id}
                            className={`py-3.5 px-4 text-center ${
                              isPop
                                ? "bg-amber-50/40 border-x border-amber-200/50 font-bold text-amber-950"
                                : "text-slate-700"
                            }`}
                          >
                            {val === false ? (
                              <Minus className="w-4 h-4 mx-auto text-slate-300" />
                            ) : val === true ? (
                              <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-600" />
                            ) : (
                              <span>{String(val)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 6. VERIFIED MEMBER TESTIMONIALS ── */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3.5 py-1 rounded-full border border-amber-300">
              Real Patient Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Loved by Our VIP Members
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MEMBER_REVIEWS.map((review, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70">
                  <span className="font-bold text-slate-900 block text-xs">
                    {review.name}
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold block">
                    {review.tier}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {review.clinic}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 7. FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <section className="py-12 lg:py-16 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200/80 px-3.5 py-1 rounded-full border border-slate-300">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Membership FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-amber-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 8. ENROLLMENT & INSTANT CONCIERGE BOOKING ── */}
      <section id="enroll" className="py-14 lg:py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>Instant Privilege Activation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif">
              Enroll in {selectedPlan?.name || "VIP Membership"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete your appointment details below. Our senior clinic
              coordinator will activate your digital pass and confirm your first
              complimentary doctor consultation.
            </p>

            {/* Selected Plan Pill Bar */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-2">
              {plans.map((p) => {
                const isSelected = p.id === selectedPlanId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {p.name} ({p.price})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
            <AppointmentForm
              initialTreatment={`VIP Membership - ${selectedPlan?.name || "Gold Prestige Club"} (${selectedPlan?.price || ""})`}
              className="text-slate-900"
            />
          </div>

          {/* Direct WhatsApp Concierge Help */}
          <div className="mt-8 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>Noida Desk: +91 98719 41444</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-400" />
              <span>Gurgaon Desk: +91 85911 41444</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <a
              href="https://wa.me/919871941444?text=Hi%20Skinfinity%2C%20I%20want%20to%20know%20more%20about%20the%20VIP%20Membership%20Club."
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Membership Concierge</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
