"use client";

import React, { useState, useRef, useEffect } from "react";
import { Star, Play, ChevronLeft, ChevronRight, Stethoscope, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getReviews, getVideos } from "@/lib/api";

function GoogleGIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

const DOCTORS_SAY_VIDEOS = [
  {
    id: "doc-vid-1",
    videoId: "1WmieekXjG4",
    title: "US-FDA Triple Wavelength Laser Protocol Explained",
    doctor: "Dr. Ipshita Johri",
    designation: "Founder & Chief Dermatologist",
    topic: "Laser Hair Reduction",
  },
  {
    id: "doc-vid-2",
    videoId: "h3r2K76Gb2E",
    title: "Subcision & MNRF for Deep Acne Scar Remodeling",
    doctor: "Dr. Sukriti Sharma",
    designation: "Senior Consultant Dermatologist",
    topic: "Acne Scar Revision",
  },
  {
    id: "doc-vid-3",
    videoId: "hwjd6tDApmI",
    title: "Why Sugarcane HydraFacial MD Suits Indian Skin",
    doctor: "Dr. Ipshita Johri",
    designation: "Founder & Chief Dermatologist",
    topic: "Medi-Facials & Hydration",
  },
  {
    id: "doc-vid-4",
    videoId: "vTJo_UtYjhI",
    title: "Autologous GFC vs PRP for Pattern Hair Thinning",
    doctor: "Dr. Shradha",
    designation: "Consultant Dermatologist & Trichologist",
    topic: "Hair Restoration",
  },
  {
    id: "doc-vid-5",
    videoId: "FSDkGE-H3_M",
    title: "Non-Surgical Facial Contouring & Anti-Ageing Science",
    doctor: "Dr. Ipshita Johri",
    designation: "Founder & Chief Dermatologist",
    topic: "Aesthetic Dermatology",
  },
];

const PATIENT_TESTIMONIALS = [
  { name: "Anjali Kohli", clinic: "Noida Clinic", treatment: "Full Body Laser", text: "The full body laser session was excellent. The therapist was highly skilled and made the experience comfortable and effective under dermatologist supervision.", rating: 5 },
  { name: "Simran Paul", clinic: "Gurgaon Clinic", treatment: "Laser Hair Reduction", text: "I've had a great experience with my laser hair reduction sessions. My therapist is highly professional, gentle, and always makes me feel comfortable.", rating: 5 },
  { name: "Pooja Mehta", clinic: "Noida Clinic", treatment: "Acne Scar Revision", text: "The clinic is very clean and hygienic. Dr. Ipshita understands your skin concerns thoroughly. My acne scars have reduced significantly!", rating: 5 },
  { name: "Arjun Singh", clinic: "Gurgaon Clinic", treatment: "GFC Hair Therapy", text: "Got GFC hair treatment done and I'm very happy with the progress. The team is supportive and the sessions are comfortable. Definitely recommend.", rating: 5 },
  { name: "Nisha Kapoor", clinic: "Noida Clinic", treatment: "Sugarcane HydraFacial", text: "Amazing experience at Skinfinity Derma! The staff is so welcoming and the results are phenomenal. My skin has never looked better after the HydraFacial session.", rating: 5 },
  { name: "Deepak Verma", clinic: "Noida Clinic", treatment: "Hair Fall Protocol", text: "Very professional clinic. The doctors are knowledgeable and the treatment plans are well-explained. Highly satisfied with my hair fall treatment results.", rating: 5 },
  { name: "Ravi Malik", clinic: "Gurgaon Clinic", treatment: "Laser Hair Reduction", text: "The result of laser treatment is very nice. I have tried LHR from different places but find this the best. Hygienic suites and ethical doctors.", rating: 5 },
  { name: "Alka Singh", clinic: "Noida Clinic", treatment: "Medi-Facial Glow", text: "Thank you for the wonderful clinical facial! My skin feels so much cleaner, softer, and glowing now. Looking forward to my next visit!", rating: 5 },
];

function DoctorVideoCard({ item }: { item: typeof DOCTORS_SAY_VIDEOS[0] }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`;
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      <div className="relative aspect-[9/14] bg-slate-900 overflow-hidden">
        {!playing ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/30" />
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-extrabold text-[#006d6e]">
                <Stethoscope className="w-3 h-3" />
                <span>{item.topic}</span>
              </span>
            </div>
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center z-10"
              aria-label={`Play ${item.title}`}
            >
              <div className="w-12 h-12 rounded-full bg-[#008081] group-hover:bg-teal-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </button>
            <div className="absolute bottom-3 left-3 right-3 text-white z-10 space-y-1">
              <div className="text-xs font-extrabold leading-snug line-clamp-2">{item.title}</div>
              <div className="text-[10px] text-teal-300 font-semibold">{item.doctor}</div>
            </div>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&controls=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        )}
      </div>
    </div>
  );
}

function PatientTestimonialCard({ review }: { review: typeof PATIENT_TESTIMONIALS[0] }) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex text-amber-400">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] font-bold text-[#006d6e] bg-[#e8f6f3] px-2.5 py-0.5 rounded-full">
            {review.clinic}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-xs font-extrabold text-slate-900">{review.name}</div>
          <div className="text-[10px] text-slate-500">{review.treatment}</div>
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
          <GoogleGIcon className="w-3.5 h-3.5" />
          <span>Verified Review</span>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsAndShortsSection() {
  const { adminSettings } = useAuth();
  const doctorsScrollRef = useRef<HTMLDivElement>(null);
  const patientsScrollRef = useRef<HTMLDivElement>(null);

  const [videosList, setVideosList] = useState(DOCTORS_SAY_VIDEOS);
  const [reviewsList, setReviewsList] = useState(PATIENT_TESTIMONIALS);

  useEffect(() => {
    let active = true;
    getVideos("doctor_video").then((vids) => {
      if (active && vids && vids.length > 0) {
        setVideosList(
          vids.map((v) => ({
            id: String(v.id),
            videoId: v.videoId,
            title: v.title,
            doctor: v.doctor || "Dr. Ipshita Johri",
            designation: "Dermatology Specialist",
            topic: v.category || "Clinical Care",
          }))
        );
      }
    }).catch(() => {});

    getReviews().then((rev) => {
      if (active && rev && rev.reviews && rev.reviews.length > 0) {
        setReviewsList(
          rev.reviews.map((r) => ({
            name: r.patientName,
            clinic: r.clinicLocation ? (r.clinicLocation.includes("Clinic") ? r.clinicLocation : `${r.clinicLocation} Clinic`) : "Noida Clinic",
            treatment: r.treatment || "Clinical Dermatology",
            text: r.reviewText,
            rating: Math.round(r.rating || 5),
          }))
        );
      }
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-10 lg:py-14 bg-gradient-to-b from-white via-[#FAF7F2]/60 to-white overflow-hidden space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ----------------------------------------------------------------- */}
        {/* VERIFIED GOOGLE BUSINESS PROFILE RATING SUMMARY BANNER (4.5/5, 4,500+) */}
        {/* ----------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
              <GoogleGIcon className="w-9 h-9" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Google Business Profile Summary</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                Skinfinity Derma — Noida &amp; Gurgaon Clinics
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Trusted by thousands of patients for ethical, US-FDA approved dermatology, laser &amp; trichology care.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-[#f8fafb] px-6 py-4 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                {adminSettings.googleRating}<span className="text-base font-bold text-slate-500">/5</span>
              </div>
              <div className="flex items-center justify-center text-amber-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Overall Rating
              </span>
            </div>

            <div className="h-12 w-px bg-slate-200" />

            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#008081] font-serif">
                {adminSettings.googleReviewsCount}
              </div>
              <span className="text-xs font-bold text-slate-700 block mt-0.5">
                Verified Reviews
              </span>
              <span className="text-[10px] text-slate-500">
                Across Noida &amp; Gurgaon
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 1: DOCTORS' SAY (Dedicated Doctor Explanations & Videos) */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#006d6e] bg-[#e8f6f3] px-3.5 py-1 rounded-full border border-[#d2eee7] mb-2">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Clinical Insights &amp; Video Explanations</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Doctors&apos; Say
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Watch our board-certified MD Dermatologists explain evidence-based procedures, safety protocols, and clinical outcomes.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => doctorsScrollRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
                aria-label="Scroll doctor videos left"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => doctorsScrollRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
                aria-label="Scroll doctor videos right"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={doctorsScrollRef}
            className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none scroll-smooth snap-x snap-mandatory"
          >
            {videosList.map((item) => (
              <div key={item.id} className="flex-none w-[225px] sm:w-[245px] lg:w-auto snap-start">
                <DoctorVideoCard item={item as any} />
              </div>
            ))}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* SECTION 2: PATIENT TESTIMONIALS (Genuine Patient Experiences Only) */}
        {/* ----------------------------------------------------------------- */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200 mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Genuine Patient Experiences ({adminSettings.googleRating}/5 • {adminSettings.googleReviewsCount} Reviews)</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Patient Testimonials
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Unedited feedback from patients treated at Skinfinity Derma Noida and Gurgaon.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => patientsScrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
                aria-label="Scroll patient testimonials left"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => patientsScrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
                aria-label="Scroll patient testimonials right"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-[#e8f6f3] hover:border-[#008081] hover:text-[#006d6e] shadow-sm flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={patientsScrollRef}
            className="flex lg:grid lg:grid-cols-4 gap-5 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none scroll-smooth snap-x snap-mandatory items-stretch"
          >
            {reviewsList.map((review, idx) => (
              <div key={idx} className="flex-none w-[290px] sm:w-[320px] lg:w-auto snap-start">
                <PatientTestimonialCard review={review as any} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
