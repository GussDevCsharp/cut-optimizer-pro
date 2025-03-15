
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
        }
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
  }
};
