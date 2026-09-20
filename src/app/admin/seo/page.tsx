'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Search, ExternalLink } from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import { DEFAULT_SEO_MARKETING, type SeoMarketing } from '@/lib/siteAppearance';

function Field({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="input-field mt-1 h-auto py-2.5"
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="input-field mt-1" />
      )}
      {hint && <p className="text-xs text-stone-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoMarketing>(DEFAULT_SEO_MARKETING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    fetch('/api/admin/appearance')
      .then((r) => r.json())
      .then((d) => {
        if (d?.seo) setSeo({ ...DEFAULT_SEO_MARKETING, ...d.seo });
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
        body: JSON.stringify({ seo }),
      });
      if (res.ok) alert('SEO & marketing settings saved.');
      else alert('Could not save SEO settings.');
    } catch {
      alert('Could not save SEO settings.');
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

  const section = 'surface-card p-5 space-y-4';

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <Search className="w-7 h-7 text-brand-maroon" />
            SEO & marketing
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Titles, descriptions, Open Graph, Google Analytics, and Facebook Pixel for the public site.
          </p>
        </div>
        <button type="button" onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Search listing</h2>
        <Field
          label="Default title"
          value={seo.siteTitle}
          onChange={(v) => setSeo({ ...seo, siteTitle: v })}
        />
        <Field
          label="Title template"
          value={seo.titleTemplate}
          onChange={(v) => setSeo({ ...seo, titleTemplate: v })}
          hint="Use %s for the page name, e.g. %s | Auto Pac Machinery"
        />
        <Field
          label="Meta description"
          value={seo.description}
          onChange={(v) => setSeo({ ...seo, description: v })}
          multiline
        />
        <Field
          label="Keywords"
          value={seo.keywords}
          onChange={(v) => setSeo({ ...seo, keywords: v })}
          multiline
        />
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={seo.robotsIndex}
            onChange={(e) => setSeo({ ...seo, robotsIndex: e.target.checked })}
            className="rounded border-stone-300 text-brand-maroon focus:ring-brand-maroon"
          />
          Allow search engines to index the site
        </label>
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Social share (Open Graph)</h2>
        <Field label="OG title" value={seo.ogTitle} onChange={(v) => setSeo({ ...seo, ogTitle: v })} />
        <Field
          label="OG description"
          value={seo.ogDescription}
          onChange={(v) => setSeo({ ...seo, ogDescription: v })}
          multiline
        />
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            OG image
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <code className="text-xs text-stone-500 truncate max-w-md">{seo.ogImageUrl}</code>
            <button type="button" onClick={() => setPicker(true)} className="btn-secondary text-xs h-9 min-h-[36px]">
              Choose image
            </button>
          </div>
        </div>
        <Field
          label="Twitter title"
          value={seo.twitterTitle}
          onChange={(v) => setSeo({ ...seo, twitterTitle: v })}
        />
        <Field
          label="Twitter description"
          value={seo.twitterDescription}
          onChange={(v) => setSeo({ ...seo, twitterDescription: v })}
          multiline
        />
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Tracking & verification</h2>
        <Field
          label="Google Analytics 4 ID"
          value={seo.googleAnalyticsId}
          onChange={(v) => setSeo({ ...seo, googleAnalyticsId: v })}
          hint="e.g. G-XXXXXXXXXX — overrides .env when set"
        />
        <Field
          label="Facebook Pixel ID"
          value={seo.facebookPixelId}
          onChange={(v) => setSeo({ ...seo, facebookPixelId: v })}
        />
        <Field
          label="Google Search Console verification"
          value={seo.googleSiteVerification}
          onChange={(v) => setSeo({ ...seo, googleSiteVerification: v })}
          hint="Verification meta content value only"
        />
        <a
          href="https://analytics.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-brand-maroon font-medium"
        >
          Open Google Analytics <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Schema.org description</h2>
        <Field
          label="Organization description"
          value={seo.schemaDescription}
          onChange={(v) => setSeo({ ...seo, schemaDescription: v })}
          multiline
        />
      </section>

      {picker && (
        <MediaPicker
          onSelect={(url) => {
            setSeo({ ...seo, ogImageUrl: url });
            setPicker(false);
          }}
          onClose={() => setPicker(false)}
          selectedUrl={seo.ogImageUrl}
        />
      )}
    </div>
  );
}
