import React from "react";
import { Metadata } from "next";
import BlogListClient from "@/components/blog/BlogListClient";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";
import { getBlogs } from "@/lib/api";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Clinical Dermatology Blog & Insights | Skinfinity Derma",
  description:
    "Evidence-based skincare, laser hair reduction, acne scar revision, and anti-aging advice from Dr. Ipshita Johri and board-certified dermatologists at Skinfinity Derma.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Clinical Dermatology Blog & Insights | Skinfinity Derma",
    description:
      "Evidence-based skincare, laser hair reduction, acne scar revision, and anti-aging advice from Dr. Ipshita Johri and board-certified dermatologists at Skinfinity Derma.",
    url: "https://www.skinfinityderma.com/blog",
    siteName: "Skinfinity Derma",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const blogsRes = await getBlogs({ limit: 100 });
  const blogs = blogsRes?.blogs || [];

  return (
    <div className="bg-[#fcfdfd] min-h-screen">
      <PageBreadcrumbBanner
        image="/images/breadcrumbbanner/service.webp"
        breadcrumbs={[{ label: "Clinical Blog" }]}
        badge="Evidence-Based Medical Dermatology"
        title="Clinical Dermatology"
        highlight="Insights & Blog"
        subtitle="Expert clinical skincare protocols, laser hair reduction science, and aesthetic dermatology advice curated by Dr. Ipshita Johri and senior board-certified MD dermatologists."
      />
      <BlogListClient initialBlogs={blogs} />
    </div>
  );
}
