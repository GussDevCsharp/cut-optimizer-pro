
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

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
  isLoading: boolean;
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
  const { toast } = useToast();

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
        (event, session) => {
          console.log("Auth state change event:", event);
          
          if (session) {
            handleSessionChange(session);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          
          // Show toast for specific auth events
          if (event === 'SIGNED_IN') {
            toast({
              title: "Login realizado com sucesso",
              description: "Bem-vindo de volta!",
            });
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: "Logout realizado",
              description: "Você foi desconectado com sucesso.",
            });
          } else if (event === 'USER_UPDATED') {
            toast({
              title: "Perfil atualizado",
              description: "Suas informações foram atualizadas.",
            });
          } else if (event === 'PASSWORD_RECOVERY') {
            toast({
              title: "Recuperação de senha",
              description: "Use o link enviado ao seu email para redefinir sua senha.",
            });
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
  }, [toast]);
  
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
        console.error("Login error:", error.message);
        throw error;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Provide more user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        throw new Error("Email ou senha incorretos. Verifique suas credenciais.");
      } else if (error.message.includes("Email not confirmed")) {
        throw new Error("Confirme seu email antes de fazer login. Verifique sua caixa de entrada.");
      } else {
        throw error;
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Configure custom email template settings
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        throw error;
      }
      
      // Show success toast
      toast({
        title: "Cadastro iniciado",
        description: "Verifique seu email para confirmar sua conta.",
      });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Provide more user-friendly error messages
      if (error.message.includes("User already registered")) {
        throw new Error("Este email já está cadastrado. Tente fazer login ou recuperar sua senha.");
      } else {
        throw error;
      }
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
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
