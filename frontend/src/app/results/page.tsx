import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { REAL_RESULTS } from "@/data/clinicData";
import AppointmentForm from "@/components/modals/AppointmentForm";
import PrivacyClinicalImage from "@/components/common/PrivacyClinicalImage";

export const metadata: Metadata = {
  title: "Real Results & Patient Transformations | Skinfinity Derma",
  description: "Authentic before and after treatment outcomes from Skinfinity Derma clinics in Noida and Gurgaon for acne scars, pigmentation, hair loss, and facial rejuvenation.",
  alternates: {
    canonical: "/results",
  },
};

export default function ResultsPage() {
  return (
    <div className="bg-white">
      <div className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">Real Results</span>
          </nav>
        </div>
      </div>

      <section className="py-14 bg-gradient-to-b from-brand-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
            Clinical Documentation
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-3 font-serif">
            Real Results & Before-After Gallery
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            See genuine photographic outcomes from our dermatological protocols for acne scars, stubborn melasma, laser hair reduction, and cellular hair restoration.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {REAL_RESULTS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <PrivacyClinicalImage
                      src={item.image}
                      alt={item.treatment}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.resultsType}
                    </div>
                    {item.patientName && (
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[11px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                        Patient: {item.patientName}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-base font-bold text-slate-900 font-serif">{item.treatment}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/contact-us#appointment_form"
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-700 hover:text-white transition-all text-center block"
                  >
                    Consult for Similar Outcome
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[11px] text-slate-400">
            * Individual results may vary based on skin condition, compliance with prescribed treatment sessions, and home skincare regimens.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}
