"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/clinicData";

export default function LatestBlogsSection() {
  return (
    <section className="py-16 lg:py-24 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Dermatologist Insights
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2.5 font-serif">
              Latest Blogs & Skin Education
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
              Stay informed with scientifically backed advice on skin barrier health, hair loss prevention, and laser safety written by our clinical specialists.
            </p>
          </div>

          <Link
            href="/dermatologist-in-gurgaon"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors shrink-0"
          >
            <span>Explore All Blog Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <article
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 text-brand-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {post.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>{post.date}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors font-serif leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                    {post.snippet}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 group-hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
