
// Type definitions for Mercado Pago integration

// Product information structure
export interface ProductInfo {
  id: string;
  title: string;          // Required by Mercado Pago API
  description?: string;
  unit_price: number;     // Required by Mercado Pago API
  quantity?: number;
  currency_id?: string;
  // Keep compatibility with existing code
  name?: string;
  price?: number;
  image?: string;
}

// Customer data structure
export interface CustomerData {
  name: string;
  email: string;
  identificationType: string;
  identificationNumber: string;
  // For legacy support
  cpf?: string;
  firstName?: string;
  lastName?: string;
}

// Card payment data
export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  installments?: number;
  issuer?: string;
  identificationType?: string;
  identificationNumber?: string;
  paymentMethodId?: string;
}

// Checkout Bricks configuration
export interface CheckoutBricksOptions {
  initialization: {
    amount: number;
    preferenceId?: string;
    payer?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  customization?: {
    visual: {
      style: {
        theme: string;
      };
    };
    paymentMethods?: {
      creditCard: string;
      debitCard: string;
      ticket: string;
      bankTransfer: string;
      atm: string;
      onboarding_credits?: string;
      wallet_purchase: string;
      maxInstallments: number;
    };
  };
  callbacks: {
    onReady: () => void;
    onError: (error: any) => void;
    onSubmit: (paymentData: any) => Promise<void>;
  };
}

// Installments option returned by API
export interface InstallmentOption {
  installments: number;
  installment_amount: number;
  total_amount: number;
  payment_method_id: string;
  payment_type_id: string;
  payment_method_option_id?: string;
  label?: string;
  interestRate?: number;
}

// PIX payment response
export interface PixPaymentResponse {
  id?: string;
  qr_code: string;
  qr_code_base64?: string;
  qrCodeText?: string;
  qrCode?: string;
  status: string;
  paymentId?: string;
  expirationDate?: string;
  transactionId?: string;
  transaction_amount?: number;
}

// Boleto payment response
export interface BoletoPaymentResponse {
  id?: string;
  barcode: string;
  external_resource_url?: string;
  boletoNumber?: string;
  boletoUrl?: string;
  status: string;
  paymentId?: string;
  expirationDate?: string;
  transactionId?: string;
  transaction_amount?: number;
}

// Checkout response
export interface CheckoutResponse {
  status: PaymentStatus;
  paymentId?: string;
}

// Payment status enum - aligned with CheckoutModal.PaymentStatus
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'error' | 'in_process';

