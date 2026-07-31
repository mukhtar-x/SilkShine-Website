import mongoose, { Schema, Document, Model } from 'mongoose';


interface BilingualString {
    en: string;
    ur: string;
}

interface StatItem {
    label: BilingualString;
    value: string;
}

interface ProcessStepItem {
    step: number;
    videoUrl: string;
    title: BilingualString;
    description: BilingualString;
    keySpecs: string[]; // Or BilingualString[] if specifications are also bilingual
}
interface BenefitItem {
    title: BilingualString;
    content: BilingualString;
}

interface ContactInfoItem {
    title: BilingualString;
    value: BilingualString;
    icon: string;
}

export interface ISiteMetadata extends Document {
    key: string;
    about: {
        hero: {
            title: BilingualString;
            subtitle: BilingualString;
            image: string;
        };
        story: {
            title: BilingualString;
            content: BilingualString;
        };
        stats: StatItem[];
    };
    benefits: BenefitItem[];
    contact: {
        title: BilingualString;
        subtitle: BilingualString;
        operatingHours: string;
        info: ContactInfoItem[];
    };
    invoice: {
        sellerName: string;
        sellerLegalName: string;
        sellerAddress: string;
        sellerPhone: string;
        sellerNtn: string;
        sellerEmail: string;
        bankName: string;
        accountTitle: string;
        accountNo: string;
        paymentTerms: string;
    };
    processSteps: ProcessStepItem[];

}

const BilingualSchema = new Schema<BilingualString>(
    { en: String, ur: String },
    { _id: false }
);

const SiteMetadataSchema = new Schema<ISiteMetadata>({
    key: { type: String, required: true, unique: true, default: 'main' },
    about: {
        hero: {
            title: { type: BilingualSchema },
            subtitle: { type: BilingualSchema },
            image: { type: String, default: '/assets/hero-bg.jpg' },
        },
        story: {
            title: { type: BilingualSchema },
            content: { type: BilingualSchema },
        },
        stats: [{
            _id: false,
            label: { type: BilingualSchema },
            value: { type: String },
        }],
    },
    benefits: [{
        _id: false,
        title: { type: BilingualSchema },
        content: { type: BilingualSchema },
    }],
    contact: {
        title: { type: BilingualSchema },
        subtitle: { type: BilingualSchema },
        operatingHours: { type: String, default: 'Mon - Sat 9:00 AM to 6:00 PM' },
        info: [{
            _id: false,
            title: { type: BilingualSchema },
            value: { type: BilingualSchema },
            icon: { type: String },
        }],
    },
    invoice: {
        sellerName: { type: String, default: 'SilkShine' },
        sellerLegalName: { type: String, default: 'SilkShine Pvt Ltd' },
        sellerAddress: { type: String, default: '123 Industrial Estate, Phase II, Lahore, Pakistan 54000' },
        sellerPhone: { type: String, default: '+92 300 1234567' },
        sellerNtn: { type: String, default: '1234567-8 / 17-00-9821-3' },
        sellerEmail: { type: String, default: 'billing@silkshine.pk' },
        bankName: { type: String, default: 'Meezan Bank Limited, Karachi' },
        accountTitle: { type: String, default: 'SilkShine Pvt Ltd' },
        accountNo: { type: String, default: 'PK36MEZN0001234567890123' },
        paymentTerms: { type: String, default: 'Due within 30 days via Online IBFT or Crossed Cheque.' },
    },
    processSteps: [{
        _id: false,
        step: { type: Number, required: true },
        videoUrl: { type: String, default: '' },
        title: { type: BilingualSchema, required: true },
        description: { type: BilingualSchema, required: true },
        keySpecs: [{ type: String }]
    }],
}, { timestamps: true });

const SiteMetadata: Model<ISiteMetadata> =
    mongoose.models.SiteMetadata ||
    mongoose.model<ISiteMetadata>('SiteMetadata', SiteMetadataSchema);

export default SiteMetadata;
