
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user profile data from Supabase
  const fetchUserProfile = async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return null;
    }
    
    return profileData;
  };

  // Set user state based on profile data
  const setUserFromProfile = (profileData: any, email: string | undefined) => {
    if (profileData) {
      setUser({
        id: profileData.id,
        name: profileData.name || email?.split('@')[0] || 'User',
        email: profileData.email || email || '',
      });
    }
  };

  // Initialize auth state and subscribe to changes
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }
        
        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          
          const profileData = await fetchUserProfile(session.user.id);
          setUserFromProfile(profileData, session.user.email);
        }
      } catch (error) {
        console.error("Unexpected error during session fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession) {
          const profileData = await fetchUserProfile(currentSession.user.id);
          setUserFromProfile(profileData, currentSession.user.email);
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
