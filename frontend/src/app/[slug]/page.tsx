import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RICH_TREATMENTS, getTreatmentBySlug } from "@/data/treatmentsCatalog";
import { getDoctorByAuthorName } from "@/data/clinicData";
import { getTreatment, getBlog, getBlogs } from "@/lib/api";
import TreatmentDetailView from "@/components/treatments/TreatmentDetailView";
import BlogDetailView from "@/components/blog/BlogDetailView";

export const dynamicParams = true;
export const revalidate = 0;

interface Props {
  params: {
    slug: string;
  };
}

const STATIC_ROUTES = new Set([
  "contact-us",
  "about-us",
  "about-clinic",
  "results",
  "testimonials",
  "franchise",
  "membership",
  "latest-offer",
  "doctors",
  "treatments",
  "blog",
  "blogs",
  "admin",
  "account",
  "login",
  "dermatologist-in-gurgaon",
  "api",
]);

export function generateStaticParams() {
  const allSlugs = new Set<string>();
  RICH_TREATMENTS.forEach((t) => {
    if (!STATIC_ROUTES.has(t.slug)) allSlugs.add(t.slug);
    t.aliases?.forEach((a) => {
      if (!STATIC_ROUTES.has(a)) allSlugs.add(a);
    });
  });
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (STATIC_ROUTES.has(params.slug)) {
    return { title: "Skinfinity Derma" };
  }

  // 1. Check if it's a Blog article first
  const blog = await getBlog(params.slug);
  if (blog) {
    const doctor = getDoctorByAuthorName(blog.authorName);
    const title = blog.metaTitle || `${blog.title} | Skinfinity Derma`;
    const description =
      blog.metaDescription ||
      blog.excerpt ||
      `Read clinical dermatological insights on ${blog.title} by ${doctor.name} at Skinfinity Derma.`;

    return {
      title,
      description,
      keywords: blog.metaKeywords || (blog.tags || []).join(", "),
      alternates: {
        canonical: `https://www.skinfinityderma.com/${blog.slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://www.skinfinityderma.com/${blog.slug}`,
        type: "article",
        publishedTime: blog.publishedAt,
        modifiedTime: blog.createdAt || blog.publishedAt,
        authors: [doctor.name],
        images: blog.featuredImage ? [{ url: blog.featuredImage, alt: blog.title }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: blog.featuredImage ? [blog.featuredImage] : [],
      },
    };
  }

  // 2. Otherwise treatment
  const apiData = await getTreatment(params.slug);
  const treatment = apiData?.treatment || getTreatmentBySlug(params.slug);
  const isGurgaon = params.slug.toLowerCase().includes("gurgaon");
  const isNoida = params.slug.toLowerCase().includes("noida");
  const locationLabel = isGurgaon ? "Gurgaon Golf Course Road" : (isNoida ? "Noida Sector 36" : "Noida & Gurgaon");

  return {
    title: `${treatment.name} (${treatment.priceFormatted}) | Skinfinity Derma ${locationLabel}`,
    description: `${treatment.shortDesc} Starts from ${treatment.priceFormatted} with 0% EMI options. US-FDA approved clinical protocols.`,
    alternates: {
      canonical: `/${treatment.slug}`,
    },
  };
}

export default async function CatchAllSlugPage({ params }: Props) {
  if (STATIC_ROUTES.has(params.slug)) {
    notFound();
  }

  // 1. Check if slug matches a Clinical Blog article
  const blog = await getBlog(params.slug);
  if (blog) {
    const doctor = getDoctorByAuthorName(blog.authorName);
    const allBlogsRes = await getBlogs({ limit: 4 });
    const relatedBlogs = (allBlogsRes?.blogs || [])
      .filter((b) => b.slug !== blog.slug)
      .slice(0, 3);

    // Extract FAQs for Google FAQPage Schema
    const faqItems: { question: string; answer: string }[] = [];
    if (blog.content) {
      const faqRegex = /<h3>(\d+\.\s*[^<]+)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi;
      let m;
      while ((m = faqRegex.exec(blog.content)) !== null) {
        faqItems.push({
          question: m[1].replace(/<[^>]+>/g, "").trim(),
          answer: m[2].replace(/<[^>]+>/g, "").trim(),
        });
      }
    }

    const schemas: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "@id": `https://www.skinfinityderma.com/${blog.slug}#webpage`,
        url: `https://www.skinfinityderma.com/${blog.slug}`,
        name: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        medicalAudience: "Patient",
        aspect: ["Diagnosis", "Treatment", "Prevention"],
        specialty: "Dermatology",
        author: {
          "@type": "Person",
          name: doctor.name,
          jobTitle: doctor.role,
          worksFor: {
            "@type": "MedicalClinic",
            name: "Skinfinity Derma",
            url: "https://www.skinfinityderma.com",
          },
        },
        lastReviewed: blog.publishedAt?.slice(0, 10),
        reviewedBy: {
          "@type": "Person",
          name: doctor.name,
          jobTitle: doctor.role,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `https://www.skinfinityderma.com/${blog.slug}#article`,
        headline: blog.title,
        description: blog.excerpt,
        image: blog.featuredImage || "https://www.skinfinityderma.com/images/treatments/banner-acne.webp",
        datePublished: blog.publishedAt,
        dateModified: blog.createdAt || blog.publishedAt,
        author: {
          "@type": "Person",
          name: doctor.name,
          jobTitle: doctor.role,
        },
        publisher: {
          "@type": "Organization",
          name: "Skinfinity Derma",
          logo: {
            "@type": "ImageObject",
            url: "https://www.skinfinityderma.com/images/logo/logo.webp",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://www.skinfinityderma.com/${blog.slug}`,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.skinfinityderma.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Clinical Blog",
            item: "https://www.skinfinityderma.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: blog.title,
            item: `https://www.skinfinityderma.com/${blog.slug}`,
          },
        ],
      },
    ];

    if (faqItems.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      });
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
        <BlogDetailView blog={blog} relatedBlogs={relatedBlogs} />
      </>
    );
  }

  // 2. Otherwise Treatment Detail View
  const apiData = await getTreatment(params.slug);
  const treatment = apiData?.treatment || getTreatmentBySlug(params.slug);

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
