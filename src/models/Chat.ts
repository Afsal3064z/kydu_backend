import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface Message {
    content: string;
    createdAt: Date;
    createdBy: Types.ObjectId;
}

interface ChatAttributes {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    messages: Message[];
    createdAt: Date;
}

interface ChatDocument extends Document, ChatAttributes {}

interface ChatModel extends Model<ChatDocument> {}

const chatSchema: Schema<ChatDocument> = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true
    },
    messages: [{
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});


const Chat: ChatModel = mongoose.model<ChatDocument, ChatModel>('Chat', chatSchema);

export default Chat;
