
// Checkout Bricks functionality

import { toast } from '@/hooks/use-toast';
import { PaymentStatus } from './types';
import { PUBLIC_KEY, initMercadoPago } from './sdk';

// Initialize Checkout Bricks
export const initCheckoutBricks = async (
  checkoutContainerId: string,
  preferenceId: string,
  amount: number,
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
  },
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void
) => {
  try {
    // Initialize SDK
    if (!window.MercadoPago) {
      console.log("MercadoPago not initialized, initializing now...");
      await initMercadoPago();
    }
    
    console.log(`Initializing checkout brick in container: ${checkoutContainerId}`);
    
    // Make sure the container exists
    let container = document.getElementById(checkoutContainerId);
    
    // Try multiple times to find the container with increasing delays
    if (!container) {
      console.log("Container not found initially, waiting for DOM to update...");
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        container = document.getElementById(checkoutContainerId);
        if (container) {
          console.log(`Container found after ${i+1} attempts`);
          break;
        }
      }
    }
    
    if (!container) {
      console.error(`Container with ID ${checkoutContainerId} not found after multiple attempts. Current elements:`, 
        Array.from(document.querySelectorAll('div[id]')).map(el => el.id));
      return false;
    }
    
    // Check container dimensions and ensure it has proper size
    console.log(`Container found with dimensions: ${container.offsetWidth}x${container.offsetHeight}`);
    
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      console.log("Container has zero dimensions, setting minimum dimensions");
      container.style.minHeight = "400px";
      container.style.minWidth = "100%";
    }
    
    // Create Mercado Pago instance
    const mp = new window.MercadoPago(PUBLIC_KEY, {
      locale: 'pt-BR'  // Use pt-BR for Brazilian Portuguese
    });
    
    // Initialize the checkout
    const bricksBuilder = mp.bricks();
    
    const renderPaymentBrick = async () => {
      console.log(`Rendering payment brick with preference: ${preferenceId}`);
      
      const settings = {
        initialization: {
          amount: amount, // Montante total a pagar
          preferenceId: preferenceId,
          payer: customerInfo ? {
            firstName: customerInfo.firstName || "",
            lastName: customerInfo.lastName || "",
            email: customerInfo.email || "",
          } : undefined,
        },
        customization: {
          visual: {
            style: {
              theme: 'flat',  // Use o tema flat como no exemplo
            },
            hideFormTitle: true,
            hidePaymentButton: false
          },
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            ticket: "all",
            bankTransfer: "all",
            atm: "all",
            onboarding_credits: "all",
            wallet_purchase: "all",
            maxInstallments: 12
          },
        },
        callbacks: {
          onReady: () => {
            console.log('Brick ready');
          },
          onSubmit: ({ selectedPaymentMethod, formData }) => {
            console.log('Payment submitted', selectedPaymentMethod, formData);
            // Simulando o envio para um servidor backend
            return new Promise<void>((resolve, reject) => {
              // Simulamos um processamento no servidor
              setTimeout(() => {
                console.log("Processamento de pagamento simulado concluído");
                resolve();
                
                // Notificar sobre o status do pagamento (normalmente seria feito após o retorno do servidor)
                if (onPaymentComplete) {
                  setTimeout(() => {
                    // Simular sucesso na maioria dos casos
                    const success = Math.random() > 0.2;
                    if (success) {
                      onPaymentComplete('approved', `payment_${Date.now()}`);
                    } else {
                      onPaymentComplete('pending');
                    }
                  }, 1000);
                }
              }, 1500);
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
