import React from "react";

export interface SectionHeadingProps {
  badge?: React.ReactNode;
  badgeVariant?: "teal" | "amber" | "slate" | "brand";
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left" | "right";
  theme?: "light" | "dark";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  asHeading?: "h1" | "h2" | "h3";
}

const BADGE_VARIANTS = {
  teal: "text-[#008081] bg-teal-50 border-teal-100",
  amber: "text-amber-700 bg-amber-50 border-amber-200",
  slate: "text-slate-700 bg-slate-100 border-slate-200",
  brand: "text-brand-700 bg-brand-50 border-brand-200",
};

export default function SectionHeading({
  badge,
  badgeVariant = "teal",
  title,
  subtitle,
  align = "center",
  theme = "light",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  asHeading = "h2",
}: SectionHeadingProps) {
  const alignClass =
    align === "center"
      ? "text-center mx-auto"
      : align === "right"
      ? "text-right ml-auto"
      : "text-left";

  const isDark = theme === "dark";
  const HeadingTag = asHeading;

  return (
    <div className={`max-w-3xl mb-8 sm:mb-10 lg:mb-12 ${alignClass} ${className}`}>
      {badge && (
        <div className="mb-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isDark
                ? "text-brand-300 bg-slate-800/80 border-brand-700/50"
                : BADGE_VARIANTS[badgeVariant]
            }`}
          >
            {badge}
          </span>
        </div>
      )}

      <HeadingTag
        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif leading-tight ${
          isDark ? "text-white" : "text-slate-900"
        } ${titleClassName}`}
      >
        {title}
      </HeadingTag>

      {subtitle && (
        <p
          className={`text-xs sm:text-sm mt-2.5 sm:mt-3 leading-relaxed ${
            isDark ? "text-slate-300" : "text-slate-600"
          } ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
