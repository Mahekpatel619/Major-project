import React, { useState, useEffect } from 'react';
import { homeworkApi, clientApi } from '../../api';
import { BookOpen, Plus, CheckCircle2, Clock, Link as LinkIcon, Trash2 } from 'lucide-react';

export default function HomeworkPage() {
  const [homeworkList, setHomeworkList] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [targetClient, setTargetClient] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const res = await homeworkApi.getHomework();
      if (res.data?.success) {
        setHomeworkList(res.data.homework);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clientApi.getClients().then((res) => {
      if (res.data?.success && res.data.clients.length > 0) {
        setClients(res.data.clients);
        setTargetClient(res.data.clients[0]._id);
      }
    });
    fetchHomework();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const resources = [];
      if (resourceTitle && resourceUrl) {
        resources.push({
          title: resourceTitle,
          url: resourceUrl,
          type: 'Link',
        });
      }

      const res = await homeworkApi.createHomework({
        clientId: targetClient,
        title,
        description,
        dueDate,
        resources,
      });

      if (res.data?.success) {
        setModalOpen(false);
        setTitle('');
        setDescription('');
        setDueDate('');
        setResourceTitle('');
        setResourceUrl('');
        fetchHomework();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to assign homework');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this homework assignment?')) return;
    try {
      await homeworkApi.deleteHomework(id);
      fetchHomework();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Homework & Psychoeducational Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Assign behavioral activation tasks, CBT thought records, and track client reflections.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Assign Reflective Homework
        </button>
      </div>

      {/* Homework List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading assignments...</div>
        ) : homeworkList.length > 0 ? (
          homeworkList.map((hw) => (
            <div
              key={hw._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-sm">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{hw.title}</h3>
                    <span className="text-xs text-slate-500">
                      Client: <strong className="text-slate-800">{hw.clientId?.name}</strong> • Due by {hw.dueDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      hw.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {hw.status}
                  </span>
                  <button
                    onClick={() => handleDelete(hw._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{hw.description}</p>

              {hw.resources?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {hw.resources.map((r, rIdx) => (
                    <a
                      key={rIdx}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      <LinkIcon className="w-3 h-3 text-slate-400" />
                      <span>{r.title}</span>
                    </a>
                  ))}
                </div>
              )}

              {hw.clientReflection && (
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-950 mt-2">
                  <strong className="block mb-1 text-teal-900">Client Completion Reflection:</strong>
                  <p className="text-teal-800 leading-relaxed">{hw.clientReflection}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            No homework assignments found.
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-slate-400 font-bold">
              ✕
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-1">Assign Homework</h2>
            <p className="text-xs text-slate-500 mb-4">Set reflective activities for your client.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Client *
                </label>
                <select
                  required
                  value={targetClient}
                  onChange={(e) => setTargetClient(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                >
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Exercise Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cognitive Distortions Log"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Instructions & Guidelines
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed directions for the client..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Attach Resource (Optional Link/PDF):</span>
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="Resource title (e.g. Guided Audio Link)"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
                <input
                  type="url"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition mt-2"
              >
                {submitting ? 'Assigning...' : 'Assign to Client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
