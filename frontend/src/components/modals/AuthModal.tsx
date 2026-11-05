"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
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
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, signup, authModalNotice } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(authModalTab);
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

  // Sync activeTab when modal opens with a specific tab
  React.useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMsg("");
    setSuccessMsg("");
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to sign in. Please check your credentials.");
    } else {
      setSuccessMsg("Welcome back! Signed in successfully.");
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!agreeTerms) {
      setErrorMsg("Please agree to the medical terms and privacy policy.");
      return;
    }

    setLoading(true);
    const res = await signup(fullName, email, phone, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to create account. Please try again.");
    } else {
      setSuccessMsg("Account created successfully! Welcome to Skinfinity Derma.");
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    }
  };

  /* demo login removed */ const quickDemoLogin = async () => { return; }; const _unusedDemo = async () => {
    setEmail("vishal@skinfinityderma.com");
    setPassword("derma123");
    setLoading(true);
    const res = await login("vishal@skinfinityderma.com", "derma123");
    setLoading(false);
    if (res.success) {
      setSuccessMsg("Logged in with Demo Account!");
      setTimeout(() => {
        closeAuthModal();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
        onClick={closeAuthModal}
      />

      {/* Main Luxury Modal Card (Exact Split-Screen Structure like Image 2, but More Advanced UI) */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 z-10 grid grid-cols-1 md:grid-cols-12 min-h-[580px] max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close Modal"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all hover:rotate-90 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Luxury Visual Showcase (Split-Screen Skincare Journey like Image 2) */}
        <div className="hidden md:flex md:col-span-5 relative bg-slate-950 flex-col justify-between p-8 text-white overflow-hidden">
          
          {/* Background Image with Before/After Model Visual */}
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

          {/* Top Medical Trust Badge (Clean medical badge, no AI sparkles) */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>US-FDA Approved Protocols</span>
            </div>
          </div>

          {/* Bottom Captions matching Image 2 */}
          <div className="relative z-10 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                Begin Your
              </span>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-serif leading-tight tracking-tight">
                Skincare Journey
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
                Discover personalized clinical laser, skin &amp; hair treatments with Delhi NCR&apos;s senior dermatologists.
              </p>
            </div>

            {/* Social Proof Rating Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  ★ 4.8
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Google Verified</p>
                  <p className="text-[10px] text-slate-300">3,200+ Patient Reviews</p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Tabs & Forms (Sign In OR Sign Up) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          
          {/* Clinic Brand Header with Real Logo */}
          <div className="text-center sm:text-left mb-6">
            <div className="flex items-center justify-center sm:justify-start mb-2">
              <Image
                src="/images/logo/logo.webp"
                alt="Skinfinity Derma"
                width={160}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
            <p className="text-xs text-slate-500 italic">
              &ldquo;You shouldn&apos;t have to chase beauty—it should come to you.&rdquo;
            </p>
          </div>

          {/* TAB SWITCHER: SIGN IN OR SIGN UP */}
          <div className="flex items-center justify-center bg-slate-100 p-1 rounded-2xl mb-6">
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
            <div className="px-2 text-slate-300 text-xs font-bold">OR</div>
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

          {/* Status Alerts */}
          {authModalNotice && (
            <div className="mb-4 p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-[#006d6e] text-xs font-semibold flex items-center gap-2.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-[#008081] shrink-0" />
              <span>{authModalNotice}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email or 10-Digit Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email or 10-digit mobile"
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
                  <span>Remember me on this device</span>
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
                    <span>Continue to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick 1-Click Demo Login */}
              <div className="hidden">
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
            <form onSubmit={handleSignUp} className="space-y-3.5">
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
                  Email or 10-Digit Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email or 10-digit mobile"
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
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#008081] focus:ring-[#008081]"
                />
                <label htmlFor="agree-terms" className="cursor-pointer">
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

          {/* Dedicated Page Link */}
          <div className="mt-6 text-center border-t border-slate-100 pt-3">
            <Link
              href="/login"
              onClick={closeAuthModal}
              className="text-xs text-slate-500 hover:text-[#008081] font-medium transition-colors"
            >
              Open in dedicated full-page view →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
