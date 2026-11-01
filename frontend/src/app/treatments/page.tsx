"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  Clock,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Phone,
  Calendar,
  X,
  Play,
} from "lucide-react";
import {
  RICH_TREATMENTS,
  TREATMENT_CATEGORIES,
  BODY_AREA_TYPES,
  RichTreatment,
} from "@/data/treatmentsCatalog";
import { getTreatments } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

function TreatmentsListingContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All Treatments";
  const initialArea = searchParams.get("area") || "All Areas";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedArea, setSelectedArea] = useState<string>(initialArea);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [catalogTreatments, setCatalogTreatments] = useState<RichTreatment[]>(RICH_TREATMENTS);

  const availableCategories = useMemo(() => {
    const list: string[] = ["All Treatments"];
    const seen = new Set<string>();
    TREATMENT_CATEGORIES.forEach((c) => {
      if (c !== "All Treatments") {
        seen.add(c);
        list.push(c);
      }
    });
    catalogTreatments.forEach((t) => {
      if (t.category && !seen.has(t.category)) {
        seen.add(t.category);
        list.push(t.category);
      }
    });
    return list;
  }, [catalogTreatments]);

  useEffect(() => {
    let isMounted = true;
    getTreatments().then((data) => {
      if (isMounted && data && data.length > 0) {
        setCatalogTreatments(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const { items, addItem, updateQuantity, openCart, cartCount } = useCart();
  const { openAppointmentModal, openEmiModal } = useAuth();

  useEffect(() => {
    const catParam = searchParams.get("category");
    const areaParam = searchParams.get("area");
    if (catParam && (TREATMENT_CATEGORIES.includes(catParam as any) || availableCategories.includes(catParam))) {
      setSelectedCategory(catParam);
    } else if (!catParam) {
      setSelectedCategory("All Treatments");
    }
    if (areaParam && BODY_AREA_TYPES.includes(areaParam as any)) {
      setSelectedArea(areaParam);
    } else if (!areaParam) {
      setSelectedArea("All Areas");
    }
  }, [searchParams, availableCategories]);

  const filteredTreatments = useMemo(() => {
    let list = [...catalogTreatments];

    if (selectedCategory !== "All Treatments") {
      list = list.filter((t) => t.category === selectedCategory);
    }

    if (selectedArea !== "All Areas") {
      list = list.filter((t) => t.bodyArea === selectedArea);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.bodyArea.toLowerCase().includes(q) ||
          t.shortDesc.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [selectedCategory, selectedArea, searchQuery, sortBy]);

  const getCartQuantity = (id: string) => {
    const found = items.find((i) => i.id === id);
    return found ? found.quantity : 0;
  };

  const handleAddToCart = (treatment: RichTreatment) => {
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

  const clearFilters = () => {
    setSelectedCategory("All Treatments");
    setSelectedArea("All Areas");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] pb-20">
      {/* Top Breadcrumb & Luxury Header Strip */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-[#008081] font-medium transition-colors">
              home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href="/treatments"
              onClick={clearFilters}
              className={`hover:text-[#008081] transition-colors ${
                selectedCategory === "All Treatments"
                  ? "text-slate-900 font-semibold"
                  : "font-medium"
              }`}
            >
              treatments
            </Link>
            {selectedCategory !== "All Treatments" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-900 font-semibold lowercase">
                  {selectedCategory}
                </span>
              </>
            )}
          </nav>

          {/* Title & Search / Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f6f3] border border-[#d2eee7] text-[#006d6e] text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% US-FDA Approved Protocols • Senior MD Dermatologists</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                {selectedCategory === "All Treatments"
                  ? "All Clinical Dermatology & Laser Treatments"
                  : selectedCategory}
              </h1>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laser, hydrafacial, acne..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-xs text-slate-800 outline-none focus:border-[#008081] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort treatments"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-[#008081]"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated (4.9★)</option>
              </select>

              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Sidebar Filters + Right 2-Column Treatment Cards */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* LEFT SIDEBAR: Results Count, Body Area Types & Category Filters (Like Image 2) */}
          <aside
            className={`lg:col-span-3 xl:col-span-2.5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm lg:sticky lg:top-24 space-y-6 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            {/* Results Count & Reset */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <span className="text-sm font-extrabold text-slate-900">
                {filteredTreatments.length}{" "}
                {filteredTreatments.length === 1 ? "Result" : "Results"}
              </span>
              {(selectedCategory !== "All Treatments" ||
                selectedArea !== "All Areas" ||
                searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-bold text-[#008081] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Body Area / Types Radio Filter (Exactly like Image 2 "Types: Full Body, Arms, Legs, Face, Back, Chest...") */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Types / Body Zone
              </h3>
              <div className="space-y-2">
                {BODY_AREA_TYPES.map((area) => {
                  const isSelected = selectedArea === area;
                  const count =
                    area === "All Areas"
                      ? RICH_TREATMENTS.length
                      : RICH_TREATMENTS.filter((t) => t.bodyArea === area).length;
                  return (
                    <label
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                        isSelected
                          ? "bg-[#e8f6f3] text-[#006d6e] font-bold"
                          : "text-slate-600 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-[#008081] bg-[#008081]"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span>{area}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Clinical Category Filter */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Clinical Category
              </h3>
              <div className="space-y-1.5">
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-slate-900 text-white font-bold shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Doctor Help Card inside Sidebar */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#eef8f5] to-white border border-[#d2eee7] space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#008081] block">
                Need Expert Advice?
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                Not sure which protocol suits your skin tone?
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Consult our senior MD Dermatologists in Noida &amp; Gurgaon.
              </p>
              <button
                onClick={openAppointmentModal}
                className="w-full py-2 px-3 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-[11px] font-bold transition-all shadow-sm"
              >
                Free Doctor Guidance →
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN GRID: 2-Column Horizontal Cards (Like Image 2 + Prices + Add to Cart) */}
          <div className="lg:col-span-9 space-y-6">
            {filteredTreatments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <p className="text-base font-bold text-slate-800">
                  No treatments matched your current filter selection.
                </p>
                <p className="text-xs text-slate-500">
                  Try clearing your filters or searching for another skin or hair concern.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#008081] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Show All Treatments
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {filteredTreatments.map((treatment) => {
                  const qtyInCart = getCartQuantity(treatment.id);

                  return (
                    <div
                      key={treatment.id}
                      className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#008081]/60 shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-6 flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-5 group"
                    >
                      {/* LEFT SIDE OF CARD: Title, Rating/Duration, Price/EMI, Bullet Points, VIEW DETAILS button */}
                      <div className="flex-1 flex flex-col justify-between space-y-3.5">
                        <div className="space-y-2">
                          {/* Top Tag Badge */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#e8f6f3] text-[#006d6e] border border-[#d2eee7]">
                              {treatment.category}
                            </span>
                            {treatment.tags[0] && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {treatment.tags[0]}
                              </span>
                            )}
                          </div>

                          {/* Treatment Title */}
                          <Link
                            href={`/${treatment.slug}`}
                            className="block text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#008081] transition-colors font-serif leading-snug"
                          >
                            {treatment.name}
                          </Link>

                          {/* Rating & Duration Row (Like Image 2: "4.89 ★ | ⏱ 45 mins") */}
                          <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                            <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                              <span>{treatment.rating.toFixed(2)}</span>
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-[11px] text-slate-400 font-normal">
                                ({treatment.reviewsCount})
                              </span>
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{treatment.duration}</span>
                            </span>
                          </div>

                          {/* Price & 0% EMI Strip — Cleanly Aligned on Desktop & Mobile */}
                          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                                Starts from
                              </span>
                              <div className="flex items-center flex-wrap gap-2">
                                <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
                                  {treatment.priceFormatted}
                                </span>
                                <span className="text-xs text-slate-400 line-through leading-none">
                                  {treatment.originalPriceFormatted}
                                </span>
                                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md leading-none">
                                  {treatment.discountBadge}
                                </span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#006d6e] bg-[#e8f6f3] border border-[#d2eee7] px-2.5 py-1 rounded-md leading-none">
                                <CreditCard className="w-3 h-3 shrink-0" />
                                <span>EMI: {treatment.emiMonthly}/mo</span>
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  openEmiModal({
                                    treatmentName: treatment.name,
                                    priceFormatted: treatment.priceFormatted,
                                    emiMonthly: `${treatment.emiMonthly}/mo (${treatment.emiMonths} months)`,
                                  })
                                }
                                className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#008081] hover:text-slate-900 underline underline-offset-2 transition-colors cursor-pointer"
                              >
                                <span>Apply for EMI</span>
                              </button>
                            </div>
                          </div>

                          {/* Concise Clinical Highlights */}
                          <ul className="space-y-1 text-xs text-slate-600 pt-0.5">
                            {treatment.cardHighlights.map((pt, i) => (
                              <li key={i} className="leading-relaxed line-clamp-2">
                                • {pt}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Bottom Action: VIEW DETAILS button (Exactly like Image 2) */}
                        <div className="pt-2 flex items-center gap-2.5">
                          <Link
                            href={`/${treatment.slug}`}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-900 text-slate-800 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all"
                          >
                            VIEW DETAILS
                          </Link>
                        </div>
                      </div>

                      {/* RIGHT SIDE OF CARD: Square Thumbnail Image + Overlapping ADD / Quantity Button (Like Image 2) */}
                      <div className="relative w-full sm:w-36 md:w-40 shrink-0 flex flex-col items-center pb-3">
                        <Link
                          href={`/${treatment.slug}`}
                          className="relative w-full h-44 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm block"
                        >
                          <Image
                            src={treatment.bannerImage}
                            alt={treatment.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                          {treatment.youtubeVideoId && (
                            <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
                              <Play className="w-2.5 h-2.5 fill-current text-red-500" />
                              <span>Video</span>
                            </span>
                          )}
                        </Link>

                        {/* Overlapping ADD / Quantity Control Button at Bottom Center of Image */}
                        <div className="-mt-4 z-10">
                          {qtyInCart === 0 ? (
                            <button
                              onClick={() => handleAddToCart(treatment)}
                              className="px-6 py-2 rounded-lg bg-slate-950 hover:bg-[#008081] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 border border-white/20"
                            >
                              <span>ADD</span>
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#008081] text-white shadow-lg border border-white/20">
                              <button
                                onClick={() => updateQuantity(treatment.id, qtyInCart - 1)}
                                className="w-5 h-5 rounded bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-extrabold min-w-[16px] text-center">
                                {qtyInCart}
                              </span>
                              <button
                                onClick={() => updateQuantity(treatment.id, qtyInCart + 1)}
                                className="w-5 h-5 rounded bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Consultation Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#093b3c] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  Customized Multi-Session Packages
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold font-serif">
                  Not sure which treatment or package is right for your skin?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Schedule a personalized dermoscopy consultation with Dr. Ipshita Johri &amp; our senior MD Dermatologists at Noida (Sector 36) or Gurgaon (Golf Course Road).
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={openAppointmentModal}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#008081] hover:bg-teal-500 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>
                <a
                  href="tel:+919871941444"
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-teal-300" />
                  <span>+91 98719 41444</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Bar at Bottom if Cart has items */}
      {cartCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl">
          <div className="bg-slate-950 text-white rounded-2xl px-5 py-3.5 shadow-2xl border border-teal-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#008081] text-white flex items-center justify-center font-extrabold text-xs">
                {cartCount}
              </div>
              <div>
                <span className="text-xs font-bold block">
                  {cartCount} {cartCount === 1 ? "Treatment" : "Treatments"} in Clinical Cart
                </span>
                <span className="text-[11px] text-teal-300">
                  0% Interest EMI &amp; Package Discounts Available
                </span>
              </div>
            </div>

            <button
              onClick={openCart}
              className="px-4 py-2 rounded-xl bg-[#008081] hover:bg-teal-500 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>View Cart</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TreatmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-600">
          Loading clinical treatments...
        </div>
      }
    >
      <TreatmentsListingContent />
    </Suspense>
  );
}
