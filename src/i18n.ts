
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { ABOUT_DATA, CONTACT_DATA } from './constants/content';

// Translation Resources
const resources = {
    en: {
        translation: {
            home: 'Home',
            products: 'Products',
            story: 'Our Story',
            contact: 'Contact',
            heroTitle: 'Nature’s Secret for Radiant Shine',
            heroSubtitle: 'Discover the power of 100% organic oils for stronger, healthier hair.',
            shopCollection: 'Shop Collection',
            shopNow: 'Shop Now',
            organic: '100% Organic',
            labTested: 'Lab Tested',
            fastDelivery: 'Fast Delivery',
            bestSellers: 'Best Sellers',
            viewDetails: 'View Details',
            viewAllProducts: 'View All Products',
            addToCart: 'Add to Cart',
            reviews: 'Reviews',
            yourCart: 'Your Cart',
            emptyCart: 'Your cart is empty',
            browseProducts: 'Browse Products',
            delivery: 'Delivery Details',
            fullName: 'Full Name',
            address: 'Address',
            city: 'City',
            phone: 'Phone Number',
            paymentMethod: 'Payment Method',
            card: 'Credit/Debit Card',
            cashOnDelivery: 'Cash on Delivery',
            summary: 'Order Summary',
            subtotal: 'Subtotal',
            discount: 'Discount',
            total: 'Total',
            couponCode: 'Coupon Code',
            apply: 'Apply',
            placeOrder: 'Place Order',
            quickLinks: 'Quick Links',
            connect: 'Connect With Us',
            copyright: 'All rights reserved.',
            directOrganic: 'Direct from organic farms',
            certifiedPurity: 'Certified Purity & Safety',
            freeShipping: 'Free shipping over $50',
            bestNourishment: '"Nourishment that speaks for itself."',
            searchProducts: 'Search products...',
            noProductsFound: 'No products found for',

            // Dynamic Data Keys (mapped for convenience)
            aboutTitle: ABOUT_DATA.hero.title.en,
            aboutSubtitle: ABOUT_DATA.hero.subtitle.en,
            aboutStoryTitle: ABOUT_DATA.story.title.en,
            aboutStoryContent: ABOUT_DATA.story.content.en,
            contactTitle: CONTACT_DATA.title.en,
            contactSubtitle: CONTACT_DATA.subtitle.en
        }
    },
    ur: {
        translation: {
            home: 'ہوم',
            products: 'مصنوعات',
            story: 'ہماری کہانی',
            contact: 'رابطہ',
            heroTitle: 'چمکدار بالوں کے لیے قدرت کا راز',
            heroSubtitle: 'مضبوط اور صحت مند بالوں کے لیے 100٪ نامیاتی تیل کی طاقت دریافت کریں۔',
            shopCollection: 'کولیکشن دیکھیں',
            shopNow: 'ابھی خریدیں',
            organic: '100٪ نامیاتی',
            labTested: 'لیب ٹیسٹ شدہ',
            fastDelivery: 'تیز ترسیل',
            bestSellers: 'سب سے زیادہ فروخت ہونے والے',
            viewDetails: 'تفصیلات دیکھیں',
            viewAllProducts: 'تمام مصنوعات دیکھیں',
            addToCart: 'ٹوکری میں شامل کریں',
            reviews: 'تبصرے',
            yourCart: 'آپ کی ٹوکری',
            emptyCart: 'آپ کی ٹوکری خالی ہے',
            browseProducts: 'مصنوعات دیکھیں',
            delivery: 'ترسیل کی تفصیلات',
            fullName: 'پورا نام',
            address: 'پتہ',
            city: 'شہر',
            phone: 'فون نمبر',
            paymentMethod: 'ادائیگی کا طریقہ',
            card: 'کریڈٹ / ڈیبٹ کارڈ',
            cashOnDelivery: 'کیش آن ڈیلیوری',
            summary: 'آرڈر کا خلاصہ',
            subtotal: 'سب ٹوٹل',
            discount: 'رعایت',
            total: 'کل',
            couponCode: 'کوپن کوڈ',
            apply: 'اطلاق کریں',
            placeOrder: 'آرڈر کریں',
            quickLinks: 'کوئیک لنکس',
            connect: 'ہم سے رابطہ کریں',
            copyright: 'جملہ حقوق محفوظ ہیں۔',
            directOrganic: 'براہ راست آرگینک فارمز سے',
            certifiedPurity: 'مصدقہ پاکیزگی اور حفاظت',
            freeShipping: '$50 سے زیادہ پر مفت ترسیل',
            bestNourishment: '"ایسی غذا جو خود بولتی ہے۔"',
            searchProducts: 'مصنوعات تلاش کریں...',
            noProductsFound: 'کے لیے کوئی مصنوعات نہیں ملیں',

            // Dynamic Data Keys
            aboutTitle: ABOUT_DATA.hero.title.ur,
            aboutSubtitle: ABOUT_DATA.hero.subtitle.ur,
            aboutStoryTitle: ABOUT_DATA.story.title.ur,
            aboutStoryContent: ABOUT_DATA.story.content.ur,
            contactTitle: CONTACT_DATA.title.ur,
            contactSubtitle: CONTACT_DATA.subtitle.ur
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

// Handle Direction Change
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;
