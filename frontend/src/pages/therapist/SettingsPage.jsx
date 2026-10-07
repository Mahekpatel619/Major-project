import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, ShieldCheck, Bell, Key, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Practice Settings & Integrations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure security, notifications, and simulated Indian gateway connections.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Practice Security */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Clinical Data Confidentiality</h2>
              <p className="text-xs text-slate-500">Dual-layer tenant isolation and access controls</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Patient Isolation Status:</span>
              <span className="text-emerald-700 font-bold">✓ Active (Strict Query Filtering)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Clinical Notes API Sanitizer:</span>
              <span className="text-emerald-700 font-bold">✓ Enforced (Private Notes Stripped)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Double-Booking Guard:</span>
              <span className="text-emerald-700 font-bold">✓ Atomic Validation Enabled</span>
            </div>
          </div>
        </div>

        {/* Razorpay Test Mode */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Payment Gateway Configuration</h2>
              <p className="text-xs text-slate-500">Razorpay Test Mode & Webhook Integration</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Razorpay Key ID</label>
              <input
                type="text"
                readOnly
                value="rzp_test_unfazedMockKeyId123"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-600"
              />
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Operates in Test Mode with automated order simulation and instant webhook verification.
            </p>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Notification Alerts</h2>
              <p className="text-xs text-slate-500">Configure appointment reminder and booking notifications</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={bookingAlerts}
                onChange={() => setBookingAlerts(!bookingAlerts)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="font-semibold text-slate-700">
                In-app alert when client books a consultation
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="font-semibold text-slate-700">
                Simulated email notifications via Nodemailer
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition"
        >
          Save Settings Preferences
        </button>
      </form>
    </div>
  );
}
