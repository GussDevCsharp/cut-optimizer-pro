
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
