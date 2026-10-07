import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Sparkles, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center text-white font-black text-lg">
                U
              </div>
              <span className="text-2xl font-black tracking-tight text-white">UNFAZED</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The modern private practice management platform for clinical psychologists, psychotherapists, and mental health professionals in India.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>RCI-Compliant Architecture & Data Privacy</span>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/features" className="hover:text-white transition">Smart Scheduling</Link></li>
              <li><Link to="/features" className="hover:text-white transition">SOAP & DAP Notes</Link></li>
              <li><Link to="/features" className="hover:text-white transition">No-Show Risk Engine</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Mood Journaling</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Razorpay Payments</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Practice</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/pricing" className="hover:text-white transition">Subscription Plans</Link></li>
              <li><Link to="/dr-sharma" className="hover:text-white transition">Sample Branded Link</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Start Practice Free</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Practitioner Portal</Link></li>
            </ul>
          </div>

          {/* Compliance & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Clinical Trust</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Built specifically for the Indian healthcare ecosystem with GST invoicing, WhatsApp-ready reminders, and dual-layer note encryption.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
              <Shield className="w-6 h-6 text-teal-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-slate-200 block">End-to-End Isolated</span>
                <span className="text-slate-400">Private clinical records never exposed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} UNFAZED Healthcare Technologies. Major Project Submission.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Clinical Practice</span>
            <span>Privacy Policy</span>
            <span className="text-teal-400 font-medium">Made with precision for Indian Practitioners</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
