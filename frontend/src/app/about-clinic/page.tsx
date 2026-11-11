import React from "react";
import { Metadata } from "next";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";
import AboutClinicShowcase from "@/components/about/AboutClinicShowcase";
import AboutClinicInteractiveSections from "@/components/about/AboutClinicInteractiveSections";
import SectionDivider from "@/components/shared/SectionDivider";
import { getGallery } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Skinfinity Derma Clinic | Infrastructure, Journey, Doctors & Lab",
  description:
    "Explore Skinfinity Derma clinics in Noida and Gurgaon: luxury clinic suites, our interactive journey (2014–2026), national awards, dedicated MD dermatologist profiles, integrated Orange Health Lab, and in-house pharmacy.",
  alternates: {
    canonical: "/about-clinic",
  },
};

export default async function AboutClinicPage() {
  const galleryItems = await getGallery();

  return (
    <div className="bg-white">
      {/* Breadcrumb Banner */}
      <PageBreadcrumbBanner
        image="/images/breadcrumbbanner/about-us.webp"
        breadcrumbs={[{ label: "About Clinic" }]}
        title="About Skinfinity"
        highlight="Derma Clinic"
        subtitle="Skinfinity Derma was established with a singular medical commitment: to bring international-standard dermatological science, US-FDA approved technologies, and ethical patient-first care to Noida & Gurgaon."
      />

      {/* Exact Home Page About Section */}
      <AboutClinicShowcase />

      <SectionDivider />

      {/* Clinic Images -> Our Journey -> Awards -> 5-Doctor Carousel -> Integrated Lab & Pharmacy -> Associated Partners */}
      <AboutClinicInteractiveSections initialGallery={galleryItems || undefined} />
    </div>
  );
}
