import React, { useState, useEffect } from 'react';
import { homeworkApi } from '../../api';
import { BookOpen, CheckCircle2, Clock, Link as LinkIcon, Send } from 'lucide-react';

export default function ClientHomeworkPage() {
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalHw, setActiveModalHw] = useState(null);
  const [reflection, setReflection] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const res = await homeworkApi.getHomework();
      if (res.data?.success) {
        setHomeworkList(res.data.homework || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!activeModalHw) return;

    setSubmitting(true);
    try {
      const res = await homeworkApi.updateHomework(activeModalHw._id, {
        status: 'Completed',
        clientReflection: reflection,
      });
      if (res.data?.success) {
        setActiveModalHw(null);
        setReflection('');
        fetchHomework();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Reflective Homework & Resources
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete behavioral exercises and review psychoeducational guides between sessions.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading assignments...</div>
        ) : homeworkList.length > 0 ? (
          homeworkList.map((hw) => (
            <div
              key={hw._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-sm">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{hw.title}</h3>
                    <span className="text-xs text-slate-500">
                      Due: {hw.dueDate}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    hw.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {hw.status}
                </span>
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      <LinkIcon className="w-3 h-3 text-slate-400" />
                      <span>{r.title} ({r.type})</span>
                    </a>
                  ))}
                </div>
              )}

              {hw.clientReflection ? (
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-950 mt-2">
                  <strong className="block mb-1 text-teal-900">Your Reflection:</strong>
                  <p className="text-teal-800 leading-relaxed">{hw.clientReflection}</p>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActiveModalHw(hw);
                      setReflection('');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark as Completed & Reflect
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
            No homework assignments currently assigned.
          </div>
        )}
      </div>

      {/* Complete Homework Modal */}
      {activeModalHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button onClick={() => setActiveModalHw(null)} className="absolute top-6 right-6 text-slate-400 font-bold">
              ✕
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-1">Complete Assignment</h2>
            <p className="text-xs text-slate-500 mb-4">{activeModalHw.title}</p>

            <form onSubmit={handleComplete} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Thoughts & Learnings
                </label>
                <textarea
                  rows={4}
                  required
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Reflect on how this exercise felt, any difficulties encountered, or insights gained..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition"
              >
                {submitting ? 'Submitting...' : 'Submit Reflection & Mark Complete'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
