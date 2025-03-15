
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Optimize profile data function - make it faster and more reliable
  const setUserFromSession = (currentSession: Session | null) => {
    if (!currentSession) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    
    setIsAuthenticated(true);
    
    // Extract directly from session to avoid extra database calls
    const { user: sessionUser } = currentSession;
    
    setUser({
      id: sessionUser.id,
      name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'User',
      email: sessionUser.email || '',
    });
  };

  // Initialize auth state and subscribe to changes
  useEffect(() => {
    let mounted = true;
    
    const fetchSession = async () => {
      try {
        // Get current session with a short timeout
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }
        
        if (mounted) {
          setSession(session);
          setUserFromSession(session);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Unexpected error during session fetch:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    // Optimize the auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (mounted) {
          setSession(currentSession);
          setUserFromSession(currentSession);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
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
