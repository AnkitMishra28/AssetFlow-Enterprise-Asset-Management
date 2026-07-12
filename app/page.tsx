"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Box } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 relative overflow-hidden font-sans">
      
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#714B67]/5 to-transparent">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#714B67]/20 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-[#714B67]/15 to-transparent blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-[#714B67]/10 blur-[100px]" />
      </div>

      {/* Navigation Bar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-8">
        <nav className="flex items-center justify-between w-full max-w-6xl px-8 py-3.5 rounded-full bg-white/70 backdrop-blur-xl border border-slate-200 shadow-sm shadow-slate-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-odoo-50 border border-odoo-100 flex items-center justify-center shadow-sm">
              <Box className="w-4 h-4 text-odoo-600" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">AssetFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Discover</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Modules</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center">
            <Link href="/login" className="bg-slate-900 hover:bg-slate-800 px-6 py-2 rounded-full text-sm font-semibold transition-all text-white shadow-md shadow-slate-900/10">
              Sign In
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 pt-32 pb-32 max-w-5xl mx-auto">
        
        {/* Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-odoo-50 border border-odoo-200 text-sm font-bold text-odoo-700 shadow-sm">
            🚀 The Modern standard for ERP
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900"
        >
          Simplify Asset Tracking with <br className="hidden md:block" />
          <span className="text-[#714B67]">
            Intelligent ERP
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-500 max-w-3xl mb-12 leading-relaxed font-medium"
        >
          Digitize your physical assets, centralize resource bookings, and streamline maintenance workflows for your entire organization.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-24"
        >
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#714B67] to-[#5a3c52] hover:from-[#5a3c52] hover:to-[#714B67] text-white font-bold shadow-lg shadow-[#714B67]/20 transition-all transform hover:-translate-y-0.5">
            Get Started
          </Link>
          <a href="#" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-sm">
            View Live Demo
          </a>
        </motion.div>

        {/* Minimalist 3D Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-5xl relative rounded-[2rem] p-4 bg-white/40 border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent z-10 bottom-0 h-40 mt-auto rounded-b-[2rem]" />
          <Image 
            src="/hero-minimal.png" 
            alt="AssetFlow Minimal Dashboard Concept" 
            width={1200} 
            height={800} 
            className="w-full h-auto object-cover rounded-2xl opacity-95 transition-opacity mix-blend-multiply"
            priority
          />
        </motion.div>
      </main>

    </div>
  );
}
