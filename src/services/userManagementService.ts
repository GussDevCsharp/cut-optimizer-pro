
import { MASTER_ADMIN_EMAIL } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifica se usuário é admin pelo email
 */
export const isUserAdmin = (email: string): boolean => {
  // Improved admin check - accepting multiple admin emails
  const adminEmails = [
    'admin@melhorcdorte.com.br',
    'admin@exemplo.com',
    MASTER_ADMIN_EMAIL // Using the centralized constant
  ];
  
  return adminEmails.includes(email);
};

/**
 * Verifica se o usuário tem acesso total aos dados
 */
export const hasFullDataAccess = (email: string): boolean => {
  return email === MASTER_ADMIN_EMAIL;
};

/**
 * Obtém todos os usuários com informações de assinatura
 */
export const getUsersWithSubscriptionInfo = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        created_at,
        user_subscriptions (
          id,
          plan_id,
          status,
          start_date,
          expiration_date,
          subscription_plans (
            name,
            price
          )
        )
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching users with subscription info:", error);
    return [];
  }
};

/**
 * Obtém usuários sem assinatura
 */
export const getUsersWithoutSubscription = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        created_at
      `)
      .not('id', 'in', supabase
        .from('user_subscriptions')
        .select('user_id')
      )
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching users without subscription:", error);
    return [];
  }
};

/**
 * Obtém todos os usuários com informações de assinatura
 */
export const getAllUsers = async () => {
  try {
    // Get users with active subscriptions
    const usersWithSubs = await getUsersWithSubscriptionInfo();
    
    // Get users without subscriptions
    const usersWithoutSubs = await getUsersWithoutSubscription();
    
    // Combine both lists
    return [...usersWithSubs, ...usersWithoutSubs];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
