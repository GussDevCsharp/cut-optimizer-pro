
// Pix payment functionality
import { ProductInfo, CustomerData, PixPaymentResponse } from './types';
import { PaymentStatus } from './types';

// Generate Pix payment
export const generatePixPayment = async (
  product: ProductInfo,
  customerData: CustomerData
): Promise<PixPaymentResponse> => {
  // This is a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        qr_code: 'https://www.mercadopago.com/qrcode.png',
        qr_code_base64: 'data:image/png;base64,iVBORw0KGgoAA...', // Base64 encoded QR code image
        status: 'pending',
        transaction_amount: product.unit_price || product.price || 0,
        // Additional fields for the component
        paymentId: `pix_${Date.now()}`,
        qrCode: 'https://www.mercadopago.com/qrcode.png',
        qrCodeText: '00020101021226800014br.gov.bcb.pix2558api.mercadolibre.com/payment/123456789',
        expirationDate: new Date(Date.now() + 30 * 60000).toISOString()  // 30 minutes from now
      });
    }, 1500);
  });
};
