export interface VideoStep {
  labelEn: string;
  labelBn: string;
  detailEn: string;
  detailBn: string;
}

export interface MachineVideoShowcase {
  id: string;
  productSlug: string;
  modelCode: string;
  category: 'granule-powder' | 'liquid-beverage' | 'sealing-flowwrap' | 'cip-tanks';
  categoryLabelEn: string;
  categoryLabelBn: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  duration: string;
  capacityHighlight: string;
  posterImage: string;
  secondaryImages: string[];
  brochurePage: number;
  youtubeUrl?: string;
  steps: VideoStep[];
}

export function extractYoutubeId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function toYoutubeEmbedUrl(url?: string | null): string | null {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
}

export const MACHINE_VIDEO_SHOWCASES: MachineVideoShowcase[] = [
  {
    id: 'vid-ap-series-vffs',
    productSlug: 'ap-110m-granules-packing',
    modelCode: 'AP 110-M / 130-M / 140-M',
    category: 'granule-powder',
    categoryLabelEn: 'Granule & Powder',
    categoryLabelBn: 'গ্রানুল ও পাউডার',
    titleEn: 'AP-Series VFFS Center & 4-Side Seal Packing Operation',
    titleBn: 'AP-সিরিজ অটোমেটিক সেন্টার ও ৪-সাইড সিল প্যাকিং ডেমো',
    subtitleEn: 'How chanachur, chips, rice, dal, tang powder and saline are weighed, formed, sealed & cut without hand touch.',
    subtitleBn: 'চানাচুর, চিপস, চাউল, ডাল, ট্যাংক ও স্যালাইন কীভাবে হাতের ছোঁয়া ছাড়াই মাপা, সিল ও কাটিং হয়।',
    duration: '01:24',
    capacityHighlight: '10–1000 gm · 35–70 bags/min',
    posterImage: '/machines/ap-110m-granule.webp',
    secondaryImages: [
      '/machines/ap-130m-granule.webp',
      '/machines/ap-140m-tang-saline.webp',
      '/machines/ap-120m-powder.webp',
    ],
    brochurePage: 23,
    steps: [
      {
        labelEn: '1. Hopper Infeed',
        labelBn: '১. হপার ফিডিং',
        detailEn: 'Product loads into the 304-SS top hopper; level sensor maintains steady flow.',
        detailBn: 'স্টেইনলেস স্টিল টপ হপারে পণ্য লোড হয় এবং লেভেল সেন্সর প্রবাহ নিয়ন্ত্রণ করে।',
      },
      {
        labelEn: '2. Volumetric Metering',
        labelBn: '২. পরিমাপ ও ডোজিং',
        detailEn: 'Precision cups or 3-4 side augers dose exact gram weight (10–200g / 200–1000g).',
        detailBn: 'ভলিউমেট্রিক কাপ বা অগার নির্দিষ্ট গ্রাম ওজন (১০–১০০০ গ্রাম) নিখুঁতভাবে মাপে।',
      },
      {
        labelEn: '3. Film Forming & Collar',
        labelBn: '৩. ফিল্ম ফর্মিং',
        detailEn: 'Printed roll film wraps smoothly over the forming tube via photocell eye-mark tracking.',
        detailBn: 'ফটোসেল সেন্সরের মাধ্যমে প্রিন্টেড রোল ফিল্ম সঠিক মাপে টিউবে গঠিত হয়।',
      },
      {
        labelEn: '4. Heated Sealing & Cut',
        labelBn: '৪. হিট সিলিং ও কাটিং',
        detailEn: 'PID heated jaws seal center/4-side seams and cut crisp single or chain pouches.',
        detailBn: 'পিআইডি হিটার জ প্যাকেট মজবুত সিল করে ও সিঙ্গেল বা চেইন আকারে কাটে।',
      },
    ],
  },
  {
    id: 'vid-screw-auger-plc',
    productSlug: 'screw-auger-plc-powder-packer',
    modelCode: 'Mitsubishi PLC + Touch Screen',
    category: 'granule-powder',
    categoryLabelEn: 'Granule & Powder',
    categoryLabelBn: 'গ্রানুল ও পাউডার',
    titleEn: 'Screw Auger PLC Atta, Maida & Masala Packing Line',
    titleBn: 'স্ক্রু অগার পিএলসি আটা, ময়দা ও মসলা প্যাকিং লাইন',
    subtitleEn: 'Inclined screw feeder, side-open mixing hopper, pneumatic pressure regulator and Mitsubishi HMI.',
    subtitleBn: 'ইনক্লাইন্ড স্ক্রু ফিডার, সাইড-ওপেন মিক্সিং হপার ও টাচ স্ক্রিন পিএলসি কন্ট্রোল।',
    duration: '01:40',
    capacityHighlight: '100–2000 gm · ±1% Precision',
    posterImage: '/machines/screw-auger-plc-packer.webp',
    secondaryImages: ['/machines/auger-screw-1-2kg.webp', '/machines/auger-filling-studio.webp'],
    brochurePage: 26,
    steps: [
      {
        labelEn: '1. Floor Hopper & Auger Elevator',
        labelBn: '১. স্ক্রু এলিভেটর ফিডিং',
        detailEn: 'Dust-free inclined screw lifts atta, maida, milk powder or spices automatically.',
        detailBn: 'ধুলোমুক্ত স্ক্রু কনভেয়র স্বয়ংক্রিয়ভাবে পাউডার ওপরের হপারে তুলে দেয়।',
      },
      {
        labelEn: '2. Side-Open Mixing Hopper',
        labelBn: '২. মিক্সিং হপার ও অগার',
        detailEn: 'Slow agitator prevents bridging while servo auger doses exact weight.',
        detailBn: 'মিক্সিং ব্লেড পাউডার জমাট বাঁধতে দেয় না এবং অগার স্ক্রু নিখুঁত ডোজ দেয়।',
      },
      {
        labelEn: '3. Mitsubishi PLC Control',
        labelBn: '৩. মিতসুবিশি পিএলসি',
        detailEn: 'Touch screen sets bag length, temperature & pressure regulator parameters.',
        detailBn: 'টাচ স্ক্রিন থেকে ব্যাগের মাপ, তাপমাত্রা ও প্রেশার রেগুলেটর নিয়ন্ত্রণ হয়।',
      },
      {
        labelEn: '4. Take-Away Output',
        labelBn: '৪. কনভেয়র আউটপুট',
        detailEn: 'Finished 1kg–2kg pouches exit cleanly onto the takeaway belt.',
        detailBn: '১-২ কেজির প্রস্তুত প্যাকেট আউটপুট কনভেয়র বেল্টে বেরিয়ে আসে।',
      },
    ],
  },
  {
    id: 'vid-jelly-strip',
    productSlug: 'jelly-strip-packaging-machine',
    modelCode: 'AP-JL800 Strip Line',
    category: 'liquid-beverage',
    categoryLabelEn: 'Liquid & Beverage',
    categoryLabelBn: 'তরল ও পানীয়',
    titleEn: 'Jelly Strip & Ice Lolly Pop Multi-Lane Packing Walkthrough',
    titleBn: 'জেলি স্ট্রিপ ও আইস ললি পপ প্যাকিং অপারেশন',
    subtitleEn: 'Heated hopper, multi-nozzle anti-drip dosing, and high-speed stick pouch sealing.',
    subtitleBn: 'হিটেড হপার, মাল্টি-নজেল ডোজিং ও হাই-স্পিড স্টিক পাউচ সিলিং।',
    duration: '01:12',
    capacityHighlight: '10–100 ml · Multi-Lane',
    posterImage: '/machines/jelly-strip-packaging.webp',
    secondaryImages: ['/machines/ap-150m-liquid-sachet.webp', '/machines/ap-160m-liquid-sachet.webp'],
    brochurePage: 56,
    steps: [
      {
        labelEn: '1. Sanitary Liquid Hopper',
        labelBn: '১. স্যানিটারি হপার',
        detailEn: 'Temperature-controlled stainless tank feeds fruit jelly or ice-pop syrup.',
        detailBn: 'তাপমাত্রা নিয়ন্ত্রিত এসএস হপার থেকে জেলি বা ড্রিংকস ফিড হয়।',
      },
      {
        labelEn: '2. Piston Nozzle Injection',
        labelBn: '২. পিস্টন নজেল ফিলিং',
        detailEn: 'Anti-drip nozzles inject synchronized doses directly into formed strips.',
        detailBn: 'অ্যান্টি-ড্রিপ নজেল একসঙ্গে সব লেনে নির্দিষ্ট পরিমাণ তরল ভর্তি করে।',
      },
      {
        labelEn: '3. Longitudinal & Cross Seal',
        labelBn: '৩. সিলিং ও নচিং',
        detailEn: 'Dual heated jaws seal leak-proof strip edges with easy-tear notch.',
        detailBn: 'ডুয়েল হিটিং জ লিক-প্রুফ সিলিং ও ইজি-টিয়ার নচ তৈরি করে।',
      },
      {
        labelEn: '4. Chute Discharge',
        labelBn: '৪. আউটপুট চুট',
        detailEn: 'Trimmed jelly strips slide down stainless discharge chute ready for boxing.',
        detailBn: 'কাটা শেষে প্রস্তুত জেলি স্ট্রিপ কার্টন প্যাকিংয়ের জন্য বের হয়।',
      },
    ],
  },
  {
    id: 'vid-water-bottle-line',
    productSlug: 'water-bottle-filling-capping-machine',
    modelCode: 'AP-CGF 3-in-1 + Capper',
    category: 'liquid-beverage',
    categoryLabelEn: 'Liquid & Beverage',
    categoryLabelBn: 'তরল ও পানীয়',
    titleEn: 'Bottle Washing, Filling, Digital Dosing & Capping Line',
    titleBn: 'বোতল ওয়াশিং, ডিজিটাল ফিলিং ও ক্যাপিং লাইন ডেমো',
    subtitleEn: 'From 2-nozzle digital filler & semi-auto capper to full 3-in-1 rotary beverage bottling.',
    subtitleBn: '২-নজেল ডিজিটাল ফিলার ও সেমি-অটো ক্যাপিং থেকে পূর্ণাঙ্গ ৩-ইন-১ বোতলজাতকরণ প্ল্যান্ট।',
    duration: '01:55',
    capacityHighlight: '250–2000 ml · Up to 6000 BPH',
    posterImage: '/machines/water-bottle-filling-capping.webp',
    secondaryImages: [
      '/machines/water-juice-line.webp',
      '/machines/digital-liquid-filler.webp',
      '/machines/semi-auto-bottle-capping.webp',
    ],
    brochurePage: 8,
    steps: [
      {
        labelEn: '1. RO Water & Bottle Rinsing',
        labelBn: '১. বোতল ওয়াশিং ও শোধন',
        detailEn: 'RO/UV purified water feeds rotary rinser nozzles to sanitize incoming PET bottles.',
        detailBn: 'আরও-ইউভি বিশুদ্ধ পানি দিয়ে রোটারি রিন্সার বোতল পরিষ্কার করে।',
      },
      {
        labelEn: '2. High-Speed Gravity / Digital Fill',
        labelBn: '২. নির্ভুল ফিলিং',
        detailEn: 'No-bottle-no-fill valves fill water, juice, oil or cleaners accurately without foam.',
        detailBn: 'ফেনা ছাড়াই নির্ভুল পরিমাণে পানি, জুস, তেল বা ক্লিনার ভর্তি হয়।',
      },
      {
        labelEn: '3. Torque Screw Capping',
        labelBn: '৩. স্ক্রু ক্যাপিং',
        detailEn: 'Magnetic clutch capping heads tighten screw caps consistently with zero scuffing.',
        detailBn: 'ম্যাগনেটিক টর্ক ক্যাপিং হেড প্রতিটি বোতলের ক্যাপ সমানভাবে টাইট করে।',
      },
      {
        labelEn: '4. Shrink Sleeve & Coding',
        labelBn: '৪. শ্রিঙ্ক ও ডেট কোডিং',
        detailEn: 'Labeled bottles pass thermal shrink tunnel and ink/ribbon date coding.',
        detailBn: 'লেবেল শ্রিঙ্ক ও ডেট প্রিন্টিং শেষে প্যাকেজিংয়ের জন্য প্রস্তুত হয়।',
      },
    ],
  },
  {
    id: 'vid-cip-ss304-tanks',
    productSlug: 'ss304-double-jacket-mixer-pasteurizer',
    modelCode: '304-SS Jacket + CIP Line',
    category: 'cip-tanks',
    categoryLabelEn: 'CIP & 304-SS Tanks',
    categoryLabelBn: 'সিআইপি ও ৩০৪-এসএস ট্যাংক',
    titleEn: '304-SS Double Jacket Mixer, Pasteurizer & CIP Spray Cleaning',
    titleBn: '৩০৪-এসএস ডাবল জ্যাকেট মিক্সার, পাস্তুরাইজার ও সিআইপি সিস্টেম',
    subtitleEn: 'Hygienic beverage/dairy thermal processing paired with Acid-Alkali-Water CIP tank sanitation.',
    subtitleBn: 'জুস, দুধ ও কসমেটিক্স গরম ও মিক্সিং এবং ৩৬০° রোটারি সিআইপি ক্লিনিং প্রক্রিয়া।',
    duration: '01:35',
    capacityHighlight: '100–3000 L · Sanitary SS-304',
    posterImage: '/machines/ss304-double-jacket-mixer.webp',
    secondaryImages: [
      '/machines/ss304-single-mixer-tank.webp',
      '/machines/cip-chemical-tanks.webp',
      '/machines/milk-pasteurizing-line.webp',
    ],
    brochurePage: 9,
    steps: [
      {
        labelEn: '1. Batch Formulation & Agitation',
        labelBn: '১. ব্যাচ মিক্সিং',
        detailEn: 'High-torque top agitator blends juice, milk, syrup or cosmetic bases in 304-SS.',
        detailBn: '৩০৪-এসএস ট্যাংকে জুস, দুধ বা কসমেটিক্স বেস সমানভাবে মেশানো হয়।',
      },
      {
        labelEn: '2. Jacketed Thermal Heating',
        labelBn: '২. ডাবল জ্যাকেট হিটিং',
        detailEn: 'Double/triple thermal jacket heats gently without scorching ingredients.',
        detailBn: 'ডাবল জ্যাকেট হিটিং পণ্য না পুড়িয়েই সঠিক তাপমাত্রায় পাস্তুরাইজ করে।',
      },
      {
        labelEn: '3. Cooling & Chiller Transfer',
        labelBn: '৩. চিলার কুলিং',
        detailEn: 'Plate chiller cools product quickly before transfer to sterile holding tanks.',
        detailBn: 'চিলার ইউনিট পণ্য দ্রুত ঠান্ডা করে ফিলিং লাইনে পাঠায়।',
      },
      {
        labelEn: '4. 360° Rotary CIP Wash',
        labelBn: '৪. ৩৬০° সিআইপি ক্লিনিং',
        detailEn: 'Acid, alkali & hot water circulate through rotary spray balls for full sanitation.',
        detailBn: 'এসিড, অ্যালকালি ও গরম পানি রোটারি স্প্রে বলে প্রবাহিত হয়ে ট্যাংক জীবাণুমুক্ত করে।',
      },
    ],
  },
  {
    id: 'vid-sealing-flowwrap',
    productSlug: 'frd-1000w-horizontal-continuous-sealer',
    modelCode: 'FRD-1000w · Flow Wrap · Shrink',
    category: 'sealing-flowwrap',
    categoryLabelEn: 'Sealing & Flow-Wrap',
    categoryLabelBn: 'সিলিং ও ফ্লো-র‍্যাপ',
    titleEn: 'FRD-1000w Band Sealer, Flow Wrap & Thermal Shrink Finishing',
    titleBn: 'FRD-1000w ব্যান্ড সিলার, ফ্লো র‍্যাপ ও থার্মাল শ্রিঙ্ক ফিনিশিং',
    subtitleEn: 'Continuous pouch sealing with date printing, horizontal flow wrapping & multipack shrink tunnel.',
    subtitleBn: 'ডেট প্রিন্টিংসহ কন্টিনিউয়াস পাউচ সিলিং, ফ্লো র‍্যাপিং ও শ্রিঙ্ক টানেল অপারেশন।',
    duration: '01:18',
    capacityHighlight: 'Up to 150 pcs/min · 0–300°C',
    posterImage: '/machines/frd-1000w-sealer.webp',
    secondaryImages: [
      '/machines/flow-wrap-solid.webp',
      '/machines/thermal-shrink-tunnel.webp',
      '/machines/date-code-printer.webp',
    ],
    brochurePage: 24,
    steps: [
      {
        labelEn: '1. Pouch Feed & Alignment',
        labelBn: '১. পাউচ ফিডিং',
        detailEn: 'Filled foil or PP pouches enter guide rails for straight, wrinkle-free sealing.',
        detailBn: 'ভর্তি করা পাউচ কনভেয়র গাইড দিয়ে সোজাভাবে সিলিং জ-তে প্রবেশ করে।',
      },
      {
        labelEn: '2. Heated Teflon Band Seal',
        labelBn: '২. হিটেড ব্যান্ড সিলিং',
        detailEn: 'Copper heating blocks bond laminated films cleanly at adjustable belt speed.',
        detailBn: 'কপার হিটিং ব্লক ল্যামিনেটেড ফিল্ম শক্ত ও পরিষ্কারভাবে সিল করে।',
      },
      {
        labelEn: '3. Embossed Date Coding',
        labelBn: '৩. তারিখ প্রিন্টিং',
        detailEn: 'Steel embossing or ribbon thermal coder stamps MFG / EXP / MRP cleanly.',
        detailBn: 'সিলিংয়ের সাথেই এমএফজি, এক্সপায়ারি ও ব্যাচ নম্বর প্রিন্ট হয়ে যায়।',
      },
      {
        labelEn: '4. Shrink Bundle Output',
        labelBn: '৪. শ্রিঙ্ক বান্ডিল',
        detailEn: 'Cartons or bottle packs pass thermal shrink tunnel for retail-ready finish.',
        detailBn: 'থার্মাল শ্রিঙ্ক টানেলে বোতল বা কার্টন দৃঢ়ভাবে মোড়কজাত হয়।',
      },
    ],
  },
];
