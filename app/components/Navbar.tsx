"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/SmartScanPlusLogo.png"
            alt="SmartScan+ Logo"
            width={70}
            height={70}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-600 tracking-tight">
            SmartScan+
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            Features
          </a>

          <a
            href="#science"
            className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            Dataset & Methodology
          </a>

          <a
            href="#download"
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-slate-800 transition-all hover:shadow-lg"
          >
            Download Demo APK
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-700"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen
          ? 'max-h-96 opacity-100 shadow-xl'
          : 'max-h-0 opacity-0 shadow-none'
      }`}>
        <div className="p-6 flex flex-col gap-4">
          <a href="#features" className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
            Features
          </a>
          <a href="#science" className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors" onClick={() => setIsOpen(false)}>
            Dataset & Methodology
          </a>
          <a
            href="#download"
            className="bg-purple-800 text-white w-full py-3 rounded-lg font-medium text-center hover:bg-purple-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Download Demo APK
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;