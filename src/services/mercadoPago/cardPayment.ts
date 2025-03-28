import { CustomerData, CardData, ProductInfo } from './types';
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import { processPayment } from './paymentProcessor';
import { supabase } from "@/integrations/supabase/client";
import { getMercadoPagoConfig } from './initialize';

// Simulate card payment processing
// In a real implementation, this would call the Mercado Pago API
export const processCardPayment = async (
  product: ProductInfo,
  cardData: CardData,
  customerData: CustomerData
): Promise<{
  status: PaymentStatus;
  paymentId?: string;
}> => {
  try {
    // Get configuration to determine if we're in sandbox mode
    const config = await getMercadoPagoConfig();
    const isSandbox = config.isSandbox;
    
    // Log detailed payment attempt for debugging
    console.log('PAYMENT ATTEMPT', {
      timestamp: new Date().toISOString(),
      product,
      cardType: cardData.paymentMethodId,
      installments: cardData.installments,
      isSandbox,
      isTestKey: config.publicKey.startsWith('TEST-'),
      cardNumberMasked: '*'.repeat(12) + cardData.cardNumber.slice(-4),
      customerEmail: customerData.email
    });
    
    // Simulate gateway processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate a test payment ID
    const paymentId = `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Simulate a successful response in most cases, but randomly reject some
    const isApproved = Math.random() > 0.3;
    const status: PaymentStatus = isApproved ? 'approved' : 'rejected';
    
    // Log payment result
    console.log('PAYMENT RESULT', {
      paymentId,
      status,
      timestamp: new Date().toISOString(),
      isSandbox,
      productId: product.id,
      amount: product.price
    });
    
    // Process the payment in the database if the card payment was approved
    if (isApproved) {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await processPayment({
          productId: product.id,
          paymentMethod: 'card',
          paymentId,
          paymentStatus: status,
          amount: product.price,
          customerData: {
            name: customerData.name,
            email: customerData.email,
            identificationType: customerData.identificationType,
            identificationNumber: customerData.identificationNumber
          }
        });
      }
    }
    
    return {
      status,
      paymentId
    };
  } catch (error) {
    console.error('Error processing card payment:', error);
    return {
      status: 'error'
    };
  }
};

// Get available installment options
export const getInstallmentOptions = (amount: number) => {
  const minInstallmentValue = 5; // Minimum installment value in BRL
  const maxInstallments = 12;
  const options = [];
  
  // Calculate maximum number of installments based on minimum value
  const possibleInstallments = Math.min(Math.floor(amount / minInstallmentValue), maxInstallments);
  
  // Start with 1x installment (no interest)
  options.push({
    installments: 1,
    installmentAmount: amount,
    totalAmount: amount,
    label: `1x de ${formatAmount(amount)} (sem juros)`
  });
  
  // Add installment options (simulate some interest rates)
  for (let i = 2; i <= possibleInstallments; i++) {
    // Apply interest rate for installments > 6
    const hasInterest = i > 6;
    const interestRate = hasInterest ? 0.019 * (i - 6) : 0; // 1.9% interest per month beyond 6 months
    const totalWithInterest = hasInterest ? amount * (1 + interestRate) : amount;
    const installmentAmount = totalWithInterest / i;
    
    options.push({
      installments: i,
      installmentAmount,
      totalAmount: totalWithInterest,
      label: `${i}x de ${formatAmount(installmentAmount)}${!hasInterest ? ' (sem juros)' : ''}`
    });
  }
  
  return options;
};

// Helper to format amount as Brazilian currency
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};
