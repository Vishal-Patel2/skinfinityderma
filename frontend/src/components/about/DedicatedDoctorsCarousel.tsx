"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { DOCTORS } from "@/data/clinicData";
import { useAuth } from "@/context/AuthContext";
import { getDoctors } from "@/lib/api";

export default function DedicatedDoctorsCarousel() {
  const { openAppointmentModal } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const initialDocs = DOCTORS.map((doc) =>
    doc.id === "dr-ipshita-johri"
      ? { ...doc, image: "/images/doctors/dr-ipshita-johri.webp" }
      : doc
  );

  const [doctorsList, setDoctorsList] = useState(initialDocs);

  useEffect(() => {
    let active = true;
    getDoctors().then((data) => {
      if (active && data && data.length > 0) {
        setDoctorsList(data as any);
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 310, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="py-10 lg:py-14 border-b border-slate-100 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Senior Clinical Board</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Dedicated <span className="text-brand-700">Doctor Profiles</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
              Every procedure at Skinfinity Derma is performed or supervised directly by certified MD dermatologists.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous doctor"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next doctor"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {doctorsList.map((doc) => (
            <div
              key={doc.id}
              className="flex-none w-[275px] sm:w-[290px] lg:w-[calc(25%-18px)] snap-start bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <Link
                  href={`/doctors/${doc.id}`}
                  className="block relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 mb-5"
                >
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-sm">
                    {doc.experience || "MD Dermatologist"}
                  </div>
                </Link>

                <Link href={`/doctors/${doc.id}`}>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-serif">
                    {doc.name}
                  </h4>
                </Link>
                <p className="text-xs text-brand-700 font-semibold mt-1">
                  {doc.role}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {doc.qualifications}
                </p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                  {doc.bio}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/doctors/${doc.id}`}
                  className="flex-1 text-center py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  View Profile
                </Link>
                <button
                  type="button"
                  onClick={() => openAppointmentModal("General Dermatologist Consultation")}
                  className="flex-1 text-center py-2 px-2.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-700 hover:text-white transition-all cursor-pointer"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
