"use client";

import React, { useEffect, useRef, useState } from "react";

interface EyeRegionBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PrivacyClinicalImageProps {
  src: string;
  alt: string;
  className?: string;
  blurEyeZone?: boolean;
  watermarkText?: string;
}

/**
 * Exact eye-only coordinates (normalized 0..1) for each clinical result image
 * so that ONLY the patient's eyes are blurred while hair, forehead, nose, and cheeks remain 100% untouched.
 */
function getEyeRegionsForImage(src: string): EyeRegionBox[] {
  const lower = src.toLowerCase();

  // Scalp / crown hair photos have no visible eyes
  if (lower.includes("hair")) {
    return [];
  }

  // 1. Acne & Scars (3/4 right profile: near eye + far right eye)
  if (lower.includes("acne")) {
    return [
      { x: 0.51, y: 0.17, w: 0.27, h: 0.13 },
      { x: 0.87, y: 0.22, w: 0.13, h: 0.11 },
    ];
  }

  // 2. Pigmentation & Melasma (close-up cheek profile: eye is at top-right)
  if (lower.includes("pigmentation")) {
    return [{ x: 0.62, y: 0.08, w: 0.28, h: 0.17 }];
  }

  // 3. Facial Aesthetics (front-facing portrait: left eye + right eye)
  if (lower.includes("facial")) {
    return [
      { x: 0.24, y: 0.30, w: 0.23, h: 0.12 },
      { x: 0.57, y: 0.30, w: 0.23, h: 0.12 },
    ];
  }

  // 4. Laser Resurfacing (side profile: eye is at top-right corner)
  if (lower.includes("laser")) {
    return [{ x: 0.69, y: 0.01, w: 0.21, h: 0.12 }];
  }

  // 5. Sugarcane HydraFacial (3/4 right profile: near eye + far right eye)
  if (lower.includes("hydrafacial")) {
    return [
      { x: 0.44, y: 0.11, w: 0.26, h: 0.14 },
      { x: 0.80, y: 0.16, w: 0.12, h: 0.11 },
    ];
  }

  // Fallback for any other facial portrait
  return [
    { x: 0.24, y: 0.30, w: 0.23, h: 0.12 },
    { x: 0.57, y: 0.30, w: 0.23, h: 0.12 },
  ];
}

export default function PrivacyClinicalImage({
  src,
  alt,
  className = "",
  blurEyeZone = true,
  watermarkText = "SKINFINITY DERMA • VERIFIED CLINICAL OUTCOME",
}: PrivacyClinicalImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (!isMounted || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 600;
      canvas.width = w;
      canvas.height = h;

      // 1. Draw full sharp clinical base image
      ctx.drawImage(img, 0, 0, w, h);

      // 2. Bake natural Gaussian blur strictly over the exact eye regions
      const eyeBoxes = blurEyeZone ? getEyeRegionsForImage(src) : [];
      eyeBoxes.forEach((box) => {
        const rx = Math.round(w * box.x);
        const ry = Math.round(h * box.y);
        const rw = Math.round(w * box.w);
        const rh = Math.round(h * box.h);

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          rx + rw / 2,
          ry + rh / 2,
          rw / 2,
          rh / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.clip();

        ctx.filter = "blur(12px)";
        ctx.drawImage(img, 0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        ctx.filter = "none";
        ctx.restore();
      });

      // 3. Bake subtle clinical watermark directly into the pixel buffer
      ctx.save();
      const fontSize = Math.max(11, Math.round(w * 0.02));
      ctx.font = `700 ${fontSize}px sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
      ctx.strokeStyle = "rgba(15, 23, 42, 0.14)";
      ctx.lineWidth = 1;
      ctx.textAlign = "center";

      ctx.translate(w * 0.5, h * 0.8);
      ctx.rotate((-10 * Math.PI) / 180);
      ctx.strokeText(watermarkText, 0, 0);
      ctx.fillText(watermarkText, 0, 0);
      ctx.restore();

      setLoaded(true);
    };

    return () => {
      isMounted = false;
    };
  }, [src, blurEyeZone, watermarkText]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      onContextMenu={(e) => e.preventDefault()}
      className={`w-full h-full object-cover transition-opacity duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
