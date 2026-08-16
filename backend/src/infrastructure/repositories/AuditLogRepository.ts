import { AuditLogModel, IAuditLogDocument } from '../database/models/AuditLog.model';
import { IAuditLog } from '../../domain/entities/types';

export class AuditLogRepository {
  async create(log: Partial<IAuditLog>): Promise<IAuditLogDocument> {
    const newLog = new AuditLogModel(log);
    return newLog.save();
  }

  async findAll(limit: number = 100): Promise<IAuditLogDocument[]> {
    return AuditLogModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }
}
