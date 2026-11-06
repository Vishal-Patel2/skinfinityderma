"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHomepageData } from "@/lib/api";
import {
  FlaskConical,
  Pill,
  ShieldCheck,
  ArrowRight,
  Calendar,
  Building,
  Star,
  Award,
  Microscope,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const DEFAULT_STATS = [
  { value: "1,00,000+", label: "Patients Treated" },
  { value: "15+", label: "US-FDA Lasers" },
  { value: "4.8★", label: "3,500+ Reviews" },
  { value: "CMO", label: "Govt. Licensed" },
];

const DEFAULT_PILLARS = [
  {
    icon: FlaskConical,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    iconBg: "bg-amber-100",
    title: "Orange Health Pathology Lab On-Site",
    desc: "Same-day hormone tests, lipid panels, and vitamin profiling to address the internal root cause of acne and hair loss.",
  },
  {
    icon: Pill,
    color: "bg-teal-50 text-teal-700 border-teal-200",
    iconBg: "bg-teal-100",
    title: "Authentic In-House Dermatological Pharmacy",
    desc: "100% verified medical formulations, clinical sunscreens, and customized serums stored under temperature-controlled guidelines.",
  },
  {
    icon: Microscope,
    color: "bg-violet-50 text-violet-700 border-violet-200",
    iconBg: "bg-violet-100",
    title: "US-FDA Approved Technology Only",
    desc: "Every laser and device is cleared by US-FDA and CDSCO — no grey-market equipment, ever.",
  },
];

export default function AboutClinicShowcase() {
  const [visible, setVisible] = useState(false);
  const [isSectionActive, setIsSectionActive] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [sectionData, setSectionData] = useState({
    title: "Skinfinity Derma - Expert Dermatologist, Skin & Hair Clinic in India",
    subtitle: "Where Medical Integrity Meets Exceptional Patient Transformations",
    badgeText: "Complete Medical Infrastructure",
    description: "At Skinfinity Derma, a leading dermatologist-led skin and hair clinic in India, we believe exceptional patient outcomes begin with medical integrity, expert diagnosis, and the highest standards of hygiene. Our experienced dermatologists provide personalised skin and hair treatments in advanced consultation chambers and sterile procedure rooms. As a trusted dermatology clinic in India, we focus on safe, effective, and evidence-based solutions for diverse skin and hair concerns, delivering natural-looking and long-lasting transformations.",
    mediaUrl: "/images/custom/clinic-reception.jpg",
    mediaAlt: "Skinfinity Derma Luxury Clinic Reception — Noida & Gurgaon",
    buttonText: "Book Clinic Consultation",
    buttonUrl: "/contact-us#appointment_form",
    secondaryButtonText: "Explore Full Facilities",
    secondaryButtonUrl: "/about-clinic",
  });

  const [stats, setStats] = useState(DEFAULT_STATS);
  const [pillars, setPillars] = useState(DEFAULT_PILLARS);

  useEffect(() => {
    let active = true;
    getHomepageData().then((hp) => {
      if (!active) return;
      if (hp?.aboutClinic === null) {
        setIsSectionActive(false);
        return;
      }
      if (hp?.aboutClinic) {
        setIsSectionActive(true);
        const sec = hp.aboutClinic;
        setSectionData((prev) => ({
          ...prev,
          title: sec.title || prev.title,
          subtitle: sec.subtitle || prev.subtitle,
          badgeText: sec.badgeText || prev.badgeText,
          description: sec.description || prev.description,
          mediaUrl: sec.mediaUrl || prev.mediaUrl,
          mediaAlt: sec.mediaAlt || prev.mediaAlt,
          buttonText: sec.buttonText || prev.buttonText,
          buttonUrl: sec.buttonUrl || prev.buttonUrl,
          secondaryButtonText: sec.secondaryButtonText || prev.secondaryButtonText,
          secondaryButtonUrl: sec.secondaryButtonUrl || prev.secondaryButtonUrl,
        }));

        if (sec.stats && sec.stats.length > 0) {
          setStats(
            sec.stats.map((s: any) => ({
              value: s.value || s.statValue || s.title || "",
              label: s.label || s.statLabel || s.subtitle || "",
            }))
          );
        }

        if (sec.pillars && sec.pillars.length > 0) {
          const iconMap: Record<string, any> = {
            FlaskConical,
            Pill,
            Microscope,
            ShieldCheck,
            Award,
            Star,
            Sparkles,
            CheckCircle2,
          };
          const pillarStyles = [
            { icon: FlaskConical, color: "bg-amber-50 text-amber-700 border-amber-200", iconBg: "bg-amber-100" },
            { icon: Pill, color: "bg-teal-50 text-teal-700 border-teal-200", iconBg: "bg-teal-100" },
            { icon: Microscope, color: "bg-violet-50 text-violet-700 border-violet-200", iconBg: "bg-violet-100" },
          ];

          setPillars(
            sec.pillars.map((p, idx) => {
              const style = pillarStyles[idx % pillarStyles.length];
              const IconComponent = (p.icon && iconMap[p.icon]) ? iconMap[p.icon] : style.icon;
              return {
                icon: IconComponent,
                color: style.color,
                iconBg: style.iconBg,
                title: p.title,
                desc: p.description || p.subtitle || "",
              };
            })
          );
        }
      }
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!isSectionActive) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-12 lg:py-16 bg-gradient-to-b from-white via-slate-50/60 to-white overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-50/50 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div
          className={`text-center mx-auto mb-12 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] font-bold uppercase tracking-widest mb-4">
            <Building className="w-3.5 h-3.5" />
            <span>{sectionData.badgeText || "Complete Medical Infrastructure"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-slate-900 font-serif leading-tight max-w-4xl mx-auto">
            {sectionData.title.includes("in India") ? (
              <>
                {sectionData.title.replace("in India", "").trim()}{" "}
                <span className="text-brand-700">in India</span>
              </>
            ) : sectionData.title.includes("Aesthetic Clinics") ? (
              <>
                {sectionData.title.replace("Aesthetic Clinics", "").trim()}{" "}
                <span className="text-brand-700">Aesthetic Clinics</span>
              </>
            ) : (
              sectionData.title
            )}
          </h1>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-stretch">

          {/* Left — Image Block */}
          <div
            className={`relative flex flex-col transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Main clinic image — fills column height matching right content */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl flex-1 min-h-[300px] sm:min-h-[340px] lg:min-h-0 bg-slate-100 group border border-white">
              <Image
                src={sectionData.mediaUrl || "/images/custom/clinic-reception.jpg"}
                alt={sectionData.mediaAlt || "Skinfinity Derma Luxury Clinic Reception — Noida & Gurgaon"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent pointer-events-none" />

              {/* Top badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-lg border border-white/80 text-xs font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Noida Sec 36 &amp; Gurgaon Sec 28
              </div>

              {/* Bottom glass strip */}
              <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-md bg-slate-950/70 border-t border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-bold text-sm font-serif flex items-center gap-1.5">
                      Skinfinity Derma <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                    </p>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      Flagship reception &amp; private consultation lounges
                    </p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold whitespace-nowrap">
                    NABH Standards
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow"
                >
                  <span className="text-base font-extrabold text-slate-900 font-serif leading-none">
                    {s.value}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Floating award badge */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 w-20">
              <Award className="w-7 h-7 text-amber-500" />
              <p className="text-[9px] font-bold text-slate-700 text-center leading-tight">
                No.1 Skin Clinic Noida
              </p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-2 h-2 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Content Block */}
          <div
            className={`space-y-7 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-snug">
                {sectionData.subtitle?.includes("Meets Patient Luxury") ? (
                  <>
                    {sectionData.subtitle.replace("Meets Patient Luxury", "").trim()}{" "}
                    <span className="text-brand-700">Meets Patient Luxury</span>
                  </>
                ) : (
                  sectionData.subtitle || (
                    <>
                      Where Clinical Expertise{" "}
                      <span className="text-brand-700">Meets Patient Luxury</span>
                    </>
                  )
                )}
              </h3>
              {sectionData.description?.includes("<") ? (
                <div
                  className="text-sm text-slate-600 leading-relaxed space-y-2 [&_p]:mb-2 [&_strong]:text-slate-800"
                  dangerouslySetInnerHTML={{ __html: sectionData.description }}
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {sectionData.description}
                </p>
              )}
            </div>

            {/* Medical Pillars */}
            <div className="space-y-3">
              {pillars.map(({ icon: Icon, color, iconBg, title, desc }) => (
                <div
                  key={title}
                  className={`flex items-start gap-4 p-4 rounded-2xl border bg-white hover:shadow-md transition-all duration-300 ${color}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href={sectionData.buttonUrl || "/contact-us#appointment_form"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-lg hover:shadow-brand-700/30 transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                {sectionData.buttonText || "Book Clinic Consultation"}
              </Link>
              <Link
                href={sectionData.secondaryButtonUrl || "/about-clinic"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {sectionData.secondaryButtonText || "Explore Full Facilities"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
