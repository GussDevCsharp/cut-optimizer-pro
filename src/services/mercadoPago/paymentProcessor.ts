
import { supabase } from "@/integrations/supabase/client";
import { createSubscription, recordPayment } from "@/services/subscriptionService";
import { ProductInfo } from "./types";
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import { useAuth } from "@/context/AuthContext";

interface ProcessPaymentOptions {
  productId: string;
  paymentMethod: 'pix' | 'card' | 'boleto';
  paymentId: string;
  paymentStatus: "pending" | "approved" | "rejected" | "error";
  amount: number;
}

/**
 * Process a payment after it's been completed
 * - Records the payment in the database
 * - Creates or extends a subscription if applicable
 * - Can be used by all payment methods (PIX, card, boleto)
 */
export const processPayment = async ({
  productId,
  paymentMethod,
  paymentId,
  paymentStatus,
  amount
}: ProcessPaymentOptions): Promise<{success: boolean, subscriptionId?: string}> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Usuário não autenticado");
      return { success: false };
    }
    
    // Check if product is a subscription plan
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', productId)
      .maybeSingle();
      
    if (planError && planError.code !== 'PGRST116') {
      console.error("Erro ao verificar plano:", planError);
      return { success: false };
    }
    
    let subscriptionId;
    
    // If payment was approved and it's a subscription plan
    if (paymentStatus === 'approved' && plan) {
      // Create a new subscription for the user
      const subscription = await createSubscription(user.id, plan.id, true);
      
      if (subscription) {
        subscriptionId = subscription.id;
        
        // Record the payment
        await recordPayment(
          user.id,
          subscription.id,
          amount,
          paymentMethod,
          paymentStatus,
          paymentId
        );
      }
    } else {
      // For non-subscription products or non-approved payments,
      // just record the payment without creating a subscription
      
      // Get user's active subscription if exists
      const { data: activeSubscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (subError && subError.code !== 'PGRST116') {
        console.error("Erro ao verificar assinatura ativa:", subError);
      }
      
      if (activeSubscription) {
        subscriptionId = activeSubscription.id;
      }
      
      // Record the payment if we have a subscription to associate with
      if (subscriptionId) {
        await recordPayment(
          user.id,
          subscriptionId,
          amount,
          paymentMethod,
          paymentStatus,
          paymentId
        );
      } else {
        // Create dummy subscription for payment record if necessary
        console.log("Nenhuma assinatura encontrada para associar o pagamento");
      }
    }
    
    return { 
      success: true,
      subscriptionId
    };
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return { success: false };
  }
};

/**
 * Hooks version of the payment processor - for use in components
 */
export const usePaymentProcessor = () => {
  const { user } = useAuth();
  
  const processPlanPurchase = async (
    plan: ProductInfo,
    paymentMethod: 'pix' | 'card' | 'boleto',
    paymentId: string,
    paymentStatus: PaymentStatus
  ) => {
    if (!user) {
      console.error("Usuário não autenticado");
      return { success: false };
    }
    
    // Convert PaymentStatus to the correct type
    let status: "pending" | "approved" | "rejected" | "error";
    
    // Map PaymentStatus from CheckoutModal to status for processPayment
    switch (paymentStatus) {
      case 'processing':
        status = 'pending';
        break;
      case 'approved':
      case 'rejected':
      case 'error':
      case 'pending':
        status = paymentStatus;
        break;
      default:
        status = 'error';
        break;
    }
    
    return processPayment({
      productId: plan.id,
      paymentMethod,
      paymentId,
      paymentStatus: status,
      amount: plan.price
    });
  };
  
  return {
    processPlanPurchase
  };
};
