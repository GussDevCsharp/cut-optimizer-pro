
// Pix payment functionality
import { ProductInfo, CustomerData, PixPaymentResponse } from './types';
import { PaymentStatus } from '@/components/checkout/CheckoutModal';

// Generate Pix payment
export const generatePixPayment = async (
  product: ProductInfo,
  customerData: CustomerData
): Promise<PixPaymentResponse> => {
  // This is a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'pending' as PaymentStatus,
        paymentId: `pix_${Date.now()}`,
        qrCode: 'https://www.mercadopago.com/qrcode.png',
        qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAA...', // Base64 encoded QR code image
        qrCodeText: '00020101021226800014br.gov.bcb.pix2558api.mercadolibre.com/payment/123456789',
        expirationDate: new Date(Date.now() + 30 * 60000).toISOString()  // 30 minutes from now
      });
    }, 1500);
  });
};
