"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Award,
  Zap,
  Crown,
  Briefcase,
  ShoppingCart,
  User,
  UserCheck,
  Calendar,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navigation() {
  const { isLoggedIn, user, openAuthModal, openAppointmentModal, logout } = useAuth();
  const { openCart, cartCount } = useCart();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      {/* Desktop Navigation Links & Mega Menu */}
      <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
       

        {/* About Us Dropdown */}
        <div
          className="relative group"
          onMouseEnter={() => setActiveDropdown("about")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-brand-700 py-2 transition-colors cursor-pointer">
            <span>About Us</span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-brand-700" />
          </button>

          {activeDropdown === "about" && (
            <div className="absolute top-full left-0 w-64 pt-2 z-50">
              <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 space-y-1">
                <Link
                  href="/about-clinic"
                  onClick={() => setActiveDropdown(null)}
                  className="block px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-800 transition-colors"
                >
                  <span className="font-semibold block text-slate-900">About Clinic</span>
                  <span className="text-[11px] text-slate-500">Machines, Labs &amp; Clinic Suites</span>
                </Link>
                <Link
                  href="/about-us"
                  onClick={() => setActiveDropdown(null)}
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
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
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
                          Gold Wedding Transformation
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-[#f2faf7] px-4 py-2.5 rounded-xl">
                  <span className="text-xs font-semibold text-slate-700">
                    Browse 58+ US-FDA Doctor-Supervised Clinical Treatments 
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
          href="/gallery"
          className="text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors"
        >
          Gallery
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
        {/* Cart Trigger */}
        <button
          onClick={openCart}
          aria-label="View Cart"
          className="relative p-2.5 rounded-full bg-white hover:bg-[#e8f6f3] text-slate-700 hover:text-[#008081] transition-all border border-slate-200 shadow-sm group cursor-pointer"
          title="View Clinical Treatment Cart"
        >
          <ShoppingCart className="w-4 h-4 text-slate-700 group-hover:text-[#008081]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#008081] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          )}
        </button>

        {/* User / Sign In Trigger */}
        {!isLoggedIn ? (
          <button
            onClick={() => openAuthModal("signin")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-[#008081] hover:border-[#008081]/50 transition-all border border-slate-300 shadow-sm cursor-pointer"
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
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium text-slate-500 hover:bg-slate-50 hover:text-rose-600 transition-colors cursor-pointer"
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

        {/* Appointment CTA */}
        <button
          onClick={openAppointmentModal}
          className="relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-[#008081] via-[#029697] to-[#046c6d] hover:from-[#006d6e] hover:to-[#008081] border border-emerald-300/40 shadow-lg shadow-[#008081]/35 hover:shadow-xl hover:shadow-[#008081]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 animate-button-breathe group shrink-0 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-white/95 group-hover:scale-110 transition-transform" />
          <span>Appointment Request</span>
        </button>
      </div>
    </>
  );
}
