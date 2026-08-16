import client from 'prom-client';

export class MetricsService {
  public registry: client.Registry;
  public httpRequestDurationMicroseconds: client.Histogram<string>;
  public httpRequestsTotal: client.Counter<string>;
  public totalSalesWeightKg: client.Counter<string>;

  constructor() {
    this.registry = new client.Registry();
    client.collectDefaultMetrics({ register: this.registry });

    // Guard against duplicate metric registration (e.g. ts-node-dev hot-reload)
    const existingHistogram = this.registry.getSingleMetric('http_request_duration_seconds');
    if (existingHistogram) {
      this.httpRequestDurationMicroseconds = existingHistogram as client.Histogram<string>;
    } else {
      this.httpRequestDurationMicroseconds = new client.Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: ['method', 'route', 'code'],
        buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10],
        registers: [this.registry],
      });
    }

    const existingCounter = this.registry.getSingleMetric('http_requests_total');
    if (existingCounter) {
      this.httpRequestsTotal = existingCounter as client.Counter<string>;
    } else {
      this.httpRequestsTotal = new client.Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'handler', 'status'],
        registers: [this.registry],
      });
    }

    const existingSalesCounter = this.registry.getSingleMetric('rice_sales_total_weight_kg');
    if (existingSalesCounter) {
      this.totalSalesWeightKg = existingSalesCounter as client.Counter<string>;
    } else {
      this.totalSalesWeightKg = new client.Counter({
        name: 'rice_sales_total_weight_kg',
        help: 'Total weight of rice sold in Kg',
        registers: [this.registry],
      });
    }
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

export const metricsService = new MetricsService();
