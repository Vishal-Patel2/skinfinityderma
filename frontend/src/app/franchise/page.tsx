"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
 Building2, 
 TrendingUp, 
 Award, 
 Users, 
 ShieldCheck, 
 MapPin, 
 ArrowRight, 
 Phone, 
 Mail, 
 Briefcase,
 ChevronRight,
 ChevronLeft,
 ChevronDown,
 FileText,
 Clock,
 Layers,
 HeartHandshake
} from "lucide-react";
import { FRANCHISE_DATA, BRAND_JOURNEY } from "@/data/clinicData";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";
import SectionDivider from "@/components/shared/SectionDivider";
import { postEnquiry } from "@/lib/api";
import BrandJourneyRoadmap from "@/components/about/BrandJourneyRoadmap";

const LAUNCH_STEPS = [
 {
 step: "01",
 title: "Territory Selection & Feasibility",
 desc: "Rigorous demographic analysis, micro-market catchment audit, and clinical demand validation by Skinfinity Derma HQ.",
 },
 {
 step: "02",
 title: "Standardized Luxury Fitout",
 desc: "Turnkey architectural floorplans, sterile clinical procedure suites, and opulent reception layout designed to NABH standards.",
 },
 {
 step: "03",
 title: "US-FDA Machine Procurement",
 desc: "Direct OEM manufacturer supply chain (Alma, Lumenis, Candela) with pre-negotiated equipment leasing and lifetime warranty.",
 },
 {
 step: "04",
 title: "MD Dermatologist Onboarding",
 desc: "Centralized recruitment, credentialing, and clinical protocol masterclasses led by Dr. Ipshita Johri at our Noida Flagship.",
 },
 {
 step: "05",
 title: "Hyperlocal Launch Marketing",
 desc: "Pre-launch digital advertising, Google Local Pack optimization, and targeted VIP preview consultations driving Day-1 footfall.",
 },
 {
 step: "06",
 title: "Operations & Recurring Revenue",
 desc: "End-to-end CRM integration, patient appointment pipeline, and automated inventory replenishment from our central warehouse.",
 },
];

const FRANCHISE_FAQS = [
 {
 question: "Do I need to be a doctor or medical professional to own a franchise?",
 answer: "No. Under our popular FICO (Franchise Invested, Company Operated) model, Skinfinity Derma HQ manages 100% of the medical governance, doctor hiring, therapist training, and daily clinical operations. You act as an executive capital partner while our board-certified MD Dermatologists handle all medical treatments.",
 },
 {
 question: "What is the total capital investment and payback period?",
 answer: "The total capital investment ranges between ₹1.5 crore and ₹2 crore depending on location and clinic carpet area (1,200 to 2,200 sq.ft.). This includes turnkey interior fitouts, US-FDA laser equipment, initial medical inventory, and launch working capital. Historical payback is achieved in 18 to 22 months with an annualized ROI of 38% to 50%.",
 },
 {
 question: "What territory exclusivity and catchment protection is guaranteed?",
 answer: "Every franchise partner is granted strict territorial exclusivity within an agreed radial catchment (typically 5 to 8 km in Tier 1 metros and 10 to 15 km in Tier 2 cities). No other Skinfinity Derma clinic will ever be opened within your defined protected territory.",
 },
 {
 question: "How does patient acquisition and marketing work for new clinics?",
 answer: "Skinfinity Derma operates a centralized digital marketing powerhouse. Our in-house performance marketing team manages localized Google Ads, social media campaigns, SEO, and celebrity PR. Booked patient leads are directly routed to your clinic's CRM with automated WhatsApp appointment confirmations.",
 },
 {
 question: "Can I acquire multi-unit or state-level master franchise rights?",
 answer: "Yes. We offer Master Franchise and Multi-Unit agreements for experienced business groups and high-net-worth investors seeking to develop an entire city or metropolitan region (e.g., South Delhi, Mumbai MMR, or Bengaluru Urban). Contact our expansion board directly via the application form.",
 },
];

export default function FranchisePage() {
 const [activeMilestone, setActiveMilestone] = useState(0);
 const [selectedCity, setSelectedCity] = useState(FRANCHISE_DATA.cities[0]);
 const [selectedModel, setSelectedModel] = useState<"FICO" | "FOFO">("FICO");
 const [openFaq, setOpenFaq] = useState<number | null>(0);

 const [formData, setFormData] = useState({
 name: "",
 phone: "",
 email: "",
 city: "Delhi NCR (South Delhi)",
 netWorth: "₹1.5 crore – ₹2 crore",
 experience: "Corporate Investor",
 model: "FICO"
 });
 const [submitted, setSubmitted] = useState(false);
 const [submitting, setSubmitting] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!formData.name.trim() || !formData.phone.trim()) {
 alert("Please provide your name and contact phone number.");
 return;
 }
 setSubmitting(true);
 try {
 await postEnquiry({
 name: formData.name.trim(),
 phone: formData.phone.trim(),
 email: formData.email.trim(),
 type: "franchise",
 city: formData.city,
 message: `Franchise Model: ${formData.model} | Net Worth: ${formData.netWorth} | Background: ${formData.experience}`,
 });
 } catch (err) {
 console.warn("Backend franchise lead notice:", err);
 } finally {
 setSubmitting(false);
 setSubmitted(true);
 }
 };

 const currentMilestone = BRAND_JOURNEY[activeMilestone] || BRAND_JOURNEY[0];

 return (
 <div className="bg-white text-slate-800">
 {/* 1. Page Breadcrumb Banner */}
 <PageBreadcrumbBanner
 image="/images/breadcrumbbanner/franchise.webp"
 breadcrumbs={[{ label: "Franchise & Partner Opportunities" }]}
 imageHasBuiltInText={true}
 />

 {/* 2. Executive Hero Section */}
 <section className="relative py-14 lg:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
 
 {/* Left Column: Headline & Value Proposition */}
 <div className="lg:col-span-7 space-y-6">
 <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
 <span>Pan-India Clinical Expansion 2026</span>
 </div>

 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif leading-tight">
 Partner with North India’s <span className="text-[#008081]">#1 Aesthetic Dermatology</span> Brand
 </h1>

 <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
 Own an enterprise-grade medical aesthetics clinic backed by <strong className="text-slate-900 font-semibold">Dr. Ipshita Johri</strong>, 10+ years of proven clinical governance, US-FDA laser infrastructure, and structured turnkey models delivering <strong className="text-[#008081] font-semibold">38% – 50% annualized ROI</strong>.
 </p>

 {/* 4 Financial & Operational Metric Cards */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
 <span className="block text-2xl font-bold text-slate-900 font-serif">10+ Yrs</span>
 <span className="text-xs text-slate-500 mt-0.5 block">Clinical Heritage</span>
 </div>
 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
 <span className="block text-2xl font-bold text-slate-900 font-serif">1,00,000+</span>
 <span className="text-xs text-slate-500 mt-0.5 block">Treated Patients</span>
 </div>
 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
 <span className="block text-2xl font-bold text-[#008081] font-serif">38%–50%</span>
 <span className="text-xs text-slate-500 mt-0.5 block">Annualized ROI</span>
 </div>
 <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
 <span className="block text-2xl font-bold text-slate-900 font-serif">18–22 Mo</span>
 <span className="text-xs text-slate-500 mt-0.5 block">Capital Payback</span>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row gap-3 pt-2">
 <a
 href="#inquiry-form"
 className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold text-white bg-[#008081] hover:bg-[#006d6e] shadow-sm transition-all"
 >
 <Briefcase className="w-4 h-4" />
 <span>Apply for Franchise Partnership</span>
 </a>
 <a
 href="#investment-models"
 className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-xs"
 >
 <Layers className="w-4 h-4 text-slate-500" />
 <span>Explore FICO & FOFO Models</span>
 </a>
 </div>
 </div>

 {/* Right Column: Opportunity Card */}
 <div className="lg:col-span-5">
 <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm space-y-5">
 <div className="flex items-center justify-between pb-4">
 <h3 className="text-base font-bold text-slate-900 font-serif">
 The Clinical Aesthetics Opportunity
 </h3>
 <span className="text-[11px] font-semibold text-[#008081] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
 28% CAGR Sector
 </span>
 </div>

 <div className="space-y-3.5 text-xs text-slate-600">
 <div className="flex items-start gap-3">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span className="leading-relaxed">
 <strong className="text-slate-900">₹18,000+ Cr Market:</strong> Medical cosmetology and clinical dermatology is India&apos;s fastest growing premium healthcare sector.
 </span>
 </div>
 <div className="flex items-start gap-3">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span className="leading-relaxed">
 <strong className="text-slate-900">Predictable Recurring Cash Flow:</strong> Clinical aesthetic clients average 6 to 8 sessions per laser cycle, plus monthly medical facials.
 </span>
 </div>
 <div className="flex items-start gap-3">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span className="leading-relaxed">
 <strong className="text-slate-900">Zero Medical Liability:</strong> Centralized doctor recruitment, CMO licensing compliance, and standardized medical SOPs governed by HQ.
 </span>
 </div>
 <div className="flex items-start gap-3">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span className="leading-relaxed">
 <strong className="text-slate-900">Direct OEM Machine Sourcing:</strong> Preferred institutional procurement on Soprano Titanium, Q-Switched Nd:YAG, and HydraFacial MD systems.
 </span>
 </div>
 </div>

 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
 <div className="text-slate-900 font-semibold text-xs">
 Priority Territory Allocations:
 </div>
 <p className="text-[11px] text-slate-500 leading-relaxed">
 South Delhi, Bandra / Andheri Mumbai, Indiranagar Bengaluru, Jubilee Hills Hyderabad &amp; Sector 8 Chandigarh.
 </p>
 </div>
 </div>
 </div>

 </div>
 </div>
 </section>

 <SectionDivider />

 {/* 3. Core Franchise Advantages */}
 <section className="py-12 lg:py-16 bg-slate-50/60 ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center max-w-3xl mx-auto mb-10">
 <span className="text-xs font-semibold uppercase tracking-wider text-[#008081] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100">
 The Skinfinity Advantage
 </span>
 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mt-2 font-serif leading-tight">
 Why Institutional Investors Choose Skinfinity Derma
 </h2>
 <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
 We bridge the gap between doctor-led clinical authority and institutional business operations to create predictable, high-margin aesthetic clinics.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#008081] transition-all space-y-3">
 <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008081] flex items-center justify-center">
 <ShieldCheck className="w-5 h-5" />
 </div>
 <h3 className="text-base font-bold text-slate-900 font-serif">Turnkey Clinical Governance</h3>
 <p className="text-xs text-slate-600 leading-relaxed">
 We recruit, credential, and train qualified MD Dermatologists and laser nurses. HQ conducts regular clinical audits ensuring hospital-grade compliance.
 </p>
 </div>

 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#008081] transition-all space-y-3">
 <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008081] flex items-center justify-center">
 <Building2 className="w-5 h-5" />
 </div>
 <h3 className="text-base font-bold text-slate-900 font-serif">US-FDA Tech Portfolio</h3>
 <p className="text-xs text-slate-600 leading-relaxed">
 Direct OEM relationships with Alma, Lumenis, and Allergan. Partners receive institutional leasing pricing, calibration guarantees, and lifetime servicing.
 </p>
 </div>

 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#008081] transition-all space-y-3">
 <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008081] flex items-center justify-center">
 <TrendingUp className="w-5 h-5" />
 </div>
 <h3 className="text-base font-bold text-slate-900 font-serif">Centralized Patient Engine</h3>
 <p className="text-xs text-slate-600 leading-relaxed">
 Our digital ad spend, SEO, Google Local maps, and central tele-consultation team book qualified patients directly into your clinic calendar from Day 1.
 </p>
 </div>

 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#008081] transition-all space-y-3">
 <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008081] flex items-center justify-center">
 <HeartHandshake className="w-5 h-5" />
 </div>
 <h3 className="text-base font-bold text-slate-900 font-serif">High Lifetime Retention</h3>
 <p className="text-xs text-slate-600 leading-relaxed">
 Clinical dermatology clients purchase multi-session plans (6–8 laser sessions, acne scar remodeling cycles) generating high lifetime value (LTV).
 </p>
 </div>
 </div>
 </div>
 </section>

 <SectionDivider />

 {/* 4.Our Journey – Interactive S-Curve Roadmap */}
 <BrandJourneyRoadmap />

 <SectionDivider />

 {/* 5. Investment Frameworks (FICO vs FOFO Models) */}
 <section id="investment-models" className="py-12 lg:py-16 bg-slate-50/60 ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <div className="text-center max-w-3xl mx-auto mb-10">
 <span className="text-xs font-semibold uppercase tracking-wider text-[#008081] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100">
 Turnkey Franchise Models
 </span>
 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mt-2 font-serif leading-tight">
 Structured Investment Frameworks{" "}
 <span className="inline-block whitespace-nowrap font-medium text-slate-700">
 (₹1.5&nbsp;Cr&nbsp;–&nbsp;₹2&nbsp;Cr)
 </span>
 </h2>
 <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
 Whether you seek passive monthly income under our FICO model or want to actively manage a clinical facility under FOFO, our frameworks are designed for transparency and high returns.
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {FRANCHISE_DATA.models.map((model) => {
 const isSelected = selectedModel === model.code;
 return (
 <div
 key={model.code}
 className={`bg-white rounded-3xl p-7 sm:p-9 border transition-all flex flex-col justify-between shadow-xs ${
 isSelected
 ? "border-[#008081] ring-1 ring-[#008081]"
 : "border-slate-200 hover:border-slate-300"
 }`}
 >
 <div className="space-y-5">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-800">
 {model.code} Framework
 </span>
 <span className="text-xs font-semibold text-[#008081] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
 ROI: {model.expectedRoi}
 </span>
 </div>
 <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
 {model.name}
 </h3>
 <p className="text-xs text-slate-500 mt-1">
 Ideal Profile: <span className="text-slate-800 font-medium">{model.idealFor}</span>
 </p>
 </div>

 {/* Specification list */}
 <div className="py-4 border-y border-slate-100 grid grid-cols-2 gap-4 text-xs">
 <div>
 <span className="text-slate-400 block">Total Investment:</span>
 <span className="font-bold text-slate-900 text-sm mt-0.5 block">{model.investment}</span>
 </div>
 <div>
 <span className="text-slate-400 block">Payback Horizon:</span>
 <span className="font-bold text-[#008081] text-sm mt-0.5 block">{model.payback}</span>
 </div>
 <div>
 <span className="text-slate-400 block">Carpet Area:</span>
 <span className="font-semibold text-slate-800 mt-0.5 block">{model.areaRequired}</span>
 </div>
 <div>
 <span className="text-slate-400 block">Staffing &amp; Doctors:</span>
 <span className="font-semibold text-slate-800 mt-0.5 block">{model.staffing}</span>
 </div>
 <div className="col-span-2 pt-2 border-t border-slate-100">
 <span className="text-slate-400 block">Royalty &amp; Commercials:</span>
 <span className="font-semibold text-slate-800 mt-0.5 block">{model.royalty}</span>
 </div>
 </div>

 {/* Features */}
 <div className="space-y-2 text-xs text-slate-600">
 <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
 HQ Deliverables:
 </span>
 {model.features.map((feature, fIdx) => (
 <div key={fIdx} className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span className="leading-relaxed">{feature}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="pt-6">
 <a
 href="#inquiry-form"
 onClick={() => {
 setSelectedModel(model.code as "FICO" | "FOFO");
 setFormData((prev) => ({ ...prev, model: model.code }));
 }}
 className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#008081] hover:bg-[#006d6e] text-center block transition-all shadow-xs"
 >
 Inquire for {model.code} Model
 </a>
 </div>
 </div>
 );
 })}
 </div>

 </div>
 </section>

 <SectionDivider />

 {/* 6. 6-Step Turnkey Launch Roadmap */}
 <section className="py-12 lg:py-16 bg-white ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <div className="text-center max-w-3xl mx-auto mb-10">
 <span className="text-xs font-semibold uppercase tracking-wider text-[#008081] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100">
 Turnkey Execution
 </span>
 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mt-2 font-serif leading-tight max-w-2xl mx-auto">
 From Agreement to First Patient <br className="hidden sm:inline" />
 in <span className="inline-block whitespace-nowrap">60–90 Days</span>
 </h2>
 <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
 Our seasoned project management team oversees every architectural, clinical, and operational milestone so your center opens seamlessly.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {LAUNCH_STEPS.map((stepItem) => (
 <div
 key={stepItem.step}
 className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#008081] transition-all space-y-2.5"
 >
 <div className="text-xl font-bold font-serif text-[#008081]">
 {stepItem.step}
 </div>

 <h3 className="text-base font-bold text-slate-900 font-serif">
 {stepItem.title}
 </h3>

 <p className="text-xs text-slate-600 leading-relaxed">
 {stepItem.desc}
 </p>
 </div>
 ))}
 </div>

 </div>
 </section>

 <SectionDivider />

 {/* 7. Target Cities & Expansion Catchment */}
 <section id="city-potential" className="py-12 lg:py-16 bg-slate-50/60 ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <div className="text-center max-w-3xl mx-auto mb-10">
 <span className="text-xs font-semibold uppercase tracking-wider text-[#008081] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100">
 Catchment Analysis
 </span>
 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mt-2 font-serif leading-tight">
 Target Cities &amp; Expansion Potential
 </h2>
 <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
 Select your preferred metropolitan market to evaluate clinical patient demand, disposable income catchment, and launch viability.
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
 {/* City Selection Buttons */}
 <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
 {FRANCHISE_DATA.cities.map((city) => {
 const isSelected = selectedCity.name === city.name;
 return (
 <button
 key={city.name}
 type="button"
 onClick={() => {
 setSelectedCity(city);
 setFormData((prev) => ({ ...prev, city: city.name }));
 }}
 className={`p-4 rounded-2xl text-left border transition-all ${
 isSelected
 ? "bg-white border-[#008081] ring-1 ring-[#008081] shadow-xs"
 : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
 }`}
 >
 <div className="text-xs font-bold text-slate-900">
 {city.name}
 </div>
 <div className="flex items-center gap-2 mt-1.5">
 <span className="text-[10px] font-semibold text-[#008081] bg-teal-50 px-2 py-0.5 rounded">
 {city.tier}
 </span>
 <span className="text-[10px] text-slate-500">
 {city.status}
 </span>
 </div>
 </button>
 );
 })}
 </div>

 {/* City Detail Card */}
 <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
 <div className="flex items-center justify-between pb-4">
 <span className="text-xs font-semibold text-[#008081] bg-teal-50 px-3 py-0.5 rounded-full border border-teal-100">
 {selectedCity.tier} Prime Territory
 </span>
 <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
 {selectedCity.potential}
 </span>
 </div>

 <div>
 <h3 className="text-2xl font-bold font-serif text-slate-900">
 {selectedCity.name}
 </h3>
 <p className="text-xs text-slate-500 mt-1 leading-relaxed">
 High concentration of affluent households, luxury lifestyle demographics, and significant underserved demand for board-certified aesthetic dermatology.
 </p>
 </div>

 <div className="py-4 border-y border-slate-100 grid grid-cols-2 gap-4 text-xs">
 <div>
 <span className="text-slate-400 block">Estimated Monthly Footfall:</span>
 <span className="text-base font-bold text-slate-900 mt-0.5 block">{selectedCity.estFootfall}</span>
 </div>
 <div>
 <span className="text-slate-400 block">Territory Exclusivity:</span>
 <span className="text-base font-bold text-[#008081] mt-0.5 block">Guaranteed Catchment</span>
 </div>
 </div>

 <div className="space-y-2 text-xs text-slate-600">
 <div className="flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] shrink-0" />
 <span>Centralized doctor recruitment of licensed senior MD Dermatologists</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] shrink-0" />
 <span>Dedicated hyperlocal digital ad spend, Google Maps &amp; SEO campaign</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] shrink-0" />
 <span>Full logistics supply chain for US-FDA consumables and injectables</span>
 </div>
 </div>

 <div className="pt-2">
 <a
 href="#inquiry-form"
 onClick={() => setFormData((prev) => ({ ...prev, city: selectedCity.name }))}
 className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#008081] hover:bg-[#006d6e] text-center block shadow-xs transition-all"
 >
 Apply for {selectedCity.name} Territory Exclusivity
 </a>
 </div>
 </div>

 </div>

 </div>
 </section>

 <SectionDivider />

 {/* 8. Direct Board Franchise Application Form */}
 <section id="inquiry-form" className="py-12 lg:py-16 bg-white ">
 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 
 {/* Left: Application Form */}
 <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-xs space-y-6">
 <div className=" pb-4">
 <span className="text-xs font-semibold uppercase tracking-wider text-[#008081] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100">
 Direct Board Application
 </span>
 <h3 className="text-2xl font-bold font-serif text-slate-900 mt-2">
 Apply for Skinfinity Derma Franchise
 </h3>
 <p className="text-xs text-slate-500 mt-1 leading-relaxed">
 Our business expansion team will connect within 24 hours with our confidential Franchise Information Memorandum (FIM) and 36-month financial model.
 </p>
 </div>

 {!submitted ? (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
 <input
 type="text"
 required
 placeholder="Your Full Name"
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#008081] focus:bg-white"
 />
 </div>
 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone *</label>
 <input
 type="tel"
 required
 placeholder="10-digit mobile number"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#008081] focus:bg-white"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
 <input
 type="email"
 placeholder="partner@example.com"
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#008081] focus:bg-white"
 />
 </div>
 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred City / Territory</label>
 <input
 type="text"
 placeholder="e.g. South Delhi, Bandra Mumbai, Indiranagar"
 value={formData.city}
 onChange={(e) => setFormData({ ...formData, city: e.target.value })}
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#008081] focus:bg-white"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">Franchise Model Preference</label>
 <select
 value={formData.model}
 onChange={(e) => setFormData({ ...formData, model: e.target.value })}
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#008081] focus:bg-white"
 >
 <option value="FICO">FICO (Company Operated - Hands Off)</option>
 <option value="FOFO">FOFO (Franchise Operated with HQ Masterclasses)</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">Investment Capacity</label>
 <select
 value={formData.netWorth}
 onChange={(e) => setFormData({ ...formData, netWorth: e.target.value })}
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#008081] focus:bg-white"
 >
 <option value="₹1.5 crore – ₹2 crore">₹1.5 crore – ₹2 crore (Standard Clinic)</option>
 <option value="₹2 crore – ₹3 crore">₹2 crore – ₹3 crore (Flagship Center)</option>
 <option value="₹3 crore+">₹3 crore+ (Multi-Unit Master Franchise)</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Background / Notes</label>
 <textarea
 rows={3}
 placeholder="Briefly describe your current business background or healthcare experience..."
 value={formData.experience}
 onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#008081] focus:bg-white"
 />
 </div>

 <button
 type="submit"
 disabled={submitting}
 className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-[#008081] hover:bg-[#006d6e] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70"
 >
 <Briefcase className="w-4 h-4" />
 <span>{submitting ? "Transmitting..." : "Submit Partner Application"}</span>
 </button>
 </form>
 ) : (
 <div className="p-8 rounded-2xl bg-teal-50 border border-teal-100 text-center space-y-2">
 <h4 className="text-xl font-bold font-serif text-slate-900">Application Received</h4>
 <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
 Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our Head of Clinical Expansion will contact you directly at <strong className="text-slate-900">{formData.phone}</strong> regarding <strong className="text-slate-900">{formData.city}</strong>.
 </p>
 </div>
 )}
 </div>

 {/* Right: Contact & Information Sidebar */}
 <div className="lg:col-span-5 space-y-5">
 <div className="bg-slate-50 p-7 rounded-3xl border border-slate-200 space-y-4">
 <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3.5">
 <FileText className="w-5 h-5 text-[#008081]" />
 <div>
 <h4 className="text-sm font-bold text-slate-900 font-serif">Confidential FIM Package</h4>
 <span className="text-[11px] text-slate-500">What you receive upon application</span>
 </div>
 </div>

 <div className="space-y-2.5 text-xs text-slate-600">
 <div className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span>Detailed 36-Month Pro-Forma P&amp;L and unit economics spreadsheet.</span>
 </div>
 <div className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span>Equipment Capex breakdown, leasing rates, and depreciation schedules.</span>
 </div>
 <div className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span>Sample Franchise Legal Agreement and territorial exclusivity radius terms.</span>
 </div>
 <div className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-[#008081] mt-1.5 shrink-0" />
 <span>Confidential strategy call with Dr. Ipshita Johri and Expansion Board.</span>
 </div>
 </div>

 <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
 <div className="text-xs text-slate-600">
 <span className="block text-[10px] text-slate-400 uppercase font-semibold">Direct Expansion Desk</span>
 <a href="tel:+919871941444" className="font-bold text-slate-900 hover:text-[#008081] transition-colors">
 +91 98719 41444
 </a>
 </div>

 <div className="text-xs text-slate-600">
 <span className="block text-[10px] text-slate-400 uppercase font-semibold">Board Email</span>
 <a href="mailto:franchise@skinfinityderma.com" className="font-bold text-slate-900 hover:text-[#008081] transition-colors">
 franchise@skinfinityderma.com
 </a>
 </div>
 </div>
 </div>

 {/* Founder quote */}
 <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-xs">
 <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
 <Image
 src="/images/doctors/dr-ipshita-johri.webp"
 alt="Dr. Ipshita Johri"
 fill
 className="object-cover"
 />
 </div>
 <div className="text-xs">
 <p className="text-slate-600 italic leading-snug">
 &ldquo;We don&apos;t just grant franchises; we build high-trust clinical institutions that elevate dermatology standards across India.&rdquo;
 </p>
 <span className="block text-slate-900 font-semibold mt-1 font-serif">
 Dr. Ipshita Johri — Founder &amp; Clinical Director
 </span>
 </div>
 </div>
 </div>

 </div>

 </div>
 </section>

 <SectionDivider />

 {/* 9. Franchise FAQs */}
 <section className="py-12 lg:py-16 bg-slate-50/60">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 
 <div className="text-center max-w-2xl mx-auto mb-8">
 <span className="text-xs font-semibold uppercase tracking-wider text-[#008081] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-100">
 Investor FAQ
 </span>
 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mt-2 font-serif leading-tight">
 Frequently Asked Questions
 </h2>
 <p className="text-xs sm:text-sm text-slate-600 mt-2">
 Key questions answered regarding ownership, operations, and financial returns.
 </p>
 </div>

 <div className="space-y-3">
 {FRANCHISE_FAQS.map((faq, idx) => {
 const isOpen = openFaq === idx;
 return (
 <div
 key={idx}
 className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
 >
 <button
 onClick={() => setOpenFaq(isOpen ? null : idx)}
 className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
 >
 <span className="text-sm font-bold text-slate-900 font-serif">
 {faq.question}
 </span>
 <ChevronDown
 className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
 isOpen ? "rotate-180 text-[#008081]" : ""
 }`}
 />
 </button>

 {isOpen && (
 <div className="px-5 py-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
 {faq.answer}
 </div>
 )}
 </div>
 );
 })}
 </div>

 </div>
 </section>
 </div>
 );
}