import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { slug: 'food-beverage', nameEn: 'Food & Beverage Packaging', nameBn: 'খাদ্য ও পানীয় প্যাকেজিং', descriptionEn: 'Complete solutions for food packaging', descriptionBn: 'খাদ্য প্যাকেজিং এর সম্পূর্ণ সমাধান' },
  { slug: 'health-pharma', nameEn: 'Health & Pharma Packaging', nameBn: 'স্বাস্থ্য ও ফার্মা প্যাকেজিং', descriptionEn: 'Pharmaceutical grade packaging', descriptionBn: 'ফার্মাসিউটিক্যাল গ্রেড প্যাকেজিং' },
  { slug: 'cosmetics-toiletries', nameEn: 'Cosmetics & Toiletries', nameBn: 'কসমেটিক্স ও টয়লেট্রিজ', descriptionEn: 'Cosmetics product packaging', descriptionBn: 'কসমেটিক্স পণ্য প্যাকেজিং' },
  { slug: 'industrial', nameEn: 'Industrial Packaging', nameBn: 'ইন্ডাস্ট্রিয়াল প্যাকেজিং', descriptionEn: 'Heavy duty industrial solutions', descriptionBn: 'ভারী শিল্প প্যাকেজিং' },
];

const industries = [
  { slug: 'food-beverage', nameEn: 'Food & Beverage', nameBn: 'খাদ্য ও পানীয়', descriptionEn: 'Food processing and packaging', descriptionBn: 'খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং' },
  { slug: 'pharmaceutical', nameEn: 'Pharmaceutical', nameBn: 'ফার্মাসিউটিক্যাল', descriptionEn: 'Pharma product packaging', descriptionBn: 'ফার্মা পণ্য প্যাকেজিং' },
  { slug: 'cosmetics', nameEn: 'Cosmetics & Toiletries', nameBn: 'কসমেটিক্স ও টয়লেট্রিজ', descriptionEn: 'Cosmetics packaging', descriptionBn: 'কসমেটিক্স প্যাকেজিং' },
  { slug: 'industrial', nameEn: 'Industrial & Other', nameBn: 'ইন্ডাস্ট্রিয়াল ও অন্যান্য', descriptionEn: 'Industrial packaging', descriptionBn: 'শিল্প প্যাকেজিং' },
];

const partners = [
  { name: 'BSMTI', logoUrl: '/images/partners/bsmti.png', linkUrl: '#' },
  { name: 'SME Foundation', logoUrl: '/images/partners/sme.png', linkUrl: '#' },
  { name: 'Industry Partners', logoUrl: '/images/partners/industry.png', linkUrl: '#' },
  { name: 'Exporters', logoUrl: '/images/partners/exporters.png', linkUrl: '#' },
];

async function main() {
  // Create default admin user
  const adminEmail = 'admin@autopacbd.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await hash('autopac123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'AutoPac Admin',
        role: 'SUPER_ADMIN',
      }
    });
    console.log(`Created default admin: ${adminEmail}`);
  }

  for (let i = 0; i < categories.length; i++) {
    await prisma.category.upsert({
      where: { slug: categories[i].slug },
      update: {},
      create: { ...categories[i], sortOrder: i },
    });
  }

  const foodCat = await prisma.category.findFirst({ where: { slug: 'food-beverage' } });
  
  if (foodCat) {
    const products = [
      {
        slug: 'granules-packing-machine',
        nameEn: 'Automatic Granules Packing Machine',
        nameBn: 'অটোমেটিক গ্রানুলস প্যাকিং মেশিন',
        shortDescEn: 'High-speed vertical form-fill-seal machine for granular products',
        shortDescBn: 'গ্রানুলার পণ্যের জন্য উচ্চ গতির ভার্টিকাল ফর্ম-ফিল-সিল মেশিন',
        fullDescEn: 'The Automatic Granules Packing Machine is an industrial-grade solution designed to pack free-flowing products like sugar, rice, dal, tea, and spices. It features precise volumetric cup fillers or multi-head weighers to ensure exact measurements. Built with high-quality stainless steel, it guarantees hygiene and durability. The machine is fully automated with a PLC control system, touch screen interface, and stepper motor-driven film pulling mechanism for flawless pouch sealing and cutting.',
        fullDescBn: 'অটোমেটিক গ্রানুলস প্যাকিং মেশিনটি চিনি, চাল, ডাল, চা এবং মসলার মতো পণ্য প্যাক করার জন্য ডিজাইন করা হয়েছে। এটিতে সঠিক পরিমাপ নিশ্চিত করার জন্য ভলিউমেট্রিক কাপ ফিলার রয়েছে। স্টেইনলেস স্টিল দিয়ে তৈরি, এটি স্বাস্থ্যবিধি এবং স্থায়িত্ব নিশ্চিত করে। পিএলসি কন্ট্রোল সিস্টেম এবং টাচ স্ক্রিন ইন্টারফেসের সাথে সম্পূর্ণ স্বয়ংক্রিয়।',
        images: JSON.stringify([
          '/images/slider1.png', 
          '/images/slider2.png'
        ]),
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Using an embed link format
        specs: JSON.stringify([
          { keyEn: 'Model', keyBn: 'মডেল', value: 'AP-G500' },
          { keyEn: 'Power Supply', keyBn: 'পাওয়ার সাপ্লাই', value: '220V/380V', unit: '50Hz/60Hz' },
          { keyEn: 'Packing Speed', keyBn: 'প্যাকিং গতি', value: '30-80', unit: 'bags/min' },
          { keyEn: 'Filling Range', keyBn: 'ফিলিং রেঞ্জ', value: '10g - 1000g' },
          { keyEn: 'Machine Weight', keyBn: 'মেশিনের ওজন', value: '350', unit: 'kg' },
        ]),
        packableIds: JSON.stringify(['sugar', 'rice', 'dal', 'tea', 'spices', 'salt']),
        featured: true,
        sortOrder: 1,
      },
      {
        slug: 'liquid-filling-machine',
        nameEn: 'Automatic Liquid Filling Machine',
        nameBn: 'অটোমেটিক লিকুইড ফিলিং মেশিন',
        shortDescEn: 'Precision piston-type liquid and paste filling machine',
        shortDescBn: 'নির্ভুল পিস্টন টাইপ লিকুইড এবং পেস্ট ফিলিং মেশিন',
        fullDescEn: 'Our Automatic Liquid Filling Machine is perfect for packaging water, oil, juice, honey, shampoo, and other liquid or semi-liquid products. It utilizes advanced pneumatic components and a stainless steel body to meet food and pharmaceutical safety standards. Easy to adjust filling volumes and speeds.',
        fullDescBn: 'আমাদের লিকুইড ফিলিং মেশিন পানি, তেল, জুস, মধু, শ্যাম্পু ইত্যাদি প্যাক করার জন্য উপযুক্ত। এটি উন্নত নিউমেটিক প্রযুক্তি এবং স্টেইনলেস স্টিল বডি ব্যবহার করে তৈরি।',
        images: JSON.stringify([
          '/images/slider3.png'
        ]),
        videoUrl: null,
        specs: JSON.stringify([
          { keyEn: 'Model', keyBn: 'মডেল', value: 'AP-L200' },
          { keyEn: 'Filling Speed', keyBn: 'ফিলিং গতি', value: '20-50', unit: 'bottles/min' },
          { keyEn: 'Filling Range', keyBn: 'ফিলিং রেঞ্জ', value: '50ml - 1000ml' },
        ]),
        packableIds: JSON.stringify(['water', 'oil', 'juice', 'shampoo', 'honey']),
        featured: true,
        sortOrder: 2,
      },
      {
        slug: 'powder-packing-machine',
        nameEn: 'Auger Powder Packing Machine',
        nameBn: 'অগার পাউডার প্যাকিং মেশিন',
        shortDescEn: 'Dust-free powder packaging with auger screw filler',
        shortDescBn: 'অগার স্ক্রু ফিলার সহ ধুলোমুক্ত পাউডার প্যাকেজিং',
        fullDescEn: 'Specially engineered for non-free-flowing powders such as flour, milk powder, turmeric, and chemical powders. The servo-motor driven auger ensures highly accurate dosing and minimizes powder dust in the working environment.',
        fullDescBn: 'আটা, গুঁড়ো দুধ, হলুদ এবং রাসায়নিক পাউডারের জন্য বিশেষভাবে তৈরি। সার্ভো মোটর ড্রাইভেন অগার সঠিক ওজন নিশ্চিত করে।',
        images: JSON.stringify([
          '/images/slider2.png'
        ]),
        videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // Standard youtube link, will be parsed in UI
        specs: JSON.stringify([
          { keyEn: 'Model', keyBn: 'মডেল', value: 'AP-P300' },
          { keyEn: 'Packing Speed', keyBn: 'প্যাকিং গতি', value: '25-60', unit: 'bags/min' },
          { keyEn: 'Hopper Capacity', keyBn: 'হপারের ধারণক্ষমতা', value: '50', unit: 'Liters' },
        ]),
        packableIds: JSON.stringify(['flour', 'milk powder', 'spices powder', 'chemical powder']),
        featured: true,
        sortOrder: 3,
      }
    ];

    for (const prod of products) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: { ...prod, categoryId: foodCat.id },
        create: { ...prod, categoryId: foodCat.id },
      });
    }
  }

  const heroSlides = [
    { titleEn: 'World Class Food Processing and Packaging Machinery', titleBn: 'বিশ্বমানের খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারি', imageUrl: '/images/slider1.png' },
    { titleEn: 'Cosmetics, Unani product processing and packaging solution', titleBn: 'কসমেটিক্স, ইউনানী পণ্য প্রক্রিয়াকরণ ও প্যাকেজিং সমাধান', imageUrl: '/images/slider2.png' },
    { titleEn: 'Water treatment plant & Filling and capping machine', titleBn: 'ওয়াটার ট্রিটমেন্ট প্ল্যান্ট ও ফিলিং এবং ক্যাপিং মেশিন', imageUrl: '/images/slider3.png' },
  ];
  for (let i = 0; i < heroSlides.length; i++) {
    await prisma.heroSlide.create({
      data: { ...heroSlides[i], sortOrder: i, isActive: true },
    }).catch(() => {});
  }

  const existing = await prisma.companyProfile.findFirst();
  if (!existing) {
    await prisma.companyProfile.create({
      data: {
        logoUrl: '/images/logo.png',
        taglineEn: 'World Class Food Processing and Packaging Machinery',
        taglineBn: 'বিশ্বমানের খাদ্য প্রক্রিয়াকরণ ও প্যাকেজিং মেশিনারি',
        address: '128/3 Kawran Bazar, Dhaka 1215, Bangladesh',
        phone: '01631769707, 01818496642',
        email: 'autopacbd@gmail.com',
        whatsapp: '8801818496642',
        website: 'www.autopacbd.com',
      },
    });
  }

  for (let i = 0; i < industries.length; i++) {
    await prisma.industry.upsert({
      where: { slug: industries[i].slug },
      update: {},
      create: { ...industries[i], sortOrder: i },
    });
  }

  const existingPartners = await prisma.trustedPartner.count();
  if (existingPartners === 0) {
    for (let i = 0; i < partners.length; i++) {
      await prisma.trustedPartner.create({
        data: { ...partners[i], logoUrl: partners[i].logoUrl || '', sortOrder: i },
      });
    }
  }
}

main()
  .then(() => console.log('Seed done'))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
