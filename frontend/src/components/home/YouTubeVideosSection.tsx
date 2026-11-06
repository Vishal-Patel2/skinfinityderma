"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, X, Youtube, ArrowRight } from "lucide-react";
import { YOUTUBE_VIDEOS } from "@/data/clinicData";

export default function YouTubeVideosSection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section className="py-16 lg:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800 mb-2">
              <Youtube className="w-3.5 h-3.5" />
              <span>Skinfinity YouTube Channel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif">
              Clinical Demos & Patient Video Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Watch real patient journeys, live procedure demonstrations, and honest medical guidance explained directly by Dr. Ipshita Johri and our senior MD dermatologists.
            </p>
          </div>

          <a
            href="https://www.youtube.com/channel/UCnlVU02sraO4-Saptc7gIJA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 shrink-0"
          >
            <span>Subscribe on YouTube (Official Channel)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {YOUTUBE_VIDEOS.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/80 rounded-3xl overflow-hidden border border-slate-700 hover:border-red-500/50 shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Video Thumbnail with Play Button */}
                <div 
                  className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedVideo(item.videoId)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>

                  <span className="absolute top-3 left-3 bg-slate-950/80 text-white text-[10px] font-bold px-2.5 py-1 rounded backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-white group-hover:text-red-300 transition-colors font-serif leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-400" />
                    <span>Presenter: {item.doctor}</span>
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedVideo(item.videoId)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-slate-700/60 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Video Consultation</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <Youtube className="w-4 h-4" />
                <span>Skinfinity Derma Video Patient Consultation</span>
              </span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
