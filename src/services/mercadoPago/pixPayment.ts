
import { CustomerData, ProductInfo } from './types';
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import { processPayment } from './paymentProcessor';
import { supabase } from "@/integrations/supabase/client";

// Format CPF as user types
export const formatCPF = (value: string): string => {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

// Validate CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // CPF must have 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validate CPF algorithm
  let sum = 0;
  let remainder;
  
  // First digit validation
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  // Second digit validation
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

// Generate a fake PIX QR code payment
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
    
    // Generate a fake payment ID
    const paymentId = `pix_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // For demo purposes, use a static QR code image
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `PIX*${paymentId}*${product.name}*${product.price}`
    )}`;
    
    // Generate fake PIX code (in a real scenario this would come from Mercado Pago)
    const qrCodeText = '00020126330014BR.GOV.BCB.PIX01112233445566778899020115Merchant name520400005303986540510.005802BR5913Merchant name6015CITY Name62070503***6304C2CA';
    
    // Set expiration date (30 minutes from now)
    const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    
    // Process the payment in the database
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await processPayment({
        productId: product.id,
        paymentMethod: 'pix',
        paymentId,
        paymentStatus: 'pending', // PIX starts as pending
        amount: product.price
      });
    }
    
    return {
      status: 'pending',
      paymentId,
      qrCode,
      qrCodeBase64: qrCode, // In a real implementation, this would be a base64 string
      qrCodeText,
      expirationDate
    };
  } catch (error) {
    console.error('Error generating PIX payment:', error);
    throw error;
  }
};
