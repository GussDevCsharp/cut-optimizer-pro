
// Card payment functionality
import { ProductInfo, CustomerData, CardData, InstallmentOption, CheckoutResponse } from './types';
import { PaymentStatus } from '@/components/checkout/CheckoutModal';

// Format card number as user types (e.g. 4111 1111 1111 1111)
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  
  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

// Get installment options for a product
export const getInstallmentOptions = (amount: number): InstallmentOption[] => {
  // This is a mock implementation
  // In a real scenario, you would fetch this from Mercado Pago's API
  const options: InstallmentOption[] = [];
  
  // Calculate installment options (1 to 12)
  for (let i = 1; i <= 12; i++) {
    const interestRate = i <= 3 ? 0 : 1.5 * (i - 3); // 0% for up to 3 installments, then 1.5% per additional installment
    const totalAmount = amount * (1 + interestRate / 100);
    const installmentAmount = totalAmount / i;
    
    let label = `${i}x de ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(installmentAmount)}`;
    
    if (i <= 3) {
      label += ' sem juros';
    } else {
      label += ` (total: ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(totalAmount)})`;
    }
    
    options.push({
      installments: i,
      installmentAmount,
      totalAmount,
      interestRate,
      label
    });
  }
  
  return options;
};

// Process card payment
export const processCardPayment = async (
  product: ProductInfo,
  cardData: CardData,
  customerData: CustomerData
): Promise<CheckoutResponse> => {
  // This is a mock implementation
  // In a real scenario, you would call your backend API that interacts with Mercado Pago's API
  console.log('Processing card payment for product:', product);
  console.log('Card data:', cardData);
  console.log('Customer data:', customerData);
  
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      // Simulate a successful response (90% chance)
      if (Math.random() < 0.9) {
        resolve({
          status: 'approved' as PaymentStatus,
          paymentId: `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        });
      } else {
        resolve({
          status: 'rejected' as PaymentStatus
        });
      }
    }, 2000);
  });
};
