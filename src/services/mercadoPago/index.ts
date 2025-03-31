
// Export all Mercado Pago services from one central file

// Core functionality
export { 
  initMercadoPago, 
  getMercadoPagoInstance, 
  initCheckoutBricks,
  createPaymentPreference,
  createCheckoutPreference
} from './core';

// Card payment functions
export { 
  processCardPayment, 
  getInstallmentOptions,
  formatCardNumber,
  formatCurrency
} from './cardPayment';

// Pix payment functions
export { generatePixPayment } from './pixPayment';

// Boleto payment functions
export { generateBoletoPayment } from './boletoPayment';

// Utility functions
export { formatCPF, validateCPF } from './utils';

// Types
export type { 
  CustomerData, 
  CardData, 
  CheckoutBricksOptions,
  ProductInfo,
  InstallmentOption
} from './types';
