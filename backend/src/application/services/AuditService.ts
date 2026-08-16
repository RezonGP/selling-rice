import { AuditLogRepository } from '../../infrastructure/repositories/AuditLogRepository';
import { UserRole } from '../../domain/entities/types';

export class AuditService {
  private auditRepo: AuditLogRepository;

  constructor() {
    this.auditRepo = new AuditLogRepository();
  }

  async logAction(data: {
    userId: string;
    userEmail: string;
    userRole: UserRole;
    action: string;
    resource: string;
    ipAddress: string;
    userAgent: string;
    details?: Record<string, any>;
  }): Promise<void> {
    await this.auditRepo.create(data);
  }

  async getLogs(limit: number = 100) {
    return this.auditRepo.findAll(limit);
  }
}
