import React, { useState, useEffect } from 'react';
import { clientApi, moodApi } from '../../api';
import { Smile, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function MoodTrackerPage() {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientApi.getClients().then((res) => {
      if (res.data?.success && res.data.clients.length > 0) {
        setClients(res.data.clients);
        setSelectedClientId(res.data.clients[0]._id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedClientId) return;
    moodApi.getClientMoods(selectedClientId).then((res) => {
      if (res.data?.success) {
        setMoodData(res.data);
      }
    });
  }, [selectedClientId]);

  const moodScoreLabel = (score) => {
    if (score === 5) return 'Happy';
    if (score === 4) return 'Okay';
    if (score === 3) return 'Stressed';
    if (score === 2) return 'Sad';
    return 'Angry';
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Client Mood Journal Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review wellness journaling records and longitudinal emotional trajectories.
          </p>
        </div>

        {/* Client Picker */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Select Client:</span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
          >
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trajectory Chart Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Emotional Trajectory Trend</h2>
            <p className="text-xs text-slate-500">Historical mood score trend over the past sessions</p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
            Wellness Journaling Mode
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          {moodData?.trends?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData.trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(val) => moodScoreLabel(val)}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${moodScoreLabel(Number(val))} (Energy: ${item.payload.energy}/5)`,
                    'State',
                  ]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0d9488', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No mood entries logged by this client yet.
            </div>
          )}
        </div>
      </div>

      {/* Mood Entries List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Recent Journal Logs</h2>
        {moodData?.moods?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {moodData.moods.map((m) => (
              <div key={m._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{m.date}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.mood === 'Happy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.mood === 'Okay'
                        ? 'bg-blue-100 text-blue-800'
                        : m.mood === 'Stressed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {m.mood}
                  </span>
                </div>
                <p className="text-slate-600 italic">"{m.note || 'No notes added'}"</p>
                <div className="text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-200/50">
                  Energy Level: {m.energyLevel || 3}/5
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">No logs recorded.</p>
        )}
      </div>
    </div>
  );
}
