"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  UserCheck,
  Tag,
  Sparkles,
  ChevronRight,
  Stethoscope,
} from "lucide-react";
import type { ApiBlog } from "@/lib/types";
import { getDoctorByAuthorName } from "@/data/clinicData";
import { getImageUrl } from "@/utils/imageUrl";

interface Props {
  initialBlogs: ApiBlog[];
}

const CATEGORIES = [
  "All Articles",
  "Laser Hair Reduction",
  "Acne & Scars",
  "Anti-Aging & Skin",
  "Hair Restoration",
  "Pigmentation & Glow",
  "Skincare Tips",
];

function getValidBlogImage(src?: string | null, _category?: string, _title?: string): string {
  return getImageUrl(src, "/images/blog/doctor-consultation-dermatology.jpg");
}

export default function BlogListClient({ initialBlogs }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(q)) ||
        (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(q)));

      let matchesCat = true;
      if (selectedCategory !== "All Articles") {
        const catLower = selectedCategory.toLowerCase();
        const textToMatch = `${blog.category || ""} ${blog.title} ${blog.tags?.join(" ") || ""}`.toLowerCase();
        if (selectedCategory === "Laser Hair Reduction") {
          matchesCat = textToMatch.includes("laser") || textToMatch.includes("hair reduction");
        } else if (selectedCategory === "Acne & Scars") {
          matchesCat = textToMatch.includes("acne") || textToMatch.includes("pimple") || textToMatch.includes("scar");
        } else if (selectedCategory === "Anti-Aging & Skin") {
          matchesCat = textToMatch.includes("aging") || textToMatch.includes("botox") || textToMatch.includes("wrinkle") || textToMatch.includes("hifu");
        } else if (selectedCategory === "Hair Restoration") {
          matchesCat = textToMatch.includes("hair") || textToMatch.includes("prp") || textToMatch.includes("gfc") || textToMatch.includes("scalp");
        } else if (selectedCategory === "Pigmentation & Glow") {
          matchesCat = textToMatch.includes("pigment") || textToMatch.includes("glow") || textToMatch.includes("hydrafacial") || textToMatch.includes("peel");
        } else {
          matchesCat = textToMatch.includes("care") || textToMatch.includes("tip") || textToMatch.includes("routine");
        }
      }

      return matchesSearch && matchesCat;
    });
  }, [initialBlogs, searchQuery, selectedCategory]);

  const featuredBlog = initialBlogs[0];
  const displayedBlogs = filteredBlogs.slice(0, visibleCount);

  return (
    <div className="py-8 sm:py-10">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Search & Category Filter Toolbar */}
        <div className="space-y-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments, skin concerns, lasers, retinol, acne..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008081]/30 focus:border-[#008081] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(12);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                    isActive
                      ? "bg-[#008081] text-white shadow-teal-900/10"
                      : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Hero Article (Shown when no search query) */}
        {!searchQuery && selectedCategory === "All Articles" && featuredBlog && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative h-72 sm:h-96 w-full bg-slate-100 border-r border-slate-100 overflow-hidden">
                <Image
                  src={getValidBlogImage(featuredBlog.featuredImage, featuredBlog.category, featuredBlog.title)}
                  alt={featuredBlog.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Featured Article</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 text-[#006d6e] font-bold bg-[#e8f6f3] px-2.5 py-0.5 rounded-full">
                    {featuredBlog.category || "Clinical Dermatology"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {featuredBlog.publishedAt?.slice(0, 10) || "Recent"}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif leading-snug group-hover:text-[#008081] transition-colors">
                  <Link href={`/${featuredBlog.slug}`}>
                    {featuredBlog.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {featuredBlog.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#008081]/30 shrink-0 bg-teal-50">
                      <img
                        src={getDoctorByAuthorName(featuredBlog.authorName).image}
                        alt={getDoctorByAuthorName(featuredBlog.authorName).name}
                        className="w-full h-full object-cover block"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{getDoctorByAuthorName(featuredBlog.authorName).name}</div>
                      <div className="text-[10px] text-slate-400">{getDoctorByAuthorName(featuredBlog.authorName).role}</div>
                    </div>
                  </div>

                  <Link
                    href={`/${featuredBlog.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#008081] hover:text-[#006d6e] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              {searchQuery ? `Search results for "${searchQuery}"` : "Latest Clinical Articles"}
              <span className="text-xs font-normal text-slate-500 ml-2">({filteredBlogs.length} articles)</span>
            </h3>
          </div>

          {displayedBlogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="text-base font-bold text-slate-700">No matching articles found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for different keywords like laser hair removal, acne, pigmentation, or clear filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Articles");
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-[#008081] text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#008081]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Thumbnail: Aspect 3:2 exactly matches the 1536x1024 banner ratio without any cropping or borders */}
                    <div className="relative aspect-[3/2] w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                      <Image
                        src={getValidBlogImage(blog.featuredImage, blog.category, blog.title)}
                        alt={blog.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-900 shadow-sm">
                        {blog.category || "Dermatology"}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {blog.publishedAt?.slice(0, 10) || "Recent"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          4 min read
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#008081] transition-colors font-serif leading-snug line-clamp-2">
                        <Link href={`/${blog.slug}`}>{blog.title}</Link>
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 sm:px-6 pb-5 pt-2">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {(() => {
                        const doc = getDoctorByAuthorName(blog.authorName);
                        return (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#008081]/30 shrink-0 bg-teal-50">
                              <img
                                src={doc.image}
                                alt={doc.name}
                                className="w-full h-full object-cover block"
                              />
                            </div>
                            <span className="text-[11px] text-slate-600 font-medium truncate max-w-[140px]">
                              {doc.name}
                            </span>
                          </div>
                        );
                      })()}
                      <Link
                        href={`/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#008081] group-hover:translate-x-1 transition-transform shrink-0"
                      >
                        <span>Read More</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredBlogs.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-8 py-3 rounded-full bg-white hover:bg-teal-50 border-2 border-[#008081] text-[#008081] font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Load More Clinical Articles</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
