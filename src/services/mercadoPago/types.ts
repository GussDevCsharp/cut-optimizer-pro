
// Customer data interface
export interface CustomerData {
  name: string;
  email: string;
  identificationType?: string;
  identificationNumber?: string;
}

// Card data interface
export interface CardData {
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
  // Adding missing properties for payment processing
  issuer?: string;
  installments?: number;
  paymentMethodId?: string;
}

// Product info interface
export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

// Installment option interface
export interface InstallmentOption {
  installments: number;
  installmentRate: number;
  totalAmount: number;
  installmentAmount: number;
}

// Checkout Bricks Options
export interface CheckoutBricksOptions {
  preferenceId: string;
  customization?: {
    paymentMethods?: {
      creditCard?: 'all' | 'none' | string[];
      debitCard?: 'all' | 'none' | string[];
      ticket?: 'all' | 'none' | string[];
      bankTransfer?: 'all' | 'none' | string[];
      atm?: 'all' | 'none' | string[];
      wallet_purchase?: 'all' | 'none';
      maxInstallments?: number;
    };
    visual?: {
      hideFormTitle?: boolean;
      hideValueBanner?: boolean;
    };
  };
}

// Declaration for window object to include MercadoPago
declare global {
  interface Window {
    MercadoPago: any;
    paymentBrickController: any;
  }
}
