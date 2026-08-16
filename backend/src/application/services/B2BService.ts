import { B2BQuoteRepository } from '../../infrastructure/repositories/B2BQuoteRepository';
import { IB2BQuoteRequest } from '../../domain/entities/types';
import { IB2BQuoteDocument } from '../../infrastructure/database/models/B2BQuote.model';
import { logger } from '../../config/logger';

export class B2BService {
  private b2bRepo: B2BQuoteRepository;

  constructor() {
    this.b2bRepo = new B2BQuoteRepository();
  }

  async submitQuoteRequest(data: Partial<IB2BQuoteRequest>): Promise<IB2BQuoteDocument> {
    logger.info(`[B2BService] Submitting new B2B quote request for company: ${data.companyName}`);
    const quote = await this.b2bRepo.create(data);
    return quote;
  }

  async getAllQuotes(): Promise<IB2BQuoteDocument[]> {
    return this.b2bRepo.findAll();
  }

  async updateQuoteStatus(
    id: string,
    status: 'QUOTED' | 'REJECTED',
    quotedPricePerTonVnd?: number,
    adminNotes?: string
  ): Promise<IB2BQuoteDocument | null> {
    logger.info(`[B2BService] Updating B2B quote status id=${id} to ${status}`);
    const updated = await this.b2bRepo.updateQuote(id, status, quotedPricePerTonVnd, adminNotes);
    if (!updated) {
      throw new Error('B2B Quote request not found');
    }
    return updated;
  }
}
