
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from '@/types/auth';
import { formatSupabaseUser, isUserAdmin } from '@/services/userService';
import { useToast } from './use-toast';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        handleSessionChange(session);
      }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state change event:", event);
          
          if (session) {
            handleSessionChange(session);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
          
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
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, [toast]);
  
  const handleSessionChange = (session: Session) => {
    const supabaseUser = session.user;
    if (supabaseUser) {
      const authUser = formatSupabaseUser(supabaseUser);
      setUser(authUser);
      setIsAuthenticated(true);
      
      // Verifica se o usuário é admin
      const userIsAdmin = isUserAdmin(authUser.email);
      setIsAdmin(userIsAdmin);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    setUser,
    setIsAuthenticated
  };
};
