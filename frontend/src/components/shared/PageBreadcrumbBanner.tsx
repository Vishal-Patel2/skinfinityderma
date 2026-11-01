import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbBannerProps {
  image: string;
  breadcrumbs: BreadcrumbItem[];
  badge?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  imageHasBuiltInText?: boolean;
  children?: React.ReactNode;
  asHeading?: "h1" | "h2" | "div";
}

export default function PageBreadcrumbBanner({
  image,
  breadcrumbs,
  badge,
  title,
  highlight,
  subtitle,
  imageHasBuiltInText = false,
  children,
  asHeading = "h1",
}: PageBreadcrumbBannerProps) {
  if (imageHasBuiltInText) {
    return (
      <section className="relative w-full bg-white border-b border-slate-100 overflow-hidden">
        {/* Top compact breadcrumb bar */}
        <div className="bg-slate-50/90 border-b border-slate-200/60 py-2.5">
          <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Link href="/" className="hover:text-brand-700 transition-colors">
                Home
              </Link>
              {breadcrumbs.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  {item.href ? (
                    <Link href={item.href} className="hover:text-brand-700 transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-brand-700 font-bold">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        {/* Full-width Franchise Banner Image */}
        <div className="relative w-full aspect-[1920/600] min-h-[200px] sm:min-h-[280px] lg:min-h-[360px]">
          <Image
            src={image}
            alt={breadcrumbs[breadcrumbs.length - 1]?.label || "Banner"}
            fill
            unoptimized
            priority
            className="object-cover object-center"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] flex items-center overflow-hidden border-b border-slate-100 bg-[#f4fbfb]">
      {/* Background Banner Image (right-aligned visual, left-aligned light space) */}
      <Image
        src={image}
        alt={title || "Page Banner"}
        fill
        unoptimized
        priority
        className="object-cover object-right sm:object-center"
      />

      {/* Soft left gradient overlay so text is always 100% readable on all screens */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 sm:via-white/75 to-transparent lg:w-3/4 pointer-events-none" />

      {/* Left-side Content Container */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 w-full">
        <div className="max-w-xl lg:max-w-2xl space-y-3.5">
          {/* Breadcrumb Trail */}
          <nav className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-sm">
            <Link href="/" className="hover:text-brand-700 transition-colors">
              Home
            </Link>
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-brand-700 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-brand-700 font-bold truncate max-w-[220px] sm:max-w-none">
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Optional Badge */}
          {badge && (
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#006d6e] bg-[#e8f6f3] px-3 py-1 rounded-full border border-[#d2eee7]">
                <Sparkles className="w-3 h-3 text-[#006d6e]" />
                {badge}
              </span>
            </div>
          )}

          {/* Heading */}
          {title && React.createElement(
            asHeading,
            {
              className:
                "text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-extrabold text-slate-900 font-serif leading-[1.18]",
            },
            <>
              {title}{" "}
              {highlight && <span className="text-brand-700">{highlight}</span>}
            </>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-xl">
              {subtitle}
            </p>
          )}

          {/* Extra actions / children */}
          {children && <div className="pt-2">{children}</div>}
        </div>
      </div>
    </section>
  );
}
