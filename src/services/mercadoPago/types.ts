
import { ProductInfo, PaymentStatus } from '@/components/checkout/CheckoutModal';

// Interface for customer data
export interface CustomerData {
  name: string;
  email: string;
  identificationType: string;
  identificationNumber: string;
}

// Interface for credit card data
export interface CardData {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  issuer: string;
  installments: number;
  paymentMethodId: string;
  identificationType?: string;
  identificationNumber?: string;
}

// Define MercadoPago on the window object
declare global {
  interface Window {
    MercadoPago?: any;
  }
}

// Re-export needed types from CheckoutModal
export type { ProductInfo, PaymentStatus };
