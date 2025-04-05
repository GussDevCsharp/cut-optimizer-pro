
import { toast } from '@/hooks/use-toast';
import { ProductInfo, CheckoutBricksOptions, CustomerData } from './types';
import { PaymentStatus } from '@/components/checkout/CheckoutModal';

// This would be your public key from Mercado Pago
// In production, you would likely store this in an environment variable
// For sandbox testing, we're using a test public key
const PUBLIC_KEY = 'TEST-8f683d0c-1025-48db-8f1e-dae8d7f94a15';

// Initialize Mercado Pago SDK
export const initMercadoPago = async (): Promise<void> => {
  if (window.MercadoPago) return Promise.resolve();
  
  return new Promise<void>((resolve, reject) => {
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
  return new window.MercadoPago(PUBLIC_KEY, {
    locale: 'pt'
  });
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
    
    const mp = new window.MercadoPago(PUBLIC_KEY, {
      locale: 'pt'
    });
    
    // Initialize the checkout
    const bricksBuilder = mp.bricks();
    
    const renderPaymentBrick = async () => {
      const settings = {
        initialization: {
          preferenceId: preferenceId,
          // We'll use the preferenceId to determine the amount in the backend
        },
        customization: {
          visual: {
            style: {
              theme: 'default',
            },
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            ticket: 'all',
            bankTransfer: 'all',
            atm: 'all',
            onboarding_credits: 'all',
            wallet_purchase: 'all',
            maxInstallments: 12
          },
        },
        callbacks: {
          onReady: () => {
            console.log('Brick ready');
          },
          onSubmit: ({ selectedPaymentMethod, formData }) => {
            console.log('Payment submitted', selectedPaymentMethod, formData);
            // In a real integration, you would send this data to your backend
            return new Promise<void>((resolve) => {
              // For demo purposes, we'll just resolve immediately
              // In a real integration, you would post to your backend
              setTimeout(() => {
                resolve();
              }, 1000);
            });
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
      };
      
      try {
        window.paymentBrickController = await bricksBuilder.create(
          "payment",
          checkoutContainerId,
          settings
        );
        return true;
      } catch (error) {
        console.error('Error creating Payment Brick:', error);
        return false;
      }
    };
    
    const success = await renderPaymentBrick();
    return success;
  } catch (error) {
    console.error('Error initializing Payment Brick:', error);
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
  customerData?: CustomerData
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
