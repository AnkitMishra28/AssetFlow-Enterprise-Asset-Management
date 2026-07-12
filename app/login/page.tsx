"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import StarfieldBackground from "@/components/StarfieldBackground";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
    {/* Same fixed WebGL starfield used across the site, behind the auth card */}
    <StarfieldBackground />
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden text-slate-100">

      {/* Soft Odoo-purple glows layered over the stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#714B67]/25 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#714B67]/15 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-4"
      >
        <div className="bg-white/[0.04] backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-black/50 border border-white/10 relative overflow-hidden">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center mb-5">
              <LogIn className="w-6 h-6 text-odoo-300" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-slate-300 text-sm px-2 font-medium leading-relaxed">
              {isLogin
                ? "Manage your enterprise assets and resources seamlessly in one place."
                : "Register a new employee account to access the corporate directory."}
            </p>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
              }}
            >
              {!isLogin && (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 focus:border-odoo-400 focus:ring-4 focus:ring-odoo-400/20 pl-12 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 transition-all outline-none"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 focus:border-odoo-400 focus:ring-4 focus:ring-odoo-400/20 pl-12 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 transition-all outline-none"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 focus:border-odoo-400 focus:ring-4 focus:ring-odoo-400/20 pl-12 pr-12 py-3 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {isLogin && (
                <div className="flex justify-end pt-2 pb-1">
                  <a href="#" className="text-sm font-semibold text-odoo-300 hover:text-odoo-200 transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#714B67] to-[#5a3c52] hover:from-[#5a3c52] hover:to-[#714B67] text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#714B67]/30 mt-6"
              >
                {isLogin ? "Sign in to AssetFlow" : "Create Account"}
              </button>
            </motion.form>
          </AnimatePresence>



          {/* Toggle between login and signup */}
          <div className="mt-8 text-center text-sm font-medium text-slate-300">
            {isLogin ? (
               <span>
                 New to AssetFlow?{" "}
                 <button onClick={() => setIsLogin(false)} className="font-bold text-odoo-300 hover:text-odoo-200 transition-colors">
                   Sign up
                 </button>
               </span>
            ) : (
               <span>
                 Already have an account?{" "}
                 <button onClick={() => setIsLogin(true)} className="font-bold text-odoo-300 hover:text-odoo-200 transition-colors">
                   Sign in
                 </button>
               </span>
            )}
          </div>

        </div>
      </motion.div>
    </div>
    </>
  );
}
