"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Pill,
  ShieldCheck,
  Star,
  Trophy,
  Building2,
  Microscope,
  Calendar,
  HeartHandshake,
  Cpu,
  FileCheck2,
  MapPin,
  Sparkles,
  Maximize2,
} from "lucide-react";
import {
  DOCTORS,
  ASSOCIATED_PARTNERS,
} from "@/data/clinicData";
import { getDoctors, getGallery } from "@/lib/api";
import { GalleryItem } from "@/types/gallery.types";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import BrandJourneyRoadmap from "@/components/about/BrandJourneyRoadmap";
import { useAuth } from "@/context/AuthContext";
import SectionDivider from "@/components/shared/SectionDivider";

const AWARDS_LIST = [
  {
    title: "Government-Approved CMO Licence",
    badge: "Official Medical Registration",
    year: "Certified",
    desc: "Registered and licensed under the Chief Medical Officer (CMO) clinical establishment norms, ensuring strict medical compliance, bio-safety, and qualified MD dermatologist governance.",
    iconType: "licence",
  },
  {
    title: "Most Trusted Skin Clinic Award",
    badge: "Patient Trust & Excellence",
    year: "2024–2026",
    desc: "Honored as the Most Trusted Skin & Laser Clinic in Delhi NCR backed by 4,500+ verified reviews (4.5/5 rating) and over 1,00,000 successful clinical procedures.",
    iconType: "award",
  },
  {
    title: "Ms. India Curvy 2020 — Runner Up",
    badge: "National Pageant Icon",
    year: "2020",
    desc: "Dr. Ipshita Johri crowned nationally for championing body positivity, self-confidence, and inclusive clinical aesthetics.",
    iconType: "award",
  },
  {
    title: "Excellence in US-FDA Laser & Trichology Protocols",
    badge: "Clinical Innovation",
    year: "2023",
    desc: "Recognized for pioneering Sugarcane HydraFacial MD and high-concentration autologous GFC hair restoration protocols in North India.",
    iconType: "award",
  },
];

interface AboutClinicInteractiveSectionsProps {
  initialGallery?: GalleryItem[];
}

export default function AboutClinicInteractiveSections({
  initialGallery,
}: AboutClinicInteractiveSectionsProps = {}) {
  const { openAppointmentModal } = useAuth();
  const [activeTab, setActiveTab] = useState<"All" | "Machines" | "Labs" | "Clinic">("All");
  const [selectedLocation, setSelectedLocation] = useState<"All" | "Gurgaon" | "Noida">("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGallery ?? []);
  const [isGalleryLoading, setIsGalleryLoading] = useState(!initialGallery?.length);
  const [galleryError, setGalleryError] = useState(false);

  const doctorScrollRef = useRef<HTMLDivElement>(null);
  const [isDocPaused, setIsDocPaused] = useState(false);

  const [specialistDoctors, setSpecialistDoctors] = useState(() =>
    DOCTORS.map((doc) =>
      doc.id === "dr-ipshita-johri"
        ? { ...doc, image: "/images/doctors/dr-ipshita-johri.webp" }
        : doc
    )
  );

  useEffect(() => {
    let active = true;
    getDoctors().then((docs) => {
      if (active && docs && docs.length > 0) {
        setSpecialistDoctors(docs);
      }
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadGallery = async () => {
      try {
        setGalleryError(false);
        const items = await getGallery();

        if (!isActive) return;

        // The API is the source of truth. An empty response stays empty;
        // no hardcoded/demo gallery items are inserted.
        setGalleryItems(Array.isArray(items) ? items : []);
      } catch (error) {
        if (!isActive) return;
        console.error("Unable to load clinic gallery:", error);
        setGalleryError(true);
      } finally {
        if (isActive) setIsGalleryLoading(false);
      }
    };

    loadGallery();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (isDocPaused) return;
    const timer = setInterval(() => {
      const el = doctorScrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isDocPaused]);

  const scrollDocLeft = () =>
    doctorScrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollDocRight = () =>
    doctorScrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  const activeItems = useMemo<GalleryItem[]>(() => {
    return galleryItems.filter((item) => {
      const category = (item.category || "").toLowerCase();
      const location = (item.location || "").toLowerCase();

      const matchesCategory =
        activeTab === "All" || category === activeTab.toLowerCase();

      const matchesLocation =
        selectedLocation === "All" ||
        !location ||
        location.includes(selectedLocation.toLowerCase()) ||
        location.includes("both") ||
        location.includes("noida & gurgaon") ||
        location.includes("gurgaon & noida");

      return matchesCategory && matchesLocation;
    });
  }, [galleryItems, activeTab, selectedLocation]);

  return (
    <div className="bg-white">

      
      

      {/* ── 1. OUR JOURNEY – INTERACTIVE S-CURVE ROADMAP ── */}
      <BrandJourneyRoadmap />

      <SectionDivider />

      {/* ── 2. DYNAMIC CLINIC GALLERY ── */}
      <section className="py-14 lg:py-20 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
                <Building2 className="w-3.5 h-3.5" />
                <span>Clinical Infrastructure Explorer</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
                Explore Our <span className="text-brand-700">Machines, Labs &amp; Clinic</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
                Explore our clinical machines, diagnostic laboratories, and clinic facilities across Noida and Gurgaon.
              </p>
            </div>

            <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm self-start lg:self-auto">
              {([
                { id: "All", label: "All", icon: Sparkles },
                { id: "Machines", label: "Machines", icon: Cpu },
                { id: "Labs", label: "Labs", icon: FlaskConical },
                { id: "Clinic", label: "Clinic", icon: Building2 },
              ] as const).map(({ id, label, icon: TabIcon }) => {
                const isActive = activeTab === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveTab(id);
                      setLightboxIndex(null);
                    }}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-[#008081] text-white"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 mb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-[#008081]" />
              <span className="font-medium">Filter by facility:</span>
              {(["All", "Gurgaon", "Noida"] as const).map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => {
                    setSelectedLocation(location);
                    setLightboxIndex(null);
                  }}
                  aria-pressed={selectedLocation === location}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedLocation === location
                      ? "bg-[#008081] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {location === "All" ? "Both Centers" : `${location} Clinic`}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500" aria-live="polite">
              Showing{" "}
              <strong className="text-slate-900">{activeItems.length}</strong>{" "}
              {activeItems.length === 1 ? "photograph" : "photographs"}
            </p>
          </div>

          {isGalleryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading gallery">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="aspect-[4/3] rounded-3xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : galleryError ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
              <h3 className="text-base font-bold text-slate-800 font-serif">
                Gallery could not be loaded
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Please try again in a moment.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsGalleryLoading(true);
                  setGalleryError(false);
                  getGallery()
                    .then((items) => setGalleryItems(Array.isArray(items) ? items : []))
                    .catch((error) => {
                      console.error("Unable to reload clinic gallery:", error);
                      setGalleryError(true);
                    })
                    .finally(() => setIsGalleryLoading(false));
                }}
                className="mt-4 rounded-full bg-[#008081] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#006d6e]"
              >
                Retry
              </button>
            </div>
          ) : activeItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center">
              <Building2 className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <h3 className="text-base font-bold text-slate-800 font-serif">
                No Gallery Images Found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                No published gallery images match the selected category and location.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("All");
                  setSelectedLocation("All");
                }}
                className="mt-4 rounded-full bg-[#008081] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#006d6e]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`View gallery image: ${item.title}`}
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-200 text-left shadow-sm transition-all duration-300 hover:border-[#008081] hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#008081] focus-visible:ring-offset-2"
                >
                  <Image
                    src={item.image}
                    alt={item.altText || item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  <span className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
                    <span className="max-w-[70%] truncate rounded-full border border-white/60 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800">
                      {item.badge || item.category || "Clinic"}
                    </span>
                    {item.location && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold text-white">
                        <MapPin className="h-3 w-3 text-teal-300" />
                        {item.location}
                      </span>
                    )}
                  </span>

                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white bg-white/90 text-[#008081] shadow-lg">
                      <Maximize2 className="h-5 w-5" />
                    </span>
                  </span>

                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block font-serif text-base font-bold leading-snug text-white transition-colors group-hover:text-teal-200">
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-slate-200">
                        {item.description}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}

          <GalleryLightbox
            items={activeItems}
            index={lightboxIndex}
            onIndexChange={setLightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        </div>
      </section>

      <SectionDivider />

      {/* ── 3. AWARDS, LICENSING & RECOGNITIONS ── */}
      <section className="py-10 lg:py-14 bg-gradient-to-b from-white via-amber-50/20 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Licensing, Honors &amp; Accolades</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Awards, CMO Licence &amp; <span className="text-brand-700">Recognitions</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Government-approved medical licensing, national awards, and verified patient trust across Noida and Gurgaon.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Spotlight Card */}
            <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Government-Approved CMO Licence</span>
                </div>

                <h3 className="text-2xl font-extrabold font-serif leading-snug">
                  Most Trusted Skin Clinic Award &amp; CMO Licensed Center
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Skinfinity Derma operates as a fully registered, Government-Approved CMO Licensed dermatology facility, recipient of the Most Trusted Skin Clinic Award and led by Founder Dr. Ipshita Johri (Ms. India Curvy 2020 Runner Up).
                </p>
              </div>

              <div className="mt-6 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 relative z-10">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-amber-400">
                  <Image
                    src="/images/doctors/dr-ipshita-miss-curvy.jpg"
                    alt="Dr. Ipshita Johri Ms. India Curvy 2020"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-white mt-1">
                    Most Trusted Skin Clinic Award
                  </p>
                  <p className="text-[11px] text-slate-300">
                    4,500+ Verified 4.5★ Google Reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Right 2x2 Grid of Awards including Government-Approved CMO Licence & Most Trusted Skin Clinic Award */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {AWARDS_LIST.map((award, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                        {award.iconType === "licence" ? (
                          <FileCheck2 className="w-5 h-5 text-emerald-700" />
                        ) : (
                          <Trophy className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        {award.badge}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-serif leading-snug pt-1">
                      {award.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {award.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Verification Status</span>
                    <span className="text-brand-700">{award.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 4. DEDICATED DOCTOR PROFILES ── */}
      <section id="doctors" className="py-10 lg:py-14 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Senior Clinical Board</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
                Dedicated <span className="text-brand-700">Doctor Profiles</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
                Every consultation and procedure at Skinfinity Derma is performed directly by our board-certified dermatologists.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={scrollDocLeft}
                aria-label="Previous doctor"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollDocRight}
                aria-label="Next doctor"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={doctorScrollRef}
            onMouseEnter={() => setIsDocPaused(true)}
            onMouseLeave={() => setIsDocPaused(false)}
            onTouchStart={() => setIsDocPaused(true)}
            onTouchEnd={() => setIsDocPaused(false)}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory"
          >
            {specialistDoctors.map((doc) => (
              <div
                key={doc.id}
                className="flex-none w-[270px] sm:w-[285px] lg:w-[calc(25%-18px)] snap-start bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <Link
                    href={`/doctors/${doc.slug || doc.id}`}
                    className="block relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 mb-5"
                  >
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 block"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur-sm">
                      {doc.experience || "MD Dermatologist"}
                    </div>
                  </Link>

                  <Link href={`/doctors/${doc.slug || doc.id}`}>
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-serif">
                      {doc.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-brand-700 font-semibold mt-1">
                    {doc.role}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {doc.qualifications}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                    {doc.bio || doc.specialty}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/doctors/${doc.slug || doc.id}`}
                    className="flex-1 text-center py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => openAppointmentModal("General Dermatologist Consultation")}
                    className="flex-1 text-center py-2 px-2.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-700 hover:text-white transition-all cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── 5. ASSOCIATED PARTNERS ── */}
      <section className="py-10 lg:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Trusted Clinical Ecosystem</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Associated Healthcare &amp;{" "}
              <span className="text-brand-700">Technology Partners</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              We collaborate with world-leading diagnostic laboratories, US-FDA laser manufacturers, and medical financing institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ASSOCIATED_PARTNERS.map((partner, idx) => {
              const isOrangeHealth = partner.name
                .toLowerCase()
                .includes("orange");
              return (
                <div
                  key={idx}
                  className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                    isOrangeHealth
                      ? "bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-300 shadow-md sm:col-span-2"
                      : "bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-brand-300 hover:shadow-lg"
                  }`}
                >


                  <div className="space-y-2.5">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isOrangeHealth
                          ? "bg-orange-500 text-white"
                          : "bg-brand-50 text-brand-700 border border-brand-200"
                      }`}
                    >
                      {partner.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-serif">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {partner.type}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-brand-700">
                    <span>Authorized Clinical Partner</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
