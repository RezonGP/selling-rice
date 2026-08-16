import nodemailer from 'nodemailer';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendOrderConfirmation(email: string, orderCode: string, totalVnd: number, totalWeightKg: number): Promise<boolean> {
    try {
      if (!env.SMTP_USER) {
        logger.info(`[Email Stub] Order Confirmation sent to ${email} for Order ${orderCode}`);
        return true;
      }

      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: email,
        subject: `[Nông Sản Việt] Xác nhận đơn hàng thành công #${orderCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #2E7D32; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2E7D32;">Cảm ơn bạn đã đặt hàng gạo sạch Nông Sản Việt!</h2>
            <p>Mã đơn hàng: <strong>${orderCode}</strong></p>
            <p>Tổng khối lượng: <strong>${totalWeightKg} Kg</strong></p>
            <p>Tổng thanh toán: <strong style="color: #D32F2F;">${totalVnd.toLocaleString('vi-VN')} VNĐ</strong></p>
            <p>Đơn hàng của bạn đang được đóng gói trực tiếp từ kho sản xuất.</p>
          </div>
        `,
      });
      return true;
    } catch (error) {
      logger.error('Failed to send order confirmation email', { error });
      return false;
    }
  }

  async send2FAOTP(email: string, otpCode: string): Promise<boolean> {
    try {
      if (!env.SMTP_USER) {
        logger.info(`[Email Stub] 2FA OTP for ${email}: ${otpCode}`);
        return true;
      }

      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to: email,
        subject: `[Bảo Mật Admin] Mã xác thực 2FA: ${otpCode}`,
        html: `<h3>Mã OTP đăng nhập Admin Nông Sản Việt: <span style="color: #2E7D32;">${otpCode}</span></h3><p>Mã có hiệu lực trong 5 phút.</p>`,
      });
      return true;
    } catch (error) {
      logger.error('Failed to send 2FA OTP email', { error });
      return false;
    }
  }
}
