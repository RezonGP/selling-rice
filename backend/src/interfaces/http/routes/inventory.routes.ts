import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/auditLog.middleware';
import { CreateBatchSchema } from '../validators/schemas';
import { UserRole } from '../../../domain/entities/types';

const router = Router();
const controller = new InventoryController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN, UserRole.STAFF));

router.get('/batches', (req, res, next) => controller.getAllBatches(req, res, next));
router.post('/batches', validateBody(CreateBatchSchema), auditLog('CREATE_BATCH', 'INVENTORY'), (req, res, next) =>
  controller.createBatch(req, res, next)
);
router.get('/warnings', (req, res, next) => controller.getLowStockWarnings(req, res, next));

export default router;
