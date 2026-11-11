import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AppointmentForm from "@/components/modals/AppointmentForm";
import SectionDivider from "@/components/shared/SectionDivider";

export const metadata: Metadata = {
  title: "Patient Testimonials & Reviews | Skinfinity Derma (4,500+ Reviews)",
  description: "Read verified 4.5-star patient reviews (4,500+ reviews) and testimonials for Skinfinity Derma clinics in Noida and Gurgaon.",
  alternates: {
    canonical: "/testimonials",
  },
};

export default function TestimonialsPage() {
  return (
    <div className="bg-white">
      <div className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">Testimonials</span>
          </nav>
        </div>
      </div>

      <TestimonialsSection />

      <SectionDivider />

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}
