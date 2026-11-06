"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  UserCheck,
  Share2,
  ChevronRight,
  BookOpen,
  Stethoscope,
  Phone,
  MessageCircle,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { ApiBlog } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { getDoctorByAuthorName } from "@/data/clinicData";
import PageBreadcrumbBanner from "@/components/shared/PageBreadcrumbBanner";
import { getImageUrl } from "@/utils/imageUrl";

interface Props {
  blog: ApiBlog;
  relatedBlogs: ApiBlog[];
}

function getValidBlogImage(src?: string | null, _category?: string, _title?: string): string {
  return getImageUrl(src, "/images/blog/doctor-consultation-dermatology.jpg");
}

export default function BlogDetailView({ blog, relatedBlogs }: Props) {
  const { openAppointmentModal } = useAuth();

  const doctor = getDoctorByAuthorName(blog.authorName);
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://www.skinfinityderma.com/${blog.slug}`;
  const shareText = encodeURIComponent(`${blog.title} - Read on Skinfinity Derma:`);
  const featuredImageSrc = getValidBlogImage(blog.featuredImage);

  const { htmlWithAnchors, toc } = React.useMemo(() => {
    if (!blog.content) return { htmlWithAnchors: "<p>Article content coming soon.</p>", toc: [] };
    let html = blog.content;
    const tocItems: { id: string; text: string }[] = [];
    let idx = 1;

    // Inject id anchors for each H2 heading for TOC navigation and Google sitelinks
    html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, titleText) => {
      const cleanTitle = titleText.replace(/<[^>]+>/g, "").trim();
      const id = `section-${idx++}`;
      tocItems.push({ id, text: cleanTitle });
      return `<h2 id="${id}" ${attrs}>${titleText}</h2>`;
    });

    // Wrap tables in responsive scroll wrapper
    html = html.replace(/<table([\s\S]*?)<\/table>/gi, (match) => {
      return `<div class="overflow-x-auto my-8 rounded-2xl border border-slate-200/90 shadow-sm bg-white">${match}</div>`;
    });

    return { htmlWithAnchors: html, toc: tocItems };
  }, [blog.content]);

  const handleShare = (platform: "whatsapp" | "twitter" | "linkedin" | "copy") => {
    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard?.writeText(shareUrl);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* 1. TOP BREADCRUMB BANNER */}
      <PageBreadcrumbBanner
        image="/images/breadcrumbbanner/service.webp"
        breadcrumbs={[
          { label: "Clinical Blog", href: "/blog" },
          { label: blog.category || "Clinical Article" },
        ]}
        badge="Evidence-Based Dermatology"
        title="Clinical Insights"
        highlight="& Journal"
        subtitle={`Medically Reviewed & Authored by ${doctor.name} • ${doctor.role}`}
        asHeading="h2"
      />

      {/* 2. ARTICLE META & AUTHOR SECTION */}
      <header className="pt-6 pb-4 bg-gradient-to-b from-slate-50/50 to-white border-b border-slate-100">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#006d6e] text-[11px] font-bold uppercase tracking-wider border border-teal-200/80">
              <Tag className="w-3 h-3 text-[#008081]" />
              <span>{blog.category || "Clinical Dermatology"}</span>
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{blog.publishedAt?.slice(0, 10) || "Recent"}</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>4 min read</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-slate-900 font-serif leading-snug max-w-4xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans border-l-4 border-[#008081] pl-3.5 py-1 italic bg-teal-50/30 rounded-r-xl max-w-4xl">
              {blog.excerpt}
            </p>
          )}

          {/* Medical Review Author Card */}
          <div className="pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#008081] shadow-sm bg-slate-100 shrink-0">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover block"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <span>{doctor.name}</span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Medically Reviewed</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {doctor.role} • Skinfinity Derma
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-1">Share:</span>
              <button
                onClick={() => handleShare("whatsapp")}
                title="Share on WhatsApp"
                className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors text-[11px] font-bold"
              >
                WA
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                title="Share on LinkedIn"
                className="w-7 h-7 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 flex items-center justify-center transition-colors text-[11px] font-bold"
              >
                in
              </button>
              <button
                onClick={() => handleShare("copy")}
                title="Copy link"
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors text-xs"
              >
                <Share2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MAIN ARTICLE BODY + SIDEBAR */}
      <main className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Article Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Featured Image (No cropping, full width with natural aspect ratio) */}
            <div className="w-full rounded-2xl overflow-hidden shadow-md border border-slate-200/90 bg-slate-50 flex items-center justify-center">
              <img
                src={featuredImageSrc}
                alt={blog.title}
                className="w-full h-auto max-h-[560px] object-contain block mx-auto"
              />
            </div>

            {/* Google Rank #1 Featured Snippet: Clinical Key Takeaways */}
            {blog.excerpt && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/90 via-emerald-50/30 to-slate-50 border border-teal-200/80 shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006d6e]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Clinical Quick Summary &amp; Key Takeaways</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {blog.excerpt}
                </p>
                <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500 border-t border-teal-100">
                  <span className="flex items-center gap-1 font-semibold text-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Doctor Verified
                  </span>
                  <span>•</span>
                  <span>E-E-A-T Medical Review Standard</span>
                </div>
              </div>
            )}

            {/* Interactive Table of Contents (TOC) for Fast Google Crawling & User Navigation */}
            {toc.length > 2 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800">
                  <BookOpen className="w-3.5 h-3.5 text-[#008081]" />
                  <span>Table of Contents (Jump to Key Topics)</span>
                </div>
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                  {toc.map((item, i) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="text-xs text-slate-600 hover:text-[#008081] hover:underline font-medium flex items-start gap-1 py-0.5 transition-colors"
                    >
                      <span className="text-[#008081] font-bold shrink-0">{i + 1}.</span>
                      <span className="line-clamp-1">{item.text}</span>
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* HTML Article Body with Sitelink Anchors */}
            <div
              className="clinical-article-body"
              dangerouslySetInnerHTML={{ __html: htmlWithAnchors }}
            />

            {/* Medical Disclaimer Banner */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Medical &amp; Editorial Disclaimer:</span> This article is intended strictly for educational and informational purposes. It does not substitute for personalized medical diagnosis or clinical treatment. Consult board-certified dermatologists at Skinfinity Derma for a tailored consultation.
              </div>
            </div>

            {/* Article Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Related Topics:</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {blog.tags.map((tag, i) => (
                    <Link
                      key={i}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-[#008081] px-3 py-1 rounded-full text-slate-700 font-medium transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Floating Doctor Consultation & Sidebar Card */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            {/* Consultation Card */}
            <div className="bg-gradient-to-br from-[#008081] to-[#005b41] rounded-2xl p-5 text-white shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/40 shadow-sm bg-white/10 shrink-0">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover block"
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold font-serif">{doctor.consultTitle}</h3>
                  <div className="text-[11px] text-teal-100">{doctor.role}</div>
                </div>
              </div>

              <p className="text-xs text-teal-50/90 leading-relaxed">
                Suffering from persistent acne, hormonal hair thinning, pigmentation, or interested in US-FDA laser treatments? Schedule your clinical consultation today.
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => openAppointmentModal(doctor.name)}
                  className="w-full py-2.5 rounded-xl bg-white text-[#005b41] hover:bg-teal-50 font-extrabold text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>

                <a
                  href={`https://wa.me/919871941444?text=Hello%20Skinfinity%20Derma%2C%20I%20read%20your%20clinical%20blog%20and%20would%20like%20to%20consult%20${encodeURIComponent(doctor.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Doctor Desk</span>
                </a>
              </div>

              <div className="pt-2.5 border-t border-white/20 text-[11px] text-teal-100/90 space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-teal-200" />
                  <span>Noida Sector 36 &amp; Gurgaon Golf Course Rd</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-teal-200" />
                  <span>NABH-grade sterilized clinical suites</span>
                </div>
              </div>
            </div>

            {/* Quick Links / Related Treatments */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 font-serif uppercase tracking-wider text-slate-500">Popular In-Clinic Protocols</h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li>
                  <Link href="/laser-hair-removal-noida" className="hover:text-[#008081] flex items-center justify-between group">
                    <span>US-FDA Laser Hair Reduction</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
                <li>
                  <Link href="/acne-pimple-treatment-noida" className="hover:text-[#008081] flex items-center justify-between group">
                    <span>Acne &amp; Scar Remodeling (MNRF)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
                <li>
                  <Link href="/sugarcane-hydrafacial" className="hover:text-[#008081] flex items-center justify-between group">
                    <span>Signature Sugarcane HydraFacial MD</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
                <li>
                  <Link href="/hair-fall-treatment-noida" className="hover:text-[#008081] flex items-center justify-between group">
                    <span>GFC &amp; PRP Hair Restoration</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* 4. RELATED ARTICLES CAROUSEL/GRID */}
        {relatedBlogs.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">
                  Related Clinical Articles
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Continue exploring evidence-backed dermatology insights.
                </p>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold text-[#008081] hover:text-[#006d6e] flex items-center gap-1"
              >
                <span>View All Articles</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedBlogs.map((rel) => (
                <article
                  key={rel.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#008081] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[3/2] w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                      <Image
                        src={getValidBlogImage(rel.featuredImage, rel.category, rel.title)}
                        alt={rel.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-[#008081] uppercase tracking-wider">
                        {rel.category || "Clinical Guide"}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#008081] transition-colors font-serif line-clamp-2">
                        <Link href={`/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-1">
                    <Link
                      href={`/${rel.slug}`}
                      className="text-xs font-bold text-[#008081] flex items-center gap-1"
                    >
                      <span>Read More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
