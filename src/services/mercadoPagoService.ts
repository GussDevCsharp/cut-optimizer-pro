
// Re-export all services from the mercadoPago folder
// Import and re-export with explicit naming to avoid conflicts
export {
  initMercadoPago,
  getMercadoPagoInstance,
  PUBLIC_KEY,
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
  formatCurrency,
  convertToMPProductInfo
} from './mercadoPago';

// Re-export types
export type {
  CustomerData,
  CardData,
  CheckoutBricksOptions,
  ProductInfo,
  InstallmentOption,
  PixPaymentResponse,
  BoletoPaymentResponse,
  CheckoutResponse,
  PaymentStatus
} from './mercadoPago/types';
