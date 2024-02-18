import mongoose, { Document, Schema, Model } from 'mongoose';

interface HomeLocation {
    latitude?: string;
    longitude?: string;
}

interface Alert {
    title: string;
    content: string;
    type: "CONNECTION" | "STATUS" | "MESSAGE" | "OTHER";
    data?: string;
    createdAt: Date;
}

interface UserAttributes {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    isRunner: boolean;
    homeLocation?: HomeLocation;
    fcmToken: string;
    alerts: Alert[];
}

interface UserDocument extends Document, UserAttributes {}

interface UserModel extends Model<UserDocument> {}

const userSchema: Schema<UserDocument> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    isRunner: {
        type: Boolean,
        required: true,
        default: false
    },
    homeLocation: {
        latitude: { type: String, required: false },
        longitude: { type: String, required: false }
    },
    fcmToken: {
        type: String,
        required: true,
        default: ''
    },
    alerts: [{
        title: { type: String, required: true },
        content: { type: String, required: true },
        type: { type: String, enum: ["CONNECTION", "STATUS", "MESSAGE", "OTHER"], required: true },
        data: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
});

const User: UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
