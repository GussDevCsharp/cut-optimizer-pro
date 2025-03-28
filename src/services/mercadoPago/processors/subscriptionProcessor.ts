
import { supabase } from "@/integrations/supabase/client";
import { createSubscription, recordPayment } from "@/services/subscriptionService";
import { ProcessPaymentOptions } from "./baseProcessor";

/**
 * Process subscription plan payments
 */
export const processSubscriptionPlan = async (
  userId: string,
  planId: string,
  options: ProcessPaymentOptions
): Promise<{ success: boolean, subscriptionId?: string }> => {
  try {
    // If payment was approved
    if (options.paymentStatus === 'approved') {
      // Create a new subscription for the user
      const subscription = await createSubscription(userId, planId, true);
      
      if (subscription) {
        const subscriptionId = subscription.id;
        
        // Record the payment
        await recordPayment(
          userId,
          subscriptionId,
          options.amount,
          options.paymentMethod,
          options.paymentStatus,
          options.paymentId
        );
        
        return { 
          success: true,
          subscriptionId
        };
      }
    }
    
    return { success: false };
  } catch (error) {
    console.error("Erro ao processar assinatura:", error);
    return { success: false };
  }
};

/**
 * Record payment for existing subscription
 */
export const recordExistingSubscriptionPayment = async (
  userId: string,
  options: ProcessPaymentOptions
): Promise<{ success: boolean, subscriptionId?: string }> => {
  try {
    // Get user's active subscription if exists
    const { data: activeSubscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (subError && subError.code !== 'PGRST116') {
      console.error("Erro ao verificar assinatura ativa:", subError);
      return { success: false };
    }
    
    if (activeSubscription) {
      const subscriptionId = activeSubscription.id;
      
      // Record the payment
      await recordPayment(
        userId,
        subscriptionId,
        options.amount,
        options.paymentMethod,
        options.paymentStatus,
        options.paymentId
      );
      
      return { 
        success: true,
        subscriptionId
      };
    }
    
    console.log("Nenhuma assinatura encontrada para associar o pagamento");
    return { success: false };
  } catch (error) {
    console.error("Erro ao registrar pagamento para assinatura existente:", error);
    return { success: false };
  }
};
