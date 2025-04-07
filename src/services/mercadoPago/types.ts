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
}

// Checkout Bricks configuration
export interface CheckoutBricksOptions {
  initialization: {
    amount: number;
  };
  callbacks: {
    onReady: () => void;
    onError: (error: any) => void;
    onSubmit: (cardFormData: any) => void;
  };
  locale?: string;
  customization?: {
    visual: {
      style: {
        theme: string;
      };
    };
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
  qr_code: string;
  qrCodeText?: string;
  qrCode?: string;
  status: string;
  paymentId?: string;
  expirationDate?: string;
  transactionId?: string;
}

// Boleto payment response
export interface BoletoPaymentResponse {
  barcode: string;
  boletoNumber?: string;
  boletoUrl?: string;
  status: string;
  paymentId?: string;
  expirationDate?: string;
  transactionId?: string;
}

// Checkout response
export interface CheckoutResponse {
  status: PaymentStatus;
  paymentId?: string;
}

// Payment status enum
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'error' | 'in_process';
