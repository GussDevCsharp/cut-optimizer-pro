
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthUser } from "@/types/auth";
import { MASTER_ADMIN_EMAIL } from "@/context/AuthContext";

/**
 * Converte um usuário do Supabase para o formato AuthUser
 */
export const formatSupabaseUser = (supabaseUser: User): AuthUser => {
  return {
    id: supabaseUser.id,
    name: supabaseUser?.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
    email: supabaseUser.email || '',
  };
};

/**
 * Obtém a sessão atual
 */
export const getCurrentSession = async () => {
  return await supabase.auth.getSession();
};

/**
 * Realiza login com email e senha
 */
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  } catch (error: any) {
    console.error("Login error:", error);
    
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Email ou senha incorretos. Verifique suas credenciais.");
    } else if (error.message.includes("Email not confirmed")) {
      throw new Error("Confirme seu email antes de fazer login. Verifique sua caixa de entrada.");
    } else {
      throw error;
    }
  }
};

/**
 * Registra um novo usuário
 */
export const registerUser = async (name: string, email: string, password: string) => {
  try {
    console.log("Iniciando registro de usuário:", { name, email });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    
    console.log("Resposta do registro:", { data, error });
    
    if (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
    
    // Verificar se o usuário foi criado com sucesso
    if (!data || !data.user) {
      throw new Error("Falha ao criar usuário. Tente novamente mais tarde.");
    }
    
    return data;
  } catch (error: any) {
    console.error("Registration error:", error);
    
    if (error.message.includes("User already registered")) {
      throw new Error("Este email já está cadastrado. Tente fazer login ou recuperar sua senha.");
    } else {
      throw error;
    }
  }
};

/**
 * Envio de email para reset de senha
 */
export const resetPasswordEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`,
    });
    
    if (error) {
      console.error("Password reset error:", error.message);
      throw error;
    }
    
  } catch (error: any) {
    console.error("Password reset error:", error);
    
    if (error.message.includes("User not found")) {
      throw new Error("Email não encontrado. Verifique se o email está correto.");
    } else {
      throw error;
    }
  }
};

/**
 * Realiza logout
 */
export const logout = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Obtém usuário pelo ID do Supabase
 */
export const getUserById = async (id: string) => {
  try {
    // The correct way to get a user is to call getUser without args if getting the current user
    // or to use the session's access token
    const { data } = await supabase.auth.getSession();
    
    if (data.session && data.session.user.id === id) {
      return formatSupabaseUser(data.session.user);
    }
    
    // If we're looking for a different user, we can't directly get them with the client SDK
    // This would typically require a server-side call or a different approach
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
