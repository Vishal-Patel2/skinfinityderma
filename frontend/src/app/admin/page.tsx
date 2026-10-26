"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  CreditCard,
  Activity,
  FileText,
  Settings,
  Search,
  Plus,
  CheckCircle2,
  Stethoscope,
  MapPin,
  Edit3,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Lock,
} from "lucide-react";
import {
  useAuth,
  PatientRecord,
  ConsultationRecord,
  AssessmentLeadRecord,
  EmiEnquiryRecord,
} from "@/context/AuthContext";
import { DOCTORS } from "@/data/clinicData";

export default function AdminDashboardPage() {
  const {
    user,
    isLoggedIn,
    login,
    patients,
    addOrUpdatePatient,
    consultations,
    updateConsultationStatus,
    leads,
    updateLeadStatus,
    emiEnquiries,
    updateEmiStatus,
    adminSettings,
    updateAdminSettings,
    getDoctorFee,
  } = useAuth();

  // Role-based access state
  const [staffRole, setStaffRole] = useState<"admin" | "doctor" | "coordinator">(
    user?.role === "doctor" || user?.role === "coordinator" ? user.role : "admin"
  );
  const [activeTab, setActiveTab] = useState<
    "patients" | "appointments" | "leads" | "emi" | "settings"
  >("patients");

  // Search, Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [clinicFilter, setClinicFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Add / Edit Patient Modal State
  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState<{
    fullName: string;
    phone: string;
    email: string;
    age: string;
    gender: string;
    assignedDoctor: string;
    clinicBranch: PatientRecord["clinicBranch"];
    clinicalNotes: string;
    followUpDate: string;
    status: PatientRecord["status"];
  }>({
    fullName: "",
    phone: "",
    email: "",
    age: "30",
    gender: "Female",
    assignedDoctor: "Dr. Ipshita Johri",
    clinicBranch: "Noida Sector 36",
    clinicalNotes: "",
    followUpDate: "2026-11-15",
    status: "Active",
  });

  // Settings form state
  const [ipshitaFeeInput, setIpshitaFeeInput] = useState<number>(
    adminSettings.doctorFees["Dr. Ipshita Johri"] || 1200
  );
  const [otherDoctorsFeeInput, setOtherDoctorsFeeInput] = useState<number>(
    adminSettings.doctorFees["Dr. Sukriti"] || 1000
  );
  const [prepaymentDiscountInput, setPrepaymentDiscountInput] = useState<number>(
    adminSettings.prepaymentDiscount || 100
  );
  const [googleRatingInput, setGoogleRatingInput] = useState<string>(
    adminSettings.googleRating || "4.5"
  );
  const [googleReviewsInput, setGoogleReviewsInput] = useState<string>(
    adminSettings.googleReviewsCount || "4,500+"
  );
  const [investmentRangeInput, setInvestmentRangeInput] = useState<string>(
    adminSettings.investmentRange || "₹1.5 crore – ₹2 crore"
  );
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filtered Patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clinicalNotes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClinic =
        clinicFilter === "ALL" ||
        p.clinicBranch.toLowerCase().includes(clinicFilter.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
      return matchesSearch && matchesClinic && matchesStatus;
    });
  }, [patients, searchQuery, clinicFilter, statusFilter]);

  const totalPatientPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return consultations.filter((c) => {
      const matchesSearch =
        c.treatmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.patientName || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClinic =
        clinicFilter === "ALL" ||
        c.clinicBranch.toLowerCase().includes(clinicFilter.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchesSearch && matchesClinic && matchesStatus;
    });
  }, [consultations, searchQuery, clinicFilter, statusFilter]);

  // Metrics
  const paidAppointmentsCount = consultations.filter(
    (c) => c.paymentStatus === "Verified & Paid"
  ).length;
  const totalConsultationRevenue = consultations
    .filter((c) => c.paymentStatus === "Verified & Paid")
    .reduce((acc, c) => acc + (c.finalAmountPaid || c.originalFee || 1000), 0);

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.fullName || !newPatientForm.phone) return;
    addOrUpdatePatient(newPatientForm);
    setShowAddPatientModal(false);
    setNewPatientForm({
      fullName: "",
      phone: "",
      email: "",
      age: "30",
      gender: "Female",
      assignedDoctor: "Dr. Ipshita Johri",
      clinicBranch: "Noida Sector 36",
      clinicalNotes: "",
      followUpDate: "2026-11-15",
      status: "Active",
    });
  };

  const handleSaveEditedPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    addOrUpdatePatient(editingPatient);
    setEditingPatient(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFees: Record<string, number> = {};
    DOCTORS.forEach((d) => {
      updatedFees[d.name] = d.name.includes("Ipshita")
        ? ipshitaFeeInput
        : otherDoctorsFeeInput;
    });
    updateAdminSettings({
      doctorFees: updatedFees,
      prepaymentDiscount: prepaymentDiscountInput,
      googleRating: googleRatingInput,
      googleReviewsCount: googleReviewsInput,
      investmentRange: investmentRangeInput,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Require Authorized Staff Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#008081]/20 border border-[#008081]/40 text-teal-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
              Role-Based Clinical Access
            </span>
            <h1 className="text-2xl font-bold text-white font-serif mt-3">
              Skinfinity Derma PMS &amp; Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Restricted to authorized Dermatologists, Clinic Administrators, and Front-Desk Coordinators.
            </p>
          </div>
          <button
            onClick={() => login("admin@skinfinityderma.com", "Admin@2026")}
            className="w-full py-3.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all cursor-pointer"
          >
            Sign In as Authorized Clinical Admin
          </button>
          <Link
            href="/"
            className="block text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Skinfinity Derma Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Clinical PMS Header Bar */}
      <div className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#008081] to-teal-900 flex items-center justify-center font-serif font-extrabold text-lg border border-teal-400/30 shadow-md">
              SD
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold font-serif text-white">
                  Skinfinity Derma — Patient Management &amp; Admin Suite
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                  Live Clinical CRM
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Noida Flagship (Sector 36) &amp; Gurgaon Elite (Sector 28) • Unified EMR, Bookings, Leads &amp; EMI Desk
              </p>
            </div>
          </div>

          {/* Role Switcher & Quick Links */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] text-slate-400">Active Role:</span>
              <select
                value={staffRole}
                onChange={(e) =>
                  setStaffRole(e.target.value as "admin" | "doctor" | "coordinator")
                }
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="admin" className="bg-slate-900 text-white">
                  Clinic Admin (Full Access)
                </option>
                <option value="doctor" className="bg-slate-900 text-white">
                  Dermatologist (EMR &amp; Notes)
                </option>
                <option value="coordinator" className="bg-slate-900 text-white">
                  Front Desk (Bookings &amp; Leads)
                </option>
              </select>
            </div>

            <Link
              href="/account"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Customer View
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Patient Records
              </span>
              <Users className="w-4 h-4 text-[#008081]" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{patients.length}</p>
            <span className="text-[11px] text-emerald-700 font-medium">
              Active EMR Profiles
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Appointments
              </span>
              <Calendar className="w-4 h-4 text-[#008081]" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {consultations.length}
            </p>
            <span className="text-[11px] text-teal-700 font-medium">
              {paidAppointmentsCount} Verified Paid
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Verified Fees
              </span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              ₹{totalConsultationRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] text-slate-500">
              Incl. ₹100 Prepay Discounts
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Skin &amp; Hair Leads
              </span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{leads.length}</p>
            <span className="text-[11px] text-amber-700 font-medium">
              Grade 1–5 &amp; Skin Analyser
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                EMI Enquiries
              </span>
              <FileText className="w-4 h-4 text-brand-700" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {emiEnquiries.length}
            </p>
            <span className="text-[11px] text-slate-500">
              0% No-Cost EMI Requests
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                setActiveTab("patients");
                setStatusFilter("ALL");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "patients"
                  ? "bg-[#008081] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patient Records ({patients.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("appointments");
                setStatusFilter("ALL");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "appointments"
                  ? "bg-[#008081] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments &amp; Payments ({consultations.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("leads");
                setStatusFilter("ALL");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "leads"
                  ? "bg-[#008081] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Skin &amp; Hair Assessment Leads ({leads.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("emi");
                setStatusFilter("ALL");
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "emi"
                  ? "bg-[#008081] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>EMI Enquiries ({emiEnquiries.length})</span>
            </button>

            {staffRole === "admin" && (
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[#008081] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Clinic &amp; Fee Settings</span>
              </button>
            )}
          </div>

          {activeTab === "patients" && (
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#008081] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Patient Record</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar (for Patients & Appointments) */}
        {(activeTab === "patients" || activeTab === "appointments") && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by patient name, phone, ID, doctor, or clinical notes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#008081]"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <select
                value={clinicFilter}
                onChange={(e) => {
                  setClinicFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
              >
                <option value="ALL">All Clinic Branches</option>
                <option value="Noida">Noida Sector 36</option>
                <option value="Gurgaon">Gurgaon Sector 28</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                {activeTab === "patients" ? (
                  <>
                    <option value="Active">Active</option>
                    <option value="Follow-Up Due">Follow-Up Due</option>
                    <option value="Completed">Completed</option>
                    <option value="New Patient">New Patient</option>
                  </>
                ) : (
                  <>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending Payment">Pending Payment</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </>
                )}
              </select>
            </div>
          </div>
        )}

        {/* TAB 1: PATIENT RECORDS */}
        {activeTab === "patients" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Patient &amp; ID</th>
                    <th className="py-3.5 px-4">Assigned Doctor &amp; Clinic</th>
                    <th className="py-3.5 px-4">Clinical Notes &amp; History</th>
                    <th className="py-3.5 px-4">Follow-Up &amp; Status</th>
                    <th className="py-3.5 px-4">Doctor Fee</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <span className="inline-block text-[10px] font-mono font-bold text-[#008081] bg-teal-50 px-2 py-0.5 rounded mb-1">
                          {patient.id}
                        </span>
                        <div className="font-bold text-slate-900 text-sm">
                          {patient.fullName}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {patient.gender}, {patient.age} yrs • {patient.phone}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-[#008081]" />
                          <span>{patient.assignedDoctor}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{patient.clinicBranch}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top max-w-xs">
                        {patient.treatmentHistory && patient.treatmentHistory.length > 0 && (
                          <div className="font-semibold text-slate-900 mb-1">
                            {patient.treatmentHistory.join(", ")}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                          {patient.clinicalNotes}
                        </p>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            patient.status === "Active"
                              ? "bg-teal-50 text-teal-800 border-teal-200"
                              : patient.status === "Follow-Up Due"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {patient.status}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1.5">
                          Follow-Up: <strong className="text-slate-800">{patient.followUpDate}</strong>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-900">
                          ₹{getDoctorFee(patient.assignedDoctor).toLocaleString("en-IN")}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Verified
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top text-right">
                        <button
                          onClick={() => setEditingPatient(patient)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#008081] hover:text-white text-slate-700 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit / Notes</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>
                Showing {paginatedPatients.length} of {filteredPatients.length} patient records
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-slate-800">
                  Page {currentPage} of {totalPatientPages}
                </span>
                <button
                  disabled={currentPage >= totalPatientPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPatientPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS & PAYMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {filteredAppointments.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#008081] bg-teal-50 px-2.5 py-0.5 rounded">
                      {c.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Patient: {c.patientName || "Registered Patient"} ({c.patientPhone || "+91 98719 41444"})
                    </span>
                    <span className="text-xs text-slate-400">Token #{c.tokenNumber}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-serif">
                    {c.treatmentName}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span className="font-semibold text-slate-900">
                      Doctor: {c.doctorName}
                    </span>
                    <span>•</span>
                    <span>Clinic: {c.clinicBranch}</span>
                    <span>•</span>
                    <span>
                      Slot: {c.date} at {c.timeSlot}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                    <span>
                      Base Fee:{" "}
                      <strong>₹{(c.originalFee || 1000).toLocaleString("en-IN")}</strong>
                    </span>
                    <span>
                      Prepay Discount:{" "}
                      <strong className="text-emerald-700">
                        -₹{c.discountApplied || 0}
                      </strong>
                    </span>
                    <span>
                      Final Amount:{" "}
                      <strong className="text-[#008081]">
                        ₹{(c.finalAmountPaid || c.originalFee || 1000).toLocaleString("en-IN")}
                      </strong>
                    </span>
                    {c.transactionId && (
                      <span className="font-mono text-[11px] text-slate-500">
                        TXN: {c.transactionId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Admin Status Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Appointment Status
                    </label>
                    <select
                      value={c.status}
                      onChange={(e) =>
                        updateConsultationStatus(
                          c.id,
                          e.target.value as ConsultationRecord["status"]
                        )
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending Payment">Pending Payment</option>
                      <option value="In Review">In Review</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Payment Verification
                    </label>
                    <select
                      value={c.paymentStatus || "Pending"}
                      onChange={(e) =>
                        updateConsultationStatus(
                          c.id,
                          c.status,
                          e.target.value as ConsultationRecord["paymentStatus"]
                        )
                      }
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-emerald-800 bg-emerald-50"
                    >
                      <option value="Verified & Paid">Verified &amp; Paid</option>
                      <option value="Pay at Clinic">Pay at Clinic</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SKIN & HAIR ASSESSMENT LEADS */}
        {activeTab === "leads" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        lead.toolType === "Skin Analyser"
                          ? "bg-teal-50 text-teal-800 border border-teal-200"
                          : "bg-amber-50 text-amber-900 border border-amber-200"
                      }`}
                    >
                      {lead.toolType}
                    </span>
                    <span className="text-[11px] text-slate-400">{lead.createdAt}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 font-serif">
                      {lead.name}
                    </h4>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      Mobile: {lead.phone} {lead.gender ? `• ${lead.gender}` : ""}{" "}
                      {lead.age ? `• ${lead.age} yrs` : ""}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-slate-900">{lead.summary}</div>
                    <div className="text-slate-600">{lead.details}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-mono text-slate-400">
                    Lead ID: {lead.id} • {lead.assignedTo}
                  </span>
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateLeadStatus(
                        lead.id,
                        e.target.value as AssessmentLeadRecord["status"]
                      )
                    }
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Contacted">Contacted by Counsellor</option>
                    <option value="Consultation Booked">Consultation Booked</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: EMI ENQUIRIES */}
        {activeTab === "emi" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emiEnquiries.map((emi) => (
              <div
                key={emi.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider">
                    EMI Counselling Lead • {emi.id}
                  </span>
                  <span className="text-xs text-slate-400">{emi.createdAt}</span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 font-serif">
                    {emi.name}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Phone: <strong>{emi.phone}</strong> • Clinic: {emi.clinicLocation}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <div>
                    Treatment: <strong className="text-slate-900">{emi.treatmentName}</strong>
                  </div>
                  <div>
                    Estimated Package: <strong>{emi.treatmentPrice}</strong> • Preferred Tenure:{" "}
                    <strong>{emi.preferredTenure}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Assigned: {emi.assignedTeam}
                  </span>
                  <select
                    value={emi.status}
                    onChange={(e) =>
                      updateEmiStatus(
                        emi.id,
                        e.target.value as EmiEnquiryRecord["status"]
                      )
                    }
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                  >
                    <option value="New Enquiry">New Enquiry</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Follow-Up Scheduled">Follow-Up Scheduled</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: CLINIC & PRICING SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Doctor Consultation Fees &amp; Global Clinic Settings
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Changes saved here update the live consultation pricing and prepayment discount rules across the appointment booking flow.
            </p>

            {settingsSaved && (
              <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Clinic pricing and global parameters updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dr. Ipshita Johri Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={ipshitaFeeInput}
                    onChange={(e) => setIpshitaFeeInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Other Doctors Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={otherDoctorsFeeInput}
                    onChange={(e) => setOtherDoctorsFeeInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Online Prepayment Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={prepaymentDiscountInput}
                    onChange={(e) =>
                      setPrepaymentDiscountInput(Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verified Google Rating
                  </label>
                  <input
                    type="text"
                    value={googleRatingInput}
                    onChange={(e) => setGoogleRatingInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Verified Google Reviews
                  </label>
                  <input
                    type="text"
                    value={googleReviewsInput}
                    onChange={(e) => setGoogleReviewsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    FICO Investment Range
                  </label>
                  <input
                    type="text"
                    value={investmentRangeInput}
                    onChange={(e) => setInvestmentRangeInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Clinic Configuration</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Edit Patient Record Modal */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#008081]">
                  {editingPatient.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  Update Patient EMR &amp; Clinical Notes
                </h3>
              </div>
              <button
                onClick={() => setEditingPatient(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedPatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={editingPatient.fullName}
                    onChange={(e) =>
                      setEditingPatient({ ...editingPatient, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assigned Doctor
                  </label>
                  <select
                    value={editingPatient.assignedDoctor}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        assignedDoctor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    {DOCTORS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} (₹{getDoctorFee(d.name)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Clinic Branch
                  </label>
                  <select
                    value={editingPatient.clinicBranch}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        clinicBranch: e.target.value as PatientRecord["clinicBranch"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Noida Sector 36">Noida Sector 36</option>
                    <option value="Gurgaon Sector 28">Gurgaon Sector 28</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={editingPatient.followUpDate}
                    onChange={(e) =>
                      setEditingPatient({
                        ...editingPatient,
                        followUpDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Clinical Notes &amp; Prescription Summary
                </label>
                <textarea
                  rows={4}
                  value={editingPatient.clinicalNotes}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      clinicalNotes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Case Status
                </label>
                <select
                  value={editingPatient.status}
                  onChange={(e) =>
                    setEditingPatient({
                      ...editingPatient,
                      status: e.target.value as PatientRecord["status"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                >
                  <option value="Active">Active</option>
                  <option value="Follow-Up Due">Follow-Up Due</option>
                  <option value="Completed">Completed</option>
                  <option value="New Patient">New Patient</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008081] text-white font-bold"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Register New Clinical Patient Record
              </h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatientForm.fullName}
                    onChange={(e) =>
                      setNewPatientForm({ ...newPatientForm, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPatientForm.phone}
                    onChange={(e) =>
                      setNewPatientForm({ ...newPatientForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assigned Doctor
                  </label>
                  <select
                    value={newPatientForm.assignedDoctor}
                    onChange={(e) =>
                      setNewPatientForm({
                        ...newPatientForm,
                        assignedDoctor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    {DOCTORS.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} (₹{getDoctorFee(d.name)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Clinic Location
                  </label>
                  <select
                    value={newPatientForm.clinicBranch}
                    onChange={(e) =>
                      setNewPatientForm({
                        ...newPatientForm,
                        clinicBranch: e.target.value as PatientRecord["clinicBranch"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Noida Sector 36">Noida Sector 36</option>
                    <option value="Gurgaon Sector 28">Gurgaon Sector 28</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Initial Clinical Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={newPatientForm.clinicalNotes}
                  onChange={(e) =>
                    setNewPatientForm({
                      ...newPatientForm,
                      clinicalNotes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#008081] text-white font-bold"
                >
                  Create Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
