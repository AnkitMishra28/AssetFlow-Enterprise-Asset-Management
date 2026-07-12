"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, User, EyeOff } from "lucide-react";
import Image from "next/image";
import liquidGlass from "@/lib/liquidGlass";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    
    // Apply liquid-glass with appropriate scales for this element
    const glass = liquidGlass(cardRef.current, { 
      scale: -112,
      chroma: 6,
      border: 0.07,
      mapBlur: 12,
      blur: 8, // A bit higher blur for that premium frosted look
      saturate: 1.5
    });
    
    return () => {
      glass.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#e0f0fa]">
      {/* Abstract Background Elements to mimic the airy, corporate feel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-white/60 to-transparent blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-white/40 to-transparent blur-3xl" />
        {/* Subtle curved lines effect */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[150vw] h-[150vw] rounded-[100%] border-[1px] border-white/30" />
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] rounded-[100%] border-[1px] border-white/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] z-10 p-6"
      >
        <div ref={cardRef} className="bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-center mb-6">
              <LogIn className="w-6 h-6 text-slate-800" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isLogin ? "Sign in with email" : "Create an account"}
            </h1>
            <p className="text-slate-500 text-sm px-4">
              {isLogin 
                ? "Manage your enterprise assets and resources seamlessly in one place." 
                : "Register a new employee account to access the corporate directory."}
            </p>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
              }}
            >
              {!isLogin && (
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                    <User className="w-4.5 h-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-[#f3f5f7] border border-transparent focus:border-slate-300 focus:bg-white pl-11 pr-4 py-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <Mail className="w-4.5 h-4.5 text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-[#f3f5f7] border border-transparent focus:border-slate-300 focus:bg-white pl-11 pr-4 py-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <Lock className="w-4.5 h-4.5 text-slate-400" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-[#f3f5f7] border border-transparent focus:border-slate-300 focus:bg-white pl-11 pr-10 py-3.5 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  required
                />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <EyeOff className="w-4.5 h-4.5" />
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end pt-1 pb-2">
                  <a href="#" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1c1c1f] hover:bg-[#2c2c30] text-white py-3.5 rounded-xl font-medium text-sm transition-all shadow-[0_4px_10px_rgba(28,28,31,0.2)] mt-2"
              >
                {isLogin ? "Get Started" : "Create Account"}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Social Logins */}
          {isLogin && (
            <div className="mt-8">
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 border-dotted border-[2px]"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-slate-400 font-medium bg-white px-2">Or sign in with</span>
                <div className="flex-grow border-t border-slate-200 border-dotted border-[2px]"></div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                {/* Simulated Social Icons (In a real app, use SVG icons of the brands) */}
                <button className="w-14 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-red-500 text-lg leading-none">G</span>
                </button>
                <button className="w-14 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-blue-600 text-lg leading-none">f</span>
                </button>
                <button className="w-14 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-black text-lg leading-none"></span>
                </button>
              </div>
            </div>
          )}

          {/* Toggle between login and signup */}
          <div className="mt-8 text-center text-[13px] text-slate-500">
            {isLogin ? (
               <span>
                 Don&apos;t have an account?{" "}
                 <button onClick={() => setIsLogin(false)} className="font-medium text-slate-900 hover:underline">
                   Sign up
                 </button>
               </span>
            ) : (
               <span>
                 Already have an account?{" "}
                 <button onClick={() => setIsLogin(true)} className="font-medium text-slate-900 hover:underline">
                   Sign in
                 </button>
               </span>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
