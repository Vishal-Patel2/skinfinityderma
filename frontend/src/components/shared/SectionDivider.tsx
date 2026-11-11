import React from "react";
import Image from "next/image";

interface SectionDividerProps {
  className?: string;
  bg?: string;
}

/**
 * Reusable Skinfinity Derma Infinity Section Divider
 * Matches the exact design, sizing, and clean placement of the homepage divider.
 */
export default function SectionDivider({
  className = "",
  bg = "bg-white",
}: SectionDividerProps) {
  return (
    <div className={`w-full flex items-center justify-center py-1 ${bg} select-none pointer-events-none ${className}`}>
      <Image
        src="/images/custom/section-divider.webp"
        alt="section divider"
        width={320}
        height={34}
        className="w-full max-w-[240px] sm:max-w-[280px] h-auto object-contain opacity-90 select-none pointer-events-none"
        priority={false}
      />
    </div>
  );
}
