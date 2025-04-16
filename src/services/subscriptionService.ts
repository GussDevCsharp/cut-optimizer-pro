import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/integrations/supabase/schema";
import { toast } from "@/hooks/use-toast";
import { ADDITIONAL_ADMIN_EMAIL } from '@/context/AuthContext';

/**
 * Fetches all active subscription plans from the database
 */
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error fetching subscription plans:", error);
    toast({
      variant: "destructive",
      title: "Erro ao carregar planos",
      description: "Não foi possível obter os planos de assinatura. Por favor, tente novamente."
    });
    return [];
  }
};

/**
 * Fetches a specific subscription plan by ID
 */
export const fetchSubscriptionPlanById = async (planId: string): Promise<SubscriptionPlan | null> => {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error: any) {
    console.error(`Error fetching subscription plan with ID ${planId}:`, error);
    toast({
      variant: "destructive",
      title: "Erro ao carregar plano",
      description: "Não foi possível obter o plano de assinatura selecionado."
    });
    return null;
  }
};

/**
 * Records a new payment in the payment history
 */
export const recordPayment = async (
  userId: string,
  subscriptionId: string,
  amount: number,
  paymentMethod: 'pix' | 'card' | 'boleto',
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'error',
  paymentId: string
) => {
  try {
    const { error } = await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        amount: amount,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        payment_id: paymentId
      });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error recording payment:", error);
    return false;
  }
};

/**
 * Creates a user subscription after successful payment
 */
export const createUserSubscription = async (
  userId: string,
  planId: string,
  autoRenew: boolean = false
) => {
  try {
    // First get the plan to determine duration
    const plan = await fetchSubscriptionPlanById(planId);
    
    if (!plan) {
      throw new Error("Plan not found");
    }
    
    // Calculate start and expiration dates
    const startDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(startDate.getDate() + plan.duration_days);
    
    // Get user email to check for lifetime access
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError) {
      throw userError;
    }
    
    // Check if this user gets lifetime access
    const isLifetimeUser = userData?.user?.email === ADDITIONAL_ADMIN_EMAIL;
    const isLifetimePlan = plan.is_lifetime === true;
    
    const { error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        start_date: startDate.toISOString(),
        expiration_date: isLifetimeUser || isLifetimePlan ? null : expirationDate.toISOString(),
        is_lifetime: isLifetimeUser || isLifetimePlan,
        auto_renew: autoRenew
      });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error creating user subscription:", error);
    toast({
      variant: "destructive",
      title: "Erro ao ativar assinatura",
      description: "Não foi possível ativar sua assinatura. Por favor, entre em contato com o suporte."
    });
    return false;
  }
};

/**
 * Creates a user subscription with payment info
 */
export const createUserSubscriptionWithPayment = async ({
  userId,
  planId,
  paymentId,
  status
}: {
  userId: string;
  planId: string;
  paymentId: string;
  status: string;
}) => {
  try {
    // First create the subscription
    const subscriptionCreated = await createUserSubscription(userId, planId);
    
    if (!subscriptionCreated) {
      throw new Error("Failed to create subscription");
    }
    
    // Get plan details for payment recording
    const plan = await fetchSubscriptionPlanById(planId);
    
    if (!plan) {
      throw new Error("Plan not found");
    }
    
    // Record the payment
    await recordPayment(
      userId,
      planId,
      plan.price,
      'card', // Assuming card payment, could be made dynamic
      status === 'approved' ? 'approved' : 'pending',
      paymentId
    );
    
    return true;
  } catch (error: any) {
    console.error("Error creating subscription with payment:", error);
    return false;
  }
};

/**
 * Check if a user has an active subscription
 */
export const checkUserSubscription = async (userId: string): Promise<boolean> => {
  try {
    // Check for lifetime access based on email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError) {
      throw userError;
    }
    
    if (userData?.user?.email === ADDITIONAL_ADMIN_EMAIL) {
      return true; // User has lifetime access
    }
    
    // Check for active subscription
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return !!subscription;
  } catch (error) {
    console.error("Error checking user subscription:", error);
    return false;
  }
};
