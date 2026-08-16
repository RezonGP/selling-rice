import mongoose, { Schema, Document } from 'mongoose';
import { IAuditLog, UserRole } from '../../../domain/entities/types';

export interface IAuditLogDocument extends Omit<IAuditLog, '_id'>, Document {}

const AuditLogSchema: Schema = new Schema<IAuditLogDocument>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    userRole: { type: String, enum: Object.values(UserRole), required: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLogModel = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
