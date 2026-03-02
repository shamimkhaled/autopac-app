'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Loader2, BarChart3, GripVertical } from 'lucide-react';

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

const inputCls = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-action-orange/20 focus:border-action-orange outline-none transition-all';

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setStats(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof Stat, value: string | number | boolean) => {
    setStats((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
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
    if (!confirm('Delete this counter?')) return;
    await fetch('/api/admin/stats', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setStats((prev) => prev.filter((s) => s.id !== id));
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // Refresh to get server-assigned IDs for new items
      const res = await fetch('/api/admin/stats');
      const updated = await res.json();
      if (Array.isArray(updated)) setStats(updated);
    } catch (e) {
      console.error(e);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-action-orange animate-spin" />
        <p className="text-gray-500 font-medium">Loading counters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-industrial-dark uppercase tracking-tight flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-action-orange" /> Legacy Counters
          </h1>
          <p className="text-gray-500 text-sm mt-1">Edit the animated statistics shown in the "Our Legacy" section on the homepage.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={add}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-500 hover:border-action-orange hover:text-action-orange rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
          >
            <Plus className="w-4 h-4" /> Add Counter
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-action-orange text-white font-black rounded-2xl shadow-lg shadow-action-orange/30 hover:bg-orange-600 transition-all disabled:opacity-70 text-xs uppercase tracking-wider active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Preview Banner */}
      <div className="bg-industrial-dark rounded-3xl p-5 sm:p-8">
        <p className="text-[10px] font-black text-action-orange uppercase tracking-widest mb-4">Preview — Our Legacy Section</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.filter((s) => s.isActive).map((s) => (
            <div key={s.id} className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[9px] text-white/40 font-black uppercase tracking-wider mt-0.5 truncate">{s.labelEn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Counter Cards */}
      <div className="space-y-4">
        {stats.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-sm">No counters yet. Click "Add Counter" to create one.</p>
          </div>
        )}
        {stats.map((s, idx) => (
          <div key={s.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-gray-300" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Counter #{idx + 1}</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.isActive}
                    onChange={(e) => update(s.id, 'isActive', e.target.checked)}
                    className="w-4 h-4 accent-orange-500 rounded"
                  />
                  <span className="text-xs font-bold text-gray-500">Active</span>
                </label>
                <button
                  onClick={() => remove(s.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Label (English)</label>
                <input value={s.labelEn} onChange={(e) => update(s.id, 'labelEn', e.target.value)} placeholder="Machines Delivered" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Label (Bengali)</label>
                <input value={s.labelBn} onChange={(e) => update(s.id, 'labelBn', e.target.value)} placeholder="মেশিন সরবরাহ" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Value (e.g. 500+ or 15+)</label>
                <input value={s.value} onChange={(e) => update(s.id, 'value', e.target.value)} placeholder="500+" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Icon</label>
                <select value={s.icon} onChange={(e) => update(s.id, 'icon', e.target.value)} className={inputCls}>
                  {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
