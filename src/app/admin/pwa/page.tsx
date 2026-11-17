'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Save, Smartphone, RotateCcw, Image as ImageIcon } from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import { DEFAULT_PWA_CONFIG, type PwaConfig } from '@/lib/siteAppearance';

type IconFieldKey = 'icon192Url' | 'icon512Url' | 'maskableIconUrl' | 'appleIconUrl';

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-full text-left p-3.5 rounded-md border flex items-center justify-between gap-4 transition-colors cursor-pointer ${
        checked ? 'bg-emerald-50/60 border-emerald-200' : 'bg-stone-50 border-stone-200'
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-stone-900">{label}</p>
        <p className="text-xs text-stone-500 mt-0.5">{hint}</p>
      </div>
      <span
        className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider shrink-0 ${
          checked ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
        }`}
      >
        {checked ? 'Enabled' : 'Disabled'}
      </span>
    </button>
  );
}

export default function AdminPwaPage() {
  const [pwa, setPwa] = useState<PwaConfig>(DEFAULT_PWA_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerField, setPickerField] = useState<IconFieldKey | null>(null);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/appearance')
      .then((r) => r.json())
      .then((d) => {
        if (d?.pwa) setPwa({ ...DEFAULT_PWA_CONFIG, ...d.pwa });
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
        body: JSON.stringify({ pwa }),
      });
      if (res.ok) {
        setStatus({
          type: 'ok',
          text: 'PWA configuration saved. Updated manifest, app icons, and mobile controls are live.',
        });
      } else {
        setStatus({ type: 'err', text: 'Could not save PWA configuration.' });
      }
    } catch {
      setStatus({ type: 'err', text: 'Could not save PWA configuration.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading PWA settings…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <Smartphone className="w-7 h-7 text-brand-maroon" />
            PWA & Mobile App Config
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Customize the installable app name, icons, splash screen colors, launcher shortcuts, and mobile navigation bars dynamically.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPwa(DEFAULT_PWA_CONFIG)}
            className="btn-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save PWA config'}
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

      {/* App Identity & Manifest */}
      <section className="surface-card p-5 sm:p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-stone-900">App Identity & Launch</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Full App Name
            </label>
            <input
              value={pwa.appName}
              onChange={(e) => setPwa({ ...pwa, appName: e.target.value })}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Short Name (Home Screen)
            </label>
            <input
              value={pwa.shortName}
              onChange={(e) => setPwa({ ...pwa, shortName: e.target.value })}
              maxLength={16}
              className="input-field mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              App Description
            </label>
            <textarea
              rows={2}
              value={pwa.description}
              onChange={(e) => setPwa({ ...pwa, description: e.target.value })}
              className="input-field mt-1 h-auto py-2.5"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Start URL
            </label>
            <input
              value={pwa.startUrl}
              onChange={(e) => setPwa({ ...pwa, startUrl: e.target.value })}
              className="input-field mt-1 font-mono text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Display Mode
              </label>
              <select
                value={pwa.displayMode}
                onChange={(e) =>
                  setPwa({ ...pwa, displayMode: e.target.value as PwaConfig['displayMode'] })
                }
                className="input-field mt-1"
              >
                <option value="standalone">Standalone (Native)</option>
                <option value="minimal-ui">Minimal UI</option>
                <option value="fullscreen">Fullscreen</option>
                <option value="browser">Browser</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Orientation
              </label>
              <select
                value={pwa.orientation}
                onChange={(e) =>
                  setPwa({ ...pwa, orientation: e.target.value as PwaConfig['orientation'] })
                }
                className="input-field mt-1"
              >
                <option value="any">Any</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Theme & Splash Colors + Live App Card */}
      <div className="grid lg:grid-cols-3 gap-6">
        <section className="surface-card p-5 sm:p-6 space-y-4 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-stone-900">
            Status Bar & Splash Colors
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Theme Color (Top Bar)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pwa.themeColor}
                  onChange={(e) => setPwa({ ...pwa, themeColor: e.target.value })}
                  className="h-11 w-14 rounded-md border border-stone-200 cursor-pointer bg-white"
                />
                <input
                  value={pwa.themeColor}
                  onChange={(e) => setPwa({ ...pwa, themeColor: e.target.value })}
                  maxLength={7}
                  className="input-field font-mono text-sm uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Splash Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pwa.backgroundColor}
                  onChange={(e) => setPwa({ ...pwa, backgroundColor: e.target.value })}
                  className="h-11 w-14 rounded-md border border-stone-200 cursor-pointer bg-white"
                />
                <input
                  value={pwa.backgroundColor}
                  onChange={(e) => setPwa({ ...pwa, backgroundColor: e.target.value })}
                  maxLength={7}
                  className="input-field font-mono text-sm uppercase"
                />
              </div>
            </div>
          </div>

          <h3 className="font-display text-base font-semibold text-stone-900 pt-2">App Icons</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {(
              [
                { key: 'icon192Url', label: 'Icon 192×192 PNG' },
                { key: 'icon512Url', label: 'Icon 512×512 PNG' },
                { key: 'maskableIconUrl', label: 'Maskable Icon 512×512' },
                { key: 'appleIconUrl', label: 'Apple Touch Icon (iOS)' },
              ] as { key: IconFieldKey; label: string }[]
            ).map((item) => (
              <div key={item.key} className="p-3 rounded-md border border-stone-200 bg-stone-50 space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
                  {item.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    value={pwa[item.key]}
                    onChange={(e) => setPwa({ ...pwa, [item.key]: e.target.value })}
                    className="input-field h-9 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setPickerField(item.key)}
                    className="btn-secondary h-9 min-h-[36px] px-2.5 text-xs shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Phone Splash Preview */}
        <section className="surface-card p-5 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Install & Splash Preview
            </p>
            <div
              className="mt-3 rounded-xl border border-stone-200 overflow-hidden shadow-sm"
              style={{ backgroundColor: pwa.backgroundColor }}
            >
              <div
                className="h-5 w-full flex items-center justify-between px-3 text-[10px] font-semibold text-white"
                style={{ backgroundColor: pwa.themeColor }}
              >
                <span>9:41</span>
                <span>{pwa.displayMode}</span>
              </div>
              <div className="py-10 px-4 flex flex-col items-center text-center gap-3">
                <div className="relative w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden">
                  <Image
                    src={pwa.icon192Url || '/icons/icon-192.png'}
                    alt={pwa.shortName}
                    fill
                    className="object-contain p-1.5"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-stone-900">
                    {pwa.appName}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Launcher label: {pwa.shortName}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <a
            href="/manifest.webmanifest"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-xs font-semibold text-brand-maroon hover:underline inline-flex items-center gap-1"
          >
            Inspect live /manifest.webmanifest →
          </a>
        </section>
      </div>

      {/* App Shortcuts */}
      <section className="surface-card p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-stone-900">
            App Launcher Shortcuts (Long-Press Icon)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Three quick links shown when a user long-presses the installed Auto Pac icon on Android or desktop.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2 p-3 rounded-md border border-stone-200 bg-stone-50">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Shortcut 1
            </label>
            <input
              value={pwa.shortcut1Name}
              onChange={(e) => setPwa({ ...pwa, shortcut1Name: e.target.value })}
              placeholder="Label"
              className="input-field h-9 text-xs"
            />
            <input
              value={pwa.shortcut1Url}
              onChange={(e) => setPwa({ ...pwa, shortcut1Url: e.target.value })}
              placeholder="/products?source=pwa"
              className="input-field h-9 text-xs font-mono"
            />
          </div>
          <div className="space-y-2 p-3 rounded-md border border-stone-200 bg-stone-50">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Shortcut 2
            </label>
            <input
              value={pwa.shortcut2Name}
              onChange={(e) => setPwa({ ...pwa, shortcut2Name: e.target.value })}
              placeholder="Label"
              className="input-field h-9 text-xs"
            />
            <input
              value={pwa.shortcut2Url}
              onChange={(e) => setPwa({ ...pwa, shortcut2Url: e.target.value })}
              placeholder="/brochure?source=pwa"
              className="input-field h-9 text-xs font-mono"
            />
          </div>
          <div className="space-y-2 p-3 rounded-md border border-stone-200 bg-stone-50">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Shortcut 3
            </label>
            <input
              value={pwa.shortcut3Name}
              onChange={(e) => setPwa({ ...pwa, shortcut3Name: e.target.value })}
              placeholder="Label"
              className="input-field h-9 text-xs"
            />
            <input
              value={pwa.shortcut3Url}
              onChange={(e) => setPwa({ ...pwa, shortcut3Url: e.target.value })}
              placeholder="/contact?source=pwa"
              className="input-field h-9 text-xs font-mono"
            />
          </div>
        </div>
      </section>

      {/* Mobile & PWA UI Toggles */}
      <section className="surface-card p-5 sm:p-6 space-y-3">
        <h2 className="font-display text-lg font-semibold text-stone-900">
          Mobile App & Floating UI Controls
        </h2>
        <ToggleRow
          label="Show Install Catalog App button"
          hint="Displays the one-tap PWA install button in the footer & mobile drawer when supported."
          checked={pwa.showInstallButton}
          onChange={(v) => setPwa({ ...pwa, showInstallButton: v })}
        />
        <ToggleRow
          label="Show mobile sticky quote bar"
          hint="Bottom fixed Call / Quote bar on Machinery, Catalog, and Gallery mobile screens."
          checked={pwa.showMobileStickyBar}
          onChange={(v) => setPwa({ ...pwa, showMobileStickyBar: v })}
        />
        <ToggleRow
          label="Show floating WhatsApp button"
          hint="Quick WhatsApp engineering desk access in mobile bar and desktop support hub."
          checked={pwa.showWhatsAppButton}
          onChange={(v) => setPwa({ ...pwa, showWhatsAppButton: v })}
        />
        <ToggleRow
          label="Show multi-lingual AI support agent"
          hint="24/7 English, বাংলা & multi-lingual machinery guide integrated with the support hub."
          checked={pwa.showSupportChat !== false}
          onChange={(v) => setPwa({ ...pwa, showSupportChat: v })}
        />
      </section>

      {pickerField && (
        <MediaPicker
          selectedUrl={pwa[pickerField]}
          onSelect={(url) => {
            setPwa({ ...pwa, [pickerField]: url });
            setPickerField(null);
          }}
          onClose={() => setPickerField(null)}
        />
      )}
    </div>
  );
}
