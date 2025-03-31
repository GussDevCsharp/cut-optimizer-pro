
import { PaymentStatus } from '../CheckoutModal';

export interface UserCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UserRegistrationCheckoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  userCredentials: UserCredentials;
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void;
}

export interface RegistrationSuccessProps {
  isRegistering: boolean;
}

export interface PlanDisplayProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
  } | null;
}

export interface CheckoutContainerProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
  } | null;
  customerInfo: {
    name: string;
    email: string;
  };
  onPaymentComplete: (status: PaymentStatus, paymentId?: string) => void;
}
