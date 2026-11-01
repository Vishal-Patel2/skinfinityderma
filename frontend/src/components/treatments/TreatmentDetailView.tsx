"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  Clock,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Calendar,
  Phone,
  CreditCard,
  ShoppingCart,
  Stethoscope,
  MessageCircle,
  Quote,
  MapPin
} from "lucide-react";
import { RichTreatment, RICH_TREATMENTS } from "@/data/treatmentsCatalog";
import { TESTIMONIALS } from "@/data/clinicData";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AppointmentForm from "@/components/modals/AppointmentForm";

interface Props {
  treatment: RichTreatment;
}

export default function TreatmentDetailView({ treatment }: Props) {
  const { items, addItem, updateQuantity, openCart } = useCart();
  const { openAppointmentModal, openEmiModal, adminSettings } = useAuth();

  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const stepsScrollRef = useRef<HTMLDivElement>(null);

  const isLaserTreatment =
    treatment.category === "Laser Hair Reduction" ||
    treatment.category === "Pigmentation & Lasers" ||
    treatment.name.toLowerCase().includes("laser");

  const isNoida = treatment.slug?.toLowerCase().includes("noida") || treatment.name?.toLowerCase().includes("noida");
  const isGurgaon = treatment.slug?.toLowerCase().includes("gurgaon") || treatment.name?.toLowerCase().includes("gurgaon");
  const cityLocation = isGurgaon ? "Gurgaon" : (isNoida ? "Noida" : null);

  const whatsappMessage = encodeURIComponent(
    `Hello Skinfinity Derma, I would like to enquire about ${treatment.name} (Starting at ${treatment.priceFormatted}) and schedule a consultation.`
  );
  const whatsappUrl = `https://wa.me/919871941444?text=${whatsappMessage}`;

  // Ensure pure clinical images for the hero gallery strip below the main image (excluding YouTube video thumbnails)
  const galleryList = React.useMemo(() => {
    const raw = Array.isArray(treatment.galleryImages) ? treatment.galleryImages : [];
    // Filter out YouTube thumbnails or external video links
    const base = raw
      .filter((img) => img && img.src && !img.src.includes("img.youtube.com") && !img.src.includes("youtube") && !img.src.includes("youtu.be"))
      .map((img) => ({ src: img.src, caption: img.caption || treatment.name }));

    // Ensure bannerImage is first if not already present
    if (treatment.bannerImage && !base.some((b) => b.src === treatment.bannerImage)) {
      base.unshift({ src: treatment.bannerImage, caption: treatment.name });
    }

    // Add sub-images from DB columns (subImage1, subImage2, subImage3)
    const extraSubs = [
      (treatment as any).subImage1,
      (treatment as any).subImage2,
      (treatment as any).subImage3,
    ].filter(Boolean);
    for (const sub of extraSubs) {
      if (!base.some((b) => b.src === sub)) {
        base.push({ src: sub, caption: `${treatment.name} Clinical View` });
      }
    }

    // If still less than 4, include step images
    if (base.length < 4 && Array.isArray(treatment.howItWorksSteps)) {
      for (const step of treatment.howItWorksSteps) {
        if (base.length >= 5) break;
        if (step.image && !base.some((img) => img.src === step.image)) {
          base.push({ src: step.image, caption: `${step.stepNumber}: ${step.title}` });
        }
      }
    }

    // Fallback if empty
    if (base.length === 0) {
      base.push({ src: treatment.bannerImage || "/images/default-treatment.jpg", caption: treatment.name });
    }

    return base;
  }, [treatment]);

  const cartItem = items.find((i) => i.id === treatment.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addItem({
      id: treatment.id,
      name: treatment.name,
      slug: treatment.slug,
      price: treatment.price,
      priceFormatted: treatment.priceFormatted,
      sessions: treatment.sessionsInfo,
      category: treatment.category,
      image: treatment.bannerImage,
    });
  };

  const nextGallerySlide = () => {
    setActiveSlide((prev) => (prev + 1) % galleryList.length);
  };

  const prevGallerySlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + galleryList.length) % galleryList.length
    );
  };

  const scrollSteps = (dir: "left" | "right") => {
    if (!stepsScrollRef.current) return;
    stepsScrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const relatedTreatments = RICH_TREATMENTS.filter(
    (t) => t.id !== treatment.id && t.category === treatment.category
  ).slice(0, 4);

  const fallbackRelated =
    relatedTreatments.length >= 3
      ? relatedTreatments
      : RICH_TREATMENTS.filter((t) => t.id !== treatment.id).slice(0, 4);

  const customerReviews = TESTIMONIALS.slice(0, 3);

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* 1. TOP BREADCRUMB & HERO OVERVIEW SECTION */}
      <section className="pt-5 pb-10 sm:py-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5 flex-wrap">
            <Link href="/" className="hover:text-[#008081] transition-colors">
              home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href={`/treatments?category=${encodeURIComponent(treatment.category)}`}
              className="hover:text-[#008081] transition-colors lowercase"
            >
              {treatment.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold lowercase">
              {treatment.name}
            </span>
          </nav>

          {/* Split Top Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT: Main Image + Sub-Images Thumbnail Row */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md group select-none">
                {galleryList.map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      activeSlide === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.caption || treatment.name}
                      fill
                      priority={idx === 0}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    <div className="absolute top-4 left-4 right-4 z-20">
                      <span className="inline-block bg-black/55 backdrop-blur-md text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-white/15">
                        {img.caption}
                      </span>
                    </div>
                  </div>
                ))}

                {galleryList.length > 1 && (
                  <>
                    <button
                      onClick={prevGallerySlide}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-900 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextGallerySlide}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-900 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                  {galleryList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`rounded-full transition-all ${
                        activeSlide === i
                          ? "w-5 h-2 bg-white"
                          : "w-2 h-2 bg-white/55 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Sub-Images Row Directly Below Main Image (Responsive grid for 2-6 images) */}
              {galleryList.length > 1 && (
                <div className={`grid gap-2 sm:gap-2.5 ${
                  galleryList.length === 2 ? "grid-cols-2" :
                  galleryList.length === 3 ? "grid-cols-3" :
                  galleryList.length === 5 ? "grid-cols-5" :
                  galleryList.length >= 6 ? "grid-cols-6" : "grid-cols-4"
                }`}>
                  {galleryList.map((img, idx) => {
                    const isSelected = activeSlide === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-[#008081] ring-2 ring-[#008081]/20 opacity-100 shadow-sm"
                            : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
                        }`}
                      >
                        <Image
                          src={img.src}
                          alt={img.caption || `${treatment.name} view ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT: Tags, Title, Rating/Duration, Price + EMI + ADD Box, Consultation CTAs & WhatsApp */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                {cityLocation && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-teal-50 text-teal-850 border border-teal-300 inline-flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-teal-600" />
                    <span>{cityLocation} Clinic</span>
                  </span>
                )}
                {treatment.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#e8f6f3] text-[#006d6e] border border-[#d2eee7]">
                  {treatment.bodyArea} Zone
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-tight">
                  {treatment.name}
                </h1>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900">
                      {treatment.rating.toFixed(2)}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      ({treatment.reviewsCount} reviews)
                    </span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{treatment.duration}</span>
                  </div>
                </div>
              </div>

              {/* PRICING, EMI & ADD TO CART BOX */}
              <div className="bg-[#f3f4f6] rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Starts from
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {treatment.priceFormatted}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        {treatment.originalPriceFormatted}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                        {treatment.discountBadge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {treatment.sessionsInfo}
                    </span>
                  </div>

                  {/* Inner White EMI Option Card with "Apply for EMI" button */}
                  <div className="relative bg-white rounded-xl p-3 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3 max-w-md">
                    <span className="absolute -top-2.5 left-3 bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded">
                      EMI Option
                    </span>
                    <div className="pt-1">
                      <div className="text-xs font-bold text-slate-900">
                        or{" "}
                        <span className="text-emerald-700 font-extrabold">
                          {treatment.emiMonthly}
                        </span>{" "}
                        /month ({treatment.emiMonths} months)
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-amber-600" />
                        <span>Flexible EMI options available via clinic desk</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openEmiModal({
                          treatmentName: treatment.name,
                          priceFormatted: treatment.priceFormatted,
                          emiMonthly: `${treatment.emiMonthly}/mo (${treatment.emiMonths} months)`,
                        })
                      }
                      className="px-3.5 py-2 rounded-lg bg-slate-950 hover:bg-[#008081] text-white text-[10px] font-extrabold uppercase tracking-wider shrink-0 transition-colors"
                    >
                      Apply for EMI
                    </button>
                  </div>
                </div>

                {/* Right Side ADD / Quantity Button */}
                <div className="shrink-0 flex sm:flex-col items-center justify-end gap-2">
                  {qtyInCart === 0 ? (
                    <button
                      onClick={handleAddToCart}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-950 hover:bg-[#008081] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>ADD</span>
                      <Plus className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#008081] text-white shadow-md">
                        <button
                          onClick={() => updateQuantity(treatment.id, qtyInCart - 1)}
                          className="w-6 h-6 rounded bg-white/15 hover:bg-white/25 flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-extrabold min-w-[20px] text-center">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => updateQuantity(treatment.id, qtyInCart + 1)}
                          className="w-6 h-6 rounded bg-white/15 hover:bg-white/25 flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={openCart}
                        className="text-[11px] font-bold text-[#008081] hover:underline flex items-center gap-1"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>View Cart</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation CTA + Quick-Connect WhatsApp Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={openAppointmentModal}
                  className="py-3.5 px-5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isLaserTreatment ? "Get a Free Consultation" : "Appointment Request"}
                  </span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Quick Connect on WhatsApp</span>
                </a>
              </div>

              {/* "<Treatment Name> Explained" Block */}
              <div className="pt-2 space-y-1.5">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {treatment.name} Explained
                </h2>
                <p className="text-xs sm:text-sm italic text-slate-500 font-medium">
                  {treatment.explainedSubtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {treatment.fullDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "How <Treatment> works?" 5-Step Visual Cards Section */}
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-8 border border-slate-200/80 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  How {treatment.name} works?
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  5-step dermatologist-calibrated clinical protocol
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollSteps("left")}
                  aria-label="Scroll steps left"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#008081] text-slate-700 hover:text-white border border-slate-200 shadow-sm flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollSteps("right")}
                  aria-label="Scroll steps right"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#008081] text-slate-700 hover:text-white border border-slate-200 shadow-sm flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={stepsScrollRef}
              className="grid grid-flow-col auto-cols-[240px] sm:auto-cols-[250px] lg:grid-cols-5 gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
            >
              {treatment.howItWorksSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col justify-between text-center hover:border-[#008081]/50 transition-all"
                >
                  <div>
                    <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-slate-100 mb-3.5">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                      {step.stepNumber}
                    </div>
                    <div className="text-xs font-bold text-[#008081] mt-0.5">
                      {step.title}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Clinical Video Demonstration & Protocol Overview */}
      {(treatment.youtubeVideoId || treatment.videoUrl) && (
        <section className="py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#f8fafc] rounded-3xl p-5 sm:p-8 border border-slate-200/80">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200/60 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Doctor Procedure Video
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                    Watch {treatment.name} in Action
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Authentic clinical procedure demonstration & expert guidance by Dr. Ipshita Johri
                  </p>
                </div>
                {treatment.videoUrl && (
                  <a
                    href={treatment.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#008081] hover:text-[#006d6e] hover:underline"
                  >
                    <span>Watch on YouTube</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-950 aspect-video max-w-4xl mx-auto">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${treatment.youtubeVideoId || (treatment.videoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/)?.[1])}?rel=0&modestbranding=1`}
                  title={`${treatment.name} Clinical Demonstration`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. IDEAL FREQUENCY, IDEAL FOR / NOT IDEAL FOR & DOCTOR CONSULTATION CARD */}
      <section className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-8 border border-slate-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                  <div className="bg-[#d6d8db] text-slate-900 font-bold text-xs sm:text-sm py-2 px-4 rounded-lg text-center mb-3.5">
                    Ideal frequency
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 text-center font-medium leading-relaxed px-2">
                    {treatment.idealFrequency}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                    <div className="bg-[#d9f99d] text-slate-900 font-extrabold text-xs sm:text-sm py-2 px-3.5 rounded-lg mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-lime-800 shrink-0" />
                      <span>Ideal for</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {treatment.idealFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                    <div className="bg-[#fecdd3] text-slate-900 font-extrabold text-xs sm:text-sm py-2 px-3.5 rounded-lg mb-4 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-800 shrink-0" />
                      <span>Not Ideal for</span>
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {treatment.notIdealFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 shrink-0" />
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Consultation Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center space-y-5">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Not sure which treatment is right for YOU?
                </h3>

                <div className="relative w-44 h-44 rounded-3xl bg-gradient-to-br from-[#e8f6f3] via-teal-50 to-amber-50 border border-[#d2eee7] flex flex-col items-center justify-center p-4 shadow-inner">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-2">
                    <img
                      src="/images/doctors/dr-ipshita-johri.webp"
                      alt="Dr. Ipshita Johri — Senior Dermatologist"
                      className="w-full h-full object-cover block"
                    />
                  </div>
                  <span className="text-[11px] font-extrabold text-[#006d6e] flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5" />
                    By Our Team of Dermatologists
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Noida &amp; Gurgaon Clinics
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
                  Schedule a personalized consultation with one of our expert MD Dermatologists to design a clinical plan tailored to your skin or hair goals.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
                  <button
                    onClick={openAppointmentModal}
                    className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-[#008081] text-white text-xs font-extrabold transition-all shadow-sm"
                  >
                    {isLaserTreatment ? "Get a Free Consultation" : "Appointment Request"}
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Clinic</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEFORE TREATMENT & AFTER TREATMENT CARE SECTION */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f3f4f6] rounded-3xl p-5 sm:p-8 border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3.5">
                  Before Treatment
                </h3>
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm h-[calc(100%-2.5rem)]">
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                    {treatment.beforeTreatment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-2 shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3.5">
                  After Treatment
                </h3>
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm h-[calc(100%-2.5rem)]">
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                    {treatment.afterTreatment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-2 shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHAT OUR SATISFIED CUSTOMERS HAVE TO SAY */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#006d6e] bg-[#e8f6f3] px-3 py-1 rounded-full border border-[#d2eee7]">
                Verified Patient Experiences
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif mt-2">
                What Our Satisfied Customers Have to Say
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>{adminSettings.googleRating}/5 Rating</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#008081]">{adminSettings.googleReviewsCount} Google Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {customerReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-slate-200" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{rev.patientName}</div>
                    <div className="text-[11px] text-slate-500">{rev.clinicLocation} • {rev.treatment}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-5">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {treatment.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#f3f4f6] border border-slate-200/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-200/60 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <span className="text-slate-700 shrink-0">
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-200/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. RELATED TREATMENTS WITH PRICES & ADD TO CART */}
      <section className="py-10 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-serif">
                Similar Clinical Treatments
              </h3>
              <p className="text-xs text-slate-500">
                Compare packages &amp; combine procedures for faster results
              </p>
            </div>
            <Link
              href="/treatments"
              className="text-xs font-bold text-[#008081] hover:underline"
            >
              View All Treatments →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fallbackRelated.map((rel) => {
              const relQty = items.find((i) => i.id === rel.id)?.quantity || 0;
              return (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006d6e] bg-[#e8f6f3] px-2 py-0.5 rounded">
                      {rel.category}
                    </span>
                    <Link
                      href={`/${rel.slug}`}
                      className="block text-sm sm:text-base font-extrabold text-slate-900 hover:text-[#008081] font-serif"
                    >
                      {rel.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="font-bold text-slate-900">
                        {rel.priceFormatted}
                      </span>
                      <span className="line-through text-[11px]">
                        {rel.originalPriceFormatted}
                      </span>
                      <span className="text-emerald-700 font-bold text-[10px]">
                        {rel.discountBadge}
                      </span>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() =>
                          openEmiModal({
                            treatmentName: rel.name,
                            priceFormatted: rel.priceFormatted,
                            emiMonthly: `${rel.emiMonthly}/mo`,
                          })
                        }
                        className="text-[11px] font-bold text-[#008081] underline"
                      >
                        Apply for EMI
                      </button>
                    </div>
                    <div className="pt-1">
                      <Link
                        href={`/${rel.slug}`}
                        className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:text-[#008081] underline"
                      >
                        VIEW DETAILS
                      </Link>
                    </div>
                  </div>

                  <div className="relative w-28 shrink-0 flex flex-col items-center">
                    <div className="relative w-28 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <Image
                        src={rel.bannerImage}
                        alt={rel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={() =>
                        addItem({
                          id: rel.id,
                          name: rel.name,
                          slug: rel.slug,
                          price: rel.price,
                          priceFormatted: rel.priceFormatted,
                          sessions: rel.sessionsInfo,
                          category: rel.category,
                          image: rel.bannerImage,
                        })
                      }
                      className="-mt-3 z-10 px-4 py-1 rounded-md bg-slate-950 hover:bg-[#008081] text-white text-[10px] font-extrabold uppercase tracking-wider shadow"
                    >
                      {relQty > 0 ? `ADDED (${relQty})` : "ADD +"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. APPOINTMENT BOOKING SECTION */}
      <section id="appointment_form" className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AppointmentForm initialTreatment={treatment.name} />
        </div>
      </section>
    </div>
  );
}
