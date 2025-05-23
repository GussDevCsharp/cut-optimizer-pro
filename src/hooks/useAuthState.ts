
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from '@/types/auth';
import { formatSupabaseUser } from '@/services/authService';
import { isUserAdmin } from '@/services/userManagementService';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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
        }
      );
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  const handleSessionChange = async (session: Session) => {
    const supabaseUser = session.user;
    if (supabaseUser) {
      const authUser = formatSupabaseUser(supabaseUser);
      setUser(authUser);
      setIsAuthenticated(true);
      
      // Check if user is admin and update state
      const checkAdminStatus = async () => {
        const userIsAdmin = await isUserAdmin(authUser.email);
        setIsAdmin(userIsAdmin);
      };
      
      // Call the function instead of directly assigning the Promise
      checkAdminStatus();
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
