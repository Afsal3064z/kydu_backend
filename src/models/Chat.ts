import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface Message {
    content: string;
    contentType: "TEXT" | "AUDIO" | "IMAGE";
    createdAt: Date;
    createdBy: Types.ObjectId;
}

interface ChatAttributes {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    messages: Message[];
    createdAt: Date;
    approved: boolean;
}

interface ChatDocument extends Document, ChatAttributes {}

interface ChatModel extends Model<ChatDocument> {}

const chatSchema: Schema<ChatDocument> = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    messages: [{
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
        contentType: { type: String, enum: [ "TEXT", "AUDIO", "IMAGE"], default: "TEXT" }
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Chat: ChatModel = mongoose.model<ChatDocument, ChatModel>('Chat', chatSchema);

export default Chat;
