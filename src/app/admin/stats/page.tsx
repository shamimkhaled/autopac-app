'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, BarChart3, GripVertical, Check } from 'lucide-react';

interface Stat {
  id: string;
  labelEn: string;
  labelBn: string;
  value: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

const ICONS = ['zap', 'award', 'users', 'shield', 'target', 'star', 'trending', 'package'];

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setStats(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof Stat, value: string | number | boolean) => {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const add = () => {
    const newStat: Stat = {
      id: `new-${Date.now()}`,
      labelEn: '',
      labelBn: '',
      value: '0+',
      icon: 'award',
      sortOrder: stats.length,
      isActive: true,
    };
    setStats((prev) => [...prev, newStat]);
  };

  const remove = async (id: string) => {
    if (id.startsWith('new-')) {
      setStats((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    try {
      await fetch('/api/admin/stats', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setStats((prev) => prev.filter((s) => s.id !== id));
      setStatus({ type: 'ok', text: 'Counter deleted.' });
    } catch {
      setStatus({ type: 'err', text: 'Failed to delete counter.' });
    }
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });
      setStatus({ type: 'ok', text: 'Legacy counters saved.' });
      const res = await fetch('/api/admin/stats');
      const updated = await res.json();
      if (Array.isArray(updated)) setStats(updated);
    } catch (e) {
      console.error(e);
      setStatus({ type: 'err', text: 'Failed to save counters.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading counters…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-maroon" /> Legacy counters
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Edit the milestone figures displayed on the Auto Pac homepage and About page.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={add} className="btn-secondary">
            <Plus className="w-4 h-4" /> Add counter
          </button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {status && (
        <div
          role="status"
          className={`px-4 py-2.5 rounded-md border text-sm flex items-center gap-2 ${
            status.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {status.type === 'ok' && <Check className="w-4 h-4" />}
          {status.text}
        </div>
      )}

      {/* Preview Banner */}
      <div className="bg-brand-maroon rounded-md p-5 sm:p-6 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 mb-4">
          Live Preview · Milestone Strip
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats
            .filter((s) => s.isActive)
            .map((s) => (
              <div key={s.id} className="bg-white/10 rounded-md p-3.5 border border-white/15 text-center">
                <div className="font-display text-2xl font-semibold tabular-nums">{s.value}</div>
                <div className="text-[11px] text-white/80 mt-0.5 truncate">{s.labelEn || 'Label'}</div>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {stats.length === 0 && (
          <div className="text-center py-12 surface-card border-dashed text-sm text-stone-500">
            No counters yet. Click &ldquo;Add counter&rdquo; to create one.
          </div>
        )}
        {stats.map((s, idx) => (
          <div key={s.id} className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-stone-300" />
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 tabular-nums">
                  Counter #{idx + 1}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={s.isActive}
                    onChange={(e) => update(s.id, 'isActive', e.target.checked)}
                    className="w-4 h-4 accent-[#6D1A2D]"
                  />
                  Active
                </label>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-md hover:bg-red-50"
                  aria-label="Delete counter"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Label (English)</label>
                <input
                  value={s.labelEn}
                  onChange={(e) => update(s.id, 'labelEn', e.target.value)}
                  placeholder="Machines Delivered"
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Label (Bengali)</label>
                <input
                  value={s.labelBn}
                  onChange={(e) => update(s.id, 'labelBn', e.target.value)}
                  placeholder="মেশিন সরবরাহ"
                  className="input-field"
                />
              </div>
              <div>
                <label className="field-label">Value (e.g. 500+)</label>
                <input
                  value={s.value}
                  onChange={(e) => update(s.id, 'value', e.target.value)}
                  placeholder="500+"
                  className="input-field tabular-nums"
                />
              </div>
              <div>
                <label className="field-label">Icon</label>
                <select
                  value={s.icon}
                  onChange={(e) => update(s.id, 'icon', e.target.value)}
                  className="input-field cursor-pointer"
                >
                  {ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
