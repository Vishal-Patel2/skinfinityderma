"use client";

import React from "react";
import Link from "next/link";
import { Phone, Calendar, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  return (
    <>
      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-around gap-2 shadow-2xl">
        <a
          href="tel:+919871941444"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors"
        >
          <Phone className="w-4 h-4 text-brand-700" />
          <span>Call Clinic</span>
        </a>

        <a
          href="https://wa.me/918591110110?text=Hello%20Skinfinity%20Derma,%20I%20would%20like%20to%20inquire%20about%20a%20consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <Link
          href="/contact-us#appointment_form"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-700 text-white text-xs font-bold hover:bg-brand-800 transition-colors shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appt</span>
        </Link>
      </div>

      {/* Desktop Floating WhatsApp Button */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/918591110110?text=Hello%20Skinfinity%20Derma,%20I%20would%20like%20to%20inquire%20about%20a%20consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-emerald-700 hover:scale-105 transition-all duration-300 font-semibold text-xs border border-emerald-400/40"
          aria-label="Chat on WhatsApp with Skinfinity Derma Clinic"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </>
  );
}
