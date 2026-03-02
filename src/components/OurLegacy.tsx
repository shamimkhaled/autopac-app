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
  zap: Zap, award: Award, users: Users, shield: Shield,
  target: Target, star: Star, trending: TrendingUp, package: Package,
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
          const duration = 1800;
          const steps = 60;
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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function OurLegacy() {
  const { locale } = useLocale();
  const [stats, setStats] = useState<Stat[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setStats(d); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  function parseValue(val: string): { num: number; suffix: string } {
    const match = val.match(/^(\d[\d,]*)(.*)$/);
    if (!match) return { num: 0, suffix: val };
    return { num: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] ?? '' };
  }

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-industrial-dark relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-action-orange/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-action-orange/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 sm:w-12 h-0.5 bg-action-orange rounded-full" aria-hidden="true" />
            <span className="text-action-orange font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
              {locale === 'bn' ? 'আমাদের অর্জন' : 'Our Achievement'}
            </span>
            <div className="w-8 sm:w-12 h-0.5 bg-action-orange rounded-full" aria-hidden="true" />
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight">
            {locale === 'bn' ? 'আমাদের' : 'Our'}{' '}
            <span className="text-action-orange">{locale === 'bn' ? 'উত্তরাধিকার' : 'Legacy'}</span>
          </h2>
          <p className="text-white/50 mt-4 font-medium max-w-xl mx-auto text-sm sm:text-base">
            {locale === 'bn'
              ? 'বছরের পর বছর ধরে শিল্প খাতে বিশ্বস্ততার সাথে সেবা প্রদান করে আসছি।'
              : 'Decades of industrial excellence, trusted by businesses across Bangladesh and beyond.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {!loaded
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-3xl p-6 sm:p-8 animate-pulse">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl mb-4" />
                  <div className="h-10 bg-white/10 rounded-xl mb-2" />
                  <div className="h-4 bg-white/5 rounded-full" />
                </div>
              ))
            : stats.map((s) => {
                const Icon = ICON_MAP[s.icon] ?? Award;
                const { num, suffix } = parseValue(s.value);
                return (
                  <div
                    key={s.id}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-action-orange/30 rounded-3xl p-6 sm:p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-action-orange/10"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-action-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5 group-hover:bg-action-orange/20 transition-colors">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-action-orange" aria-hidden="true" />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none mb-2 tabular-nums">
                      <AnimatedCounter target={num} suffix={suffix} />
                    </div>
                    <p className="text-white/50 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] leading-tight mt-1">
                      {locale === 'bn' ? s.labelBn : s.labelEn}
                    </p>
                  </div>
                );
              })}
        </div>

        {/* Bottom quote */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-white/30 font-bold italic text-sm sm:text-base max-w-2xl mx-auto border-t border-white/10 pt-8 sm:pt-10">
            {locale === 'bn'
              ? '"আমাদের প্রতিটি সংখ্যার পেছনে রয়েছে একটি সন্তুষ্ট কারখানা মালিকের গল্প।"'
              : '"Behind every number is a factory owner who trusted us to automate their success."'}
          </p>
        </div>
      </div>
    </section>
  );
}
