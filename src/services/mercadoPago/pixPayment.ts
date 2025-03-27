import { CustomerData, ProductInfo } from './types';
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import { processPayment } from './paymentProcessor';
import { supabase } from "@/integrations/supabase/client";

// Generate a fake Pix payment
// In a real implementation, this would call the Mercado Pago API
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
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate a fake payment ID and QR code
    const paymentId = `pix_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const qrCode = 'https://fakeqrcode.com/image.png';
    const qrCodeBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+n9UAAAAASUVORK5CYII=';
    const qrCodeText = '00020126580014BR.GOV.BCB00014pixkeyexample5204000053039865802BR5925Nome do Recebedor da Silva6009SAO PAULOSP62070503***63041234';
    const expirationDate = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes from now

    // Process the payment in the database
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await processPayment({
        productId: product.id,
        paymentMethod: 'pix',
        paymentId,
        paymentStatus: 'pending', // Pix starts as pending
        amount: product.price
      });
    }

    return {
      status: 'pending',
      paymentId,
      qrCode,
      qrCodeBase64,
      qrCodeText,
      expirationDate
    };
  } catch (error) {
    console.error('Error generating Pix payment:', error);
    throw error;
  }
};
