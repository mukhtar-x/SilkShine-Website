import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    id: number;
    name: string;
    description: string;
    price: number;
    sizes: string[];
    image: string;
    rating: number;
    reviews: number;
    category: string;
    type: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const ProductSchema = new Schema<IProduct>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: [{ type: String }],
    image: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    category: { type: String, default: 'Hair Care' },
    type: { type: String, default: 'Standard' },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
}, { timestamps: true });

const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
