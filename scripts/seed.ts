/**
 * Seed script — populates MongoDB with initial SilkShine data.
 * Idempotent: skips collections that already have documents.
 * Run with: npm run seed
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

// ─── Schemas (inline — avoids Next.js module resolution issues in scripts) ────

const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: String, description: String, price: Number, sizes: [String],
    image: String, rating: Number, reviews: Number, category: String,
    type: String, stock: Number,
    status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
    quote: String, author: String, role: String, initials: String,
    rating: { type: Number, default: 5 },
    productId: { type: Number, default: null },
    isHomepage: { type: Boolean, default: false },
}, { timestamps: true });

const BilingualSchema = new mongoose.Schema({ en: String, ur: String }, { _id: false });

const SiteMetadataSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    about: {
        hero: { title: BilingualSchema, subtitle: BilingualSchema, image: String },
        story: { title: BilingualSchema, content: BilingualSchema },
        stats: [{ _id: false, label: BilingualSchema, value: String }],
    },
    benefits: [{ _id: false, title: BilingualSchema, content: BilingualSchema }],
    contact: {
        title: BilingualSchema, subtitle: BilingualSchema, operatingHours: String,
        info: [{ _id: false, title: BilingualSchema, value: BilingualSchema, icon: String }],
    },
    invoice: {
        sellerName: String, sellerLegalName: String, sellerAddress: String,
        sellerPhone: String, sellerNtn: String, sellerEmail: String,
        bankName: String, accountTitle: String, accountNo: String, paymentTerms: String,
    },
}, { timestamps: true });

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
    {
        id: 1, name: 'SilkShine Premium Grade Oil',
        description: 'Our signature blend of premium industrial and retail hair oil.',
        price: 82000, sizes: ['200L Drum', '50L Drum'], image: '/assets/bottle-shot.png',
        rating: 4.8, reviews: 124, category: 'Industrial', type: 'High Viscosity', stock: 45,
        status: 'In Stock',
    },
    {
        id: 2, name: 'SilkShine Intense Repair',
        description: 'Deep conditioning formula for damaged and dry hair with Vitamin E.',
        price: 15500, sizes: ['20L Can', '5L Can'], image: '/assets/product-showcase.jpg',
        rating: 4.9, reviews: 89, category: 'Retail', type: 'Medium Viscosity', stock: 120,
        status: 'In Stock',
    },
    {
        id: 3, name: 'SilkShine Growth Elixir',
        description: 'Enriched with castor oil and rosemary to stimulate hair growth.',
        price: 3500, sizes: ['5L Can', '1L Bottle'], image: '/assets/about-1.jpg',
        rating: 4.7, reviews: 215, category: 'Retail', type: 'Standard', stock: 2,
        status: 'Low Stock',
    },
    {
        id: 4, name: 'SilkShine Scalp Serum',
        description: 'Soothing formula for dry and itchy scalp relief.',
        price: 2800, sizes: ['1L Bottle', '500ml'], image: '/assets/about-2.jpg',
        rating: 4.6, reviews: 56, category: 'Retail', type: 'Standard', stock: 500,
        status: 'In Stock',
    },
    {
        id: 5, name: 'SilkShine Men\'s Beard Oil',
        description: 'Tame and soften your beard with our premium oil blend.',
        price: 1200, sizes: ['500ml', '200ml'], image: '/assets/product-showcase.jpg',
        rating: 4.8, reviews: 142, category: 'Retail', type: 'Standard', stock: 80,
        status: 'In Stock',
    },
    {
        id: 6, name: 'SilkShine Coconut Infusion',
        description: 'Pure coconut oil infused with jasmine for fragrance and shine.',
        price: 75000, sizes: ['200L Drum', '20L Can'], image: '/assets/bottle-shot.png',
        rating: 4.9, reviews: 312, category: 'Industrial', type: 'Heavy Duty', stock: 8,
        status: 'Low Stock',
    },
];

const REVIEWS = [
    { quote: "We switched our transport fleet to Silkshine. Viscosity retention reduced our maintenance costs by 15%.", author: "Ahmed Khan", role: "Fleet Manager, PakLogistics", initials: "AK", rating: 5, isHomepage: true },
    { quote: "The industrial drums arrived strictly on schedule. The 5-stage filtration clarity is evident immediately upon testing.", author: "Sana Habib", role: "Operations Lead, SteelTech", initials: "SH", rating: 5, isHomepage: true },
    { quote: "Our workshop only stocks Silkshine now. Customers notice the engine smoothness instantly.", author: "Mustafa Zain", role: "Owner, AutoCare Pro", initials: "MZ", rating: 5, isHomepage: true },
    { quote: "Outstanding friction resistance under continuous thermal stress. Silkshine is our top lubricant partner.", author: "Bilal Chaudhry", role: "Plant Head, Crescent Mills", initials: "BC", rating: 5, isHomepage: true },
    { quote: "Top tier refined quality. Fast delivery across regional hubs with clear electronic invoicing.", author: "Zubair Raza", role: "Supply Lead, Apex Freight", initials: "ZR", rating: 5, isHomepage: true },
    { quote: "Smooth operations across all our heavy agricultural generators. Pure quality base stock.", author: "Tariq Farooq", role: "Agri Farm Operations", initials: "TF", rating: 5, isHomepage: true },
];

const SITE_METADATA = {
    key: 'main',
    about: {
        hero: {
            title: { en: 'Our Heritage of Shine', ur: 'ہماری چمک کی میراث' },
            subtitle: { en: 'Generations of knowledge bottled for the modern world.', ur: 'جدید دنیا کے لیے نسلوں کا علم۔' },
            image: '/assets/hero-bg.jpg',
        },
        story: {
            title: { en: 'From Nature to You', ur: 'فطرت سے آپ تک' },
            content: {
                en: 'SilkShine began with a simple belief: nature holds the secret to perfect hair. Our oils are cold-pressed from seeds grown in our own organic gardens, ensuring that every drop preserves its vital nutrients. We believe in transparency, sustainability, and results you can see.',
                ur: 'سلک شائن کا آغاز ایک سادہ یقین کے ساتھ ہوا: فطرت کے پاس بہترین بالوں کا راز ہے۔ ہمارے تیل ہمارے اپنے نامیاتی باغات میں اگائے جانے والے بیجوں سے کولڈ پریس کیے جاتے ہیں۔ ہم شفافیت، پائیداری اور ایسے نتائج پر یقین رکھتے ہیں جو آپ دیکھ سکتے ہیں۔',
            },
        },
        stats: [
            { label: { en: 'Years of Experience', ur: 'سالوں کا تجربہ' }, value: '50+' },
            { label: { en: 'Organic Farms', ur: 'نامیاتی فارمز' }, value: '12' },
            { label: { en: 'Happy Customers', ur: 'خوش گاہک' }, value: '10k+' },
        ],
    },
    benefits: [
        { title: { en: 'Stimulates Hair Growth', ur: 'بالوں کی تیزی سے بڑھوتری' }, content: { en: 'Revives weak follicles and encourages rapid, natural hair growth.', ur: 'کمزور جڑوں کو زندہ کر کے بالوں کی قدرتی نشوونما تیز کرتا ہے۔' } },
        { title: { en: 'Prevents Hair Fall & Breakage', ur: 'بال جھڑنے اور ٹوٹنے سے تحفظ' }, content: { en: 'Strengthens roots from within and reduces split ends and hair fall.', ur: 'جڑوں کو اندر سے مضبوط بناتا ہے، دو منہ والے بال ختم کرتا ہے۔' } },
        { title: { en: 'Eliminates Dandruff & Itchiness', ur: 'خشکی اور خارش کا خاتمہ' }, content: { en: 'Soothes dry scalp, removes flakes, and maintains a clean, balanced scalp.', ur: 'دماغ اور سر کو سکون دیتا ہے، خشکی دور کرتا ہے اور تروتازہ رکھتا ہے۔' } },
        { title: { en: 'Deep Nourishment', ur: 'گہری غذائیت' }, content: { en: 'Penetrates deeply to provide essential vitamins and nutrients (E, B5 & herbal extracts).', ur: 'وٹامن ای، بی5 اور جڑی بوٹیوں کے قدرتی اجزاء جڑوں تک پہنچ کر بالوں کو توانائی بخشتے ہیں۔' } },
        { title: { en: 'Improves Hair Texture', ur: 'بالوں کی ساخت بہتر بنائے' }, content: { en: 'Leaves hair silky, soft, and smooth with natural shine and bounce.', ur: 'بالوں کو نرم، ملائم، چمکدار اور زندگی سے بھرپور بناتا ہے۔' } },
        { title: { en: 'Prevents Premature Graying', ur: 'وقت سے پہلے سفید ہونے سے بچاؤ' }, content: { en: 'Helps delay early whitening of hair with consistent use.', ur: 'مسلسل استعمال سے قبل از وقت سفید ہونے والے بالوں کو روکتا ہے۔' } },
        { title: { en: 'Repairs Damaged Hair', ur: 'خراب بالوں کی مرمت' }, content: { en: 'Restores strength and moisture to chemically treated, dull, or sun-damaged hair.', ur: 'کیمیائی استعمال، سورج یا آلودگی سے متاثرہ بالوں کو بحال کرتا ہے۔' } },
    ],
    contact: {
        title: { en: 'Get in Touch', ur: 'رابطہ کریں' },
        subtitle: { en: 'We love hearing from our community.', ur: 'ہمیں اپنی کمیونٹی سے سننا پسند ہے۔' },
        operatingHours: 'Mon - Sat 9:00 AM to 6:00 PM',
        info: [
            { title: { en: 'Visit Us', ur: 'ہم سے ملیں' }, value: { en: '123 Organic Lane, Green Valley, CA', ur: '123 آرگینک لین، گرین ویلی' }, icon: 'MapPin' },
            { title: { en: 'Email Us', ur: 'ہمیں ای میل کریں' }, value: { en: 'hello@silkshine.com', ur: 'hello@silkshine.com' }, icon: 'Mail' },
            { title: { en: 'Call Us', ur: 'ہمیں کال کریں' }, value: { en: '+1 (555) 123-4567', ur: '+1 (555) 123-4567' }, icon: 'Phone' },
        ],
    },
    invoice: {
        sellerName: 'SilkShine',
        sellerLegalName: 'SilkShine Pvt Ltd',
        sellerAddress: '123 Industrial Estate, Phase II, Lahore, Pakistan 54000',
        sellerPhone: '+92 300 1234567',
        sellerNtn: '1234567-8 / 17-00-9821-3',
        sellerEmail: 'billing@silkshine.pk',
        bankName: 'Meezan Bank Limited, Karachi',
        accountTitle: 'SilkShine Pvt Ltd',
        accountNo: 'PK36MEZN0001234567890123',
        paymentTerms: 'Due within 30 days via Online IBFT or Crossed Cheque.',
    },
};

// ─── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected.\n');

    const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
    const SiteMetadataModel = mongoose.models.SiteMetadata || mongoose.model('SiteMetadata', SiteMetadataSchema);

    // Products
    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
        await ProductModel.insertMany(PRODUCTS);
        console.log(`✅ Seeded ${PRODUCTS.length} products.`);
    } else {
        console.log(`⏭️  Products already seeded (${productCount} found). Skipping.`);
    }

    // Reviews
    const reviewCount = await ReviewModel.countDocuments();
    if (reviewCount === 0) {
        await ReviewModel.insertMany(REVIEWS);
        console.log(`✅ Seeded ${REVIEWS.length} reviews.`);
    } else {
        console.log(`⏭️  Reviews already seeded (${reviewCount} found). Skipping.`);
    }

    // Site Metadata (upsert singleton)
    const existingMeta = await SiteMetadataModel.findOne({ key: 'main' });
    if (!existingMeta) {
        await SiteMetadataModel.create(SITE_METADATA);
        console.log('✅ Seeded site metadata.');
    } else {
        console.log('⏭️  Site metadata already exists. Skipping.');
    }

    console.log('\n🎉 Seed complete!');
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
