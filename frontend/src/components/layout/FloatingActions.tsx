"use client";

import React from "react";
import { Phone, Calendar, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import WhatsAppButton from "./WhatsAppButton";

export default function FloatingActions() {
  const { openAppointmentModal } = useAuth();
  const { cartCount, openCart } = useCart();

  return (
    <>
      {/* 1. FLOATING VIEW CART CARD (Fixed above mobile bottom bar with safe margin, and bottom-right/center on desktop) */}
      {cartCount > 0 && (
        <div className="fixed bottom-[calc(68px+env(safe-area-inset-bottom,0px))] lg:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl transition-all duration-300">
          <div className="bg-slate-950 text-white rounded-2xl px-4 sm:px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] border border-teal-500/40 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#008081] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                {cartCount}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate">
                  {cartCount} {cartCount === 1 ? "Treatment" : "Treatments"} in Clinical Cart
                </span>
                <span className="text-[10px] sm:text-[11px] text-teal-300 block truncate">
                  0% Interest EMI &amp; Package Discounts Available
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={openCart}
              className="px-4 py-2 rounded-xl bg-[#008081] hover:bg-teal-500 active:bg-teal-600 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
              aria-label="View Clinical Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">View Cart</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. MOBILE BOTTOM STICKY ACTION BAR: Call Clinic & Book Appointment */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <a
          href="tel:+919871941444"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200/80 transition-all active:scale-[0.98]"
          aria-label="Call Skinfinity Derma Clinic"
        >
          <Phone className="w-4 h-4 text-[#008081] shrink-0" />
          <span className="whitespace-nowrap">Call Clinic</span>
        </a>

        <button
          type="button"
          onClick={openAppointmentModal}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#008081] hover:bg-[#006d6e] active:bg-[#005a5b] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
          aria-label="Book Clinical Appointment"
        >
          <Calendar className="w-4 h-4 text-white shrink-0" />
          <span className="whitespace-nowrap">Book Appointment</span>
        </button>
      </div>

      {/* 3. DESKTOP FLOATING WHATSAPP BUTTON (With Noida/Gurgaon branch routing) */}
      <WhatsAppButton className="hidden lg:flex" />
    </>
  );
}
