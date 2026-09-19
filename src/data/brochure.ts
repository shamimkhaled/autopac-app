/**
 * Official Auto Pac machinery catalog (owner PDF: brochure-content/Auto Pac web see.pdf).
 * Page numbers are 1-based and match the printed / exported PDF.
 */

export const BROCHURE_PAGE_COUNT = 122;
export const BROCHURE_PDF_PATH = '/api/brochure/pdf';
export const BROCHURE_PDF_FILENAME = 'Auto-Pac-machinery-catalog.pdf';

export function brochurePageSrc(page: number) {
  return `/brochures/pages/page-${String(page).padStart(3, '0')}.jpg`;
}

export function brochureThumbSrc(page: number) {
  return `/brochures/thumbs/page-${String(page).padStart(3, '0')}.jpg`;
}

export interface BrochureLine {
  id: string;
  number: string;
  /** Short label for cards and filters */
  shortEn: string;
  shortBn: string;
  titleEn: string;
  titleBn: string;
  /** First catalog page to open for this product line */
  startPage: number;
  pages: number[];
  packables: string[];
}

/** Numbered product lines from PDF page 1 — owner IA */
export const BROCHURE_LINES: BrochureLine[] = [
  {
    id: 'agro-packing',
    number: '01',
    shortEn: 'Rice & atta packing',
    shortBn: 'চাল ও আটা প্যাকিং',
    titleEn: 'Rice, atta, maida, suji, dal, puffed rice, salt & sugar packing',
    titleBn: 'চাল, আটা, ময়দা, সুজি, ডাল, মুড়ি, লবণ ও চিনি প্যাকিং',
    startPage: 6,
    pages: [6, 23, 26, 29, 35, 36, 81],
    packables: ['Atta', 'Maida', 'Rice', 'Dal', 'Sugar', 'Salt', 'Spices'],
  },
  {
    id: 'water-treatment',
    number: '02',
    shortEn: 'Water treatment',
    shortBn: 'ওয়াটার ট্রিটমেন্ট',
    titleEn: 'Water treatment plant — UV & RO',
    titleBn: 'ওয়াটার ট্রিটমেন্ট প্ল্যান্ট — ইউভি ও আরও',
    startPage: 51,
    pages: [51, 52, 53, 54],
    packables: ['Mineral water'],
  },
  {
    id: 'snacks-chanachur',
    number: '03',
    shortEn: 'Snacks & chanachur',
    shortBn: 'চানাচুর ও স্ন্যাকস',
    titleEn: 'Chanachur, chips, dal, motor bhaja, tang & saline',
    titleBn: 'চানাচুর, চিপস, ডাল, মটর ভাজা, টাং ও স্যালাইন',
    startPage: 19,
    pages: [19, 23, 27, 28, 35, 36, 65],
    packables: ['Chanachur', 'Chips', 'Muri', 'Peanut'],
  },
  {
    id: 'beverage',
    number: '04',
    shortEn: 'Juice & beverage',
    shortBn: 'জুস ও বেভারেজ',
    titleEn: 'Juice, carbonated drinks & beverage plant',
    titleBn: 'জুস, কার্বোনেটেড ড্রিংকস ও বেভারেজ প্ল্যান্ট',
    startPage: 8,
    pages: [8, 30, 54, 55, 56, 57, 73],
    packables: ['Juice', 'Mineral water', 'Energy drinks'],
  },
  {
    id: 'biscuit',
    number: '05',
    shortEn: 'Biscuit line',
    shortBn: 'বিস্কুট লাইন',
    titleEn: 'Soft & hard biscuit processing and packing line',
    titleBn: 'সফট ও হার্ড বিস্কুট প্রক্রিয়াকরণ ও প্যাকিং লাইন',
    startPage: 77,
    pages: [77, 78, 79, 80],
    packables: ['Biscuit', 'Cookies', 'Cake'],
  },
  {
    id: 'candy',
    number: '06',
    shortEn: 'Candy line',
    shortBn: 'ক্যান্ডি লাইন',
    titleEn: 'Candy processing and packing line',
    titleBn: 'ক্যান্ডি প্রক্রিয়াকরণ ও প্যাকিং লাইন',
    startPage: 14,
    pages: [14, 66],
    packables: ['Candy'],
  },
  {
    id: 'chocolate',
    number: '07',
    shortEn: 'Chocolate & mango bar',
    shortBn: 'চকোলেট ও ম্যাঙ্গো বার',
    titleEn: 'Dairy milk, chocolate bar & mango bar plant',
    titleBn: 'ডেইরি মিল্ক, চকোলেট বার ও ম্যাঙ্গো বার প্ল্যান্ট',
    startPage: 67,
    pages: [67, 68, 69, 70, 71, 72],
    packables: ['Chocolate', 'Mango bar'],
  },
  {
    id: 'oil-milk',
    number: '08',
    shortEn: 'Oil & milk',
    shortBn: 'তেল ও দুধ',
    titleEn: 'Mustard oil, soybean oil & milk processing',
    titleBn: 'সরিষার তেল, সয়াবিন তেল ও দুধ প্রক্রিয়াকরণ',
    startPage: 31,
    pages: [31, 32, 34],
    packables: ['Mustard oil', 'Soybean oil', 'Milk', 'Ghee'],
  },
  {
    id: 'pasteurizer',
    number: '09',
    shortEn: 'Pasteurizer',
    shortBn: 'পাস্তুরাইজার',
    titleEn: 'Pasteurizer, sterilizer & cooling machinery',
    titleBn: 'পাস্তুরাইজার, স্টেরিলাইজার ও কুলিং মেশিনারি',
    startPage: 9,
    pages: [9, 31, 32, 76],
    packables: ['Milk', 'Juice'],
  },
  {
    id: 'honey',
    number: '11',
    shortEn: 'Honey',
    shortBn: 'মধু',
    titleEn: 'Honey processing and refinery',
    titleBn: 'মধু প্রক্রিয়াকরণ ও রিফাইনারি',
    startPage: 17,
    pages: [17],
    packables: ['Honey'],
  },
  {
    id: 'noodles',
    number: '12',
    shortEn: 'Noodles plant',
    shortBn: 'নুডলস প্ল্যান্ট',
    titleEn: 'Stick & instant noodles plant',
    titleBn: 'স্টিক ও ইনস্ট্যান্ট নুডলস প্ল্যান্ট',
    startPage: 88,
    pages: [88, 89],
    packables: ['Noodles'],
  },
  {
    id: 'cosmetics',
    number: '13',
    shortEn: 'Cosmetics packing',
    shortBn: 'কসমেটিক্স প্যাকিং',
    titleEn: 'Cosmetic, herbal, Ayurvedic & Unani packing',
    titleBn: 'কসমেটিক, হারবাল, আয়ুর্বেদিক ও ইউনানি প্যাকিং',
    startPage: 7,
    pages: [4, 7, 45, 86],
    packables: ['Shampoo', 'Soap', 'Detergent', 'Cream'],
  },
  {
    id: 'sealing',
    number: '14',
    shortEn: 'Vacuum & sealing',
    shortBn: 'ভ্যাকুয়াম ও সিলিং',
    titleEn: 'Vacuum packing & induction sealing',
    titleBn: 'ভ্যাকুয়াম প্যাকিং ও ইন্ডাকশন সিলিং',
    startPage: 24,
    pages: [24, 25],
    packables: ['Snacks', 'Jars', 'Pouches'],
  },
  {
    id: 'blow-moulding',
    number: '15',
    shortEn: 'Blow moulding',
    shortBn: 'ব্লো মোল্ডিং',
    titleEn: 'Injection bottle & blow moulding',
    titleBn: 'ইনজেকশন বোতল ও ব্লো মোল্ডিং',
    startPage: 83,
    pages: [83, 84, 85],
    packables: ['PET bottles'],
  },
  {
    id: 'feed',
    number: '16',
    shortEn: 'Fish & poultry feed',
    shortBn: 'মাছ ও পোল্ট্রি ফিড',
    titleEn: 'Fish & poultry feed processing',
    titleBn: 'মাছ ও পোল্ট্রি ফিড প্রক্রিয়াকরণ',
    startPage: 34,
    pages: [34],
    packables: ['Fish feed', 'Poultry feed'],
  },
  {
    id: 'mosquito-coil',
    number: '17',
    shortEn: 'Mosquito coil',
    shortBn: 'মশার কয়েল',
    titleEn: 'Mosquito coil & aerosol filling',
    titleBn: 'মশার কয়েল ও অ্যারোসল ফিলিং',
    startPage: 87,
    pages: [13, 87],
    packables: ['Mosquito coil'],
  },
];

export interface BrochureSection {
  id: string;
  titleEn: string;
  titleBn: string;
  startPage: number;
  endPage: number;
}

/** Sequential table of contents for the 122-page catalog */
export const BROCHURE_SECTIONS: BrochureSection[] = [
  { id: 'cover', titleEn: 'Cover & product lines', titleBn: 'কভার ও পণ্য তালিকা', startPage: 1, endPage: 3 },
  { id: 'process', titleEn: 'Mills, mixers, sifters & dryers', titleBn: 'মিল, মিক্সার, সিফটার ও ড্রায়ার', startPage: 4, endPage: 5 },
  { id: 'powder', titleEn: 'Powder & granular packing', titleBn: 'পাউডার ও গ্রানুলার প্যাকিং', startPage: 6, endPage: 6 },
  { id: 'cleaners', titleEn: 'Detergent, hand wash & cleaners', titleBn: 'ডিটারজেন্ট, হ্যান্ড ওয়াশ ও ক্লিনার', startPage: 7, endPage: 7 },
  { id: 'filling', titleEn: 'Water, juice & bottle filling', titleBn: 'পানি, জুস ও বোতল ফিলিং', startPage: 8, endPage: 9 },
  { id: 'showroom', titleEn: 'Office, showroom & warehouse', titleBn: 'অফিস, শোরুম ও গুদাম', startPage: 10, endPage: 13 },
  { id: 'candy-honey', titleEn: 'Candy, honey, ice pop & puffed rice', titleBn: 'ক্যান্ডি, মধু, আইস পপ ও মুড়ি', startPage: 14, endPage: 22 },
  { id: 'vffs', titleEn: 'VFFS, sealers & AP-series packers', titleBn: 'ভিএফএফএস, সিলার ও এপি সিরিজ', startPage: 23, endPage: 29 },
  { id: 'liquid-oil', titleEn: 'Liquid, milk, oil & feed plants', titleBn: 'তরল, দুধ, তেল ও ফিড প্ল্যান্ট', startPage: 30, endPage: 39 },
  { id: 'tech-sheets', titleEn: 'Technical specification sheets', titleBn: 'টেকনিক্যাল স্পেসিফিকেশন শিট', startPage: 40, endPage: 50 },
  { id: 'ro-beverage', titleEn: 'RO plant, filling & ice lolly lines', titleBn: 'আরও প্ল্যান্ট, ফিলিং ও আইস ললি', startPage: 51, endPage: 65 },
  { id: 'confectionery', titleEn: 'Candy, chocolate & biscuit lines', titleBn: 'ক্যান্ডি, চকোলেট ও বিস্কুট লাইন', startPage: 66, endPage: 82 },
  { id: 'moulding-coil', titleEn: 'Blow moulding, aerosol & noodles', titleBn: 'ব্লো মোল্ডিং, অ্যারোসল ও নুডলস', startPage: 83, endPage: 90 },
  { id: 'more-plants', titleEn: 'Further plants & packing systems', titleBn: 'অন্যান্য প্ল্যান্ট ও প্যাকিং সিস্টেম', startPage: 91, endPage: 120 },
  { id: 'office-end', titleEn: 'Showroom proof & close', titleBn: 'শোরুম প্রমাণ ও সমাপ্তি', startPage: 121, endPage: 122 },
];

export function pageTitle(page: number, locale: 'en' | 'bn' = 'en'): string {
  const line = BROCHURE_LINES.find((l) => l.pages.includes(page) || l.startPage === page);
  if (line) return locale === 'bn' ? line.titleBn : line.titleEn;
  const section = BROCHURE_SECTIONS.find((s) => page >= s.startPage && page <= s.endPage);
  if (section) return locale === 'bn' ? section.titleBn : section.titleEn;
  return locale === 'bn' ? `ক্যাটালগ পৃষ্ঠা ${page}` : `Catalog page ${page}`;
}

export function lineForPage(page: number): BrochureLine | undefined {
  return BROCHURE_LINES.find((l) => l.pages.includes(page) || l.startPage === page);
}

export function clampBrochurePage(page: number): number {
  if (!Number.isFinite(page)) return 1;
  return Math.min(BROCHURE_PAGE_COUNT, Math.max(1, Math.round(page)));
}

export type ProductBrochureMeta = { lineId: string; page: number };
export type ProductBrochureMap = Record<string, ProductBrochureMeta>;

/** CMS product slugs that correspond to a brochure product line. */
export const PRODUCT_BROCHURE: ProductBrochureMap = {
  'granules-packing-machine': { lineId: 'agro-packing', page: 6 },
  'horizontal-flow-wrapping-machine': { lineId: 'biscuit', page: 77 },
  'vffs-cosmetics-packing': { lineId: 'cosmetics', page: 7 },
  'water-treatment-ro-plant': { lineId: 'water-treatment', page: 51 },
  'bottle-filling-capping-machine': { lineId: 'beverage', page: 8 },
  'muri-puffed-rice-machine': { lineId: 'snacks-chanachur', page: 19 },
  'auger-powder-packing': { lineId: 'agro-packing', page: 6 },
  'liquid-filling-machine': { lineId: 'oil-milk', page: 31 },
  'vacuum-induction-sealing': { lineId: 'sealing', page: 24 },
  'z-screw-conveyor-packing': { lineId: 'agro-packing', page: 35 },
};

export function mergeBrochureMap(overlay?: ProductBrochureMap | null): ProductBrochureMap {
  return { ...PRODUCT_BROCHURE, ...(overlay || {}) };
}

export function productSlugsForLine(lineId: string, overlay?: ProductBrochureMap | null): string[] {
  return Object.entries(mergeBrochureMap(overlay))
    .filter(([, meta]) => meta.lineId === lineId)
    .map(([slug]) => slug);
}

export function brochureHrefForProduct(slug: string, overlay?: ProductBrochureMap | null): string | null {
  const meta = mergeBrochureMap(overlay)[slug];
  if (!meta) return null;
  return `/brochure?line=${meta.lineId}&page=${meta.page}`;
}

export function lineHref(lineId: string, overlay?: ProductBrochureMap | null): string {
  const slugs = productSlugsForLine(lineId, overlay);
  return slugs.length > 0 ? `/products?line=${lineId}` : `/brochure?line=${lineId}`;
}
