"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import AppointmentForm from "@/components/modals/AppointmentForm";
import { getFaqs } from "@/lib/api";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const defaultFaqs = [
    {
      q: "What makes Skinfinity Derma distinct from commercial skin salons and cosmetic clinics?",
      a: "Skinfinity Derma is a medical dermatology practice founded and directed by certified MD dermatologists (led by Dr. Ipshita Johri, Cardiff UK trained). We focus on accurate diagnosis and treating root-cause medical issues (hormonal, microbial, dietary) rather than temporary cosmetic cover-ups. Every laser and light device is 100% US-FDA approved."
    },
    {
      q: "Are procedures executed directly by MD Dermatologists?",
      a: "Yes. All doctor consultations, skin analyses, laser parameter calibrations, injectable procedures (Botox, Dermal Fillers, HIFU), and surgical interventions are conducted directly by our senior MD dermatologists (including Dr. Ipshita Johri, Dr. Sukriti, Dr. Aanchal Bansal, Dr. Neha Dhankar, and Dr. Shradha)."
    },
    {
      q: "Is US-FDA Laser Hair Removal safe and pain-free for Indian skin tones?",
      a: "Yes. We utilize advanced triple-wavelength (Diode, Alexandrite, and Nd:YAG) lasers with integrated sapphire contact cooling that chills the epidermis down to -4°C during energy delivery. This guarantees a practically painless experience while preventing burns or post-inflammatory hyperpigmentation on Fitzpatrick skin types III to V."
    },
    {
      q: "How does the Sugarcane HydraFacial differ from standard salon facials?",
      a: "Unlike salon facials using superficial creams, our signature Sugarcane HydraFacial combines pure sugarcane-derived glycolic alpha-hydroxy acids with vortex vacuum pore extraction and medical-grade peptide/antioxidant infusions. It purifies pores at the dermal level without social downtime."
    },
    {
      q: "How does the in-house diagnostic lab partnership with Orange Health Labs benefit patients?",
      a: "Conditions like stubborn acne, hair thinning, and melasma often stem from underlying thyroid dysfunction, PCOS, ferritin deficiencies, or vitamin imbalances. Our partnership with Orange Health Labs allows seamless on-site diagnostic sample collection with results reviewed directly by our dermatologists within hours."
    },
    {
      q: "Do you offer zero-interest (0% EMI) medical payment plans?",
      a: "Yes! We partner with leading financial institutions including HDFC Bank Health EMI, ICICI Health Care, and Bajaj Finserv Health to offer transparent, paperless, and 0% interest monthly installment plans for extensive laser and aesthetic treatments."
    },
    {
      q: "What are the consulting hours for Noida and Gurgaon clinics?",
      a: "Both clinics in Noida (Sector 36, Near Logix Mall) and Gurgaon (Sector 28, Golf Course Road) are open 7 days a week, Monday through Sunday, from 10:00 AM to 08:00 PM."
    }
  ];

  const [faqs, setFaqs] = useState(defaultFaqs);

  useEffect(() => {
    let active = true;
    getFaqs("home").then((data) => {
      if (active && data && data.length > 0) {
        setFaqs(
          data.map((f) => ({
            q: f.question,
            a: f.answer,
          }))
        );
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          {/* Left Column: Frequently Asked Questions */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f6f3] border border-[#d2eee7] text-[#006d6e] text-xs font-bold uppercase tracking-wider mb-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006d6e]" />
                <span>Dermatological Guidance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif">
                Frequently Asked <span className="text-brand-700">Questions</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Clear answers to your clinical safety, procedure efficacy, and clinic visit questions.
              </p>
            </div>

            {/* Accordions */}
            <div className="space-y-3.5">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "bg-[#f8fcfb] border-brand-300 shadow-sm"
                        : "bg-slate-50/70 border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-slate-900 hover:text-brand-700 transition-colors"
                    >
                      <span className="flex items-start gap-3">
                        <HelpCircle
                          className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                            isOpen ? "text-brand-700" : "text-slate-400"
                          }`}
                        />
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-brand-700" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-brand-100/80 pl-12 font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Professional Consultation Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <AppointmentForm className="shadow-xl border-brand-100 ring-1 ring-brand-50" />
          </div>

        </div>
      </div>
    </section>
  );
}
