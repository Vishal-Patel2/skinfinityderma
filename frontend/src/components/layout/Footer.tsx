"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  CreditCard,
  Building2,
} from "lucide-react";

interface CityTreatmentLink {
  name: string;
  slug: string;
}

const CITY_TREATMENTS: Record<"Noida" | "Gurgaon", CityTreatmentLink[]> = {
  Noida: [
    { name: "Dermatologist Clinic in Noida", slug: "about-clinic" },
    { name: "Laser Hair Reduction in Noida", slug: "laser-hair-reduction-noida" },
    { name: "Hair Fall Treatment in Noida", slug: "hair-fall-treatment-noida" },
    { name: "Skin Clinic in Noida", slug: "about-clinic" },
    { name: "Acne Treatment in Noida", slug: "acne-pimple-treatment-noida" },
    { name: "Pigmentation Treatment in Noida", slug: "pigmentation-treatment-noida" },
    { name: "Anti Ageing Treatment in Noida", slug: "anti-ageing-facials" },
    { name: "Lip Fillers in Noida", slug: "fillers" },
    { name: "Chemical Peel in Noida", slug: "chemical-peel-noida" },
    { name: "Dark Circle Treatment in Noida", slug: "under-eye-treatment" },
    { name: "HIFU in Noida", slug: "hifu" },
    { name: "Thread Lifting in Noida", slug: "thread-lift" },
    { name: "Skin Boosters in Noida", slug: "skin-boosters" },
    { name: "Hydra Facials in Noida", slug: "sugarcane-hydrafacial" },
    { name: "PRP Treatment in Noida", slug: "prp-hair-treatment" },
    { name: "GFC Treatment in Noida", slug: "gfc-hair-treatment" },
  ],
  Gurgaon: [
    { name: "Dermatologist Clinic in Gurgaon", slug: "dermatologist-in-gurgaon" },
    { name: "Laser Hair Reduction in Gurgaon", slug: "laser-hair-reduction-noida" },
    { name: "Hair Fall Treatment in Gurgaon", slug: "hair-fall-treatment-noida" },
    { name: "Skin Clinic in Gurgaon", slug: "dermatologist-in-gurgaon" },
    { name: "Acne Treatment in Gurgaon", slug: "acne-pimple-treatment-noida" },
    { name: "Pigmentation Treatment in Gurgaon", slug: "pigmentation-treatment-noida" },
    { name: "Anti Ageing Treatment in Gurgaon", slug: "anti-ageing-facials" },
    { name: "Fillers Treatment in Gurgaon", slug: "fillers" },
    { name: "Chemical Peel in Gurgaon", slug: "chemical-peel-noida" },
    { name: "Dark Circle Treatment in Gurgaon", slug: "under-eye-treatment" },
    { name: "HIFU in Gurgaon", slug: "hifu" },
    { name: "Thread Lifting in Gurgaon", slug: "thread-lift" },
    { name: "Skin Boosters in Gurgaon", slug: "skin-boosters" },
    { name: "Hydra Facials in Gurgaon", slug: "sugarcane-hydrafacial" },
    { name: "PRP Treatment in Gurgaon", slug: "prp-hair-treatment" },
    { name: "GFC Treatment in Gurgaon", slug: "gfc-hair-treatment" },
  ],
};

export default function Footer() {
  const [isCitySectionOpen, setIsCitySectionOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<"Noida" | "Gurgaon">("Noida");

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand & Introduction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-850">
          {/* Logo & Philosophy */}
          <div className="lg:col-span-4 space-y-5">
            <div className="relative h-16 w-52">
              <Image
                src="/images/logo/footer-logo.webp"
                alt="Skinfinity Derma — Epitome of Health and Beauty"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Skinfinity is the epitome of health, well-being and beauty providing comprehensive solutions to all Skin, Hair, Nail and cosmetic concerns. Our unique individualized approach focuses on accurate diagnosis, treating the root cause, preventing recurrence and empowering patient education.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/skinfinityderma/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-700 transition-colors"
                aria-label="Follow Skinfinity Derma on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/skinfinityderma/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-700 transition-colors"
                aria-label="Follow Skinfinity Derma on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCnlVU02sraO4-Saptc7gIJA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-700 transition-colors"
                aria-label="Watch Skinfinity Derma on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Noida Clinic Card */}
          <div className="lg:col-span-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Main Center</span>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Sector 36</span>
            </div>
            <h4 className="text-base font-bold text-white">Noida Clinic (Headquarters)</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <a
                  href="https://share.google/hUEpkQ6r4yLzV4KAA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors"
                  title="View Skinfinity Derma Noida on Google Maps"
                >
                  Basement Floor, House B1, Sector 36, Near Logix City Centre Mall, Noida - 201303
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <a href="tel:+919871941444" className="hover:text-white transition-colors">+91 98719 41444</a>
                <span className="text-slate-600">/</span>
                <a href="tel:+918929765785" className="hover:text-white transition-colors">+91 89297 65785</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <a href="mailto:skinfinityderma@gmail.com" className="hover:text-white transition-colors">skinfinityderma@gmail.com</a>
              </p>
              <p className="flex items-center gap-2 text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Mon - Sun: 10:00 AM – 08:00 PM</span>
              </p>
            </div>
          </div>

          {/* Gurgaon Clinic Card */}
          <div className="lg:col-span-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Golf Course Rd</span>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Sector 28</span>
            </div>
            <h4 className="text-base font-bold text-white">Gurgaon Clinic</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a
                  href="https://share.google/lcTdjEdMmaSLRKDeF"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors"
                  title="View Skinfinity Derma Gurugram on Google Maps"
                >
                  2nd Floor, SP1, Sector 28, Golf Course Road, Gurugram - 122002 (Near DLF Phase 1 &amp; 2)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="tel:+918591110110" className="hover:text-white transition-colors">+91 85911 10110</a>
                <span className="text-slate-600">/</span>
                <a href="tel:+919810458900" className="hover:text-white transition-colors">+91 98104 58900</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:skinfinitygurgaonclinic@gmail.com" className="hover:text-white transition-colors">skinfinitygurgaonclinic@gmail.com</a>
              </p>
              <p className="flex items-center gap-2 text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Mon - Sun: 10:00 AM – 08:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible "Find Treatments in Your City" Section (Closed by default, UI only, Noida & Gurgaon tabs) */}
        <div className="py-7 border-b border-slate-850">
          <div className="rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800">
            {/* Toggle Bar */}
            <button
              type="button"
              onClick={() => setIsCitySectionOpen((prev) => !prev)}
              className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800/80 transition-colors flex items-center justify-center gap-2.5 text-sm font-medium text-slate-200 select-none"
            >
              <span>Find Treatments in Your City</span>
              <span className="text-[10px] text-slate-300">
                {isCitySectionOpen ? "▲" : "▼"}
              </span>
            </button>

            {/* Expandable City Tabs & Treatments Grid */}
            {isCitySectionOpen && (
              <div className="px-5 sm:px-8 pb-6 pt-2 bg-slate-900/60 border-t border-slate-800/80">
                {/* City Tabs: Noida & Gurgaon */}
                <div className="flex items-center gap-2 border-b border-slate-800 mb-5">
                  {(["Noida", "Gurgaon"] as const).map((city) => {
                    const isActive = selectedCity === city;
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setSelectedCity(city)}
                        className={`px-5 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all relative ${
                          isActive
                            ? "bg-slate-800/90 text-white font-semibold border-b-2 border-teal-400"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                        }`}
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>

                {/* 4-Column Treatments Grid with Active Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 text-xs sm:text-[13px] text-slate-300">
                  {CITY_TREATMENTS[selectedCity].map((item, idx) => (
                    <Link
                      key={idx}
                      href={`/${item.slug}`}
                      className="py-1 text-slate-300 hover:text-teal-300 transition-colors block text-left truncate hover:underline"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Associated Banks & Medical Partners Strip */}
        <div className="py-8 border-b border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">Associated Partners &amp; 0% EMI:</span>
            <span>Orange Health Labs, HDFC Bank EMI, ICICI Health, Bajaj Finserv, Lumenis, Candela, Allergan</span>
          </div>
          <Link
            href="/franchise"
            className="text-amber-400 font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Own a Skinfinity Derma Franchise →</span>
          </Link>
        </div>

        {/* Quick Links Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-10 border-b border-slate-850 text-xs">
          <div className="space-y-3">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">Skinfinity Clinic</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Dr. Ipshita Johri</Link></li>
              <li><Link href="/about-clinic" className="hover:text-white transition-colors">About Clinic &amp; Lab</Link></li>
              <li><Link href="/results" className="hover:text-white transition-colors">Real Results Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/testimonials" className="hover:text-white transition-colors">Patient Testimonials</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">Interactive Tools</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/#skin-analyser" className="hover:text-brand-300 transition-colors">AI Skin Health Analyser</Link></li>
              <li><Link href="/#hair-calculator" className="hover:text-brand-300 transition-colors">Hair Graft Calculator</Link></li>
              <li><Link href="/#laser-estimator" className="hover:text-brand-300 transition-colors">Laser Price Estimator</Link></li>
              <li><Link href="/membership" className="hover:text-amber-300 font-semibold transition-colors">VIP Membership Club</Link></li>
              <li><Link href="/latest-offer" className="hover:text-amber-300 transition-colors">Monthly Special Packages</Link></li>
              <li><Link href="/franchise" className="hover:text-brand-300 transition-colors">Franchise (FOCO/FOFO)</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">Skin &amp; Face</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/acne-pimple-treatment-noida" className="hover:text-white transition-colors">Acne &amp; Scars Treatment</Link></li>
              <li><Link href="/sugarcane-hydrafacial" className="hover:text-white transition-colors">Sugarcane HydraFacial</Link></li>
              <li><Link href="/anti-ageing-facials" className="hover:text-white transition-colors">Anti Ageing Facials</Link></li>
              <li><Link href="/acne-pimple-treatment-noida" className="hover:text-white transition-colors">Pigmentation &amp; Melasma</Link></li>
              <li><Link href="/about-clinic" className="hover:text-white transition-colors">Chemical &amp; Organic Peels</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">Hair &amp; Lasers</h5>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/laser-hair-removal-noida" className="hover:text-white transition-colors">Laser Hair Removal Noida</Link></li>
              <li><Link href="/hair-loss-treatment" className="hover:text-white transition-colors">Hair Loss Treatment</Link></li>
              <li><Link href="/hair-loss-treatment" className="hover:text-white transition-colors">Hair PRP &amp; GFC Therapy</Link></li>
              <li><Link href="/laser-hair-removal-noida" className="hover:text-white transition-colors">Beard Growth &amp; Shaping</Link></li>
              <li><Link href="/about-clinic" className="hover:text-white transition-colors">Q-Switched Nd:YAG Laser</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3">
            <h5 className="text-white font-bold uppercase tracking-wider text-[11px]">Verified Credentials</h5>
            <div className="space-y-3 text-slate-400">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-brand-400 font-bold text-sm">3,200+ Reviews</span>
                <span className="text-[11px] text-slate-400">4.8 Star Verified Patient Rating</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-amber-400 font-bold text-sm">1,00,000+</span>
                <span className="text-[11px] text-slate-400">Treated Clinical Patients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left leading-relaxed">
            Disclaimer: Website content is for educational purposes only and not a substitute for professional medical advice.
            <br />
            © {new Date().getFullYear()} Skinfinity Derma Private Limited. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center text-slate-400">
            <Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link>
            <span>•</span>
            <Link href="/contact-us" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/contact-us" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
            <span>•</span>
            <Link href="/franchise" className="hover:text-white transition-colors">Franchise Program</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
