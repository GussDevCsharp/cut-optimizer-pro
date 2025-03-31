
import { User } from '@supabase/supabase-js';

// User type for authentication context
export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isMasterAdmin: boolean;
  hasMasterAccess: boolean;
  login: (email: string, password: string) => Promise<void>;
  // Updated to return the result instead of void
  register: (name: string, email: string, password: string) => Promise<{user: User | null, error: Error | null}>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
