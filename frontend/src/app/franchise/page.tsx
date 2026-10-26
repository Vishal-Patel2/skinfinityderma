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
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Mail, 
  Briefcase,
  ChevronRight,
  Sparkles,
  FileText
} from "lucide-react";
import { FRANCHISE_DATA, BRAND_JOURNEY, CLINIC_STATS } from "@/data/clinicData";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";
import { postEnquiry } from "@/lib/api";

export default function FranchisePage() {
  const [selectedCity, setSelectedCity] = useState(FRANCHISE_DATA.cities[0]);
  const [selectedModel, setSelectedModel] = useState<"FICO" | "FOFO">("FICO");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Delhi NCR",
    netWorth: "₹1.5 crore – ₹2 crore",
    experience: "Corporate / Investor",
    model: "FICO"
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide your name and contact phone number.");
      return;
    }
    try {
      postEnquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        type: "franchise",
        city: formData.city,
        message: `Model: ${formData.model} | Net Worth: ${formData.netWorth} | Background: ${formData.experience}`,
      }).catch((err) => console.warn("Backend franchise lead notice:", err));
    } catch (err) {
      console.warn("Backend franchise API trigger notice:", err);
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb Banner */}
      <PageBreadcrumbBanner
        image="/images/breadcrumbbanner/franchise.webp"
        breadcrumbs={[{ label: "Franchise & Partner Opportunities" }]}
        imageHasBuiltInText={true}
      />

      {/* Hero Banner */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-900/80 text-brand-300 text-xs font-bold border border-brand-700/60">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pan-India Clinical Expansion 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif leading-tight">
                Partner with North India’s #1 Aesthetic Dermatology Brand
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Own a high-margin medical aesthetics clinic backed by <strong className="text-white">Dr. Ipshita Johri</strong>, 10+ years of clinical trust, and a proven turnkey franchise model generating 38% - 50% annualized ROI.
              </p>

              {/* Brand USPs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center">
                  <span className="block text-xl font-black text-amber-400 font-serif">10+ Years</span>
                  <span className="text-[11px] text-slate-400 font-medium">Proven Track Record</span>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center">
                  <span className="block text-xl font-black text-brand-400 font-serif">1,00,000+</span>
                  <span className="text-[11px] text-slate-400 font-medium">Patients Treated</span>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center">
                  <span className="block text-xl font-black text-white font-serif">4,500+</span>
                  <span className="text-[11px] text-slate-400 font-medium">4.5★ Reviews</span>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-center">
                  <span className="block text-xl font-black text-emerald-400 font-serif">₹1.5Cr–₹2Cr</span>
                  <span className="text-[11px] text-slate-400 font-medium">Investment Range</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="#inquiry-form"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md transition-all"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Become a Franchise Partner</span>
                </a>
                <a
                  href="#city-potential"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Explore City Potential</span>
                </a>
              </div>
            </div>

            {/* Visual Hero Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-5">
                <h3 className="text-base font-bold text-white font-serif border-b border-slate-700 pb-3">
                  Why Invest in Medical Aesthetics?
                </h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span><strong>₹18,000+ Cr Market:</strong> Medical dermatology & aesthetics is India's fastest growing healthcare sector (28% CAGR).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span><strong>High Repeat Retention:</strong> Aesthetic clients require continuous monthly facials, laser cycles, and hair maintenance.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span><strong>Zero Clinical Risk:</strong> Centralized MD Dermatologist recruitment, SOP manuals, and ongoing training by Dr. Ipshita Johri.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span><strong>Turnkey Equipment:</strong> Direct US-FDA manufacturer leasing with Lumenis, Candela, and Allergan.</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-[11px] text-amber-300">
                  ⚡ <strong>Prime Territory Slots Open:</strong> South Delhi, Bandra Mumbai, Indiranagar Bengaluru, Jubilee Hills Hyderabad & Chandigarh.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Journey Roadmap */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              10+ Years of Growth
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
              Our 10-Year Clinical Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              From an independent boutique practice to one of Delhi NCR’s most trusted multi-center clinical brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_JOURNEY.slice(0, 4).map((m, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
                <span className="text-2xl font-black font-serif text-brand-700">{m.year}</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded w-fit">
                  {m.badge}
                </span>
                <h4 className="text-sm font-bold text-slate-900 font-serif">{m.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FICO vs FOFO Models */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Turnkey Franchise Models
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Choose Your Investment Framework (₹1.5 crore – ₹2 crore)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Whether you seek passive monthly income under our FICO model or want to actively manage a clinical facility, we offer structured financial frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FRANCHISE_DATA.models.map((model, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border-2 border-slate-200 hover:border-brand-700 shadow-lg transition-all space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-700 text-white">
                      {idx === 0 ? "FICO Model" : "FOFO Model"}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      ROI: {model.expectedRoi}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-serif">{model.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Ideal For: {model.idealFor}</p>

                  <div className="py-4 border-y border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Total Capital Investment:</span>
                      <span className="font-bold text-slate-900 text-sm">{model.investment}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Payback Period:</span>
                      <span className="font-bold text-slate-900 text-sm">{model.payback}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Clinic Carpet Area:</span>
                      <span className="font-bold text-slate-900">{model.areaRequired}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Staffing & MD Doctors:</span>
                      <span className="font-bold text-slate-900">{model.staffing}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Partner Deliverables:
                    </span>
                    {model.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#inquiry-form"
                  onClick={() => setFormData({ ...formData, model: idx === 0 ? "FICO" : "FOFO" })}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-brand-700 text-center block transition-colors shadow-sm"
                >
                  Inquire for {idx === 0 ? "FICO" : "FOFO"} Model
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Potential & India Map Selector */}
      <section id="city-potential" className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Catchment Analysis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
              Target Cities & Expansion Potential
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Select your preferred territory to evaluate clinic footfall, patient demographics, and launch viability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* City Buttons */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              {FRANCHISE_DATA.cities.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    selectedCity.name === city.name
                      ? "bg-white border-brand-700 ring-2 ring-brand-700/20 shadow-md"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{city.name}</div>
                  <div className="text-[10px] text-brand-700 font-semibold mt-0.5">{city.status}</div>
                </button>
              ))}
            </div>

            {/* City Detail Spotlight */}
            <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                  {selectedCity.tier} Market
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {selectedCity.potential}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-serif text-slate-900">{selectedCity.name}</h3>
                <p className="text-xs text-slate-500 mt-1">High disposable income catchment with unfulfilled medical aesthetic demand.</p>
              </div>

              <div className="py-4 border-y border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Est. Monthly Footfall:</span>
                  <span className="text-base font-bold text-slate-900">{selectedCity.estFootfall}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Territory Exclusivity:</span>
                  <span className="text-base font-bold text-brand-700">Guaranteed Radius</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700" />
                  <span>Full local recruitment of MD Dermatologists & certified nurses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700" />
                  <span>Centralized digital ad spend & local search optimization</span>
                </div>
              </div>

              <a
                href="#inquiry-form"
                onClick={() => setFormData({ ...formData, city: selectedCity.name })}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 text-center block shadow-md"
              >
                Apply for {selectedCity.name} Territory
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Inquiry Form */}
      <section id="inquiry-form" className="py-16 lg:py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Direct Board Application
              </span>
              <h3 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                Apply for Skinfinity Derma Franchise Partnership
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Our business expansion team will connect within 24 hours with our confidential Franchise Information Memorandum (FIM) and financial model.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target City</label>
                    <input
                      type="text"
                      placeholder="City of choice"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Investment Range</label>
                    <select
                      value={formData.netWorth}
                      onChange={(e) => setFormData({ ...formData, netWorth: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    >
                      <option value="₹1.5 crore – ₹2 crore">₹1.5 crore – ₹2 crore (Standard FICO / FOFO)</option>
                      <option value="₹2 crore+">₹2 crore+ (Multi-Unit Master Franchise)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Submit Partner Application & Receive Confidential Deck</span>
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold font-serif text-slate-900">Application Received Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, {formData.name}. Our Head of Franchising & Clinical Expansion will contact you directly at {formData.phone} to discuss territorial allocation for {formData.city}.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
