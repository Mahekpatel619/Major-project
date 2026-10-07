import React, { useState, useEffect } from 'react';
import { notesApi } from '../../api';
import { FileText, ShieldCheck, Lock, Calendar } from 'lucide-react';

export default function ClientNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notesApi.getNotes().then((res) => {
      if (res.data?.success) {
        setNotes(res.data.notes || []);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shared Therapeutic Takeaways
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Psychoeducational session takeaways and treatment summaries shared by your therapist.
          </p>
        </div>

        <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Patient Privileged Portal</span>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading session takeaways...</div>
        ) : notes.length > 0 ? (
          notes.map((n) => (
            <div
              key={n._id}
              className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{n.title}</h3>
                    <span className="text-[11px] text-slate-400">
                      Logged on {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200">
                  Shared Takeaway
                </span>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap pt-2">
                {n.content || (n.soap?.plan && `Therapy Action Plan:\n${n.soap.plan}`)}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200 space-y-2">
            <Lock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">No shared session takeaways yet.</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Private clinical diagnostic notes remain confidential to your licensed practitioner. Only agreed takeaways appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
