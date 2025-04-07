
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
