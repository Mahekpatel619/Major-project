import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../api';
import UpgradeModal from '../../components/common/UpgradeModal';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  CalendarDays,
  Users,
  AlertTriangle,
  Lock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    analyticsApi.getDashboard().then((res) => {
      if (res.data?.success) {
        setData(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-slate-400 font-medium">Aggregating practice metrics...</div>;
  }

  const overview = data?.overview || {};
  const revenueTrends = data?.revenueTrends || [];
  const sessionBreakdown = data?.sessionStatusBreakdown || [];
  const clientGrowth = data?.clientGrowthTrends || [];

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Practice Business Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real MongoDB aggregation pipelines tracking revenue velocity, attendance retention, and growth.
          </p>
        </div>

        {!data?.hasAdvancedAccess && (
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs shadow hover:bg-amber-600 transition shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to Pro Analytics
          </button>
        )}
      </div>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Revenue
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900">
            ₹{overview.totalRevenue?.toLocaleString('en-IN') ?? 0}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pending Settlements
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600">
            ₹{overview.pendingRevenue?.toLocaleString('en-IN') ?? 0}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active Patients
          </span>
          <span className="text-2xl sm:text-3xl font-black text-teal-600">
            {overview.activeClients ?? 0} Clients
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Attendance Rate
          </span>
          <span className="text-2xl sm:text-3xl font-black text-brand-600">
            {100 - (overview.noShowRate ?? 0)}%
          </span>
        </div>
      </div>

      {/* Revenue Area Graph */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Monthly Revenue Stream</h3>
            <p className="text-xs text-slate-500">Aggregated via MongoDB $match & $group pipeline</p>
          </div>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
            ₹ Inflows
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Collected Revenue']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#analyticsRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2 Chart Row: Session Breakdown & Client Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Session Breakdown Donut */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Session Status Distribution</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sessionBreakdown}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sessionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {sessionBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}: <strong className="text-slate-900">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Growth Bar Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Client Acquisition Volume</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} Clients`, 'New Registrations']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="clients" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-100">
            Consistent patient acquisition through your public branded profile link.
          </p>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        featureRequired="Advanced Practice Analytics"
      />
    </div>
  );
}
