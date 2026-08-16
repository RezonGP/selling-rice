import mongoose, { Schema, Document } from 'mongoose';
import { IUser, UserRole } from '../../../domain/entities/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema: Schema = new Schema<IUserDocument>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER, index: true },
    is2FAEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    companyName: { type: String, trim: true },
    vatNumber: { type: String, trim: true },
    isB2BVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
