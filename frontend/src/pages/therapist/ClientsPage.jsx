import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientApi } from '../../api';
import NoShowRiskBadge from '../../components/common/NoShowRiskBadge';
import UpgradeModal from '../../components/common/UpgradeModal';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  // Add Client Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState('General Anxiety');
  const [gender, setGender] = useState('Prefer not to say');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Entitlement Modal
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await clientApi.getClients({
        search,
        status: statusFilter,
        sort: sortOption,
      });
      if (res.data?.success) {
        setClients(res.data.clients);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search, statusFilter, sortOption]);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await clientApi.createClient({
        name,
        email,
        phone,
        tags: tags.split(',').map((t) => t.trim()),
        gender,
      });

      if (res.data?.success) {
        setAddModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        fetchClients();
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.upgradeRequired) {
        setUpgradeReason(err.response.data.message);
        setAddModalOpen(false);
        setUpgradeModalOpen(true);
      } else {
        setFormError(err.response?.data?.message || 'Failed to add client');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Client Management (CRM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of your private practice patients, attendance risk metrics, and clinical records.
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Lead">Lead</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-500">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading clients directory...</div>
        ) : clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Client Name</th>
                  <th className="py-3.5 px-6">Contact Details</th>
                  <th className="py-3.5 px-6">Tags / Focus Area</th>
                  <th className="py-3.5 px-6">No-Show Risk Indicator</th>
                  <th className="py-3.5 px-6">Total Sessions</th>
                  <th className="py-3.5 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {clients.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-4 px-6">
                      <Link to={`/clients/${c._id}`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-brand-600 transition block">
                            {c.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {c.status} • {c.gender}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <div>{c.email}</div>
                      <div className="text-slate-400 text-[11px]">{c.phone || 'No phone'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {c.tags?.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <NoShowRiskBadge
                        riskLevel={c.riskLevel}
                        score={c.riskScore}
                      />
                    </td>
                    <td className="py-4 px-6 text-slate-800 font-bold">
                      {c.totalSessions ?? 0} sessions
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/clients/${c._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 font-bold text-[11px] transition"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">No clients found matching criteria.</div>
        )}
      </div>

      {/* Add Client Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
            <h2 className="text-xl font-black text-slate-900 mb-1">Add New Client</h2>
            <p className="text-xs text-slate-500 mb-4">
              Manually register a client into your practice CRM.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meera Krishnan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="meera@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Anxiety, CBT, Work Stress"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow transition mt-2"
              >
                {submitting ? 'Creating...' : 'Save Client to Practice'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Centralized Entitlement Gate Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        featureRequired={upgradeReason}
      />
    </div>
  );
}
