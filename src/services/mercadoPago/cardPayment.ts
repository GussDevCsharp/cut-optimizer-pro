
import { CustomerData, CardData, ProductInfo } from './types';
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import { processPayment } from './paymentProcessor';
import { supabase } from "@/integrations/supabase/client";
import { getMercadoPagoConfig } from './initialize';

// Process card payment
// In a real implementation, this integrates with the Mercado Pago API
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
    
    // Generate a payment ID
    const paymentId = `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // In production mode with production keys, we'd actually call the Mercado Pago API here
    let status: PaymentStatus;
    
    if (!isSandbox && !config.publicKey.startsWith('TEST-')) {
      // This is where we would make the actual API call to Mercado Pago in production
      // For now, we'll simulate a successful response in production too
      console.log('PRODUCTION MODE: Would call Mercado Pago API here with real credentials');
      status = 'approved';
    } else if (!isSandbox && config.publicKey.startsWith('TEST-')) {
      // Production mode but with test keys - this will always fail
      console.error('INVALID CONFIGURATION: Production mode with test keys');
      status = 'rejected';
    } else {
      // Sandbox mode - simulate a successful response in most cases, but randomly reject some
      status = Math.random() > 0.3 ? 'approved' : 'rejected';
    }
    
    // Log payment result
    console.log('PAYMENT RESULT', {
      paymentId,
      status,
      timestamp: new Date().toISOString(),
      isSandbox,
      productId: product.id,
      amount: product.price,
      productionWithTestKeys: !isSandbox && config.publicKey.startsWith('TEST-')
    });
    
    // Process the payment in the database if the card payment was approved
    if (status === 'approved') {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // In a real app, we would store transaction information regardless of user state
      // Log the transaction for all cases
      console.log('TRANSACTION LOG:', {
        timestamp: new Date().toISOString(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        paymentMethod: 'card',
        status,
        paymentId,
        userId: user?.id || 'anonymous',
        isSandbox,
        userAgent: navigator.userAgent
      });
      
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
      } else {
        // For anonymous users, at least try to save a payment log
        console.log('Salvando log de pagamento via RPC:', {
          timestamp: new Date().toISOString(),
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          payment_method: 'card',
          status,
          payment_id: paymentId,
          user_id: null,
          is_sandbox: isSandbox,
          user_agent: navigator.userAgent,
          customer_email: customerData.email
        });
        
        try {
          // Try using the RPC for anonymous users, but catch any error
          const { error } = await supabase.rpc('insert_payment_log', {
            log_data: {
              timestamp: new Date().toISOString(),
              product_id: product.id,
              product_name: product.name,
              price: product.price,
              payment_method: 'card',
              status,
              payment_id: paymentId,
              user_id: null,
              is_sandbox: isSandbox,
              user_agent: navigator.userAgent,
              customer_email: customerData.email
            }
          });
          
          if (error) throw error;
        } catch (error) {
          console.error('Erro ao salvar log de pagamento:', error);
          
          // Store offline for later sync
          const offlineLogs = JSON.parse(localStorage.getItem('offlinePaymentLogs') || '[]');
          offlineLogs.push({
            timestamp: new Date().toISOString(),
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            payment_method: 'card',
            status,
            payment_id: paymentId,
            is_sandbox: isSandbox,
            user_agent: navigator.userAgent,
            customer_email: customerData.email
          });
          localStorage.setItem('offlinePaymentLogs', JSON.stringify(offlineLogs));
          console.log('Log armazenado offline para sincronização futura');
        }
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
