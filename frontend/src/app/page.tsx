import React from "react";
import Image from "next/image";
import HeroBannerCarousel from "@/components/home/HeroBannerCarousel";
import SkuCarouselSection from "@/components/tools/SkuCarouselSection";
import InteractiveToolsShowcase from "@/components/tools/InteractiveToolsShowcase";
import AboutClinicShowcase from "@/components/about/AboutClinicShowcase";
import ReviewsAndShortsSection from "@/components/home/ReviewsAndShortsSection";
import DoctorFounder from "@/components/about/DoctorFounder";
import RealResultsSection from "@/components/home/RealResultsSection";
import OffersSection from "@/components/home/OffersSection";
import NewsMediaSection from "@/components/home/NewsMediaSection";
import FaqSection from "@/components/shared/FaqSection";
import AssociatedPartners from "@/components/home/AssociatedPartners";

function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center py-1 bg-white">
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

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero Team Banner */}
      <HeroBannerCarousel />

      {/* 2. About Skinfinity Derma Luxury Clinics */}
      <AboutClinicShowcase />

      <SectionDivider />

      {/* 3. Clinical Treatment SKUs in Animated Carousel */}
      <SkuCarouselSection />

      <SectionDivider />

      {/* 4. The 3 Diagnostic Tools */}
      <InteractiveToolsShowcase />

      <SectionDivider />

      {/* 5. YouTube Shorts & Google Reviews */}
      <ReviewsAndShortsSection />

      <SectionDivider />

      {/* 6. Doctor Founder & Medical Specialists */}
      <DoctorFounder />

      <SectionDivider />

      {/* 7. Before / After Clinical Results Gallery */}
      <RealResultsSection />

      <SectionDivider />

      {/* 8. Exclusive Monthly Packages & Offers */}
      <OffersSection />

      <SectionDivider />

      {/* 9. Franchise Showcase Banner */}
      <AssociatedPartners />

      <SectionDivider />

      {/* 10. Dermatological FAQs & Appointment Booking */}
      <FaqSection />

      <SectionDivider />

      {/* 11. News, Press & Media Recognition */}
      <NewsMediaSection />
    </div>
  );
}
