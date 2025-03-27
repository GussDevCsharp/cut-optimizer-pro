
import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { loginWithEmail, registerUser, resetPasswordEmail, logout } from "@/services/authService";

// Use the toast from sonner directly
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | null>(null);

// Master admin email - centralized constant
export const MASTER_ADMIN_EMAIL = "gustavo@softcomfortaleza.com.br";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    isAdmin
  } = useAuthState();

  const login = async (email: string, password: string) => {
    await loginWithEmail(email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    await registerUser(name, email, password);
  };

  const resetPassword = async (email: string) => {
    await resetPasswordEmail(email);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Check if user is master admin
  const isMasterAdmin = user?.email === MASTER_ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout: handleLogout,
        resetPassword,
        isAuthenticated,
        isLoading,
        isAdmin: isAdmin || isMasterAdmin,
        isMasterAdmin,
        hasMasterAccess: isMasterAdmin // Added explicit full access flag
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
