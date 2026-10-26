"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Upload, 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  Calendar, 
  BarChart3,
  Lock,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function HairGraftCalculator() {
  const { addLead } = useAuth();
  // Maximum 5 grades: Grade 1 through Grade 5 (No Grade 6 or Grade 7)
  const [grade, setGrade] = useState(2);
  const [age, setAge] = useState("29");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [baldnessPattern, setBaldnessPattern] = useState("Hairline Recession");
  const [hairThickness, setHairThickness] = useState<"Thick" | "Medium" | "Thin">("Medium");
  const [hairLossDuration, setHairLossDuration] = useState("1 – 3 Years");
  const [includeGfc, setIncludeGfc] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [patient, setPatient] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [leadCaptured, setLeadCaptured] = useState(false);
  const [formError, setFormError] = useState("");

  // Strictly Grade 1 to Grade 5 definitions
  const grades = [
    { grade: 1, title: "Grade 1", desc: "Minimal hairline recession with early follicular thinning.", retention: 85, crown: 92 },
    { grade: 2, title: "Grade 2", desc: "Triangular recessions at the frontotemporal hairline.", retention: 72, crown: 85 },
    { grade: 3, title: "Grade 3", desc: "Deep frontal recession with noticeable temple thinning.", retention: 58, crown: 74 },
    { grade: 4, title: "Grade 4", desc: "Pronounced frontal recession with crown/vertex thinning.", retention: 44, crown: 55 },
    { grade: 5, title: "Grade 5", desc: "Enlarged fronto-vertex thinning separated by a narrow hair band.", retention: 32, crown: 38 },
  ];

  const baseGraftsByGrade: Record<number, { Thick: number; Medium: number; Thin: number }> = {
    1: { Thick: 850, Medium: 1050, Thin: 1250 },
    2: { Thick: 1300, Medium: 1550, Thin: 1850 },
    3: { Thick: 1850, Medium: 2150, Thin: 2550 },
    4: { Thick: 2450, Medium: 2850, Thin: 3350 },
    5: { Thick: 3100, Medium: 3550, Thin: 4100 },
  };

  const currentGradeObj = grades[grade - 1];
  const calculatedGrafts = baseGraftsByGrade[grade][hairThickness];
  const pricePerGraft = 25;
  const baseCost = calculatedGrafts * pricePerGraft;
  const gfcCost = includeGfc ? 12000 : 0;
  const totalCost = baseCost + gfcCost;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = patient.phone.replace(/\D/g, "");
    if (!patient.name.trim() || patient.name.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }
    if (cleanPhone.length < 10) {
      setFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setFormError("");

    addLead({
      toolType: "Hair & Baldness Assessment",
      name: patient.name.trim(),
      phone: cleanPhone,
      gender,
      age,
      baldnessGrade: `Grade ${grade}`,
      baldnessPattern,
      hairThickness,
      hairLossDuration,
      estimateSummary: `Grade ${grade} (${baldnessPattern}, ${hairThickness} Hair) • ~${calculatedGrafts.toLocaleString()} Grafts • Est. ₹${totalCost.toLocaleString()}`,
    });

    setLeadCaptured(true);
  };

  return (
    <section id="hair-calculator" className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-800/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950 px-3.5 py-1 rounded-full border border-brand-800">
            By Our Team of Dermatologists • Grades 1 to 5
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-2.5 font-serif">
            Hair &amp; Baldness Assessment Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Evaluate your Grade of Baldness (Grade 1–5), pattern of thinning, hair shaft thickness, and duration to view personalized follicle graphs and graft estimates.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-slate-800/70 p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6 backdrop-blur-sm">
            
            {/* Age & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  1. Age (Years):
                </label>
                <input
                  type="number"
                  min={16}
                  max={85}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700 text-xs font-bold text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  2. Gender:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Male", "Female", "Other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        gender === g
                          ? "bg-brand-500 text-slate-950 shadow-md"
                          : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grade of Baldness Selector (Strictly Grade 1 to Grade 5) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  3. Select Grade of Baldness (Grade 1 – Grade 5):
                </label>
                <span className="text-xs font-bold text-amber-400">
                  Grade {grade} Selected
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      grade === g
                        ? "bg-brand-500 text-slate-950 shadow-md font-extrabold"
                        : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    Grade {g}
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-400 mt-2 italic">
                {currentGradeObj.desc}
              </p>
            </div>

            {/* Pattern of Baldness */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                4. Pattern of Baldness:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  "Hairline Recession",
                  "Crown Thinning",
                  "Top Thinning",
                  "Diffuse Thinning"
                ].map((pat) => (
                  <button
                    key={pat}
                    type="button"
                    onClick={() => setBaldnessPattern(pat)}
                    className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all ${
                      baldnessPattern === pat
                        ? "bg-brand-900/60 border-brand-400 text-white shadow-md"
                        : "bg-slate-700/40 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {pat}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Thickness & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  5. Hair Thickness:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Thick", "Medium", "Thin"] as const).map((th) => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => setHairThickness(th)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        hairThickness === th
                          ? "bg-brand-900/60 border-brand-400 text-white"
                          : "bg-slate-700/40 border-slate-700 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  6. Since when has hair loss occurred?
                </label>
                <select
                  value={hairLossDuration}
                  onChange={(e) => setHairLossDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-slate-700 text-xs font-bold text-white"
                >
                  <option value="Less than 6 Months">Less than 6 Months</option>
                  <option value="6 – 12 Months">6 – 12 Months</option>
                  <option value="1 – 3 Years">1 – 3 Years</option>
                  <option value="More than 3 Years">More than 3 Years</option>
                </select>
              </div>
            </div>

            {/* Add-on GFC toggle */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">
                  Add 3x Autologous GFC Cellular Therapy (Recommended)
                </span>
                <span className="text-[11px] text-slate-400">
                  Pre-conditions the scalp bed and enhances graft survival &amp; shaft thickness.
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeGfc}
                onChange={(e) => setIncludeGfc(e.target.checked)}
                className="w-5 h-5 accent-brand-500 rounded cursor-pointer shrink-0"
              />
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Upload Scalp Photograph for Dermatologist Review (Optional)
              </label>
              <div className="relative border-2 border-dashed border-slate-600 hover:border-brand-400 rounded-2xl p-4 text-center bg-slate-900/40 transition-colors">
                {uploadedImage ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-brand-400">
                      <Image src={uploadedImage} alt="Scalp preview" fill className="object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Photo Attached for Trichologist Analysis</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="text-[10px] text-rose-400 underline mt-0.5"
                      >
                        Remove / Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-300 font-medium">
                      Drag &amp; Drop scalp picture or <span className="text-brand-400 underline cursor-pointer">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">JPG, PNG up to 10MB (Kept strictly private)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Graphs & Lead Capture before Estimate */}
          <div className="lg:col-span-5 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col justify-between space-y-6">
            {/* Live Grade Graphs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded">
                  Grade {grade} Assessment Graph
                </span>
                <span className="text-[11px] font-bold text-slate-600">
                  {baldnessPattern}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-brand-700" />
                  <span>Follicle Retention vs. Restoration Potential</span>
                </div>

                <div className="space-y-2.5 text-[11px]">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Frontal / Hairline Follicle Density</span>
                      <span className="font-bold text-slate-900">{currentGradeObj.retention}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${currentGradeObj.retention}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Crown / Vertex Follicle Retention ({hairThickness})</span>
                      <span className="font-bold text-slate-900">{currentGradeObj.crown}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: `${currentGradeObj.crown}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-600">Target Coverage with FUE + GFC</span>
                      <span className="font-bold text-emerald-700">{Math.min(96, currentGradeObj.retention + 38)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(96, currentGradeObj.retention + 38)}%` }} />
                    </div>
                  </div>
                </div>

                {/* Bar chart across Grade 1 to Grade 5 */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-5 gap-1.5 items-end h-20 pt-2">
                    {grades.map((g) => {
                      const graftsForG = baseGraftsByGrade[g.grade][hairThickness];
                      const hPct = Math.round((graftsForG / 4100) * 100);
                      const active = g.grade === grade;
                      return (
                        <div key={g.grade} className="flex flex-col items-center justify-end h-full gap-1">
                          <span className={`text-[9px] font-bold ${active ? "text-brand-700" : "text-slate-400"}`}>
                            {graftsForG}
                          </span>
                          <div
                            className={`w-full rounded-t ${active ? "bg-brand-700" : "bg-slate-200"}`}
                            style={{ height: `${hPct}%` }}
                          />
                          <span className={`text-[9px] font-bold ${active ? "text-brand-700" : "text-slate-500"}`}>
                            G{g.grade}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Capture Gate Before Personalized Treatment Estimate */}
            {!leadCaptured ? (
              <form onSubmit={handleSubmitLead} className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800">
                  <Lock className="w-3.5 h-3.5 text-brand-700" />
                  <span>Unlock Personalized Graft &amp; Cost Estimate</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Enter your name and mobile number to reveal your customized Grade {grade} graft requirement and treatment estimate.
                </p>

                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={patient.name}
                  onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
                <input
                  type="tel"
                  required
                  placeholder="10-digit Mobile Number *"
                  value={patient.phone}
                  onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>View Personalized Treatment Estimate</span>
                </button>
              </form>
            ) : (
              /* Revealed Personalized Estimate (No Repeated Form) */
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                    Unlocked for {patient.name}
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                    Estimated: {calculatedGrafts.toLocaleString()} Grafts
                  </h3>
                </div>

                <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Grade of Baldness:</span>
                    <span className="font-semibold text-slate-900">Grade {grade} ({baldnessPattern})</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Hair Thickness &amp; Duration:</span>
                    <span className="font-semibold text-slate-900">{hairThickness} • {hairLossDuration}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Follicular Unit Extraction:</span>
                    <span className="font-semibold text-slate-900">₹{baseCost.toLocaleString()}</span>
                  </div>
                  {includeGfc && (
                    <div className="flex justify-between text-brand-700 font-medium">
                      <span>GFC Booster Protocol (3 Sessions):</span>
                      <span>+₹12,000</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                    <span>Total Estimated Investment:</span>
                    <span className="text-brand-700">₹{totalCost.toLocaleString()}*</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  * Educational guidance only; not a definitive medical diagnosis. Final graft counts are confirmed during in-clinic microscopic trichoscopy.
                </p>

                <a
                  href="/contact-us#appointment_form"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 flex items-center justify-center gap-2 text-center"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Appointment Request</span>
                </a>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
