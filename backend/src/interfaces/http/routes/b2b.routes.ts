import { Router } from 'express';
import { B2BController } from '../controllers/B2BController';
import { validateBody } from '../middlewares/validate.middleware';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { auditLog } from '../middlewares/auditLog.middleware';
import { CreateB2BQuoteSchema } from '../validators/schemas';
import { UserRole } from '../../../domain/entities/types';

const router = Router();
const controller = new B2BController();

router.post('/quote-request', validateBody(CreateB2BQuoteSchema), (req, res, next) =>
  controller.submitQuoteRequest(req, res, next)
);

// Admin routes
router.get(
  '/admin/quotes',
  authenticateJWT,
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  (req, res, next) => controller.getAllAdmin(req, res, next)
);

router.put(
  '/admin/quotes/:id',
  authenticateJWT,
  requireRoles(UserRole.ADMIN),
  auditLog('UPDATE_B2B_QUOTE', 'B2B_QUOTE'),
  (req, res, next) => controller.updateQuoteStatus(req, res, next)
);

export default router;
