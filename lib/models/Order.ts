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
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    orderId: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    items: [OrderItemSchema],
    itemsLabel: { type: String, default: '' },
    amount: { type: String, required: true },
    totalAmount: { type: Number, required: true },
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
