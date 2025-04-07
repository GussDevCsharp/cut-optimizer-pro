
// Types for MercadoPago services

export interface CustomerData {
  name: string;
  email: string;
  identificationType?: string;
  identificationNumber?: string;
}

export interface ProductInfo {
  id: string;
  title: string; // Changed from name to title to match Mercado Pago API
  description: string;
  unit_price: number; // Changed from price to unit_price to match Mercado Pago API
  quantity?: number;
  currency_id?: string;
}

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
}

export interface CheckoutBricksOptions {
  initialization: {
    amount: number;
  };
  customization: {
    paymentMethods: {
      maxInstallments: number;
    };
  };
}

export interface InstallmentOption {
  installments: number;
  installmentRate: number;
  discountRate: number;
  referencedPaymentTypeId?: string;
  installmentAmount: number;
  totalAmount: number;
  paymentMethodId: string;
}

export interface PixPaymentResponse {
  id: string;
  qr_code_base64: string;
  qr_code: string;
  status: string;
  transaction_amount: number;
}

export interface BoletoPaymentResponse {
  id: string;
  barcode: string;
  external_resource_url: string;
  status: string;
  transaction_amount: number;
}

export type PaymentStatus = 'approved' | 'pending' | 'rejected' | 'error';

export interface CheckoutResponse {
  status: PaymentStatus;
  paymentId?: string;
}
