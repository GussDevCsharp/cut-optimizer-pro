
// Re-export all services from the mercadoPago folder

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
  InstallmentOption
} from './mercadoPago/types';
