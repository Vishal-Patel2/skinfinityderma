"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { CLINIC_LOCATIONS } from "@/data/clinicData";

export default function ServingIn() {
  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Convenient Locations Across Delhi NCR
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
            We Are Serving In
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Visit our state-of-the-art clinics in Noida or Gurgaon for personalized dermatology consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {CLINIC_LOCATIONS.map((loc) => (
            <div
              key={loc.city}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 hover:border-brand-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-700 text-white">
                    <MapPin className="w-3.5 h-3.5" />
                    {loc.city} Clinic
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Open 7 Days
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-serif">
                  {loc.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <a
                    href={loc.mapLink || (loc.city === "Noida" ? "https://share.google/hUEpkQ6r4yLzV4KAA" : "https://share.google/lcTdjEdMmaSLRKDeF")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-700 hover:underline transition-colors block"
                    title={`View Skinfinity Derma ${loc.city} on Google Maps`}
                  >
                    <strong className="text-slate-800 font-semibold">{loc.address}</strong>, {loc.landmark}, {loc.city} - {loc.pincode}
                  </a>
                </p>

                <div className="space-y-2 pt-1 border-t border-slate-200/60 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <div className="flex gap-2">
                      {loc.phones.map((phone, idx) => (
                        <a
                          key={idx}
                          href={`tel:${phone.replace(/\s+/g, '')}`}
                          className="font-semibold text-slate-900 hover:text-brand-700"
                        >
                          {phone}{idx < loc.phones.length - 1 ? "," : ""}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {loc.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-3 h-3 text-brand-700" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between gap-3">
                <Link
                  href={loc.city === "Noida" ? "/about-clinic" : "/dermatologist-in-gurgaon"}
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                >
                  <span>Explore Clinic Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/contact-us#appointment_form`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 transition-colors shadow-sm"
                >
                  Book in {loc.city}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
