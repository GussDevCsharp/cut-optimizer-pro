
import { CustomerData, ProductInfo } from './types';
import { PaymentStatus } from '@/components/checkout/CheckoutModal';

// Generate Boleto payment
export const generateBoletoPayment = async (
  product: ProductInfo,
  customerData: CustomerData
): Promise<{
  status: PaymentStatus;
  paymentId: string;
  boletoNumber: string;
  boletoUrl: string;
  expirationDate: string;
}> => {
  // In a real implementation, you would call your backend API
  // For this example, we are simulating a successful response
  console.log('Generating Boleto payment for product:', product);
  console.log('Customer data:', customerData);
  
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Create expiration date 3 days from now
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 3);
      
      resolve({
        status: 'pending',
        paymentId: `MOCK_BOLETO_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        boletoNumber: '34191.79001 01043.510047 91020.150008 7 94250026000',
        boletoUrl: 'https://www.mercadopago.com.br/sandbox/payments/12345678/ticket',
        expirationDate: expirationDate.toISOString()
      });
    }, 1500);
  });
};
