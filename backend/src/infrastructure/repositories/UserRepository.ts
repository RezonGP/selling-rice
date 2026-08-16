import { UserModel, IUserDocument } from '../database/models/User.model';
import { IUser } from '../../domain/entities/types';

export class UserRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).exec();
  }

  async create(user: Partial<IUser>): Promise<IUserDocument> {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  async update(id: string, updates: Partial<IUser>): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async set2FASecret(id: string, secret: string, isEnabled: boolean): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, { twoFactorSecret: secret, is2FAEnabled: isEnabled }, { new: true }).exec();
  }
}
