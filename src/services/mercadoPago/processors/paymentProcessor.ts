
import { supabase } from "@/integrations/supabase/client";
import { ProductInfo } from "../types";
import { ProcessPaymentOptions, recordTransaction, mapPaymentStatus } from "./baseProcessor";
import { processSubscriptionPlan, recordExistingSubscriptionPayment } from "./subscriptionProcessor";

/**
 * Record transaction data to payment_logs table
 */
const recordPaymentLog = async (
  options: ProcessPaymentOptions,
  userId: string
): Promise<void> => {
  try {
    const { data: productInfo, error: productError } = await supabase
      .from('subscription_plans')
      .select('name')
      .eq('id', options.productId)
      .maybeSingle();
      
    // Prepare log data
    const logData = {
      timestamp: new Date().toISOString(),
      product_id: options.productId,
      product_name: productInfo?.name || 'Produto não identificado',
      price: options.amount,
      payment_method: options.paymentMethod,
      status: options.paymentStatus,
      payment_id: options.paymentId,
      user_id: userId,
      is_sandbox: true, // Por padrão assumimos sandbox, isso poderia ser configurável
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'servidor',
      customer_email: options.customerData?.email || null,
      metadata: options.customerData ? { customerData: options.customerData } : null
    };
    
    // Insert log data
    const { error } = await supabase
      .from('payment_logs')
      .insert([logData]);
      
    if (error) {
      console.error("Erro ao registrar log de pagamento:", error);
    } else {
      console.log("Log de pagamento registrado com sucesso");
    }
  } catch (error) {
    console.error("Erro ao processar log de pagamento:", error);
  }
};

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
    
    // Always record payment log first
    await recordPaymentLog(options, user.id);
    
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
