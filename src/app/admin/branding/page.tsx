'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Palette, RotateCcw } from 'lucide-react';
import {
  DEFAULT_BRAND_THEME,
  type BrandTheme,
} from '@/lib/siteAppearance';

function ColorField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 rounded-md border border-stone-200 cursor-pointer bg-white"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field font-mono text-sm uppercase"
          maxLength={7}
        />
      </div>
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

export default function AdminBrandingPage() {
  const [theme, setTheme] = useState<BrandTheme>(DEFAULT_BRAND_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/appearance')
      .then((r) => r.json())
      .then((d) => {
        if (d?.theme) setTheme({ ...DEFAULT_BRAND_THEME, ...d.theme });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      if (res.ok) alert('Brand colors saved. Refresh the public site to see the theme.');
      else alert('Could not save branding.');
    } catch {
      alert('Could not save branding.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-brand-maroon animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <Palette className="w-7 h-7 text-brand-maroon" />
            Brand & appearance
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Primary button color, page paper, text, and accents used across the public website.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTheme(DEFAULT_BRAND_THEME)}
            className="btn-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      <div className="surface-card p-5 space-y-5">
        <h2 className="font-display text-lg font-semibold text-stone-900">Colors</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ColorField
            label="Primary (buttons, links)"
            value={theme.primary}
            onChange={(v) => setTheme({ ...theme, primary: v })}
            hint="Get Quote, filter chips, kickers"
          />
          <ColorField
            label="Primary hover"
            value={theme.primaryHover}
            onChange={(v) => setTheme({ ...theme, primaryHover: v })}
          />
          <ColorField
            label="Primary mid"
            value={theme.primaryMid}
            onChange={(v) => setTheme({ ...theme, primaryMid: v })}
          />
          <ColorField
            label="Button text"
            value={theme.buttonText}
            onChange={(v) => setTheme({ ...theme, buttonText: v })}
          />
          <ColorField
            label="Page paper / background"
            value={theme.paper}
            onChange={(v) => setTheme({ ...theme, paper: v })}
          />
          <ColorField
            label="Surface (cards)"
            value={theme.surface}
            onChange={(v) => setTheme({ ...theme, surface: v })}
          />
          <ColorField
            label="Body text"
            value={theme.text}
            onChange={(v) => setTheme({ ...theme, text: v })}
          />
          <ColorField
            label="Muted text"
            value={theme.textMuted}
            onChange={(v) => setTheme({ ...theme, textMuted: v })}
          />
          <ColorField
            label="Accent"
            value={theme.accent}
            onChange={(v) => setTheme({ ...theme, accent: v })}
            hint="Rare accent only — keep primary as the brand"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Default appearance mode
          </label>
          <select
            value={theme.defaultMode}
            onChange={(e) =>
              setTheme({
                ...theme,
                defaultMode: e.target.value as BrandTheme['defaultMode'],
              })
            }
            className="input-field mt-1 max-w-xs"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">Follow system</option>
          </select>
          <p className="text-xs text-stone-500 mt-1">
            Visitors can still toggle theme in the header. Logo upload stays in Company Info.
          </p>
        </div>
      </div>

      <div className="surface-card p-5">
        <h2 className="font-display text-lg font-semibold text-stone-900 mb-4">Live preview</h2>
        <div
          className="rounded-md p-6 border border-stone-200"
          style={{ background: theme.paper, color: theme.text }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: theme.primary }}>
            Machinery
          </p>
          <h3 className="font-display text-2xl font-semibold mt-2" style={{ color: theme.text }}>
            Processing machines for your factory
          </h3>
          <p className="mt-2 text-sm" style={{ color: theme.textMuted }}>
            Search by name or what you pack — Rice, Juice, Soap.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span
              className="inline-flex items-center min-h-[44px] px-5 text-sm font-semibold rounded-md"
              style={{ background: theme.primary, color: theme.buttonText }}
            >
              Request a quote
            </span>
            <span
              className="inline-flex items-center min-h-[44px] px-5 text-sm font-semibold rounded-md border"
              style={{ borderColor: theme.primary, color: theme.primary, background: theme.surface }}
            >
              Open catalog
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
