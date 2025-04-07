
// Re-export all services from the mercadoPago folder
// Import and re-export with explicit naming to avoid conflicts
export {
  initMercadoPago,
  getMercadoPagoInstance,
  initCheckoutBricks,
  createPaymentPreference,
  createCheckoutPreference,
  processCardPayment,
  getInstallmentOptions,
  formatCardNumber,
  generatePixPayment,
  generateBoletoPayment,
  formatCPF,
  validateCPF,
  formatCurrency
} from './mercadoPago';

// Re-export types
export type {
  CustomerData,
  CardData,
  CheckoutBricksOptions,
  ProductInfo,
  InstallmentOption,
  PixPaymentResponse,  // Added this export
  BoletoPaymentResponse,  // Added this export
  CheckoutResponse
} from './mercadoPago/types';

