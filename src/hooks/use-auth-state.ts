
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Extract user data from session
  const getUserFromSession = (session: Session | null): User | null => {
    if (!session || !session.user) return null;
    
    return {
      id: session.user.id,
      name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
      email: session.user.email || '',
    };
  };

  // Initialize auth state and subscribe to changes
  useEffect(() => {
    // Set loading to true until we initialize the session
    setIsLoading(true);
    
    const fetchSession = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          
          // Extract user directly from session
          const userData = getUserFromSession(session);
          setUser(userData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Unexpected error during session fetch:", error);
        setIsLoading(false);
      }
    };

    fetchSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.info("Auth state changed:", event);
        
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession) {
          // Extract user directly from session
          const userData = getUserFromSession(currentSession);
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    session,
    isAuthenticated,
    isLoading
  };
};
