import bottleShot from '../assets/bottle-shot.png';
import productShowcase from '../assets/product-showcase.jpg';
import about1 from '../assets/about-1.jpg';
import about2 from '../assets/about-2.jpg';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sizes: string[];
    image: string;
    rating: number;
    reviews: number;
}

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'SilkShine Classic Hair Oil',
        description: 'Our signature blend of almond and argan oil for daily nourishment.',
        price: 24.99,
        sizes: ['100ml', '250ml', '500ml'],
        image: bottleShot,
        rating: 4.8,
        reviews: 124
    },
    {
        id: 2,
        name: 'SilkShine Intense Repair',
        description: 'Deep conditioning formula for damaged and dry hair with Vitamin E.',
        price: 32.99,
        sizes: ['100ml', '200ml'],
        image: productShowcase,
        rating: 4.9,
        reviews: 89
    },
    {
        id: 3,
        name: 'SilkShine Growth Elixir',
        description: 'Enriched with castor oil and rosemary to stimulate hair growth.',
        price: 29.99,
        sizes: ['50ml', '100ml'],
        image: about1,
        rating: 4.7,
        reviews: 215
    },
    {
        id: 4,
        name: 'SilkShine Scalp Serum',
        description: 'Soothing formula for dry and itchy scalp relief.',
        price: 19.99,
        sizes: ['50ml'],
        image: about2,
        rating: 4.6,
        reviews: 56
    },
    {
        id: 5,
        name: 'SilkShine Men’s Beard Oil',
        description: 'Tame and soften your beard with our premium oil blend.',
        price: 22.50,
        sizes: ['30ml', '60ml'],
        image: productShowcase,
        rating: 4.8,
        reviews: 142
    },
    {
        id: 6,
        name: 'SilkShine Coconut Infusion',
        description: 'Pure coconut oil infused with jasmine for fragrance and shine.',
        price: 18.00,
        sizes: ['200ml', '400ml'],
        image: bottleShot,
        rating: 4.9,
        reviews: 312
    }
];

export const DELIVERY_CHARGES = 5.99;
