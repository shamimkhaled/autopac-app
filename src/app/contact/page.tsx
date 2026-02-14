'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useCompany } from '@/hooks/useSiteData';

function ContactContent() {
  const searchParams = useSearchParams();
  const productInterest = searchParams.get('product') || '';
  const { t } = useLocale();
  const [company] = useCompany();

  const whatsapp = company?.whatsapp || '8801818496642';
  const mapUrl = company?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.256089619469!2d90.3922!3d23.7463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8f0a46e0a6f%3A0x9f0b9e8e8e8e8e8e!2sKawran%20Bazar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1640000000000!5m2!1sen!2sbd';

  return (
    <div className="min-h-screen">
      <div className="bg-industrial-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{t('contact.title')}</h1>
          <p className="mt-4 text-white/80">{t('contact.getInTouch')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-bold text-industrial-dark mb-6">{t('contact.address')}</h2>
              <p className="text-industrial-charcoal mb-2">{company?.address || '128/3 Kawran Bazar, Dhaka 1215, Bangladesh'}</p>
              <p className="text-industrial-silver text-sm">{t('contact.addressNote')}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-bold text-industrial-dark mb-6">{t('contact.phone')}</h2>
              <a href={`tel:+88${(company?.phone || '').replace(/\D/g, '').slice(0, 11)}`} className="block text-action-orange hover:underline">{company?.phone || '01631769707, 01818496642'}</a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-bold text-industrial-dark mb-6">{t('contact.email')}</h2>
              <a href={`mailto:${company?.email || 'autopacbd@gmail.com'}`} className="text-action-orange hover:underline">{company?.email || 'autopacbd@gmail.com'}</a>
            </div>

            {company?.officeHours && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-xl font-bold text-industrial-dark mb-6">Office Hours</h2>
                <p className="text-industrial-charcoal">{company.officeHours}</p>
              </div>
            )}

            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              {t('contact.whatsapp')}
            </a>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-industrial-dark mb-6">Lead Form</h2>
              <form action="https://formspree.io/f/your-form-id" method="POST" className="space-y-4">
                <input type="hidden" name="product" value={productInterest} />
                <div>
                  <label className="block text-industrial-charcoal font-medium mb-1">{t('contact.formName')}</label>
                  <input type="text" name="name" required className="w-full px-4 py-3 border border-industrial-silver/30 rounded-lg focus:ring-2 focus:ring-action-orange focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-industrial-charcoal font-medium mb-1">{t('contact.formPhone')}</label>
                  <input type="tel" name="phone" required className="w-full px-4 py-3 border border-industrial-silver/30 rounded-lg focus:ring-2 focus:ring-action-orange focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-industrial-charcoal font-medium mb-1">{t('contact.formEmail')}</label>
                  <input type="email" name="email" className="w-full px-4 py-3 border border-industrial-silver/30 rounded-lg focus:ring-2 focus:ring-action-orange focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-industrial-charcoal font-medium mb-1">{t('contact.formProduct')}</label>
                  <input type="text" name="product_interest" defaultValue={productInterest} placeholder="e.g. Granules Packing Machine" className="w-full px-4 py-3 border border-industrial-silver/30 rounded-lg focus:ring-2 focus:ring-action-orange focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-industrial-charcoal font-medium mb-1">{t('contact.formMessage')}</label>
                  <textarea name="message" rows={4} className="w-full px-4 py-3 border border-industrial-silver/30 rounded-lg focus:ring-2 focus:ring-action-orange focus:border-transparent" />
                </div>
                <button type="submit" className="w-full py-4 bg-action-orange hover:bg-action-orange-dark text-white font-bold rounded-lg transition">
                  {t('contact.submit')}
                </button>
              </form>
            </div>

            <div className="mt-8 rounded-xl overflow-hidden shadow-lg h-64 bg-industrial-light">
              <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={t('contact.map')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactContent />
    </Suspense>
  );
}
