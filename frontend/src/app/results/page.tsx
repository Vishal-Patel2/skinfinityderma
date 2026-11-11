import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, Award, ShieldCheck, Sparkles } from "lucide-react";
import AppointmentForm from "@/components/modals/AppointmentForm";
import ResultsGallery from "@/components/results/ResultsGallery";
import SectionDivider from "@/components/shared/SectionDivider";
import { getResults } from "@/lib/api";
import { REAL_RESULTS } from "@/data/clinicData";

export const metadata: Metadata = {
  title: "Real Results & Before-After Gallery | Skinfinity Derma",
  description: "Authentic before and after treatment outcomes from Skinfinity Derma clinics in Noida and Gurgaon for acne scars, pigmentation, laser hair removal, and anti-aging.",
  alternates: {
    canonical: "/results",
  },
};

export default async function ResultsPage() {
  let initialResults: any[] = [];
  try {
    const data = await getResults();
    if (data && Array.isArray(data) && data.length > 0) {
      initialResults = data;
    }
  } catch {
    initialResults = REAL_RESULTS as any;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Top Breadcrumb */}
      <div className="bg-slate-50  py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#005B41] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Real Results &amp; Before-After</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-14 lg:py-16 bg-gradient-to-b from-emerald-50/40 via-white to-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005B41] bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-[#005B41]" />
            <span>Doctor-Certified Clinical Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-4 font-serif leading-tight">
            Real Results &amp; <span className="text-[#005B41]">Patient Transformations</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3.5 leading-relaxed">
            Explore authentic before-and-after photographic comparisons showing genuine patient transformations achieved under Dr. Ipshita Johri and our senior MD dermatology team in Noida and Gurgaon.
          </p>
        </div>
      </section>

      {/* Main Interactive Results Gallery */}
      <section className="py-16 bg-slate-50/70 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResultsGallery initialResults={initialResults} />

          <p className="mt-12 text-center text-xs text-slate-400 max-w-2xl mx-auto">
            * Disclaimer: Individual outcomes may vary based on skin type, hormonal health, grade of condition, compliance with prescribed clinical protocols, and adherence to personalized home care.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* Bottom Booking Appointment Section */}
      <section className="py-16 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Personalized Evaluation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-serif">
              Ready for Your Own Clinical Transformation?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Book a comprehensive 1-on-1 consultation with our senior MD dermatologists at Noida or Gurgaon.
            </p>
          </div>
          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}
