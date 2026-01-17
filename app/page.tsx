"use client";
import React, { useState, useEffect } from 'react';
import {
  Scan,
  Eye,
  Activity,
  ArrowRight,
  Brain,
  Database,
  Smartphone,
  CheckCircle,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- Scanner Animation Component ---
const ScannerAnimation = () => (
  <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
    <div className="absolute inset-0 border-2 border-slate-200 rounded-3xl overflow-hidden bg-slate-50">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [bg-size:16px_16px] animate-scan-bg"></div>
      <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-red-100 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-20 h-10 bg-blue-100 rounded-full blur-xl animate-pulse delay-75"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Scan className="text-slate-300 w-32 h-32 opacity-50" />
      </div>
    </div>

    <div className="absolute inset-x-0 h-0.5 bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.8)] z-10 animate-scan"></div>

    <div className="absolute -right-8 top-12 bg-white p-3 rounded-xl shadow-lg border border-slate-100 animate-float-slow z-20">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-xs font-bold text-slate-700">Melanoma: Low Risk</span>
      </div>
    </div>
    <div className="absolute -left-8 bottom-20 bg-white p-3 rounded-xl shadow-lg border border-slate-100 animate-float-delayed z-20">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="text-xs font-bold text-slate-700">Anemia: Low Risk</span>
      </div>
    </div>
  </div>
);

// --- Feature Card ---
type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tags: string[];
};

const FeatureCard = ({ icon, title, desc, tags }: FeatureCardProps) => (
  <div className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 ease-out"></div>
    <div className="relative z-10">
      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-6 leading-relaxed">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// --- Stat Badge ---
type StatBadgeProps = {
  value: string;
  label: string;
};

const StatBadge = ({ value, label }: StatBadgeProps) => (
  <div className="text-center">
    <div className="text-[25px] md:text-4xl font-bold text-blue-600 mb-1">{value}</div>
    <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{label}</div>
  </div>
);

// --- Main Landing Page ---
export default function SmartScanLanding() {
  return (
    <div className="min-h-screen bg-white poppins-regular selection:bg-teal-100 selection:text-teal-900">
      <style>{`
        @keyframes scan {0% { top: 10%; opacity: 0; }10% { opacity: 1; }90% { opacity: 1; }100% { top: 90%; opacity: 0; }}
        @keyframes float {0%,100% { transform: translateY(0px); }50% { transform: translateY(-10px); }}
        .animate-scan { animation: scan 4s ease-in-out infinite; }
        .animate-float-slow { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out infinite 2s; }
        .animate-gradient { background: conic-gradient(from 0deg, #eab308, #7f1d1d, #eab308); background-clip: text; -webkit-background-clip: text; animation: 3s linear infinite; }
      `}</style>

      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
          <div className="absolute top-0 left-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-70 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Updated with ISIC 2025 Dataset
              </div>
              
              <h1 className="text-4xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                AI-Based Screening Prototype <br />
                for <span className="text-transparent animate-gradient">Skin Lesions & Anemia</span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                An academic research prototype exploring early risk screening for dermatological conditions and anemia using computer vision techniques.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                  <Smartphone size={20} /> Get the App
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:border-teal-200 hover:bg-teal-50 transition-all flex items-center justify-center gap-2">
                  View Details
                </button>
              </div>
            </div>

            <div className="lg:w-1/2 w-full flex justify-center">
              <ScannerAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBadge value="11" label="Lesion Categories" />
            <StatBadge value="10k+" label="Training Samples" />
            <StatBadge value="Research" label="Prototype Stage" />
            <StatBadge value="On-Device" label="Image Analysis" />
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Dual-Module Screening Architecture</h2>
            <p className="text-slate-600">
              SmartScan+ integrates two independent AI models to explore dermatological and hematological risk screening as part of an academic study.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <FeatureCard 
              icon={<Activity size={24} />}
              title="Skin Lesion Screening"
              desc="Explores visual patterns across 11 categories of skin lesions using publicly available dermatoscopic datasets. Outputs indicate relative risk, not diagnosis."
              tags={['Melanoma', 'Basal Cell', 'Vascular', 'Benign Nevus', 'Dermatofibroma', 'Actinic Keratosis', '...5+']}
            />
            <FeatureCard 
              icon={<Eye size={24} />}
              title="Non-Invasive Anemia Screening"
              desc="Analyzes conjunctival pallor from eye images to study visual indicators associated with anemia. Designed for experimental and educational use."
              tags={['Conjunctival Pallor', 'Non-Invasive', 'Experimental']}
            />
          </div>
        </div>
      </section>

      {/* --- DATASET --- */}
      <section id="science" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-6">
                <Database className="text-blue-400" size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Trained on Public Research Datasets</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                SmartScan+ is trained using publicly available, peer-reviewed datasets, including <strong>MILK10k</strong> from the <strong>ISIC Archive (2025)</strong>. These datasets provide labeled reference data for academic experimentation.
              </p>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wider">Citation</h4>
                <p className="text-slate-300 text-sm leading-relaxed font-mono">
                  MILK study team. MILK10k. ISIC Archive, 2025, doi:10.34970/648456.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- APP DEMO / CTA --- */}
      <section id="app" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Pocket-Sized Precision</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-12">
            {/* Step 1 */}
            <div className="flex-1 max-w-sm group">
              <div className="bg-white p-2 rounded-3xl shadow-lg mb-6 border border-slate-100 transition-transform group-hover:-translate-y-2">
                 <div className="h-48 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Smartphone className="text-purple-800 animate-pulse w-16 h-16" />
                 </div>
              </div>
              <h3 className="text-xl text-purple-800 font-bold mb-2">1. Snap a Photo</h3>
              <p className="text-slate-500 text-sm">Use the app camera to capture a close-up of the skin lesion or eye conjunctiva.</p>
            </div>

             <ArrowRight className="hidden md:block text-slate-300" />

            {/* Step 2 */}
            <div className="flex-1 max-w-sm group">
              <div className="bg-white p-2 rounded-3xl shadow-lg mb-6 border border-slate-100 transition-transform group-hover:-translate-y-2">
                 <div className="h-48 bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <Brain className="text-blue-500 animate-pulse w-16 h-16" />
                    <div className="absolute inset-0 bg-linear-to-t from-blue-500/10 to-transparent"></div>
                 </div>
              </div>
              <h3 className="text-xl text-blue-800 font-bold mb-2">2. AI Analysis</h3>
              <p className="text-slate-500 text-sm">Our dual-core engine processes the image against 10,000+ clinical samples instantly.</p>
            </div>

            <ArrowRight className="hidden md:block text-slate-300" />

            {/* Step 3 */}
            <div className="flex-1 max-w-sm group">
              <div className="bg-white p-2 rounded-3xl shadow-lg mb-6 border border-slate-100 transition-transform group-hover:-translate-y-2">
                 <div className="h-48 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <FileText className="text-purple-800 animate-pulse w-16 h-16" />
                 </div>
              </div>
              <h3 className="text-xl text-purple-800 font-bold mb-2">3. Instant Report</h3>
              <p className="text-slate-500 text-sm">Receive a risk assessment and detailed PDF report to share with your doctor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-4">
        <div className="container mx-auto px-6">
          <div className="bg-blue-500 rounded-[2.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Explore AI-Based Health Screening (Research Prototype)
              </h2>
              <p className="text-blue-100 text-lg mb-10">
                SmartScan+ is an academic AI project for experimental risk screening using computer vision.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://github.com/AdeelAliYousaf/smartscan-plus"
                  className="px-8 py-4 bg-white text-blue-800 rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
                >
                  View Source Code
                </a>
                <a
                  href="/download"
                  className="px-8 py-4 bg-blue-900 text-white border border-blue-500 rounded-xl font-bold hover:bg-blue-800 transition-all"
                >
                  Download Demo APK
                </a>
              </div>
              <p className="mt-8 text-xs text-blue-200 opacity-70">
                *SmartScan+ is a research prototype, not a certified medical device. Results are informational only and should not replace professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
