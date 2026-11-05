"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Crown,
  CreditCard,
  Clock,
  CheckCircle2,
  LogOut,
  Save,
  FileText,
  Stethoscope,
  Zap,
  ChevronRight,
  ChevronDown,
  Edit3,
  Plus,
  ShoppingBag,
  Trash2,
  Settings,
} from "lucide-react";
import { useAuth, UserProfile } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    token,
    isLoggedIn,
    logout,
    updateProfile,
    consultations,
    treatmentOrders,
    openAuthModal,
    openEmiModal,
    openAppointmentModal,
  } = useAuth();
  const {
    items: cartItems,
    cartCount,
    subtotal,
    discount,
    total,
    updateQuantity,
    removeItem,
    openCart,
    checkout,
  } = useCart();
  const openModal = openAppointmentModal;

  const [activeTab, setActiveTab] = useState<
    "appointments" | "cart" | "packages" | "profile" | "records"
  >("appointments");
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [liveRecords, setLiveRecords] = useState<{
    appointments: any[];
    packages: any[];
    skinAssessments: any[];
    prescriptions: any[];
    payments: any[];
    activityLogs: any[];
  } | null>(null);
  const [loadingRecords, setLoadingRecords] = useState(false);

  React.useEffect(() => {
    if (isLoggedIn && token) {
      setLoadingRecords(true);
      const getBackendUrl = () => {
        if (typeof window !== "undefined") {
          if (window.location.port === "3000") return "http://localhost:4000";
          const envUrl = process.env.NEXT_PUBLIC_API_URL || "";
          if (envUrl) return envUrl.replace(/\/api\/public\/?$/, "").replace(/\/api\/?$/, "");
          return window.location.origin;
        }
        return "http://localhost:4000";
      };

      fetch(`${getBackendUrl()}/api/auth/patient/my-records`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((resData) => {
          if (resData && resData.success && resData.data) {
            setLiveRecords(resData.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingRecords(false));
    }
  }, [isLoggedIn, token]);

  // Editable Profile Form State
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    alternatePhone: user?.alternatePhone || "",
    gender: user?.gender || "Male",
    dob: user?.dob || "1994-12-18",
    preferredClinic: user?.preferredClinic || "Noida Flagship Clinic (Sector 36)",
    address: user?.address || "House B1, Basement Floor, Sector 36",
    city: user?.city || "Noida",
    pincode: user?.pincode || "201303",
  });

  // Sync state if user loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        alternatePhone: user.alternatePhone || "",
        gender: user.gender || "Male",
        dob: user.dob || "1994-12-18",
        preferredClinic: user.preferredClinic || "Noida Flagship Clinic (Sector 36)",
        address: user.address || "House B1, Basement Floor, Sector 36",
        city: user.city || "Noida",
        pincode: user.pincode || "201303",
      });
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
    router.push("/");
  };

  const displayAppointments = (liveRecords?.appointments && liveRecords.appointments.length > 0)
    ? liveRecords.appointments.map((a: any) => ({
        id: a.appointment_no || `APT-${a.id}`,
        treatmentName: a.service_name || "Specialist Dermatology Consultation",
        doctorName: a.doctor_name || "Dr. Ipshita Johri & Team",
        specialty: a.doctor_role || "Senior MD Dermatologist",
        clinicBranch: a.clinic_branch || "Noida Sector 36 HQ",
        date: a.appointment_date ? String(a.appointment_date).slice(0, 10) : "Scheduled",
        timeSlot: a.appointment_time || "11:00 AM",
        status: (a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : "Confirmed") as any,
        tokenNumber: `SK-${String(a.id).slice(-4)}`,
        originalFee: Number(a.consultation_fee) || 1200,
        discountApplied: Number(a.discount) || 0,
        finalAmountPaid: Number(a.final_amount) || Number(a.consultation_fee) || 1200,
        paymentStatus: (a.payment_status === "paid" ? "Verified & Paid" : "Pay at Clinic") as any,
        transactionId: a.invoice_id ? `INV-${a.invoice_id}` : undefined,
      }))
    : consultations;

  const displayPackages = (liveRecords?.packages && liveRecords.packages.length > 0)
    ? liveRecords.packages.map((pkg: any) => ({
        id: `PKG-${pkg.id}`,
        packageName: pkg.package_name || pkg.treatment_name || "Clinical Treatment Package",
        sessionsPurchased: Number(pkg.total_sessions || 1),
        sessionsCompleted: Number(pkg.used_sessions || 0),
        orderDate: pkg.purchase_date ? String(pkg.purchase_date).slice(0, 10) : "Active",
        amountPaid: `₹${Number(pkg.amount_paid || 0).toLocaleString("en-IN")}`,
        status: (pkg.status === "Active" ? "Active" : "Completed") as any,
        invoiceNumber: `INV-SKIN-${pkg.id}`,
      }))
    : treatmentOrders;

  // If not logged in, prompt user to sign in
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-gradient-to-b from-[#f2faf7] to-white">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-[#008081] mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              Clinical Account Login Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Please sign in to access your My Cart, My Appointments, active treatment packages, and clinical records.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openAuthModal("signin")}
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-[#008081] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Sign In to View Details
            </button>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Open Full Login Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#008081]">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">My Account &amp; Appointments</span>
        </div>

        {/* 1. Profile Hero Card */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-200/90 p-6 sm:p-8 mb-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Avatar Initials Badge */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#008081] to-[#042f2e] text-white font-serif text-2xl sm:text-3xl font-extrabold flex items-center justify-center shadow-lg shadow-teal-900/20 shrink-0 border-2 border-white">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                    {user.fullName}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                    <Crown className="w-3 h-3 text-amber-600" />
                    {user.memberTier}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {user.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#008081]" />
                    {user.preferredClinic}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Actions & Subtle Profile Menu (Sign Out hidden inside menu) */}
            <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
              <button
                onClick={() => openModal("General Dermatologist Consultation")}
                className="px-4 py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book a New Treatment</span>
              </button>

              <button
                onClick={() => setActiveTab("cart")}
                className="px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#006d6e] border border-teal-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Cart ({cartCount})</span>
              </button>

              {/* Account Dropdown Menu (Sign Out placed inside dropdown to prevent accidental clicks) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Account Menu</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      profileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("profile");
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Contact Details</span>
                    </button>
                    <Link
                      href="/treatments"
                      onClick={() => setProfileMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-slate-400" />
                      <span>Browse All Treatments</span>
                    </Link>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50/60 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
            <div
              onClick={() => setActiveTab("appointments")}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-100 cursor-pointer transition-colors"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                My Appointments
              </span>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {displayAppointments.length} Bookings
              </p>
              <span className="text-[10px] text-[#008081] font-semibold">
                Dr. Ipshita Johri &amp; Team
              </span>
            </div>

            <div
              onClick={() => setActiveTab("cart")}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-100 cursor-pointer transition-colors"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                My Cart
              </span>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {cartCount} {cartCount === 1 ? "Treatment" : "Treatments"}
              </p>
              <span className="text-[10px] text-slate-500">
                Total: ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <div
              onClick={() => setActiveTab("packages")}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-100 cursor-pointer transition-colors"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Packages
              </span>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                {displayPackages.length} Packages
              </p>
              <span className="text-[10px] text-slate-500">US-FDA Certified</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Loyalty Credits
              </span>
              <p className="text-lg font-extrabold text-[#008081] mt-0.5">
                {user.loyaltyPoints} Pts
              </p>
              <span className="text-[10px] text-teal-700 font-medium">
                ₹{user.loyaltyPoints} Clinic Credit
              </span>
            </div>
          </div>
        </div>

        {/* 2. Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "appointments"
                ? "bg-[#008081] text-white shadow-md shadow-[#008081]/25"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>My Appointment ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cart")}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "cart"
                ? "bg-[#008081] text-white shadow-md shadow-[#008081]/25"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>My Cart ({cartCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "packages"
                ? "bg-[#008081] text-white shadow-md shadow-[#008081]/25"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>My Treatment Packages ({displayPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#008081] text-white shadow-md shadow-[#008081]/25"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Contact &amp; Personal Details</span>
          </button>

          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "records"
                ? "bg-[#008081] text-white shadow-md shadow-[#008081]/25"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Skin Health Records</span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB 1: MY APPOINTMENT */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-serif">
                  My Appointments &amp; Doctor Consultations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  View your scheduled clinic visits, assigned dermatologists, and verified consultation fee receipts.
                </p>
              </div>
              <button
                onClick={() => openModal("General Dermatologist Consultation")}
                className="px-5 py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book a New Treatment</span>
              </button>
            </div>

            {displayAppointments.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#008081]/50 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        c.status === "Confirmed"
                          ? "bg-teal-50 text-teal-800 border-teal-200"
                          : c.status === "Completed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {c.status}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.paymentStatus === "Verified & Paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      Payment: {c.paymentStatus || "Pending"}
                    </span>
                    <span className="text-xs text-slate-400">Ref: {c.id}</span>
                    <span className="text-xs text-slate-400">Token: #{c.tokenNumber}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                    {c.treatmentName}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-[#008081]" />
                      {c.doctorName} ({c.specialty})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {c.date} at {c.timeSlot}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {c.clinicBranch}
                    </span>
                  </div>

                  {/* Fee & Discount Summary */}
                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span>
                      Consultation Fee:{" "}
                      <strong className="text-slate-900">
                        ₹{(c.originalFee || 1000).toLocaleString("en-IN")}
                      </strong>
                    </span>
                    {(c.discountApplied ?? 0) > 0 && (
                      <span className="text-emerald-700 font-semibold">
                        Prepayment Discount: -₹{c.discountApplied}
                      </span>
                    )}
                    <span className="font-bold text-[#008081]">
                      Final Payable: ₹{(c.finalAmountPaid || c.originalFee || 1000).toLocaleString("en-IN")}
                    </span>
                    {c.transactionId && (
                      <span className="text-[11px] font-mono text-slate-400">
                        TXN: {c.transactionId}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-center">
                  <Link
                    href={`https://wa.me/919871941444?text=Hello%20Skinfinity%20Derma,%20I%20have%20a%20query%20about%20appointment%20${c.id}`}
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                  >
                    WhatsApp Clinic
                  </Link>
                  <button
                    onClick={() => openModal(c.treatmentName)}
                    className="px-4 py-2 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    Book Follow-Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MY CART */}
        {activeTab === "cart" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif">
                    My Selected Treatments Cart ({cartCount})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review your selected US-FDA clinical packages and schedule your appointment.
                  </p>
                </div>
                <Link
                  href="/treatments"
                  className="text-xs font-bold text-[#008081] hover:underline flex items-center gap-1"
                >
                  <span>+ Add More Treatments</span>
                </Link>
              </div>

              {cartItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4">
                  <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    Your Treatment Cart is Empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Explore our dermatologist-approved treatments and packages to add them to your clinical cart.
                  </p>
                  <Link
                    href="/treatments"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#008081] text-white text-xs font-bold"
                  >
                    <span>Book a New Treatment</span>
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#008081]">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 font-serif mt-0.5">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.sessions}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-2.5 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-xs font-bold text-slate-700 px-1.5 py-0.5"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-xs font-bold text-slate-700 px-1.5 py-0.5"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="block text-sm font-extrabold text-slate-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 sticky top-24">
                <h3 className="text-base font-bold text-slate-900 font-serif border-b border-slate-100 pb-3">
                  Treatment Estimate Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold text-slate-900">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Privilege Discount</span>
                    <span className="font-semibold">
                      -₹{discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Estimated Total</span>
                    <span className="text-[#008081]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={async () => {
                      if (cartItems.length === 0) return;
                      const res = await checkout("UPI");
                      if (res.success) {
                        alert("Treatment package reserved! Order #" + (res.order?.orderNo || "CONFIRMED") + " created.");
                        window.location.reload();
                      } else {
                        alert(res.error || "Checkout failed. Please try again.");
                      }
                    }}
                    disabled={cartItems.length === 0}
                    className="w-full py-3 rounded-xl bg-slate-950 hover:bg-[#008081] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    Confirm &amp; Checkout Packages
                  </button>
                  <button
                    onClick={() =>
                      openModal(
                        cartItems[0]?.name || "General Dermatologist Consultation"
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    Appointment Request for Cart
                  </button>
                  <button
                    onClick={() =>
                      openEmiModal({
                        treatmentName:
                          cartItems.map((i) => i.name).join(", ") ||
                          "Clinical Package",
                        priceFormatted: `₹${total.toLocaleString("en-IN")}`,
                      })
                    }
                    className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Apply for EMI (0% No-Cost Options)
                  </button>
                  <button
                    onClick={openCart}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Open Full Cart Drawer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MY TREATMENT PACKAGES */}
        {activeTab === "packages" && (
          <div className="space-y-4">
            {displayPackages.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#008081]/50 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-teal-50 text-[#006d6e] text-[10px] font-extrabold uppercase tracking-wider border border-teal-200">
                      {order.status} Package
                    </span>
                    <span className="text-xs text-slate-400">Order ID: {order.id}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                    {order.packageName}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      Sessions: {order.sessionsCompleted} of {order.sessionsPurchased} Completed
                    </span>
                    <span>•</span>
                    <span>Purchased: {order.orderDate}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">Total: {order.amountPaid}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-sm bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-[#008081] h-full rounded-full transition-all"
                      style={{
                        width: `${(order.sessionsCompleted / order.sessionsPurchased) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      alert(`Invoice ${order.invoiceNumber} downloaded to your device.`)
                    }
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>
                  <button
                    onClick={() => openModal(order.packageName)}
                    className="px-4 py-2 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    Schedule Next Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CONTACT & PERSONAL DETAILS (Editable Form) */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Personal Contact Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your registered details used for clinical appointment booking and post-procedure care notifications.
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#008081] text-white text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Contact Details</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-[#008081]">
                  Editing Mode Active
                </span>
              )}
            </div>

            {saveSuccess && (
              <div className="mb-6 p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Your contact details have been successfully updated and saved.</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 text-sm font-medium focus:border-[#008081] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 text-sm font-medium focus:border-[#008081] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Primary Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 text-sm font-medium focus:border-[#008081] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Alternate / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.alternatePhone}
                    onChange={(e) =>
                      setFormData({ ...formData, alternatePhone: e.target.value })
                    }
                    placeholder="+91 85911 10110"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 text-sm font-medium focus:border-[#008081] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Gender
                  </label>
                  <select
                    disabled={!isEditing}
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 text-sm font-medium focus:border-[#008081] outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    disabled={!isEditing}
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 text-sm font-medium focus:border-[#008081] outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Preferred Clinic Branch
                  </label>
                  <select
                    disabled={!isEditing}
                    value={formData.preferredClinic}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredClinic: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 disabled:bg-slate-50 disabled:text-slate-600 text-sm font-medium focus:border-[#008081] outline-none transition-all"
                  >
                    <option value="Noida Flagship Clinic (Sector 36)">
                      Noida Flagship Center: Basement Floor, House B1, Sector 36 (Near Logix Mall)
                    </option>
                    <option value="Gurgaon Elite Clinic (Sector 28)">
                      Gurgaon Elite Center: 2nd Floor, SP1, Sector 28, Golf Course Road
                    </option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Contact Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 5: CLINICAL SKIN HEALTH RECORDS & PRESCRIPTIONS */}
        {activeTab === "records" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Diagnostic Skin Health &amp; Fitz-Type Assessment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluated by Senior Dermatologists using German 3D Digital Derma Scanners.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200">
                  <span className="text-[10px] font-bold text-[#006d6e] uppercase tracking-wider">
                    Skin Hydration Level
                  </span>
                  <p className="text-2xl font-extrabold text-[#008081] mt-1">82%</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Optimal. Well suited for Sugarcane HydraFacial maintenance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                    Fitzpatrick Classification
                  </span>
                  <p className="text-2xl font-extrabold text-amber-900 mt-1">Type IV</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Requires 810nm + 1064nm Nd:YAG laser wavelength for zero PIH risk.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Follicle Density
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">Normal</p>
                  <p className="text-xs text-slate-600 mt-1">
                    35% reduction achieved after 2 Soprano Titanium sessions.
                  </p>
                </div>
              </div>

              {/* Live Assessments from Doctor */}
              {liveRecords?.skinAssessments && liveRecords.skinAssessments.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 font-serif">
                    Clinical Skin Assessments History
                  </h4>
                  <div className="space-y-3">
                    {liveRecords.skinAssessments.map((sa: any) => (
                      <div
                        key={sa.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-slate-500">
                          <span className="font-semibold text-slate-700">
                            Dr. {sa.doctor_name || "Specialist Dermatologist"}
                          </span>
                          <span>{sa.assessment_date ? String(sa.assessment_date).slice(0, 10) : "Recent"}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-medium text-slate-700">
                          <div><span className="text-slate-400">Skin Type:</span> {sa.skin_type || "Combination"}</div>
                          <div><span className="text-slate-400">Acne Grade:</span> {sa.acne_grade || "Grade 1"}</div>
                          <div><span className="text-slate-400">Pigmentation:</span> {sa.pigmentation_type || "Epidermal"}</div>
                          <div><span className="text-slate-400">Sensitivity:</span> {sa.sensitivity_level || "Normal"}</div>
                        </div>
                        {sa.assessment_notes && (
                          <p className="text-slate-600 pt-1 italic">&ldquo;{sa.assessment_notes}&rdquo;</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prescriptions Dossier */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Doctor Prescriptions &amp; Skincare Protocols
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official clinical medical prescriptions issued by Skinfinity Derma dermatologists.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-50 text-[#006d6e] border border-teal-200 text-xs font-bold">
                  {liveRecords?.prescriptions?.length || 0} Issued
                </span>
              </div>

              {liveRecords?.prescriptions && liveRecords.prescriptions.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {liveRecords.prescriptions.map((rx: any) => (
                    <div
                      key={rx.id}
                      className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-gradient-to-b from-white to-slate-50/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 font-mono">
                              {rx.rx_number}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              Active Protocol
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Prescribed by {rx.doctor_name} ({rx.doctor_role || "Dermatologist"})
                          </p>
                        </div>
                        <div className="text-xs text-slate-500 text-left sm:text-right">
                          <div>Date: {rx.prescription_date ? String(rx.prescription_date).slice(0, 10) : "Recent"}</div>
                          {rx.follow_up_date && (
                            <div className="text-[#008081] font-medium">
                              Follow-up: {String(rx.follow_up_date).slice(0, 10)}
                            </div>
                          )}
                        </div>
                      </div>

                      {rx.diagnosis && (
                        <div className="text-xs">
                          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                            Diagnosis:{" "}
                          </span>
                          <span className="font-semibold text-slate-800">{rx.diagnosis}</span>
                        </div>
                      )}

                      {/* Medicines Table */}
                      {rx.items && rx.items.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                                <th className="py-2 pr-3">Product / Medication</th>
                                <th className="py-2 pr-3">Dosage</th>
                                <th className="py-2 pr-3">Frequency</th>
                                <th className="py-2 pr-3">Duration</th>
                                <th className="py-2">Instructions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                              {rx.items.map((item: any, iIdx: number) => (
                                <tr key={iIdx}>
                                  <td className="py-2 pr-3 font-semibold text-slate-900">{item.item_name}</td>
                                  <td className="py-2 pr-3">{item.dosage || "As directed"}</td>
                                  <td className="py-2 pr-3">{item.frequency || "Once daily"}</td>
                                  <td className="py-2 pr-3">{item.duration || "30 days"}</td>
                                  <td className="py-2 text-slate-500">{item.instructions || "Apply before sleep"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {rx.general_advice && (
                        <div className="pt-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-100">
                          <span className="font-bold text-slate-700">Clinical Advice: </span>
                          <span>{rx.general_advice}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No prescriptions currently on file. Prescriptions will appear here immediately after your doctor consultation.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
