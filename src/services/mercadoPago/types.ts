
// Types for MercadoPago services

export interface CustomerData {
  name: string;
  email: string;
  cpf?: string; // Added cpf field
  identificationType?: string;
  identificationNumber?: string;
}

export interface ProductInfo {
  id: string;
  title: string; 
  description: string;
  unit_price: number;
  quantity?: number;
  currency_id?: string;
  // Add fields from CheckoutModal.ProductInfo for compatibility
  name?: string;
  price?: number;
}

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  identificationType: string;
  identificationNumber: string;
  installments?: number; // Added installments field
  issuer?: string;
  paymentMethodId?: string;
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
  interestRate?: number; // Added interestRate field
  label?: string; // Added label field
}

export interface PixPaymentResponse {
  id: string;
  qr_code_base64: string;
  qr_code: string;
  status: PaymentStatus;
  transaction_amount: number;
  // Add fields needed by the components
  paymentId?: string;
  qrCode?: string;
  qrCodeText?: string;
  qrCodeBase64?: string;
  expirationDate?: string;
}

export interface BoletoPaymentResponse {
  id: string;
  barcode: string;
  external_resource_url: string;
  status: PaymentStatus;
  transaction_amount: number;
  // Add fields needed by the components
  paymentId?: string;
  boletoNumber?: string;
  boletoUrl?: string;
  expirationDate?: string;
}

export type PaymentStatus = 'approved' | 'pending' | 'rejected' | 'error';

export interface CheckoutResponse {
  status: PaymentStatus;
  paymentId?: string;
}
