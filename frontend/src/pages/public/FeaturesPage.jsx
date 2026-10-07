import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  ShieldCheck,
  FileText,
  CreditCard,
  MessageSquare,
  Bell,
  BarChart3,
  Smile,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: Users,
      badge: 'Client CRM',
      title: 'Comprehensive Client Management',
      desc: 'Centralized directory of all your active clients, leads, and archived records. Filter by tags, search by contact information, and review their full clinical journey in one glance.',
      bullets: [
        'Organized client records with tags (e.g. Anxiety, CBT, Burnout)',
        '360-degree client timeline: sessions, payments, notes, and mood logs',
        'Strict practitioner isolation — you only see your own clients',
      ],
    },
    {
      icon: Calendar,
      badge: 'Smart Calendar',
      title: 'Conflict-Free Scheduling & Slots',
      desc: 'Set custom weekly hours, break intervals, and automatic buffer times between sessions. Backend transactional guards prevent double-bookings completely.',
      bullets: [
        'Configurable 30, 45, 50, 60, or 90-minute session durations',
        'Built-in buffer time (5 to 30 mins) to prevent clinician fatigue',
        'Block out holidays, conferences, or leave with a single click',
      ],
    },
    {
      icon: ShieldCheck,
      badge: 'Branded Page',
      title: 'Public Branded Booking Link',
      desc: 'Every therapist receives a personalized vanity URL (e.g. /dr-sharma) showing credentials, clinical bio, services offered, and an interactive reservation wizard.',
      bullets: [
        'Direct link to share on WhatsApp, Instagram, or LinkedIn',
        'Transparent fee presentation with service duration details',
        'Self-service client booking without administrative friction',
      ],
    },
    {
      icon: FileText,
      badge: 'Clinical Notes',
      title: 'Confidential SOAP & DAP Notes',
      desc: 'Industry-standard structured clinical note templates (Subjective, Objective, Assessment, Plan) with strict client-level access controls and risk evaluations.',
      bullets: [
        'Private notes are completely stripped before reaching client APIs',
        'Shared psychoeducational takeaways accessible in client portal',
        'Freeform quick-entry mode or structured DAP/SOAP templates',
      ],
    },
    {
      icon: AlertTriangle,
      badge: 'Risk Intelligence',
      title: 'Smart No-Show Risk Indicator',
      desc: 'A practical rule-based heuristic scoring engine that alerts you to clients at high risk of missed sessions or payment friction before they happen.',
      bullets: [
        'Scoring formula: Missed (+3), Late Cancel (+2), Unpaid (+2)',
        'Classified into Low, Medium, and High Risk with tailored action plans',
        'Visible directly on appointments list, dashboard, and client details',
      ],
    },
    {
      icon: CreditCard,
      badge: 'Invoicing & Bundles',
      title: 'Razorpay UPI Payments & PDF Receipts',
      desc: 'Collect consultation fees via UPI, Cards, and NetBanking. Automatically generate and download branded PDF tax invoices powered by PDFKit.',
      bullets: [
        'Razorpay test/live checkout flow with automated signature verification',
        'Multi-session care bundles (3, 6, 12 sessions) with remaining balance deduction',
        'Downloadable PDF invoices with clinical registration & tax numbers',
      ],
    },
    {
      icon: Smile,
      badge: 'Wellness Journal',
      title: 'Client Mood Tracker & Trends',
      desc: 'Encourage client reflection between therapy appointments with daily mood and energy logging, complete with longitudinal emotional trajectory graphs.',
      bullets: [
        'Five standardized emotional states: Happy, Okay, Sad, Angry, Stressed',
        '1-to-5 daily energy level scale and optional reflective journal notes',
        'Longitudinal mood visualization on therapist dashboard and client portal',
      ],
    },
    {
      icon: BookOpen,
      badge: 'Psychoeducation',
      title: 'Homework & Resource Sharing',
      desc: 'Assign structured exercises like CBT thought records, sleep hygiene protocols, or attach PDFs and guided relaxation audio directly to clients.',
      bullets: [
        'Set clear completion deadlines and track status (Pending / Completed)',
        'Clients can submit reflection notes directly on completed homework',
        'Support for PDF worksheets, external guides, and video resources',
      ],
    },
    {
      icon: MessageSquare,
      badge: 'Real-Time Chat',
      title: 'Direct Therapist-Client Messaging',
      desc: 'Socket.io powered secure bidirectional messaging channel keeping communications organized and professional in one place.',
      bullets: [
        'Instant message delivery and typing indicators',
        'Full conversation history preserved in MongoDB',
        'Confidential, dedicated chat room per client-therapist pair',
      ],
    },
    {
      icon: Bell,
      badge: 'Alerts',
      title: 'In-App & Email Notifications',
      desc: 'Stay informed with instant alerts when an appointment is booked, cancelled, or paid, with simulated Nodemailer email dispatch.',
      bullets: [
        'Notification bell badge with unread alert counter',
        'Automated booking confirmation and reminder triggers',
        'Extensible notification system ready for WhatsApp Business API',
      ],
    },
    {
      icon: BarChart3,
      badge: 'Analytics',
      title: 'Practice Business Analytics',
      desc: 'Make data-driven practice decisions with MongoDB aggregation pipelines visualizing revenue growth, attendance rates, and retention curves.',
      bullets: [
        'Monthly collected and pending revenue trends',
        'Session breakdown: Completed, Upcoming, Cancelled, and No-Shows',
        'Client growth trajectory curves powered by Recharts',
      ],
    },
  ];

  return (
    <div className="py-16 space-y-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
          Platform Capabilities
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Engineered Specifically for Modern Therapy Practices
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Explore all 11 core modules built into UNFAZED to simplify your daily clinical workflows.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{f.desc}</p>
                  <ul className="space-y-2 border-t border-slate-100 pt-4">
                    {f.bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl bg-brand-50 border border-brand-100 space-y-4">
          <h3 className="text-2xl font-bold text-brand-950">See these features in action</h3>
          <p className="text-sm text-brand-800">
            Open the live demo profile to test the client booking experience or log in with demo credentials.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              to="/dr-sharma"
              className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow hover:bg-brand-700 transition"
            >
              View /dr-sharma Profile
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-white border border-brand-200 text-brand-800 font-bold text-xs hover:bg-slate-50 transition"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
