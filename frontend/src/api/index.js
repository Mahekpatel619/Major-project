import api from './client';

// Auth APIs
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  registerTherapist: (data) => api.post('/auth/register', data),
  registerClient: (data) => api.post('/auth/register-client', data),
  getMe: () => api.get('/auth/me'),
};

// Therapist APIs
export const therapistApi = {
  getProfile: () => api.get('/therapist/profile'),
  updateProfile: (data) => api.put('/therapist/profile', data),
  getPublicProfile: (slug) => api.get(`/therapists/${slug}`),
};

// Client CRM APIs
export const clientApi = {
  getClients: (params) => api.get('/clients', { params }),
  getClientDetails: (id) => api.get(`/clients/${id}`),
  createClient: (data) => api.post('/clients', data),
  updateClient: (id, data) => api.put(`/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/clients/${id}`),
  submitIntake: (data) => api.post('/clients/intake', data),
  submitConsent: (data) => api.post('/clients/consent', data),
};

// Availability & Booking APIs
export const bookingApi = {
  getAvailability: () => api.get('/availability'),
  updateAvailability: (data) => api.put('/availability', data),
  getAvailableSlots: (therapistId, params) => api.get(`/slots/${therapistId}`, { params }),
  createBooking: (data) => api.post('/bookings', data),
  getTherapistBookings: (params) => api.get('/bookings/therapist', { params }),
  getClientBookings: () => api.get('/bookings/client'),
  updateBookingStatus: (id, data) => api.put(`/bookings/${id}`, data),
};

// Payment & Packages APIs
export const paymentApi = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getTherapistPayments: () => api.get('/payments'),
  getClientPayments: () => api.get('/payments/client'),
  getInvoiceUrl: (id) => `${import.meta.env.VITE_API_BASE_URL}/payments/${id}/invoice`,
};

export const packageApi = {
  getPackages: (therapistId) => api.get('/packages', { params: { therapistId } }),
  createPackage: (data) => api.post('/packages', data),
  purchasePackage: (data) => api.post('/packages/purchase', data),
  getClientPackages: (clientId) => api.get('/packages/client', { params: { clientId } }),
};

// Clinical Notes APIs
export const notesApi = {
  getNotes: (params) => api.get('/notes', { params }),
  createNote: (data) => api.post('/notes', data),
  updateNote: (id, data) => api.put(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};

// Real-Time Chat & Message APIs
export const messageApi = {
  getMessages: (otherUserId) => api.get(`/messages/${otherUserId}`),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (otherUserId) => api.put(`/messages/read/${otherUserId}`),
};

// Notification APIs
export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// Subscription & Entitlements APIs
export const subscriptionApi = {
  getTiers: () => api.get('/subscriptions/tiers'),
  getMyEntitlements: () => api.get('/subscriptions/my-entitlements'),
  upgradePlan: (data) => api.post('/subscriptions/upgrade', data),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

// Mood Tracker APIs
export const moodApi = {
  logMood: (data) => api.post('/moods', data),
  getClientMoods: (clientId) => api.get(`/moods/${clientId}`),
};

// Homework APIs
export const homeworkApi = {
  getHomework: (params) => api.get('/homework', { params }),
  createHomework: (data) => api.post('/homework', data),
  updateHomework: (id, data) => api.put(`/homework/${id}`, data),
  deleteHomework: (id) => api.delete(`/homework/${id}`),
};

// Smart Risk API
export const riskApi = {
  getClientRisk: (clientId) => api.get(`/risk/${clientId}`),
};
