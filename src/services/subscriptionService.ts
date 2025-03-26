
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan, UserSubscription, PaymentHistory } from "@/integrations/supabase/schema";

/**
 * Retrieves all subscription plans
 */
export const getAllSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
};

/**
 * Gets the current user's subscription
 */
export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_plans(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return null;
  }
};

/**
 * Creates a new subscription for a user
 */
export const createSubscription = async (
  userId: string, 
  planId: string, 
  autoRenew: boolean = true
): Promise<UserSubscription | null> => {
  try {
    // Get plan details to calculate expiration date
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
      
    if (planError) throw planError;
    
    const startDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + plan.duration_days);
    
    // Create subscription
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        start_date: startDate.toISOString(),
        expiration_date: expirationDate.toISOString(),
        auto_renew: autoRenew
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

/**
 * Record a payment in the payment history
 */
export const recordPayment = async (
  userId: string,
  subscriptionId: string,
  amount: number,
  paymentMethod: 'pix' | 'card' | 'boleto',
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'error',
  paymentId: string
): Promise<PaymentHistory | null> => {
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        amount,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        payment_id: paymentId
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error recording payment:", error);
    throw error;
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'canceled',
        auto_renew: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
};

/**
 * Check if a user has an active subscription
 */
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('expiration_date', new Date().toISOString());
      
    if (error) throw error;
    return (count || 0) > 0;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
};

/**
 * Get subscription expiration info for all users
 * Used by admin panel to display user subscription status
 */
export const getUsersWithSubscriptionInfo = async () => {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        status,
        start_date,
        expiration_date,
        auto_renew,
        profiles:user_id (
          id,
          email,
          full_name,
          created_at
        ),
        plans:plan_id (
          name,
          price
        )
      `)
      .order('expiration_date', { ascending: true });
      
    if (error) throw error;
    
    // Transform the data to a more usable format
    return (data || []).map(subscription => ({
      id: subscription.profiles.id,
      name: subscription.profiles.full_name,
      email: subscription.profiles.email,
      isActive: subscription.status === 'active' && new Date(subscription.expiration_date) > new Date(),
      planType: subscription.plans.name,
      expirationDate: new Date(subscription.expiration_date),
      subscriptionId: subscription.id,
      autoRenew: subscription.auto_renew
    }));
  } catch (error) {
    console.error("Error fetching users with subscription info:", error);
    throw error;
  }
};

/**
 * Get users without subscriptions
 */
export const getUsersWithoutSubscription = async () => {
  try {
    // This query is complex in SQL, so we'll do it in two steps
    
    // 1. Get all user IDs
    const { data: allUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at');
      
    if (usersError) throw usersError;
    
    // 2. Get all user IDs with active subscriptions
    const { data: usersWithSubs, error: subsError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('status', 'active');
      
    if (subsError) throw subsError;
    
    // Filter out users who have subscriptions
    const subscribedUserIds = new Set(usersWithSubs.map(s => s.user_id));
    const usersWithoutSubs = allUsers.filter(user => !subscribedUserIds.has(user.id));
    
    return usersWithoutSubs.map(user => ({
      id: user.id,
      name: user.full_name,
      email: user.email,
      isActive: false,
      planType: 'Sem plano',
      expirationDate: null,
      subscriptionId: null,
      autoRenew: false
    }));
  } catch (error) {
    console.error("Error fetching users without subscriptions:", error);
    throw error;
  }
};
