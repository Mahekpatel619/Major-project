import React, { useState, useEffect } from 'react';
import { packageApi } from '../../api';
import { Package, Plus, Sparkles, Check, Clock } from 'lucide-react';
import UpgradeModal from '../../components/common/UpgradeModal';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  const [name, setName] = useState('');
  const [numberOfSessions, setNumberOfSessions] = useState(3);
  const [price, setPrice] = useState(4050);
  const [validityDays, setValidityDays] = useState(60);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await packageApi.getPackages();
      if (res.data?.success) {
        setPackages(res.data.packages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await packageApi.createPackage({
        name,
        numberOfSessions: Number(numberOfSessions),
        price: Number(price),
        validityDays: Number(validityDays),
        description,
      });

      if (res.data?.success) {
        setModalOpen(false);
        setName('');
        fetchPackages();
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.upgradeRequired) {
        setUpgradeReason(err.response.data.message);
        setModalOpen(false);
        setUpgradeModalOpen(true);
      } else {
        alert(err.response?.data?.message || 'Failed to create bundle');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Session Care Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Offer bundled session packages (3, 6, 12 sessions) to encourage treatment continuity.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Care Bundle
        </button>
      </div>

      {/* Package Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-4">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">{pkg.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{pkg.description}</p>
              <div className="mb-4">
                <span className="text-2xl font-black text-slate-900">₹{pkg.price?.toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-500"> ({pkg.numberOfSessions} Sessions)</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Validity: {pkg.validityDays} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Discount Applied: {pkg.discountPercentage}% off</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <span className="block w-full text-center py-2.5 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200">
                Active Bundle
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Package Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-slate-400 font-bold">
              ✕
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-1">Create Care Bundle</h2>
            <p className="text-xs text-slate-500 mb-4">Add a new discounted bundle for clients.</p>

            <form onSubmit={handleCreatePackage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bundle Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anxiety Recovery Bundle (6 Sessions)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    # of Sessions
                  </label>
                  <select
                    value={numberOfSessions}
                    onChange={(e) => setNumberOfSessions(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                  >
                    <option value={3}>3 Sessions</option>
                    <option value={6}>6 Sessions</option>
                    <option value={12}>12 Sessions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Validity (Days)
                </label>
                <input
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief bundle benefits..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition mt-2"
              >
                {submitting ? 'Creating Bundle...' : 'Save Package Bundle'}
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
