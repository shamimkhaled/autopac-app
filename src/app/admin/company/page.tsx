'use client';

import { useEffect, useState } from 'react';
import {
  Save,
  MapPin,
  Phone,
  Mail,
  Clock,
  Layout,
  Target,
  Eye,
  Image as ImageIcon,
  Check,
  Loader2,
} from 'lucide-react';
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
    mapEmbedUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    fetch('/api/company')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          const sanitized = Object.fromEntries(
            Object.entries(d).map(([k, v]) => [k, v === null || v === undefined ? '' : v])
          );
          setForm((f) => ({ ...f, ...sanitized }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    try {
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSavedMsg({ type: 'ok', text: 'Company profile updated across header, footer, and contact pages.' });
      } else {
        setSavedMsg({ type: 'err', text: 'Failed to update company profile.' });
      }
    } catch (e) {
      console.error(e);
      setSavedMsg({ type: 'err', text: 'Network error while updating company profile.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading company profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Company identity
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Manage logo, Dhaka HQ contact lines, YouTube channel, social links, vision, and narrative.
          </p>
        </div>
        <button type="button" onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save company profile'}
        </button>
      </div>

      {savedMsg && (
        <div
          role="status"
          className={`px-4 py-2.5 rounded-md border text-sm flex items-center gap-2 ${
            savedMsg.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {savedMsg.type === 'ok' && <Check className="w-4 h-4" />}
          {savedMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="surface-card p-5 space-y-5">
            <h3 className="font-display text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
              <Layout className="w-4 h-4 text-brand-maroon" />
              Branding
            </h3>

            <div>
              <label className="field-label">Corporate Logo</label>
              <div className="relative aspect-video bg-brand-paper/50 rounded-md border border-dashed border-stone-300 flex items-center justify-center overflow-hidden group">
                {form.logoUrl ? (
                  <>
                    <Image src={form.logoUrl} alt="Logo" fill sizes="100vw" unoptimized className="object-contain p-4" />
                    <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setShowMediaPicker(true)}
                        className="px-4 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded-md"
                      >
                        Update logo
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="flex flex-col items-center gap-2 text-stone-400 hover:text-brand-maroon transition-colors"
                  >
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-xs font-medium">Pick logo</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="field-label">Tagline (English)</label>
              <input
                value={form.taglineEn}
                onChange={(e) => setForm((f) => ({ ...f, taglineEn: e.target.value }))}
                className="input-field"
                placeholder="Automated packing solutions..."
              />
            </div>
            <div>
              <label className="field-label">Tagline (Bengali)</label>
              <input
                value={form.taglineBn}
                onChange={(e) => setForm((f) => ({ ...f, taglineBn: e.target.value }))}
                className="input-field"
                placeholder="অটোমেটেড প্যাকিং সমাধান..."
              />
            </div>
          </div>

          <div className="surface-card p-5 space-y-4">
            <h3 className="font-display text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
              <Phone className="w-4 h-4 text-brand-maroon" />
              Contact & Channels
            </h3>
            <div>
              <label className="field-label flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> HQ Address
              </label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="input-field py-2.5"
              />
            </div>
            <div>
              <label className="field-label flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="input-field tabular-nums"
              />
            </div>
            <div>
              <label className="field-label flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label">WhatsApp (no +)</label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                placeholder="8801818496642"
                className="input-field tabular-nums"
              />
            </div>
            <div>
              <label className="field-label">Website</label>
              <input
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Office hours
              </label>
              <input
                value={form.officeHours}
                onChange={(e) => setForm((f) => ({ ...f, officeHours: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label">Facebook URL</label>
              <input
                value={form.facebookUrl}
                onChange={(e) => setForm((f) => ({ ...f, facebookUrl: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label">YouTube URL</label>
              <input
                value={form.youtubeUrl}
                onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label">LinkedIn URL</label>
              <input
                value={form.linkedinUrl}
                onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="field-label">Google Maps Embed URL</label>
              <textarea
                rows={3}
                value={form.mapEmbedUrl}
                onChange={(e) => setForm((f) => ({ ...f, mapEmbedUrl: e.target.value }))}
                placeholder="https://www.google.com/maps/embed?..."
                className="input-field py-2.5 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card p-5 sm:p-6 space-y-6">
            <h3 className="font-display text-lg font-semibold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
              <Target className="w-4 h-4 text-brand-maroon" />
              Vision, Mission & About Story
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md border border-stone-200 bg-brand-paper/40 space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-maroon">
                  <Eye className="w-4 h-4" /> Company Vision
                </h4>
                <textarea
                  rows={4}
                  value={form.visionEn}
                  onChange={(e) => setForm((f) => ({ ...f, visionEn: e.target.value }))}
                  placeholder="English version..."
                  className="input-field py-2 text-sm"
                />
                <textarea
                  rows={4}
                  value={form.visionBn}
                  onChange={(e) => setForm((f) => ({ ...f, visionBn: e.target.value }))}
                  placeholder="Bengali version..."
                  className="input-field py-2 text-sm"
                />
              </div>

              <div className="p-4 rounded-md border border-stone-200 bg-brand-paper/40 space-y-3">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-maroon">
                  <Target className="w-4 h-4" /> Company Mission
                </h4>
                <textarea
                  rows={4}
                  value={form.missionEn}
                  onChange={(e) => setForm((f) => ({ ...f, missionEn: e.target.value }))}
                  placeholder="English version..."
                  className="input-field py-2 text-sm"
                />
                <textarea
                  rows={4}
                  value={form.missionBn}
                  onChange={(e) => setForm((f) => ({ ...f, missionBn: e.target.value }))}
                  placeholder="Bengali version..."
                  className="input-field py-2 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                About Us Narrative (Home & About Page)
              </h4>
              <div>
                <label className="field-label">Narrative (English)</label>
                <textarea
                  rows={6}
                  value={form.aboutEn}
                  onChange={(e) => setForm((f) => ({ ...f, aboutEn: e.target.value }))}
                  className="input-field py-2.5"
                  placeholder="Describe company history and expertise..."
                />
              </div>
              <div>
                <label className="field-label">Narrative (Bengali)</label>
                <textarea
                  rows={6}
                  value={form.aboutBn}
                  onChange={(e) => setForm((f) => ({ ...f, aboutBn: e.target.value }))}
                  className="input-field py-2.5"
                  placeholder="বাংলায় কোম্পানির বর্ণনা লিখুন..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMediaPicker && (
        <MediaPicker
          onSelect={(url) => {
            setForm((f) => ({ ...f, logoUrl: url }));
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
          selectedUrl={form.logoUrl}
        />
      )}
    </div>
  );
}
