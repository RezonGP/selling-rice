import { Request, Response } from 'express';
import { metricsService } from '../../../application/services/MetricsService';

export class MetricsController {
  async getMetrics(_req: Request, res: Response) {
    try {
      res.set('Content-Type', metricsService.registry.contentType);
      res.end(await metricsService.getMetrics());
    } catch (ex) {
      res.status(500).end(ex);
    }
  }
}
