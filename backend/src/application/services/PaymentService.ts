import crypto from 'crypto';
import { env } from '../../config/env';
import { PaymentMethod } from '../../domain/entities/types';

export class PaymentService {
  generateVNPayUrl(orderCode: string, amountVnd: number, ipAddress: string): string {
    const tmnCode = process.env.VNPAY_TMN_CODE || 'RICEVNPAY01';
    const secretKey = process.env.VNPAY_HASH_SECRET || 'VNPAYSECRETKEY2026';
    const vnpUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = process.env.VNPAY_RETURN_URL || 'http://localhost/api/v1/payments/vnpay-return';

    const date = new Date();
    const createDate = date.toISOString().replace(/[^0-9]/g, '').slice(0, 14);

    let vnpParams: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderCode,
      vnp_OrderInfo: `Thanh toan don hang gao ${orderCode}`,
      vnp_OrderType: 'billpayment',
      vnp_Amount: (amountVnd * 100).toString(),
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddress || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // Sort params
    const sortedKeys = Object.keys(vnpParams).sort();
    const signData = sortedKeys.map((key) => `${key}=${encodeURIComponent(vnpParams[key])}`).join('&');

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return `${vnpUrl}?${signData}&vnp_SecureHash=${signed}`;
  }

  generateMoMoUrl(orderCode: string, amountVnd: number): string {
    return `https://test-payment.momo.vn/v2/gateway/pay?partnerCode=MOMO_RICE_2026&orderId=${orderCode}&amount=${amountVnd}`;
  }

  processPaymentLink(orderCode: string, amountVnd: number, method: PaymentMethod, ipAddress: string): string | null {
    if (method === PaymentMethod.VNPAY) {
      return this.generateVNPayUrl(orderCode, amountVnd, ipAddress);
    }
    if (method === PaymentMethod.MOMO) {
      return this.generateMoMoUrl(orderCode, amountVnd);
    }
    return null;
  }
}
