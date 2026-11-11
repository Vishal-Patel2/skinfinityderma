"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  ShoppingCart,
  User,
  X,
  Menu,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onToggle, onClose }: MobileNavProps) {
  const { isLoggedIn, user, openAuthModal, openAppointmentModal, logout } = useAuth();
  const { openCart, cartCount } = useCart();

  return (
    <>
      {/* Mobile Actions Header Bar (Cart, Login/Account, Book, Hamburger) */}
      <div className="flex lg:hidden items-center gap-2">
        <button
          onClick={openCart}
          aria-label="View Cart"
          className="relative p-2 rounded-full bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
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
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer"
          >
            Login
          </button>
        )}

        <button
          onClick={openAppointmentModal}
          className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#008081] to-[#006d6e] shadow-md shadow-[#008081]/25 border border-emerald-300/30 animate-button-breathe cursor-pointer"
        >
          <Calendar className="w-3 h-3 text-white/95" />
          <span>Book</span>
        </button>

        <button
          onClick={onToggle}
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
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
                  onClick={onClose}
                  className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#d2eee7] text-[#006d6e] text-xs font-bold text-center shadow-sm"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    openCart();
                  }}
                  className="py-2 px-3 rounded-xl bg-teal-100/70 text-[#006d6e] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>({cartCount})</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="py-2 px-2.5 rounded-xl text-slate-400 hover:text-rose-600 text-[11px] font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthModal("signin");
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In or Create Account</span>
            </button>
          )}

          <div className="space-y-1">
            <Link
              href="/"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
            >
              Home
            </Link>
            <Link
              href="/treatments"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-extrabold text-[#008081] bg-[#e8f6f3]/70 hover:bg-[#e8f6f3]"
            >
              Treatments &amp; Price List
            </Link>
            <Link
              href="/about-clinic"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
            >
              About Clinic
            </Link>
            <Link
              href="/about-us"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
            >
              About Dr. Ipshita Johri &amp; Team
            </Link>
            <Link
              href="/results"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
            >
              Results (Before &amp; After)
            </Link>
            <Link
              href="/gallery"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
            >
              Clinic &amp; Machine Gallery
            </Link>
            <Link
              href="/franchise"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              Franchise Opportunities (FICO/FOFO)
            </Link>
            <Link
              href="/membership"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-600 hover:bg-amber-50"
            >
              VIP Membership Plans
            </Link>
            <Link
              href="/contact-us"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-700"
            >
              Contact Us
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                openAppointmentModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#008081] via-[#029697] to-[#046c6d] text-center shadow-lg shadow-[#008081]/30 border border-emerald-300/40 animate-button-breathe cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Appointment Request</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
