"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Star,
  ShoppingCart,
  CreditCard
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function SkuCarouselSection() {
  const { addItem } = useCart();
  const { openEmiModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const categories = [
    "All",
    "Laser Treatments",
    "Skin Treatments",
    "Hair Treatments",
    "Medi-Facials & Glow",
    "Anti-Ageing & Aesthetics"
  ];

  // Clean clinical SKU list using real dermatology photography (no generic AI-looking icon overlays)
  const skuList = [
    {
      id: "sku-lhr",
      slug: "laser-hair-reduction-noida",
      name: "US-FDA Soprano Titanium Laser Hair Removal",
      category: "Laser Treatments",
      badge: "Most Popular",
      price: "₹1,999",
      priceSub: "per session",
      emiText: "₹333/mo",
      rating: 4.9,
      reviewsCount: 1420,
      image: "/images/treatments/banner-laser.webp",
      duration: "30-45 Mins",
      downtime: "Zero Downtime",
      highlights: [
        "Triple Wavelength 755+810+1064nm",
        "-4°C ICE Plus Painless Cooling",
        "Permanent Follicle Reduction"
      ]
    },
    {
      id: "sku-hydrafacial",
      slug: "sugarcane-hydrafacial-noida",
      name: "Signature Sugarcane HydraFacial MD",
      category: "Medi-Facials & Glow",
      badge: "Clinical Favorite",
      price: "₹3,499",
      priceSub: "6-step protocol",
      emiText: "₹583/mo",
      rating: 4.9,
      reviewsCount: 2180,
      image: "/images/treatments/banner-hydrafacial.webp",
      duration: "45 Mins",
      downtime: "Zero Downtime",
      highlights: [
        "Vortex Deep Blackhead Extraction",
        "Sugarcane Natural Glycolic Infusion",
        "Hyaluronic Acid Plumping"
      ]
    },
    {
      id: "sku-gfc-prp",
      slug: "hair-loss-prp-treatment-noida",
      name: "GFC & Autologous PRP Hair Restoration",
      category: "Hair Treatments",
      badge: "High Growth Rate",
      price: "₹4,999",
      priceSub: "per session",
      emiText: "₹833/mo",
      rating: 4.8,
      reviewsCount: 890,
      image: "/images/treatments/banner-hairloss.webp",
      duration: "45 Mins",
      downtime: "Mild Tender (24h)",
      highlights: [
        "High-Concentration Growth Factors",
        "Activates Dormant Hair Bulbs",
        "Reduces Excessive Shedding in 30 Days"
      ]
    },
    {
      id: "sku-acne-subcision",
      slug: "acne-pimple-treatment-noida",
      name: "Subcision + MNRF Acne Scar Remodeling",
      category: "Skin Treatments",
      badge: "Deep Scar Repair",
      price: "₹5,499",
      priceSub: "per session",
      emiText: "₹917/mo",
      rating: 4.9,
      reviewsCount: 1120,
      image: "/images/treatments/banner-acne.webp",
      duration: "60 Mins",
      downtime: "1-2 Days Minimal Redness",
      highlights: [
        "Releases Bound Fibrotic Scars",
        "Radiofrequency Collagen Stimulation",
        "Smooths Icepick & Rolling Depressions"
      ]
    },
    {
      id: "sku-pigment-laser",
      slug: "pigmentation-treatment-noida",
      name: "Q-Switched Nd:YAG Laser Melasma Toning",
      category: "Laser Treatments",
      badge: "Targeted Clearance",
      price: "₹3,999",
      priceSub: "per session",
      emiText: "₹667/mo",
      rating: 4.8,
      reviewsCount: 960,
      image: "/images/clinic/interior-4.jpg",
      duration: "30 Mins",
      downtime: "Zero Downtime",
      highlights: [
        "Photoacoustic Melanin Shattering",
        "Safe for Indian Fitz 3-5 Skin",
        "Brightens Melasma & Hyperpigmentation"
      ]
    },
    {
      id: "sku-antiaging-botox",
      slug: "anti-ageing-treatment-noida",
      name: "Botox & Dermal Fillers Contouring",
      category: "Anti-Ageing & Aesthetics",
      badge: "MD Dermatologist Led",
      price: "₹7,999",
      priceSub: "customized units",
      emiText: "₹1,333/mo",
      rating: 4.9,
      reviewsCount: 750,
      image: "/images/clinic/interior-2.jpg",
      duration: "30-45 Mins",
      downtime: "Zero Downtime",
      highlights: [
        "Allergan US-FDA Approved Products",
        "Softens Crow's Feet & Forehead Lines",
        "Restores Youthful Volume & Jawline"
      ]
    },
    {
      id: "sku-carbon-peel",
      slug: "carbon-laser-peel-noida",
      name: "Hollywood Carbon Laser Porcelain Facial",
      category: "Medi-Facials & Glow",
      badge: "Instant Matte Finish",
      price: "₹2,999",
      priceSub: "per session",
      emiText: "₹500/mo",
      rating: 4.8,
      reviewsCount: 620,
      image: "/images/clinic/interior-5.jpg",
      duration: "40 Mins",
      downtime: "Zero Downtime",
      highlights: [
        "Activated Carbon Slurry Vaporization",
        "Shrinks Enlarged Pores & Oiliness",
        "Instant Clarity for Parties & Weddings"
      ]
    },
    {
      id: "sku-chemical-peels",
      slug: "chemical-peel-noida",
      name: "Medical Chemical Peels (Salicylic & Yellow)",
      category: "Skin Treatments",
      badge: "Clear Skin Regimen",
      price: "₹1,999",
      priceSub: "per session",
      emiText: "₹333/mo",
      rating: 4.8,
      reviewsCount: 840,
      image: "/images/clinic/interior-1.jpg",
      duration: "30 Mins",
      downtime: "Mild Exfoliation (3 Days)",
      highlights: [
        "By Our Team of Dermatologists",
        "Exfoliates Dead Congested Epidermis",
        "Fades Post-Acne Dark Marks (PIH)"
      ]
    }
  ];

  const filteredSkus = activeCategory === "All"
    ? skuList
    : skuList.filter((item) => item.category === activeCategory);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: 340, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, filteredSkus.length]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 lg:py-14 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f6f3] border border-[#d2eee7] text-[#006d6e] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006d6e]" />
              <span>Evidence-Based Clinical Procedures</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif">
              Popular Clinical Procedures &amp; Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Transparent clinical packages, US-FDA approved technologies, and customized protocols By Our Team of Dermatologists.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/treatments"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e8f6f3] hover:bg-[#008081] text-[#006d6e] hover:text-white border border-[#d2eee7] text-xs font-extrabold transition-all mr-1"
            >
              <span>View All Treatments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={scrollLeft}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#008081] text-white shadow-md shadow-[#008081]/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Carousel Track */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {filteredSkus.map((sku) => (
            <div
              key={sku.id}
              className="flex-none w-[300px] sm:w-[330px] md:w-[345px] snap-start bg-white rounded-2xl border border-slate-200/90 hover:border-[#008081] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Clinical Image Banner (Clean typography badge without generic AI icons) */}
                <Link href={`/${sku.slug}`} className="block relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={sku.image}
                    alt={sku.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0c4445]">
                      {sku.badge}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-slate-950/75 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{sku.rating}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium">
                    <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-teal-300" />
                      {sku.duration}
                    </span>
                    <span className="bg-[#008081]/85 backdrop-blur-sm px-2.5 py-0.5 rounded-md text-white font-semibold">
                      {sku.downtime}
                    </span>
                  </div>
                </Link>

                {/* Content Body */}
                <div className="p-5 pb-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006d6e] bg-[#e8f6f3] px-2.5 py-0.5 rounded-full border border-[#d2eee7]">
                      {sku.category}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        openEmiModal({
                          treatmentName: sku.name,
                          priceFormatted: sku.price,
                          emiMonthly: sku.emiText,
                        })
                      }
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#006d6e] hover:text-slate-900 underline"
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Apply for EMI</span>
                    </button>
                  </div>

                  <Link href={`/${sku.slug}`} className="block">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#008081] transition-colors line-clamp-1 font-serif">
                      {sku.name}
                    </h3>
                  </Link>

                  <ul className="space-y-1.5 pt-0.5">
                    {sku.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#008081] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Price & Action Footer */}
              <div className="px-5 pb-5 pt-2">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Starting from
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-slate-900 font-serif">{sku.price}</span>
                      <span className="text-[10px] text-slate-500">{sku.priceSub}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => addItem({
                        id: sku.id,
                        name: sku.name,
                        slug: sku.slug,
                        price: parseInt(sku.price.replace(/[^\d]/g, "")),
                        priceFormatted: sku.price,
                        sessions: sku.priceSub,
                        category: sku.category,
                        image: sku.image,
                      })}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#008081] text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm"
                      title="Add to Clinical Cart"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>ADD</span>
                    </button>

                    <Link
                      href={`/${sku.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#008081] bg-[#e8f6f3] hover:bg-[#008081] hover:text-white border border-[#d2eee7] transition-all"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
