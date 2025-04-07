
// Re-export all functions and types from individual files

// Re-export from SDK functions
export {
  initMercadoPago,
  getMercadoPagoInstance,
  PUBLIC_KEY
} from './sdk';

// Re-export from checkout bricks
export {
  initCheckoutBricks
} from './checkoutBricks';

// Re-export from preferences
export {
  createPaymentPreference,
  createCheckoutPreference
} from './preferences';

// Re-export from card payment
export {
  processCardPayment,
  getInstallmentOptions,
  formatCardNumber
} from './cardPayment';

// Re-export from pix payment
export {
  generatePixPayment
} from './pixPayment';

// Re-export from boleto payment
export {
  generateBoletoPayment
} from './boletoPayment';

// Re-export from utils
export {
  formatCPF,
  validateCPF,
  formatCurrency,
  convertToMPProductInfo
} from './utils';

// Re-export types
export type {
  ProductInfo,
  CustomerData,
  CardData,
  CheckoutBricksOptions,
  InstallmentOption,
  PixPaymentResponse,
  BoletoPaymentResponse,
  CheckoutResponse,
  PaymentStatus
} from './types';
