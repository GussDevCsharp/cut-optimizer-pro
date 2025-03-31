
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isMasterAdmin: boolean;
  hasMasterAccess: boolean;
  login: (email: string, password: string) => Promise<void>;
  // Updated to return the result instead of void
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
