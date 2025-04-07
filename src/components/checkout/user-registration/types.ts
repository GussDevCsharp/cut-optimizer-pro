
import { SubscriptionPlan } from '@/integrations/supabase/schema';

export interface UserCredentials {
  name: string;
  email: string;
  password: string;
}

export interface CheckoutContainerProps {
  plan: SubscriptionPlan | null;
  customerInfo?: {
    name: string;
    email: string;
  };
  onPaymentComplete?: (status: string, paymentId?: string) => void;
  openInNewTab?: boolean;
}

export interface OrderSummaryProps {
  plan: SubscriptionPlan | null;
}

export interface UserDataReviewFormProps {
  userCredentials: UserCredentials;
  onDataChange?: (data: UserCredentials) => void;
  disabled?: boolean;
}

// Adding the missing interfaces:
export interface PlanDisplayProps {
  plan: SubscriptionPlan | null;
}

export interface RegistrationSuccessProps {
  isRegistering: boolean;
  onClose?: () => void;
}

export interface UserRegistrationCheckoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  userCredentials: UserCredentials;
  onPaymentComplete?: (status: string, paymentId?: string) => void;
}

// For UserManagementPanel.tsx - Adding the missing properties
export interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt?: string;
  // Add the missing properties used in UserManagementPanel.tsx
  isActive: boolean;
  expirationDate?: string;
  planType?: string;
}
