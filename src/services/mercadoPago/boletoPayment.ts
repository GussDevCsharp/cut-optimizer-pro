
import { ProductInfo, CustomerData, PaymentStatus } from './types';

// Generate Boleto payment (mock implementation)
export const generateBoletoPayment = async (product: ProductInfo, customer: CustomerData) => {
  console.log('Generating Boleto payment:', { product, customer });
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Boleto response
      resolve({
        status: 'pending' as PaymentStatus,
        paymentId: `MOCK_BOLETO_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        boletoNumber: '34191.79001 01043.510047 91020.150008 9 89110000041270',
        boletoUrl: 'https://www.mercadopago.com.br/sandbox',
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60000).toISOString(), // 3 days from now
      });
    }, 1500);
  });
};
