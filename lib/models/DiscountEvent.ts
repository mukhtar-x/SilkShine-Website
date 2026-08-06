import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscountEvent extends Document {
    title: string;
    code: string;
    discountPercentage: number;
    isActive: boolean;
    applicableProducts: number[]; // Array of product numerical IDs (empty means all products)
    createdAt: Date;
    updatedAt: Date;
}

const DiscountEventSchema = new Schema<IDiscountEvent>({
    title: { type: String, default: '' },
    code: { type: String, unique: true, uppercase: true, trim: true, default: '' },
    discountPercentage: { type: Number, min: 0, max: 100, default: 0 },
    isActive: { type: Boolean, default: true },
    applicableProducts: [{ type: Number }],
}, { timestamps: true });

const DiscountEvent: Model<IDiscountEvent> =
    mongoose.models.DiscountEvent || mongoose.model<IDiscountEvent>('DiscountEvent', DiscountEventSchema);

export default DiscountEvent;
