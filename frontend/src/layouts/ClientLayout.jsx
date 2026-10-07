import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  Calendar,
  Smile,
  BookOpen,
  FileText,
  MessageSquare,
  ClipboardList,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/portal', icon: HeartHandshake, end: true },
    { name: 'My Appointments', path: '/portal/appointments', icon: Calendar },
    { name: 'Mood Journal', path: '/portal/mood', icon: Smile },
    { name: 'Homework & Resources', path: '/portal/homework', icon: BookOpen },
    { name: 'Shared Notes', path: '/portal/notes', icon: FileText },
    { name: 'Direct Chat', path: '/portal/chat', icon: MessageSquare },
    { name: 'Intake & Consent', path: '/portal/intake-consent', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      {/* Client Portal Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/portal" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white font-black shadow-md shadow-teal-500/20">
                U
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                  UNFAZED
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
                  Client Care Portal
                </span>
              </div>
            </Link>

            {/* Quick Practitioner link & User Info */}
            <div className="flex items-center gap-4">
              {user?.therapistSlug && (
                <Link
                  to={`/${user.therapistSlug}`}
                  target="_blank"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  <span>Practitioner: {user.therapistName || 'Dr. Sharma'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              )}

              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 block">{user?.name}</span>
                  <span className="text-[10px] text-teal-600 font-semibold">Active Client</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  title="Sign out of portal"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Client Navigation Bar */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
