import React from "react";
import { Metadata } from "next";
import MembershipClientView from "@/components/membership/MembershipClientView";
import { getMemberships } from "@/lib/api";
import { MEMBERSHIP_PLANS, MembershipPlan } from "@/data/clinicData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VIP Membership Club | Skinfinity Derma Privilege Passes",
  description:
    "Join the Skinfinity Derma Privilege Club. Access exclusive aesthetic privileges, complimentary US-FDA medi-facials, flat discounts on laser treatments, injectable aesthetics, and priority dermatologist concierge care.",
  alternates: {
    canonical: "/membership",
  },
  openGraph: {
    title: "VIP Membership Club | Skinfinity Derma Privilege Passes",
    description:
      "Exclusive annual aesthetic privilege passes. Complimentary medical facials, laser discounts, priority doctor consultations across Noida & Gurgaon clinics.",
    url: "https://www.skinfinityderma.com/membership",
    siteName: "Skinfinity Derma",
  },
};

const THEME_STYLES: Record<string, { passGradient: string; cardBg: string; badgeStyle: string; buttonStyle: string; accentText: string; color: string }> = {
  gold: {
    passGradient: "from-amber-600 via-yellow-500 to-amber-700",
    cardBg: "bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 border-amber-400",
    badgeStyle: "bg-amber-500 text-slate-950 border-amber-400",
    buttonStyle: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black",
    accentText: "text-amber-700",
    color: "border-amber-400 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/30",
  },
  platinum: {
    passGradient: "from-[#042f2e] via-[#008081] to-emerald-900",
    cardBg: "bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/60 border-[#008081]",
    badgeStyle: "bg-[#008081] text-white border-teal-600",
    buttonStyle: "bg-gradient-to-r from-[#042f2e] via-[#008081] to-teal-800 hover:opacity-95 text-white",
    accentText: "text-[#008081]",
    color: "border-[#008081] bg-gradient-to-b from-teal-50/60 via-white to-emerald-50/30",
  },
  silver: {
    passGradient: "from-slate-700 via-slate-600 to-slate-800",
    cardBg: "bg-gradient-to-br from-slate-50 via-white to-slate-100/80 border-slate-300",
    badgeStyle: "bg-slate-200 text-slate-800 border-slate-300",
    buttonStyle: "bg-slate-800 hover:bg-slate-900 text-white",
    accentText: "text-slate-700",
    color: "border-slate-300 bg-gradient-to-b from-slate-50 via-white to-slate-50/70",
  },
  rosegold: {
    passGradient: "from-rose-600 via-pink-500 to-rose-700",
    cardBg: "bg-gradient-to-br from-rose-50/80 via-white to-pink-50/60 border-rose-300",
    badgeStyle: "bg-rose-500 text-white border-rose-400",
    buttonStyle: "bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-95 text-white",
    accentText: "text-rose-600",
    color: "border-rose-300 bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30",
  },
  sapphire: {
    passGradient: "from-blue-900 via-indigo-700 to-blue-950",
    cardBg: "bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 border-blue-400",
    badgeStyle: "bg-blue-600 text-white border-blue-500",
    buttonStyle: "bg-gradient-to-r from-blue-700 to-indigo-800 hover:opacity-95 text-white",
    accentText: "text-blue-700",
    color: "border-blue-400 bg-gradient-to-b from-blue-50/60 via-white to-blue-50/30",
  },
};

export default async function MembershipPage() {
  let plans: MembershipPlan[] = MEMBERSHIP_PLANS;

  try {
    const apiPlans = await getMemberships();
    if (Array.isArray(apiPlans) && apiPlans.length > 0) {
      plans = apiPlans.map((p) => {
        const slug = (p.slug || String(p.id) || "").toLowerCase();
        let matchedTheme = "gold";
        if (slug.includes("silver")) matchedTheme = "silver";
        else if (slug.includes("platinum")) matchedTheme = "platinum";
        else if (slug.includes("rose")) matchedTheme = "rosegold";
        else if (slug.includes("blue") || slug.includes("sapphire")) matchedTheme = "sapphire";

        const preset = THEME_STYLES[matchedTheme] || THEME_STYLES.gold;

        let featuresList: string[] = [];
        if (Array.isArray(p.features)) {
          featuresList = p.features;
        } else if (typeof p.features === "string") {
          try {
            featuresList = JSON.parse(p.features);
          } catch {
            featuresList = p.features.split("\n").map((s: string) => s.trim()).filter(Boolean);
          }
        }

        const isPopular = Boolean(p.popular || p.is_popular || p.isPopular);

        return {
          id: p.slug || String(p.id),
          name: p.name || "Privilege Plan",
          price: p.price || (p.rawPrice ? `₹${Number(p.rawPrice).toLocaleString("en-IN")}` : "₹9,999"),
          period: p.period || "/ year",
          validity: p.validity || "12 Months Validity",
          tagline: p.tagline || "",
          popular: isPopular,
          color: p.color || preset.color,
          passGradient: p.passGradient || p.pass_gradient || preset.passGradient,
          cardBg: p.cardBg || p.card_bg || preset.cardBg,
          badgeStyle: p.badgeStyle || p.badge_style || preset.badgeStyle,
          buttonStyle: p.buttonStyle || p.button_style || preset.buttonStyle,
          accentText: p.accentText || p.accent_text || preset.accentText,
          features: featuresList,
        };
      });
    }
  } catch (err) {
    console.error("Error fetching memberships for SSR:", err);
    plans = MEMBERSHIP_PLANS;
  }

  return <MembershipClientView initialPlans={plans} />;
}
