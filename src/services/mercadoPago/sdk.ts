
// MercadoPago SDK initialization
import { PaymentStatus } from '../mercadoPago/types';

// Public key for MercadoPago - in a real application, this would be stored in an environment variable
export const PUBLIC_KEY = 'TEST-743d9b96-571d-4f27-8d36-a3c40fb4a489';

let mercadoPagoInstance: any = null;

// Initialize MercadoPago SDK
export const initMercadoPago = async (): Promise<boolean> => {
  try {
    // Check if the SDK is already loaded
    if (window.MercadoPago) {
      console.log('MercadoPago SDK already loaded');
      return true;
    }

    return new Promise((resolve) => {
      // Create script element
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      // Handle script load event
      script.onload = () => {
        console.log('MercadoPago SDK loaded successfully');
        resolve(true);
      };
      
      // Handle script error event
      script.onerror = () => {
        console.error('Failed to load MercadoPago SDK');
        resolve(false);
      };
      
      // Add script to document
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error initializing MercadoPago SDK:', error);
    return false;
  }
};

// Get an instance of MercadoPago
export const getMercadoPagoInstance = async (): Promise<any> => {
  if (mercadoPagoInstance) {
    return mercadoPagoInstance;
  }
  
  // Make sure SDK is loaded
  const isInitialized = await initMercadoPago();
  if (!isInitialized) {
    console.error('MercadoPago SDK is not initialized');
    return null;
  }
  
  try {
    // Create a new MercadoPago instance
    if (window.MercadoPago) {
      mercadoPagoInstance = new window.MercadoPago(PUBLIC_KEY, {
        locale: 'pt-BR'
      });
      return mercadoPagoInstance;
    } else {
      console.error('MercadoPago is not available');
      return null;
    }
  } catch (error) {
    console.error('Error creating MercadoPago instance:', error);
    return null;
  }
};
