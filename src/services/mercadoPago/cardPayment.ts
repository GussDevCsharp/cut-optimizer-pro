
// Card payment functionality
import { toast } from '@/hooks/use-toast';
import { CardData, ProductInfo, InstallmentOption } from './types';
import { getMercadoPagoInstance, initMercadoPago } from './sdk';

// Process card payment
export const processCardPayment = async (
  product: ProductInfo,
  cardData: CardData,
  customerData: { name: string; email: string; cpf: string }
): Promise<{ status: string; paymentId: string }> => {
  try {
    await initMercadoPago();
    const mp = getMercadoPagoInstance();
    
    // In a real implementation, you'd call your backend here
    // For the demo, we're simulating a response
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate some basic validations
        if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
          throw new Error('Número de cartão inválido');
        }
        
        // Simulate successful payment
        resolve({
          status: 'approved',
          paymentId: `mock_${Date.now()}`
        });
      }, 2000);
    });
  } catch (error) {
    console.error("Error processing card payment:", error);
    toast({
      variant: "destructive",
      title: "Erro ao processar pagamento",
      description: error instanceof Error ? error.message : "Ocorreu um erro ao processar seu pagamento."
    });
    throw error;
  }
};

// Get installment options
export const getInstallmentOptions = async (
  amount: number
): Promise<InstallmentOption[]> => {
  try {
    // Simulate fetching installment options
    return new Promise((resolve) => {
      setTimeout(() => {
        const options: InstallmentOption[] = [];
        const maxInstallments = 12;
        
        for (let i = 1; i <= maxInstallments; i++) {
          let installmentAmount = amount / i;
          let interestRate = 0;
          
          // Add interest after 3 installments (for simulation)
          if (i > 3) {
            interestRate = 0.019 * (i - 3); // 1.9% per month
            installmentAmount = installmentAmount * (1 + interestRate);
          }
          
          options.push({
            installments: i,
            installmentAmount,
            totalAmount: installmentAmount * i,
            interestRate: interestRate * 100 // Convert to percentage
          });
        }
        
        resolve(options);
      }, 500);
    });
  } catch (error) {
    console.error("Error getting installment options:", error);
    return [];
  }
};

// Format card number
export const formatCardNumber = (cardNumber: string): string => {
  return cardNumber
    .replace(/\s/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
