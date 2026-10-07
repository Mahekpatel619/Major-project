import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../api';
import { Calendar, Clock, Coffee, ShieldAlert, Check, Save } from 'lucide-react';

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [sessionDuration, setSessionDuration] = useState(50);
  const [bufferTime, setBufferTime] = useState(10);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [blockedReason, setBlockedReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const res = await bookingApi.getAvailability();
        if (res.data?.success && res.data.availability) {
          const a = res.data.availability;
          setSchedule(a.weeklySchedule || []);
          setSessionDuration(a.sessionDuration || 50);
          setBufferTime(a.bufferTime || 10);
          setBlockedDates(a.blockedDates || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleDayToggle = (index) => {
    setSchedule((prev) => {
      const copy = [...prev];
      copy[index].enabled = !copy[index].enabled;
      return copy;
    });
  };

  const handleTimeChange = (index, field, value) => {
    setSchedule((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleAddBlockedDate = (e) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    setBlockedDates((prev) => [...prev, { date: newBlockedDate, reason: blockedReason || 'Leave' }]);
    setNewBlockedDate('');
    setBlockedReason('');
  };

  const handleRemoveBlockedDate = (dateStr) => {
    setBlockedDates((prev) => prev.filter((b) => b.date !== dateStr));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      const res = await bookingApi.updateAvailability({
        weeklySchedule: schedule,
        sessionDuration: Number(sessionDuration),
        bufferTime: Number(bufferTime),
        blockedDates,
      });
      if (res.data?.success) {
        setMessage('Availability rules saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to save availability settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-400 font-medium">Loading practice calendar settings...</div>;
  }

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Schedule & Availability Rules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure your weekly consultation hours, breaks, buffer times, and blocked leave.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition shrink-0"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Schedule Rules'}
        </button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          {message}
        </div>
      )}

      {/* Global Durations & Buffer */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Slot Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Default Session Duration (Minutes)
            </label>
            <select
              value={sessionDuration}
              onChange={(e) => setSessionDuration(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-brand-500"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={50}>50 Minutes (Standard Clinical Hour)</option>
              <option value={60}>60 Minutes</option>
              <option value={90}>90 Minutes (Extended/Couples)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Clinician Rest Buffer Between Slots (Minutes)
            </label>
            <select
              value={bufferTime}
              onChange={(e) => setBufferTime(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-brand-500"
            >
              <option value={0}>0 Minutes (Back-to-back)</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes (Recommended)</option>
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Weekly Operating Hours</h2>
        <div className="space-y-4">
          {schedule.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                day.enabled ? 'bg-slate-50/50 border-slate-200' : 'bg-slate-100/40 border-slate-200/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 w-36">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={() => handleDayToggle(idx)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span className="font-bold text-sm text-slate-900">{day.dayName}</span>
              </div>

              {day.enabled ? (
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-semibold">Hours:</span>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 font-mono font-semibold"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 font-mono font-semibold"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                    <Coffee className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-semibold">Break:</span>
                    <input
                      type="time"
                      value={day.breakStart || '13:00'}
                      onChange={(e) => handleTimeChange(idx, 'breakStart', e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 font-mono font-semibold"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="time"
                      value={day.breakEnd || '14:00'}
                      onChange={(e) => handleTimeChange(idx, 'breakEnd', e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-200 font-mono font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-400">Unavailable / Day Off</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blocked Dates / Holidays */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Blocked Dates & Practice Holidays</h2>
        <p className="text-xs text-slate-500">
          Slots on these dates will not be bookable by clients on your public profile link.
        </p>

        <form onSubmit={handleAddBlockedDate} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="date"
            required
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 text-xs w-full sm:w-48 font-semibold"
          />
          <input
            type="text"
            value={blockedReason}
            onChange={(e) => setBlockedReason(e.target.value)}
            placeholder="Reason (e.g. Clinical Conference, Leave)"
            className="p-2.5 rounded-xl border border-slate-200 text-xs w-full sm:w-80"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0"
          >
            Block Date
          </button>
        </form>

        <div className="space-y-2 pt-2">
          {blockedDates.map((b, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <strong className="text-slate-900">{b.date}</strong> — <span className="text-slate-600">{b.reason}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveBlockedDate(b.date)}
                className="text-rose-600 font-bold hover:underline"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
