export interface ClinicLocation {
  id: string;
  name: string;
  address: string;
  landmark: string;
  phone: string;
  email: string;
  timings: string;
  mapEmbedUrl: string;
  doctors: string[];
  image: string;
  facilities: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  treatmentName: string;
  doctorName: string;
  rating: number;
  date: string;
  review: string;
  clinic: string;
  verified: boolean;
}

export interface RealResult {
  id: string;
  treatmentName: string;
  category: string;
  patientGender: string;
  patientAge: number;
  sessions: number;
  beforeImage: string;
  afterImage: string;
  summary: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  doctorName: string;
  views: string;
  embedId: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  metrics: string;
  image: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  badge: string;
  priceAnnual: number;
  discountPct: number;
  features: string[];
  recommended?: boolean;
}
