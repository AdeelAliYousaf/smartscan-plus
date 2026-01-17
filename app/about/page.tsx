"use client";
import React from 'react';
import { GraduationCap, Users, Award, BookOpen, Code, Database, Brain } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold mb-6">
            <BookOpen size={16} />
            Final Year Project (FYP)
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600">SmartScan+</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            SmartScan+ is an AI-powered medical screening tool developed as a Final Year Project (FYP) for the BS Computer Science program at University of Sialkot (USKT), combining computer vision and medical datasets for early detection of skin lesions and anemia.
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Project Overview</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                SmartScan+ demonstrates the integration of advanced computer science techniques into real-world healthcare applications, showcasing the potential of artificial intelligence to improve accessibility and accuracy in early disease detection.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Analysis</h3>
                    <p className="text-slate-600">Dual neural networks trained on validated medical datasets for accurate detection of skin lesions and anemia.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Research-Based Datasets</h3>
                    <p className="text-slate-600">Includes MILK10k (ISIC 2025 Archive) and publicly available conjunctiva images for anemia screening, ensuring scientific credibility.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                    <Code size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Full-Stack Implementation</h3>
                    <p className="text-slate-600">Comprehensive solution from mobile app development to web dashboard and database management using modern technologies.</p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Technical Highlights</h3>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>Computer vision for medical image analysis</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-purple-500 rounded-full"></div>Machine learning model training and validation</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"></div>Mobile application development</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-orange-500 rounded-full"></div>Web dashboard for clinical review</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 bg-red-500 rounded-full"></div>Database design and management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic & Supervision */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Academic & Supervision</h2>
              <p className="text-lg text-slate-600">
                Developed as a Final Year Project (FYP) for the BS Computer Science program at University of Sialkot (USKT), under the guidance of qualified faculty.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Project Info */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-blue-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Project Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Course</span>
                    <span className="font-medium text-slate-900">BS Computer Science</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Type</span>
                    <span className="font-medium text-slate-900">Final Year Project (FYP)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">University</span>
                    <span className="font-medium text-slate-900">University of Sialkot (USKT)</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Year</span>
                    <span className="font-medium text-slate-900">2026</span>
                  </div>
                </div>
              </div>

              {/* Supervision */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="text-purple-600" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Project Supervisor</h3>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-600">Mr. Osama Waheed</p>
                  <p className="text-sm text-slate-500">Department of Computer Science, University of Sialkot (USKT)</p>
                  <p className="text-sm text-slate-500">Email: osama.waheed@uskt.edu.pk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-semibold mb-6">
              <Users size={16} />
              Development Team
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Meet the Innovators</h2>
            <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto">
              A dedicated team of computer science students transforming academic knowledge into practical healthcare solutions.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {/* Team Member 1 */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  AY
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Adeel Ali Yousaf</h3>
                <p className="text-blue-600 font-medium mb-2">Lead Developer – AI/ML & Mobile</p>
                <p className="text-sm text-slate-600 mb-3">Roll No: 24010102-011</p>
                <p className="text-sm text-slate-500">Specialized in computer vision, AI/ML modeling, and mobile development</p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  AH
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Ameer Hamza</h3>
                <p className="text-purple-600 font-medium mb-2">Backend Developer & Web Dashboard</p>
                <p className="text-sm text-slate-600 mb-3">Roll No: 24010102-012</p>
                <p className="text-sm text-slate-500">Focused on server-side architecture, database design, and web dashboard implementation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl leading-relaxed mb-8 text-blue-100">
              Bridging the gap between AI research and accessible healthcare solutions, empowering communities with early disease detection capabilities through innovative technology.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
              >
                Explore SmartScan+
              </Link>
              <Link
                href="#contact"
                className="px-8 py-4 bg-blue-500 text-white border border-blue-400 rounded-xl font-semibold hover:bg-blue-400 transition-all"
              >
                Contact Supervisor / Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
