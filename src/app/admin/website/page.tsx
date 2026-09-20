'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, LayoutTemplate } from 'lucide-react';
import MediaPicker from '@/components/Admin/MediaPicker';
import { DEFAULT_WEBSITE_CONTENT, type WebsiteContent } from '@/lib/siteContent';

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
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
    </div>
  );
}

function Pair({
  labelEn,
  labelBn,
  en,
  bn,
  onEn,
  onBn,
  multiline,
}: {
  labelEn: string;
  labelBn: string;
  en: string;
  bn: string;
  onEn: (v: string) => void;
  onBn: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Field label={labelEn} value={en} onChange={onEn} multiline={multiline} />
      <Field label={labelBn} value={bn} onChange={onBn} multiline={multiline} />
    </div>
  );
}

export default function AdminWebsitePage() {
  const [content, setContent] = useState<WebsiteContent>(DEFAULT_WEBSITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    fetch('/api/admin/site-content')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setContent({ ...DEFAULT_WEBSITE_CONTENT, ...d, hero: { ...DEFAULT_WEBSITE_CONTENT.hero, ...d.hero }, find: { ...DEFAULT_WEBSITE_CONTENT.find, ...d.find }, lines: { ...DEFAULT_WEBSITE_CONTENT.lines, ...d.lines }, featured: { ...DEFAULT_WEBSITE_CONTENT.featured, ...d.featured }, story: { ...DEFAULT_WEBSITE_CONTENT.story, ...d.story }, catalogBand: { ...DEFAULT_WEBSITE_CONTENT.catalogBand, ...d.catalogBand }, footer: { ...DEFAULT_WEBSITE_CONTENT.footer, ...d.footer } });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (res.ok) alert('Website content saved. Refresh the public site to see changes.');
      else alert('Could not save website content.');
    } catch {
      alert('Could not save website content.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-brand-maroon animate-spin" />
        <p className="text-sm text-stone-500">Loading website content…</p>
      </div>
    );
  }

  const section = 'surface-card p-5 sm:p-6 space-y-4';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <LayoutTemplate className="w-7 h-7 text-brand-maroon" />
            Website content
          </h1>
          <p className="text-sm text-stone-500 mt-1 max-w-2xl">
            Edit public copy from hero to footer (EN + BN). Machines, catalog pages, partners, and quotes stay in their own admin screens.
          </p>
        </div>
        <button type="button" onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save website'}
        </button>
      </div>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Hero</h2>
        <Pair
          labelEn="Eyebrow EN"
          labelBn="Eyebrow BN"
          en={content.hero.eyebrowEn}
          bn={content.hero.eyebrowBn}
          onEn={(v) => setContent({ ...content, hero: { ...content.hero, eyebrowEn: v } })}
          onBn={(v) => setContent({ ...content, hero: { ...content.hero, eyebrowBn: v } })}
        />
        <Pair
          labelEn="Headline EN"
          labelBn="Headline BN"
          en={content.hero.titleEn}
          bn={content.hero.titleBn}
          onEn={(v) => setContent({ ...content, hero: { ...content.hero, titleEn: v } })}
          onBn={(v) => setContent({ ...content, hero: { ...content.hero, titleBn: v } })}
          multiline
        />
        <Pair
          labelEn="Supporting line EN"
          labelBn="Supporting line BN"
          en={content.hero.ledeEn}
          bn={content.hero.ledeBn}
          onEn={(v) => setContent({ ...content, hero: { ...content.hero, ledeEn: v } })}
          onBn={(v) => setContent({ ...content, hero: { ...content.hero, ledeBn: v } })}
          multiline
        />
        <Pair
          labelEn="Find CTA EN"
          labelBn="Find CTA BN"
          en={content.hero.ctaFindEn}
          bn={content.hero.ctaFindBn}
          onEn={(v) => setContent({ ...content, hero: { ...content.hero, ctaFindEn: v } })}
          onBn={(v) => setContent({ ...content, hero: { ...content.hero, ctaFindBn: v } })}
        />
        <Pair
          labelEn="Quote CTA EN"
          labelBn="Quote CTA BN"
          en={content.hero.ctaQuoteEn}
          bn={content.hero.ctaQuoteBn}
          onEn={(v) => setContent({ ...content, hero: { ...content.hero, ctaQuoteEn: v } })}
          onBn={(v) => setContent({ ...content, hero: { ...content.hero, ctaQuoteBn: v } })}
        />
        <p className="text-xs text-stone-500">
          Hero images: <a href="/admin/hero" className="text-brand-maroon font-medium">Hero Slider</a>. Counters:{' '}
          <a href="/admin/stats" className="text-brand-maroon font-medium">Legacy Stats</a>.
        </p>
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Find a machine strip</h2>
        <Pair
          labelEn="Label EN"
          labelBn="Label BN"
          en={content.find.labelEn}
          bn={content.find.labelBn}
          onEn={(v) => setContent({ ...content, find: { ...content.find, labelEn: v } })}
          onBn={(v) => setContent({ ...content, find: { ...content.find, labelBn: v } })}
        />
        <Pair
          labelEn="Hint EN"
          labelBn="Hint BN"
          en={content.find.hintEn}
          bn={content.find.hintBn}
          onEn={(v) => setContent({ ...content, find: { ...content.find, hintEn: v } })}
          onBn={(v) => setContent({ ...content, find: { ...content.find, hintBn: v } })}
        />
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Product lines section</h2>
        <Pair
          labelEn="Kicker EN"
          labelBn="Kicker BN"
          en={content.lines.kickerEn}
          bn={content.lines.kickerBn}
          onEn={(v) => setContent({ ...content, lines: { ...content.lines, kickerEn: v } })}
          onBn={(v) => setContent({ ...content, lines: { ...content.lines, kickerBn: v } })}
        />
        <Pair
          labelEn="Title EN"
          labelBn="Title BN"
          en={content.lines.titleEn}
          bn={content.lines.titleBn}
          onEn={(v) => setContent({ ...content, lines: { ...content.lines, titleEn: v } })}
          onBn={(v) => setContent({ ...content, lines: { ...content.lines, titleBn: v } })}
        />
        <Pair
          labelEn="Description EN"
          labelBn="Description BN"
          en={content.lines.descriptionEn}
          bn={content.lines.descriptionBn}
          onEn={(v) => setContent({ ...content, lines: { ...content.lines, descriptionEn: v } })}
          onBn={(v) => setContent({ ...content, lines: { ...content.lines, descriptionBn: v } })}
          multiline
        />
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Official catalog band (purple cow)</h2>
        <Pair
          labelEn="Kicker EN"
          labelBn="Kicker BN"
          en={content.catalogBand.kickerEn}
          bn={content.catalogBand.kickerBn}
          onEn={(v) => setContent({ ...content, catalogBand: { ...content.catalogBand, kickerEn: v } })}
          onBn={(v) => setContent({ ...content, catalogBand: { ...content.catalogBand, kickerBn: v } })}
        />
        <Pair
          labelEn="Title EN"
          labelBn="Title BN"
          en={content.catalogBand.titleEn}
          bn={content.catalogBand.titleBn}
          onEn={(v) => setContent({ ...content, catalogBand: { ...content.catalogBand, titleEn: v } })}
          onBn={(v) => setContent({ ...content, catalogBand: { ...content.catalogBand, titleBn: v } })}
          multiline
        />
        <Pair
          labelEn="Description EN"
          labelBn="Description BN"
          en={content.catalogBand.descriptionEn}
          bn={content.catalogBand.descriptionBn}
          onEn={(v) => setContent({ ...content, catalogBand: { ...content.catalogBand, descriptionEn: v } })}
          onBn={(v) => setContent({ ...content, catalogBand: { ...content.catalogBand, descriptionBn: v } })}
          multiline
        />
        <Pair
          labelEn="CTA EN"
          labelBn="CTA BN"
          en={content.catalogBand.ctaEn}
          bn={content.catalogBand.ctaBn}
          onEn={(v) => setContent({ ...content, catalogBand: { ...content.catalogBand, ctaEn: v } })}
          onBn={(v) => setContent({ ...content, catalogBand: { ...content.catalogBand, ctaBn: v } })}
        />
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Featured machines</h2>
        <Pair
          labelEn="Kicker EN"
          labelBn="Kicker BN"
          en={content.featured.kickerEn}
          bn={content.featured.kickerBn}
          onEn={(v) => setContent({ ...content, featured: { ...content.featured, kickerEn: v } })}
          onBn={(v) => setContent({ ...content, featured: { ...content.featured, kickerBn: v } })}
        />
        <Pair
          labelEn="Title EN"
          labelBn="Title BN"
          en={content.featured.titleEn}
          bn={content.featured.titleBn}
          onEn={(v) => setContent({ ...content, featured: { ...content.featured, titleEn: v } })}
          onBn={(v) => setContent({ ...content, featured: { ...content.featured, titleBn: v } })}
        />
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Story block</h2>
        <Pair
          labelEn="Kicker EN"
          labelBn="Kicker BN"
          en={content.story.kickerEn}
          bn={content.story.kickerBn}
          onEn={(v) => setContent({ ...content, story: { ...content.story, kickerEn: v } })}
          onBn={(v) => setContent({ ...content, story: { ...content.story, kickerBn: v } })}
        />
        <Pair
          labelEn="Title EN"
          labelBn="Title BN"
          en={content.story.titleEn}
          bn={content.story.titleBn}
          onEn={(v) => setContent({ ...content, story: { ...content.story, titleEn: v } })}
          onBn={(v) => setContent({ ...content, story: { ...content.story, titleBn: v } })}
        />
        <Pair
          labelEn="Body EN"
          labelBn="Body BN"
          en={content.story.bodyEn}
          bn={content.story.bodyBn}
          onEn={(v) => setContent({ ...content, story: { ...content.story, bodyEn: v } })}
          onBn={(v) => setContent({ ...content, story: { ...content.story, bodyBn: v } })}
          multiline
        />
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Story image</label>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <code className="text-xs text-stone-500 truncate max-w-md">{content.story.imageUrl}</code>
            <button type="button" onClick={() => setPicker(true)} className="btn-secondary text-xs h-9 min-h-[36px]">
              Choose image
            </button>
          </div>
        </div>
      </section>

      <section className={section}>
        <h2 className="font-display text-lg font-semibold text-stone-900">Footer blurb</h2>
        <Pair
          labelEn="Blurb EN"
          labelBn="Blurb BN"
          en={content.footer.blurbEn}
          bn={content.footer.blurbBn}
          onEn={(v) => setContent({ ...content, footer: { ...content.footer, blurbEn: v } })}
          onBn={(v) => setContent({ ...content, footer: { ...content.footer, blurbBn: v } })}
          multiline
        />
        <p className="text-xs text-stone-500">
          Logo, phones, address, social: <a href="/admin/company" className="text-brand-maroon font-medium">Company Info</a>.
          Nav labels: <a href="/admin/translations" className="text-brand-maroon font-medium">EN / BN copy</a>.
        </p>
      </section>

      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save website
        </button>
      </div>

      {picker && (
        <MediaPicker
          onSelect={(url) => {
            setContent({ ...content, story: { ...content.story, imageUrl: url } });
            setPicker(false);
          }}
          onClose={() => setPicker(false)}
          selectedUrl={content.story.imageUrl}
        />
      )}
    </div>
  );
}
