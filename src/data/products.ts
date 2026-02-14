export const categories = [
  {
    id: 'food-beverage',
    nameEn: 'Food & Beverage Packaging',
    nameBn: 'খাদ্য ও পানীয় প্যাকেজিং',
    slug: 'food-beverage',
    descriptionEn: 'Complete solutions for food processing and packaging',
    descriptionBn: 'খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিংয়ের সম্পূর্ণ সমাধান',
  },
  {
    id: 'health-pharma',
    nameEn: 'Health & Pharma Packaging',
    nameBn: 'স্বাস্থ্য ও ফার্মা প্যাকেজিং',
    slug: 'health-pharma',
    descriptionEn: 'Pharmaceutical and healthcare product packaging',
    descriptionBn: 'ফার্মাসিউটিক্যাল ও স্বাস্থ্যসেবা পণ্য প্যাকেজিং',
  },
  {
    id: 'cosmetics-toiletries',
    nameEn: 'Cosmetics & Toiletries Packaging',
    nameBn: 'কসমেটিক্স ও টয়লেট্রিজ প্যাকেজিং',
    slug: 'cosmetics-toiletries',
    descriptionEn: 'Cosmetics, Ayurvedic, and Unani product packaging',
    descriptionBn: 'কসমেটিক্স, আয়ুর্বেদিক ও ইউনানী পণ্য প্যাকেজিং',
  },
  {
    id: 'industrial',
    nameEn: 'Industrial / Auto Parts Packaging',
    nameBn: 'ইন্ডাস্ট্রিয়াল / অটো পার্টস প্যাকেজিং',
    slug: 'industrial',
    descriptionEn: 'Industrial components and auto parts packaging',
    descriptionBn: 'ইন্ডাস্ট্রিয়াল কম্পোনেন্ট ও অটো পার্টস প্যাকেজিং',
  },
] as const;

export const packableItems = [
  { id: 'atta', nameEn: 'Atta', nameBn: 'আটা' },
  { id: 'maida', nameEn: 'Maida', nameBn: 'ময়দা' },
  { id: 'suji', nameEn: 'Suji', nameBn: 'সুজি' },
  { id: 'rice', nameEn: 'Rice', nameBn: 'চাউল' },
  { id: 'dal', nameEn: 'Dal', nameBn: 'ডাল' },
  { id: 'muri', nameEn: 'Muri', nameBn: 'মুড়ি' },
  { id: 'sugar', nameEn: 'Sugar', nameBn: 'চিনি' },
  { id: 'salt', nameEn: 'Salt', nameBn: 'লবণ' },
  { id: 'biscuit', nameEn: 'Biscuit', nameBn: 'বিস্কুট' },
  { id: 'chips', nameEn: 'Potato Chips', nameBn: 'চিপস' },
  { id: 'chanachur', nameEn: 'Chanachur', nameBn: 'চানাচুর' },
  { id: 'tea', nameEn: 'Tea', nameBn: 'চা' },
  { id: 'coffee', nameEn: 'Coffee', nameBn: 'কফি' },
  { id: 'spices', nameEn: 'Spices', nameBn: 'মসলা' },
  { id: 'milk-powder', nameEn: 'Milk Powder', nameBn: 'গুঁড়া দুধ' },
  { id: 'noodles', nameEn: 'Noodles', nameBn: 'নুডলস' },
  { id: 'snacks', nameEn: 'Snacks', nameBn: 'স্ন্যাকস' },
  { id: 'ghee', nameEn: 'Ghee', nameBn: 'ঘি' },
  { id: 'oil', nameEn: 'Oil', nameBn: 'তেল' },
  { id: 'shampoo', nameEn: 'Shampoo', nameBn: 'শ্যাম্পু' },
  { id: 'detergent', nameEn: 'Washing Powder', nameBn: 'ওয়াশিং পাউডার' },
  { id: 'mineral-water', nameEn: 'Mineral Water', nameBn: 'মিনারেল ওয়াটার' },
  { id: 'juice', nameEn: 'Juice', nameBn: 'জুস' },
  { id: 'cosmetics', nameEn: 'Cosmetics', nameBn: 'কসমেটিক্স' },
  { id: 'pharma', nameEn: 'Pharmaceuticals', nameBn: 'ফার্মাসিউটিক্যালস' },
  { id: 'auto-parts', nameEn: 'Auto Parts', nameBn: 'অটো পার্টস' },
];

export interface ProductSpec {
  keyEn: string;
  keyBn: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: string;
  nameEn: string;
  nameBn: string;
  shortDescEn: string;
  shortDescBn: string;
  fullDescEn: string;
  fullDescBn: string;
  images: string[];
  specs: ProductSpec[];
  packableIds: string[];
  videoUrl?: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'granules-packing-machine',
    categoryId: 'food-beverage',
    nameEn: 'Granules Packing Machine',
    nameBn: 'গ্রানুলার প্যাকিং মেশিন',
    shortDescEn: 'Vertical form-fill-seal for granular products',
    shortDescBn: 'গ্রানুলার পণ্যের জন্য ভার্টিকাল ফর্ম-ফিল-সিল',
    fullDescEn: 'Fully automatic vertical form-fill-seal machine for packing dal, rice, spices, tea, and all granular/powder products.',
    fullDescBn: 'ডাল, চাল, মসলা, চা ও সকল গ্রানুলার/পাউডার পণ্য প্যাক করার জন্য সম্পূর্ণ স্বয়ংক্রিয় ভার্টিকাল ফর্ম-ফিল-সিল মেশিন।',
    images: ['/images/slider1.png'],
    specs: [
      { keyEn: 'Voltage', keyBn: 'ভোল্টেজ', value: '220V / 380V', unit: 'AC' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '30-60', unit: 'bags/min' },
      { keyEn: 'Packing Range', keyBn: 'প্যাকিং রেঞ্জ', value: '5-500', unit: 'gm' },
      { keyEn: 'Weight', keyBn: 'ওজন', value: '350', unit: 'kg' },
    ],
    packableIds: ['atta', 'dal', 'rice', 'sugar', 'salt', 'tea', 'spices', 'chanachur', 'chips'],
    featured: true,
  },
  {
    id: '2',
    slug: 'horizontal-flow-wrapping-machine',
    categoryId: 'food-beverage',
    nameEn: 'Horizontal Flow Wrapping Machine',
    nameBn: 'হরাইজন্টাল ফ্লো র্যাপিং মেশিন',
    shortDescEn: 'Flow wrap for biscuits, snacks, and individual items',
    shortDescBn: 'বিস্কুট, স্ন্যাকস ও পৃথক আইটেমের জন্য ফ্লো র্যাপ',
    fullDescEn: 'Automatic horizontal flow wrapping for biscuits, cakes, snacks, soap, and various consumer products.',
    fullDescBn: 'বিস্কুট, কেক, স্ন্যাকস, সাবান ও বিভিন্ন ভোক্তা পণ্যের জন্য স্বয়ংক্রিয় হরাইজন্টাল ফ্লো র্যাপিং।',
    images: ['/images/slider1.png'],
    specs: [
      { keyEn: 'Voltage', keyBn: 'ভোল্টেজ', value: '220V / 380V', unit: 'AC' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '40-80', unit: 'pcs/min' },
      { keyEn: 'Product Length', keyBn: 'পণ্য দৈর্ঘ্য', value: '50-300', unit: 'mm' },
    ],
    packableIds: ['biscuit', 'chips', 'chanachur', 'snacks', 'cosmetics'],
    featured: true,
  },
  {
    id: '3',
    slug: 'vffs-cosmetics-packing',
    categoryId: 'cosmetics-toiletries',
    nameEn: 'VFFS Cosmetics Packing Machine',
    nameBn: 'ভিএফএফএস কসমেটিক্স প্যাকিং মেশিন',
    shortDescEn: 'Vertical form-fill-seal for sachets',
    shortDescBn: 'স্যাশেটের জন্য ভার্টিকাল ফর্ম-ফিল-সিল',
    fullDescEn: 'Automatic VFFS machine for packaging shampoo, detergent, cosmetic powder in sachets and pouches.',
    fullDescBn: 'শ্যাম্পু, ডিটারজেন্ট, কসমেটিক পাউডার স্যাশেট ও পাউচে প্যাক করার জন্য স্বয়ংক্রিয় ভিএফএফএস মেশিন।',
    images: ['/images/slider2.png'],
    specs: [
      { keyEn: 'Voltage', keyBn: 'ভোল্টেজ', value: '220V / 380V', unit: 'AC' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '25-50', unit: 'sachets/min' },
      { keyEn: 'Packing Range', keyBn: 'প্যাকিং রেঞ্জ', value: '5-100', unit: 'gm/ml' },
    ],
    packableIds: ['shampoo', 'detergent', 'cosmetics', 'spices'],
    featured: true,
  },
  {
    id: '4',
    slug: 'water-treatment-ro-plant',
    categoryId: 'food-beverage',
    nameEn: 'Water Treatment Plant (RO & UV)',
    nameBn: 'ওয়াটার ট্রিটমেন্ট প্ল্যান্ট (আরও ও ইউভি)',
    shortDescEn: 'Complete water purification solution',
    shortDescBn: 'সম্পূর্ণ পানি শোধন সমাধান',
    fullDescEn: 'Automatic RO and UV water treatment plant for mineral water, drinking water production.',
    fullDescBn: 'মিনারেল ওয়াটার ও পানীয় জলের উৎপাদনের জন্য স্বয়ংক্রিয় আরও ও ইউভি ওয়াটার ট্রিটমেন্ট প্ল্যান্ট।',
    images: ['/images/slider3.png'],
    specs: [
      { keyEn: 'Capacity', keyBn: 'ক্ষমতা', value: '500-5000', unit: 'LPH' },
      { keyEn: 'Technology', keyBn: 'প্রযুক্তি', value: 'RO + UV' },
      { keyEn: 'Material', keyBn: 'উপাদান', value: 'Stainless Steel' },
    ],
    packableIds: ['mineral-water'],
    featured: true,
  },
  {
    id: '5',
    slug: 'bottle-filling-capping-machine',
    categoryId: 'food-beverage',
    nameEn: 'Bottle Filling & Capping Machine',
    nameBn: 'বোতল ফিলিং ও ক্যাপিং মেশিন',
    shortDescEn: 'Automatic liquid filling and capping',
    shortDescBn: 'স্বয়ংক্রিয় তরল ফিলিং ও ক্যাপিং',
    fullDescEn: '4-head to 6-head automatic bottle filling and capping for water, juice, oil, shampoo, and all liquid products.',
    fullDescBn: 'পানি, জুস, তেল, শ্যাম্পু ও সকল তরল পণ্যের জন্য ৪ থেকে ৬ হেড স্বয়ংক্রিয় বোতল ফিলিং ও ক্যাপিং।',
    images: ['/images/slider3.png'],
    specs: [
      { keyEn: 'Heads', keyBn: 'হেড', value: '4-6' },
      { keyEn: 'Capacity Range', keyBn: 'ক্ষমতা রেঞ্জ', value: '50-2000', unit: 'ml' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '20-40', unit: 'bottles/min' },
    ],
    packableIds: ['mineral-water', 'juice', 'oil', 'shampoo', 'ghee'],
    featured: true,
  },
  {
    id: '6',
    slug: 'muri-puffed-rice-machine',
    categoryId: 'food-beverage',
    nameEn: 'Automatic Muri (Puffed Rice) Machine',
    nameBn: 'অটোমেটিক মুড়ি ভাজার মেশিন',
    shortDescEn: 'Roaster, dryer, and packing line',
    shortDescBn: 'রোস্টার, ড্রায়ার ও প্যাকিং লাইন',
    fullDescEn: 'Complete automatic muri/puffed rice production: roaster, dryer, weight filling, and auto sealing.',
    fullDescBn: 'সম্পূর্ণ স্বয়ংক্রিয় মুড়ি/চিড়া উৎপাদন: রোস্টার, ড্রায়ার, ওজন ভরাট ও অটো সিলিং।',
    images: ['/images/slider1.png'],
    specs: [
      { keyEn: 'Capacity', keyBn: 'ক্ষমতা', value: '100-500', unit: 'kg/hr' },
      { keyEn: 'Power', keyBn: 'পাওয়ার', value: '15-30', unit: 'kW' },
    ],
    packableIds: ['muri', 'chanachur', 'snacks'],
    featured: true,
  },
  {
    id: '7',
    slug: 'auger-powder-packing',
    categoryId: 'food-beverage',
    nameEn: 'Fully Automatic Auger Type Packing',
    nameBn: 'সম্পূর্ণ স্বয়ংক্রিয় অগার টাইপ প্যাকিং',
    shortDescEn: 'Precision powder and granular filling',
    shortDescBn: 'নির্ভুল পাউডার ও গ্রানুলার ফিলিং',
    fullDescEn: 'Auger-type automatic packing for atta, maida, suji, spices, milk powder, and all powder products.',
    fullDescBn: 'আটা, ময়দা, সুজি, মসলা, গুঁড়া দুধ ও সকল পাউডার পণ্যের জন্য অগার টাইপ স্বয়ংক্রিয় প্যাকিং।',
    images: ['/images/slider1.png'],
    specs: [
      { keyEn: 'Packing Range', keyBn: 'প্যাকিং রেঞ্জ', value: '50-5000', unit: 'gm' },
      { keyEn: 'Accuracy', keyBn: 'সঠিকতা', value: '±1%' },
    ],
    packableIds: ['atta', 'maida', 'suji', 'spices', 'milk-powder', 'detergent'],
  },
  {
    id: '8',
    slug: 'liquid-filling-machine',
    categoryId: 'cosmetics-toiletries',
    nameEn: 'All Liquid Item Filling Machine',
    nameBn: 'সব ধরনের তরল ফিলিং মেশিন',
    shortDescEn: '2-6 head liquid filling',
    shortDescBn: '২ থেকে ৬ হেড তরল ফিলিং',
    fullDescEn: 'Semi-auto to fully automatic liquid filling for jam, jelly, honey, oil, shampoo, paste, and creams.',
    fullDescBn: 'জ্যাম, জেলি, মধু, তেল, শ্যাম্পু, পেস্ট ও ক্রিমের জন্য সেমি-অটো থেকে সম্পূর্ণ স্বয়ংক্রিয় তরল ফিলিং।',
    images: ['/images/slider2.png'],
    specs: [
      { keyEn: 'Heads', keyBn: 'হেড', value: '2-6' },
      { keyEn: 'Range', keyBn: 'রেঞ্জ', value: '50-2000', unit: 'ml' },
    ],
    packableIds: ['oil', 'ghee', 'shampoo', 'cosmetics', 'juice'],
  },
  {
    id: '9',
    slug: 'vacuum-induction-sealing',
    categoryId: 'food-beverage',
    nameEn: 'Vacuum & Induction Sealing Machine',
    nameBn: 'ভ্যাকুয়াম ও ইন্ডাকশন সিলিং মেশিন',
    shortDescEn: 'Pouch and cup/jar sealing',
    shortDescBn: 'পাউচ ও কাপ/জার সিলিং',
    fullDescEn: 'Manual to auto vacuum sealing and induction foil sealing for cups, jars, and pouches.',
    fullDescBn: 'কাপ, জার ও পাউচের জন্য ম্যানুয়াল থেকে অটো ভ্যাকুয়াম সিলিং ও ইন্ডাকশন ফয়েল সিলিং।',
    images: ['/images/slider1.png'],
    specs: [
      { keyEn: 'Type', keyBn: 'টাইপ', value: 'Semi-auto / Auto' },
    ],
    packableIds: ['snacks', 'spices', 'tea', 'coffee', 'pharma'],
  },
  {
    id: '10',
    slug: 'z-screw-conveyor-packing',
    categoryId: 'industrial',
    nameEn: 'Z-Screw Conveyor with Packing',
    nameBn: 'জেড-স্ক্রু কনভেয়র সহ প্যাকিং',
    shortDescEn: 'Volumetric cup filling and conveyor',
    shortDescBn: 'ভলিউমেট্রিক কাপ ফিলিং ও কনভেয়র',
    fullDescEn: 'Bucket elevator and screw conveyor with volumetric cup filling for granular products.',
    fullDescBn: 'গ্রানুলার পণ্যের জন্য বালতি এলিভেটর ও স্ক্রু কনভেয়র সহ ভলিউমেট্রিক কাপ ফিলিং।',
    images: ['/images/slider1.png'],
    specs: [
      { keyEn: 'Conveyor Type', keyBn: 'কনভেয়র টাইপ', value: 'Z-Screw / Bucket' },
    ],
    packableIds: ['atta', 'dal', 'rice', 'spices', 'chanachur'],
  },
];
