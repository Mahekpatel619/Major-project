import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { therapistApi, bookingApi, paymentApi } from '../../api';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  User,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Lock,
} from 'lucide-react';

export default function TherapistPublicProfilePage() {
  const { slug } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Flow States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Tomorrow by default
    return d.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1); // 1: Service & Date, 2: Slot, 3: Client Details, 4: Confirmed

  // Client form inputs
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [paymentOption, setPaymentOption] = useState('online'); // 'online' or 'pay_later'
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await therapistApi.getPublicProfile(slug || 'dr-sharma');
        if (res.data?.success) {
          setTherapist(res.data.therapist);
          if (res.data.therapist.services?.length > 0) {
            setSelectedService(res.data.therapist.services[0]);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Practitioner profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  // Fetch slots whenever selectedDate or therapist changes
  useEffect(() => {
    if (therapist && selectedDate) {
      const fetchSlots = async () => {
        try {
          setSlotsLoading(true);
          const duration = selectedService?.duration || 50;
          const res = await bookingApi.getAvailableSlots(therapist._id, {
            date: selectedDate,
            duration,
          });
          if (res.data?.success) {
            setSlots(res.data.slots);
            setSelectedSlot(null);
          }
        } catch (err) {
          console.error(err);
          setSlots([]);
        } finally {
          setSlotsLoading(false);
        }
      };

      fetchSlots();
    }
  }, [therapist, selectedDate, selectedService]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setSubmitting(true);

    try {
      // 1. Create booking
      const res = await bookingApi.createBooking({
        therapistId: therapist._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        duration: selectedSlot.duration,
        serviceName: selectedService?.name || 'Individual Therapy Consultation',
        clientName,
        clientEmail,
        clientPhone,
        clientNotes,
        paymentMethod: paymentOption,
      });

      if (res.data?.success) {
        const booking = res.data.booking;

        // 2. If online payment simulated/completed
        if (paymentOption === 'online') {
          const payRes = await paymentApi.verifyPayment({
            razorpay_order_id: `ord_${Date.now()}`,
            razorpay_payment_id: `pay_${Date.now()}`,
            razorpay_signature: 'test_signature_valid',
            appointmentId: booking._id,
            therapistId: therapist._id,
            clientId: res.data.client?.id,
            amount: selectedService?.price || therapist.consultationFee,
          });
          setBookingConfirmation({
            booking,
            payment: payRes.data?.payment,
            invoiceNumber: payRes.data?.invoiceNumber,
          });
        } else {
          setBookingConfirmation({
            booking,
          });
        }

        setStep(4);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setBookingError('Double-booking prevented: This slot was just reserved. Please pick another slot.');
        setStep(2);
      } else {
        setBookingError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500 font-medium">
        Loading practitioner profile...
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Practitioner Not Found</h2>
        <p className="text-sm text-slate-600 mb-6 max-w-sm">
          The requested branded URL does not exist or may have been renamed.
        </p>
        <Link to="/" className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
          Return to UNFAZED Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-soft">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={
              therapist.profileImage?.includes('pexels')
                ? therapist.profileImage
                : 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg'
            }
            alt={therapist.name}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover shadow-md border-4 border-white shrink-0"
          />

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200/60 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RCI Licensed Mental Health Practitioner
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {therapist.name}
                </h1>
                <p className="text-sm font-semibold text-brand-700">{therapist.title}</p>
              </div>

              {/* Consultation Fee Pill */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center sm:text-right shrink-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Consultation Fee
                </span>
                <span className="text-2xl font-black text-slate-900">
                  ₹{therapist.consultationFee?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 block">per session</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {therapist.bio}
            </p>

            {/* Quick Meta Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-600" />
                <span>{therapist.experience || 8}+ Years Experience</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-teal-600" />
                <span>Languages: {therapist.languages?.join(', ') || 'English, Hindi'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>{therapist.clinicAddress || 'Bengaluru / Online Video'}</span>
              </div>
            </div>

            {/* CTA Button to open booking */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setBookingModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-teal-600 hover:from-brand-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 hover:shadow-lg transition"
              >
                <Calendar className="w-4 h-4" />
                Book an Appointment
              </button>
              <Link
                to="/login"
                className="w-full sm:w-auto text-center px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Existing Client Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details & Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Services & Specializations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Services Available */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Therapy Services Offered</h2>
            <div className="space-y-4">
              {therapist.services && therapist.services.length > 0 ? (
                therapist.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:border-brand-300 transition group"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{srv.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-600" />
                          {srv.duration} mins
                        </span>
                        <span>•</span>
                        <span className="text-brand-700 font-bold">₹{srv.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedService(srv);
                        setStep(1);
                        setBookingModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 text-xs font-bold text-slate-700 transition"
                    >
                      Select
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Individual Therapy Consultation (50 mins) - ₹{therapist.consultationFee}</p>
              )}
            </div>
          </div>

          {/* Specializations & Modalities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Clinical Focus Areas</h2>
            <div className="flex flex-wrap gap-2">
              {therapist.specializations?.map((spec, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-50 border border-brand-200/60 text-brand-800 text-xs font-bold"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Credentials & Trust */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Qualifications & Licenses</h2>
            <ul className="space-y-3">
              {therapist.qualifications?.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-teal-50/70 border border-teal-200/70 space-y-3">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-teal-700" />
              <span>Strict Privacy Standards</span>
            </div>
            <p className="text-xs text-teal-800 leading-relaxed">
              Sessions booked through UNFAZED are confidential and protected by role-based data encryption. Clinical notes are never exposed.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Booking Wizard Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto relative">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            {/* Stepper Header */}
            <div className="mb-6">
              <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest block mb-1">
                Step {step} of 4 • Appointment Booking
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {step === 1 && 'Select Date & Service'}
                {step === 2 && 'Pick Available Time Slot'}
                {step === 3 && 'Your Information & Payment'}
                {step === 4 && 'Appointment Confirmed!'}
              </h2>
            </div>

            {bookingError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                {bookingError}
              </div>
            )}

            {/* STEP 1: Select Service & Date */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Chosen Service
                  </label>
                  <select
                    value={selectedService?.name || ''}
                    onChange={(e) => {
                      const s = therapist.services.find((x) => x.name === e.target.value);
                      if (s) setSelectedService(s);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-brand-500"
                  >
                    {therapist.services?.map((s, i) => (
                      <option key={i} value={s.name}>
                        {s.name} ({s.duration} mins) — ₹{s.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Session Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow transition mt-4"
                >
                  Continue to Select Time
                </button>
              </div>
            )}

            {/* STEP 2: Pick Time Slot */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50 p-3 rounded-xl">
                  <span>Date: {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button onClick={() => setStep(1)} className="text-brand-600 font-bold hover:underline">
                    Change
                  </button>
                </div>

                <div className="py-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Available Time Slots (50-min with buffer)
                  </label>
                  {slotsLoading ? (
                    <div className="text-center py-8 text-xs text-slate-400">Loading available slots...</div>
                  ) : slots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setSelectedSlot(s)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition text-center ${
                            !s.available
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : selectedSlot?.startTime === s.startTime
                              ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500'
                          }`}
                        >
                          {s.startTime}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200 text-center">
                      No slots available on this date. Practitioner is off or fully booked. Please select another date.
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedSlot}
                    onClick={() => setStep(3)}
                    className="w-2/3 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow transition"
                  >
                    Continue to Details
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Client Details & Payment */}
            {step === 3 && (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-brand-50/70 border border-brand-100 text-xs text-brand-900 flex justify-between">
                  <span>{selectedService?.name}</span>
                  <span className="font-bold">{selectedDate} at {selectedSlot?.startTime}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Aarav Patel"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="aarav@example.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Presenting Concern / Session Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Briefly describe what you'd like to address..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 ${
                        paymentOption === 'online'
                          ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        value="online"
                        checked={paymentOption === 'online'}
                        onChange={() => setPaymentOption('online')}
                        className="hidden"
                      />
                      <CreditCard className="w-4 h-4 text-brand-600" />
                      <span>Razorpay UPI (Test)</span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 ${
                        paymentOption === 'pay_later'
                          ? 'border-brand-500 bg-brand-50 text-brand-900 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        value="pay_later"
                        checked={paymentOption === 'pay_later'}
                        onChange={() => setPaymentOption('pay_later')}
                        className="hidden"
                      />
                      <span>Pay at Clinic / Later</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-teal-600 text-white font-bold text-xs shadow-md hover:shadow transition"
                  >
                    {submitting ? 'Confirming Booking...' : `Confirm & Book (₹${selectedService?.price || 1500})`}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Confirmed & Success */}
            {step === 4 && (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your appointment with <strong className="text-slate-800">{therapist.name}</strong> on{' '}
                  <strong className="text-slate-800">{selectedDate}</strong> at{' '}
                  <strong className="text-slate-800">{selectedSlot?.startTime}</strong> has been confirmed.
                </p>

                {bookingConfirmation?.invoiceNumber && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium max-w-sm mx-auto">
                    Payment Verified! Official Invoice: <strong>{bookingConfirmation.invoiceNumber}</strong>
                  </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                  >
                    Close
                  </button>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
                  >
                    Access Client Portal
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
