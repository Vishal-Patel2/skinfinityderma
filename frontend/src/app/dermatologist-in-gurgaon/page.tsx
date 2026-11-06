import React from "react";
import { Metadata } from "next";
import { getTreatmentBySlug } from "@/data/treatmentsCatalog";
import TreatmentDetailView from "@/components/treatments/TreatmentDetailView";

export const metadata: Metadata = {
  title: "Best Dermatologist in Gurgaon | Skin Clinic Golf Course Road | Skinfinity Derma",
  description: "Top rated Dermatologist & Skin Clinic in Gurgaon on Golf Course Road Sector 28. Led by Dr. Ipshita Johri & Senior MD Dermatologists. US-FDA Laser Hair Removal, Acne & HydraFacial.",
  alternates: {
    canonical: "/dermatologist-in-gurgaon",
  },
};

export default function GurgaonDermatologistPage() {
  const treatment = getTreatmentBySlug("dermatologist-in-gurgaon");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (treatment.faqs || []).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <TreatmentDetailView treatment={treatment} />
    </>
  );
}
