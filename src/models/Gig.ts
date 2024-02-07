import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface Location {
    type: string;
    coordinates: [number, number];
    name: string;
}

interface GigAttributes {
    title: string;
    description: string;
    createdBy: Types.ObjectId;
    createdAt?: Date;
    offer: number;
    location: Location; // Modify the location interface
    photos: string[];
}

interface GigDocument extends Document, GigAttributes {}

interface GigModel extends Model<GigDocument> {}

const gigSchema: Schema<GigDocument> = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    offer: {
        type: Number,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    photos: [String]
});

// Create 2dsphere index on the location field
gigSchema.index({ location: '2dsphere' });

const Gig: GigModel = mongoose.model<GigDocument, GigModel>('Gig', gigSchema);

export default Gig;
