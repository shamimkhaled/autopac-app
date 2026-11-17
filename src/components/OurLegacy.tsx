'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { Zap, Award, Users, Shield, Target, Star, TrendingUp, Package } from 'lucide-react';

interface Stat {
  id: string;
  labelEn: string;
  labelBn: string;
  value: string;
  icon: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  zap: Zap,
  award: Award,
  users: Users,
  shield: Shield,
  target: Target,
  star: Star,
  trending: TrendingUp,
  package: Package,
};

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1200;
          const steps = 40;
          const step = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function OurLegacy() {
  const { locale } = useLocale();
  const isBn = locale === 'bn';
  const [stats, setStats] = useState<Stat[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setStats(d);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  function parseValue(val: string): { num: number; suffix: string } {
    const match = val.match(/^(\d[\d,]*)(.*)$/);
    if (!match) return { num: 0, suffix: val };
    return { num: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] ?? '' };
  }

  return (
    <section className="section-pad bg-stone-950 text-white border-y border-stone-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-2">
              {isBn ? 'আমাদের অর্জন' : 'Track record'}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {isBn ? '১৯৯০ সাল থেকে শিল্প খাতে নির্ভরতার প্রতীক' : 'Industrial reliability since 1990'}
            </h2>
          </div>
          <p className="text-stone-400 max-w-md text-sm leading-relaxed">
            {isBn
              ? 'সারা দেশের ছোট থেকে বৃহৎ কারখানায় অটো প্যাকের মেশিন প্রতিদিন উৎপাদন চালিয়ে যাচ্ছে।'
              : 'Measured delivery across SME startups and enterprise factories throughout Bangladesh.'}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {!loaded
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-stone-900 border border-stone-800 rounded-md p-6">
                  <div className="w-10 h-10 bg-stone-800 rounded-md mb-4" />
                  <div className="h-9 bg-stone-800 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-stone-800 rounded w-2/3" />
                </div>
              ))
            : stats.map((s) => {
                const Icon = ICON_MAP[s.icon] ?? Award;
                const { num, suffix } = parseValue(s.value);
                return (
                  <div
                    key={s.id}
                    className="bg-stone-900 border border-stone-800 hover:border-brand-maroon rounded-md p-5 sm:p-6 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-md bg-brand-maroon/20 border border-brand-maroon/40 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                      <AnimatedCounter target={num} suffix={suffix} />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mt-1.5">
                      {isBn ? s.labelBn : s.labelEn}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
