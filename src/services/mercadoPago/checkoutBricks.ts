
// Checkout Bricks functionality
import { getMercadoPagoInstance, PUBLIC_KEY } from './sdk';
import { CustomerData } from './types';

// Define proper types for initialization
interface RenderComponentInitialization {
  amount: number;
  preferenceId: string;
  payer?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

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
    
    // Create initialization object according to Mercado Pago documentation
    const initialization: RenderComponentInitialization = {
      amount,
      preferenceId
    };
    
    // Add payer information if available
    if (customerInfo && customerInfo.email) {
      initialization.payer = {
        email: customerInfo.email
      };

      if (customerInfo.firstName) {
        initialization.payer.firstName = customerInfo.firstName;
      }
      
      if (customerInfo.lastName) {
        initialization.payer.lastName = customerInfo.lastName;
      }
    }
    
    // Define rendering configuration according to official documentation
    const renderComponent = {
      initialization,
      customization: {
        visual: {
          hideFormTitle: false,
          hidePaymentButton: false
        },
        paymentMethods: {
          maxInstallments: 12,
          minInstallments: 1,
          creditCard: 'all',
          debitCard: 'all'
        }
      },
      callbacks: {
        onReady: () => {
          console.log('Brick ready');
        },
        onSubmit: (cardFormData: any) => {
          // This callback triggers when the user clicks on the payment button
          console.log('Payment submitted:', cardFormData);
          return new Promise<void>((resolve, reject) => {
            // In a real implementation, you would send this data to your server
            setTimeout(() => {
              if (onComplete) {
                onComplete('approved', `MOCK_PAYMENT_${Date.now()}`);
              }
              resolve();
            }, 2000);
          });
        },
        onError: (error: any) => {
          console.error('Brick error:', error);
          if (onComplete) {
            onComplete('error');
          }
        }
      }
    };

    try {
      // Create the payment brick in the specified container with the correct syntax
      await bricksBuilder.create('payment', containerId, renderComponent);
      
      console.log('Payment brick created successfully');
      return true;
    } catch (error) {
      console.error('Error creating payment brick:', error);
      return false;
    }
  } catch (error) {
    console.error('Error initializing checkout brick:', error);
    return false;
  }
};
