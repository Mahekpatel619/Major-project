import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../api';
import { CreditCard, Download, ExternalLink, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getTherapistPayments();
        if (res.data?.success) {
          setPayments(res.data.payments);
          setTotalCollected(res.data.totalCollected);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Financials & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track collected consultation fees, Razorpay transactions, and generate PDFKit receipts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
              Total Revenue Collected
            </span>
            <span className="text-xl font-black text-emerald-950">
              ₹{totalCollected?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading transactions...</div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Invoice #</th>
                  <th className="py-3.5 px-6">Billed Client</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Payment Mode</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {p.clientId?.name || 'Client'}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 text-sm">
                      ₹{p.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {p.paymentMethod}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.paymentStatus === 'Successful'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={`/api/payments/${p._id}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                      >
                        <Download className="w-3.5 h-3.5 text-brand-600" />
                        <span>PDF Invoice</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">No payment records found.</div>
        )}
      </div>
    </div>
  );
}
