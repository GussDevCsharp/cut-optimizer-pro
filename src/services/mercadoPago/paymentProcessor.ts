
// This file is kept for backward compatibility
// The actual implementation has been moved to processors/ directory

import { processPayment } from './processors/paymentProcessor';
import { usePaymentProcessor } from './hooks/usePaymentProcessor';

export { processPayment, usePaymentProcessor };
