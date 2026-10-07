import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../../api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Video,
  ExternalLink,
  Filter,
} from 'lucide-react';

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getTherapistBookings({ status: statusFilter });
      if (res.data?.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await bookingApi.updateBookingStatus(id, { status: newStatus });
      if (res.data?.success) {
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Appointments & Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your booked consultation calendar, attendance records, and session statuses.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="All">All Bookings</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="No-show">No-Show</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading practice appointments...</div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Date & Slot</th>
                  <th className="py-3.5 px-6">Service</th>
                  <th className="py-3.5 px-6">Meeting Link</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <Link to={`/clients/${b.clientId?._id}`} className="block group">
                        <span className="font-bold text-slate-900 group-hover:text-brand-600 transition">
                          {b.clientId?.name || 'Client'}
                        </span>
                        <span className="text-slate-400 text-[11px] block">{b.clientId?.phone || b.clientId?.email}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="font-bold text-slate-900">{b.date}</div>
                      <div className="text-slate-400 text-[11px]">{b.startTime} - {b.endTime} ({b.duration}m)</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-semibold">
                      {b.serviceName}
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={b.meetingLink || 'https://meet.google.com/unfazed-therapy-room'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-bold hover:bg-teal-100 transition"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Room
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        b.status === 'No-show' ? 'bg-rose-50 text-rose-700' :
                        b.status === 'Cancelled' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {b.status === 'Upcoming' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Completed')}
                            title="Mark Session Completed"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] transition"
                          >
                            ✓ Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'No-show')}
                            title="Mark as Missed No-Show (Updates Risk Indicator)"
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] transition"
                          >
                            ⚠ No-Show
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">No appointments found.</div>
        )}
      </div>
    </div>
  );
}
