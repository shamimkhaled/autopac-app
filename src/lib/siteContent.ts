import { prisma } from '@/lib/prisma';

export const WEBSITE_CONTENT_KEY = 'websiteContent';

export interface WebsiteContent {
  hero: {
    eyebrowEn: string;
    eyebrowBn: string;
    titleEn: string;
    titleBn: string;
    ledeEn: string;
    ledeBn: string;
    ctaFindEn: string;
    ctaFindBn: string;
    ctaQuoteEn: string;
    ctaQuoteBn: string;
  };
  find: {
    labelEn: string;
    labelBn: string;
    hintEn: string;
    hintBn: string;
  };
  lines: {
    kickerEn: string;
    kickerBn: string;
    titleEn: string;
    titleBn: string;
    descriptionEn: string;
    descriptionBn: string;
  };
  featured: {
    kickerEn: string;
    kickerBn: string;
    titleEn: string;
    titleBn: string;
  };
  story: {
    kickerEn: string;
    kickerBn: string;
    titleEn: string;
    titleBn: string;
    bodyEn: string;
    bodyBn: string;
    imageUrl: string;
  };
  catalogBand: {
    kickerEn: string;
    kickerBn: string;
    titleEn: string;
    titleBn: string;
    descriptionEn: string;
    descriptionBn: string;
    ctaEn: string;
    ctaBn: string;
  };
  footer: {
    blurbEn: string;
    blurbBn: string;
  };
}

export const DEFAULT_WEBSITE_CONTENT: WebsiteContent = {
  hero: {
    eyebrowEn: 'Auto Pac · Since 1990 · Kawran Bazar, Dhaka',
    eyebrowBn: 'অটো প্যাক · ১৯৯০ থেকে · কাওরান বাজার, ঢাকা',
    titleEn: 'Processing and packing machines for your factory',
    titleBn: 'আপনার কারখানার জন্য প্রক্রিয়াকরণ ও প্যাকিং মেশিন',
    ledeEn: 'Browse 16 product lines. Flip the owner’s real 122-page catalog. Request a quote for the machine you need.',
    ledeBn: '১৬টি পণ্য লাইন দেখুন। মালিকের আসল ১২২ পৃষ্ঠার ক্যাটালগ উল্টান। যে মেশিন দরকার, তার কোটেশন চান।',
    ctaFindEn: 'Find a machine',
    ctaFindBn: 'মেশিন খুঁজুন',
    ctaQuoteEn: 'Request a quote',
    ctaQuoteBn: 'কোটেশন চান',
  },
  find: {
    labelEn: 'Find a machine',
    labelBn: 'মেশিন খুঁজুন',
    hintEn: 'By name, or what you pack — Rice, Juice, Soap',
    hintBn: 'নাম, অথবা যা প্যাক করেন — যেমন Rice, Juice, Soap',
  },
  lines: {
    kickerEn: 'Product lines',
    kickerBn: 'পণ্য লাইন',
    titleEn: 'Choose a line. See the machines.',
    titleBn: 'একটি লাইন বেছে মেশিন দেখুন',
    descriptionEn:
      'Sixteen catalog lines from the printed brochure. Click a name — photos, what it packs, and a quote in one place.',
    descriptionBn:
      'প্রিন্টেড ক্যাটালগের ১৬টি লাইন। নামে ক্লিক করুন — ছবি, যা প্যাক করে, এবং কোটেশন এক জায়গায়।',
  },
  featured: {
    kickerEn: 'Featured',
    kickerBn: 'নির্বাচিত মেশিন',
    titleEn: 'Machines factories specify first',
    titleBn: 'এখন দেখার মতো মেশিন',
  },
  story: {
    kickerEn: 'Since 1990',
    kickerBn: 'বিশ্বমানের মান',
    titleEn: 'Specified for Bangladeshi factories',
    titleBn: 'আমদানিকারক, প্রস্তুতকারক ও সরবরাহকারী',
    bodyEn:
      'Importer, manufacturer, and supplier of food processing and packaging machinery — with installation and spare parts.',
    bodyBn:
      'খাদ্য, পানীয়, কসমেটিক্স, ফার্মা ও শিল্প লাইনের জন্য স্বয়ংক্রিয় মেশিনারি — ইনস্টলেশন ও যন্ত্রাংশ সহ।',
    imageUrl: '/images/slider1.png',
  },
  catalogBand: {
    kickerEn: 'Purple cow',
    kickerBn: 'অফিসিয়াল ক্যাটালগ',
    titleEn: 'The same 122-page brochure the owner uses for sales',
    titleBn: 'মালিক যে ১২২ পৃষ্ঠার ক্যাটালগ দিয়ে বিক্রি করেন — একই শিট',
    descriptionEn:
      'Not stock photos. Flip every sheet, jump by product line, quote the page you are looking at.',
    descriptionBn:
      'স্টক ছবি নয়। প্রতিটি পৃষ্ঠা উল্টান, পণ্য লাইনে যান, যে পৃষ্ঠা দেখছেন তার কোটেশন চান।',
    ctaEn: 'Open official catalog',
    ctaBn: 'অফিসিয়াল ক্যাটালগ খুলুন',
  },
  footer: {
    blurbEn: 'Importer, manufacturer, and supplier of food processing and packaging machinery since 1990.',
    blurbBn:
      'বিশ্বমানের খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারি সরবরাহকারী প্রতিষ্ঠান। আমরা সেরা মানের মেশিন এবং বিক্রয়োত্তর সেবা প্রদান করি।',
  },
};

function mergeContent(partial: Partial<WebsiteContent> | null | undefined): WebsiteContent {
  const d = DEFAULT_WEBSITE_CONTENT;
  if (!partial || typeof partial !== 'object') return { ...d, hero: { ...d.hero }, find: { ...d.find }, lines: { ...d.lines }, featured: { ...d.featured }, story: { ...d.story }, catalogBand: { ...d.catalogBand }, footer: { ...d.footer } };
  return {
    hero: { ...d.hero, ...(partial.hero || {}) },
    find: { ...d.find, ...(partial.find || {}) },
    lines: { ...d.lines, ...(partial.lines || {}) },
    featured: { ...d.featured, ...(partial.featured || {}) },
    story: { ...d.story, ...(partial.story || {}) },
    catalogBand: { ...d.catalogBand, ...(partial.catalogBand || {}) },
    footer: { ...d.footer, ...(partial.footer || {}) },
  };
}

export async function getWebsiteContent(): Promise<WebsiteContent> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: WEBSITE_CONTENT_KEY } });
    if (!row?.value) return mergeContent(null);
    const parsed = JSON.parse(row.value) as Partial<WebsiteContent>;
    return mergeContent(parsed);
  } catch {
    return mergeContent(null);
  }
}

export async function saveWebsiteContent(content: WebsiteContent) {
  const value = JSON.stringify(mergeContent(content));
  await prisma.siteSetting.upsert({
    where: { key: WEBSITE_CONTENT_KEY },
    update: {
      value,
      description: 'Public website copy — hero, home sections, catalog band, footer (EN/BN)',
    },
    create: {
      key: WEBSITE_CONTENT_KEY,
      value,
      description: 'Public website copy — hero, home sections, catalog band, footer (EN/BN)',
    },
  });
}
