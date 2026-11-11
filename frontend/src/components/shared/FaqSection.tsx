"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import AppointmentForm from "@/components/modals/AppointmentForm";
import { getFaqs } from "@/lib/api";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const defaultFaqs = [
    {
      q: "How do I choose the right dermatologist clinic in India for my skin and hair concerns?",
      a: "Choosing the right dermatologist clinic in India starts with checking the qualifications and experience of its dermatologists. Look for a clinic that offers proper skin and hair diagnosis, personalised treatment plans, advanced technology, and good hygiene standards. Skinfinity Derma focuses on expert-led dermatology care and individual treatment needs."
    },
    {
      q: "How can I find the best dermatologist for my skin concerns?",
      a: "The best dermatologist in India for your needs should have relevant medical qualifications, clinical experience, and expertise in treating your specific condition. Consider their approach to diagnosis, treatment options, patient safety, and follow-up care before making your decision."
    },
    {
      q: "What treatments are available at a skin and hair clinic in India?",
      a: "A professional skin and hair clinic in India may offer treatments for acne, acne scars, pigmentation, hair fall, dandruff, ageing concerns, and unwanted hair. Depending on individual needs, treatment options may include medical skincare, chemical peels, laser procedures, PRP, GFC, and hair restoration."
    },
    {
      q: "Which skin treatments are suitable for acne, pigmentation, and acne scars?",
      a: "Popular skin treatments in India include chemical peels, medical facials, laser toning, microneedling, and other dermatologist-recommended procedures. The right treatment depends on your skin type, underlying concern, medical history, and severity of the condition. A dermatologist consultation helps determine the safest approach."
    },
    {
      q: "When should I consult a skin specialist instead of trying home remedies?",
      a: "You should consult a skin specialist in India when acne keeps returning, pigmentation becomes persistent, hair fall increases, or skin irritation does not improve. A dermatologist can identify the underlying cause and recommend evidence-based treatments instead of relying on temporary home remedies."
    },
    {
      q: "Are advanced laser skin treatments safe for Indian skin tones?",
      a: "Many modern laser technologies can be used safely on Indian skin tones when selected according to skin type and condition. However, darker skin tones may have a higher risk of post-inflammatory pigmentation with certain procedures. A qualified dermatologist should assess your skin and select suitable settings before treatment."
    },
    {
      q: "How do dermatologists decide which skin treatment is right for each patient?",
      a: "Dermatologists consider several factors, including skin type, medical history, lifestyle, current concerns, and treatment goals. At Skinfinity Derma, personalised assessment helps determine suitable skin treatments, whether for acne, pigmentation, scars, ageing, or overall skin health."
    },
    {
      q: "Can one dermatologist clinic provide solutions for both skin and hair problems?",
      a: "Yes. A comprehensive dermatologist clinic in India can address concerns involving both skin and hair. Services may include acne management, pigmentation treatments, hair fall evaluation, PRP and GFC procedures, laser hair removal, and hair restoration, depending on the clinic's expertise and facilities."
    },
    {
      q: "How many sessions are usually needed for skin and hair treatments in India?",
      a: "The number of sessions varies according to the treatment, individual condition, skin or hair type, and desired results. Laser hair removal, chemical peels, pigmentation procedures, and hair restoration treatments may all require different treatment schedules. Your dermatologist can suggest a personalized plan after assessment."
    },
    {
      q: "Why choose Skinfinity Derma for dermatologist-led skin and hair treatments in India?",
      a: "Skinfinity Derma offers dermatologist-led skin and hair care under the leadership of Dr. Ipshita Johri, with over 14 years of aesthetic experience. The clinic focuses on personalised diagnosis, advanced treatment technologies, hygiene standards, and customised care for acne, pigmentation, hair loss, laser treatments, and aesthetic concerns."
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.slice(0, 10).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <section className="py-10 lg:py-14 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
                        <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900 inline m-0 p-0 text-left">
                          {faq.q}
                        </h3>
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
