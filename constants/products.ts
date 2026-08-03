export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sizes: string[];
    image: string;
    rating: number;
    reviews: number;
    category: string;
}

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'SilkShine Premium Grade Oil',
        description: 'Our signature blend of premium industrial and retail hair oil.',
        price: 82000,
        sizes: ['200L Drum', '50L Drum'],
        image: '/assets/bottle-shot.png',
        rating: 4.8,
        category: "none",
        reviews: 124
    },
    {
        id: 2,
        name: 'SilkShine Intense Repair',
        description: 'Deep conditioning formula for damaged and dry hair with Vitamin E.',
        price: 15500,
        sizes: ['20L Can', '5L Can'],
        image: '/assets/product-showcase.jpg',
        rating: 4.9,
        category: "none",
        reviews: 89
    },
    {
        id: 3,
        name: 'SilkShine Growth Elixir',
        description: 'Enriched with castor oil and rosemary to stimulate hair growth.',
        price: 3500,
        sizes: ['5L Can', '1L Bottle'],
        image: '/assets/about-1.jpg',
        rating: 4.7,
        category: "none",
        reviews: 215
    },
    {
        id: 4,
        name: 'SilkShine Scalp Serum',
        description: 'Soothing formula for dry and itchy scalp relief.',
        price: 2800,
        sizes: ['1L Bottle', '500ml'],
        image: '/assets/about-2.jpg',
        rating: 4.6,
        category: "none",
        reviews: 56
    },
    {
        id: 5,
        name: 'SilkShine Men\u2019s Beard Oil',
        description: 'Tame and soften your beard with our premium oil blend.',
        price: 1200,
        sizes: ['500ml', '200ml'],
        image: '/assets/product-showcase.jpg',
        rating: 4.8,
        category: "none",
        reviews: 142
    },
    {
        id: 6,
        name: 'SilkShine Coconut Infusion',
        description: 'Pure coconut oil infused with jasmine for fragrance and shine.',
        price: 75000,
        sizes: ['200L Drum', '20L Can'],
        image: '/assets/bottle-shot.png',
        rating: 4.9,
        category: "none",
        reviews: 312
    }
];

export const DELIVERY_CHARGES = 200;
