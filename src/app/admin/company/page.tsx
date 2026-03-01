'use client';

import { useEffect, useState } from 'react';
import { Settings, Save, MapPin, Phone, Mail, Globe, Clock, Layout, Target, Eye, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import Image from 'next/image';

export default function AdminCompanyPage() {
  const [form, setForm] = useState({
    logoUrl: '',
    taglineEn: '',
    taglineBn: '',
    aboutEn: '',
    aboutBn: '',
    visionEn: '',
    visionBn: '',
    missionEn: '',
    missionBn: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    officeHours: '',
    facebookUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    fetch('/api/company')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setForm((f) => ({ ...f, ...d }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) alert('Company profile updated!');
    } catch (e) {
      console.error(e);
      alert('Failed to update company profile.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-action-orange animate-spin" />
        <p className="text-gray-500 font-medium">Accessing company records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-industrial-dark tracking-tight uppercase">Company Identity</h1>
          <p className="text-gray-500 font-medium">Manage branding, vision, and contact details</p>
        </div>
        <button 
          onClick={save} 
          disabled={saving}
          className="flex items-center gap-3 px-10 py-4 bg-action-orange text-white font-black rounded-3xl shadow-xl shadow-action-orange/30 hover:bg-orange-600 transition-all active:scale-95"
        >
          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          {saving ? 'Saving...' : 'Deploy Updates'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Branding & Contact */}
        <div className="lg:col-span-1 space-y-10">
          {/* Logo & Branding */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-industrial-dark flex items-center gap-3 border-b border-gray-100 pb-4">
              <Layout className="w-5 h-5 text-action-orange" />
              Branding
            </h3>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Corporate Logo</label>
              <div className="relative aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                {form.logoUrl ? (
                  <>
                    <Image src={form.logoUrl} alt="Logo" fill className="object-contain p-4" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setShowMediaPicker(true)}
                        className="px-6 py-2 bg-white/20 backdrop-blur-md text-white font-bold rounded-xl"
                      >
                        Update Logo
                      </button>
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={() => setShowMediaPicker(true)}
                    className="flex flex-col items-center gap-2 text-gray-400 hover:text-action-orange transition-colors"
                  >
                    <ImageIcon className="w-10 h-10" />
                    <span className="font-bold text-xs">Pick Logo</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tagline (EN)</label>
                <input 
                  value={form.taglineEn} 
                  onChange={(e) => setForm((f) => ({ ...f, taglineEn: e.target.value }))} 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-action-orange/20 outline-none" 
                  placeholder="Automated packing solutions..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tagline (BN)</label>
                <input 
                  value={form.taglineBn} 
                  onChange={(e) => setForm((f) => ({ ...f, taglineBn: e.target.value }))} 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-action-orange/20 outline-none" 
                  placeholder="অটোমেটেড প্যাকিং সমাধান..."
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-industrial-dark flex items-center gap-3 border-b border-gray-100 pb-4">
              <Phone className="w-5 h-5 text-action-orange" />
              Contact
            </h3>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                  <MapPin className="w-3 h-3" /> HQ Address
                </label>
                <textarea 
                  value={form.address} 
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} 
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <Phone className="w-3 h-3" /> Phone
                  </label>
                  <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-medium" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Mission, Vision, About */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-10">
            <h3 className="text-xl font-black text-industrial-dark flex items-center gap-4 border-b border-gray-100 pb-6">
              <Target className="w-6 h-6 text-action-orange" />
              Vision & Narrative
            </h3>

            {/* Mission & Vision Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 space-y-4">
                  <h4 className="flex items-center gap-2 font-black text-blue-700 text-sm uppercase tracking-wider">
                    <Eye className="w-4 h-4" /> Company Vision
                  </h4>
                  <textarea 
                    value={form.visionEn} 
                    onChange={(e) => setForm((f) => ({ ...f, visionEn: e.target.value }))} 
                    placeholder="English version..."
                    className="w-full bg-white border border-blue-200 rounded-2xl p-4 text-sm font-medium h-32 outline-none"
                  />
                  <textarea 
                    value={form.visionBn} 
                    onChange={(e) => setForm((f) => ({ ...f, visionBn: e.target.value }))} 
                    placeholder="Bengali version..."
                    className="w-full bg-white border border-blue-200 rounded-2xl p-4 text-sm font-medium h-32 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-green-50/50 rounded-3xl border border-green-100 space-y-4">
                  <h4 className="flex items-center gap-2 font-black text-green-700 text-sm uppercase tracking-wider">
                    <Target className="w-4 h-4" /> Company Mission
                  </h4>
                  <textarea 
                    value={form.missionEn} 
                    onChange={(e) => setForm((f) => ({ ...f, missionEn: e.target.value }))} 
                    placeholder="English version..."
                    className="w-full bg-white border border-green-200 rounded-2xl p-4 text-sm font-medium h-32 outline-none"
                  />
                  <textarea 
                    value={form.missionBn} 
                    onChange={(e) => setForm((f) => ({ ...f, missionBn: e.target.value }))} 
                    placeholder="Bengali version..."
                    className="w-full bg-white border border-green-200 rounded-2xl p-4 text-sm font-medium h-32 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Detailed About Us */}
            <div className="space-y-8 bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h4 className="text-sm font-black text-industrial-dark uppercase tracking-widest flex items-center gap-2">
                <Layout className="w-4 h-4 text-action-orange" /> About Us (Home Page / About Page)
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Narrative (English)</label>
                  <textarea 
                    value={form.aboutEn} 
                    onChange={(e) => setForm((f) => ({ ...f, aboutEn: e.target.value }))} 
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl font-medium min-h-[200px] outline-none"
                    placeholder="Describe your company history and expertise..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Narrative (Bengali)</label>
                  <textarea 
                    value={form.aboutBn} 
                    onChange={(e) => setForm((f) => ({ ...f, aboutBn: e.target.value }))} 
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl font-medium min-h-[200px] outline-none"
                    placeholder="বাংলায় কোম্পানির বর্ণনা লিখুন..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMediaPicker && (
        <MediaPicker 
          onSelect={(url) => {
            setForm(f => ({ ...f, logoUrl: url }));
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
          selectedUrl={form.logoUrl}
        />
      )}
    </div>
  );
}
