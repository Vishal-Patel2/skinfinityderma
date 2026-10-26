"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  UserCheck,
  Phone, 
  ShieldCheck, 
  Star, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Building2,
  Award
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, user, login, signup, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to sign in. Please verify your credentials.");
    } else {
      setSuccessMsg("Signed in successfully! Redirecting to your clinical profile...");
      setTimeout(() => {
        router.push("/account");
      }, 700);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!agreeTerms) {
      setErrorMsg("Please agree to the medical terms and clinical policies.");
      return;
    }

    setLoading(true);
    const res = await signup(fullName, email, phone, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to register. Please try again.");
    } else {
      setSuccessMsg("Welcome! Your Skinfinity VIP profile is ready. Redirecting...");
      setTimeout(() => {
        router.push("/account");
      }, 700);
    }
  };

  const quickDemoLogin = async () => {
    setEmail("vishal@skinfinityderma.com");
    setPassword("derma123");
    setLoading(true);
    const res = await login("vishal@skinfinityderma.com", "derma123");
    setLoading(false);
    if (res.success) {
      setSuccessMsg("Logged in with Demo Account! Redirecting...");
      setTimeout(() => {
        router.push("/account");
      }, 600);
    }
  };

  // If already logged in, show quick welcome card with link to Account
  if (isLoggedIn && user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-gradient-to-b from-[#f2faf7] to-white">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-[#008081] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              You are currently Logged In
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Signed in as <span className="font-semibold text-slate-900">{user.fullName}</span> ({user.email})
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/account"
              className="w-full py-3 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white font-bold text-sm tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>View My Profile &amp; Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Sign Out from this Device
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 sm:py-16 px-3 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* LEFT COLUMN: Premium Split-Screen Visual (Inspired by Image 2, but More Professional) */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-slate-950 flex-col justify-between p-10 text-white overflow-hidden">
          
          {/* Authentic Skincare Glow Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/auth/auth-banner.png"
              alt="Skinfinity Skincare Journey"
              fill
              className="object-cover object-left opacity-60"
              priority
            />
            {/* Opaque dark gradient on bottom half so no baked-in image text bleeds through */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/30" />
          </div>

          {/* Top Brand Badges */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Delhi NCR&apos;s No.1 Aesthetic Clinic</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-slate-200 font-medium">5 Senior MD Dermatologists</span>
            </div>
          </div>

          {/* Bottom Caption & Trust Metrics (Exact Image 2 Structure) */}
          <div className="relative z-10 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                Begin Your
              </span>
              <h1 className="text-3xl font-extrabold text-white font-serif leading-tight tracking-tight">
                Skincare Journey
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Discover the best US-FDA laser, hair restoration &amp; medi-facial treatments tailored to your skin Fitz-type.
              </p>
            </div>

            {/* Google Verified Review Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  ★ 4.8
                </div>
                <div>
                  <p className="text-xs font-bold text-white">3,200+ Google Reviews</p>
                  <p className="text-[10px] text-teal-200">Noida Sec 36 &amp; Gurgaon Sec 28</p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-300 pt-1">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> US-FDA Approved
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" /> 2 Flagship Clinics
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Form with Tab Switching */}
        <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center bg-white">
          
          {/* Header with Real Clinic Logo */}
          <div className="text-center sm:text-left mb-6">
            <div className="flex items-center justify-center sm:justify-start mb-2">
              <Image
                src="/images/logo/logo.webp"
                alt="Skinfinity Derma"
                width={170}
                height={44}
                className="h-8 sm:h-9 w-auto object-contain"
                priority
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 italic">
              &ldquo;You shouldn&apos;t have to chase beauty—it should come to you.&rdquo;
            </p>
          </div>

          {/* TAB CODE SECTION: SIGN IN OR SIGN UP */}
          <div className="flex items-center justify-center bg-slate-100 p-1.5 rounded-2xl mb-6 max-w-md mx-auto sm:mx-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === "signin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <div className="px-3 text-slate-400 text-xs font-bold">OR</div>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === "signup"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Status Notifications */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM (Email & Password, No phone OTP) */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4 max-w-md mx-auto sm:mx-0">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/15 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Password reset link will be sent to your registered email.")}
                    className="text-xs text-[#008081] hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/15 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#008081] focus:ring-[#008081]" />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-[#008081] text-white font-bold text-sm tracking-wide uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick 1-Click Demo Auto-fill */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={quickDemoLogin}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:border-[#008081]/40"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#008081]" />
                  <span>Demo Sign In (1-Click Test Profile)</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP FORM */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-3.5 max-w-md mx-auto sm:mx-0">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vishal Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/15 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/15 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98719 41444"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/15 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-[#008081] focus:ring-2 focus:ring-[#008081]/15 outline-none text-sm text-slate-800 placeholder:text-slate-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-600 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms-page"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#008081] focus:ring-[#008081]"
                />
                <label htmlFor="agree-terms-page" className="cursor-pointer">
                  I agree to Skinfinity Derma&apos;s Terms of Clinical Service and Privacy Policy.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-[#008081] text-white font-bold text-sm tracking-wide uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Return to Home Link */}
          <div className="mt-8 text-center sm:text-left border-t border-slate-100 pt-4">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-[#008081] font-medium transition-colors"
            >
              ← Return to Skinfinity Derma Homepage
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
