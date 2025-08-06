// models/geneticData.model.ts

import mongoose, { Schema, Document } from 'mongoose';

interface IGeneEntry {
    Gene: string;
    condition: string;
    response: string;
}

interface ICategory {
    title: string;
    icon: string;
    focus: string;
    data: IGeneEntry[];
}

export interface IGeneticData extends Document {
    genetic_data: ICategory[];
}

const GeneEntrySchema: Schema = new Schema({
    Gene: { type: String, required: true },
    condition: { type: String, required: true },
    response: { type: String, required: true },
});

const CategorySchema: Schema = new Schema({
    title: { type: String, required: true },
    icon: { type: String, required: false },
    focus: { type: String, required: true },
    data: { type: [GeneEntrySchema], default: [] },
});

const GeneticDataSchema: Schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    genetic_data: {
        type: [CategorySchema],
        required: true
    },
});

export const GeneticData = mongoose.model<IGeneticData>('GeneticData', GeneticDataSchema);
