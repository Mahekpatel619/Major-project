import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export default function NoShowRiskBadge({ riskLevel, score, contributingFactors, recommendedAction, showDetails = true }) {
  const [showModal, setShowModal] = useState(false);

  let badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let Icon = CheckCircle2;

  if (riskLevel === 'High Risk' || score >= 6) {
    badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
    Icon = ShieldAlert;
  } else if (riskLevel === 'Medium Risk' || score >= 3) {
    badgeClasses = 'bg-amber-50 text-amber-700 border-amber-200';
    Icon = AlertCircle;
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (showDetails) setShowModal(true);
        }}
        type="button"
        title="Click to view rule-based attendance risk breakdown"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition hover:opacity-90 ${badgeClasses}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{riskLevel || (score >= 6 ? 'High Risk' : score >= 3 ? 'Medium Risk' : 'Low Risk')}</span>
        {score !== undefined && <span className="opacity-75 font-mono text-[10px]">({score} pts)</span>}
      </button>

      {/* Risk Factors Breakdown Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${badgeClasses}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Attendance Risk Analysis</h3>
                  <p className="text-xs text-slate-500">Smart No-Show Risk Indicator</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-medium text-slate-600">Calculated Score</span>
                <span className="text-base font-black text-slate-900">{score ?? 0} Points</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contributing Factors</h4>
                {contributingFactors && contributingFactors.length > 0 ? (
                  <div className="space-y-2">
                    {contributingFactors.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-slate-700">
                        <span>{f.factor || f.description}</span>
                        <span className="font-bold text-amber-800">+{f.points} pts</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    No historical missed sessions or unpaid dues recorded. Client demonstrates strong attendance reliability.
                  </p>
                )}
              </div>

              {recommendedAction && (
                <div className="p-3 rounded-xl bg-brand-50/80 border border-brand-100 text-xs">
                  <span className="font-bold text-brand-900 block mb-1">Recommended Practice Action:</span>
                  <p className="text-brand-700">{recommendedAction}</p>
                </div>
              )}

              <p className="text-[10px] text-slate-400 italic">
                * Note: This is an operational scheduling heuristic (missed = +3, late cancel = +2, pending fee = +2); it is not a clinical psychological prediction.
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </>
  );
}
