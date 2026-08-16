import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { auditLog } from '../middlewares/auditLog.middleware';
import { CreateProductSchema } from '../validators/schemas';
import { UserRole } from '../../../domain/entities/types';

const router = Router();
const controller = new ProductController();

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.get('/slug/:slug', (req, res, next) => controller.getBySlug(req, res, next));

// Admin / Staff only
router.post(
  '/',
  authenticateJWT,
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  validateBody(CreateProductSchema),
  auditLog('CREATE_PRODUCT', 'PRODUCT'),
  (req, res, next) => controller.create(req, res, next)
);

router.put(
  '/:id',
  authenticateJWT,
  requireRoles(UserRole.ADMIN, UserRole.STAFF),
  auditLog('UPDATE_PRODUCT', 'PRODUCT'),
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  '/:id',
  authenticateJWT,
  requireRoles(UserRole.ADMIN),
  auditLog('DELETE_PRODUCT', 'PRODUCT'),
  (req, res, next) => controller.delete(req, res, next)
);

export default router;
