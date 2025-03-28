
// Re-export card payment functions from their dedicated modules
import { processCardPayment } from './processors/cardPaymentProcessor';
import { getInstallmentOptions } from './installments';

export { processCardPayment, getInstallmentOptions };
