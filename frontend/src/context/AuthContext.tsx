"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { postAppointment, postEnquiry } from "@/lib/api";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  gender?: string;
  dob?: string;
  preferredClinic: string;
  address: string;
  city: string;
  pincode: string;
  memberTier: string;
  memberSince: string;
  loyaltyPoints: number;
  role?: "patient" | "admin" | "doctor" | "coordinator";
}

export interface ConsultationRecord {
  id: string;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  doctorName: string;
  specialty: string;
  clinicBranch: string;
  date: string;
  timeSlot: string;
  status: "Confirmed" | "Completed" | "In Review" | "Pending Payment" | "Cancelled";
  tokenNumber: string;
  treatmentName: string;
  originalFee?: number;
  discountApplied?: number;
  finalAmountPaid?: number;
  paymentStatus?: "Verified & Paid" | "Pay at Clinic" | "Pending" | "Failed";
  transactionId?: string;
  notes?: string;
}

export interface TreatmentOrderRecord {
  id: string;
  packageName: string;
  sessionsPurchased: number;
  sessionsCompleted: number;
  orderDate: string;
  amountPaid: string;
  status: "Active" | "Completed";
  invoiceNumber: string;
}

export interface PatientRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  age: string;
  assignedDoctor: string;
  clinicBranch: "Noida Sector 36" | "Gurgaon Sector 28";
  lastVisit: string;
  followUpDate: string;
  clinicalNotes: string;
  status: "Active" | "Follow-Up Due" | "Completed" | "New Patient";
  treatmentHistory: string[];
}

export interface AssessmentLeadRecord {
  id: string;
  name: string;
  phone: string;
  toolType: "Skin Analyser" | "Hair & Baldness Assessment" | "Laser Estimator" | "Consultation Lead";
  gender?: string;
  age?: string;
  summary?: string;
  details?: string;
  skinTypes?: string[];
  primaryConcern?: string;
  baldnessGrade?: string;
  baldnessPattern?: string;
  hairThickness?: string;
  hairLossDuration?: string;
  estimateSummary?: string;
  createdAt: string;
  status: "New Lead" | "Contacted" | "Consultation Booked" | "Closed";
  followUpDate?: string;
  assignedTo: string;
}

export interface EmiEnquiryRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  clinicLocation: string;
  treatmentName: string;
  treatmentPrice: string;
  preferredTenure: string;
  createdAt: string;
  status: "New Enquiry" | "In Discussion" | "Follow-Up Scheduled" | "Closed";
  assignedTeam: string;
  notes?: string;
}

export interface ClinicAdminSettings {
  doctorFees: Record<string, number>;
  prepaymentDiscount: number;
  googleRating: string;
  googleReviewsCount: string;
  investmentRange: string;
}

export interface EmiModalContextData {
  treatmentName: string;
  priceFormatted: string;
  emiMonthly?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "signup";
  isAppointmentModalOpen: boolean;
  appointmentPrefillTreatment: string;
  isEmiModalOpen: boolean;
  emiModalData: EmiModalContextData | null;
  consultations: ConsultationRecord[];
  treatmentOrders: TreatmentOrderRecord[];
  patients: PatientRecord[];
  leads: AssessmentLeadRecord[];
  emiEnquiries: EmiEnquiryRecord[];
  adminSettings: ClinicAdminSettings;
  openAuthModal: (tab?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  openAppointmentModal: (prefillTreatment?: string | unknown) => void;
  closeAppointmentModal: () => void;
  openEmiModal: (data?: EmiModalContextData) => void;
  closeEmiModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  bookConsultation: (record: Omit<ConsultationRecord, "id" | "tokenNumber" | "status"> & { status?: ConsultationRecord["status"]; tokenNumber?: string }) => ConsultationRecord;
  updateConsultationStatus: (id: string, status: ConsultationRecord["status"], paymentStatus?: ConsultationRecord["paymentStatus"]) => void;
  addLead: (lead: Omit<AssessmentLeadRecord, "id" | "createdAt" | "status" | "assignedTo">) => AssessmentLeadRecord;
  updateLeadStatus: (id: string, status: AssessmentLeadRecord["status"], followUpDate?: string) => void;
  addEmiEnquiry: (enquiry: Omit<EmiEnquiryRecord, "id" | "createdAt" | "status" | "assignedTeam">) => EmiEnquiryRecord;
  updateEmiStatus: (id: string, status: EmiEnquiryRecord["status"], assignedTeam?: string, notes?: string) => void;
  addOrUpdatePatient: (patient: Partial<PatientRecord> & { fullName: string; phone: string }) => void;
  updateAdminSettings: (settings: Partial<ClinicAdminSettings>) => void;
  getDoctorFee: (doctorName: string) => number;
}

const defaultAdminSettings: ClinicAdminSettings = {
  doctorFees: {
    "Dr. Ipshita Johri": 1200,
    "Dr. Sukriti": 1000,
    "Dr. Aanchal Bansal": 1000,
    "Dr. Neha Dhankar": 1000,
    "Dr. Shradha": 1000,
  },
  prepaymentDiscount: 100,
  googleRating: "4.8",
  googleReviewsCount: "3,500+",
  investmentRange: "₹1.5 crore – ₹2 crore",
};

const defaultUser: UserProfile = {
  id: "SKIN-9821",
  fullName: "Vishal Kumar",
  email: "vishal@skinfinityderma.com",
  phone: "+91 98719 41444",
  alternatePhone: "+91 85911 10110",
  gender: "Male",
  dob: "1994-12-18",
  preferredClinic: "Noida Flagship Clinic (Sector 36)",
  address: "House B1, Basement Floor, Sector 36",
  city: "Noida",
  pincode: "201303",
  memberTier: "Gold Prestige Club",
  memberSince: "Nov 2023",
  loyaltyPoints: 1250,
  role: "admin",
};

const initialConsultations: ConsultationRecord[] = [
  {
    id: "CONS-4091",
    patientName: "Vishal Kumar",
    patientPhone: "+91 98719 41444",
    patientEmail: "vishal@skinfinityderma.com",
    doctorName: "Dr. Ipshita Johri",
    specialty: "Founder & Chief Dermatologist",
    clinicBranch: "Noida Sector 36",
    date: "28 Oct 2026",
    timeSlot: "11:30 AM",
    status: "Confirmed",
    tokenNumber: "SK-4091",
    treatmentName: "Advanced Laser Hair Reduction Consultation",
    originalFee: 1200,
    discountApplied: 100,
    finalAmountPaid: 1100,
    paymentStatus: "Verified & Paid",
    transactionId: "TXN-SKIN-89241",
  },
  {
    id: "CONS-3184",
    patientName: "Vishal Kumar",
    patientPhone: "+91 98719 41444",
    patientEmail: "vishal@skinfinityderma.com",
    doctorName: "Dr. Sukriti",
    specialty: "Senior MD Dermatologist",
    clinicBranch: "Gurgaon Sector 28",
    date: "14 Sep 2026",
    timeSlot: "04:00 PM",
    status: "Completed",
    tokenNumber: "SK-3184",
    treatmentName: "Skinfinity Sugarcane HydraFacial MD Assessment",
    originalFee: 1000,
    discountApplied: 100,
    finalAmountPaid: 900,
    paymentStatus: "Verified & Paid",
    transactionId: "TXN-SKIN-74120",
  },
];

const initialTreatmentOrders: TreatmentOrderRecord[] = [
  {
    id: "PKG-7721",
    packageName: "Full Body Laser Hair Reduction (Soprano Titanium US-FDA)",
    sessionsPurchased: 6,
    sessionsCompleted: 2,
    orderDate: "12 Oct 2026",
    amountPaid: "₹39,999",
    status: "Active",
    invoiceNumber: "INV-SKIN-2026-882",
  },
  {
    id: "PKG-6619",
    packageName: "Signature Sugarcane HydraFacial MD + Hyaluronic Infusion",
    sessionsPurchased: 3,
    sessionsCompleted: 1,
    orderDate: "20 Sep 2026",
    amountPaid: "₹9,999",
    status: "Active",
    invoiceNumber: "INV-SKIN-2026-704",
  },
];

const initialPatients: PatientRecord[] = [
  {
    id: "PAT-1001",
    fullName: "Vishal Kumar",
    phone: "+91 98719 41444",
    email: "vishal@skinfinityderma.com",
    gender: "Male",
    age: "31",
    assignedDoctor: "Dr. Ipshita Johri",
    clinicBranch: "Noida Sector 36",
    lastVisit: "24 Oct 2026",
    followUpDate: "10 Nov 2026",
    clinicalNotes: "Fitzpatrick Type IV. Soprano Titanium session 2 completed smoothly. Advised SPF 50+ every 3 hrs.",
    status: "Active",
    treatmentHistory: ["Full Body Laser Hair Reduction", "Sugarcane HydraFacial MD"],
  },
  {
    id: "PAT-1002",
    fullName: "Kavita Sharma",
    phone: "+91 98112 34567",
    email: "kavita.sharma@gmail.com",
    gender: "Female",
    age: "28",
    assignedDoctor: "Dr. Sukriti",
    clinicBranch: "Noida Sector 36",
    lastVisit: "18 Oct 2026",
    followUpDate: "02 Nov 2026",
    clinicalNotes: "Grade 2 rolling acne scars. Responded well to Subcision + MNRF session 3.",
    status: "Follow-Up Due",
    treatmentHistory: ["Acne Scar Subcision + MNRF", "Salicylic Peel"],
  },
  {
    id: "PAT-1003",
    fullName: "Aman Singhal",
    phone: "+91 99104 88210",
    email: "aman.singhal@outlook.com",
    gender: "Male",
    age: "34",
    assignedDoctor: "Dr. Shradha",
    clinicBranch: "Gurgaon Sector 28",
    lastVisit: "20 Oct 2026",
    followUpDate: "15 Nov 2026",
    clinicalNotes: "Grade 3 Baldness (Crown & Hairline Recession). Completed 3rd autologous GFC session.",
    status: "Active",
    treatmentHistory: ["GFC Hair Restoration Therapy", "Beard Line Laser Shaping"],
  },
  {
    id: "PAT-1004",
    fullName: "Neha Aggarwal",
    phone: "+91 98732 11902",
    email: "neha.aggarwal@yahoo.com",
    gender: "Female",
    age: "29",
    assignedDoctor: "Dr. Aanchal Bansal",
    clinicBranch: "Gurgaon Sector 28",
    lastVisit: "12 Oct 2026",
    followUpDate: "05 Nov 2026",
    clinicalNotes: "Dermal melasma on malar prominence. Q-Switched Nd:YAG toning + oral tranexamic protocol.",
    status: "Active",
    treatmentHistory: ["Q-Switched Laser Toning", "Sugarcane HydraFacial MD"],
  },
];

const initialLeads: AssessmentLeadRecord[] = [
  {
    id: "LEAD-501",
    name: "Rohan Malhotra",
    phone: "+91 98180 55421",
    toolType: "Hair & Baldness Assessment",
    gender: "Male",
    age: "32",
    summary: "Grade 3 Baldness • Hairline Recession & Crown Thinning",
    details: "Hair Thickness: Medium | Duration: 1 - 3 Years | Est. 2,100 Grafts + GFC Protocol",
    createdAt: "25 Oct 2026, 02:15 PM",
    status: "New Lead",
    followUpDate: "26 Oct 2026",
    assignedTo: "Dr. Shradha (Trichology Desk)",
  },
  {
    id: "LEAD-502",
    name: "Priya Nair",
    phone: "+91 99582 41098",
    toolType: "Skin Analyser",
    gender: "Female",
    age: "26",
    summary: "Oily, Sensitive Skin • Acne & Breakouts + Pigmentation",
    details: "Multi-skin types: Oily, Sensitive | Sun Exposure: Moderate (1-3 hrs) | Score: 66/100",
    createdAt: "25 Oct 2026, 11:40 AM",
    status: "Contacted",
    followUpDate: "27 Oct 2026",
    assignedTo: "Noida Clinic Coordinator",
  },
];

const initialEmiEnquiries: EmiEnquiryRecord[] = [
  {
    id: "EMI-301",
    name: "Siddharth Verma",
    phone: "+91 98109 77320",
    email: "siddharth.v@gmail.com",
    clinicLocation: "Noida Sector 36",
    treatmentName: "Full Body Laser Hair Reduction (6 Sessions)",
    treatmentPrice: "₹39,999",
    preferredTenure: "6 Months (0% Interest EMI)",
    createdAt: "25 Oct 2026, 01:20 PM",
    status: "New Enquiry",
    assignedTeam: "Noida Financing Desk (Bajaj / HDFC)",
    notes: "Requested call back after 5 PM to discuss HDFC credit card 0% EMI options.",
  },
  {
    id: "EMI-302",
    name: "Ananya Gupta",
    phone: "+91 97114 62019",
    email: "ananya.g@gmail.com",
    clinicLocation: "Gurgaon Sector 28",
    treatmentName: "Subcision + MNRF Acne Scar Remodeling",
    treatmentPrice: "₹5,499 / session",
    preferredTenure: "6 Months (0% Interest EMI)",
    createdAt: "24 Oct 2026, 05:10 PM",
    status: "In Discussion",
    assignedTeam: "Gurgaon Financing Coordinator",
    notes: "Explained 6-month zero-cost EMI options; patient visiting clinic on Saturday.",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentPrefillTreatment, setAppointmentPrefillTreatment] = useState<string>("");
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [emiModalData, setEmiModalData] = useState<EmiModalContextData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(initialConsultations);
  const [treatmentOrders, setTreatmentOrders] = useState<TreatmentOrderRecord[]>(initialTreatmentOrders);
  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [leads, setLeads] = useState<AssessmentLeadRecord[]>(initialLeads);
  const [emiEnquiries, setEmiEnquiries] = useState<EmiEnquiryRecord[]>(initialEmiEnquiries);
  const [adminSettings, setAdminSettings] = useState<ClinicAdminSettings>(defaultAdminSettings);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("skinfinity_user");
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedConsultations = localStorage.getItem("skinfinity_consultations");
      if (storedConsultations) setConsultations(JSON.parse(storedConsultations));

      const storedOrders = localStorage.getItem("skinfinity_orders");
      if (storedOrders) setTreatmentOrders(JSON.parse(storedOrders));

      const storedPatients = localStorage.getItem("skinfinity_patients");
      if (storedPatients) setPatients(JSON.parse(storedPatients));

      const storedLeads = localStorage.getItem("skinfinity_leads");
      if (storedLeads) setLeads(JSON.parse(storedLeads));

      const storedEmi = localStorage.getItem("skinfinity_emi_enquiries");
      if (storedEmi) setEmiEnquiries(JSON.parse(storedEmi));

      const storedSettings = localStorage.getItem("skinfinity_admin_settings");
      if (storedSettings) {
        setAdminSettings({ ...defaultAdminSettings, ...JSON.parse(storedSettings) });
      }
    } catch (e) {
      console.error("Failed to load state from storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (tab: "signin" | "signup" = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openAppointmentModal = (prefillTreatment?: string | unknown) => {
    if (prefillTreatment && typeof prefillTreatment === "string") {
      setAppointmentPrefillTreatment(prefillTreatment);
    }
    setIsAppointmentModalOpen(true);
  };

  // Global interceptor: any link targeting #appointment_form, #doctor-booking-form, or #enroll opens the Header's AppointmentModal
  useEffect(() => {
    const handleGlobalBookingClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (
        href.includes("#appointment_form") ||
        href.includes("#doctor-booking-form") ||
        href === "#enroll"
      ) {
        e.preventDefault();
        setIsAppointmentModalOpen(true);
      }
    };
    document.addEventListener("click", handleGlobalBookingClick, true);
    return () => document.removeEventListener("click", handleGlobalBookingClick, true);
  }, []);

  const closeAppointmentModal = () => setIsAppointmentModalOpen(false);

  const openEmiModal = (data?: EmiModalContextData) => {
    setEmiModalData(
      data || {
        treatmentName: "Clinical Dermatology / Laser Package",
        priceFormatted: "Custom Package",
        emiMonthly: "0% Interest EMI Options",
      }
    );
    setIsEmiModalOpen(true);
  };

  const closeEmiModal = () => setIsEmiModalOpen(false);

  const getDoctorFee = (doctorName: string): number => {
    if (adminSettings.doctorFees && adminSettings.doctorFees[doctorName]) {
      return adminSettings.doctorFees[doctorName];
    }
    return doctorName.toLowerCase().includes("ipshita") ? 1200 : 1000;
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (!pass || pass.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }

    await new Promise((r) => setTimeout(r, 500));

    const cleanEmail = email.trim().toLowerCase();
    const isAdminEmail =
      cleanEmail.includes("admin") ||
      cleanEmail.includes("doctor") ||
      cleanEmail.includes("vishal") ||
      cleanEmail.includes("skinfinity");

    const activeUser: UserProfile = {
      ...defaultUser,
      email: cleanEmail,
      fullName:
        email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()) || "Vishal Kumar",
      role: isAdminEmail ? "admin" : "patient",
    };

    setUser(activeUser);
    try {
      localStorage.setItem("skinfinity_user", JSON.stringify(activeUser));
    } catch (e) {
      console.error("Storage error", e);
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!name || name.trim().length < 2) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return { success: false, error: "Please enter a valid 10-digit phone number." };
    }
    if (!pass || pass.length < 4) {
      return { success: false, error: "Password must be at least 4 characters long." };
    }

    await new Promise((r) => setTimeout(r, 600));

    const newUser: UserProfile = {
      id: `SKIN-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      alternatePhone: "",
      gender: "Not Specified",
      dob: "",
      preferredClinic: "Noida Flagship Clinic (Sector 36)",
      address: "",
      city: "Delhi NCR",
      pincode: "",
      memberTier: "Gold Prestige Club",
      memberSince: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      loyaltyPoints: 500,
      role: "patient",
    };

    setUser(newUser);
    try {
      localStorage.setItem("skinfinity_user", JSON.stringify(newUser));
    } catch (e) {
      console.error("Storage error", e);
    }
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("skinfinity_user");
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem("skinfinity_user", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  const addOrUpdatePatient = (patientData: Partial<PatientRecord> & { fullName: string; phone: string }) => {
    const existingIdx = patients.findIndex(
      (p) => p.phone.replace(/\D/g, "").slice(-10) === patientData.phone.replace(/\D/g, "").slice(-10)
    );
    let updated: PatientRecord[];
    if (existingIdx >= 0) {
      updated = patients.map((p, idx) =>
        idx === existingIdx
          ? {
              ...p,
              ...patientData,
              treatmentHistory: patientData.treatmentHistory
                ? Array.from(new Set([...p.treatmentHistory, ...patientData.treatmentHistory]))
                : p.treatmentHistory,
            }
          : p
      );
    } else {
      const newPat: PatientRecord = {
        id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: patientData.fullName,
        phone: patientData.phone,
        email: patientData.email || "",
        gender: patientData.gender || "Not Specified",
        age: patientData.age || "-",
        assignedDoctor: patientData.assignedDoctor || "Dr. Ipshita Johri",
        clinicBranch: patientData.clinicBranch || "Noida Sector 36",
        lastVisit: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        followUpDate: patientData.followUpDate || "Pending Schedule",
        clinicalNotes: patientData.clinicalNotes || "Initial consultation booked via online portal.",
        status: patientData.status || "New Patient",
        treatmentHistory: patientData.treatmentHistory || [],
      };
      updated = [newPat, ...patients];
    }
    setPatients(updated);
    try {
      localStorage.setItem("skinfinity_patients", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  const bookConsultation = (
    record: Omit<ConsultationRecord, "id" | "tokenNumber" | "status"> & {
      status?: ConsultationRecord["status"];
      tokenNumber?: string;
    }
  ): ConsultationRecord => {
    const serverValidatedFee = getDoctorFee(record.doctorName);
    const isVerifiedPrepaid = record.paymentStatus === "Verified & Paid";
    const discountApplied = isVerifiedPrepaid ? adminSettings.prepaymentDiscount : 0;
    const finalAmountPaid = Math.max(0, serverValidatedFee - discountApplied);

    const newRecord: ConsultationRecord = {
      ...record,
      id: `CONS-${Math.floor(1000 + Math.random() * 9000)}`,
      tokenNumber: record.tokenNumber || `SK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: isVerifiedPrepaid ? "Confirmed" : record.status || "Pending Payment",
      originalFee: serverValidatedFee,
      discountApplied,
      finalAmountPaid,
    };

    const updated = [newRecord, ...consultations];
    setConsultations(updated);
    try {
      localStorage.setItem("skinfinity_consultations", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }

    // Seamlessly sync booking to MySQL Backend database API
    try {
      postAppointment({
        clinicBranch: record.clinicBranch,
        doctorName: record.doctorName,
        patientName: record.patientName || "Patient",
        patientPhone: record.patientPhone || "",
        patientEmail: record.patientEmail,
        treatmentName: record.treatmentName,
        appointmentDate: record.date || new Date().toISOString().split("T")[0],
        timeSlot: record.timeSlot || "11:30 AM",
        notes: record.notes,
        paymentStatus: isVerifiedPrepaid ? "paid" : "unpaid",
        transactionId: record.transactionId,
        amount: finalAmountPaid,
      }).catch((err) => console.warn("Backend appointment API sync notice:", err));
    } catch (err) {
      console.warn("Backend appointment API trigger notice:", err);
    }

    if (record.patientName && record.patientPhone) {
      addOrUpdatePatient({
        fullName: record.patientName,
        phone: record.patientPhone,
        email: record.patientEmail,
        assignedDoctor: record.doctorName,
        clinicBranch: record.clinicBranch.includes("Gurgaon") ? "Gurgaon Sector 28" : "Noida Sector 36",
        treatmentHistory: [record.treatmentName],
        clinicalNotes: record.notes || `Booked ${record.treatmentName} with ${record.doctorName}`,
      });
    }

    return newRecord;
  };

  const updateConsultationStatus = (
    id: string,
    status: ConsultationRecord["status"],
    paymentStatus?: ConsultationRecord["paymentStatus"]
  ) => {
    const updated = consultations.map((c) =>
      c.id === id
        ? {
            ...c,
            status,
            paymentStatus: paymentStatus || c.paymentStatus,
          }
        : c
    );
    setConsultations(updated);
    try {
      localStorage.setItem("skinfinity_consultations", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  const addLead = (
    lead: Omit<AssessmentLeadRecord, "id" | "createdAt" | "status" | "assignedTo">
  ): AssessmentLeadRecord => {
    const computedSummary =
      lead.summary ||
      lead.estimateSummary ||
      (lead.baldnessGrade
        ? `${lead.baldnessGrade} • ${lead.baldnessPattern || "Hair Loss"}`
        : lead.primaryConcern || "Clinical Assessment");
    const computedDetails =
      lead.details ||
      (lead.skinTypes
        ? `Skin Types: ${lead.skinTypes.join(", ")} | Concern: ${lead.primaryConcern || "-"}`
        : lead.baldnessGrade
        ? `Grade: ${lead.baldnessGrade} | Pattern: ${lead.baldnessPattern || "-"} | Thickness: ${lead.hairThickness || "-"} | Duration: ${lead.hairLossDuration || "-"}`
        : "");

    const newLead: AssessmentLeadRecord = {
      ...lead,
      summary: computedSummary,
      details: computedDetails,
      id: `LEAD-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "New Lead",
      assignedTo:
        lead.toolType === "Hair & Baldness Assessment"
          ? "Trichology Team"
          : "Dermatology Assessment Desk",
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    try {
      localStorage.setItem("skinfinity_leads", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }

    // Seamlessly sync assessment lead to MySQL Backend database enquiries table
    try {
      postEnquiry({
        name: lead.name,
        phone: lead.phone,
        type: "contact",
        service: lead.toolType,
        location: "Online Tool",
        message: `${computedSummary} | ${computedDetails}`,
      }).catch((err) => console.warn("Backend lead sync notice:", err));
    } catch (err) {
      console.warn("Backend lead API trigger notice:", err);
    }

    return newLead;
  };

  const updateLeadStatus = (
    id: string,
    status: AssessmentLeadRecord["status"],
    followUpDate?: string
  ) => {
    const updated = leads.map((l) =>
      l.id === id ? { ...l, status, followUpDate: followUpDate || l.followUpDate } : l
    );
    setLeads(updated);
    try {
      localStorage.setItem("skinfinity_leads", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  const addEmiEnquiry = (
    enquiry: Omit<EmiEnquiryRecord, "id" | "createdAt" | "status" | "assignedTeam">
  ): EmiEnquiryRecord => {
    const newEnq: EmiEnquiryRecord = {
      ...enquiry,
      id: `EMI-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "New Enquiry",
      assignedTeam: enquiry.clinicLocation.includes("Gurgaon")
        ? "Gurgaon Financing Coordinator"
        : "Noida Financing Coordinator",
    };
    const updated = [newEnq, ...emiEnquiries];
    setEmiEnquiries(updated);
    try {
      localStorage.setItem("skinfinity_emi_enquiries", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }

    // Seamlessly sync EMI enquiry to MySQL Backend database enquiries table
    try {
      postEnquiry({
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        type: "emi",
        service: enquiry.treatmentName,
        location: enquiry.clinicLocation,
        message: `Plan: ${enquiry.treatmentPrice} | Tenure: ${enquiry.preferredTenure || "6 Months 0% EMI"} | ${enquiry.notes || ""}`,
      }).catch((err) => console.warn("Backend EMI sync notice:", err));
    } catch (err) {
      console.warn("Backend EMI API trigger notice:", err);
    }

    return newEnq;
  };

  const updateEmiStatus = (
    id: string,
    status: EmiEnquiryRecord["status"],
    assignedTeam?: string,
    notes?: string
  ) => {
    const updated = emiEnquiries.map((e) =>
      e.id === id
        ? {
            ...e,
            status,
            assignedTeam: assignedTeam || e.assignedTeam,
            notes: notes !== undefined ? notes : e.notes,
          }
        : e
    );
    setEmiEnquiries(updated);
    try {
      localStorage.setItem("skinfinity_emi_enquiries", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  const updateAdminSettings = (settings: Partial<ClinicAdminSettings>) => {
    const updated = { ...adminSettings, ...settings };
    setAdminSettings(updated);
    try {
      localStorage.setItem("skinfinity_admin_settings", JSON.stringify(updated));
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        isAppointmentModalOpen,
        appointmentPrefillTreatment,
        isEmiModalOpen,
        emiModalData,
        consultations,
        treatmentOrders,
        patients,
        leads,
        emiEnquiries,
        adminSettings,
        openAuthModal,
        closeAuthModal,
        openAppointmentModal,
        closeAppointmentModal,
        openEmiModal,
        closeEmiModal,
        login,
        signup,
        logout,
        updateProfile,
        bookConsultation,
        updateConsultationStatus,
        addLead,
        updateLeadStatus,
        addEmiEnquiry,
        updateEmiStatus,
        addOrUpdatePatient,
        updateAdminSettings,
        getDoctorFee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
