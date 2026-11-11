import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Franchise & Partner Opportunities | Skinfinity Derma Clinics",
  description:
    "Partner with North India's #1 aesthetic dermatology brand. Own a high-margin clinical dermatology franchise backed by Dr. Ipshita Johri, turnkey FICO & FOFO models, and 38%-50% annualized ROI.",
  alternates: {
    canonical: "/franchise",
  },
  openGraph: {
    title: "Franchise & Partner Opportunities | Skinfinity Derma Clinics",
    description:
      "Partner with North India's #1 aesthetic dermatology brand. Turnkey investment models, 38%-50% annualized ROI, and US-FDA technology.",
    url: "https://www.skinfinityderma.com/franchise",
    type: "website",
    images: [{ url: "/images/breadcrumbbanner/franchise.webp", alt: "Skinfinity Derma Franchise" }],
  },
};

export default function FranchiseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
