import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Smile,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling & Booking',
      desc: 'Automatic buffer management, customized session durations, and foolproof double-booking prevention.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: ShieldCheck,
      title: 'Branded Practitioner Profile',
      desc: 'Get your unique professional link (e.g. /dr-sharma) for instant client trust and frictionless self-service booking.',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      icon: FileText,
      title: 'Secure Clinical Notes (SOAP/DAP)',
      desc: 'Structured clinical templates with strict client-isolation safeguards. Private notes never leak to client portals.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: AlertTriangle,
      title: 'Smart No-Show Risk Indicator',
      desc: 'Rule-based attendance scoring analyzing past missed appointments, late cancellations, and unpaid dues.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: CreditCard,
      title: 'Razorpay UPI & PDF Invoices',
      desc: 'Integrated Indian payment flows (UPI, NetBanking) with automated GST-compliant PDF receipts via PDFKit.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Smile,
      title: 'Client Mood Tracking',
      desc: 'Empower clients with wellness mood logging, energy levels, and longitudinal emotional trajectories.',
      color: 'from-sky-500 to-blue-600',
    },
    {
      icon: BookOpen,
      title: 'Homework & Resource Sharing',
      desc: 'Assign cognitive thought records, worksheets, and calming audio guides with completion tracking.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Secure Chat',
      desc: 'Socket.io powered instant messaging between therapist and verified clients for supportive continuity.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: TrendingUp,
      title: 'Practice Analytics',
      desc: 'Real MongoDB aggregations visualizing monthly revenue trends, client retention curves, and attendance rates.',
      color: 'from-indigo-500 to-brand-600',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 gradient-hero border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-bold shadow-sm mb-8 animate-bounce-short">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Built for Therapists in India • RCI Aligned Architecture</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Everything Your Therapy Practice Needs.{' '}
            <span className="gradient-text block mt-2">In One Place.</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Manage clients, appointments, payments, notes, and communication from one powerful, modern platform.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-teal-600 text-white font-bold text-base shadow-xl shadow-brand-600/25 hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/dr-sharma"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-300/80 text-slate-800 font-bold text-base hover:bg-slate-50 shadow-sm hover:shadow transition"
            >
              <span>Explore Live Demo (/dr-sharma)</span>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-soft">
            <div>
              <div className="text-3xl font-black text-slate-900">0%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Double Bookings
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-teal-600">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Private Note Isolation
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-brand-600">₹0</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Free Starter Tier
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-purple-600">3-min</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Branded Link Setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-600 block mb-2">
            Engineered For Clinical Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One Unified Workspace for Your Entire Private Practice
          </h2>
          <p className="mt-4 text-base text-slate-600">
            No more juggling separate apps for scheduling, notes, WhatsApp messages, and UPI payment reconciliation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-slate-300 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white shadow-md mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-teal-400 block mb-2">
              Simple 3-Step Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How UNFAZED Powers Your Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 font-black flex items-center justify-center text-lg border border-brand-500/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Setup Your Branded Page</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Add your photo, NIMHANS/RCI qualifications, services, and weekly availability rules. Your public branded link (e.g. /dr-sharma) goes live instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 font-black flex items-center justify-center text-lg border border-teal-500/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Clients Book & Pay Seamlessly</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clients pick available slots, complete digital intake & informed consent, and settle fees via Razorpay UPI. Double bookings are blocked automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-lg border border-purple-500/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Manage Care with Intelligence</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Document clinical progress with SOAP/DAP templates, monitor the Smart No-Show Risk Indicator, track mood trends, and assign interactive homework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Clearly labeled demo content per rules) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-slate-500 block mb-2">
            Practitioner Reviews (Sample Demo Content)
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Loved by Mental Health Professionals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic">
              "The branded profile page and instant UPI payments eliminated hours of WhatsApp back-and-forth every week. The SOAP templates are incredibly clean."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                DS
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Dr. Sharma</span>
                <span className="text-[11px] text-slate-400">Clinical Psychologist, Bengaluru</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic">
              "The Smart No-Show Risk Indicator saved our clinic over 4 empty slots last month by highlighting clients who needed proactive WhatsApp reconfirmations."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                RV
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Radhika Verma</span>
                <span className="text-[11px] text-slate-400">CBT Specialist, Mumbai</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic">
              "The strict separation between private clinician notes and client shared takeaways gave me total peace of mind regarding patient confidentiality."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                AK
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Dr. Anand Kulkarni</span>
                <span className="text-[11px] text-slate-400">Consultant Psychotherapist, Delhi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white text-center relative overflow-hidden shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Streamline Your Private Practice?
          </h2>
          <p className="mt-4 text-base text-brand-100 max-w-xl mx-auto">
            Join hundreds of therapists building thriving, organized, and confident practices with UNFAZED.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl bg-white text-brand-900 font-bold text-sm shadow-lg hover:bg-slate-50 transition"
            >
              Get Started Free Today
            </Link>
            <Link
              to="/dr-sharma"
              className="px-8 py-3.5 rounded-2xl bg-brand-600/60 text-white font-bold text-sm border border-brand-400/40 hover:bg-brand-600/80 transition"
            >
              View Dr. Sharma Profile Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
