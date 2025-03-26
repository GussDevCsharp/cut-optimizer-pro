
import { ProductInfo } from '@/components/checkout/CheckoutModal';

// This would be your public key from Mercado Pago
// In production, you would likely store this in an environment variable
// For sandbox testing, we're using a test public key
const PUBLIC_KEY = 'TEST-8f683d0c-1025-48db-8f1e-dae8d7f94a15';

// Interface for customer data
export interface CustomerData {
  name: string;
  email: string;
  identificationType: string;
  identificationNumber: string;
}

// Interface for credit card data
export interface CardData {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  issuer: string;
  installments: number;
  paymentMethodId: string;
  identificationType?: string;
  identificationNumber?: string;
}

// Define the window with Mercado Pago
declare global {
  interface Window {
    MercadoPago?: any;
  }
}

// Initialize Mercado Pago SDK
export const initMercadoPago = async (): Promise<void> => {
  if (window.MercadoPago) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    try {
      // Create script element
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.type = 'text/javascript';
      script.onload = () => {
        if (window.MercadoPago) {
          window.MercadoPago.setPublishableKey(PUBLIC_KEY);
          resolve();
        } else {
          reject(new Error('MercadoPago SDK failed to load'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load MercadoPago SDK'));
      };
      document.body.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

// Get Mercado Pago instance
export const getMercadoPagoInstance = () => {
  if (!window.MercadoPago) {
    throw new Error('MercadoPago not initialized. Call initMercadoPago first.');
  }
  return new window.MercadoPago(PUBLIC_KEY);
};

// Create payment preference (would be called from your backend)
// This is a mock function. In a real implementation, this would make a call to your backend
export const createPaymentPreference = async (
  product: ProductInfo, 
  paymentMethod: 'pix' | 'card' | 'boleto'
): Promise<{ preferenceId: string }> => {
  // In a real implementation, you would call your backend API that interacts with Mercado Pago's API
  // For this example, we're simulating a successful response
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({
        preferenceId: `MOCK_PREFERENCE_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      });
    }, 1000);
  });
};

// Process card payment (mock implementation)
export const processCardPayment = async (
  product: ProductInfo,
  cardData: CardData,
  customer: CustomerData
) => {
  // In a real implementation, this would tokenize the card and send to your backend
  console.log('Processing card payment:', { product, cardData, customer });
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock payment response
      resolve({
        status: 'approved',
        paymentId: `MOCK_PAYMENT_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      });
    }, 2000);
  });
};

// Generate Pix payment (mock implementation)
export const generatePixPayment = async (product: ProductInfo, customer: CustomerData) => {
  console.log('Generating Pix payment:', { product, customer });
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Pix response
      resolve({
        status: 'pending',
        paymentId: `MOCK_PIX_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABlBMVEX///8AAABVwtN+AAABX0lEQVRYw+2YS47DMAxDfYFeoEfz0T2ajyYXqCXK+bWTTDB1UbctIOuxBEuUQtqypS3Df2REp6xtXzJPXi3N5DBx7rLQOa/lwZw1G8rWYyF/0qQtr4Y8mzMuW7/EceS9MR5EnUZz+3kwx01Dybs5VzZq++U6Z8Phuc6/Y1U4A9hsBPjL5mGPcNSsOf5suzgM35vj55hT+25OXDk+Rd9xPD00Z89L7eaIatuU7b05fgx0yGl7lhmDyw4j45KryFGzv2YWjDNuDJFrC+fNwRlUWYJjbxfOJuXQTBhnME6J2zPAMXNw2+LE4Dhv4UgsbMxpn6e5M47jdkF+86Jtbn4ezmCcYnW7jDzk6ONBC8eNx7k8cO5uE4fY0hyVE/Zws1rnPYcVnFhXD86bmXOqs2FNz67cGefGm26Mh1F2aK9aLhYfjtqWu3cLyiRmzOFamDN5tSTnVh2aWW3ptLFE5tSrNUdm+L/2AVJXvUVHpOd7AAAAAElFTkSuQmCC',
        qrCodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADIAQMAAACXljzdAAAABlBMVEX///8AAABVwtN+AAABX0lEQVRYw+2YS47DMAxDfYFeoEfz0T2ajyYXqCXK+bWTTDB1UbctIOuxBEuUQtqypS3Df2REp6xtXzJPXi3N5DBx7rLQOa/lwZw1G8rWYyF/0qQtr4Y8mzMuW7/EceS9MR5EnUZz+3kwx01Dybs5VzZq++U6Z8Phuc6/Y1U4A9hsBPjL5mGPcNSsOf5suzgM35vj55hT+25OXDk+Rd9xPD00Z89L7eaIatuU7b05fgx0yGl7lhmDyw4j45KryFGzv2YWjDNuDJFrC+fNwRlUWYJjbxfOJuXQTBhnME6J2zPAMXNw2+LE4Dhv4UgsbMxpn6e5M47jdkF+86Jtbn4ezmCcYnW7jDzk6ONBC8eNx7k8cO5uE4fY0hyVE/Zws1rnPYcVnFhXD86bmXOqs2FNz67cGefGm26Mh1F2aK9aLhYfjtqWu3cLyiRmzOFamDN5tSTnVh2aWW3ptLFE5tSrNUdm+L/2AVJXvUVHpOd7AAAAAElFTkSuQmCC',
        qrCodeText: '00020126580014br.gov.bcb.pix0136.0ae94857-c1bd-4782-9682-45b579795e395204000053039865802BR5921Merchant Name Example6009SAO PAULO61080540900062070503***63044C2C',
        expirationDate: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
      });
    }, 1500);
  });
};

// Generate Boleto payment (mock implementation)
export const generateBoletoPayment = async (product: ProductInfo, customer: CustomerData) => {
  console.log('Generating Boleto payment:', { product, customer });
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Boleto response
      resolve({
        status: 'pending',
        paymentId: `MOCK_BOLETO_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        boletoNumber: '34191.79001 01043.510047 91020.150008 9 89110000041270',
        boletoUrl: 'https://www.mercadopago.com.br/sandbox',
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60000).toISOString(), // 3 days from now
      });
    }, 1500);
  });
};

// Helper functions
export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{4})(\d{4})?(\d{4})?(\d{4})?/, '$1 $2 $3 $4').trim();
};

export const validateCPF = (cpf: string): boolean => {
  const strCPF = cpf.replace(/\D/g, '');
  if (strCPF.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(strCPF)) return false;
  
  // Simple validation - in a real app you would use a more robust validation
  return true;
};

export const getInstallmentOptions = (amount: number, maxInstallments = 12) => {
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

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
