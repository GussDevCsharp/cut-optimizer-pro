
import { MASTER_ADMIN_EMAIL } from "@/context/AuthContext";
import { getUsersWithSubscriptionInfo, getUsersWithoutSubscription } from "./subscriptionService";

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
