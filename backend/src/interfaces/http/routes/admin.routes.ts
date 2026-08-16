import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticateJWT, requireRoles } from '../middlewares/auth.middleware';
import { UserRole } from '../../../domain/entities/types';

const router = Router();
const controller = new AdminController();

router.use(authenticateJWT, requireRoles(UserRole.ADMIN, UserRole.STAFF));

router.get('/metrics', (req, res, next) => controller.getDashboardMetrics(req, res, next));
router.get('/audit-logs', requireRoles(UserRole.ADMIN), (req, res, next) => controller.getAuditLogs(req, res, next));

export default router;
