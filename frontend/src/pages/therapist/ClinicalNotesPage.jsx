import React, { useState, useEffect } from 'react';
import { notesApi, clientApi } from '../../api';
import UpgradeModal from '../../components/common/UpgradeModal';
import {
  FileText,
  Plus,
  Lock,
  Users,
  Search,
  CheckCircle2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

export default function ClinicalNotesPage() {
  const [notes, setNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [loading, setLoading] = useState(true);

  // Note Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [targetClient, setTargetClient] = useState('');
  const [title, setTitle] = useState('');
  const [noteType, setNoteType] = useState('private');
  const [templateType, setTemplateType] = useState('soap');
  const [soapS, setSoapS] = useState('');
  const [soapO, setSoapO] = useState('');
  const [soapA, setSoapA] = useState('');
  const [soapP, setSoapP] = useState('');
  const [freeformContent, setFreeformContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Upgrade Modal
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await notesApi.getNotes({
        clientId: selectedClientId || undefined,
      });
      if (res.data?.success) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clientApi.getClients().then((res) => {
      if (res.data?.success) setClients(res.data.clients);
    });
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [selectedClientId]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!targetClient) {
      alert('Please select a client');
      return;
    }

    setSubmitting(true);
    try {
      const res = await notesApi.createNote({
        clientId: targetClient,
        title,
        noteType,
        templateType,
        content: freeformContent,
        soap: {
          subjective: soapS,
          objective: soapO,
          assessment: soapA,
          plan: soapP,
        },
      });

      if (res.data?.success) {
        setModalOpen(false);
        setTitle('');
        setSoapS('');
        setSoapO('');
        setSoapA('');
        setSoapP('');
        setFreeformContent('');
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.upgradeRequired) {
        setUpgradeReason(err.response.data.message);
        setModalOpen(false);
        setUpgradeModalOpen(true);
      } else {
        alert(err.response?.data?.message || 'Failed to save note');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this clinical note?')) return;
    try {
      await notesApi.deleteNote(id);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Clinical Notes & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standardized SOAP and DAP clinical progress documentation with strict privacy controls.
          </p>
        </div>

        <button
          onClick={() => {
            if (clients.length > 0) setTargetClient(clients[0]._id);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Clinical Note
        </button>
      </div>

      {/* Filter by Client */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Filter by Client:</span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="">All Clients ({clients.length})</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Private Notes Isolation Active</span>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading clinical notes...</div>
        ) : notes.length > 0 ? (
          notes.map((n) => (
            <div
              key={n._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                    {n.clientId?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{n.title}</h3>
                    <span className="text-xs text-slate-500">
                      Client: <strong className="text-slate-800">{n.clientId?.name}</strong> •{' '}
                      {new Date(n.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      n.noteType === 'private'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}
                  >
                    {n.noteType === 'private' ? '🔒 Strictly Private' : '👥 Shared with Client'}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(n._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SOAP Template Grid */}
              {n.templateType === 'soap' && n.soap && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <strong className="text-brand-700 block mb-1">Subjective (S):</strong>
                    <p className="text-slate-600">{n.soap.subjective || 'No notes'}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <strong className="text-teal-700 block mb-1">Objective (O):</strong>
                    <p className="text-slate-600">{n.soap.objective || 'No notes'}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <strong className="text-purple-700 block mb-1">Assessment (A):</strong>
                    <p className="text-slate-600">{n.soap.assessment || 'No notes'}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <strong className="text-emerald-700 block mb-1">Plan (P):</strong>
                    <p className="text-slate-600">{n.soap.plan || 'No notes'}</p>
                  </div>
                </div>
              )}

              {/* Freeform content */}
              {n.templateType === 'freeform' && (
                <p className="text-xs text-slate-600 whitespace-pre-wrap pt-1">{n.content}</p>
              )}
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            No clinical session notes found.
          </div>
        )}
      </div>

      {/* Note Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-slate-400 font-bold">
              ✕
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-1">Document Clinical Session</h2>
            <p className="text-xs text-slate-500 mb-4">Complete progress notes using SOAP or Freeform.</p>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Client *
                </label>
                <select
                  required
                  value={targetClient}
                  onChange={(e) => setTargetClient(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                >
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Session 4: CBT Behavioral Activation"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Visibility
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

              {templateType === 'soap' ? (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-brand-700 mb-1">Subjective (S):</label>
                    <textarea
                      rows={2}
                      value={soapS}
                      onChange={(e) => setSoapS(e.target.value)}
                      placeholder="Client symptoms, reported affect..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-teal-700 mb-1">Objective (O):</label>
                    <textarea
                      rows={2}
                      value={soapO}
                      onChange={(e) => setSoapO(e.target.value)}
                      placeholder="Clinician observations, mental status..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-700 mb-1">Assessment (A):</label>
                    <textarea
                      rows={2}
                      value={soapA}
                      onChange={(e) => setSoapA(e.target.value)}
                      placeholder="Diagnostic impression, progress rate..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-700 mb-1">Plan (P):</label>
                    <textarea
                      rows={2}
                      value={soapP}
                      onChange={(e) => setSoapP(e.target.value)}
                      placeholder="Treatment modalities, next session date..."
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Session Summary Note:</label>
                  <textarea
                    rows={5}
                    value={freeformContent}
                    onChange={(e) => setFreeformContent(e.target.value)}
                    placeholder="Type clinical observations and summary here..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition mt-2"
              >
                {submitting ? 'Saving...' : 'Save Clinical Note'}
              </button>
            </form>
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        featureRequired={upgradeReason}
      />
    </div>
  );
}
