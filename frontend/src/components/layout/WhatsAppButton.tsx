"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle, X, ChevronRight, Phone } from "lucide-react";

export interface WhatsAppButtonProps {
  noidaPhone?: string;
  gurgaonPhone?: string;
  defaultMessage?: string;
  className?: string;
}

export default function WhatsAppButton({
  noidaPhone = "+919871941444",
  gurgaonPhone = "+918591110110",
  defaultMessage = "Hi Skinfinity Derma, I would like to inquire about a consultation and treatment options.",
  className = "",
}: WhatsAppButtonProps) {
  const [showOptions, setShowOptions] = useState(false);

  const cleanNoida = noidaPhone.replace(/[^0-9]/g, "");
  const cleanGurgaon = gurgaonPhone.replace(/[^0-9]/g, "");
  const encodedMsg = encodeURIComponent(defaultMessage);

  const noidaUrl = `https://wa.me/${cleanNoida}?text=${encodedMsg}`;
  const gurgaonUrl = `https://wa.me/${cleanGurgaon}?text=${encodedMsg}`;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end ${className}`}>
      {/* Branch selector popup */}
      {showOptions && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 font-serif">
                Chat with Skinfinity Clinic
              </span>
            </div>
            <button
              onClick={() => setShowOptions(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Close WhatsApp options"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Connect directly with our clinical coordinators for appointments, pricing, or queries:
          </p>

          <div className="space-y-2">
            <a
              href={noidaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/70 text-[#0c4445] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  N
                </div>
                <div>
                  <span className="text-xs font-bold block text-slate-900">Noida Clinic (Sec 36)</span>
                  <span className="text-[10px] text-slate-500">+91 98719 41444</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </a>

            <a
              href={gurgaonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200/70 text-[#0c4445] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  G
                </div>
                <div>
                  <span className="text-xs font-bold block text-slate-900">Gurgaon Clinic (Sec 28)</span>
                  <span className="text-[10px] text-slate-500">+91 85911 10110</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      )}

      {/* Main WhatsApp Floating Pill */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl shadow-emerald-500/30 transition-all duration-300 active:scale-95 cursor-pointer"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">WhatsApp</span>
      </button>
    </div>
  );
}
