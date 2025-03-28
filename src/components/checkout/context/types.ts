
import { PaymentStatus, ProductInfo } from '../CheckoutModal';

export interface PaymentContextType {
  paymentMethod: 'pix' | 'card' | 'boleto';
  setPaymentMethod: (method: 'pix' | 'card' | 'boleto') => void;
  paymentStatus: PaymentStatus;
  setPaymentStatus: (status: PaymentStatus) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  paymentId: string | undefined;
  setPaymentId: (id: string | undefined) => void;
  handlePaymentComplete: (status: PaymentStatus, id?: string) => Promise<void>;
  isSandbox: boolean;
  // Transaction tracking fields
  transactionSteps: string[];
  currentStep: number;
  transactionStatus: 'idle' | 'processing' | 'success' | 'error';
  updateTransactionStep: (step: number, status?: 'idle' | 'processing' | 'success' | 'error') => void;
  startTransaction: (steps: string[]) => void;
  resetTransaction: () => void;
}

export interface PaymentProviderProps {
  children: React.ReactNode;
  product: ProductInfo;
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void;
  isSandbox: boolean;
}
