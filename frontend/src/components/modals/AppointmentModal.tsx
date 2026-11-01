"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Mail,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Video,
  Building2,
  CreditCard,
  AlertCircle,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DOCTORS } from "@/data/clinicData";

export default function AppointmentModal() {
  const {
    isAppointmentModalOpen,
    closeAppointmentModal,
    appointmentPrefillTreatment,
    user,
    bookConsultation,
    getDoctorFee,
    adminSettings,
  } = useAuth();

  // Steps:
  // 1: Appointment Details (Clinic, Available Doctors + Fees, Date & Time, Treatment)
  // 2: "Get Consultation" Form (Patient details + Selected summary + "Appointment Request" CTA)
  // 3: "Make Payment" Modal (Original Fee, ₹100 Prepayment Discount, Final Payable, Payment Verification / Retry / Cancel)
  // 4: Appointment Confirmation Screen (Reference, Doctor, Clinic, Date, Time, Payment Status)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1 State: Clinic, Doctor, Date, Time, Mode, Treatment
  const [selectedCity, setSelectedCity] = useState<"Noida" | "Gurgaon">("Noida");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("Available Doctor");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("11:30 AM");
  const [consultationMode, setConsultationMode] = useState<"In-Clinic" | "Online Video">("In-Clinic");
  const [treatment, setTreatment] = useState("US-FDA Laser Hair Removal");

  // Step 2 State: Patient Consultation Form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Step 3 State: Make Payment & Verification
  const [applyPrepaymentDiscount, setApplyPrepaymentDiscount] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "NetBanking">("UPI");
  const [paymentIdentifier, setPaymentIdentifier] = useState("");
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [submissionLock, setSubmissionLock] = useState(false);

  // Step 4 State: Confirmed Appointment Record
  const [confirmedRecord, setConfirmedRecord] = useState<{
    tokenNumber: string;
    transactionId: string;
    originalFee: number;
    discountApplied: number;
    finalAmountPaid: number;
    paymentStatus: string;
  } | null>(null);

  // Pre-fill user details & prefill treatment when opened
  useEffect(() => {
    if (isAppointmentModalOpen) {
      if (user) {
        setFullName((prev) => prev || user.fullName || "");
        setPhone((prev) => prev || user.phone || "");
        setEmail((prev) => prev || user.email || "");
        if (user.preferredClinic?.includes("Gurgaon")) {
          setSelectedCity("Gurgaon");
        }
      }
      if (appointmentPrefillTreatment) {
        setTreatment(appointmentPrefillTreatment);
      }
    }
  }, [isAppointmentModalOpen, user, appointmentPrefillTreatment]);

  // Filter available doctors based on selected location (6 cards: Available Doctor first + 5 Doctors)
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
    const filtered = DOCTORS.filter((doc) => doc.availableLocations.includes(selectedCity));
    return [dutyDoctor, ...filtered];
  }, [selectedCity]);

  // Ensure "Available Doctor" (first card) is automatically selected by default when location changes
  useEffect(() => {
    const isStillAvailable = availableDoctors.some((d) => d.name === selectedDoctor);
    if (!isStillAvailable && availableDoctors.length > 0) {
      setSelectedDoctor("Available Doctor");
    }
  }, [selectedCity, availableDoctors, selectedDoctor]);

  if (!isAppointmentModalOpen) return null;

  const currentDoctorObj =
    availableDoctors.find((d) => d.name === selectedDoctor) || availableDoctors[0] || DOCTORS[0];
  const consultationFee = getDoctorFee(currentDoctorObj.name);
  const discountAmount = applyPrepaymentDiscount ? adminSettings.prepaymentDiscount || 100 : 0;
  const finalPayableAmount = Math.max(0, consultationFee - discountAmount);

  const clinicFullTitle =
    selectedCity === "Noida"
      ? "Noida Sector 36 (Near Logix Mall)"
      : "Gurgaon Sector 28 (Golf Course Road)";

  const treatmentList = [
    "US-FDA Laser Hair Removal",
    "Signature Sugarcane HydraFacial MD",
    "Acne & Scar Remodeling (MNRF + Subcision)",
    "GFC & Autologous Hair Loss Restoration",
    "Pigmentation & Melasma Laser Toning",
    "Botox & Dermal Fillers Contouring",
    "Chemical Peels & Instant Glow Facials",
    "General Dermatologist Consultation",
  ];

  const timeSlots = [
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
  ];

  // Step 1 -> Step 2
  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!selectedCity || !selectedDoctor || !selectedDate || !selectedTimeSlot) {
      setErrorMsg("Please select your preferred clinic, doctor, date, and time slot.");
      return;
    }
    setStep(2);
  };

  // Step 2 ("Get Consultation") -> Step 3 ("Make Payment" Modal)
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (email.trim() && !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setPaymentError("");
    setStep(3);
  };

  // Step 3: Verify Payment & Confirm Appointment
  const handleVerifyAndPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyingPayment || submissionLock) return;
    setPaymentError("");

    if (!paymentIdentifier.trim() || paymentIdentifier.trim().length < 3) {
      setPaymentError(
        paymentMethod === "UPI"
          ? "Please enter your UPI ID (e.g., name@okaxis) or UTR number for payment verification."
          : paymentMethod === "Card"
          ? "Please enter the last 4 digits of your card or payment reference."
          : "Please enter your bank transaction reference ID to verify payment."
      );
      return;
    }

    // Handle simulated failed payment if user types "fail"
    if (paymentIdentifier.trim().toLowerCase() === "fail") {
      setPaymentError(
        "Payment verification failed by gateway. Appointment was NOT marked as paid. Please check your details and retry."
      );
      return;
    }

    setVerifyingPayment(true);
    setSubmissionLock(true);

    setTimeout(() => {
      const txnId = `TXN-SKIN-${Math.floor(10000 + Math.random() * 90000)}`;
      const token = `SK-${Math.floor(1000 + Math.random() * 9000)}`;

      const saved = bookConsultation({
        patientName: fullName.trim(),
        patientPhone: phone.trim(),
        patientEmail: email.trim(),
        doctorName: currentDoctorObj.name,
        specialty: currentDoctorObj.role,
        clinicBranch: selectedCity === "Gurgaon" ? "Gurgaon Sector 28" : "Noida Sector 36",
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        treatmentName: treatment,
        tokenNumber: token,
        originalFee: consultationFee,
        discountApplied: discountAmount,
        finalAmountPaid: finalPayableAmount,
        paymentStatus: "Verified & Paid",
        transactionId: txnId,
        notes: notes.trim(),
      });

      setConfirmedRecord({
        tokenNumber: saved.tokenNumber,
        transactionId: txnId,
        originalFee: saved.originalFee || consultationFee,
        discountApplied: saved.discountApplied ?? discountAmount,
        finalAmountPaid: saved.finalAmountPaid ?? finalPayableAmount,
        paymentStatus: "Verified & Paid",
      });

      setVerifyingPayment(false);
      setSubmissionLock(false);
      setStep(4);
    }, 900);
  };

  const handleClose = () => {
    setStep(1);
    setErrorMsg("");
    setPaymentError("");
    setSubmissionLock(false);
    closeAppointmentModal();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Main Multi-Step Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[620px] max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all hover:rotate-90 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Clinic Information & Selected Doctor Summary */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-slate-950 via-[#042f2e] to-[#008081] flex-col justify-between p-8 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-25 mix-blend-luminosity">
            <Image
              src="/images/custom/clinic-reception.jpg"
              alt="Skinfinity Clinic"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold text-teal-200 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Doctor Consultation</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-serif leading-snug text-white">
                Personalized Dermatology &amp; Aesthetic Care
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consult with senior MD dermatologists at our Noida Sector 36 or Gurgaon Sector 28 flagship clinics.
              </p>
            </div>

            {/* Live Selected Summary Card */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-teal-200 font-semibold">Selected Clinic:</span>
                <span className="font-bold text-white">{selectedCity} Clinic</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-teal-200 font-semibold">Selected Doctor:</span>
                <span className="font-bold text-white">{currentDoctorObj.name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-teal-200 font-semibold">Consultation Fee:</span>
                <span className="font-extrabold text-amber-300 text-sm">
                  ₹{consultationFee.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-teal-200 font-semibold">Prepayment Offer:</span>
                <span className="text-emerald-300 font-bold">Save ₹100 Online</span>
              </div>
            </div>
          </div>

          {/* Reception Photo Card */}
          <div className="relative z-10 my-4 rounded-2xl overflow-hidden border border-white/20 shadow-lg aspect-[16/9]">
            <Image
              src="/images/custom/clinic-reception.jpg"
              alt="Skinfinity Derma Luxury Clinic"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-semibold text-white">
                {clinicFullTitle}
              </span>
            </div>
          </div>

          {/* Bottom Trust Checkpoints */}
          <div className="relative z-10 space-y-2 text-xs text-slate-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dr. Ipshita Johri (₹1,200) &amp; Senior MD Specialists (₹1,000)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant ₹100 Discount on Eligible Online Prepayment</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Government-Approved CMO Licensed Clinical Facility</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4-Step Booking & Payment Flow */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
          {/* Top Header & Step Indicator */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pr-8">
              <Image
                src="/images/logo/logo.webp"
                alt="Skinfinity Derma"
                width={130}
                height={34}
                className="h-7 w-auto object-contain"
              />

              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold">
                <span
                  className={`px-2.5 py-0.5 rounded-full ${
                    step === 1 ? "bg-[#008081] text-white" : "bg-teal-50 text-[#008081]"
                  }`}
                >
                  1. Appointment Details
                </span>
                <span className="text-slate-300">→</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full ${
                    step === 2 ? "bg-[#008081] text-white" : step > 2 ? "bg-teal-50 text-[#008081]" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  2. Get Consultation
                </span>
                <span className="text-slate-300">→</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full ${
                    step === 3 ? "bg-amber-500 text-slate-950" : step === 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {step === 4 ? "✓ Confirmed" : "3. Make Payment"}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="my-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* STEP 1: APPOINTMENT DETAILS (Clinic, Doctor + Fee, Slot)       */}
          {/* ============================================================== */}
          {step === 1 && (
            <form onSubmit={handleStep1Continue} className="space-y-4 my-auto py-1">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Step 1: Appointment Details
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your preferred clinic location, available dermatologist, and appointment timing.
                </p>
              </div>

              {/* 1. Preferred Clinic Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  1. Select Preferred Clinic Location <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(["Noida", "Gurgaon"] as const).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setSelectedCity(city)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedCity === city
                          ? "border-[#008081] bg-teal-50/70 text-[#006d6e] ring-1 ring-[#008081] shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-[#008081] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {city === "Noida" ? "Noida Clinic (Sector 36)" : "Gurgaon Clinic (Sector 28)"}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {city === "Noida" ? "Near Logix City Centre Mall" : "Golf Course Road, Sec 28"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Available Doctors with Consultation Fees */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Available Doctors in {selectedCity} &amp; Consultation Fee <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Auto-selected • Click to change
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[195px] overflow-y-auto pr-1">
                  {availableDoctors.map((doc) => {
                    const fee = getDoctorFee(doc.name);
                    const isSelected = selectedDoctor === doc.name;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setSelectedDoctor(doc.name)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                          isSelected
                            ? "border-[#008081] bg-teal-50/80 ring-1 ring-[#008081] shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{doc.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#008081] shrink-0" />}
                          </div>
                          <p className="text-[10px] text-teal-800 font-medium line-clamp-1">{doc.role}</p>
                          <p className="text-[10px] text-slate-500">{doc.availability}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900 text-white text-xs font-extrabold">
                            ₹{fee.toLocaleString("en-IN")}
                          </span>
                          <span className="block text-[9px] text-emerald-700 font-semibold mt-0.5">
                            Available
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Date Calendar & 30-Min Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Preferred Date
                  </label>
                  <div className="relative group">
                    <Calendar className="w-4 h-4 text-[#008081] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      onClick={(e) => {
                        const target = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                        if (typeof target.showPicker === "function") {
                          try {
                            target.showPicker();
                          } catch {}
                        }
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#008081]/60 text-xs font-semibold text-slate-800 focus:border-[#008081] focus:bg-white focus:ring-2 focus:ring-[#008081]/15 outline-none transition-all cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Preferred Time (30-Min Slots)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#008081] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#008081]/60 text-xs font-semibold text-slate-800 focus:border-[#008081] focus:bg-white focus:ring-2 focus:ring-[#008081]/15 outline-none transition-all cursor-pointer"
                    >
                      {timeSlots.map((slot, i) => (
                        <option key={i} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Treatment & Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Treatment / Concern
                  </label>
                  <select
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-[#008081] outline-none"
                  >
                    {treatmentList.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pb-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      checked={consultationMode === "In-Clinic"}
                      onChange={() => setConsultationMode("In-Clinic")}
                      className="text-[#008081] focus:ring-[#008081]"
                    />
                    <Building2 className="w-3.5 h-3.5 text-[#008081]" />
                    <span>In-Clinic</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      checked={consultationMode === "Online Video"}
                      onChange={() => setConsultationMode("Online Video")}
                      className="text-[#008081] focus:ring-[#008081]"
                    />
                    <Video className="w-3.5 h-3.5 text-[#008081]" />
                    <span>Video Call</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="text-xs text-slate-600">
                  Consultation Fee:{" "}
                  <strong className="text-slate-900 font-extrabold">
                    ₹{consultationFee.toLocaleString("en-IN")}
                  </strong>{" "}
                  <span className="text-emerald-700 font-semibold">(₹100 OFF on Prepayment)</span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* STEP 2: "Get Consultation" Form                                */}
          {/* ============================================================== */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4 my-auto py-1">
              {/* Heading "Get Consultation" moved to the top of Step 2 */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#008081] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Step 2 of 3
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-serif mt-1">
                  Get Consultation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review your selected doctor and enter your contact details to proceed.
                </p>
              </div>

              {/* Selected Clinic, Doctor, Consultation Fee & Appointment Summary */}
              <div className="p-3.5 rounded-2xl bg-[#f2faf7] border border-[#d2eee7] grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Selected Clinic</span>
                  <span className="font-bold text-slate-900">{selectedCity} Clinic</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Selected Doctor</span>
                  <span className="font-bold text-[#006d6e]">{currentDoctorObj.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Date &amp; Slot</span>
                  <span className="font-bold text-slate-900">
                    {selectedDate.split(" ")[0]} • {selectedTimeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Consultation Fee</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{consultationFee.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Simple, Clear Patient Fields */}
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
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] text-xs text-slate-800 outline-none"
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
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

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
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Skin or Hair Concerns (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Briefly describe your skin/hair concern..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#008081] text-xs text-slate-800 outline-none resize-none"
                />
              </div>

              {/* Navigation Buttons (Preserves entered info on Back) */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg("");
                    setStep(1);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Step 1</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Appointment Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* STEP 3: "Make Payment" Modal & Prepayment Discount             */}
          {/* ============================================================== */}
          {step === 3 && (
            <form onSubmit={handleVerifyAndPay} className="space-y-4 my-auto py-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Lock className="w-3 h-3" />
                    Secure Payment Verification
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-serif mt-1">
                    Make Payment
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Payable Amount</span>
                  <span className="text-xl font-black text-[#008081] font-serif">
                    ₹{finalPayableAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {paymentError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{paymentError}</p>
                  </div>
                </div>
              )}

              {/* Consultation & Price Breakdown Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Patient &amp; Clinic:</span>
                  <span className="font-bold text-slate-900">
                    {fullName} • {selectedCity} Clinic
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Doctor &amp; Schedule:</span>
                  <span className="font-bold text-slate-900">
                    {currentDoctorObj.name} ({selectedDate.split(" ")[0]}, {selectedTimeSlot})
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span>Original Consultation Fee:</span>
                    <span className="font-bold">₹{consultationFee.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Eligible Prepayment Discount Toggle */}
                  <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={applyPrepaymentDiscount}
                        onChange={(e) => setApplyPrepaymentDiscount(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-600"
                      />
                      <span>Prepayment Offer (₹100 Instant Discount)</span>
                    </label>
                    <span className="font-extrabold">
                      - ₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1">
                    <span>Final Payable Amount:</span>
                    <span className="text-[#008081] text-base">
                      ₹{finalPayableAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(["UPI", "Card", "NetBanking"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        paymentMethod === method
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{method === "UPI" ? "UPI / QR" : method === "Card" ? "Debit / Credit" : "NetBanking"}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {paymentMethod === "UPI"
                      ? "Enter UPI ID or 12-Digit UTR Reference *"
                      : paymentMethod === "Card"
                      ? "Enter Card Last 4 Digits / Authorization Code *"
                      : "Enter NetBanking Transaction Reference *"}{" "}
                    <span className="text-[10px] font-normal text-slate-400">
                      (Type &quot;fail&quot; to test failed payment retry handling)
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentIdentifier}
                    onChange={(e) => setPaymentIdentifier(e.target.value)}
                    placeholder={
                      paymentMethod === "UPI"
                        ? "e.g., patient@okicici or 429811029384"
                        : paymentMethod === "Card"
                        ? "e.g., 4829"
                        : "e.g., NEFT9827162"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={verifyingPayment}
                  onClick={() => {
                    setPaymentError("");
                    setStep(2);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={verifyingPayment}
                    onClick={handleClose}
                    className="px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                  >
                    Cancel Payment
                  </button>
                  <button
                    type="submit"
                    disabled={verifyingPayment}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-60"
                  >
                    {verifyingPayment ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Payment...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₹{finalPayableAmount.toLocaleString("en-IN")} &amp; Confirm</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ============================================================== */}
          {/* STEP 4: APPOINTMENT CONFIRMATION SCREEN                        */}
          {/* ============================================================== */}
          {step === 4 && confirmedRecord && (
            <div className="my-auto py-3 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 text-[#006d6e] font-extrabold text-xs uppercase tracking-wider mb-1.5">
                  <span>Appointment Ref: #{confirmedRecord.tokenNumber}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-serif">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{fullName}</strong>. Your payment has been verified and your consultation slot is confirmed.
                </p>
              </div>

              {/* Complete Verified Confirmation Summary */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Appointment Reference:</span>
                  <span className="font-extrabold text-slate-900">#{confirmedRecord.tokenNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-bold text-slate-900">{currentDoctorObj.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Clinic Location:</span>
                  <span className="font-bold text-[#008081]">{clinicFullTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-bold text-slate-900">
                    {selectedDate} at {selectedTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Original Consultation Fee:</span>
                  <span className="font-semibold text-slate-700">
                    ₹{confirmedRecord.originalFee.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5 text-emerald-700">
                  <span>Prepayment Discount Applied:</span>
                  <span className="font-bold">
                    - ₹{confirmedRecord.discountApplied.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-700 font-bold">Final Amount Paid:</span>
                  <span className="font-extrabold text-slate-900">
                    ₹{confirmedRecord.finalAmountPaid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                    {confirmedRecord.paymentStatus} ({confirmedRecord.transactionId})
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/account"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all text-center"
                >
                  View in My Appointments
                </Link>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          )}

          {/* Footer Hotline */}
          <div className="border-t border-slate-100 pt-3 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400">
            <span>Skinfinity Derma • Noida Sec 36 &amp; Gurgaon Sec 28</span>
            <span>Helpline: +91 98719 41444</span>
          </div>
        </div>
      </div>
    </div>
  );
}
