
import { useAuth } from "@/context/AuthContext";
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import { ProductInfo } from "../types";
import { processPayment } from "../processors/paymentProcessor";
import { mapPaymentStatus } from "../processors/baseProcessor";

/**
 * Hooks version of the payment processor - for use in components
 */
export const usePaymentProcessor = () => {
  const { user } = useAuth();
  
  const processPlanPurchase = async (
    plan: ProductInfo,
    paymentMethod: 'pix' | 'card' | 'boleto',
    paymentId: string,
    paymentStatus: PaymentStatus,
    customerData?: {
      name: string;
      email: string;
      identificationType: string;
      identificationNumber: string;
    }
  ) => {
    if (!user) {
      console.error("Usuário não autenticado");
      return { success: false, subscriptionId: null };
    }
    
    // Map PaymentStatus from CheckoutModal to status for processPayment
    const status = mapPaymentStatus(paymentStatus);
    
    return processPayment({
      productId: plan.id,
      paymentMethod,
      paymentId,
      paymentStatus: status,
      amount: plan.price,
      customerData
    });
  };
  
  return {
    processPlanPurchase
  };
};
