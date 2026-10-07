import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingApi, moodApi, homeworkApi } from '../../api';
import {
  Calendar,
  Smile,
  BookOpen,
  Video,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [pendingHomework, setPendingHomework] = useState([]);
  const [loggedToday, setLoggedToday] = useState(false);
  const [quickMood, setQuickMood] = useState('Happy');
  const [submittingMood, setSubmittingMood] = useState(false);
  const [moodMsg, setMoodMsg] = useState('');

  useEffect(() => {
    bookingApi.getClientBookings().then((res) => {
      if (res.data?.success && res.data.bookings.length > 0) {
        const upcoming = res.data.bookings.find((b) => b.status === 'Upcoming');
        setUpcomingSession(upcoming);
      }
    });

    homeworkApi.getHomework().then((res) => {
      if (res.data?.success) {
        setPendingHomework(res.data.homework.filter((h) => h.status === 'Pending'));
      }
    });
  }, []);

  const handleQuickMood = async (mood) => {
    try {
      setSubmittingMood(true);
      const res = await moodApi.logMood({
        mood,
        date: new Date().toISOString().split('T')[0],
      });
      if (res.data?.success) {
        setLoggedToday(true);
        setMoodMsg(`Mood "${mood}" logged for today!`);
        setTimeout(() => setMoodMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingMood(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Welcome to Your Care Space</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {user?.name || 'Client'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Access your upcoming therapy sessions, track your daily emotional trajectory, and reflect on assigned exercises.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/portal/appointments"
            className="px-5 py-2.5 rounded-xl bg-white text-teal-900 font-bold text-xs shadow hover:bg-slate-50 transition"
          >
            My Appointments
          </Link>
          {user?.therapistSlug && (
            <Link
              to={`/${user.therapistSlug}`}
              className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs hover:bg-white/20 transition"
            >
              Book New Session
            </Link>
          )}
        </div>
      </div>

      {/* Grid: Upcoming Session & Quick Mood Logger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Next Appointment Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 block">
                Next Confirmed Session
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                Upcoming
              </span>
            </div>

            {upcomingSession ? (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">{upcomingSession.serviceName}</h3>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span>{upcomingSession.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>{upcomingSession.startTime} - {upcomingSession.endTime}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500">
                  Practitioner: <strong>{upcomingSession.therapistId?.name || 'Dr. Sharma'}</strong>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6">
                You have no upcoming appointments scheduled.
              </p>
            )}
          </div>

          <div>
            {upcomingSession ? (
              <a
                href={upcomingSession.meetingLink || 'https://meet.google.com/unfazed-therapy-room'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition"
              >
                <Video className="w-4 h-4" />
                Join Telehealth Video Room
              </a>
            ) : (
              user?.therapistSlug && (
                <Link
                  to={`/${user.therapistSlug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow hover:bg-slate-800 transition"
                >
                  Book Next Appointment
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )
            )}
          </div>
        </div>

        {/* Quick Mood Logger Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Daily Wellness Check-In
              </span>
              <Smile className="w-5 h-5 text-teal-600" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">How are you feeling today?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Track your emotional trajectory between therapy sessions.
            </p>

            {moodMsg && (
              <div className="p-2.5 mb-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 text-center">
                {moodMsg}
              </div>
            )}

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
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
                  onClick={() => handleQuickMood(m.label)}
                  disabled={submittingMood}
                  className={`p-3 rounded-2xl border border-slate-200 transition flex flex-col items-center gap-1 ${m.bg}`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="font-bold text-[10px]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link to="/portal/mood" className="text-xs font-bold text-teal-700 hover:underline">
              Open Full Journal & Mood History →
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Homework Callout */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Pending Reflective Exercises</h3>
              <p className="text-xs text-slate-500">Assigned by your therapist for continuous practice</p>
            </div>
          </div>
          <Link to="/portal/homework" className="text-xs font-bold text-teal-700 hover:underline">
            View All ({pendingHomework.length}) →
          </Link>
        </div>

        {pendingHomework.length > 0 ? (
          <div className="space-y-3 pt-2">
            {pendingHomework.slice(0, 2).map((hw) => (
              <div
                key={hw._id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{hw.title}</span>
                  <span className="text-slate-500">Due: {hw.dueDate}</span>
                </div>
                <Link
                  to="/portal/homework"
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-[11px] shadow hover:bg-teal-700 transition"
                >
                  Complete
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">All assigned homework tasks completed! Great work.</p>
        )}
      </div>
    </div>
  );
}
