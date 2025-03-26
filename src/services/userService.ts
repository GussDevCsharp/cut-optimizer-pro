
import { supabase } from "@/integrations/supabase/client";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { AuthUser } from "@/types/auth";

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

/**
 * Verifica se usuário é admin pelo email
 */
export const isUserAdmin = (email: string): boolean => {
  // Improved admin check - accepting multiple admin emails
  const adminEmails = [
    'admin@melhorcdorte.com.br',
    'admin@exemplo.com',
    'gustavo@softcomfortaleza.com.br' // Added master admin email
  ];
  
  return adminEmails.includes(email);
};

/**
 * Obtém todos os usuários (apenas para o admin master)
 */
export const getAllUsers = async () => {
  try {
    // In a real implementation, this would fetch from a Supabase table
    // For now, we'll return mocked data
    return [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@exemplo.com',
        isActive: true,
        planType: 'Básico',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        isActive: true,
        planType: 'Profissional',
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        id: '3',
        name: 'Pedro Alves',
        email: 'pedro@exemplo.com',
        isActive: false,
        planType: 'Básico',
        expirationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        id: '4',
        name: 'Ana Pereira',
        email: 'ana@exemplo.com',
        isActive: true,
        planType: 'Empresarial',
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      },
      {
        id: '5',
        name: 'Carlos Ferreira',
        email: 'carlos@exemplo.com',
        isActive: true,
        planType: 'Profissional',
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        id: '6',
        name: 'Lúcia Oliveira',
        email: 'lucia@exemplo.com',
        isActive: false,
        planType: 'Básico',
        expirationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: '7',
        name: 'Roberto Souza',
        email: 'roberto@exemplo.com',
        isActive: true,
        planType: 'Empresarial',
        expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      },
      {
        id: '8',
        name: 'Amanda Costa',
        email: 'amanda@exemplo.com',
        isActive: true,
        planType: 'Básico',
        expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
      {
        id: '9',
        name: 'Ricardo Martins',
        email: 'ricardo@exemplo.com',
        isActive: false,
        planType: 'Profissional',
        expirationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        id: '10',
        name: 'Fernanda Lima',
        email: 'fernanda@exemplo.com',
        isActive: true,
        planType: 'Básico',
        expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      },
      {
        id: '11',
        name: 'Lucas Almeida',
        email: 'lucas@exemplo.com',
        isActive: true,
        planType: 'Profissional',
        expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      },
      {
        id: '12',
        name: 'Juliana Ribeiro',
        email: 'juliana@exemplo.com',
        isActive: false,
        planType: 'Básico',
        expirationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      }
    ];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
