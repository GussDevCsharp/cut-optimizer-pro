
import { CardData, CustomerData, ProductInfo, InstallmentOption } from './types';
import { PaymentStatus } from '@/components/checkout/CheckoutModal';

// Process card payment
export const processCardPayment = async (
  product: ProductInfo,
  cardData: CardData,
  customerData: CustomerData
): Promise<{ status: PaymentStatus; paymentId?: string }> => {
  // In a real implementation, you would call your backend API
  // For this example, we are simulating a successful response
  console.log('Processing card payment for product:', product);
  console.log('Card data:', cardData);
  console.log('Customer data:', customerData);
  
  return new Promise((resolve) => {
    // Simulate API call delay and processing
    setTimeout(() => {
      // Simulate a successful payment 70% of the time
      const randomSuccess = Math.random();
      if (randomSuccess < 0.7) {
        resolve({
          status: 'approved',
          paymentId: `MOCK_CARD_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        });
      } else if (randomSuccess < 0.9) {
        // Simulate a rejected payment
        resolve({
          status: 'rejected',
          paymentId: `MOCK_CARD_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        });
      } else {
        // Simulate an error
        resolve({
          status: 'error'
        });
      }
    }, 2000);
  });
};

// Get installment options
export const getInstallmentOptions = (amount: number, maxInstallments = 12): InstallmentOption[] => {
  const options = [];
  
  // Calculate installments with interest
  for (let i = 1; i <= maxInstallments; i++) {
    // Apply mock interest rates
    const interestRate = i === 1 ? 0 : i <= 3 ? 0.0199 : i <= 6 ? 0.0299 : 0.0399;
    const installmentValue = i === 1 
      ? amount 
      : (amount * Math.pow(1 + interestRate, i)) / i;
    
    const totalAmount = installmentValue * i;
    
    options.push({
      installments: i,
      installmentAmount: installmentValue,
      totalAmount: totalAmount,
      interestRate: interestRate,
      label: `${i}x de ${formatCurrency(installmentValue)}${i > 1 ? ` (${formatCurrency(totalAmount)})` : ''}`
    });
  }
  
  return options;
};

// Format card number
export const formatCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{4})(\d{4})?(\d{4})?(\d{4})?/, '$1 $2 $3 $4').trim();
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
