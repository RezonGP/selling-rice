import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { AuditService } from '../../../application/services/AuditService';

const auditService = new AuditService();

export const auditLog = (action: string, resource: string) => {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (req.user) {
      try {
        await auditService.logAction({
          userId: req.user.sub,
          userEmail: req.user.email,
          userRole: req.user.role,
          action,
          resource,
          ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
          userAgent: req.get('User-Agent') || 'unknown',
          details: { body: req.body, query: req.query, params: req.params },
        });
      } catch (err) {
        // Audit log failure should not crash main request
      }
    }
    next();
  };
};
