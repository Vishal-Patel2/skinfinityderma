import React from "react";
import { Metadata } from "next";
import { RICH_TREATMENTS, getTreatmentBySlug } from "@/data/treatmentsCatalog";
import TreatmentDetailView from "@/components/treatments/TreatmentDetailView";

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const allSlugs = new Set<string>();
  RICH_TREATMENTS.forEach((t) => {
    allSlugs.add(t.slug);
    t.aliases?.forEach((a) => allSlugs.add(a));
  });
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const treatment = getTreatmentBySlug(params.slug);

  return {
    title: `${treatment.name} (${treatment.priceFormatted}) | Skinfinity Derma Noida & Gurgaon`,
    description: `${treatment.shortDesc} Starts from ${treatment.priceFormatted} with 0% EMI options. US-FDA approved protocols by Dr. Ipshita Johri.`,
    alternates: {
      canonical: `/${treatment.slug}`,
    },
  };
}

export default function TreatmentDetailPage({ params }: Props) {
  const treatment = getTreatmentBySlug(params.slug);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: treatment.faqs.map((faq) => ({
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
