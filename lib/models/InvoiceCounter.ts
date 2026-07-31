import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvoiceCounter extends Document {
  key: string;
  seq: number;
  updatedAt: Date;
}

const InvoiceCounterSchema = new Schema<IInvoiceCounter>(
  {
    key: { type: String, required: true, unique: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const InvoiceCounter: Model<IInvoiceCounter> =
  mongoose.models.InvoiceCounter || mongoose.model<IInvoiceCounter>('InvoiceCounter', InvoiceCounterSchema);

export default InvoiceCounter;
