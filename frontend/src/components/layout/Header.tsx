"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Phone, 
  Clock, 
  ChevronDown, 
  Menu, 
  X, 
  Award,
  Zap,
  Calendar,
  ShieldCheck,
  Briefcase,
  Crown,
  ShoppingCart,
  User,
  UserCheck,
  LogOut,
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { isLoggedIn, user, openAuthModal, openAppointmentModal, logout, adminSettings } = useAuth();
  const { openCart, cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement & Quick Contact Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-[1536px] mx-auto px-2 sm:px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              10+ Years • 1 Lakh+ Patients • {adminSettings.googleReviewsCount} Verified Reviews ({adminSettings.googleRating} ★)
            </span>
            <span className="hidden lg:inline-block text-slate-600">•</span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              Mon - Sun: 10:00 AM – 08:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Noida:</span>
              <a href="tel:+919871941444" className="text-white hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors">
                <Phone className="w-3 h-3 text-brand-400" />
                +91 98719 41444
              </a>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 hidden sm:inline">Gurgaon:</span>
              <a href="tel:+918591110110" className="text-white hover:text-brand-300 font-semibold flex items-center gap-1 transition-colors">
                <Phone className="w-3 h-3 text-brand-400" />
                +91 85911 10110
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-nav shadow-elevated border-b border-slate-200/80 py-2.5"
            : "bg-white/95 backdrop-blur-md border-b border-slate-100 py-3.5"
        }`}
      >
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative h-12 w-36 sm:h-14 sm:w-44 transition-transform duration-300 group-hover:scale-102">
                <Image
                  src="/images/logo/logo.webp"
                  alt="Skinfinity Derma — Aesthetic Skin & Laser Clinic"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
              <Link 
                href="/" 
                className="text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors"
              >
                Home
              </Link>

              {/* About Us Dropdown ("Lab" removed from navigation label per requirements) */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown("about")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-brand-700 py-2 transition-colors">
                  <span>About Us</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-brand-700" />
                </button>

                {activeDropdown === "about" && (
                  <div className="absolute top-full left-0 w-64 pt-2 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-1">
                      <Link 
                        href="/about-clinic" 
                        className="block px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-800 transition-colors"
                      >
                        <span className="font-semibold block text-slate-900">About Clinic</span>
                        <span className="text-[11px] text-slate-500">Machines, Labs &amp; Clinic Suites</span>
                      </Link>
                      <Link 
                        href="/about-us" 
                        className="block px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-800 transition-colors"
                      >
                        <span className="font-semibold block text-slate-900">About Dr. Ipshita Johri</span>
                        <span className="text-[11px] text-slate-500">Founder &amp; Senior Dermatologists</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Treatments Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown("treatments")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/treatments"
                  className="flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-brand-700 py-2 transition-colors"
                >
                  <span>Treatments</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-brand-700" />
                </Link>

                {activeDropdown === "treatments" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[740px] pt-2 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 space-y-5">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Column 1: Skin */}
                        <div>
                          <Link
                            href="/treatments?category=Skin+Treatments"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 pb-2 mb-2 border-b border-slate-100 hover:underline"
                          >
                            <Award className="w-3.5 h-3.5 text-brand-700" />
                            Skin Treatments
                          </Link>
                          <ul className="space-y-1.5 text-xs">
                            <li>
                              <Link href="/acne-pimple-treatment" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Acne &amp; Pimple Treatment
                              </Link>
                            </li>
                            <li>
                              <Link href="/viscoderm" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Viscoderm Bioremodeling
                              </Link>
                            </li>
                            <li>
                              <Link href="/hydrafacial" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                HydraFacial Treatment
                              </Link>
                            </li>
                            <li>
                              <Link href="/pigmentation-treatment" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Pigmentation &amp; Melasma
                              </Link>
                            </li>
                            <li>
                              <Link href="/botox" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Botox &amp; Dermal Fillers
                              </Link>
                            </li>
                            <li>
                              <Link href="/profhilo" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Profhilo &amp; Skin Boosters
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Column 2: Hair & Lasers */}
                        <div>
                          <Link
                            href="/treatments?category=Laser+Treatments"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 pb-2 mb-2 border-b border-slate-100 hover:underline"
                          >
                            <Zap className="w-3.5 h-3.5 text-brand-700" />
                            Hair &amp; Laser Treatments
                          </Link>
                          <ul className="space-y-1.5 text-xs">
                            <li>
                              <Link href="/laser-hair-reduction" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Laser Hair Reduction
                              </Link>
                            </li>
                            <li>
                              <Link href="/full-body-laser-hair-reduction" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Full Body Laser Reduction
                              </Link>
                            </li>
                            <li>
                              <Link href="/prp-hair-treatment" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                PRP &amp; GFC Hair Treatment
                              </Link>
                            </li>
                            <li>
                              <Link href="/hair-transplant" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Hair Transplant Surgery
                              </Link>
                            </li>
                            <li>
                              <Link href="/laser-tattoo-removal" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Laser Tattoo Removal
                              </Link>
                            </li>
                            <li>
                              <Link href="/q-switch-ndyag-laser" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Q-Switch Nd:YAG Laser
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Column 3: Body & Wedding Packages */}
                        <div>
                          <Link
                            href="/treatments?category=Wedding+Packages"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 pb-2 mb-2 border-b border-slate-100 hover:underline"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            Body &amp; Wedding Packages
                          </Link>
                          <ul className="space-y-1.5 text-xs">
                            <li>
                              <Link href="/body-contouring" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Body Contouring &amp; Fat Loss
                              </Link>
                            </li>
                            <li>
                              <Link href="/double-chin-reduction" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                Double Chin Reduction
                              </Link>
                            </li>
                            <li>
                              <Link href="/hifu" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-600 hover:text-brand-700 font-medium transition-colors">
                                HIFU Non-Surgical Face Lift
                              </Link>
                            </li>
                            <li>
                              <Link href="/bridal-packages" onClick={() => setActiveDropdown(null)} className="block py-1 text-amber-700 hover:text-amber-800 font-semibold transition-colors">
                                💍 Bridal Aesthetic Packages
                              </Link>
                            </li>
                            <li>
                              <Link href="/groom-packages" onClick={() => setActiveDropdown(null)} className="block py-1 text-slate-700 hover:text-brand-700 font-semibold transition-colors">
                                🤵 Groom Grooming Packages
                              </Link>
                            </li>
                            <li>
                              <Link href="/gold-package" onClick={() => setActiveDropdown(null)} className="block py-1 text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                                ✨ Gold Wedding Transformation
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-[#f2faf7] px-4 py-2.5 rounded-xl">
                        <span className="text-xs font-semibold text-slate-700">
                          Browse 58+ US-FDA Doctor-Supervised Clinical Treatments with Transparent Pricing &amp; Flexible EMI
                        </span>
                        <Link
                          href="/treatments"
                          onClick={() => setActiveDropdown(null)}
                          className="text-xs font-extrabold text-[#008081] hover:underline"
                        >
                          View All Treatments &amp; Prices →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link 
                href="/results" 
                className="text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors"
              >
                Results
              </Link>

              <Link 
                href="/franchise" 
                className="text-sm font-semibold text-slate-700 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                Franchise
              </Link>

              <Link 
                href="/membership" 
                className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                <Crown className="w-3.5 h-3.5" />
                Membership
              </Link>

              <Link 
                href="/contact-us" 
                className="text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors"
              >
                Contact Us
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={openCart}
                aria-label="View Cart"
                className="relative p-2.5 rounded-full bg-white hover:bg-[#e8f6f3] text-slate-700 hover:text-[#008081] transition-all border border-slate-200 shadow-sm group"
                title="View Clinical Treatment Cart"
              >
                <ShoppingCart className="w-4 h-4 text-slate-700 group-hover:text-[#008081]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#008081] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {!isLoggedIn ? (
                <button
                  onClick={() => openAuthModal("signin")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-[#008081] hover:border-[#008081]/50 transition-all border border-slate-300 shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown("account")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href="/account"
                    aria-label="Account & Contact Details"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8f6f3] hover:bg-[#d8f0eb] text-[#006d6e] border border-[#d2eee7] text-xs font-bold transition-all shadow-sm group"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#008081] text-white text-[11px] font-bold flex items-center justify-center">
                      {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
                    </div>
                    <span className="hidden xl:inline max-w-[100px] truncate">{user?.fullName?.split(" ")[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#008081]" />
                  </Link>

                  {activeDropdown === "account" && (
                    <div className="absolute right-0 top-full w-56 pt-2 z-50">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 space-y-1">
                        <div className="px-3 py-2 border-b border-slate-100">
                          <div className="text-xs font-extrabold text-slate-900 truncate">{user?.fullName}</div>
                          <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-800"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#008081]" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-800"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#008081]" />
                          <span>My Appointments</span>
                        </Link>
                        <div className="pt-1 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-500 hover:bg-slate-50 hover:text-rose-600 transition-colors"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={openAppointmentModal}
                className="relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-[#008081] via-[#029697] to-[#046c6d] hover:from-[#006d6e] hover:to-[#008081] border border-emerald-300/40 shadow-lg shadow-[#008081]/35 hover:shadow-xl hover:shadow-[#008081]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 animate-button-breathe group shrink-0"
              >
                <Calendar className="w-3.5 h-3.5 text-white/95 group-hover:scale-110 transition-transform" />
                <span>Appointment Request</span>
              </button>
            </div>

            {/* Mobile Actions & Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={openCart}
                aria-label="View Cart"
                className="relative p-2 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#008081] text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
                <Link
                  href="/account"
                  aria-label="Account"
                  className="p-1.5 rounded-full bg-[#e8f6f3] text-[#008081] border border-[#d2eee7]"
                >
                  <UserCheck className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal("signin")}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                >
                  Login
                </button>
              )}

              <button
                onClick={openAppointmentModal}
                className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#008081] to-[#006d6e] shadow-md shadow-[#008081]/25 border border-emerald-300/30 animate-button-breathe"
              >
                <Calendar className="w-3 h-3 text-white/95" />
                <span>Book</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            {isLoggedIn ? (
              <div className="p-3.5 rounded-2xl bg-[#f2faf7] border border-[#dff1ec] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#008081] text-white text-xs font-bold flex items-center justify-center">
                      {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900">{user?.fullName}</span>
                      <span className="text-[10px] text-slate-500">{user?.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-[#d8eee7]">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#d2eee7] text-[#006d6e] text-xs font-bold text-center shadow-sm"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openCart();
                    }}
                    className="py-2 px-3 rounded-xl bg-teal-100/70 text-[#006d6e] text-xs font-bold flex items-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>({cartCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-2 px-2.5 rounded-xl text-slate-400 hover:text-rose-600 text-[11px] font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("signin");
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In or Create Account</span>
              </button>
            )}

            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
              >
                Home
              </Link>
              <Link
                href="/treatments"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-extrabold text-[#008081] bg-[#e8f6f3]/70 hover:bg-[#e8f6f3]"
              >
                Treatments &amp; Price List
              </Link>
              <Link
                href="/about-clinic"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
              >
                About Clinic
              </Link>
              <Link
                href="/about-us"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
              >
                About Dr. Ipshita Johri &amp; Team
              </Link>
              <Link
                href="/results"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
              >
                Results (Before &amp; After)
              </Link>
              <Link
                href="/franchise"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                Franchise Opportunities (FICO/FOFO)
              </Link>
              <Link
                href="/membership"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-600 hover:bg-amber-50"
              >
                VIP Membership Plans
              </Link>
              <Link
                href="/contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
              >
                Contact Us
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAppointmentModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#008081] via-[#029697] to-[#046c6d] text-center shadow-lg shadow-[#008081]/30 border border-emerald-300/40 animate-button-breathe"
              >
                <Calendar className="w-4 h-4" />
                <span>Appointment Request</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
