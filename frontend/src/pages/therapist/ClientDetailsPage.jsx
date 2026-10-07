import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientApi, notesApi, homeworkApi } from '../../api';
import NoShowRiskBadge from '../../components/common/NoShowRiskBadge';
import {
  User,
  Calendar,
  CreditCard,
  FileText,
  Smile,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function ClientDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Quick Note creation modal inside client details
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteType, setNoteType] = useState('private');
  const [templateType, setTemplateType] = useState('soap');
  const [soapS, setSoapS] = useState('');
  const [soapO, setSoapO] = useState('');
  const [soapA, setSoapA] = useState('');
  const [soapP, setSoapP] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      const res = await clientApi.getClientDetails(id);
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setSubmittingNote(true);

    try {
      const res = await notesApi.createNote({
        clientId: id,
        title: noteTitle || 'Clinical Progress Note',
        noteType,
        templateType,
        soap: {
          subjective: soapS,
          objective: soapO,
          assessment: soapA,
          plan: soapP,
        },
      });

      if (res.data?.success) {
        setNoteModalOpen(false);
        setNoteTitle('');
        setSoapS('');
        setSoapO('');
        setSoapA('');
        setSoapP('');
        fetchClientDetails();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-400 font-medium">Loading clinical client records...</div>;
  }

  if (!data?.client) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-lg font-bold text-slate-900">Client Not Found</h3>
        <Link to="/clients" className="text-xs text-brand-600 font-bold mt-2 inline-block">
          ← Back to Clients List
        </Link>
      </div>
    );
  }

  const { client, sessions, payments, notes, moods, homework, consent, risk } = data;

  const tabs = [
    { id: 'overview', name: 'Overview & Risk', icon: AlertTriangle },
    { id: 'notes', name: `Clinical Notes (${notes?.length || 0})`, icon: FileText },
    { id: 'appointments', name: `Appointments (${sessions?.length || 0})`, icon: Calendar },
    { id: 'payments', name: `Payments (${payments?.length || 0})`, icon: CreditCard },
    { id: 'mood', name: `Mood History (${moods?.length || 0})`, icon: Smile },
    { id: 'homework', name: `Homework (${homework?.length || 0})`, icon: BookOpen },
    { id: 'intake', name: 'Intake & Consent', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Back button */}
      <Link
        to="/clients"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Clients Directory
      </Link>

      {/* Client Header Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-teal-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {client.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900">{client.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                {client.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {client.email} • {client.phone || 'No phone'} • Gender: {client.gender}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {client.tags?.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Badge with Actionable Info */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-right shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Smart No-Show Risk Indicator
          </span>
          <div className="flex items-center justify-end gap-2">
            <NoShowRiskBadge
              riskLevel={risk?.riskLevel}
              score={risk?.score}
              contributingFactors={risk?.contributingFactors}
              recommendedAction={risk?.recommendedAction}
            />
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            {risk?.score ?? 0} points computed
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & RISK BREAKDOWN */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk Detail Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Attendance Risk Factors</h3>
              <NoShowRiskBadge riskLevel={risk?.riskLevel} score={risk?.score} showDetails={false} />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              The Smart No-Show Risk Indicator calculates attendance probability using rule-based scoring:
              Missed appointment = <strong>+3</strong>, Late cancellation = <strong>+2</strong>, Pending payment = <strong>+2</strong>.
            </p>

            <div className="space-y-2 pt-2">
              {risk?.contributingFactors?.length > 0 ? (
                risk.contributingFactors.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-3 rounded-xl bg-amber-50 border border-amber-200/80">
                    <span className="font-medium text-amber-900">{f.factor}</span>
                    <span className="font-bold text-amber-950">+{f.points} pts ({f.count} occurrences)</span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                  ✓ Excellent attendance history. Zero missed appointments or uncollected balances.
                </div>
              )}
            </div>

            {risk?.recommendedAction && (
              <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-900">
                <span className="font-bold block mb-1">Recommended Action:</span>
                {risk.recommendedAction}
              </div>
            )}
          </div>

          {/* Quick Metrics & Intake Preview */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-bold text-base text-slate-900">Clinical Presenting Concerns</h3>
            {client.intakeCompleted ? (
              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900 block">Presenting Concern:</span>
                  <p className="mt-0.5">{client.intakeData?.presentingConcern || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Goals for Therapy:</span>
                  <p className="mt-0.5">{client.intakeData?.goalsForTherapy || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Current Medications:</span>
                  <p className="mt-0.5">{client.intakeData?.currentMedications || 'None'}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                Client has not completed the multi-step intake form yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL NOTES (SOAP/DAP) */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Session Clinical Notes</h3>
            <button
              onClick={() => setNoteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Write SOAP / DAP Note
            </button>
          </div>

          {notes?.length > 0 ? (
            <div className="space-y-4">
              {notes.map((n) => (
                <div key={n._id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        n.noteType === 'private' ? 'bg-slate-100 text-slate-700' : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {n.noteType === 'private' ? '🔒 Strictly Private (Clinician Only)' : '👥 Shared with Client'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  {n.templateType === 'soap' && n.soap && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <strong className="text-brand-700 block mb-1">Subjective (S):</strong>
                        <p className="text-slate-600">{n.soap.subjective || 'No notes'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <strong className="text-teal-700 block mb-1">Objective (O):</strong>
                        <p className="text-slate-600">{n.soap.objective || 'No notes'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <strong className="text-purple-700 block mb-1">Assessment (A):</strong>
                        <p className="text-slate-600">{n.soap.assessment || 'No notes'}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <strong className="text-emerald-700 block mb-1">Plan (P):</strong>
                        <p className="text-slate-600">{n.soap.plan || 'No notes'}</p>
                      </div>
                    </div>
                  )}

                  {n.templateType === 'freeform' && (
                    <p className="text-xs text-slate-600 whitespace-pre-wrap">{n.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center bg-white rounded-3xl border border-slate-200">
              No session clinical notes logged yet.
            </p>
          )}
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase">
              <tr>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Service</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Fee</th>
                <th className="py-3.5 px-6">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sessions?.map((s) => (
                <tr key={s._id}>
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    {s.date} at {s.startTime}
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{s.serviceName}</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      s.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                      s.status === 'No-show' ? 'bg-rose-50 text-rose-700' :
                      s.status === 'Cancelled' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold">₹{s.fee}</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      s.paymentStatus === 'Paid' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {s.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: PAYMENTS & INVOICES */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase">
              <tr>
                <th className="py-3.5 px-6">Invoice #</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Method</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">PDF Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments?.map((p) => (
                <tr key={p._id}>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{p.invoiceNumber}</td>
                  <td className="py-3.5 px-6 text-slate-500">{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">₹{p.amount}</td>
                  <td className="py-3.5 px-6 text-slate-600">{p.paymentMethod}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <a
                      href={`/api/payments/${p._id}/invoice`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-600 font-bold hover:underline"
                    >
                      <span>Download PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: MOOD HISTORY */}
      {activeTab === 'mood' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900">Recent Mood & Emotional Trajectory</h3>
          {moods?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map((m) => (
                <div key={m._id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{m.date}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      m.mood === 'Happy' ? 'bg-emerald-50 text-emerald-700' :
                      m.mood === 'Okay' ? 'bg-blue-50 text-blue-700' :
                      m.mood === 'Stressed' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {m.mood}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{m.note || 'No notes added'}"</p>
                  <div className="text-[10px] text-slate-400 font-semibold">
                    Energy: {m.energyLevel || 3}/5
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center bg-white rounded-3xl border border-slate-200">
              No mood entries logged by client yet.
            </p>
          )}
        </div>
      )}

      {/* TAB 6: HOMEWORK & REFLECTION */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900">Assigned Homework & Psychoeducation</h3>
          {homework?.length > 0 ? (
            <div className="space-y-3">
              {homework.map((hw) => (
                <div key={hw._id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{hw.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      hw.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {hw.status} (Due: {hw.dueDate})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{hw.description}</p>
                  {hw.clientReflection && (
                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-xs text-teal-900 mt-2">
                      <strong className="block mb-0.5">Client Reflection:</strong>
                      {hw.clientReflection}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center bg-white rounded-3xl border border-slate-200">
              No homework assigned yet.
            </p>
          )}
        </div>
      )}

      {/* TAB 7: INTAKE & CONSENT */}
      {activeTab === 'intake' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-6">
          <h3 className="font-bold text-base text-slate-900">Informed Consent Legal Record</h3>
          {consent ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Digitally Signed & Verified</span>
              </div>
              <p className="text-slate-600">Version: {consent.consentVersion}</p>
              <p className="text-slate-600">Electronic Signature: <strong>{consent.clientSignatureName}</strong></p>
              <p className="text-slate-600">Signed At: {new Date(consent.signedAt).toLocaleString('en-IN')}</p>
              <p className="text-slate-600">Recorded IP: {consent.ipAddress}</p>
            </div>
          ) : (
            <p className="text-xs text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-200">
              Informed consent has not been signed electronically by this client yet.
            </p>
          )}
        </div>
      )}

      {/* Add Clinical Note Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setNoteModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-1">New Clinical Session Note</h2>
            <p className="text-xs text-slate-500 mb-4">
              Structured clinical documentation with privacy controls.
            </p>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Session 3: Cognitive Reframing"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Privacy Visibility
                  </label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="private">🔒 Strictly Private (Clinician)</option>
                    <option value="shared">👥 Shared with Client</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Template Format
                  </label>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="soap">SOAP Clinical Template</option>
                    <option value="freeform">Freeform Quick Note</option>
                  </select>
                </div>
              </div>

              {templateType === 'soap' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-brand-700 mb-1">
                      Subjective (S) - Client verbalized symptoms & thoughts:
                    </label>
                    <textarea
                      rows={2}
                      value={soapS}
                      onChange={(e) => setSoapS(e.target.value)}
                      placeholder="e.g. Client reported feeling anxious during sprint planning..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-teal-700 mb-1">
                      Objective (O) - Clinician behavioral observations & affect:
                    </label>
                    <textarea
                      rows={2}
                      value={soapO}
                      onChange={(e) => setSoapO(e.target.value)}
                      placeholder="e.g. Affect congruent, speech rapid but coherent..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-700 mb-1">
                      Assessment (A) - Clinical interpretation & progress:
                    </label>
                    <textarea
                      rows={2}
                      value={soapA}
                      onChange={(e) => setSoapA(e.target.value)}
                      placeholder="e.g. Demonstrating improved awareness of cognitive distortions..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 mb-1">
                      Plan (P) - Treatment steps & homework:
                    </label>
                    <textarea
                      rows={2}
                      value={soapP}
                      onChange={(e) => setSoapP(e.target.value)}
                      placeholder="e.g. Complete daily 5-column thought record..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submittingNote}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition mt-2"
              >
                {submittingNote ? 'Saving Note...' : 'Save Clinical Note'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
