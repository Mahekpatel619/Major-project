import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Menu, X, Shield, ArrowRight, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isTherapist, isClient } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-wider">U</span>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                UNFAZED
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-teal-600">
                Practice Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <Link to="/features" className="hover:text-brand-600 transition-colors">Features</Link>
            <a href="/#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <Link to="/pricing" className="hover:text-brand-600 transition-colors">Pricing</Link>
            <Link
              to="/dr-sharma"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors font-medium text-xs border border-teal-200/60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Live Demo: /dr-sharma
            </Link>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={isTherapist ? '/dashboard' : '/portal'}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 font-semibold text-sm hover:bg-brand-100 transition"
                >
                  <User className="w-4 h-4" />
                  {isTherapist ? 'Therapist Dashboard' : 'Client Portal'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold text-sm shadow-md shadow-brand-600/20 hover:shadow-lg transition-all"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 border-t border-slate-200 bg-white space-y-3">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700"
          >
            Home
          </Link>
          <Link
            to="/features"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-base font-semibold text-slate-700"
          >
            Pricing
          </Link>
          <Link
            to="/dr-sharma"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-teal-700"
          >
            Demo Branded Profile (/dr-sharma)
          </Link>
          <div className="pt-4 border-t border-slate-100 space-y-2">
            {user ? (
              <Link
                to={isTherapist ? '/dashboard' : '/portal'}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-2 text-sm font-semibold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-semibold"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
