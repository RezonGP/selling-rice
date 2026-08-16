import { Request, Response, NextFunction } from 'express';
import { B2BService } from '../../../application/services/B2BService';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const b2bService = new B2BService();

export class B2BController {
  async submitQuoteRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const quote = await b2bService.submitQuoteRequest(req.body);
      return res.status(201).json({
        success: true,
        message: 'B2B quote request submitted successfully. Our sales architect will contact you within 2 hours.',
        data: quote,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const quotes = await b2bService.getAllQuotes();
      return res.status(200).json({ success: true, count: quotes.length, data: quotes });
    } catch (error) {
      next(error);
    }
  }

  async updateQuoteStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, quotedPricePerTonVnd, adminNotes } = req.body;
      const updated = await b2bService.updateQuoteStatus(req.params.id, status, quotedPricePerTonVnd, adminNotes);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}
