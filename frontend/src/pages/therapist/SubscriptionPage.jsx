import React, { useState, useEffect } from 'react';
import { subscriptionApi } from '../../api';
import UpgradeModal from '../../components/common/UpgradeModal';
import { Sparkles, Check, Crown, Zap, ShieldCheck } from 'lucide-react';

export default function SubscriptionPage() {
  const [entitlements, setEntitlements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const fetchEntitlements = async () => {
    try {
      setLoading(true);
      const res = await subscriptionApi.getMyEntitlements();
      if (res.data?.success) {
        setEntitlements(res.data.entitlements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntitlements();
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-slate-400 font-medium">Checking subscription entitlements...</div>;
  }

  const currentTier = entitlements?.tier || 'Free';
  const limits = entitlements?.limits || {};
  const usage = entitlements?.usage || { activeClients: 0, maxClients: 5 };
  const percentageUsed = usage.maxClients === -1 ? 10 : Math.min(100, Math.round((usage.activeClients / usage.maxClients) * 100));

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Subscription & Entitlements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized Entitlement Service managing tier limits and feature provisioning.
          </p>
        </div>

        <button
          onClick={() => setUpgradeModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Change / Upgrade Plan
        </button>
      </div>

      {/* Current Tier Overview Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-700 to-slate-900 text-white shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-brand-200 block mb-1">
              Active Practice Plan
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black">{currentTier} Tier</h2>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                Active & Provisioned
              </span>
            </div>
          </div>
          <Crown className="w-10 h-10 text-amber-400 shrink-0" />
        </div>

        {/* Client Limit Progress Bar */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-brand-100">
            <span>Active Client Capacity</span>
            <span>
              {usage.activeClients} of {usage.maxClients === -1 ? 'Unlimited' : usage.maxClients} Clients Used
            </span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
        </div>
      </div>

      {/* Gated Feature Entitlement Checklist */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Provisioned Entitlements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Max Active Clients</span>
            <strong className="text-slate-900">{usage.maxClients === -1 ? 'Unlimited' : usage.maxClients} Clients</strong>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">SOAP & DAP Structured Notes</span>
            <span className={`font-bold ${limits.advancedNoteTemplates ? 'text-emerald-700' : 'text-slate-400'}`}>
              {limits.advancedNoteTemplates ? '✓ Unlocked' : '✕ Requires Pro'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Multi-Session Packages (3, 6, 12)</span>
            <span className={`font-bold ${limits.sessionPackages ? 'text-emerald-700' : 'text-slate-400'}`}>
              {limits.sessionPackages ? '✓ Unlocked' : '✕ Requires Pro'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Advanced Analytics & Growth Curves</span>
            <span className={`font-bold ${limits.advancedAnalytics ? 'text-emerald-700' : 'text-slate-400'}`}>
              {limits.advancedAnalytics ? '✓ Unlocked' : '✕ Requires Pro'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Smart No-Show Risk Engine</span>
            <span className={`font-bold ${limits.noShowRiskAI ? 'text-emerald-700' : 'text-slate-400'}`}>
              {limits.noShowRiskAI ? '✓ Unlocked' : '✕ Requires Pro'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Custom Branded Link & URL</span>
            <span className={`font-bold ${limits.customBranding ? 'text-emerald-700' : 'text-slate-400'}`}>
              {limits.customBranding ? '✓ Unlocked' : '✕ Requires Pro'}
            </span>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={currentTier}
        onUpgraded={fetchEntitlements}
      />
    </div>
  );
}
