import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { MASTER_ADMIN_EMAIL, ADDITIONAL_ADMIN_EMAIL } from '@/context/AuthContext';

/**
 * Get all users from the database
 */
export const getAllUsers = async () => {
  try {
    // First get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      throw authError;
    }
    
    // Get user profiles for additional information
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }
    
    // Get subscriptions information
    const { data: subscriptions, error: subsError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('status', 'active');
    
    if (subsError) {
      console.error("Error fetching subscriptions:", subsError);
    }
    
    // Merge the data
    const users = authUsers?.users.map(user => {
      const profile = profiles?.find(p => p.id === user.id);
      const subscription = subscriptions?.find(s => s.user_id === user.id);
      
      // Check for lifetime plan for specific user
      const hasLifetimePlan = user.email === ADDITIONAL_ADMIN_EMAIL;
      
      return {
        ...user,
        profile,
        subscription: hasLifetimePlan ? { 
          status: 'active',
          is_lifetime: true,
        } : subscription
      };
    });
    
    return users || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    toast({
      variant: "destructive",
      title: "Erro ao obter usuários",
      description: "Não foi possível listar os usuários do sistema."
    });
    return [];
  }
};

/**
 * Get a user's subscription plan
 */
export const getUserSubscriptionPlan = async (userId: string) => {
  try {
    // First check if this is the user with lifetime access
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) throw userError;
    
    if (user && user.email === ADDITIONAL_ADMIN_EMAIL) {
      return {
        status: 'active',
        is_lifetime: true,
        plan_name: 'Vitalício',
        plan_price: 0
      };
    }
    
    // Otherwise, get active subscription for user
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*, plan_id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (subError) throw subError;
    
    if (!subscription) return null;
    
    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('name, price')
      .eq('id', subscription.plan_id)
      .maybeSingle();
    
    if (planError) throw planError;
    
    if (!plan) return null;
    
    return {
      ...subscription,
      plan_name: plan.name,
      plan_price: plan.price
    };
  } catch (error) {
    console.error("Error fetching user subscription plan:", error);
    return null;
  }
};

/**
 * Update user admin status
 */
export const updateUserAdminStatus = async (userId: string, isAdmin: boolean) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast({
      title: "Atualização bem-sucedida",
      description: `Usuário ${isAdmin ? 'promovido a administrador' : 'removido como administrador'} com sucesso.`
    });
    
    return true;
  } catch (error) {
    console.error("Error updating user admin status:", error);
    toast({
      variant: "destructive",
      title: "Erro ao atualizar status",
      description: "Não foi possível atualizar o status de administrador do usuário."
    });
    return false;
  }
};

// Check if user is an admin
export const isUserAdmin = (email: string): boolean => {
  if (!email) return false;
  
  // Check if email matches any of the admin emails
  return email === MASTER_ADMIN_EMAIL || email === ADDITIONAL_ADMIN_EMAIL;
};

// Check if user has full data access
export const hasFullDataAccess = (userId: string): boolean => {
  // For this example, we'll consider that only admins have full data access
  // In a real application, this would check against the database
  return false; // Default to false for regular users
};

// Check if user has lifetime access
export const hasLifetimeAccess = (email: string): boolean => {
  return email === ADDITIONAL_ADMIN_EMAIL;
};
