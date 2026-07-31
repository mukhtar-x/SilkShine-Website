import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import mongoose, { Schema, Document, Model } from 'mongoose';

// Inline lightweight model for contact messages
interface IMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, default: '' },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
        }

        await connectDB();
        await Message.create({ name, email, subject, message });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('[API] POST /api/contact error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
