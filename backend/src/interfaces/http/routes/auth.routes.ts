import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../middlewares/validate.middleware';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { RegisterSchema, LoginSchema } from '../validators/schemas';
import { authLoginRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();
const controller = new AuthController();

router.post('/register', validateBody(RegisterSchema), (req, res, next) => controller.register(req, res, next));
router.post('/login', authLoginRateLimiter, validateBody(LoginSchema), (req, res, next) => controller.login(req, res, next));
router.post('/2fa/setup', authenticateJWT, (req, res, next) => controller.setup2FA(req, res, next));
router.post('/2fa/verify', authenticateJWT, (req, res, next) => controller.verify2FA(req, res, next));
router.post('/logout', (req, res) => controller.logout(req, res));

export default router;
