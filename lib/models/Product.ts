import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductReview {
    _id?: mongoose.Types.ObjectId | string;
    user: string;
    rating: number;
    comment: string;
    date: Date;
}

export interface IProduct extends Document {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice?: number;
    sizes: string[];
    image: string;
    images?: string[];
    rating: number;
    reviews: number;
    reviewsList?: IProductReview[];
    features?: string[];
    category: string;
    type: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const ProductReviewSchema = new Schema<IProductReview>({
    user: { type: String, default: 'Anonymous' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    comment: { type: String, default: '' },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const ProductSchema = new Schema<IProduct>({
    id: { type: Number, unique: true },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    oldPrice: { type: Number, default: 0 },
    sizes: [{ type: String }],
    image: { type: String, default: '' },
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    reviewsList: [ProductReviewSchema],
    features: [{ type: String }],
    category: { type: String, default: 'Hair Care' },
    type: { type: String, default: 'Standard' },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
}, { timestamps: true });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
