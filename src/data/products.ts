export const categories = [
  {
    id: 'food-beverage',
    nameEn: 'Food & Beverage Packaging',
    nameBn: 'খাদ্য ও পানীয় প্যাকেজিং',
    slug: 'food-beverage',
    descriptionEn: 'Granule, powder, snacks, bakery, and beverage processing & packaging lines',
    descriptionBn: 'গ্রানুল, পাউডার, স্ন্যাকস, বেকারি ও পানীয় প্রক্রিয়াকরণ এবং প্যাকেজিং লাইন',
  },
  {
    id: 'liquid-processing',
    nameEn: 'Liquid, CIP & 304-SS Processing',
    nameBn: 'তরল, সিআইপি ও ৩০৪-এসএস প্রসেসিং',
    slug: 'liquid-processing',
    descriptionEn: '304-SS jacketed mixer tanks, pasteurizers, CIP washing plants, and bottle lines',
    descriptionBn: '৩০৪-এসএস জ্যাকেট মিক্সার ট্যাংক, পাস্তুরাইজার, সিআইপি ওয়াশিং প্ল্যান্ট ও বোতল লাইন',
  },
  {
    id: 'cosmetics-toiletries',
    nameEn: 'Cosmetics, Cleaner & Unani',
    nameBn: 'কসমেটিক্স, ক্লিনার ও ইউনানী',
    slug: 'cosmetics-toiletries',
    descriptionEn: 'Hand wash, dish wash, Harpic cleaner mixers, shampoo sachets, cream & paste fillers',
    descriptionBn: 'হ্যান্ড ওয়াশ, ডিশ ওয়াশ, হারপিক ক্লিনার মিক্সার, শ্যাম্পু স্যাশেট, ক্রিম ও পেস্ট ফিলার',
  },
  {
    id: 'health-pharma',
    nameEn: 'Sealing, Coding & Pharma',
    nameBn: 'সিলিং, কোডিং ও ফার্মা',
    slug: 'health-pharma',
    descriptionEn: 'Band sealers, shrink tunnels, vacuum & induction sealers, date code printers',
    descriptionBn: 'ব্যান্ড সিলার, শ্রিঙ্ক টানেল, ভ্যাকুয়াম ও ইন্ডাকশন সিলার, ডেট কোড প্রিন্টার',
  },
  {
    id: 'industrial',
    nameEn: 'Industrial, Milling & Feed',
    nameBn: 'ইন্ডাস্ট্রিয়াল, মিলিং ও ফিড',
    slug: 'industrial',
    descriptionEn: 'Z-screw conveyors, ribbon mixers, pulverizers, oil expellers, and auto parts packing',
    descriptionBn: 'জেড-স্ক্রু কনভেয়র, রিবন মিক্সার, পালভারাইজার, অয়েল এক্সপেলার ও অটো পার্টস প্যাকিং',
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
  { id: 'motor-bhaja', nameEn: 'Motor Bhaja', nameBn: 'মটর ভাজা' },
  { id: 'tea', nameEn: 'Tea', nameBn: 'চা' },
  { id: 'coffee', nameEn: 'Coffee', nameBn: 'কফি' },
  { id: 'spices', nameEn: 'Spices / Masala', nameBn: 'মসলা' },
  { id: 'milk-powder', nameEn: 'Milk Powder', nameBn: 'গুঁড়া দুধ' },
  { id: 'tang-saline', nameEn: 'Tang & Saline', nameBn: 'ট্যাংক ও স্যালাইন' },
  { id: 'noodles', nameEn: 'Noodles', nameBn: 'নুডলস' },
  { id: 'snacks', nameEn: 'Snacks', nameBn: 'স্ন্যাকস' },
  { id: 'chocolate', nameEn: 'Chocolate Bar', nameBn: 'চকোলেট বার' },
  { id: 'ghee', nameEn: 'Ghee', nameBn: 'ঘি' },
  { id: 'oil', nameEn: 'Oil', nameBn: 'তেল' },
  { id: 'milk', nameEn: 'Liquid Milk', nameBn: 'তরল দুধ' },
  { id: 'shampoo', nameEn: 'Shampoo', nameBn: 'শ্যাম্পু' },
  { id: 'cream-jelly', nameEn: 'Cream / Jam / Jelly', nameBn: 'ক্রিম / জ্যাম / জেলি' },
  { id: 'detergent', nameEn: 'Washing Powder', nameBn: 'ওয়াশিং পাউডার' },
  { id: 'cleaners', nameEn: 'Hand Wash / Harpic', nameBn: 'হ্যান্ড ওয়াশ / হারপিক' },
  { id: 'mineral-water', nameEn: 'Mineral Water', nameBn: 'মিনারেল ওয়াটার' },
  { id: 'juice', nameEn: 'Juice & Drinks', nameBn: 'জুস ও ড্রিংকস' },
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
  modelCode?: string;
  brochurePage?: number;
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
    slug: 'ap-110m-granules-packing',
    categoryId: 'food-beverage',
    modelCode: 'AP 110-M',
    brochurePage: 23,
    nameEn: 'AP 110-M Automatic Granule & Powder Packing Machine (10-200gm)',
    nameBn: 'AP 110-M অটোমেটিক সেন্টার সিল গ্রানুলার ও পাউডার প্যাকিং মেশিন (১০-২০০ গ্রাম)',
    shortDescEn: 'Automatic center seal machine for chanachur, chips, motor bhaja, badam, jhal muri & spices (10-200gm).',
    shortDescBn: 'চানাচুর, চিপস, মটর ভাজা, বাদাম, ঝালমুড়ি ও গ্রানুলার পাউডার প্যাকিং (১০-২০০ গ্রাম)।',
    fullDescEn:
      'AP 110-M automatic vertical center-seal form-fill-seal machine engineered for chanachur, chips, motor bhaja, badam, jhal muri, dal, tea, and free-flowing granular powders from 10g to 200g.',
    fullDescBn:
      'AP 110-M স্বয়ংক্রিয় সেন্টার সিল ফর্ম-ফিল-সিল মেশিন যা চানাচুর, চিপস, মটর ভাজা, বাদাম, ঝালমুড়ি, ডাল ও পাউডার জাতীয় পণ্য ১০ গ্রাম থেকে ২০০ গ্রাম পর্যন্ত হাতের ছোঁয়া ছাড়াই প্যাক করে।',
    images: ['/machines/ap-110m-granule.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'AP 110-M' },
      { keyEn: 'Filling Range', keyBn: 'প্যাকিং রেঞ্জ', value: '10-200', unit: 'gm' },
      { keyEn: 'Seal Type', keyBn: 'সিল টাইপ', value: 'Center Seal / Pillow Pack' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '35-65', unit: 'bags/min' },
      { keyEn: 'Power', keyBn: 'পাওয়ার', value: '220V AC / 50Hz' },
    ],
    packableIds: ['chanachur', 'chips', 'motor-bhaja', 'muri', 'dal', 'spices'],
    featured: true,
  },
  {
    id: '2',
    slug: 'ap-120m-powder-packing',
    categoryId: 'food-beverage',
    modelCode: 'AP 120-M',
    brochurePage: 23,
    nameEn: 'AP 120-M Automatic Center Seal Powder & Granule Packing (50-300gm)',
    nameBn: 'AP 120-M অটোমেটিক সেন্টার সিল পাউডার ও গ্রানুলার প্যাকিং মেশিন (৫০-৩০০ গ্রাম)',
    shortDescEn: 'Medium-pouch center seal packer for chanachur, chips, badam, motor bhaja & jhal muri (50-300gm).',
    shortDescBn: 'চানাচুর, চিপস, বাদাম, মটর ভাজা ও ঝালমুড়ি ৫০-৩০০ গ্রাম সেন্টার সিল প্যাকিং।',
    fullDescEn:
      'AP 120-M center seal vertical packing unit built for 50-300gm consumer packs of snacks, pulses, badam, tea, sugar, salt, and spice blends with PLC timing control.',
    fullDescBn:
      'AP 120-M সেন্টার সিল ভার্টিকাল প্যাকিং মেশিন ৫০ থেকে ৩০০ গ্রাম পর্যন্ত স্ন্যাকস, বাদাম, চা, চিনি, লবণ ও মসলার পাউচ নিখুঁতভাবে প্যাক করে।',
    images: ['/machines/ap-120m-powder.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'AP 120-M' },
      { keyEn: 'Filling Range', keyBn: 'প্যাকিং রেঞ্জ', value: '50-300', unit: 'gm' },
      { keyEn: 'Seal Type', keyBn: 'সিল টাইপ', value: 'Center Seal' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '30-55', unit: 'bags/min' },
      { keyEn: 'Voltage', keyBn: 'ভোল্টেজ', value: '220V AC' },
    ],
    packableIds: ['chanachur', 'chips', 'motor-bhaja', 'muri', 'tea', 'sugar'],
  },
  {
    id: '3',
    slug: 'ap-130m-heavy-granule-packing',
    categoryId: 'food-beverage',
    modelCode: 'AP 130-M',
    brochurePage: 23,
    nameEn: 'AP 130-M Automatic Granule & Agro Packing Machine (200-1000gm)',
    nameBn: 'AP 130-M অটোমেটিক সেন্টার সিল চাল-ডাল-চিনি-লবণ প্যাকিং মেশিন (২০০-১০০০ গ্রাম)',
    shortDescEn: 'Heavy-duty center seal packer for rice, dal, salt, sugar, chanachur & jhal muri (200-1000gm).',
    shortDescBn: 'চাউল, ডাল, লবণ, চিনি, চানাচুর ও ঝালমুড়ি ২০০ গ্রাম থেকে ১ কেজি অটো প্যাকিং।',
    fullDescEn:
      'AP 130-M heavy-frame vertical packing machine engineered for 200gm to 1kg bags of rice, dal, salt, sugar, pulses, and puffed snacks with stainless steel contact parts.',
    fullDescBn:
      'AP 130-M হেভি-ডিউটি ভার্টিকাল প্যাকিং মেশিন ২০০ গ্রাম থেকে ১ কেজি পর্যন্ত চাউল, ডাল, লবণ, চিনি ও চানাচুরের প্যাকেট দ্রুত এবং স্বাস্থ্যসম্মতভাবে তৈরি করে।',
    images: ['/machines/ap-130m-granule.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'AP 130-M' },
      { keyEn: 'Filling Range', keyBn: 'প্যাকিং রেঞ্জ', value: '200-1000', unit: 'gm' },
      { keyEn: 'Control System', keyBn: 'কন্ট্রোল', value: 'PLC Digital Touch Control' },
      { keyEn: 'Power', keyBn: 'পাওয়ার', value: '220V / 2.2kW' },
    ],
    packableIds: ['rice', 'dal', 'salt', 'sugar', 'chanachur', 'muri'],
    featured: true,
  },
  {
    id: '4',
    slug: 'ap-140m-tang-saline-sachet',
    categoryId: 'health-pharma',
    modelCode: 'AP 140-M',
    brochurePage: 23,
    nameEn: 'AP 140-M 3-4 Side Seal Tang Powder & Saline Packing Machine (2-100g)',
    nameBn: 'AP 140-M ৩-৪ সাইড সিল ট্যাংক পাউডার ও স্যালাইন প্যাকিং মেশিন (২-১০০ গ্রাম)',
    shortDescEn: 'Precision 3-side & 4-side sachet sealing for Tang drink powder, ORS saline & fine spice powder (2-100g).',
    shortDescBn: 'ট্যাংক পাউডার, ওরস্যালাইন ও সূক্ষ্ম পাউডারের ৩-৪ সাইড স্যাশেট প্যাকিং (২-১০০ গ্রাম)।',
    fullDescEn:
      'AP 140-M precision 3-side and 4-side seal sachet packaging machine designed for powdered drinks (Tang), oral saline (ORS), coffee, seasoning, and pharmaceutical sachets.',
    fullDescBn:
      'AP 140-M ৩ ও ৪ সাইড সিল স্যাশেট মেশিন ট্যাংক পাউডার, ওরস্যালাইন, কফি ও ফার্মাসিউটিক্যাল পাউডার ২ থেকে ১০০ গ্রাম মাপে নির্ভুলভাবে প্যাক করে।',
    images: ['/machines/ap-140m-tang-saline.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'AP 140-M' },
      { keyEn: 'Filling Range', keyBn: 'প্যাকিং রেঞ্জ', value: '2-100', unit: 'gm' },
      { keyEn: 'Seal Style', keyBn: 'সিল টাইপ', value: '3-Side / 4-Side Seal' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '40-70', unit: 'sachets/min' },
    ],
    packableIds: ['tang-saline', 'spices', 'coffee', 'pharma', 'milk-powder'],
  },
  {
    id: '5',
    slug: 'ap-150m-liquid-sachet-filler',
    categoryId: 'cosmetics-toiletries',
    modelCode: 'AP 150-M',
    brochurePage: 23,
    nameEn: 'AP 150-M Liquid Shampoo, Cream, Jam, Jelly & Chutney Filling Machine',
    nameBn: 'AP 150-M লিকুইড শ্যাম্পু, ক্রিম, জ্যাম, জেলি ও চাটনি স্যাশেট ফিলিং মেশিন',
    shortDescEn: 'Automatic viscous liquid & paste sachet packer for shampoo, cream, jam, jelly, honey & chutney.',
    shortDescBn: 'শ্যাম্পু, ক্রিম, জ্যাম, জেলি, মধু ও চাটনি পাউচ-স্যাশেট ফিলিং ও সিলিং মেশিন।',
    fullDescEn:
      'AP 150-M pneumatic piston-dosing VFFS sachet machine for viscous liquids and pastes including shampoo, hair oil, fairness cream, tomato ketchup, jam, jelly, and chutney.',
    fullDescBn:
      'AP 150-M নিউম্যাটিক পিস্টন ডোজিং লিকুইড স্যাশেট মেশিন যা শ্যাম্পু, তেল, ক্রিম, জ্যাম, জেলি, টমেটো সস ও চাটনি স্বয়ংক্রিয়ভাবে প্যাক করে।',
    images: ['/machines/ap-150m-liquid-sachet.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'AP 150-M' },
      { keyEn: 'Dosing Pump', keyBn: 'পাম্প টাইপ', value: '304-SS Sanitary Piston' },
      { keyEn: 'Filling Range', keyBn: 'ফিলিং রেঞ্জ', value: '5-120', unit: 'ml' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '30-60', unit: 'sachets/min' },
    ],
    packableIds: ['shampoo', 'cream-jelly', 'oil', 'cosmetics', 'ghee'],
    featured: true,
  },
  {
    id: '6',
    slug: 'ap-160m-cosmetic-paste-sachet',
    categoryId: 'cosmetics-toiletries',
    modelCode: 'AP 160-M',
    brochurePage: 23,
    nameEn: 'AP 160-M High-Speed Liquid Shampoo, Cream, Jam & Paste Packing Machine',
    nameBn: 'AP 160-M হাই-স্পিড শ্যাম্পু, ক্রিম, জ্যাম ও পেস্ট ফিলিং মেশিন',
    shortDescEn: 'Automated multi-format pouch filling for liquid shampoo, cosmetic lotion, sauce, jam & jelly.',
    shortDescBn: 'শ্যাম্পু, লোশন, ক্রিম, জ্যাম, জেলি ও পেস্টের হাই-স্পিড স্যাশেট প্যাকিং মেশিন।',
    fullDescEn:
      'AP 160-M upgraded viscous sachet packing machine featuring anti-drip heated sealing jaws, photocell film tracking, and precision stainless piston dosing.',
    fullDescBn:
      'AP 160-M উন্নত ফটোসেল ট্র্যাকিং ও অ্যান্টি-ড্রিপ হিটিং জ-যুক্ত তরল ও পেস্ট স্যাশেট ফিলিং মেশিন।',
    images: ['/machines/ap-160m-liquid-sachet.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'AP 160-M' },
      { keyEn: 'Filling Range', keyBn: 'ফিলিং রেঞ্জ', value: '5-150', unit: 'ml' },
      { keyEn: 'Accuracy', keyBn: 'নির্ভুলতা', value: '±1%' },
      { keyEn: 'Voltage', keyBn: 'ভোল্টেজ', value: '220V / 1.5kW' },
    ],
    packableIds: ['shampoo', 'cream-jelly', 'cosmetics', 'oil'],
  },
  {
    id: '7',
    slug: 'screw-auger-plc-powder-packer',
    categoryId: 'food-beverage',
    modelCode: 'AP-720M PLC',
    brochurePage: 26,
    nameEn: 'Screw Auger Type Powder Filling & Sealing Machine (Mitsubishi PLC + HMI)',
    nameBn: 'স্ক্রু অগার টাইপ পাউডার ফিলিং ও সিলিং মেশিন (মিতসুবিশি পিএলসি ও টাচ স্ক্রিন)',
    shortDescEn: 'PLC Touch Screen control, side-open mixing hopper, pneumatic pressure regulator & belt/screw feeder.',
    shortDescBn: 'টাচ স্ক্রিন পিএলসি, মিক্সিং হপার, প্রেশার রেগুলেটর ও স্ক্রু ফিডারসহ আটা-ময়দা-মসলা প্যাকিং।',
    fullDescEn:
      'Industrial screw auger vertical form-fill-seal system equipped with Mitsubishi PLC, touch screen HMI, easy-clean side-opening mixing hopper, digital pressure regulator, and inclined screw feeder for atta, maida, suji, milk powder, detergent & spices.',
    fullDescBn:
      'মিতসুবিশি পিএলসি, টাচ স্ক্রিন ডিসপ্লে, সাইড-ওপেনিং মিক্সিং হপার ও ইনক্লাইন্ড স্ক্রু কনভেয়র সহ আটা, ময়দা, সুজি, গুঁড়া দুধ, হলুদ-মরিচ মসলা ও ডিটারজেন্ট পাউডার প্যাকিং মেশিন।',
    images: ['/machines/screw-auger-plc-packer.webp', '/machines/auger-screw-1-2kg.webp'],
    specs: [
      { keyEn: 'Control Unit', keyBn: 'কন্ট্রোল ইউনিট', value: 'Mitsubishi PLC + Touch Screen' },
      { keyEn: 'Packing Range', keyBn: 'প্যাকিং রেঞ্জ', value: '100-2000', unit: 'gm' },
      { keyEn: 'Hopper', keyBn: 'হপার', value: '304-SS Side-Open Mixing Hopper' },
      { keyEn: 'Power Supply', keyBn: 'পাওয়ার', value: '220V / 380V 3.5kW' },
    ],
    packableIds: ['atta', 'maida', 'suji', 'spices', 'milk-powder', 'detergent'],
    featured: true,
  },
  {
    id: '8',
    slug: 'auger-screw-1-2kg-packing',
    categoryId: 'food-beverage',
    modelCode: 'AP-AUGER-2K',
    brochurePage: 6,
    nameEn: '1-2 kg Atta, Maida, Suji & Spices Masala Auger Screw Packing Line',
    nameBn: '১-২ কেজি আটা, ময়দা, সুজি ও মসলা অগার স্ক্রু প্যাকিং লাইন',
    shortDescEn: 'Full line with ground feeder hopper, inclined screw elevator, VFFS auger filler & take-away conveyor.',
    shortDescBn: 'গ্রাউন্ড ফিডার হপার, স্ক্রু এলিভেটর ও আউটপুট কনভেয়রসহ ১-২ কেজি আটা-ময়দা-মসলা প্যাকিং লাইন।',
    fullDescEn:
      'Complete 1kg–2kg powder packaging station featuring floor-level bulk hopper, stainless inclined auger conveyor, precision vertical auger packer, and finished bag discharge conveyor.',
    fullDescBn:
      'ফ্লোর-লেভেল হপার, অগার ফিডার, ভার্টিকাল প্যাকিং ইউনিট ও ডিসচার্জ কনভেয়র সহ সম্পূর্ণ ১-২ কেজি আটা, ময়দা, সুজি ও গুঁড়া দুধ প্যাকিং লাইন।',
    images: ['/machines/auger-screw-1-2kg.webp', '/machines/auger-filling-studio.webp'],
    specs: [
      { keyEn: 'Pack Weight', keyBn: 'প্যাক ওজন', value: '1000-2000', unit: 'gm' },
      { keyEn: 'Accuracy', keyBn: 'সঠিকতা', value: '±1%' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '20-40', unit: 'bags/min' },
      { keyEn: 'Construction', keyBn: 'বডি', value: 'Food Grade SS-304' },
    ],
    packableIds: ['atta', 'maida', 'suji', 'milk-powder', 'spices', 'detergent'],
  },
  {
    id: '9',
    slug: 'ap-450m-chanachur-chips-packing',
    categoryId: 'food-beverage',
    modelCode: 'AP-450M',
    brochurePage: 6,
    nameEn: 'AP-450M Chanachur, Chips, Dal & Motor Bhaja Packing Machine',
    nameBn: 'AP-450M চানাচুর, চিপস, ডাল ও মটর ভাজা অটো প্যাকিং মেশিন',
    shortDescEn: 'Volumetric cup-dosing vertical packer for chanachur, potato chips, fried dal, rice & sugar.',
    shortDescBn: 'চানাচুর, চিপস, ডাল, মটর ভাজা, চাউল ও চিনি প্যাক করার ভলিউমেট্রিক কাপ মেশিন।',
    fullDescEn:
      'AP-450M rotary volumetric cup VFFS machine built for continuous snack and agro granular packaging with nitrogen flushing option and date coder compatibility.',
    fullDescBn:
      'AP-450M ভলিউমেট্রিক কাপ ভার্টিকাল প্যাকিং মেশিন চানাচুর, চিপস, ডাল ও মটর ভাজার দীর্ঘস্থায়ী ও আকর্ষণীয় প্যাকেট তৈরির জন্য আদর্শ।',
    images: ['/machines/ap-450m-snacks.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'AP-450M' },
      { keyEn: 'Dosing System', keyBn: 'ডোজিং', value: 'Volumetric Cup' },
      { keyEn: 'Packing Range', keyBn: 'প্যাকিং রেঞ্জ', value: '10-500', unit: 'gm' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '30-60', unit: 'bags/min' },
    ],
    packableIds: ['chanachur', 'chips', 'dal', 'motor-bhaja', 'sugar'],
  },
  {
    id: '10',
    slug: 'ap-350m-chanachur-snacks-packing',
    categoryId: 'food-beverage',
    modelCode: 'AP-350M',
    brochurePage: 6,
    nameEn: 'AP-350M Economy Snacks, Chanachur & Granule Packing Machine',
    nameBn: 'AP-350M ইকোনমি চানাচুর, চিপস ও ডাল প্যাকিং মেশিন',
    shortDescEn: 'Compact VFFS granular packer proven across Bangladesh snack factories (10-250gm).',
    shortDescBn: 'বাংলাদেশের স্ন্যাকস ফ্যাক্টরিতে বহুল ব্যবহৃত কমপ্যাক্ট চানাচুর ও গ্রানুল প্যাকিং মেশিন।',
    fullDescEn:
      'AP-350M compact vertical form-fill-seal packer engineered for small-to-medium pouch sizes of chanachur, dal, badam, jhal muri, and whole spices.',
    fullDescBn:
      'AP-350M কমপ্যাক্ট ভিএফএফএস মেশিন চানাচুর, ডাল, বাদাম ও ঝালমুড়ির ছোট ও মাঝারি প্যাকেট কম বিদ্যুৎ খরচে দ্রুত প্যাক করে।',
    images: ['/machines/ap-350m-snacks.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'AP-350M' },
      { keyEn: 'Packing Range', keyBn: 'প্যাকিং রেঞ্জ', value: '10-250', unit: 'gm' },
      { keyEn: 'Power', keyBn: 'পাওয়ার', value: '220V / 1.8kW' },
    ],
    packableIds: ['chanachur', 'chips', 'dal', 'motor-bhaja', 'muri'],
  },
  {
    id: '11',
    slug: 'horizontal-flow-wrapping-machine',
    categoryId: 'food-beverage',
    modelCode: 'AP-FW350',
    brochurePage: 77,
    nameEn: 'Auto Horizontal Flow Wrapping Solid Product Packing Machine',
    nameBn: 'অটো হরাইজন্টাল ফ্লো র‍্যাপিং সলিড প্রোডাক্ট প্যাকিং মেশিন',
    shortDescEn: 'High-speed pillow flow wrapper for biscuits, cakes, chocolate bars, soap bars & auto parts.',
    shortDescBn: 'বিস্কুট, কেক, চকোলেট বার, সাবান, নুডলস ও সলিড আইটেম প্যাক করার ফ্লো র‍্যাপ মেশিন।',
    fullDescEn:
      'Automatic horizontal flow-wrapping machine with servo/inverter drive and photocell eye-mark sensor for pillow packing biscuits, wafers, cakes, chocolate bars, detergent bars, and solid consumer goods.',
    fullDescBn:
      'বিস্কুট, কেক, ওয়েফার, চকোলেট বার, সাবান ও সলিড পণ্য পিলো প্যাকে দ্রুত র‍্যাপিং করার জন্য স্বয়ংক্রিয় হরাইজন্টাল ফ্লো-র‍্যাপিং মেশিন।',
    images: ['/machines/flow-wrap-solid.webp'],
    specs: [
      { keyEn: 'Speed', keyBn: 'গতি', value: '40-150', unit: 'pcs/min' },
      { keyEn: 'Bag Length', keyBn: 'দৈর্ঘ্য', value: '65-330', unit: 'mm' },
      { keyEn: 'Power', keyBn: 'পাওয়ার', value: '220V / 2.4kW' },
    ],
    packableIds: ['biscuit', 'chocolate', 'snacks', 'noodles', 'cosmetics', 'auto-parts'],
    featured: true,
  },
  {
    id: '12',
    slug: 'semi-auto-digital-weight-scale-filler',
    categoryId: 'food-beverage',
    modelCode: 'AP-DW1000',
    brochurePage: 6,
    nameEn: 'Semi-Auto Digital Weight Scale Filling Machine (Rice, Puffed Rice, Dal & Seed)',
    nameBn: 'সেমি-অটো ডিজিটাল ওয়েট স্কেল ফিলিং মেশিন (চাউল, মুড়ি, ডাল ও বীজ)',
    shortDescEn: 'Load-cell digital weigher for accurate filling of puffed rice (muri), rice, dal, seed & snacks.',
    shortDescBn: 'ডিজিটাল লোড-সেল স্কেলে নির্ভুল ওজন অনুযায়ী মুড়ি, চাউল, ডাল ও বীজ ফিলিং মেশিন।',
    fullDescEn:
      'Semi-automatic vibrating linear weigher with digital load-cell controller for gentle, crush-free filling of puffed rice (muri), chanachur, rice, dal, seeds, and fragile granules from 50g to 5kg.',
    fullDescBn:
      'মুড়ি না ভেঙে নিখুঁত ওজনে চাউল, ডাল, মুড়ি, চানাচুর ও বীজ ৫০ গ্রাম থেকে ৫ কেজি পর্যন্ত ফিলিং করার ডিজিটাল ওয়েট স্কেল মেশিন।',
    images: ['/machines/semi-auto-weight-scale.webp', '/machines/rice-puffed-weight-filling.webp'],
    specs: [
      { keyEn: 'Weighing Range', keyBn: 'ওজন রেঞ্জ', value: '50-5000', unit: 'gm' },
      { keyEn: 'Accuracy', keyBn: 'সঠিকতা', value: '±1-2', unit: 'gm' },
      { keyEn: 'Hopper Material', keyBn: 'উপাদান', value: 'SS-304 Stainless Steel' },
    ],
    packableIds: ['muri', 'rice', 'dal', 'sugar', 'salt', 'chanachur'],
  },
  {
    id: '13',
    slug: 'jelly-strip-packaging-machine',
    categoryId: 'food-beverage',
    modelCode: 'AP-JL800',
    brochurePage: 56,
    nameEn: 'Automatic Multi-Lane Jelly Strip & Ice Lolly Pop Packaging Machine',
    nameBn: 'অটোমেটিক জেলি স্ট্রিপ ও আইস ললি পপ প্যাকেজিং মেশিন',
    shortDescEn: 'PLC-controlled liquid stick & strip pouch packer for mango jelly, ice-pop, robo & honey sticks.',
    shortDescBn: 'জেলি স্ট্রিপ, আইস ললি পপ, রবো ও তরল স্টিক পাউচ প্যাকিং মেশিন।',
    fullDescEn:
      'Multi-lane liquid & viscous strip packaging system built for fruit jelly strips, ice-lolly pops, robo drinks, honey sticks, and flavored liquid sachets with automatic cutting and batch counting.',
    fullDescBn:
      'জেলি স্ট্রিপ, আইস পপ, রবো ও ফলের রস ভিত্তিক লিকুইড স্টিক পাউচ দ্রুত ফিলিং ও কাটিং করার সম্পূর্ণ স্বয়ংক্রিয় মেশিন।',
    images: ['/machines/jelly-strip-packaging.webp'],
    specs: [
      { keyEn: 'Control', keyBn: 'কন্ট্রোল', value: 'Touch Screen PLC' },
      { keyEn: 'Fill Volume', keyBn: 'ফিল ভলিউম', value: '10-100', unit: 'ml' },
      { keyEn: 'Power', keyBn: 'পাওয়ার', value: '220V / 2.2kW' },
    ],
    packableIds: ['juice', 'cream-jelly'],
    featured: true,
  },
  {
    id: '14',
    slug: 'water-bottle-filling-capping-machine',
    categoryId: 'liquid-processing',
    modelCode: 'AP-CGF-3IN1',
    brochurePage: 8,
    nameEn: 'Automatic Bottle Washing, Filling & Capping Machine (3-in-1 Monoblock)',
    nameBn: 'অটোমেটিক বোতল ওয়াশিং, ফিলিং ও ক্যাপিং মেশিন (৩-ইন-১ মনোব্লক)',
    shortDescEn: 'Integrated PET/glass bottle rinsing, gravity/pressure filling & screw capping for water & juice.',
    shortDescBn: 'মিনারেল ওয়াটার, জুস ও পানীয়ের জন্য স্বয়ংক্রিয় বোতল ওয়াশিং, ফিলিং ও ক্যাপিং লাইন।',
    fullDescEn:
      'Full 3-in-1 rotary monoblock bottling line combining bottle neck-clamping rinsing, stainless steel high-speed filling valves, and magnetic torque screw capping for 250ml to 2000ml PET bottles.',
    fullDescBn:
      '২৫০ মিলি থেকে ২ লিটার পেট বোতলে পানি, জুস ও বেভারেজ স্বাস্থ্যসম্মতভাবে ওয়াশিং, ফিলিং ও ক্যাপিং করার ৩-ইন-১ অটোমেটিক মনোব্লক প্ল্যান্ট।',
    images: [
      '/machines/water-bottle-filling-capping.webp',
      '/machines/water-juice-line.webp',
      '/machines/juice-filling-capping.webp',
    ],
    specs: [
      { keyEn: 'Capacity', keyBn: 'উৎপাদন ক্ষমতা', value: '2000-6000', unit: 'BPH' },
      { keyEn: 'Bottle Size', keyBn: 'বোতল সাইজ', value: '250-2000', unit: 'ml' },
      { keyEn: 'Contact Material', keyBn: 'উপাদান', value: 'SUS-304 / SUS-316L' },
    ],
    packableIds: ['mineral-water', 'juice', 'oil'],
    featured: true,
  },
  {
    id: '15',
    slug: 'digital-liquid-filling-machine',
    categoryId: 'liquid-processing',
    modelCode: 'AP-DLF-2N',
    brochurePage: 42,
    nameEn: '2-Nozzle Digital Liquid Filling Machine (50-2000ml)',
    nameBn: '২-নজেল ডিজিটাল লিকুইড ফিলিং মেশিন (৫০-২০০০ মিলি)',
    shortDescEn: 'Compact microcomputer peristaltic/gear digital filler for oil, juice, sanitizer, perfume & syrup.',
    shortDescBn: 'তেল, জুস, সিরাপ, স্যানিটাইজার ও তরল বোতলে ভর্তির ডিজিটাল ২-নজেল ফিলার।',
    fullDescEn:
      'Microcomputer-controlled dual-nozzle digital liquid filling machine with independent filling time and speed settings, foot-pedal or auto-cycle trigger, ideal for start-up to mid-scale bottling.',
    fullDescBn:
      'ডিজিটাল টাইমার ও স্পিড কন্ট্রোল সমৃদ্ধ ২-নজেল তরল ফিলিং মেশিন — পানি, জুস, ভোজ্যতেল, সিরাপ ও কসমেটিক তরল নিখুঁত পরিমাপে বোতলে ভরে।',
    images: ['/machines/digital-liquid-filler.webp'],
    specs: [
      { keyEn: 'Nozzles', keyBn: 'নজেল', value: '2 Digital Heads' },
      { keyEn: 'Filling Range', keyBn: 'ফিলিং রেঞ্জ', value: '5-3500', unit: 'ml' },
      { keyEn: 'Voltage', keyBn: 'ভোল্টেজ', value: '220V / 300W' },
    ],
    packableIds: ['oil', 'juice', 'mineral-water', 'shampoo', 'pharma'],
  },
  {
    id: '16',
    slug: 'semi-auto-bottle-capping-machine',
    categoryId: 'liquid-processing',
    modelCode: 'AP-SBC-100',
    brochurePage: 42,
    nameEn: 'Semi-Auto Electric Screw Bottle Capping Machine',
    nameBn: 'সেমি-অটো ইলেকট্রিক বোতল ক্যাপিং মেশিন',
    shortDescEn: 'Adjustable torque pneumatic/electric bottle capper for plastic screw & ROPP caps.',
    shortDescBn: 'প্লাস্টিক ও অ্যালুমিনিয়াম স্ক্রু ক্যাপ টাইট করার সেমি-অটো বোতল ক্যাপিং মেশিন।',
    fullDescEn:
      'Tabletop electric screw capping machine with height-adjustable column and interchangeable capping chucks for mineral water, juice, edible oil, pharmaceutical syrup, and chemical bottles.',
    fullDescBn:
      'বোতলের উচ্চতা অনুযায়ী সহজে অ্যাডজাস্টযোগ্য সেমি-অটো ইলেকট্রিক বোতল ক্যাপিং মেশিন — পানি, জুস, তেল ও মেডিসিন বোতলের মুখ মজবুতভাবে সিল করে।',
    images: ['/machines/semi-auto-bottle-capping.webp'],
    specs: [
      { keyEn: 'Cap Diameter', keyBn: 'ক্যাপ সাইজ', value: '15-50', unit: 'mm' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '20-35', unit: 'bottles/min' },
      { keyEn: 'Power', keyBn: 'পাওয়ার', value: '220V / 370W' },
    ],
    packableIds: ['mineral-water', 'juice', 'oil', 'cleaners', 'pharma'],
  },
  {
    id: '17',
    slug: 'ro-uv-water-treatment-plant',
    categoryId: 'liquid-processing',
    modelCode: 'AP-RO-2000',
    brochurePage: 51,
    nameEn: 'RO & UV System Water Treatment Plant (500-5000 LPH)',
    nameBn: 'আরও ও ইউভি ওয়াটার ট্রিটমেন্ট প্ল্যান্ট (৫০০-৫০০০ লিটার/ঘণ্টা)',
    shortDescEn: 'Complete reverse osmosis, multi-media filtration & UV sterilization plant for mineral water.',
    shortDescBn: 'মিনারেল ওয়াটার ও বেভারেজ ফ্যাক্টরির জন্য সম্পূর্ণ আরও ও ইউভি পানি শোধনাগার।',
    fullDescEn:
      'Industrial Reverse Osmosis (RO) + UV sterilization + mineral dosing water purification plant in stainless steel skid, customized for 500 to 15,000 LPH drinking water and beverage factories.',
    fullDescBn:
      'মিনারেল ওয়াটার, জুস ও কার্বনেটেড ড্রিংকস উৎপাদনের জন্য পূর্ণাঙ্গ এসএস ফ্রেম আরও (RO), আল্ট্রাভায়োলেট (UV) ও মিনারেল ডোজিং প্ল্যান্ট।',
    images: ['/machines/ro-uv-water-plant.webp'],
    specs: [
      { keyEn: 'Capacity', keyBn: 'ক্ষমতা', value: '500-5000', unit: 'LPH' },
      { keyEn: 'Filtration', keyBn: 'ফিল্টারেশন', value: 'Quartz + Carbon + RO + UV' },
      { keyEn: 'Frame', keyBn: 'ফ্রেম', value: 'SS-304 Heavy Skid' },
    ],
    packableIds: ['mineral-water', 'juice'],
  },
  {
    id: '18',
    slug: 'cip-plant-rotary-cleaning-line',
    categoryId: 'liquid-processing',
    modelCode: 'AP-CIP-3T',
    brochurePage: 9,
    nameEn: 'CIP Plant Rotary Spray Type Washing & Chemical Storage Line',
    nameBn: 'সিআইপি প্ল্যান্ট রোটারি স্প্রে ও কেমিক্যাল ক্লিনিং লাইন',
    shortDescEn: 'Sanitary 3-tank CIP system (Acid, Alkali & Hot Water) with rotary spray balls & circulation pump.',
    shortDescBn: 'ফুড, ডেইরি ও বেভারেজ পাইপলাইন এবং ট্যাংক জীবাণুমুক্ত করতে ৩-ট্যাংক সিআইপি প্ল্যান্ট।',
    fullDescEn:
      'Clean-In-Place (CIP) hygienic washing plant with Acid, Alkali, and Hot Water 304-SS storage tanks, 360-degree rotary spray balls, plate heat exchanger, and return pump for dairy, beverage & cosmetic plants.',
    fullDescBn:
      'এসিড, অ্যালকালি ও গরম পানির ট্যাংক এবং ৩৬০° রোটারি স্প্রে বল সমৃদ্ধ সিআইপি প্ল্যান্ট যা মেশিন না খুলেই সম্পূর্ণ প্রসেস লাইন পরিষ্কার ও জীবাণুমুক্ত করে।',
    images: ['/machines/cip-chemical-tanks.webp', '/machines/cip-hot-water-tank.webp', '/machines/cip-chiller.webp'],
    specs: [
      { keyEn: 'Configuration', keyBn: 'সিস্টেম', value: 'Acid / Alkali / Water Tanks' },
      { keyEn: 'Nozzle Type', keyBn: 'নজেল', value: '360° Rotary Spray Ball' },
      { keyEn: 'Material', keyBn: 'উপাদান', value: 'Sanitary SS-304 / SS-316' },
    ],
    packableIds: ['milk', 'juice', 'mineral-water', 'cosmetics'],
    featured: true,
  },
  {
    id: '19',
    slug: 'ss304-double-jacket-mixer-pasteurizer',
    categoryId: 'liquid-processing',
    modelCode: 'AP-DJM-500',
    brochurePage: 31,
    nameEn: '304-SS Double Jacket Heating Mixer Tank & Pasteurizer Machine',
    nameBn: '৩০৪-এসএস ডাবল জ্যাকেট হিটিং মিক্সার ট্যাংক ও পাস্তুরাইজার মেশিন',
    shortDescEn: 'Food-grade SS-304 double/triple jacketed thermal heating tank with agitator for juice, milk & cream.',
    shortDescBn: 'জুস, দুধ, ঘি, জ্যাম ও ক্রিম গরম ও মিক্স করার ৩০৪-এসএস ডাবল জ্যাকেট হিটিং মিক্সার।',
    fullDescEn:
      'Sanitary 304 stainless steel double-jacket and triple-jacket heated mixing vessel with temperature controller, top-mounted gear agitator, digital HMI control panel, and tri-clamp CIP ports for juice, dairy milk, honey, and cosmetic creams.',
    fullDescBn:
      'ফুড গ্রেড ৩০৪ স্টেইনলেস স্টিল ডাবল জ্যাকেট হিটিং মিক্সার ট্যাংক ও পাস্তুরাইজার — জুস, দুধ, মধু, ক্রিম ও জেলি নির্দিষ্ট তাপমাত্রায় রান্না ও মিক্স করার জন্য উপযুক্ত।',
    images: ['/machines/ss304-double-jacket-mixer.webp', '/machines/milk-pasteurizing-line.webp'],
    specs: [
      { keyEn: 'Steel Grade', keyBn: 'স্টিল গ্রেড', value: 'Food Grade SS-304' },
      { keyEn: 'Capacity', keyBn: 'ধারণক্ষমতা', value: '100-2000', unit: 'Liters' },
      { keyEn: 'Heating Type', keyBn: 'হিটিং সিস্টেম', value: 'Double / 3-Jacket Thermal Oil or Steam' },
      { keyEn: 'Control', keyBn: 'কন্ট্রোল', value: 'Digital Temp & Agitator VFD' },
    ],
    packableIds: ['juice', 'milk', 'cream-jelly', 'ghee', 'cosmetics'],
    featured: true,
  },
  {
    id: '20',
    slug: 'ss304-single-layer-mixer-tank',
    categoryId: 'liquid-processing',
    modelCode: 'AP-SMX-500',
    brochurePage: 9,
    nameEn: '304-SS Single-Layer Juice, Drinks & Liquid Mixer Tank',
    nameBn: '৩০৪-এসএস সিঙ্গেল লেয়ার জুস ও পানীয় লিকুইড মিক্সার ট্যাংক',
    shortDescEn: 'Sanitary high-shear agitator tank with sight glass for beverages, syrups & liquid soap mixing.',
    shortDescBn: 'জুস, ড্রিংকস, সিরাপ ও তরল পণ্য ব্লেন্ডিংয়ের জন্য সাইট-গ্লাসযুক্ত ৩০৪-এসএস মিক্সার ট্যাংক।',
    fullDescEn:
      'Single-layer 304 stainless steel blending vessel featuring top gear-motor impeller, hygienic manhole, sight glass, and bottom discharge valve for juice, flavored drinks, and liquid formulations.',
    fullDescBn:
      'জুস, এনার্জি ড্রিংকস, সিরাপ ও কসমেটিক তরল সমানভাবে মিক্স করার জন্য মিরর-পলিশ ৩০৪-এসএস এজিটেটর মিক্সিং ট্যাংক।',
    images: ['/machines/ss304-single-mixer-tank.webp'],
    specs: [
      { keyEn: 'Steel Grade', keyBn: 'স্টিল গ্রেড', value: 'Mirror-Polish SS-304' },
      { keyEn: 'Capacity', keyBn: 'ধারণক্ষমতা', value: '200-3000', unit: 'Liters' },
      { keyEn: 'Agitator Speed', keyBn: 'এজিটেটর গতি', value: '60-1400', unit: 'RPM' },
    ],
    packableIds: ['juice', 'mineral-water', 'milk', 'cleaners'],
  },
  {
    id: '21',
    slug: 'handwash-detergent-harpic-mixer',
    categoryId: 'cosmetics-toiletries',
    modelCode: 'AP-CHEM-300',
    brochurePage: 7,
    nameEn: 'Hand Wash, Dish Wash & Liquid Detergent Harpic Cleaner Mixer Machine',
    nameBn: 'হ্যান্ড ওয়াশ, ডিশ ওয়াশ ও লিকুইড ডিটারজেন্ট/হারপিক মিক্সার মেশিন',
    shortDescEn: 'Homogenizer & paddle agitator vessel with stainless control box for cleaners, shampoo & lotions.',
    shortDescBn: 'হ্যান্ড ওয়াশ, ডিশ ওয়াশ, ফ্লোর ক্লিনার, হারপিক ও শ্যাম্পু তৈরির হোমোজেনাইজার মিক্সার।',
    fullDescEn:
      'Complete liquid cleaner & cosmetic homogenizing mixer featuring high-shear bottom/top emulsifiers, stainless stair platform options, and digital speed control for hand wash, dish wash, floor cleaner, Harpic, and shampoo.',
    fullDescBn:
      'হ্যান্ড ওয়াশ, ডিশ ওয়াশ, ফ্লোর ক্লিনার, হারপিক ও শ্যাম্পু তৈরির জন্য হাই-শিয়ার হোমোজেনাইজার ও কন্ট্রোল প্যানেল সহ মিক্সার মেশিন।',
    images: ['/machines/liquid-detergent-mixer.webp', '/machines/harpic-cleaner-mixer.webp'],
    specs: [
      { keyEn: 'Batch Size', keyBn: 'ব্যাচ সাইজ', value: '100-1000', unit: 'Liters' },
      { keyEn: 'Mixing Action', keyBn: 'মিক্সিং', value: 'Homogenizer + Scraper' },
      { keyEn: 'Material', keyBn: 'উপাদান', value: 'Corrosion-Resistant SS-316 / 304' },
    ],
    packableIds: ['cleaners', 'shampoo', 'cosmetics', 'detergent'],
  },
  {
    id: '22',
    slug: 'dishwash-harpic-bottle-pouch-filler',
    categoryId: 'cosmetics-toiletries',
    modelCode: 'AP-4HL-500',
    brochurePage: 7,
    nameEn: 'Dish Wash & Harpic Cleaner 4-6 Head Automatic Bottle Filling Machine',
    nameBn: 'ডিশ ওয়াশ ও হারপিক ক্লিনার ৪-৬ হেড বোতল ফিলিং মেশিন',
    shortDescEn: 'Multi-head anti-corrosion conveyor filler for dish wash, toilet cleaner, oil & shampoo bottles.',
    shortDescBn: 'ডিশ ওয়াশ, টয়লেট ক্লিনার, শ্যাম্পু ও ভোজ্যতেলের বোতল ভর্তির ৪-৬ নজেল ফিলিং মেশিন।',
    fullDescEn:
      '4-head to 6-head automatic conveyorized volumetric piston filler with anti-drip nozzles and no-bottle-no-fill sensor for viscous household cleaners, shampoo, and edible oil.',
    fullDescBn:
      '৪ থেকে ৬ হেডের স্বয়ংক্রিয় কনভেয়র ফিলিং মেশিন যা ক্লিনার, শ্যাম্পু ও তেলের বোতল ফোটা না ফেলেই দ্রুত ভর্তি করে।',
    images: ['/machines/dishwash-bottle-filler.webp', '/machines/four-head-liquid-filler.webp'],
    specs: [
      { keyEn: 'Heads', keyBn: 'হেড', value: '4 to 6 Nozzles' },
      { keyEn: 'Fill Volume', keyBn: 'ফিলিং রেঞ্জ', value: '100-2000', unit: 'ml' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '25-45', unit: 'bottles/min' },
    ],
    packableIds: ['cleaners', 'shampoo', 'oil', 'cosmetics'],
  },
  {
    id: '23',
    slug: 'frd-1000w-horizontal-continuous-sealer',
    categoryId: 'health-pharma',
    modelCode: 'FRD-1000w',
    brochurePage: 24,
    nameEn: 'FRD-1000w Horizontal Continuous Band Sealing Machine',
    nameBn: 'FRD-1000w হরাইজন্টাল কন্টিনিউয়াস ব্যান্ড সিলিং মেশিন',
    shortDescEn: 'Continuous belt pouch sealer with built-in embossing date wheel for spices, snacks & detergent bags.',
    shortDescBn: 'পাউচে ডেট প্রিন্টিংসহ দ্রুত কন্টিনিউয়াস ব্যান্ড সিলিং মেশিন।',
    fullDescEn:
      'FRD-1000w continuous horizontal band sealer seals laminated, foil, PP, and PE pouches smoothly along a variable-speed conveyor belt with integrated steel wheel date embossing.',
    fullDescBn:
      'FRD-1000w কন্টিনিউয়াস ব্যান্ড সিলার মসলা, চানাচুর, চা, মুড়ি ও ডিটারজেন্টের প্যাকেট কনভেয়র বেল্টের মাধ্যমে একটানা সিল ও তারিখ মুদ্রণ করে।',
    images: ['/machines/frd-1000w-sealer.webp', '/machines/ap-1000m-horizontal-sealer.webp'],
    specs: [
      { keyEn: 'Model', keyBn: 'মডেল', value: 'FRD-1000w' },
      { keyEn: 'Sealing Speed', keyBn: 'সিলিং গতি', value: '0-12', unit: 'm/min' },
      { keyEn: 'Seal Width', keyBn: 'সিল প্রস্থ', value: '6-12', unit: 'mm' },
      { keyEn: 'Temp Range', keyBn: 'তাপমাত্রা', value: '0-300', unit: '°C' },
    ],
    packableIds: ['spices', 'chanachur', 'muri', 'tea', 'detergent'],
  },
  {
    id: '24',
    slug: 'thermal-shrink-tunnel-packing-machine',
    categoryId: 'health-pharma',
    modelCode: 'AP-BS4525',
    brochurePage: 21,
    nameEn: 'Thermal Shrink Tunnel Packing Machine (Bottle & Box Multipack)',
    nameBn: 'থার্মাল শ্রিঙ্ক টানেল প্যাকিং মেশিন (বোতল ও কার্টন)',
    shortDescEn: 'Heavy-duty hot air shrink wrapping tunnel for mineral water cases, juice cartons & jar bundles.',
    shortDescBn: 'মিনারেল ওয়াটার কেস, জুস কার্টন ও বোতলের বান্ডিল পলি শ্রিঙ্ক করার টানেল মেশিন।',
    fullDescEn:
      'Industrial thermal shrink tunnel machine using circulating hot air and digital temperature regulation to tightly wrap PVC/POF/PE shrink film around bottle packs, cartons, and cosmetic boxes.',
    fullDescBn:
      'মিনারেল ওয়াটার বোতল বান্ডিল, জুস প্যাকেট ও কসমেটিক্স বক্স পিভিসি বা পিই ফিল্ম দিয়ে টাইট শ্রিঙ্ক র‍্যাপিং করার মেশিন।',
    images: ['/machines/thermal-shrink-tunnel.webp'],
    specs: [
      { keyEn: 'Voltage', keyBn: 'ভোল্টেজ', value: '220V / 380V' },
      { keyEn: 'Conveyor Load', keyBn: 'লোড', value: 'Up to 30', unit: 'kg' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '0-10', unit: 'm/min' },
    ],
    packableIds: ['mineral-water', 'juice', 'cosmetics', 'pharma'],
  },
  {
    id: '25',
    slug: 'directly-heated-date-code-printer',
    categoryId: 'health-pharma',
    modelCode: 'AP-HP241',
    brochurePage: 21,
    nameEn: 'Directly Heated Batch & Expiry Date Code Printer (Color Ribbon)',
    nameBn: 'ডাইরেক্টলি হিটেড ব্যাচ ও মেয়াদ ডেট কোড প্রিন্টার (কালার রিবন)',
    shortDescEn: 'Thermal ribbon coder for printing MFG, EXP, MRP and Batch No on pouch labels & cartons.',
    shortDescBn: 'প্যাকেটে উৎপাদন ও মেয়াদোত্তীর্ণের তারিখ, ব্যাচ এবং মূল্য প্রিন্ট করার মেশিন।',
    fullDescEn:
      'Hot-stamping color ribbon date code printer for crisp, smear-proof printing of MFG date, EXP date, Batch number, and MRP on plastic film, paperboard, leather, and aluminum foil.',
    fullDescBn:
      'কালার রিবন ব্যবহার করে প্লাস্টিক পাউচ, লেবেল ও কার্টনে স্পষ্টভাবে MFG, EXP ও MRP প্রিন্ট করার হট-স্ট্যাম্পিং কোড প্রিন্টার।',
    images: ['/machines/date-code-printer.webp'],
    specs: [
      { keyEn: 'Print Lines', keyBn: 'লাইন', value: '1-3 Lines (15 chars/line)' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '20-120', unit: 'prints/min' },
      { keyEn: 'Temp Range', keyBn: 'তাপমাত্রা', value: '0-200', unit: '°C' },
    ],
    packableIds: ['spices', 'biscuit', 'pharma', 'cosmetics', 'snacks'],
  },
  {
    id: '26',
    slug: 'dz-260-vacuum-induction-sealer',
    categoryId: 'health-pharma',
    modelCode: 'DZ-260 / AP-IND',
    brochurePage: 24,
    nameEn: 'Vacuum Packing (DZ-260) & Auto Induction Foil Sealing Machine',
    nameBn: 'ভ্যাকুয়াম প্যাকিং (DZ-260) ও অটো ইন্ডাকশন ফয়েল সিলিং মেশিন',
    shortDescEn: 'Air-tight vacuum chamber sealer and electromagnetic foil cap sealer for jars, frozen food & pharma.',
    shortDescBn: 'ফ্রোজেন ফুড, চা, ডাল ভ্যাকুয়াম প্যাক ও জার-বোতলের মুখে অ্যালুমিনিয়াম ফয়েল সিলিং।',
    fullDescEn:
      'Combination catalog entry for DZ-260 stainless vacuum chamber machine (extends shelf life of meat, fish, dry fruits, tea, and nuts) and continuous electromagnetic induction foil sealer for PET/HDPE/glass jars.',
    fullDescBn:
      'মাছ-মাংস, ড্রাই ফ্রুটস ও চা-পাতা দীর্ঘদিন সতেজ রাখতে ভ্যাকুয়াম সিলিং এবং ওষুধ, ঘি ও মসলার জারের মুখ ফয়েল সিল করার ইন্ডাকশন মেশিন।',
    images: ['/machines/dz-260-vacuum-sealer.webp', '/machines/auto-induction-foil-sealer.webp', '/machines/foot-induction-sealer.webp'],
    specs: [
      { keyEn: 'Vacuum Pump', keyBn: 'ভ্যাকুয়াম পাম্প', value: 'DZ-260 Chamber' },
      { keyEn: 'Induction Seal Dia', keyBn: 'ফয়েল সিল সাইজ', value: '20-100', unit: 'mm' },
      { keyEn: 'Power', keyBn: 'পাওয়ার', value: '220V AC' },
    ],
    packableIds: ['tea', 'coffee', 'spices', 'ghee', 'pharma'],
  },
  {
    id: '27',
    slug: 'multi-head-granule-collar-packing',
    categoryId: 'industrial',
    modelCode: 'AP-MH10 / COLLAR',
    brochurePage: 21,
    nameEn: 'Multi-Head Weigher Granule & Collar-Type Belt Auger Packing System',
    nameBn: 'মাল্টি-হেড গ্রানুলার ওয়েইং ও কলার-টাইপ অগার প্যাকিং সিস্টেম',
    shortDescEn: 'High-speed 10-head combination weigher with Z-elevator and pneumatic collar VFFS unit.',
    shortDescBn: 'জেড-বাকেট এলিভেটর ও ১০-হেড কম্পিউটারাইজড ওয়েট স্কেলসহ হাই-স্পিড স্ন্যাকস ও ডাল প্যাকিং।',
    fullDescEn:
      'Industrial Z-bucket elevator and multi-head combination weigher paired with pneumatic collar-type VFFS machine for ultra-accurate, high-speed bagging of chips, chanachur, puffed rice, dal, and detergent powder.',
    fullDescBn:
      'বড় কারখানার জন্য জেড-বাকেট এলিভেটর, ১০-হেড কম্পিউটারাইজড ওয়েট স্কেল ও কলার-টাইপ ভিএফএফএস মেশিন — চিপস, চানাচুর ও ডিটারজেন্ট পাউডার দ্রুত প্যাক করে।',
    images: [
      '/machines/multi-head-granule.webp',
      '/machines/collar-belt-auger.webp',
      '/machines/pneumatic-collar-auger.webp',
      '/machines/detergent-powder-packer.webp',
    ],
    specs: [
      { keyEn: 'Weighing Heads', keyBn: 'হেড সংখ্যা', value: '10-Head Computerized' },
      { keyEn: 'Speed', keyBn: 'গতি', value: '50-80', unit: 'bags/min' },
      { keyEn: 'Accuracy', keyBn: 'সঠিকতা', value: '±0.5-1.5', unit: 'gm' },
    ],
    packableIds: ['chips', 'chanachur', 'rice', 'dal', 'detergent', 'auto-parts'],
    featured: true,
  },
  {
    id: '28',
    slug: 'muri-puffed-rice-making-line',
    categoryId: 'industrial',
    modelCode: 'AP-MURI-300',
    brochurePage: 19,
    nameEn: 'Automatic Muri (Puffed Rice) Roaster, Dryer & Packing Line',
    nameBn: 'অটোমেটিক মুড়ি ভাজা, ড্রায়ার ও প্যাকিং মেশিন লাইন',
    shortDescEn: 'Complete puffed rice production plant with rotary roaster, rice dryer & digital weight packing.',
    shortDescBn: 'হাতের ছোঁয়া ছাড়াই রোস্টার, ড্রায়ার ও ডিজিটাল ওজন প্যাকিংসহ অটোমেটিক মুড়ি ফ্যাক্টরি লাইন।',
    fullDescEn:
      'Turnkey automatic muri (puffed rice) plant including pre-heater dryer, continuous rotary sand/salt-free roaster, cooling sieve, and semi/full-auto digital weight filling line.',
    fullDescBn:
      'চাল শুকানোর ড্রায়ার, কন্টিনিউয়াস রোস্টার, চালুনী ও ডিজিটাল ওজন প্যাকিং মেশিন সহ পূর্ণাঙ্গ অটোমেটিক মুড়ি ভাজার প্ল্যান্ট।',
    images: ['/machines/muri-roaster-line.webp', '/machines/auto-roaster-machine.webp'],
    specs: [
      { keyEn: 'Capacity', keyBn: 'উৎপাদন ক্ষমতা', value: '150-500', unit: 'kg/hr' },
      { keyEn: 'Fuel Options', keyBn: 'জ্বালানি', value: 'Gas / Diesel / Electric' },
    ],
    packableIds: ['muri', 'rice', 'snacks'],
  },
  {
    id: '29',
    slug: 'ribbon-mixer-pulverizer-crusher',
    categoryId: 'industrial',
    modelCode: 'AP-MILL / RIBBON',
    brochurePage: 4,
    nameEn: 'Spices Pulverizer Grinder, Double Cone Blender & Ribbon Mass Mixer',
    nameBn: 'মসলা পালভারাইজার গ্রাইন্ডার, ডাবল কোন ব্লেন্ডার ও রিবন মিক্সার',
    shortDescEn: 'Complete spice, herbal, atta & detergent powder crushing, sifting & dry blending equipment.',
    shortDescBn: 'মসলা গুঁড়া করার পালভারাইজার, সুগার ক্রাশার ও পাউডার মিক্সিং ডাবল কোন-রিবন ব্লেন্ডার।',
    fullDescEn:
      'Stainless steel powder processing line combining high-speed multi-mill sugar/spice crusher, cyclone dust-free pulverizer grinder, ribbon mass mixer, and double-cone powder blender.',
    fullDescBn:
      'হলুদ-মরিচ-জিরা মসলা ও হারবাল পণ্য গুঁড়া করার পালভারাইজার এবং ডিটারজেন্ট বা মসলা সমানভাবে মেশানোর রিবন ও ডাবল-কোন ব্লেন্ডার।',
    images: ['/machines/ribbon-mass-mixer.webp', '/machines/double-cone-blender.webp', '/machines/multi-mill-crusher.webp'],
    specs: [
      { keyEn: 'Grinding Size', keyBn: 'গুঁড়ার সাইজ', value: '20-250', unit: 'Mesh' },
      { keyEn: 'Mixer Capacity', keyBn: 'মিক্সার ক্ষমতা', value: '50-1000', unit: 'kg/batch' },
      { keyEn: 'Material', keyBn: 'উপাদান', value: 'SS-304 Food Grade' },
    ],
    packableIds: ['spices', 'sugar', 'detergent', 'milk-powder', 'pharma'],
  },
];
