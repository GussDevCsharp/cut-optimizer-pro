
import { CustomerData, ProductInfo } from './types';
import { PaymentStatus } from '@/components/checkout/CheckoutModal';

// Generate Pix payment
export const generatePixPayment = async (
  product: ProductInfo,
  customerData: CustomerData
): Promise<{
  status: PaymentStatus;
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  qrCodeText: string;
  expirationDate: string;
}> => {
  // In a real implementation, you would call your backend API
  // For this example, we are simulating a successful response
  console.log('Generating Pix payment for product:', product);
  console.log('Customer data:', customerData);
  
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Mock QR code image (base64 encoded)
      const mockQrCodeBase64 = 'https://www.mercadopago.com/org-img/MP3/qrcode.png';
      
      // Create expiration date 30 minutes from now
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 30);
      
      resolve({
        status: 'pending',
        paymentId: `MOCK_PIX_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        qrCode: mockQrCodeBase64,
        qrCodeBase64: mockQrCodeBase64,
        qrCodeText: '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142413e38305204000053039865802BR5913MERCADOPAGO5905BRASIL6007BRASILIA62070503***6304D475',
        expirationDate: expirationDate.toISOString()
      });
    }, 1500);
  });
};
