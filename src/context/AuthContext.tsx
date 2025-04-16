
import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { loginWithEmail, registerUser, resetPasswordEmail, logout } from "@/services/authService";

const AuthContext = createContext<AuthContextType | null>(null);

// Master admin emails - centralized constants
export const MASTER_ADMIN_EMAIL = "gustavo@softcomfortaleza.com.br";
export const ADDITIONAL_ADMIN_EMAIL = "italogustavocm@gmail.com";

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
    return await loginWithEmail(email, password);
  };

  // Modified to return the expected type structure
  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await registerUser(name, email, password);
      return { user: data?.user || null, error: null };
    } catch (error: any) {
      return { user: null, error: error };
    }
  };

  const resetPassword = async (email: string) => {
    await resetPasswordEmail(email);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Check if user is master admin or additional admin
  const isMasterAdmin = user?.email === MASTER_ADMIN_EMAIL || user?.email === ADDITIONAL_ADMIN_EMAIL;

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
