'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';

interface Owner {
  nameEn: string;
  nameBn: string;
  titleEn: string;
  titleBn: string;
  photoUrl?: string;
  bioEn?: string;
  bioBn?: string;
  messageEn?: string;
  messageBn?: string;
}

export default function AboutPage() {
  const { t } = useLocale();
  const [owner, setOwner] = useState<Owner | null>(null);

  useEffect(() => {
    fetch('/api/owner').then((r) => r.json()).then(setOwner);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bg-industrial-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{t('about.title')}</h1>
          <p className="mt-4 text-white/80 text-lg">{t('about.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-industrial-dark mb-4">{t('about.experience')}</h2>
            <p className="text-industrial-charcoal leading-relaxed font-bengali">{t('about.experienceText')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-industrial-dark mb-4">{t('about.support')}</h2>
            <p className="text-industrial-charcoal leading-relaxed font-bengali">{t('about.supportText')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-industrial-dark mb-4">{t('about.mission')}</h2>
            <p className="text-industrial-charcoal leading-relaxed font-bengali">{t('about.missionText')}</p>
          </section>

          {owner && (owner.nameEn || owner.nameBn) && (
            <section className="bg-industrial-light rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-industrial-dark mb-6">Leadership</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {owner.photoUrl && (
                  <div className="relative w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image src={owner.photoUrl} alt={owner.nameEn} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-industrial-dark">
                    {owner.nameEn} {owner.nameBn && `/ ${owner.nameBn}`}
                  </h3>
                  <p className="text-action-orange font-medium mt-1">{owner.titleEn}</p>
                  {owner.bioEn && <p className="mt-4 text-industrial-charcoal">{owner.bioEn}</p>}
                  {owner.messageEn && (
                    <blockquote className="mt-6 pl-4 border-l-4 border-action-orange text-industrial-charcoal italic">
                      {owner.messageEn}
                    </blockquote>
                  )}
                </div>
              </div>
            </section>
          )}

          <div className="bg-action-orange rounded-xl p-8 text-white text-center">
            <p className="text-lg font-bengali mb-4">অটো প্যাক মানে, হাতের ছোঁয়া ছাড়াই স্বয়ংক্রিয় ভাবে প্যাক করা</p>
            <p className="text-white/90">Auto Pac means packing automatically, without the touch of hands.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
