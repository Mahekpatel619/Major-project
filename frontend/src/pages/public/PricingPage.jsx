import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Sparkles, Crown, Zap, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free Starter',
      tierKey: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      desc: 'Ideal for solo practitioners beginning their private practice journey.',
      features: [
        'Up to 5 active clients',
        'Standard booking calendar',
        'Freeform clinical session notes',
        'Razorpay UPI payments',
        'Basic client portal',
        'Standard email notifications',
      ],
      cta: 'Start for Free',
      popular: false,
    },
    {
      name: 'Practice Pro',
      tierKey: 'Pro',
      monthlyPrice: 1999,
      annualPrice: 19990,
      desc: 'For growing practices needing structured clinical tools and risk analytics.',
      features: [
        'Up to 30 active clients',
        'Structured SOAP & DAP note templates',
        'Session care packages (3, 6, 12 sessions)',
        'Smart No-Show Risk Indicator',
        'Automated PDF tax invoices with clinic details',
        'Advanced business analytics & revenue trends',
        'Socket.io real-time chat & notifications',
        'Homework & resource sharing',
      ],
      cta: 'Choose Practice Pro',
      popular: true,
    },
    {
      name: 'Clinical Master',
      tierKey: 'Premium',
      monthlyPrice: 3999,
      annualPrice: 39990,
      desc: 'For high-volume practices and clinics requiring unlimited capacity.',
      features: [
        'Unlimited active clients',
        'Custom domain & branded profile link',
        'Multi-service calendar availability',
        'Exportable clinical audit logs & summaries',
        'All Pro features included',
        'Priority technical & onboarding support',
      ],
      cta: 'Choose Clinical Master',
      popular: false,
    },
  ];

  return (
    <div className="py-16 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
          Simple, Transparent Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Invest in Your Practice Growth
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
          Start for free, then upgrade as your client roster expands. No hidden charges or cancellation fees.
        </p>

        {/* Annual / Monthly Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              !annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] text-teal-600 font-extrabold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => {
            const price = annual ? Math.round(p.annualPrice / 12) : p.monthlyPrice;
            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                  p.popular
                    ? 'bg-gradient-to-b from-brand-50/70 via-white to-white border-2 border-brand-500 shadow-xl shadow-brand-500/10 scale-105 z-10'
                    : 'bg-white border border-slate-200/90 shadow-soft hover:shadow-card'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-600 text-white text-[11px] font-black uppercase tracking-wider shadow">
                    Most Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                    {p.popular ? (
                      <Zap className="w-5 h-5 text-brand-600" />
                    ) : p.tierKey === 'Premium' ? (
                      <Crown className="w-5 h-5 text-amber-500" />
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed min-h-[36px]">{p.desc}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">₹{price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-500 font-semibold">/ month</span>
                    </div>
                    {annual && p.annualPrice > 0 && (
                      <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
                        Billed annually (₹{p.annualPrice.toLocaleString('en-IN')}/yr)
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-slate-600">
                    {p.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Link
                    to={user ? '/subscription' : '/register'}
                    className={`block w-full text-center py-3 rounded-xl font-bold text-xs transition shadow-sm ${
                      p.popular
                        ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {user ? 'Manage Subscription' : p.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
