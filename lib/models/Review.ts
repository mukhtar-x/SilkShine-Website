import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    quote: string;
    author: string;
    role: string;
    initials: string;
    rating: number;
    productId: number | null;
    isHomepage: boolean;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
    quote: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, default: '' },
    initials: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    productId: { type: Number, default: null },
    isHomepage: { type: Boolean, default: false },
}, { timestamps: true });

const Review: Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
