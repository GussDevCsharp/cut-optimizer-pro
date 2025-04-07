
// Checkout Bricks functionality

import { toast } from '@/hooks/use-toast';
import { PaymentStatus } from '@/components/checkout/CheckoutModal';
import { PUBLIC_KEY, initMercadoPago } from './sdk';

// Initialize Checkout Bricks
export const initCheckoutBricks = async (
  checkoutContainerId: string,
  preferenceId: string,
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void
) => {
  try {
    // Initialize SDK
    if (!window.MercadoPago) {
      console.log("MercadoPago not initialized, initializing now...");
      await initMercadoPago();
    }
    
    console.log(`Initializing checkout brick in container: ${checkoutContainerId}`);
    
    // Add a delay to ensure the DOM is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Make sure the container exists
    const container = document.getElementById(checkoutContainerId);
    if (!container) {
      console.error(`Container with ID ${checkoutContainerId} not found. Current elements:`, 
        Array.from(document.querySelectorAll('div[id]')).map(el => el.id));
      return false;
    }
    
    console.log(`Container found with dimensions: ${container.offsetWidth}x${container.offsetHeight}`);
    
    const mp = new window.MercadoPago(PUBLIC_KEY, {
      locale: 'pt'
    });
    
    // Initialize the checkout
    const bricksBuilder = mp.bricks();
    
    const renderPaymentBrick = async () => {
      console.log(`Container found, rendering payment brick with preference: ${preferenceId}`);
      
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
            hideFormTitle: true,
            hidePaymentButton: false
          },
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            ticket: 'all',
            bankTransfer: 'all',
            atm: 'all',
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
        console.log("Creating payment brick...");
        window.paymentBrickController = await bricksBuilder.create(
          "payment",
          checkoutContainerId,
          settings
        );
        console.log("Payment brick created successfully");
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
