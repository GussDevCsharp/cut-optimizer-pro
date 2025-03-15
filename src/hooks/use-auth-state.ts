
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
    try {
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
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
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
    let mounted = true;
    
    const fetchSession = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (session) {
          if (mounted) {
            setSession(session);
            setIsAuthenticated(true);
          
            const profileData = await fetchUserProfile(session.user.id);
            
            if (mounted) {
              setUserFromProfile(profileData, session.user.email);
              setIsLoading(false);
            }
          }
        } else {
          if (mounted) setIsLoading(false);
        }
      } catch (error) {
        console.error("Unexpected error during session fetch:", error);
        if (mounted) setIsLoading(false);
      }
    };

    fetchSession();

    // Subscribe to auth state changes - using a faster response approach
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (mounted) {
          setSession(currentSession);
          setIsAuthenticated(!!currentSession);
          
          if (currentSession) {
            const profileData = await fetchUserProfile(currentSession.user.id);
            if (mounted) {
              setUserFromProfile(profileData, currentSession.user.email);
            }
          } else {
            setUser(null);
          }
          
          // Make sure we're not stuck in loading state
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
