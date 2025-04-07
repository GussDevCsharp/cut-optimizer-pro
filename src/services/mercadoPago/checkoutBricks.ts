
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
    
    // Define initialization and customization based on the official documentation
    const renderComponent = {
      initialization: {
        amount: amount,
        preferenceId: preferenceId
      },
      customization: {
        visual: {
          hidePaymentButton: false,
          hideFormTitle: false
        },
        paymentMethods: {
          maxInstallments: 12,
          minInstallments: 1,
          creditCard: "all",
          debitCard: "all"
        }
      },
      callbacks: {
        onReady: () => {
          console.log('Brick ready');
        },
        onSubmit: (formData: any) => {
          // This callback triggers when the user clicks on the payment button
          console.log('Payment submitted:', formData);
          return new Promise((resolve) => {
            // In a real implementation, you would send this data to your server
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
        }
      }
    };

    // Add payer information if available
    if (customerInfo && customerInfo.email) {
      (renderComponent.initialization as any).payer = {
        email: customerInfo.email
      };

      if (customerInfo.firstName) {
        (renderComponent.initialization as any).payer.firstName = customerInfo.firstName;
      }
      
      if (customerInfo.lastName) {
        (renderComponent.initialization as any).payer.lastName = customerInfo.lastName;
      }
    }

    try {
      // Create the payment brick in the specified container
      // Using the render method as specified in the documentation
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
