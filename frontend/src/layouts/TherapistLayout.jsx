import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { notificationApi } from '../api';
import {
  LayoutDashboard,
  User,
  Users,
  Calendar,
  CalendarDays,
  CreditCard,
  Package,
  FileText,
  MessageSquare,
  Smile,
  BookOpen,
  BarChart3,
  Sparkles,
  Settings,
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export default function TherapistLayout() {
  const { user, logout } = useAuth();
  const { unreadAlerts, setUnreadAlerts } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Packages', path: '/packages', icon: Package },
    { name: 'Clinical Notes', path: '/notes', icon: FileText },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Mood Tracker', path: '/mood-tracker', icon: Smile },
    { name: 'Homework', path: '/homework', icon: BookOpen },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Subscription', path: '/subscription', icon: Sparkles },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.data?.success) {
        setNotifications(res.data.notifications);
        setUnreadAlerts(res.data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadAlerts(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-800">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-black text-lg tracking-tight text-slate-900">UNFAZED</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/${user?.slug || 'dr-sharma'}`}
            target="_blank"
            className="p-1.5 rounded-lg text-teal-600 bg-teal-50 text-xs font-semibold flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Profile
          </Link>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:static md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-teal-600 flex items-center justify-center text-white font-extrabold shadow-sm shadow-brand-500/30">
              U
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                UNFAZED
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Therapist Suite
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Branded Link Preview Pill */}
        <div className="px-4 pt-4 pb-2">
          <Link
            to={`/${user?.slug || 'dr-sharma'}`}
            target="_blank"
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 text-teal-800 hover:from-teal-100 transition group"
          >
            <div className="overflow-hidden text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 block">
                Public Branded Page
              </span>
              <span className="text-xs font-semibold text-slate-800 truncate block">
                /{user?.slug || 'dr-sharma'}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-teal-600 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={
                  user?.profileImage?.includes('pexels')
                    ? user.profileImage
                    : 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg'
                }
                alt={user?.name || 'Dr. Neha Sharma'}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 ring-2 ring-brand-500/20"
              />
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-slate-900 truncate block">
                  {user?.name || 'Dr. Neha Sharma'}
                </span>
                <span className="text-[10px] text-brand-600 font-semibold uppercase tracking-wider block">
                  {user?.subscriptionPlan || 'Pro'} Plan
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Navbar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200/80 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.profileImage?.includes('pexels')
                  ? user.profileImage
                  : 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg'
              }
              alt={user?.name || 'Dr. Neha Sharma'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 ring-2 ring-brand-500/20"
            />
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Practitioner Portal
              </span>
              <div className="h-4 w-px bg-slate-200" />
              <span className="text-xs text-slate-500 font-medium">
                Welcome back, <strong className="text-slate-800">{user?.name || 'Dr. Neha Sharma'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 py-1">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`p-2.5 text-xs rounded-xl my-1 transition ${
                          n.read ? 'text-slate-500 bg-white' : 'bg-brand-50/50 text-slate-800 font-medium'
                        }`}
                      >
                        <span className="font-bold text-slate-900 block">{n.title}</span>
                        <p className="text-slate-600 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-6 text-center">No alerts at this moment</p>
                  )}
                </div>
              </div>
            )}

            {/* Plan Badge */}
            <Link
              to="/subscription"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold hover:bg-brand-100 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {user?.subscriptionPlan || 'Pro'} Plan
            </Link>
          </div>
        </header>

        {/* Main Outlet Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
