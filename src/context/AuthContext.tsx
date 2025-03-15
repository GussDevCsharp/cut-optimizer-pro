
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthError } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        handleSessionChange(session);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            handleSessionChange(session);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      );
      
      setIsLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  // Handle session change and set user
  const handleSessionChange = (session: Session) => {
    const supabaseUser = session.user;
    if (supabaseUser) {
      const authUser: AuthUser = {
        id: supabaseUser.id,
        name: supabaseUser?.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        email: supabaseUser.email || '',
      };
      setUser(authUser);
      setIsAuthenticated(true);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
