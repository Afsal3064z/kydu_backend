import mongoose, { Document, Schema, Model } from 'mongoose';

interface HomeLocation {
    latitude?: string;
    longitude?: string;
}

interface UserAttributes {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    isRunner: boolean;
    homeLocation?: HomeLocation;
    fcmToken: string;
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
    }
});

const User: UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
