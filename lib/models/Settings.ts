import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
    key: string;
    deliveryCharge: number;
    taxRate: number;
}

const SettingsSchema = new Schema<ISettings>({
    key: { type: String, unique: true, default: 'global' },
    deliveryCharge: { type: Number, default: 500 },
    taxRate: { type: Number, default: 0 },
}, { timestamps: true });

const Settings: Model<ISettings> =
    mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
