import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight,
  Calendar,
  MessageCircle
} from "lucide-react";
import { CLINIC_LOCATIONS, CLINIC_STATS, DOCTORS, TREATMENTS } from "@/data/clinicData";
import AppointmentForm from "@/components/modals/AppointmentForm";

export const metadata: Metadata = {
  title: "Best Dermatologist in Gurgaon | Skin Clinic Golf Course Road | Skinfinity Derma",
  description: "Top rated Dermatologist & Skin Clinic in Gurgaon on Golf Course Road Sector 28. Led by Dr. Ipshita Johri & Senior MD Dermatologists. US-FDA Laser Hair Removal, Acne & HydraFacial.",
  alternates: {
    canonical: "/dermatologist-in-gurgaon",
  },
};

export default async function GurgaonPage() {
  let clinicData: any = null;
  try {
    const res = await fetch("http://localhost:4000/api/public/locations/gurgaon-golf-course-road", { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) clinicData = json.data;
    }
  } catch {}

  const gurgaonClinic = clinicData || CLINIC_LOCATIONS[1];
  const clinicPhones = Array.isArray(gurgaonClinic.phones) && gurgaonClinic.phones.length > 0
    ? gurgaonClinic.phones
    : ["+91 85911 10110", "+91 98104 58900"];

  return (
    <div className="bg-white">
      <div className="bg-slate-50 border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">Dermatologist in Gurgaon</span>
          </nav>
        </div>
      </div>

      <section className="py-14 lg:py-20 bg-gradient-to-b from-brand-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft border border-slate-200">
                <span className="text-xs font-bold text-amber-600">Golf Course Road Clinic</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-700">Sector 28, Gurugram</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif leading-tight">
                Best Dermatologist in Gurgaon
                <span className="block text-gradient-teal text-xl sm:text-2xl font-sans font-bold mt-1">
                  Premier Skin, Laser & Hair Clinic — Sector 28
                </span>
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                Welcome to Skinfinity Derma’s premier clinic on Golf Course Road, Gurgaon. Located just minutes from DLF Phase 1 & 2, our clinic offers world-class clinical dermatology, US-FDA laser hair removal, acne scar revision, and non-surgical facial rejuvenation.
              </p>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                  <span className="font-semibold">{gurgaonClinic.address}, {gurgaonClinic.landmark}, {gurgaonClinic.city} - {gurgaonClinic.pincode}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>Call: <a href={`tel:${clinicPhones[0]}`} className="font-bold text-slate-900 hover:text-brand-700">{clinicPhones[0]}</a>{clinicPhones[1] && <> / <a href={`tel:${clinicPhones[1]}`} className="font-bold text-slate-900 hover:text-brand-700">{clinicPhones[1]}</a></>}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Hours: Mon - Sun: 10:00 AM – 08:00 PM</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="#appointment_form"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation in Gurgaon</span>
                </Link>
                <a
                  href="https://wa.me/918591110110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Clinic</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] relative">
                <Image
                  src="/images/clinic/interior-1.jpg"
                  alt="Skinfinity Derma Gurgaon Clinic"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm initialLocation="Gurgaon" />
        </div>
      </section>
    </div>
  );
}
