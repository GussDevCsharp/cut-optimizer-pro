import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

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
      
      return {
        ...user,
        profile,
        subscription
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
    // Get active subscription for user
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
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data?.role === 'admin' || data?.role === 'master_admin';
  } catch (error) {
    console.error('Error in isUserAdmin:', error);
    return false;
  }
};

// Check if user has full data access
export const hasFullDataAccess = async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  // First check if user is admin (admins always have full access)
  const isAdmin = await isUserAdmin(userId);
  if (isAdmin) return true;

  try {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('full_data_access')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking data access:', error);
      return false;
    }

    return !!data?.full_data_access;
  } catch (error) {
    console.error('Error in hasFullDataAccess:', error);
    return false;
  }
};
