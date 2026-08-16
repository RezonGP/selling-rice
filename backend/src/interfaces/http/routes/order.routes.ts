import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/auditLog.middleware';
import { CreateOrderSchema } from '../validators/schemas';
import { UserRole } from '../../../domain/entities/types';

const router = Router();
const controller = new OrderController();

router.post('/', validateBody(CreateOrderSchema), (req, res, next) => controller.create(req, res, next));
router.get('/track/:code', (req, res, next) => controller.getByCode(req, res, next));
router.get('/my-orders', authenticateJWT, (req, res, next) => controller.getUserOrders(req, res, next));

// Admin management
router.get(
  '/admin/all',
  authenticateJWT,
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  (req, res, next) => controller.getAllAdmin(req, res, next)
);

router.put(
  '/:id/status',
  authenticateJWT,
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  auditLog('UPDATE_ORDER_STATUS', 'ORDER'),
  (req, res, next) => controller.updateStatus(req, res, next)
);

export default router;
