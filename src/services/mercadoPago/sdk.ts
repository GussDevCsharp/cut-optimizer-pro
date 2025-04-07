
// SDK initialization functions

import { toast } from '@/hooks/use-toast';

// This would be your public key from Mercado Pago
// In production, you would likely store this in an environment variable
// For sandbox testing, we're using a test public key
export const PUBLIC_KEY = 'TEST-8f683d0c-1025-48db-8f1e-dae8d7f94a15';

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
          // Note: MercadoPago v2 SDK doesn't have setPublishableKey method
          // It's instantiated with the key instead
          console.log("MercadoPago SDK loaded successfully");
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
