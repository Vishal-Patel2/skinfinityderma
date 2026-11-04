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
  CheckCircle2,
  ShoppingCart,
  CreditCard,
  Plus,
  Minus,
  ArrowRight,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import {
  RICH_TREATMENTS,
  TREATMENT_CATEGORIES,
  BODY_AREA_TYPES,
  RichTreatment,
} from "@/data/treatmentsCatalog";
import { getTreatments, getCategories } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";

function TreatmentsListingContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialArea = searchParams.get("area") || "All Areas";

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory === "All Treatments" ? "All" : initialCategory
  );
  const [selectedArea, setSelectedArea] = useState<string>(initialArea);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");
  const [catalogTreatments, setCatalogTreatments] = useState<RichTreatment[]>(RICH_TREATMENTS);
  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { items, addItem, updateQuantity, openCart } = useCart();
  const { openAppointmentModal, openEmiModal } = useAuth();

  // Dynamic fetch of all 58 treatments & categories from API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    Promise.all([getTreatments(), getCategories()])
      .then(([treatmentsData, categoriesData]) => {
        if (!isMounted) return;
        if (treatmentsData && treatmentsData.length > 0) {
          setCatalogTreatments(treatmentsData);
        }
        if (categoriesData && categoriesData.length > 0) {
          setApiCategories(categoriesData.map((c) => c.name));
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync category param from URL
  useEffect(() => {
    const catParam = searchParams.get("category");
    const areaParam = searchParams.get("area");
    if (catParam) {
      setSelectedCategory(catParam === "All Treatments" ? "All" : catParam);
    }
    if (areaParam && BODY_AREA_TYPES.includes(areaParam as any)) {
      setSelectedArea(areaParam);
    }
  }, [searchParams]);

  // Dynamic available categories list
  const availableCategories = useMemo(() => {
    const list: string[] = ["All"];
    const seen = new Set<string>(["All", "All Treatments"]);

    apiCategories.forEach((c) => {
      if (c && !seen.has(c)) {
        seen.add(c);
        list.push(c);
      }
    });

    TREATMENT_CATEGORIES.forEach((c) => {
      if (c && !seen.has(c)) {
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
  }, [apiCategories, catalogTreatments]);

  // Filtered and sorted treatments
  const filteredTreatments = useMemo(() => {
    let list = [...catalogTreatments];

    if (selectedCategory !== "All" && selectedCategory !== "All Treatments") {
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
          (t.bodyArea && t.bodyArea.toLowerCase().includes(q)) ||
          (t.shortDesc && t.shortDesc.toLowerCase().includes(q)) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
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
  }, [catalogTreatments, selectedCategory, selectedArea, searchQuery, sortBy]);

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
    setSelectedCategory("All");
    setSelectedArea("All Areas");
    setSearchQuery("");
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-[#f8fafb] pb-24">
      {/* 1. DISTINCT CLINICAL BREADCRUMB BANNER */}
      <PageBreadcrumbBanner
        image="/images/breadcrumbbanner/treatments.png"
        breadcrumbs={[
          { label: "Treatments", href: "/treatments" },
          ...(selectedCategory !== "All"
            ? [{ label: selectedCategory }]
            : []),
        ]}
        badge="58+ US-FDA Approved Protocols"
        title="Clinical Dermatology & Aesthetic Treatments"
        highlight="by Dr. Ipshita Johri"
        subtitle="Doctor-supervised laser hair reduction, medi-facials, acne scar remodeling & hair regrowth in Noida & Gurgaon"
        asHeading="h1"
      />

      {/* 2. CATEGORY PILL TABS + SEARCH & FILTER CONTROLS */}
      <section className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 space-y-3.5">
          {/* Top Bar: Search, Zone Filter, Sort & Count */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laser, hydrafacial, acne, pigmentation..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-800 outline-none focus:border-[#008081] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls Right: Body Zone & Sort */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
              {/* Body Zone Dropdown */}
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                aria-label="Filter by body zone"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-[#008081]"
              >
                {BODY_AREA_TYPES.map((area) => (
                  <option key={area} value={area}>
                    {area === "All Areas" ? "All Zones" : `${area} Zone`}
                  </option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort treatments"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:border-[#008081]"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated (4.9★)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {(selectedCategory !== "All" || selectedArea !== "All Areas" || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-[#008081] hover:underline px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs: Exact Luxury Pill Carousel (Horizontal swipe on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pt-1 pb-1">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#008081] text-white shadow-sm ring-2 ring-[#008081]/25"
                      : "bg-[#f1f5f7] hover:bg-slate-200/80 text-slate-700"
                  }`}
                >
                  {cat === "All" ? "All" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 58 TREATMENTS VERTICAL CARD GRID (Exact Image 2 Luxury Design) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Results Counter Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 font-serif">
              {selectedCategory === "All"
                ? "All Clinical Treatments"
                : selectedCategory}
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {filteredTreatments.length} procedures
            </span>
          </div>

          <p className="text-xs text-slate-500 hidden sm:block">
            Doctor-supervised protocols with 0% EMI available
          </p>
        </div>

        {/* Empty State */}
        {filteredTreatments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <p className="text-base font-bold text-slate-800">
              No clinical treatments found matching your filter.
            </p>
            <p className="text-xs text-slate-500">
              Try searching for another concern or reset filters to view all 58 treatments.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-xl bg-[#008081] hover:bg-[#006d6e] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Show All 58 Treatments
            </button>
          </div>
        ) : (
          /* Responsive 4-Column Vertical Grid (Image 2 style) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTreatments.map((treatment) => {
              const qtyInCart = getCartQuantity(treatment.id);
              const highlights =
                treatment.cardHighlights && treatment.cardHighlights.length > 0
                  ? treatment.cardHighlights.slice(0, 3)
                  : [
                      "US-FDA approved clinical protocol tailored by senior MD dermatologists.",
                      "Zero downtime or minimal recovery with long-lasting aesthetic outcomes.",
                      "Safe for Indian skin tones with personalized pre-and-post care guidance.",
                    ];

              return (
                <div
                  key={treatment.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#008081]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none"
                >
                  {/* TOP: Image with Badges Overlays */}
                  <div>
                    <Link
                      href={`/${treatment.slug}`}
                      className="relative aspect-[4/3] w-full block overflow-hidden bg-slate-100"
                    >
                      <Image
                        src={treatment.bannerImage || "/images/default-treatment.jpg"}
                        alt={treatment.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

                      {/* Top Badges: US-FDA Approved (Left) & Rating (Right) */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                          US-FDA APPROVED
                        </span>
                        <span className="bg-slate-950/80 backdrop-blur-sm text-amber-400 text-xs font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-white/10">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{treatment.rating ? treatment.rating.toFixed(2) : "4.92"}</span>
                        </span>
                      </div>

                      {/* Bottom Overlays: Duration (Left) & Zero Downtime (Right) */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
                        <span className="bg-slate-950/70 backdrop-blur-sm text-[11px] font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border border-white/10">
                          <Clock className="w-3 h-3 text-teal-300" />
                          <span>{treatment.duration || "45 mins"}</span>
                        </span>
                        <span className="bg-[#008081]/90 backdrop-blur-sm text-[11px] font-bold px-2.5 py-0.5 rounded-md text-white shadow-xs">
                          Zero Downtime
                        </span>
                      </div>
                    </Link>

                    {/* Content Section */}
                    <div className="p-5 pb-3 space-y-3">
                      {/* Category Pill & Apply for EMI Link */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#006d6e] bg-[#e8f6f3] px-2.5 py-0.5 rounded-full border border-[#d2eee7]">
                          {treatment.category}
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
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006d6e] hover:text-slate-900 underline transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Apply for EMI</span>
                        </button>
                      </div>

                      {/* Treatment Title */}
                      <Link href={`/${treatment.slug}`} className="block">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#008081] transition-colors line-clamp-1 font-serif">
                          {treatment.name}
                        </h2>
                      </Link>

                      {/* 3 Tickmark Clinical Points */}
                      <ul className="space-y-1.5 pt-1">
                        {highlights.map((pt, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-600 leading-snug"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#008081] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* BOTTOM: Pricing & Action Buttons (ADD + Details) */}
                  <div className="px-5 pb-5 pt-2">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                          STARTING FROM
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold text-slate-900 font-serif">
                            {treatment.priceFormatted}
                          </span>
                          <span className="text-[10px] text-slate-500">per session</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* ADD / Quantity Button */}
                        {qtyInCart === 0 ? (
                          <button
                            onClick={() => handleAddToCart(treatment)}
                            className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-[#008081] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                            aria-label={`Add ${treatment.name} to cart`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>ADD</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-[#008081] text-white text-xs font-bold shadow-sm">
                            <button
                              onClick={() => updateQuantity(treatment.id, qtyInCart - 1)}
                              className="w-5 h-5 rounded bg-white/20 flex items-center justify-center font-bold"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-1 min-w-[14px] text-center">{qtyInCart}</span>
                            <button
                              onClick={() => updateQuantity(treatment.id, qtyInCart + 1)}
                              className="w-5 h-5 rounded bg-white/20 flex items-center justify-center font-bold"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        )}

                        {/* Details Button */}
                        <Link
                          href={`/${treatment.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-[#008081] bg-[#e8f6f3] hover:bg-[#008081] hover:text-white border border-[#d2eee7] transition-all"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function TreatmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafb] flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#008081] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Loading 58+ Clinical Protocols...
            </p>
          </div>
        </div>
      }
    >
      <TreatmentsListingContent />
    </Suspense>
  );
}
