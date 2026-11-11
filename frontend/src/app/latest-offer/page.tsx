import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, Tag, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { SPECIAL_OFFERS } from "@/data/clinicData";
import AppointmentForm from "@/components/modals/AppointmentForm";
import SectionDivider from "@/components/shared/SectionDivider";

export const metadata: Metadata = {
  title: "Latest Offers & Bridal Packages | Skinfinity Derma",
  description: "Special monthly offers on laser hair reduction, bridal skin preparation, Sugarcane HydraFacial, and GFC hair restoration at Skinfinity Derma clinics.",
  alternates: {
    canonical: "/latest-offer",
  },
};

export default function LatestOffersPage() {
  return (
    <div className="bg-white">
      <div className="bg-slate-50  py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-semibold">Latest Offers</span>
          </nav>
        </div>
      </div>

      <section className="py-14 bg-gradient-to-b from-amber-50/40 via-white to-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
            Limited Period Privileges
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-3 font-serif">
            Best Offers This Month
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Exclusive festive, bridal, and seasonal packages crafted to deliver maximum medical aesthetic value without compromising clinical quality.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="py-16 bg-slate-50/60 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SPECIAL_OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {offer.badge}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-serif">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {offer.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/contact-us#appointment_form`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{offer.linkText}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}
