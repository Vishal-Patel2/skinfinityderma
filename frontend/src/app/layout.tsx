import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AuthModal from "@/components/modals/AuthModal";
import CartDrawer from "@/components/modals/CartDrawer";
import AppointmentModal from "@/components/modals/AppointmentModal";
import EmiApplicationModal from "@/components/modals/EmiApplicationModal";

export const metadata: Metadata = {
  title: "Best Dermatologist in Noida & Gurgaon | No.1 Skin Clinic | Skinfinity Derma",
  description: "Best Dermatologist in Noida & Gurgaon | 4,500+ Verified reviews with 4.5 Rating | 5 Senior MD Dermatologists | US-FDA approved technology for Skin, Hair, Laser, Acne, Pigmentation & Anti-Aging treatments.",
  keywords: [
    "Dermatologist in Noida",
    "Dermatologist in Gurgaon",
    "Best skin clinic in Noida",
    "Laser hair removal Noida",
    "Acne scar treatment Noida",
    "Dr Ipshita Johri",
    "Hydrafacial Noida",
    "Hair loss treatment Noida",
    "Skin specialist Gurgaon"
  ],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  authors: [{ name: "Skinfinity Derma" }],
  creator: "Skinfinity Derma",
  metadataBase: new URL("https://www.skinfinityderma.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Dermatologist in Noida | No.1 Skin Clinic | Skinfinity Derma",
    description: "3,200+ Verified reviews with 4.8 Rating | 5 Senior MD Dermatologists | US-FDA approved technology for Skin, Hair, Laser, Acne & Anti-Aging.",
    url: "https://www.skinfinityderma.com",
    siteName: "Skinfinity Derma",
    images: [
      {
        url: "/images/hero/hero-banner.webp",
        width: 1200,
        height: 630,
        alt: "Skinfinity Derma Clinic",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Skinfinity Derma Clinic",
    "url": "https://www.skinfinityderma.com",
    "logo": "https://www.skinfinityderma.com/images/logo.webp",
    "image": "https://www.skinfinityderma.com/images/hero/hero-banner.webp",
    "description": "Premier Dermatology & Aesthetic Laser Clinic in Noida and Gurgaon led by Dr. Ipshita Johri.",
    "telephone": "+91-9871941444",
    "email": "skinfinityderma@gmail.com",
    "medicalSpecialty": "Dermatology",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "4500",
      "bestRating": "5"
    },
    "department": [
      {
        "@type": "MedicalClinic",
        "name": "Skinfinity Derma Noida Clinic",
        "telephone": "+91-9871941444",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Basement Floor, House B1, Sector 36, Near Logix Mall",
          "addressLocality": "Noida",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201303",
          "addressCountry": "IN"
        },
        "openingHours": "Mo-Su 10:00-20:00"
      },
      {
        "@type": "MedicalClinic",
        "name": "Skinfinity Derma Gurgaon Clinic",
        "telephone": "+91-8591110110",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "2nd Floor, SP1, Sector 28, Golf Course Road",
          "addressLocality": "Gurugram",
          "addressRegion": "Haryana",
          "postalCode": "122002",
          "addressCountry": "IN"
        },
        "openingHours": "Mo-Su 10:00-20:00"
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-100 selection:text-brand-900">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">
              {children}
            </main>
            <Footer />
            <FloatingActions />
            <AuthModal />
            <CartDrawer />
            <AppointmentModal />
            <EmiApplicationModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
