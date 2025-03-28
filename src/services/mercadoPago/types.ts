
// Mercado Pago client types
export interface MercadoPagoConfig {
  publicKey: string;
  accessToken?: string;
  isSandbox?: boolean;
}

export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'error';

export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CustomerData {
  name: string;
  email: string;
  identificationType: 'CPF' | 'CNPJ';
  identificationNumber: string;
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
  identificationType: 'CPF' | 'CNPJ';
  identificationNumber: string;
}

// Tipos para o SDK do MercadoPago
interface MercadoPagoCheckout {
  preference: {
    id: string;
  };
  render: {
    container: string | HTMLElement;
    label?: string;
  };
  autoOpen?: boolean;
}

// Augment Window interface
declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: any) => {
      checkout: (options: MercadoPagoCheckout) => void;
    };
    mercadoPagoInstance: any;
  }
}
