import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Video, Plus, ExternalLink } from 'lucide-react';

export default function ClientAppointmentsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getClientBookings().then((res) => {
      if (res.data?.success) {
        setBookings(res.data.bookings);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View your upcoming schedule, telehealth meeting links, and past consultation history.
          </p>
        </div>

        {user?.therapistSlug && (
          <Link
            to={`/${user.therapistSlug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Book Another Session
          </Link>
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading appointments...</div>
        ) : bookings.length > 0 ? (
          bookings.map((b) => (
            <div
              key={b._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    b.status === 'Upcoming'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : b.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {b.status}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">{b.sessionType || 'Online Video'}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{b.serviceName}</h3>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>{b.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{b.startTime} - {b.endTime}</span>
                  </div>
                </div>
              </div>

              <div>
                {b.status === 'Upcoming' ? (
                  <a
                    href={b.meetingLink || 'https://meet.google.com/unfazed-therapy-room'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition"
                  >
                    <Video className="w-4 h-4" />
                    Join Video Room
                  </a>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Session Concluded</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            No session bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
