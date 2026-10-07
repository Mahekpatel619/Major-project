import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState('therapist'); // 'therapist' or 'client'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ email, password, role });
      if (res.data?.success) {
        login(res.data.token, res.data.user);
        if (res.data.user.role === 'therapist') {
          navigate('/dashboard');
        } else {
          navigate('/portal');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofill = (userRole, demoEmail, demoPass) => {
    setRole(userRole);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-teal-600 flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md shadow-brand-500/20 mb-4">
            U
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In to UNFAZED
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Access your secure practice workspace or client care portal.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setRole('therapist');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'therapist'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Therapist Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('client');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              role === 'client'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Client Portal
          </button>
        </div>

        {/* 1-Click Demo Credentials QuickFill */}
        <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/70 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Instant Demo Logins (1-Click Fill)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => autofill('therapist', 'dr.sharma@unfazed.in', 'Password123!')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-teal-200 text-teal-900 font-semibold hover:bg-teal-100/50 transition text-left truncate"
            >
              👩‍⚕️ Dr. Sharma (Therapist)
            </button>
            <button
              type="button"
              onClick={() => autofill('client', 'aarav.patel@example.com', 'Password123!')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-teal-200 text-teal-900 font-semibold hover:bg-teal-100/50 transition text-left truncate"
            >
              🧑 Aarav Patel (Client)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'therapist' ? 'dr.sharma@unfazed.in' : 'client@example.com'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-sm shadow-md shadow-brand-600/20 hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : `Sign in as ${role === 'therapist' ? 'Therapist' : 'Client'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have a therapist account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register your practice
          </Link>
        </div>
      </div>
    </div>
  );
}
