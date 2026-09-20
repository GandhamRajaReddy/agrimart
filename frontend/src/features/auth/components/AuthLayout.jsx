import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, TrendingUp, Users, ArrowLeft } from 'lucide-react';
import Badge from '../../../components/common/Badge';

export const AuthLayout = ({ children, title, subtitle, backToHomeLink = true }) => {
  return (
    <div className="min-h-screen bg-emerald-950 text-emerald-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform duration-300">
            <Sprout className="w-6 h-6 text-emerald-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-white font-display">
              Agri<span className="text-emerald-400">Mart</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
              Kisan First Platform
            </span>
          </div>
        </Link>

        {backToHomeLink && (
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 bg-emerald-900/40 hover:bg-emerald-900/60 px-4 py-2 rounded-xl border border-emerald-800/50 backdrop-blur-md transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        )}
      </header>

      {/* Main Content Area: Split View */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Brand Showcase & Value Props */}
        <div className="lg:col-span-5 space-y-8 hidden lg:flex flex-col justify-center">
          <div className="space-y-4">
            <Badge variant="success" size="md" className="gap-1.5 shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Direct Mandi & Farmer Network
            </Badge>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight font-display tracking-tight">
              Empowering India's Agriculture with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Smart Tech</span>
            </h1>
            <p className="text-emerald-200/80 text-base leading-relaxed">
              Join over 50,000+ verified farmers, agricultural vendors, and bulk processors buying quality inputs and selling harvests without middlemen delays.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-700/60 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Pre-Harvest Price AI</h3>
              <p className="text-xs text-emerald-300/70 mt-1">Predict crop mandi rates up to 45 days in advance.</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-700/60 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Direct Mandi Hubs</h3>
              <p className="text-xs text-emerald-300/70 mt-1">Zero wait time harvest sale & digital token slot booking.</p>
            </div>
          </div>

          {/* Verified Social Proof Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/50 to-emerald-900/20 border border-emerald-700/40 backdrop-blur-md flex items-center gap-4">
            <div className="flex -space-x-3 overflow-hidden">
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-emerald-500/50 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Farmer" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-emerald-500/50 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Buyer" />
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-emerald-500/50 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Vendor" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">100% Verified Profiles</div>
              <div className="text-xs text-emerald-300/70">Governed by Mandi & Govt License verification</div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <div className="w-full max-w-xl bg-emerald-900/40 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-emerald-950/80 relative">
            <div className="mb-6 space-y-1">
              {title && <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">{title}</h2>}
              {subtitle && <p className="text-sm text-emerald-300/80">{subtitle}</p>}
            </div>

            {children}
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-emerald-400/60 relative z-10">
        &copy; {new Date().getFullYear()} AgriMart Digital Platform. All rights reserved. Encrypted with SSL 256-Bit.
      </footer>
    </div>
  );
};

export default AuthLayout;
