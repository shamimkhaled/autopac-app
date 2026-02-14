import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { slug: 'food-beverage', nameEn: 'Food & Beverage Packaging', nameBn: 'খাদ্য ও পানীয় প্যাকেজিং', descriptionEn: 'Complete solutions', descriptionBn: 'সম্পূর্ণ সমাধান' },
  { slug: 'health-pharma', nameEn: 'Health & Pharma Packaging', nameBn: 'স্বাস্থ্য ও ফার্মা প্যাকেজিং', descriptionEn: 'Pharma packaging', descriptionBn: 'ফার্মা প্যাকেজিং' },
  { slug: 'cosmetics-toiletries', nameEn: 'Cosmetics & Toiletries', nameBn: 'কসমেটিক্স ও টয়লেট্রিজ', descriptionEn: 'Cosmetics packaging', descriptionBn: 'কসমেটিক্স প্যাকেজিং' },
  { slug: 'industrial', nameEn: 'Industrial Packaging', nameBn: 'ইন্ডাস্ট্রিয়াল প্যাকেজিং', descriptionEn: 'Industrial solutions', descriptionBn: 'শিল্প সমাধান' },
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
  for (let i = 0; i < categories.length; i++) {
    await prisma.category.upsert({
      where: { slug: categories[i].slug },
      update: {},
      create: { ...categories[i], sortOrder: i },
    });
  }

  const foodCat = await prisma.category.findFirst({ where: { slug: 'food-beverage' } });
  if (foodCat) {
    await prisma.product.upsert({
      where: { slug: 'granules-packing-machine' },
      update: {},
      create: {
        slug: 'granules-packing-machine',
        categoryId: foodCat.id,
        nameEn: 'Granules Packing Machine',
        nameBn: 'গ্রানুলার প্যাকিং মেশিন',
        shortDescEn: 'Vertical form-fill-seal for granular products',
        shortDescBn: 'গ্রানুলার পণ্যের জন্য ভার্টিকাল ফর্ম-ফিল-সিল',
        fullDescEn: 'Fully automatic vertical form-fill-seal machine for packing dal, rice, spices, tea.',
        fullDescBn: 'ডাল, চাল, মসলা, চা প্যাক করার জন্য সম্পূর্ণ স্বয়ংক্রিয় মেশিন।',
        images: JSON.stringify(['/images/slider1.png']),
        specs: JSON.stringify([
          { keyEn: 'Voltage', keyBn: 'ভোল্টেজ', value: '220V/380V', unit: 'AC' },
          { keyEn: 'Speed', keyBn: 'গতি', value: '30-60', unit: 'bags/min' },
        ]),
        packableIds: JSON.stringify(['atta', 'dal', 'rice', 'tea', 'spices']),
        featured: true,
        sortOrder: 0,
      },
    });
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
