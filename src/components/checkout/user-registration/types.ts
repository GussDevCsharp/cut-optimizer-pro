
import { SubscriptionPlan } from "@/integrations/supabase/schema";
import { PaymentStatus } from "../CheckoutModal";

// User credentials for registration
export interface UserCredentials {
  name: string;
  email: string;
  password: string;
}

// Props for the UserRegistrationCheckout component
export interface UserRegistrationCheckoutProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  planId: string;
  userCredentials: UserCredentials;
  onPaymentComplete?: (status: string, paymentId?: string) => void;
}

// Props for the PlanDisplay component
export interface PlanDisplayProps {
  plan: SubscriptionPlan | null;
}

// Props for the RegistrationSuccess component
export interface RegistrationSuccessProps {
  onClose?: () => void;
  isRegistering?: boolean;
}

// Props for the CheckoutContainer component
export interface CheckoutContainerProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
  } | null;
  customerInfo?: {
    name: string;
    email: string;
  };
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void;
}

// Typed user data for user management
export interface UserData {
  id: string;
  email: string;
  name?: string;
  isActive?: boolean;
  planType?: string;
  expirationDate?: string;
  created_at?: string;
}
