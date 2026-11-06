"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Phone,
  User,
  Mail,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Lock,
  RefreshCw,
} from "lucide-react";
import { DOCTORS } from "@/data/clinicData";
import { useAuth } from "@/context/AuthContext";

interface AppointmentFormProps {
  initialLocation?: "Noida" | "Gurgaon";
  initialTreatment?: string;
  className?: string;
}

export default function AppointmentForm({
  initialLocation = "Noida",
  initialTreatment = "Acne & Scars Treatment",
  className = "",
}: AppointmentFormProps) {
  const { user, bookConsultation, getDoctorFee, adminSettings } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [location, setLocation] = useState<"Noida" | "Gurgaon">(initialLocation);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("Available Doctor");
  const [treatment, setTreatment] = useState(initialTreatment);
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [preferredTime, setPreferredTime] = useState("11:30 AM");

  const [name, setName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notes, setNotes] = useState("");

  const [applyDiscount, setApplyDiscount] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI");
  const [paymentRef, setPaymentRef] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [confirmedData, setConfirmedData] = useState<{
    token: string;
    txnId: string;
    originalFee: number;
    discount: number;
    finalPaid: number;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setName((prev) => prev || user.fullName);
      setPhone((prev) => prev || user.phone);
      setEmail((prev) => prev || user.email);
    }
  }, [user]);

  const availableDoctors = useMemo(() => {
    const dutyDoctor = {
      id: "available-doctor",
      slug: "available-doctor",
      name: "Available Doctor",
      role: "Senior Duty Dermatologist",
      qualifications: "MD / DDV Certified Specialist",
      specialty: "Skin, Hair & Laser Consultation",
      experience: "Instant Slot",
      image: "/images/doctors/dr-ipshita-johri.webp",
      bio: "Immediate clinical consultation with our on-duty senior MD dermatologist.",
      consultationFee: 1000,
      availableLocations: ["Noida", "Gurgaon"] as ("Noida" | "Gurgaon")[],
      availability: "Available Today (Instant Slot)",
    };
    return [
      dutyDoctor,
      ...DOCTORS.filter((d) => d.availableLocations.includes(location)),
    ];
  }, [location]);

  useEffect(() => {
    if (!availableDoctors.some((d) => d.name === selectedDoctor) && availableDoctors.length > 0) {
      setSelectedDoctor("Available Doctor");
    }
  }, [location, availableDoctors, selectedDoctor]);

  const currentDoctor =
    availableDoctors.find((d) => d.name === selectedDoctor) || availableDoctors[0] || DOCTORS[0];
  const doctorFee = getDoctorFee(currentDoctor.name);
  const discountVal = applyDiscount ? adminSettings.prepaymentDiscount || 100 : 0;
  const finalPayable = Math.max(0, doctorFee - discountVal);

  const treatmentOptions = [
    "Acne & Scars Treatment",
    "Laser Hair Removal (US-FDA)",
    "Sugarcane HydraFacial",
    "Hair Loss & GFC / PRP",
    "Anti-Ageing & Fillers / Botox",
    "Pigmentation & Melasma",
    "Bridal Aesthetic Packages",
    "Chemical Peels & Glow",
    "General Dermatologist Consultation",
  ];

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!name.trim() || !phone.trim()) {
      setErrorMessage("Please enter your full name and 10-digit mobile number.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    setStep(3);
  };

  const handlePaymentVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!paymentRef.trim() || paymentRef.trim().length < 3) {
      setErrorMessage("Please enter your UPI ID / card reference to verify payment.");
      return;
    }
    if (paymentRef.trim().toLowerCase() === "fail") {
      setErrorMessage(
        "Payment verification failed. Appointment is not confirmed until payment succeeds. Please retry."
      );
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      const txnId = `TXN-SKIN-${Math.floor(10000 + Math.random() * 90000)}`;
      const saved = bookConsultation({
        patientName: name.trim(),
        patientPhone: phone.trim(),
        patientEmail: email.trim(),
        doctorName: currentDoctor.name,
        specialty: currentDoctor.role,
        clinicBranch: location === "Gurgaon" ? "Gurgaon Sector 28" : "Noida Sector 36",
        date: preferredDate || "Upcoming Slot",
        timeSlot: preferredTime,
        treatmentName: treatment,
        originalFee: doctorFee,
        discountApplied: discountVal,
        finalAmountPaid: finalPayable,
        paymentStatus: "Verified & Paid",
        transactionId: txnId,
        notes: notes.trim(),
      });

      setConfirmedData({
        token: saved.tokenNumber,
        txnId,
        originalFee: doctorFee,
        discount: discountVal,
        finalPaid: finalPayable,
      });
      setVerifying(false);
      setStep(4);
    }, 700);
  };

  return (
    <div
      id="appointment_form"
      className={`bg-white text-slate-900 rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 lg:p-10 relative overflow-hidden ${className}`}
    >
      {/* Top Step Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-700" />
            {step === 2 ? "Step 2: Get Consultation" : step === 3 ? "Step 3: Make Payment" : "Priority Doctor Booking"}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-serif">
            {step === 2
              ? "Get Consultation"
              : step === 3
              ? "Make Payment"
              : step === 4
              ? "Appointment Confirmed"
              : "Step 1: Appointment Details"}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <span className={`px-2.5 py-1 rounded-full ${step === 1 ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600"}`}>
            1. Details
          </span>
          <span className={`px-2.5 py-1 rounded-full ${step === 2 ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600"}`}>
            2. Get Consultation
          </span>
          <span className={`px-2.5 py-1 rounded-full ${step === 3 ? "bg-amber-500 text-slate-950" : step === 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            3. Make Payment
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: SELECT CLINIC, DOCTOR + FEE, TREATMENT & DATE */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Clinic Location *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["Noida", "Gurgaon"] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                    location === loc
                      ? "bg-brand-700 text-white border-brand-700 shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{loc === "Noida" ? "Noida Clinic (Sec 36)" : "Gurgaon Clinic (Sec 28)"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Available Doctors & Consultation Fees */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Available Doctors ({location}) &amp; Consultation Fee *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableDoctors.map((doc) => {
                const fee = getDoctorFee(doc.name);
                const active = selectedDoctor === doc.name;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctor(doc.name)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      active
                        ? "border-brand-700 bg-brand-50/70 ring-1 ring-brand-700 shadow-sm"
                        : "border-slate-200 bg-slate-50/60 hover:bg-white"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{doc.role}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-extrabold shrink-0">
                      ₹{fee.toLocaleString("en-IN")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#008081] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  onClick={(e) => {
                    const target = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                    if (typeof target.showPicker === "function") {
                      try {
                        target.showPicker();
                      } catch {}
                    }
                  }}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#008081]/60 focus:border-[#008081] focus:bg-white focus:ring-2 focus:ring-[#008081]/15 rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Preferred Time (30-Min Slots)
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#008081]/60 focus:border-[#008081] focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer"
              >
                {[
                  "10:00 AM",
                  "10:30 AM",
                  "11:00 AM",
                  "11:30 AM",
                  "12:00 PM",
                  "12:30 PM",
                  "01:00 PM",
                  "01:30 PM",
                  "02:00 PM",
                  "02:30 PM",
                  "03:00 PM",
                  "03:30 PM",
                  "04:00 PM",
                  "04:30 PM",
                  "05:00 PM",
                  "05:30 PM",
                  "06:00 PM",
                  "06:30 PM",
                  "07:00 PM",
                  "07:30 PM",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Treatment / Concern
              </label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                {treatmentOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Get Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* STEP 2: GET CONSULTATION FORM */}
      {step === 2 && (
        <form onSubmit={handleStep2} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Clinic</span>
              <span className="font-bold text-slate-900">{location} Clinic</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Doctor</span>
              <span className="font-bold text-brand-700">{currentDoctor.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Schedule</span>
              <span className="font-bold text-slate-900">
                {preferredDate} • {preferredTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Consultation Fee</span>
              <span className="font-extrabold text-slate-900">
                ₹{doctorFee.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Concern / Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Any specific skin or hair concern..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md flex items-center justify-center gap-2"
            >
              <span>Appointment Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: MAKE PAYMENT MODAL VIEW */}
      {step === 3 && (
        <form onSubmit={handlePaymentVerify} className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Doctor &amp; Clinic:</span>
              <span className="font-bold text-slate-900">
                {currentDoctor.name} ({location} Clinic)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Original Consultation Fee:</span>
              <span className="font-bold text-slate-900">₹{doctorFee.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <label className="flex items-center gap-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyDiscount}
                  onChange={(e) => setApplyDiscount(e.target.checked)}
                />
                <span>Prepayment Discount (₹100 OFF)</span>
              </label>
              <span className="font-extrabold">- ₹{discountVal}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
              <span>Final Payable Amount:</span>
              <span className="text-brand-700">₹{finalPayable.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(["UPI", "Card", "NetBanking"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                  paymentMethod === m
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{m}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Enter {paymentMethod} ID / Transaction Reference *
            </label>
            <input
              type="text"
              required
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="e.g., name@okaxis or last 4 digits"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={verifying}
              className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify &amp; Pay ₹{finalPayable.toLocaleString("en-IN")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: CONFIRMATION */}
      {step === 4 && confirmedData && (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-2xl font-bold text-slate-900 font-serif">
            Appointment Confirmed (#{confirmedData.token})
          </h4>
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-900">{currentDoctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Clinic:</span>
              <span className="font-bold text-brand-700">{location} Clinic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date &amp; Time:</span>
              <span className="font-bold text-slate-900">
                {preferredDate} at {preferredTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fee Breakdown:</span>
              <span className="font-bold text-slate-900">
                ₹{confirmedData.originalFee} - ₹{confirmedData.discount} = ₹{confirmedData.finalPaid}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-700">
                Verified &amp; Paid ({confirmedData.txnId})
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setPaymentRef("");
              setConfirmedData(null);
            }}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            Book Another Appointment
          </button>
        </div>
      )}
    </div>
  );
}
