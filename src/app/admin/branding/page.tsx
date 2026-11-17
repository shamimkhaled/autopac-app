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
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

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
    setStatus(null);
    try {
      const res = await fetch('/api/admin/appearance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      if (res.ok) setStatus({ type: 'ok', text: 'Brand colors saved. Refresh the public site to see the theme.' });
      else setStatus({ type: 'err', text: 'Could not save branding.' });
    } catch {
      setStatus({ type: 'err', text: 'Could not save branding.' });
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

      {status && (
        <div
          role="status"
          className={`px-4 py-2.5 rounded-md border text-sm ${
            status.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {status.text}
        </div>
      )}

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

      <div className="surface-card p-5 space-y-5">
        <div>
          <h2 className="font-display text-lg font-semibold text-stone-900">
            Design & layout tokens
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Customize corner roundness, card borders/elevation, vertical spacing, and sticky navigation across the entire public site and PWA.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Corner radius
            </label>
            <select
              value={theme.borderRadius || 'standard'}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  borderRadius: e.target.value as BrandTheme['borderRadius'],
                })
              }
              className="input-field mt-1"
            >
              <option value="sharp">Sharp industrial (2px)</option>
              <option value="standard">Standard corporate (6px)</option>
              <option value="soft">Soft modern (12px)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Card surface style
            </label>
            <select
              value={theme.cardStyle || 'hairline'}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  cardStyle: e.target.value as BrandTheme['cardStyle'],
                })
              }
              className="input-field mt-1"
            >
              <option value="hairline">Hairline border (clean crisp)</option>
              <option value="elevated">Elevated shadow + border</option>
              <option value="flat">Flat minimal (borderless)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Section spacing density
            </label>
            <select
              value={theme.sectionDensity || 'standard'}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  sectionDensity: e.target.value as BrandTheme['sectionDensity'],
                })
              }
              className="input-field mt-1"
            >
              <option value="compact">Compact (dense showcase)</option>
              <option value="standard">Standard balanced</option>
              <option value="spacious">Spacious editorial</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Top navigation bar
            </label>
            <select
              value={theme.headerSticky === false ? 'static' : 'sticky'}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  headerSticky: e.target.value === 'sticky',
                })
              }
              className="input-field mt-1"
            >
              <option value="sticky">Sticky on scroll (default)</option>
              <option value="static">Static top bar</option>
            </select>
          </div>
        </div>
      </div>

      <div className="surface-card p-5">
        <h2 className="font-display text-lg font-semibold text-stone-900 mb-4">Live preview</h2>
        {(() => {
          const radiusPx =
            theme.borderRadius === 'sharp' ? '2px' : theme.borderRadius === 'soft' ? '12px' : '6px';
          const boxShadow =
            theme.cardStyle === 'elevated'
              ? '0 10px 30px -18px rgba(28, 25, 23, 0.25)'
              : 'none';
          const borderColor = theme.cardStyle === 'flat' ? 'transparent' : '#e7e5e4';
          return (
            <div
              className="p-6 border"
              style={{
                background: theme.paper,
                color: theme.text,
                borderRadius: radiusPx,
                borderColor,
                boxShadow,
              }}
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
                  className="inline-flex items-center min-h-[44px] px-5 text-sm font-semibold"
                  style={{ background: theme.primary, color: theme.buttonText, borderRadius: radiusPx }}
                >
                  Request a quote
                </span>
                <span
                  className="inline-flex items-center min-h-[44px] px-5 text-sm font-semibold border"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                    background: theme.surface,
                    borderRadius: radiusPx,
                  }}
                >
                  Open catalog
                </span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
