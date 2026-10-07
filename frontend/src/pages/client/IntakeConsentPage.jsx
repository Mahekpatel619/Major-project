import React, { useState, useEffect } from 'react';
import { clientApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function IntakeConsentPage() {
  const { user, updateUser } = useAuth();
  const [activeStep, setActiveStep] = useState(1);

  // Intake states
  const [presentingConcern, setPresentingConcern] = useState('');
  const [previousTherapy, setPreviousTherapy] = useState('');
  const [medications, setMedications] = useState('');
  const [goals, setGoals] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('');
  const [intakeSuccess, setIntakeSuccess] = useState(false);

  // Consent states
  const [signatureName, setSignatureName] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [consentSuccess, setConsentSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      clientApi.getClientDetails(user.id).then((res) => {
        if (res.data?.success && res.data.client) {
          const c = res.data.client;
          if (c.intakeCompleted) {
            setIntakeSuccess(true);
            setPresentingConcern(c.intakeData?.presentingConcern || '');
            setPreviousTherapy(c.intakeData?.previousTherapyExperience || '');
            setMedications(c.intakeData?.currentMedications || '');
            setGoals(c.intakeData?.goalsForTherapy || '');
          }
          if (c.consentSigned) {
            setConsentSuccess(true);
          }
        }
      });
    }
  }, [user?.id]);

  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await clientApi.submitIntake({
        presentingConcern,
        previousTherapyExperience: previousTherapy,
        currentMedications: medications,
        goalsForTherapy: goals,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRel,
        },
      });

      if (res.data?.success) {
        setIntakeSuccess(true);
        updateUser({ intakeCompleted: true });
        setActiveStep(2);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit intake');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConsentSubmit = async (e) => {
    e.preventDefault();
    if (!agreedTerms || !signatureName.trim()) {
      alert('Please check the agreement box and provide your electronic signature name');
      return;
    }

    setSubmitting(true);
    try {
      const res = await clientApi.submitConsent({
        consentText: 'I understand confidentiality limitations and private practice policies under Indian healthcare law.',
        signatureName: signatureName.trim(),
      });

      if (res.data?.success) {
        setConsentSuccess(true);
        updateUser({ consentSigned: true });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit consent');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Client Intake & Informed Consent
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your initial background history and legal informed consent prior to sessions.
        </p>
      </div>

      {/* Stepper Tabs */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveStep(1)}
          className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
            activeStep === 1
              ? 'border-teal-600 bg-teal-50/60 shadow-sm'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Step 1</span>
            <span className="font-bold text-sm text-slate-900">Clinical Intake Form</span>
          </div>
          {intakeSuccess && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
        </button>

        <button
          onClick={() => setActiveStep(2)}
          className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
            activeStep === 2
              ? 'border-teal-600 bg-teal-50/60 shadow-sm'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Step 2</span>
            <span className="font-bold text-sm text-slate-900">Informed Consent</span>
          </div>
          {consentSuccess && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
        </button>
      </div>

      {/* STEP 1: INTAKE */}
      {activeStep === 1 && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Initial Background & Presenting Concerns</h2>
            {intakeSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Intake Completed
              </span>
            )}
          </div>

          <form onSubmit={handleIntakeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Presenting Concern *
              </label>
              <textarea
                rows={3}
                required
                value={presentingConcern}
                onChange={(e) => setPresentingConcern(e.target.value)}
                placeholder="What prompted you to seek therapy at this time? (e.g. Work stress, anxiety, relationship difficulties)"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Goals for Therapy *
              </label>
              <textarea
                rows={2}
                required
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="What would you like to achieve or feel differently by attending sessions?"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Prior Therapy Experience
                </label>
                <input
                  type="text"
                  value={previousTherapy}
                  onChange={(e) => setPreviousTherapy(e.target.value)}
                  placeholder="e.g. None, or 3 months CBT in 2024"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Medications (if any)
                </label>
                <input
                  type="text"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="e.g. None, or SSRI prescribed"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-2">Emergency Contact Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Contact Name"
                  className="p-2 rounded-lg border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  placeholder="Relationship (e.g. Spouse)"
                  className="p-2 rounded-lg border border-slate-200 text-xs"
                />
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition mt-4"
            >
              {submitting ? 'Saving Intake...' : 'Save & Proceed to Informed Consent'}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: CONSENT */}
      {activeStep === 2 && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Informed Consent & Practice Policies</h2>
            {consentSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Consent Signed
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3 leading-relaxed max-h-56 overflow-y-auto">
            <h4 className="font-bold text-slate-900">1. Confidentiality & Legal Exceptions</h4>
            <p>
              Information discussed during psychotherapy sessions is confidential and protected by ethical guidelines under the Rehabilitation Council of India (RCI). Exceptions to confidentiality occur solely when there is imminent risk of harm to self or others, child abuse, or a mandatory court subpoena.
            </p>
            <h4 className="font-bold text-slate-900">2. Cancellation & Rescheduling Policy</h4>
            <p>
              We kindly require at least 24 hours notice for rescheduling or cancellations to allow other clients access to open slots. Late cancellations may incur regular session fees.
            </p>
            <h4 className="font-bold text-slate-900">3. Telehealth & Communication</h4>
            <p>
              Telehealth sessions occur over secure video channels. In case of acute psychiatric emergency, please contact local national helplines (e.g. Tele-MANAS: 14416 / Vandrevala: 9999 666 555) as UNFAZED does not provide 24/7 crisis intervention.
            </p>
          </div>

          {consentSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <strong>Your informed consent is on file and legally verified.</strong>
              <p className="text-emerald-700">Thank you for completing onboarding. You are all set for your sessions!</p>
            </div>
          ) : (
            <form onSubmit={handleConsentSubmit} className="space-y-4">
              <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 mt-0.5"
                />
                <span>
                  I have read, understood, and agree to the practice policies, fee schedules, and confidentiality standards set forth above.
                </span>
              </label>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Electronic Signature (Type Full Legal Name) *
                </label>
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="e.g. Aarav Patel"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 font-serif text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition mt-2"
              >
                {submitting ? 'Recording Consent...' : 'Sign Informed Consent'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
