"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "./TopBar";
import Navigation from "./Navigation";
import MobileNav from "./MobileNav";

/**
 * Reusable Common Website Header
 * Composes TopBar, Logo, Desktop Navigation, and Mobile Navigation.
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* 1. Top Announcement & Quick Contact Bar */}
      <TopBar />

      {/* 2. Main Sticky Navigation Bar */}
      <header
        className={`transition-all duration-300 ${
          isScrolled
            ? "glass-nav shadow-elevated border-b border-slate-200/80 py-2 sm:py-2.5"
            : "bg-white/95 backdrop-blur-md border-b border-slate-100 py-2 sm:py-3.5"
        }`}
      >
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative h-10 w-32 sm:h-14 sm:w-44 transition-transform duration-300 group-hover:scale-102">
                <Image
                  src="/images/logo/logo.webp"
                  alt="Skinfinity Derma — Aesthetic Skin & Laser Clinic"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation & Actions */}
            <Navigation />

            {/* Mobile Actions & Navigation Drawer Toggle */}
            <MobileNav
              isOpen={mobileMenuOpen}
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      </header>
    </div>
  );
}
