
// Checkout Bricks functionality
import { getMercadoPagoInstance, PUBLIC_KEY } from './sdk';
import { CustomerData } from './types';

// Map of payment statuses
const paymentStatusMapping = {
  approved: 'approved',
  rejected: 'rejected',
  pending: 'pending',
  in_process: 'pending',
  error: 'error'
};

// Initialize the checkout bricks
export const initCheckoutBricks = async (
  containerId: string,
  preferenceId: string,
  amount: number,
  customerInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  },
  onComplete?: (status: 'approved' | 'rejected' | 'pending' | 'error', paymentId?: string) => void
): Promise<boolean> => {
  try {
    console.log(`Initializing checkout brick in container: ${containerId}`);
    
    // Check if container exists in DOM
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found in DOM`);
      return false;
    }
    
    // Log container dimensions to help debug rendering issues
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    console.log(`Container found with dimensions: ${width}x${height}`);
    
    // Get MercadoPago instance
    const mp = await getMercadoPagoInstance();
    
    if (!mp) {
      console.error('Failed to get MercadoPago instance');
      return false;
    }
    
    // Create bricks builder
    const bricksBuilder = mp.bricks();
    
    console.log(`Creating payment brick...`);
    
    // Using the format from the example provided
    const settings = {
      initialization: {
        amount: amount,
        preferenceId: preferenceId,
      },
      customization: {
        visual: {
          style: {
            theme: 'flat',
          },
        },
        paymentMethods: {
          creditCard: "all",
          debitCard: "all",
          ticket: "all",
          bankTransfer: "all",
          wallet_purchase: "all",
          maxInstallments: 12
        },
      },
      callbacks: {
        onReady: () => {
          console.log('Brick ready');
        },
        onSubmit: ({ selectedPaymentMethod, formData }: any) => {
          // This would normally call your backend to process payment
          // For our mock implementation, we'll resolve immediately
          console.log('Payment submitted:', selectedPaymentMethod, formData);
          return new Promise((resolve) => {
            setTimeout(() => {
              if (onComplete) {
                onComplete('approved', `MOCK_PAYMENT_${Date.now()}`);
              }
              resolve(true);
            }, 2000);
          });
        },
        onError: (error: any) => {
          console.error('Brick error:', error);
          if (onComplete) {
            onComplete('error');
          }
        },
      },
    };
    
    // If we have customer info, add it to the initialization
    if (customerInfo) {
      settings.initialization.payer = {
        firstName: customerInfo.firstName || '',
        lastName: customerInfo.lastName || '',
        email: customerInfo.email || '',
      };
    }
    
    try {
      // Create the payment brick in the specified container
      const paymentBrick = await bricksBuilder.create(
        'payment',
        containerId,
        settings
      );
      
      console.log('Payment brick created successfully');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } catch (error) {
    console.error('Error initializing checkout brick:', error);
    return false;
  }
};
