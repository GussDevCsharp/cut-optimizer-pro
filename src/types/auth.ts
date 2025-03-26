
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isMasterAdmin: boolean;
  hasMasterAccess: boolean;
  hasActiveSubscription?: boolean;
  subscriptionExpiryDate?: Date | null;
}
