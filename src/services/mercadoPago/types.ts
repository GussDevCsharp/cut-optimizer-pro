
import { PaymentStatus } from '@/components/checkout/CheckoutModal';

// Re-export the types from the original file
export interface CustomerData {
  name: string;
  email: string;
  identificationType?: string;
  identificationNumber?: string;
}

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

export interface CheckoutBricksOptions {
  initialization: {
    preferenceId: string;
  };
  callbacks: {
    onReady?: () => void;
    onError?: (error: any) => void;
    onSubmit?: (formData: any) => void;
  };
  customization?: {
    visual?: {
      hidePaymentButton?: boolean;
    };
  };
}

declare global {
  interface Window {
    MercadoPago?: any;
    MercadoPagoCheckout?: any;
  }
}

export type ProductInfo = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
};

export interface InstallmentOption {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  interestRate: number;
  label: string;
}
