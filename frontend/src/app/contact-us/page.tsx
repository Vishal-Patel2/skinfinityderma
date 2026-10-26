import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  MessageCircle,
  Calendar
} from "lucide-react";
import { CLINIC_LOCATIONS } from "@/data/clinicData";
import AppointmentForm from "@/components/modals/AppointmentForm";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";

export const metadata: Metadata = {
  title: "Contact Skinfinity Derma | Noida & Gurgaon Clinic Locations",
  description: "Contact Skinfinity Derma clinics in Noida Sector 36 & Gurgaon Sector 28 Golf Course Road. Phone numbers: +91 9871941444 / +91 8591110110. Book consultation today.",
  alternates: {
    canonical: "/contact-us",
  },
};

export default function ContactUsPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumb Banner */}
      <PageBreadcrumbBanner
        image="/images/breadcrumbbanner/contact-us.webp"
        breadcrumbs={[{ label: "Contact Us" }]}
        badge="Connect With Our Doctors"
        title="Contact Skinfinity"
        highlight="Derma Clinics"
        subtitle="Conveniently located in Noida (Sector 36, Near Logix Mall) and Gurgaon (Sector 28, Golf Course Road). Schedule your personalized consultation with our senior MD Dermatologists."
      />

      {/* Two Clinic Cards & Map Section */}
      <section className="py-12 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Noida Clinic */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-brand-700 text-white">
                    <MapPin className="w-3.5 h-3.5" />
                    Noida Clinic (Headquarters)
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Open 7 Days
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Skinfinity Derma — Sector 36 Noida
                </h2>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                    <span>Basement Floor, House B1, Sector 36, Near Logix City Centre Mall, Noida - 201303, Uttar Pradesh</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-brand-700 shrink-0" />
                    <span>
                      Call: <a href="tel:+919871941444" className="font-semibold text-slate-900 hover:text-brand-700">+91 98719 41444</a> / <a href="tel:+918929765785" className="font-semibold text-slate-900 hover:text-brand-700">+91 89297 65785</a>
                    </span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-brand-700 shrink-0" />
                    <a href="mailto:skinfinityderma@gmail.com" className="hover:text-brand-700">skinfinityderma@gmail.com</a>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Consulting Hours: Mon - Sun: 10:00 AM – 08:00 PM</span>
                  </p>
                </div>
              </div>

              {/* Map Embed */}
              <div className="rounded-2xl overflow-hidden h-56 border border-slate-200">
                <iframe
                  title="Skinfinity Derma Noida Clinic Location"
                  src="https://maps.google.com/maps?q=Skinfinity%20Derma%20Noida%20Sector%2036&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="flex gap-3">
                <a
                  href="tel:+919871941444"
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 text-center shadow-sm"
                >
                  Call Noida Clinic
                </a>
                <a
                  href="https://wa.me/919871941444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Gurgaon Clinic */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-600 text-white">
                    <MapPin className="w-3.5 h-3.5" />
                    Gurgaon Clinic (Golf Course Rd)
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Open 7 Days
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Skinfinity Derma — Sector 28 Gurugram
                </h2>

                <div className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>2nd Floor, SP1, Sector 28, Golf Course Road, Gurugram - 122002 (Near DLF Phase 1 & 2), Haryana</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Call: <a href="tel:+918591110110" className="font-semibold text-slate-900 hover:text-brand-700">+91 85911 10110</a> / <a href="tel:+919810458900" className="font-semibold text-slate-900 hover:text-brand-700">+91 98104 58900</a>
                    </span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <a href="mailto:skinfinitygurgaonclinic@gmail.com" className="hover:text-brand-700">skinfinitygurgaonclinic@gmail.com</a>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Consulting Hours: Mon - Sun: 10:00 AM – 08:00 PM</span>
                  </p>
                </div>
              </div>

              {/* Map Embed */}
              <div className="rounded-2xl overflow-hidden h-56 border border-slate-200">
                <iframe
                  title="Skinfinity Derma Gurgaon Clinic Location"
                  src="https://maps.google.com/maps?q=Skinfinity%20Derma%20Gurgaon%20Sector%2028&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="flex gap-3">
                <a
                  href="tel:+918591110110"
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 text-center shadow-sm"
                >
                  Call Gurgaon Clinic
                </a>
                <a
                  href="https://wa.me/918591110110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}
