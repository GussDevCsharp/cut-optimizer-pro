
import { ProductInfo, PaymentStatus } from '@/components/checkout/CheckoutModal';
import { toast } from '@/hooks/use-toast';

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

// Checkout Bricks interfaces
export interface CheckoutBricksOptions {
  initialization: {
    preferenceId: string;
  };
  callbacks: {
    onReady?: () => void;
    onError?: (error: any) => void;
    onSubmit?: (formData: any) => void;
  };
  customization?: {
    visual?: {
      hidePaymentButton?: boolean;
    };
  };
}

// Define the window with Mercado Pago
declare global {
  interface Window {
    MercadoPago?: any;
    MercadoPagoCheckout?: any;
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

// Initialize Checkout Bricks
export const initCheckoutBricks = async (
  checkoutContainerId: string,
  preferenceId: string,
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void
) => {
  try {
    // Initialize SDK
    if (!window.MercadoPago) {
      await initMercadoPago();
    }
    
    const mp = new window.MercadoPago(PUBLIC_KEY);
    
    // Initialize the checkout
    const bricksBuilder = mp.bricks();
    
    const renderCheckout = async () => {
      await bricksBuilder.create(
        'checkout',
        checkoutContainerId,
        {
          initialization: {
            preferenceId: preferenceId,
          },
          callbacks: {
            onReady: () => {
              console.log('Brick ready');
            },
            onSubmit: () => {
              console.log('Payment submitted');
            },
            onError: (error: any) => {
              console.error('Brick error:', error);
              toast({
                variant: "destructive",
                title: "Erro no processamento do pagamento",
                description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
              });
              
              if (onPaymentComplete) {
                onPaymentComplete('error');
              }
            },
            onPaymentMethodReceived: (paymentMethod: any) => {
              console.log('Payment method received:', paymentMethod);
            },
            onPaymentStatusReceived: (payment: any) => {
              console.log('Payment status received:', payment);
              let status: PaymentStatus = 'pending';
              
              if (payment && payment.status) {
                switch (payment.status) {
                  case 'approved':
                    status = 'approved';
                    toast({
                      title: "Pagamento aprovado!",
                      description: "Seu pagamento foi processado com sucesso.",
                    });
                    break;
                  case 'in_process':
                  case 'pending':
                    status = 'pending';
                    toast({
                      title: "Pagamento pendente",
                      description: "Seu pagamento está sendo processado.",
                    });
                    break;
                  case 'rejected':
                    status = 'rejected';
                    toast({
                      variant: "destructive",
                      title: "Pagamento rejeitado",
                      description: "Seu pagamento foi rejeitado. Por favor, tente outro método de pagamento.",
                    });
                    break;
                  default:
                    status = 'error';
                    toast({
                      variant: "destructive",
                      title: "Erro no pagamento",
                      description: "Ocorreu um erro durante o processamento do pagamento.",
                    });
                }
              }
              
              if (onPaymentComplete) {
                onPaymentComplete(status, payment?.id);
              }
            },
          }
        }
      );
    };
    
    await renderCheckout();
    return true;
  } catch (error) {
    console.error('Error initializing Checkout Bricks:', error);
    toast({
      variant: "destructive",
      title: "Erro ao inicializar pagamento",
      description: "Não foi possível inicializar o método de pagamento. Por favor, tente novamente mais tarde.",
    });
    return false;
  }
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

// Create a preference to use with Checkout Bricks
export const createCheckoutPreference = async (
  product: ProductInfo,
  customerData?: { name: string; email: string }
): Promise<{ preferenceId: string }> => {
  // In a real implementation, you would call your backend API
  // For this example, we are simulating a successful response
  console.log('Creating checkout preference for product:', product);
  
  if (customerData) {
    console.log('Customer data:', customerData);
  }
  
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      resolve({
        preferenceId: `MOCK_BRICKS_PREFERENCE_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      });
    }, 1000);
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
