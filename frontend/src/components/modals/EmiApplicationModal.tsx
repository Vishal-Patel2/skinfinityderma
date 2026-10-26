"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EmiApplicationModal() {
  const { isEmiModalOpen, closeEmiModal, emiModalData, user, addEmiEnquiry } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [clinicLocation, setClinicLocation] = useState("Noida Sector 36");
  const [preferredTenure, setPreferredTenure] = useState("6 Months (0% Interest EMI)");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<{
    id: string;
    assignedTeam: string;
  } | null>(null);

  useEffect(() => {
    if (isEmiModalOpen) {
      setName(user?.fullName || "");
      setPhone(user?.phone || "");
      setEmail(user?.email || "");
      setClinicLocation(
        user?.preferredClinic?.includes("Gurgaon") ? "Gurgaon Sector 28" : "Noida Sector 36"
      );
      setErrorMsg("");
      setSubmittedRecord(null);
    }
  }, [isEmiModalOpen, user]);

  if (!isEmiModalOpen) return null;

  const treatmentName = emiModalData?.treatmentName || "Clinical Dermatology & Laser Package";
  const treatmentPrice = emiModalData?.priceFormatted || "Custom Clinical Plan";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const record = addEmiEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        clinicLocation,
        treatmentName,
        treatmentPrice,
        preferredTenure,
        notes: notes.trim() || "EMI option requested from treatment page.",
      });
      setSubmittedRecord({
        id: record.id,
        assignedTeam: record.assignedTeam,
      });
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={closeEmiModal}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#042f2e] to-[#008081] text-white p-6 relative">
          <button
            onClick={closeEmiModal}
            aria-label="Close EMI Modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-teal-200 text-[10px] font-bold uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Flexible Clinical Payment Assistance</span>
          </div>
          <h3 className="text-xl font-bold font-serif">Apply for EMI Option</h3>
          <p className="text-xs text-slate-200 mt-1">
            Submit your contact details to discuss convenient monthly installment options with our clinic team.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Selected Treatment Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#008081] block">
                Selected Treatment / Package
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                {treatmentName}
              </h4>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 block">Package Guide</span>
              <span className="text-sm font-extrabold text-slate-900">{treatmentPrice}</span>
            </div>
          </div>

          {submittedRecord ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="inline-block px-3 py-0.5 rounded-full bg-teal-50 text-[#006d6e] text-[11px] font-bold border border-teal-200">
                  Enquiry Ref: #{submittedRecord.id}
                </span>
                <h4 className="text-xl font-bold text-slate-900 font-serif">
                  EMI Enquiry Submitted Successfully
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{name}</strong>. Your request has been assigned to our{" "}
                  <strong className="text-[#008081]">{submittedRecord.assignedTeam}</strong>. Our team will contact you shortly on{" "}
                  <strong className="text-slate-900">{phone}</strong> to discuss eligible EMI plans and documentation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 text-left leading-relaxed">
                <strong>Please Note:</strong> Submitting this form records an EMI enquiry with our clinic coordinator. Final EMI eligibility and tenure depend on partner bank/card issuer verification at the clinic.
              </div>

              <button
                type="button"
                onClick={closeEmiModal}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-[#008081] text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Done &amp; Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-[#008081] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-[#008081] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-[#008081] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Clinic <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={clinicLocation}
                      onChange={(e) => setClinicLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:border-[#008081] outline-none"
                    >
                      <option value="Noida Sector 36">Noida Sector 36</option>
                      <option value="Gurgaon Sector 28">Gurgaon Sector 28</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Installment Tenure
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={preferredTenure}
                    onChange={(e) => setPreferredTenure(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium focus:border-[#008081] outline-none"
                  >
                    <option value="3 Months (0% Interest EMI)">3 Months Installment Plan</option>
                    <option value="6 Months (0% Interest EMI)">6 Months Installment Plan</option>
                    <option value="9 Months Installment Plan">9 Months Installment Plan</option>
                    <option value="12 Months Installment Plan">12 Months Installment Plan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Query / Preferred Bank or Card (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., HDFC Credit Card, ICICI, Bajaj Finserv..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:border-[#008081] outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#008081] shrink-0 mt-0.5" />
                <span>
                  This request connects you with our clinic coordinator to explain available EMI plans. It does not constitute an automated loan approval or financing guarantee.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={closeEmiModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-60"
                >
                  <span>{submitting ? "Submitting..." : "Submit EMI Enquiry"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
