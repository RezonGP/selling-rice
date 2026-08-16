import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { IUser, UserRole } from '../../domain/entities/types';
import { env } from '../../config/env';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateTokens(user: IUser): { accessToken: string; refreshToken: string } {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): any {
    return jwt.verify(token, env.JWT_SECRET);
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  }

  async registerUser(userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
    companyName?: string;
    vatNumber?: string;
  }): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    const existing = await this.userRepo.findByEmail(userData.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const passwordHash = await this.hashPassword(userData.password);

    const userDoc = await this.userRepo.create({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      passwordHash,
      role: userData.role || UserRole.CUSTOMER,
      companyName: userData.companyName,
      vatNumber: userData.vatNumber,
      isB2BVerified: Boolean(userData.companyName),
    });

    const userObj = userDoc.toObject();
    delete (userObj as any).passwordHash;

    const tokens = this.generateTokens(userObj);
    return { user: userObj, tokens };
  }

  async loginUser(
    email: string,
    password: string,
    otpToken?: string
  ): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string }; requires2FA?: boolean }> {
    const userDoc = await this.userRepo.findByEmail(email);
    if (!userDoc) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await this.comparePassword(password, userDoc.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    if (userDoc.is2FAEnabled) {
      if (!otpToken) {
        return { user: userDoc.toObject(), tokens: { accessToken: '', refreshToken: '' }, requires2FA: true };
      }
      const isValidOTP = authenticator.check(otpToken, userDoc.twoFactorSecret || '');
      if (!isValidOTP) {
        throw new Error('Invalid 2FA OTP Token');
      }
    }

    const userObj = userDoc.toObject();
    delete (userObj as any).passwordHash;
    delete (userObj as any).twoFactorSecret;

    const tokens = this.generateTokens(userObj);
    return { user: userObj, tokens };
  }

  async setup2FA(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('User not found');

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, 'NongSanVietRice', secret);
    const qrCodeUrl = await qrcode.toDataURL(otpAuthUrl);

    await this.userRepo.set2FASecret(userId, secret, false);

    return { secret, qrCodeUrl };
  }

  async verify2FAEnable(userId: string, token: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.twoFactorSecret) throw new Error('2FA secret not initialized');

    const isValid = authenticator.check(token, user.twoFactorSecret);
    if (isValid) {
      await this.userRepo.set2FASecret(userId, user.twoFactorSecret, true);
    }
    return isValid;
  }
}
