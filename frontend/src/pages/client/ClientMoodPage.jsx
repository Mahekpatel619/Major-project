import React, { useState, useEffect } from 'react';
import { moodApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Smile, Send, Calendar, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function ClientMoodPage() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMoods = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await moodApi.getClientMoods(user.id);
      if (res.data?.success) {
        setMoodHistory(res.data.moods || []);
        setTrends(res.data.trends || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, [user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await moodApi.logMood({
        mood: selectedMood,
        energyLevel: Number(energyLevel),
        note,
        date: new Date().toISOString().split('T')[0],
      });

      if (res.data?.success) {
        setSuccessMsg('Your mood check-in has been logged!');
        setNote('');
        fetchMoods();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save mood check-in');
    } finally {
      setSubmitting(false);
    }
  };

  const moodScoreLabel = (score) => {
    if (score === 5) return 'Happy';
    if (score === 4) return 'Okay';
    if (score === 3) return 'Stressed';
    if (score === 2) return 'Sad';
    return 'Angry';
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Wellness Mood Journal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Record your daily emotional state and energy levels to track your therapeutic trajectory.
        </p>
      </div>

      {/* Mood Logging Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Today's Reflection</h2>

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Current Mood State
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {[
                { label: 'Happy', emoji: '😊', bg: 'hover:bg-emerald-50 text-emerald-700' },
                { label: 'Okay', emoji: '🙂', bg: 'hover:bg-blue-50 text-blue-700' },
                { label: 'Stressed', emoji: '😓', bg: 'hover:bg-amber-50 text-amber-700' },
                { label: 'Sad', emoji: '😢', bg: 'hover:bg-rose-50 text-rose-700' },
                { label: 'Angry', emoji: '😠', bg: 'hover:bg-red-50 text-red-700' },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-4 rounded-2xl border transition flex flex-col items-center gap-1.5 ${
                    selectedMood === m.label
                      ? 'border-teal-600 bg-teal-50 shadow-sm scale-105'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="font-bold text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <span>Energy Level: {energyLevel} / 5</span>
              <span className="text-slate-400 font-normal">1 = Depleted, 5 = Highly Energetic</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value)}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reflective Note (Optional)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What triggered this mood? Any thoughts or bodily sensations noticed?"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition"
          >
            {submitting ? 'Saving Check-In...' : 'Save Today\'s Mood Entry'}
          </button>
        </form>
      </div>

      {/* Mood Trajectory Trend Chart */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Emotional Trajectory</h2>
        <div className="h-60 w-full pt-2">
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
                    'Mood',
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
              Log your daily check-in to begin tracking your trajectory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
