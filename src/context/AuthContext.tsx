
import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { loginWithEmail, registerUser, resetPasswordEmail, logout } from "@/services/userService";

// Removemos a importação do toast, pois ela estava causando dependência circular
// import { toast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | null>(null);

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
  const isMasterAdmin = user?.email === "gustavo@softcomfortaleza.com.br";

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
        isAdmin: isAdmin || isMasterAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
