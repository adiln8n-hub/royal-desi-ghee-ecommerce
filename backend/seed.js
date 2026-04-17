require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/royalghee';

// ─── Seed Admin ───────────────────────────────────────────────────────────────
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'adiln8n@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Adil90475',
        role: 'admin',
      });
      await admin.save(); // password is hashed by pre-save hook
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('ℹ️  Admin already exists, skipping...');
    }
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
  }
};

// ─── Seed Categories ──────────────────────────────────────────────────────────
const seedCategories = async () => {
  const categories = [
    {
      nameEn: 'Desi Ghee',
      nameUr: 'دیسی گھی',
      slug: 'desi-ghee',
      description: 'Pure traditional clarified butter',
      image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&h=400&fit=crop&q=80',
    },
    {
      nameEn: 'Sohan Halwa',
      nameUr: 'سوہن حلوہ',
      slug: 'sohan-halwa',
      description: 'Traditional Pakistani Sohan Halwa',
      image: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&h=400&fit=crop&q=80',
    },
    {
      nameEn: 'Mithai',
      nameUr: 'مٹھائی',
      slug: 'mithai',
      description: 'Traditional South Asian sweets',
      image: 'https://images.unsplash.com/photo-1515238152791-3bef4cfb0d51?w=600&h=400&fit=crop&q=80',
    },
    {
      nameEn: 'Seasonal Specials',
      nameUr: 'موسمی خاص',
      slug: 'seasonal',
      description: 'Special seasonal offerings',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&q=80',
    },
  ];

  for (const cat of categories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
  }
  console.log('✅ Categories seeded');
  return await Category.find({});
};

// ─── Seed Products ────────────────────────────────────────────────────────────
const seedProducts = async (cats) => {
  const catMap = {};
  cats.forEach(c => { catMap[c.slug] = c._id; });

  const existingCount = await Product.countDocuments();
  if (existingCount > 0) {
    console.log('ℹ️  Products already exist, skipping...');
    return;
  }

  const products = [
    {
      titleEn: 'Pure Desi Ghee Premium',
      titleUr: 'خالص دیسی گھی پریمیم',
      descriptionEn: 'Our flagship pure desi ghee made from the finest cow milk using traditional bilona method. Rich in flavor, golden in color, and perfect for cooking and religious rituals.',
      descriptionUr: 'ہمارا بہترین خالص دیسی گھی جو روایتی بلونا طریقے سے گائے کے دودھ سے بنایا جاتا ہے۔ ذائقے میں بھرپور، رنگ میں سنہری، اور پکانے کے لیے بہترین۔',
      price: 2500,
      discountPrice: 2200,
      stock: 50,
      category: catMap['desi-ghee'],
      images: ['https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&h=600&fit=crop&q=80'],
      weightOptions: [
        { label: '500g', price: 1300 },
        { label: '1 kg', price: 2200 },
        { label: '5 kg', price: 10500 },
      ],
      isFeatured: true,
      tags: ['ghee', 'pure', 'premium', 'desi'],
    },
    {
      titleEn: 'Buffalo Desi Ghee',
      titleUr: 'بھینس کا دیسی گھی',
      descriptionEn: 'Premium buffalo milk ghee with a rich, creamy texture and authentic traditional taste. Perfect for parathas and biryanis.',
      descriptionUr: 'بھینس کے دودھ سے بنا خالص گھی جو کریمی ساخت اور روایتی ذائقے سے بھرپور ہے۔ پراٹھوں اور بریانیوں کے لیے بہترین۔',
      price: 2800,
      discountPrice: null,
      stock: 35,
      category: catMap['desi-ghee'],
      images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=600&fit=crop&q=80'],
      weightOptions: [
        { label: '500g', price: 1500 },
        { label: '1 kg', price: 2800 },
        { label: '5 kg', price: 13000 },
      ],
      isFeatured: true,
      tags: ['ghee', 'buffalo', 'desi'],
    },
    {
      titleEn: 'Original Multan Sohan Halwa',
      titleUr: 'اصل ملتانی سوہن حلوہ',
      descriptionEn: 'The legendary Multani Sohan Halwa made with pure ghee, wheat starch, and finest nuts. A royal treat from the kitchen of Punjab.',
      descriptionUr: 'مشہور ملتانی سوہن حلوہ جو خالص گھی، گندم نشاستے اور بہترین خشک میووں سے بنایا جاتا ہے۔ پنجاب کے دسترخوان کی شاہی دعوت۔',
      price: 1800,
      discountPrice: 1500,
      stock: 40,
      category: catMap['sohan-halwa'],
      images: ['https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&h=600&fit=crop&q=80'],
      weightOptions: [
        { label: '250g', price: 500 },
        { label: '500g', price: 900 },
        { label: '1 kg', price: 1500 },
      ],
      isFeatured: true,
      tags: ['halwa', 'sohan', 'multani', 'sweets'],
    },
    {
      titleEn: 'Pista Sohan Halwa',
      titleUr: 'پستہ سوہن حلوہ',
      descriptionEn: 'Premium Sohan Halwa loaded with fresh pistachios and pure desi ghee. A perfect gift for special occasions and Eid.',
      descriptionUr: 'تازہ پستے اور خالص دیسی گھی سے بھرپور پریمیم سوہن حلوہ۔ خاص مواقع اور عید کے لیے بہترین تحفہ۔',
      price: 2200,
      discountPrice: null,
      stock: 25,
      category: catMap['sohan-halwa'],
      images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop&q=80'],
      weightOptions: [
        { label: '250g', price: 650 },
        { label: '500g', price: 1200 },
        { label: '1 kg', price: 2200 },
      ],
      isFeatured: false,
      tags: ['halwa', 'pista', 'premium'],
    },
    {
      titleEn: 'Gulab Jamun (Tin Box)',
      titleUr: 'گلاب جامن (ٹن باکس)',
      descriptionEn: 'Soft, melt-in-mouth gulab jamuns soaked in saffron-infused sugar syrup. Made with khoya and pure desi ghee.',
      descriptionUr: 'نرم، منہ میں گھل جانے والے گلاب جامن جو زعفران کی چاشنی میں بھیگے ہوئے ہیں۔ کھویا اور خالص دیسی گھی سے بنے۔',
      price: 850,
      discountPrice: 750,
      stock: 60,
      category: catMap['mithai'],
      images: ['https://images.unsplash.com/photo-1515238152791-3bef4cfb0d51?w=600&h=600&fit=crop&q=80'],
      weightOptions: [
        { label: '500g', price: 750 },
        { label: '1 kg', price: 1400 },
      ],
      isFeatured: true,
      tags: ['mithai', 'gulab jamun', 'sweets'],
    },
    {
      titleEn: 'Barfi Assorted Box',
      titleUr: 'مکس برفی باکس',
      descriptionEn: 'A royal assortment of Kaju Barfi, Pista Barfi, and Coconut Barfi. The perfect mithai gift box for any celebration.',
      descriptionUr: 'کاجو برفی، پستہ برفی اور ناریل برفی کا شاہی مجموعہ۔ کسی بھی تقریب کے لیے مٹھائی کا بہترین تحفہ باکس۔',
      price: 1500,
      discountPrice: null,
      stock: 30,
      category: catMap['mithai'],
      images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop&q=80'],
      weightOptions: [
        { label: '250g', price: 450 },
        { label: '500g', price: 850 },
        { label: '1 kg', price: 1500 },
      ],
      isFeatured: true,
      tags: ['barfi', 'mithai', 'assorted'],
    },
    {
      titleEn: 'Eid Special Gift Pack',
      titleUr: 'عید خصوصی گفٹ پیک',
      descriptionEn: 'A premium Eid gift pack with desi ghee, sohan halwa, and mixed mithai in a royal gold gift box.',
      descriptionUr: 'دیسی گھی، سوہن حلوہ اور مکس مٹھائی کے ساتھ شاہی سنہری گفٹ باکس میں پریمیم عید گفٹ پیک۔',
      price: 3500,
      discountPrice: 3000,
      stock: 20,
      category: catMap['seasonal'],
      images: ['https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=600&h=600&fit=crop&q=80'],
      weightOptions: [
        { label: 'Standard Box', price: 3000 },
        { label: 'Premium Box', price: 4500 },
      ],
      isFeatured: true,
      tags: ['eid', 'gift', 'special', 'seasonal'],
    },
    {
      titleEn: 'Gajar Ka Halwa (Carrot Halwa)',
      titleUr: 'گاجر کا حلوہ',
      descriptionEn: 'Traditional Pakistani gajar halwa made with fresh carrots, pure desi ghee, full-cream milk, and fragrant cardamom.',
      descriptionUr: 'تازہ گاجروں، خالص دیسی گھی، فل کریم دودھ اور خوشبودار الائچی سے بنا روایتی پاکستانی گاجر کا حلوہ۔',
      price: 1200,
      discountPrice: null,
      stock: 45,
      category: catMap['seasonal'],
      images: ['https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=600&fit=crop&q=80'],
      weightOptions: [
        { label: '500g', price: 650 },
        { label: '1 kg', price: 1200 },
      ],
      isFeatured: false,
      tags: ['halwa', 'gajar', 'carrot', 'seasonal'],
    },
  ];

  await Product.insertMany(products);
  console.log(`✅ ${products.length} products seeded`);
};

// ─── Exported functions for use in server.js ──────────────────────────────────
const seedInitialData = async () => {
  const cats = await seedCategories();
  await seedProducts(cats);
};

module.exports = { seedAdmin, seedInitialData };

// ─── Standalone runner ────────────────────────────────────────────────────────
if (require.main === module) {
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log('✅ Connected to MongoDB');
      await seedAdmin();
      await seedInitialData();
      console.log('🎉 Seeding complete!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      process.exit(1);
    });
}
