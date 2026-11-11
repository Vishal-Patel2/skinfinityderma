import React from "react";
import { Metadata } from "next";
import GalleryView from "@/components/gallery/GalleryView";
import { getGallery } from "@/lib/api";
import { GalleryItem } from "@/types/gallery.types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clinical Infrastructure & Technology Gallery | Skinfinity Derma",
  description:
    "Explore high-definition photos of Skinfinity Derma's US-FDA approved laser technologies, on-site Orange Health pathology labs, and luxury clinic procedure suites in Noida & Gurgaon.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Clinical Infrastructure & Technology Gallery | Skinfinity Derma",
    description:
      "Explore high-definition photos of Skinfinity Derma's US-FDA approved laser technologies, on-site Orange Health pathology labs, and luxury clinic procedure suites in Noida & Gurgaon.",
    url: "https://www.skinfinityderma.com/gallery",
    siteName: "Skinfinity Derma",
    images: [
      {
        url: "/images/custom/clinic-reception.jpg",
        width: 1200,
        height: 630,
        alt: "Skinfinity Derma Clinical Infrastructure",
      },
    ],
  },
};

const DEFAULT_FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: 1,
    image: "/images/gallery/skinfinity-gurgaon-1.webp",
    title: "Gurgaon Flagship Reception & Patient Lounge",
    description: "Opulent reception area with dedicated concierge, private sanitized seating lounges, and luxury aesthetic ambience.",
    category: "Clinic",
    badge: "Gurgaon Sector 28",
    location: "Gurgaon",
  },
  {
    id: 2,
    image: "/images/gallery/skinfinity-gurgaon-2.webp",
    title: "Sterile Dermatology Laser Procedure Suite",
    description: "State-of-the-art procedure room equipped with US-FDA laser platforms and hospital-grade sterilization protocols.",
    category: "Clinic",
    badge: "Clinical Operatory",
    location: "Gurgaon",
  },
  {
    id: 3,
    image: "/images/gallery/skinfinity-gurgaon-3.webp",
    title: "VIP Aesthetic Consultation Chamber",
    description: "Private consultation room with polarized digital dermoscopy and root-cause diagnostic stations for personalized care.",
    category: "Clinic",
    badge: "Doctor Chamber",
    location: "Gurgaon",
  },
  {
    id: 4,
    image: "/images/gallery/skinfinity-gurgaon-4.webp",
    title: "Advanced Laser Hair Reduction Operatory",
    description: "Equipped with Alma Soprano Titanium triple-wavelength laser and chilled contact sapphire cooling for pain-free treatment.",
    category: "Clinic",
    badge: "Laser Operatory",
    location: "Gurgaon",
  },
  {
    id: 5,
    image: "/images/gallery/skinfinity-gurgaon-5.webp",
    title: "Medical Facial & Hydra Dermabrasion Chamber",
    description: "Dedicated room for original HydraFacial MD, medical chemical peels, and non-invasive glow infusions.",
    category: "Clinic",
    badge: "Facial Suite",
    location: "Gurgaon",
  },
  {
    id: 6,
    image: "/images/gallery/skinfinity-gurgaon-6.webp",
    title: "Clinical Examination & Dermoscopy Zone",
    description: "High-magnification polarized optical analyzer for follicular unit density and epidermal pigment mapping.",
    category: "Clinic",
    badge: "Diagnostic Suite",
    location: "Gurgaon",
  },
  {
    id: 7,
    image: "/images/gallery/skinfinity-gurgaon-7.webp",
    title: "Private Recovery & Post-Procedure Lounge",
    description: "Quiet soothing post-treatment recovery lounge ensuring complete patient privacy and clinical aftercare monitoring.",
    category: "Clinic",
    badge: "Patient Comfort",
    location: "Gurgaon",
  },
  {
    id: 8,
    image: "/images/gallery/skinfinity-gurgaon-8.webp",
    title: "In-House Dermatological Pharmacy Counter",
    description: "Temperature-controlled authentic actives, prescription dermatological formulations, and clinical sunscreens.",
    category: "Clinic",
    badge: "Cold-Chain Pharmacy",
    location: "Gurgaon",
  },
  {
    id: 9,
    image: "/images/gallery/skinfinity-gurgaon-9.webp",
    title: "Executive Injectables & Anti-Aging Suite",
    description: "Dedicated suite for Botox, Juvederm dermal fillers, Profhilo, and thread lifts performed by certified MD dermatologists.",
    category: "Clinic",
    badge: "Anti-Aging Suite",
    location: "Gurgaon",
  },
  {
    id: 10,
    image: "/images/gallery/skinfinity-gurgaon-10.webp",
    title: "Skinfinity Clinic Exterior & Welcome Entrance",
    description: "Conveniently located on Golf Course Road, Sector 28 Gurugram with dedicated valet parking and prime accessibility.",
    category: "Clinic",
    badge: "Prime Location",
    location: "Gurgaon",
  },
  {
    id: 11,
    image: "/images/custom/clinic-reception.jpg",
    title: "Noida Flagship Reception & Welcome Lounge",
    description: "NABH-standard flagship reception with private consultation lounges, warm architectural finishes, and seamless digital check-in.",
    category: "Clinic",
    badge: "Noida Sector 36",
    location: "Noida",
  },
  {
    id: 12,
    image: "/images/clinic/interior-1.jpg",
    title: "Noida Advanced Procedure Suite & Sterilization Bay",
    description: "Sterile operatory with US-FDA approved technologies, disposable single-patient hygiene kits, and strict medical SOPs.",
    category: "Clinic",
    badge: "Noida Sector 36",
    location: "Noida",
  },
  {
    id: 13,
    image: "/images/clinic/interior-2.jpg",
    title: "Senior MD Dermatologist Consultation Suite",
    description: "Consultation chamber led by Dr. Ipshita Johri and senior clinical board for deep dermatological assessment.",
    category: "Clinic",
    badge: "Noida Sector 36",
    location: "Noida",
  },
  {
    id: 14,
    image: "/images/clinic/interior-3.jpg",
    title: "Noida VIP Aesthetics & Laser Lounge",
    description: "Quiet luxury consultation suite for comprehensive anti-aging and facial transformation planning.",
    category: "Clinic",
    badge: "Noida Sector 36",
    location: "Noida",
  },
  {
    id: 15,
    image: "/images/treatments/banner-laser.webp",
    title: "US-FDA Soprano Titanium Triple-Wavelength Laser",
    description: "Painless permanent hair reduction with -4°C ICE Plus continuous sapphire contact cooling, calibrated for Indian skin tones.",
    category: "Machines",
    badge: "755nm + 810nm + 1064nm",
    location: "Noida & Gurgaon",
  },
  {
    id: 16,
    image: "/images/clinic/interior-4.jpg",
    title: "Q-Switched Nd:YAG 1064nm Nanosecond Laser",
    description: "Photoacoustic melanin shattering technology for stubborn melasma, sun spots, carbon laser peels, and epidermal brightening.",
    category: "Machines",
    badge: "Melasma & Pigment Toning",
    location: "Noida & Gurgaon",
  },
  {
    id: 17,
    image: "/images/treatments/banner-acne.webp",
    title: "Gold-Insulated Fractional MNRF Platform",
    description: "Precision microneedling radiofrequency system that delivers controlled dermal thermal energy for deep acne scar elevation.",
    category: "Machines",
    badge: "Collagen Scar Remodeling",
    location: "Noida & Gurgaon",
  },
  {
    id: 18,
    image: "/images/treatments/banner-hydrafacial.webp",
    title: "Vortex-Fusion Sugarcane HydraFacial MD System",
    description: "Medical vacuum extraction and botanical glycolic-hyaluronic infusion platform with integrated phototherapy.",
    category: "Machines",
    badge: "Hydro-Dermabrasion & LED",
    location: "Noida & Gurgaon",
  },
  {
    id: 19,
    image: "/images/results/facial-after.jpg",
    title: "4D HIFU SMAS Ultrasound Lifting System",
    description: "Non-surgical focused ultrasound targeting the foundational SMAS layer for jawline contouring and double-chin reduction.",
    category: "Machines",
    badge: "1.5mm • 3.0mm • 4.5mm Depth",
    location: "Noida & Gurgaon",
  },
  {
    id: 20,
    image: "/images/clinic/interior-2.jpg",
    title: "200x Digital Video Dermoscope & Trichoscope",
    description: "High-magnification polarized optical analyzer for follicular unit density mapping and epidermal pigment depth grading.",
    category: "Machines",
    badge: "AI-Assisted Diagnostics",
    location: "Noida & Gurgaon",
  },
  {
    id: 21,
    image: "/images/clinic/interior-6.jpg",
    title: "On-Site Orange Health Pathology Collection Lab",
    description: "Same-day hormonal, PCOS, thyroid (T3/T4/TSH), ferritin, and vitamin D3/B12 blood panels to diagnose internal root causes.",
    category: "Labs",
    badge: "NABL Certified Diagnostics",
    location: "Noida & Gurgaon",
  },
  {
    id: 22,
    image: "/images/treatments/banner-hairloss.webp",
    title: "Sterile Autologous GFC & PRP Cellular Lab",
    description: "Hospital-grade laminar hygiene zone for isolating 10x concentrated autologous growth factors from patient blood samples.",
    category: "Labs",
    badge: "Closed-System Centrifugation",
    location: "Noida & Gurgaon",
  },
  {
    id: 23,
    image: "/images/clinic/interior-2.jpg",
    title: "Wood's Lamp & Microscopic Trichology Lab",
    description: "Differentiates epidermal vs. dermal melasma and evaluates hair bulb anagen-to-telogen ratios prior to treatment.",
    category: "Labs",
    badge: "Root-Cause Evaluation",
    location: "Noida & Gurgaon",
  },
  {
    id: 24,
    image: "/images/clinic/interior-1.jpg",
    title: "In-House Cold-Chain Dermatological Pharmacy",
    description: "Temperature-controlled storage for authentic Allergan biologics, peptide serums, medical peels, and prescription topicals.",
    category: "Labs",
    badge: "100% Batch-Verified Actives",
    location: "Noida & Gurgaon",
  },
];

export default async function GalleryPage() {
  const dynamicItems = await getGallery();
  const initialItems: GalleryItem[] =
    Array.isArray(dynamicItems) && dynamicItems.length > 0
      ? dynamicItems.map((item: any, idx: number) => ({
          id: item.id || idx + 1,
          image: item.image,
          title: item.title,
          description: item.description || "",
          category: item.category || "Clinic",
          badge: item.badge || item.category,
          location: item.location || "Noida & Gurgaon",
          altText: item.altText || item.title,
        }))
      : DEFAULT_FALLBACK_GALLERY;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Skinfinity Derma Clinical Infrastructure & Technology Gallery",
    description:
      "Photographic tour of US-FDA approved technologies, in-house pathology and cellular labs, and luxury clinic procedure suites in Noida & Gurgaon.",
    url: "https://www.skinfinityderma.com/gallery",
    image: initialItems.slice(0, 10).map((i) => i.image),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GalleryView initialItems={initialItems} />
    </>
  );
}
