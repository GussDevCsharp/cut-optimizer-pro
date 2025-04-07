
// Type definitions for Mercado Pago integration
import { PaymentStatus } from '@/components/checkout/CheckoutModal';

export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CustomerData {
  name?: string;
  email?: string;
  identificationType?: string;
  identificationNumber?: string;
}

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  installments: number;
}

export interface CheckoutBricksOptions {
  initialization: {
    preferenceId?: string;
    amount?: number;
  };
  customization: {
    visual: {
      hideFormTitle?: boolean;
      hidePaymentButton?: boolean;
    };
  };
  callbacks: {
    onReady: () => void;
    onError: (error: any) => void;
    onSubmit: (data: any) => Promise<void>;
  };
}

export interface InstallmentOption {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  interestRate: number;
}

export interface CheckoutResponse {
  status: PaymentStatus;
  paymentId?: string;
}
