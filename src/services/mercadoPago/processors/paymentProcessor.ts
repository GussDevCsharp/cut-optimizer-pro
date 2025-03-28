
import { supabase } from "@/integrations/supabase/client";
import { ProductInfo } from "../types";
import { ProcessPaymentOptions, recordTransaction } from "./baseProcessor";
import { processSubscriptionPlan, recordExistingSubscriptionPayment } from "./subscriptionProcessor";

/**
 * Process a payment after it's been completed
 * - Records the payment in the database
 * - Creates or extends a subscription if applicable
 * - Can be used by all payment methods (PIX, card, boleto)
 */
export const processPayment = async (
  options: ProcessPaymentOptions
): Promise<{success: boolean, subscriptionId: string | null}> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado");
      return { success: false, subscriptionId: null };
    }
    
    // Check if product is a subscription plan
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', options.productId)
      .maybeSingle();
      
    if (planError && planError.code !== 'PGRST116') {
      console.error("Erro ao verificar plano:", planError);
      return { success: false, subscriptionId: null };
    }
    
    let result = { success: false, subscriptionId: null };
    
    // If it's a subscription plan
    if (plan) {
      result = await processSubscriptionPlan(user.id, plan.id, options);
    } else {
      // For non-subscription products
      result = await recordExistingSubscriptionPayment(user.id, options);
    }
    
    // Always record transaction data regardless of subscription status
    if (options.customerData) {
      await recordTransaction(user.id, options);
    }
    
    return result;
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return { success: false, subscriptionId: null };
  }
};
