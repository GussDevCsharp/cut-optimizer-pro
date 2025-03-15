
import { supabase } from "@/integrations/supabase/client";

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async register(name: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        // For development purposes, we can set emailRedirectTo to the current window location
        emailRedirectTo: `${window.location.origin}/login`,
      }
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  },

  // Add a method to check for unconfirmed email
  isEmailNotConfirmedError(error: any) {
    return error && error.code === "email_not_confirmed";
  }
};
