import mongoose, { Schema, Document } from 'mongoose';
import { IB2BQuoteRequest } from '../../../domain/entities/types';

export interface IB2BQuoteDocument extends Omit<IB2BQuoteRequest, '_id'>, Document {}

const B2BQuoteSchema: Schema = new Schema<IB2BQuoteDocument>(
  {
    companyName: { type: String, required: true, trim: true },
    vatNumber: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    riceVarietyNeeded: { type: String, required: true },
    estimatedMonthlyVolumeTons: { type: Number, required: true },
    preferredPackaging: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'QUOTED', 'REJECTED'], default: 'PENDING', index: true },
    adminNotes: { type: String },
    quotedPricePerTonVnd: { type: Number },
  },
  {
    timestamps: true,
  }
);

B2BQuoteSchema.index({ createdAt: -1 });

export const B2BQuoteModel = mongoose.model<IB2BQuoteDocument>('B2BQuote', B2BQuoteSchema);
