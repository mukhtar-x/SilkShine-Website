import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    name: string;
    quantity: number;
    size: string;
    price: number;
}

export interface IOrder extends Document {
    orderId: string;
    customer: string;
    contact: string;
    address: string;
    city: string;
    items: IOrderItem[];
    itemsLabel: string;
    amount: string;
    totalAmount: number;
    method: 'COD' | 'Card';
    status: 'Pending' | 'Processing' | 'Out for Delivery' | 'Completed' | 'Cancelled';
    createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    name: { type: String, default: '' },
    quantity: { type: Number, default: 1 },
    size: { type: String, default: 'Standard' },
    price: { type: Number, default: 0 },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    orderId: { type: String, unique: true, default: '' },
    customer: { type: String, default: '' },
    contact: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    items: [OrderItemSchema],
    itemsLabel: { type: String, default: '' },
    amount: { type: String, default: '' },
    totalAmount: { type: Number, default: 0 },
    method: { type: String, enum: ['COD', 'Card'], default: 'COD' },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Out for Delivery', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true });

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
