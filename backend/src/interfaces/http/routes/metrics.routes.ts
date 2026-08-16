import { Router } from 'express';
import { MetricsController } from '../controllers/MetricsController';

const router = Router();
const controller = new MetricsController();

router.get('/', (req, res) => controller.getMetrics(req, res));

export default router;
