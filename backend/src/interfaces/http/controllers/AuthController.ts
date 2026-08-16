import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../application/services/AuthService';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registerUser(req.body);

      // Set Refresh Token in HttpOnly Secure Cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, otpToken } = req.body;
      const result = await authService.loginUser(email, password, otpToken);

      if (result.requires2FA) {
        return res.status(200).json({
          success: true,
          requires2FA: true,
          message: '2FA OTP code required',
        });
      }

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async setup2FA(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.setup2FA(req.user!.sub);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async verify2FA(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const isValid = await authService.verify2FAEnable(req.user!.sub, token);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid 2FA OTP Code' });
      }
      return res.status(200).json({ success: true, message: '2FA successfully enabled' });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie('refreshToken');
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}
