
import React, { createContext, useContext } from "react";
import { authService } from "@/services/auth-service";
import { useAuthState } from "@/hooks/use-auth-state";
import { AuthContextType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, session, isAuthenticated, isLoading } = useAuthState();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      // Session and user will be automatically updated via onAuthStateChange
      return;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Pass the error up to be handled by the Login component
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authService.register(name, email, password);

      toast({
        title: "Registro concluído!",
        description: "Verifique seu email para confirmar seu cadastro.",
      });

      return;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      
      setUser(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar fazer logout.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
