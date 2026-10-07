import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsApi, bookingApi, clientApi } from '../../api';
import NoShowRiskBadge from '../../components/common/NoShowRiskBadge';
import {
  Users,
  CalendarDays,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  ExternalLink,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [dashRes, bookRes, clientRes] = await Promise.all([
          analyticsApi.getDashboard(),
          bookingApi.getTherapistBookings({ status: 'Upcoming' }),
          clientApi.getClients({ sort: 'newest' }),
        ]);

        if (dashRes.data?.success) setData(dashRes.data);
        if (bookRes.data?.success) setUpcomingSessions(bookRes.data.bookings.slice(0, 5));
        if (clientRes.data?.success) setRecentClients(clientRes.data.clients.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-slate-400 font-medium">Loading practice dashboard...</div>;
  }

  const overview = data?.overview || {};
  const revenueTrends = data?.revenueTrends || [];
  const sessionBreakdown = data?.sessionStatusBreakdown || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner with Clinician Profile & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-800 to-teal-800 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative shrink-0">
            <img
              src={
                user?.profileImage?.includes('pexels')
                  ? user.profileImage
                  : 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg'
              }
              alt={user?.name || 'Dr. Neha Sharma'}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl border border-white/10"
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-brand-800 flex items-center justify-center text-[10px] font-bold text-white shadow"
              title="Practice Active & Accepting Clients"
            >
              ✓
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-100 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Practice Management Suite Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name || 'Dr. Neha Sharma'}
            </h1>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
              Senior Clinical Psychologist & Psychotherapist • Indiranagar, Bengaluru
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-brand-200">
              <Link
                to={`/${user?.slug || 'dr-sharma'}`}
                target="_blank"
                className="px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 font-medium inline-flex items-center gap-1 transition"
              >
                <span>/{user?.slug || 'dr-sharma'}</span>
                <ExternalLink className="w-3 h-3 text-teal-300" />
              </Link>
              <span>•</span>
              <span className="text-teal-300 font-semibold">{user?.subscriptionPlan || 'Pro'} Tier Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/appointments"
            className="px-5 py-2.5 rounded-xl bg-white text-brand-900 font-bold text-xs shadow hover:bg-slate-50 transition"
          >
            Calendar Schedule
          </Link>
          <Link
            to="/clients"
            className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs hover:bg-white/20 transition"
          >
            Manage Clients
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clients */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clients</span>
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{overview.totalClients ?? 0}</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            {overview.activeClients ?? 0} Currently Active
          </span>
        </div>

        {/* Upcoming Appointments */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Sessions</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{overview.upcomingSessions ?? 0}</div>
          <span className="text-xs text-teal-600 font-semibold mt-1 inline-block">
            {overview.completedSessions ?? 0} Completed to date
          </span>
        </div>

        {/* Monthly Revenue */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Collected</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">₹{overview.totalRevenue?.toLocaleString('en-IN') ?? 0}</div>
          <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">
            ₹{overview.pendingRevenue?.toLocaleString('en-IN') ?? 0} Pending settlements
          </span>
        </div>

        {/* Smart No-Show Rate */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">No-Show Rate</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{overview.noShowRate ?? 0}%</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 inline-block">
            {overview.noShowSessions ?? 0} Missed sessions
          </span>
        </div>
      </div>

      {/* Visual Charts: Revenue Trend & Session Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Revenue Growth Trend</h3>
              <p className="text-xs text-slate-500">Collected consultation payments over time</p>
            </div>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
              MongoDB Aggregation
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sessions by Status Donut */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Session Status Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Total session volume breakdown</p>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionBreakdown}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sessionBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
            {sessionBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}: <strong className="text-slate-900">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2 Grid Tables: Upcoming Sessions & Recent Clients with Risk Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments Queue */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900">Next Upcoming Sessions</h3>
            <Link to="/appointments" className="text-xs font-bold text-brand-600 hover:underline">
              View Calendar →
            </Link>
          </div>

          {upcomingSessions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {upcomingSessions.map((session) => (
                <div key={session._id} className="py-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm block">
                      {session.clientId?.name || 'Client'}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>{session.date} at {session.startTime}</span>
                      <span>•</span>
                      <span>{session.sessionType || 'Online Video'}</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No upcoming appointments this week.</p>
          )}
        </div>

        {/* Recent Clients with Smart No-Show Risk Indicator Badges */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Clients & Attendance Risk</h3>
              <p className="text-xs text-slate-500">Click risk badges to view factor breakdown</p>
            </div>
            <Link to="/clients" className="text-xs font-bold text-brand-600 hover:underline">
              All Clients →
            </Link>
          </div>

          {recentClients.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentClients.map((c) => (
                <div key={c._id} className="py-3 flex items-center justify-between">
                  <Link to={`/clients/${c._id}`} className="space-y-1 group">
                    <span className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition block">
                      {c.name}
                    </span>
                    <span className="text-xs text-slate-500 block">{c.email}</span>
                  </Link>

                  <div className="flex items-center gap-3">
                    <NoShowRiskBadge
                      riskLevel={c.riskLevel}
                      score={c.riskScore}
                    />
                    <Link
                      to={`/clients/${c._id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No clients registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
