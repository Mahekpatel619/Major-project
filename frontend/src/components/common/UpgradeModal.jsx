import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../../api';
import { Check, Sparkles, Crown, Zap, X } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose, currentPlan = 'Free', featureRequired = '', onUpgraded }) {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchTiers = async () => {
        try {
          setLoading(true);
          const res = await subscriptionApi.getTiers();
          if (res.data?.success) {
            setTiers(res.data.tiers);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTiers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgrade = async (tierName) => {
    try {
      setUpgrading(true);
      const res = await subscriptionApi.upgradePlan({ tierName });
      if (res.data?.success) {
        setMessage(`Successfully upgraded to ${tierName}!`);
        if (onUpgraded) onUpgraded(tierName);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to update plan. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Centralized Entitlement Upgrade
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Unlock Advanced Practice Tools
          </h2>
          {featureRequired && (
            <p className="text-xs font-semibold text-amber-700 bg-amber-50 py-1.5 px-3 rounded-lg mt-2 inline-block">
              {featureRequired}
            </p>
          )}
          <p className="text-sm text-slate-500 mt-2">
            Switch plans seamlessly with instant entitlement provisioning.
          </p>
          {message && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              {message}
            </div>
          )}
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isCurrent = tier.tierName.toLowerCase() === currentPlan.toLowerCase();
            const isPro = tier.tierName === 'Pro';
            const isPremium = tier.tierName === 'Premium';

            return (
              <div
                key={tier.tierName}
                className={`rounded-2xl p-6 relative flex flex-col justify-between transition-all ${
                  isPro
                    ? 'bg-gradient-to-b from-brand-50/70 to-white border-2 border-brand-500 shadow-xl shadow-brand-500/10'
                    : 'bg-white border border-slate-200 hover:border-slate-300'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-slate-900">{tier.displayName}</h3>
                    {isPremium ? (
                      <Crown className="w-5 h-5 text-amber-500" />
                    ) : isPro ? (
                      <Zap className="w-5 h-5 text-brand-600" />
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-500 mb-4 min-h-[32px]">{tier.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-black text-slate-900">₹{tier.monthlyPrice}</span>
                    <span className="text-xs text-slate-500 font-medium"> / month</span>
                  </div>

                  <ul className="space-y-2.5 mb-6 text-xs text-slate-600">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs cursor-default"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(tier.tierName)}
                      disabled={upgrading}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
                        isPro
                          ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
                          : isPremium
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {upgrading ? 'Processing...' : `Switch to ${tier.tierName}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
