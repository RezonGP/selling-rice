import { B2BQuoteModel, IB2BQuoteDocument } from '../database/models/B2BQuote.model';
import { IB2BQuoteRequest } from '../../domain/entities/types';

export class B2BQuoteRepository {
  async create(quote: Partial<IB2BQuoteRequest>): Promise<IB2BQuoteDocument> {
    const newQuote = new B2BQuoteModel(quote);
    return newQuote.save();
  }

  async findAll(): Promise<IB2BQuoteDocument[]> {
    return B2BQuoteModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<IB2BQuoteDocument | null> {
    return B2BQuoteModel.findById(id).exec();
  }

  async updateQuote(id: string, status: 'QUOTED' | 'REJECTED', quotedPricePerTonVnd?: number, adminNotes?: string): Promise<IB2BQuoteDocument | null> {
    return B2BQuoteModel.findByIdAndUpdate(
      id,
      { status, quotedPricePerTonVnd, adminNotes },
      { new: true }
    ).exec();
  }
}
