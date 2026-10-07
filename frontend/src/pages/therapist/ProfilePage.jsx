import React, { useState, useEffect } from 'react';
import { therapistApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { User, Save, ExternalLink, Sparkles, Plus, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [consultationFee, setConsultationFee] = useState(1500);
  const [profileImage, setProfileImage] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [languages, setLanguages] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [services, setServices] = useState([]);

  useEffect(() => {
    therapistApi.getProfile().then((res) => {
      if (res.data?.success && res.data.therapist) {
        const t = res.data.therapist;
        setProfile(t);
        setName(t.name || '');
        setTitle(t.title || '');
        setBio(t.bio || '');
        setConsultationFee(t.consultationFee || 1500);
        setProfileImage(
          t.profileImage?.includes('pexels')
            ? t.profileImage
            : 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg'
        );
        setSpecializations(t.specializations?.join(', ') || '');
        setLanguages(t.languages?.join(', ') || '');
        setClinicAddress(t.clinicAddress || '');
        setPhone(t.phone || '');
        setServices(t.services || []);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await therapistApi.updateProfile({
        name,
        title,
        bio,
        consultationFee: Number(consultationFee),
        profileImage,
        specializations: specializations.split(',').map((s) => s.trim()).filter(Boolean),
        languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
        clinicAddress,
        phone,
        services,
      });

      if (res.data?.success) {
        setMessage('Profile updated successfully!');
        updateUser({ name, profileImage });
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = () => {
    setServices((prev) => [
      ...prev,
      {
        name: 'New Therapy Service',
        duration: 50,
        price: consultationFee,
        description: 'Personalized consultation session.',
      },
    ]);
  };

  const handleServiceChange = (idx, field, value) => {
    setServices((prev) => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  };

  const handleRemoveService = (idx) => {
    setServices((prev) => prev.filter((_, i) => i !== idx));
  };

  if (loading) {
    return <div className="py-16 text-center text-slate-400 font-medium">Loading practitioner profile...</div>;
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Practitioner Profile & Public Page
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Customize your professional bio, service offerings, and branded link details.
          </p>
        </div>

        <a
          href={`/${profile?.slug || 'dr-sharma'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs border border-teal-200 hover:bg-teal-100 transition shrink-0"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Credentials Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Professional Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Profile Photo URL
            </label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
              <img
                src={profileImage || 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg'}
                alt="Preview"
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Professional Bio & Approach
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Specializations (comma separated)
              </label>
              <input
                type="text"
                value={specializations}
                onChange={(e) => setSpecializations(e.target.value)}
                placeholder="Anxiety, CBT, Depression"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Languages (comma separated)
              </label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="English, Hindi"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Base Consultation Fee (INR)
              </label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinic Location / Mode
              </label>
              <input
                type="text"
                value={clinicAddress}
                onChange={(e) => setClinicAddress(e.target.value)}
                placeholder="Bengaluru / Online Video"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Therapy Services Offered */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Custom Services List</h2>
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs hover:bg-brand-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Service
            </button>
          </div>

          <div className="space-y-3">
            {services.map((srv, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Service Name</label>
                    <input
                      type="text"
                      value={srv.name}
                      onChange={(e) => handleServiceChange(idx, 'name', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration & Price</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={srv.duration}
                        onChange={(e) => handleServiceChange(idx, 'duration', Number(e.target.value))}
                        className="w-16 p-2 rounded-lg border border-slate-200 text-xs"
                      />
                      <span>mins</span>
                      <input
                        type="number"
                        value={srv.price}
                        onChange={(e) => handleServiceChange(idx, 'price', Number(e.target.value))}
                        className="w-20 p-2 rounded-lg border border-slate-200 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={srv.description || ''}
                    onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                    placeholder="Short description..."
                    className="flex-1 p-2 rounded-lg border border-slate-200 text-xs mr-3"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="text-rose-600 font-bold p-1 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow transition"
        >
          {saving ? 'Saving Changes...' : 'Save Profile & Update Branded Page'}
        </button>
      </form>
    </div>
  );
}
