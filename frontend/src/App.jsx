import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import TherapistLayout from './layouts/TherapistLayout';
import ClientLayout from './layouts/ClientLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import FeaturesPage from './pages/public/FeaturesPage';
import PricingPage from './pages/public/PricingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import TherapistPublicProfilePage from './pages/public/TherapistPublicProfilePage';

// Therapist Pages
import DashboardPage from './pages/therapist/DashboardPage';
import ProfilePage from './pages/therapist/ProfilePage';
import ClientsPage from './pages/therapist/ClientsPage';
import ClientDetailsPage from './pages/therapist/ClientDetailsPage';
import SchedulePage from './pages/therapist/SchedulePage';
import AppointmentsPage from './pages/therapist/AppointmentsPage';
import PaymentsPage from './pages/therapist/PaymentsPage';
import PackagesPage from './pages/therapist/PackagesPage';
import ClinicalNotesPage from './pages/therapist/ClinicalNotesPage';
import ChatPage from './pages/therapist/ChatPage';
import MoodTrackerPage from './pages/therapist/MoodTrackerPage';
import HomeworkPage from './pages/therapist/HomeworkPage';
import AnalyticsPage from './pages/therapist/AnalyticsPage';
import SubscriptionPage from './pages/therapist/SubscriptionPage';
import SettingsPage from './pages/therapist/SettingsPage';

// Client Pages
import ClientDashboardPage from './pages/client/ClientDashboardPage';
import ClientAppointmentsPage from './pages/client/ClientAppointmentsPage';
import ClientMoodPage from './pages/client/ClientMoodPage';
import ClientHomeworkPage from './pages/client/ClientHomeworkPage';
import ClientNotesPage from './pages/client/ClientNotesPage';
import ClientChatPage from './pages/client/ClientChatPage';
import IntakeConsentPage from './pages/client/IntakeConsentPage';

// Protected Route wrappers
const ProtectedTherapistRoute = ({ children }) => {
  const { user, loading, isTherapist } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs text-slate-400">Loading workspace...</div>;
  if (!user || !isTherapist) return <Navigate to="/login" replace />;
  return children;
};

const ProtectedClientRoute = ({ children }) => {
  const { user, loading, isClient } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs text-slate-400">Loading portal...</div>;
  if (!user || !isClient) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Vanity link /:slug e.g. /dr-sharma */}
        <Route path="/:slug" element={<TherapistPublicProfilePage />} />
      </Route>

      {/* Therapist Portal Protected Routes */}
      <Route
        element={
          <ProtectedTherapistRoute>
            <TherapistLayout />
          </ProtectedTherapistRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientDetailsPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/notes" element={<ClinicalNotesPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
        <Route path="/homework" element={<HomeworkPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Client Care Portal Protected Routes */}
      <Route
        element={
          <ProtectedClientRoute>
            <ClientLayout />
          </ProtectedClientRoute>
        }
      >
        <Route path="/portal" element={<ClientDashboardPage />} />
        <Route path="/portal/appointments" element={<ClientAppointmentsPage />} />
        <Route path="/portal/mood" element={<ClientMoodPage />} />
        <Route path="/portal/homework" element={<ClientHomeworkPage />} />
        <Route path="/portal/notes" element={<ClientNotesPage />} />
        <Route path="/portal/chat" element={<ClientChatPage />} />
        <Route path="/portal/intake-consent" element={<IntakeConsentPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
