
import { supabase } from "@/integrations/supabase/client";
import { ProductInfo } from "../types";
import { PaymentStatus } from "@/components/checkout/CheckoutModal";

export interface ProcessPaymentOptions {
  productId: string;
  paymentMethod: 'pix' | 'card' | 'boleto';
  paymentId: string;
  paymentStatus: "pending" | "approved" | "rejected" | "error";
  amount: number;
  customerData?: {
    name: string;
    email: string;
    identificationType: string;
    identificationNumber: string;
  };
}

/**
 * Record transaction in the transactions table
 */
export const recordTransaction = async (
  userId: string,
  options: ProcessPaymentOptions
): Promise<boolean> => {
  try {
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        product_id: options.productId,
        payment_id: options.paymentId,
        payment_method: options.paymentMethod,
        payment_status: options.paymentStatus,
        amount: options.amount,
        customer_name: options.customerData?.name,
        customer_email: options.customerData?.email,
        customer_document: options.customerData?.identificationNumber,
        created_at: new Date().toISOString()
      });
      
    if (transactionError) {
      console.error("Erro ao inserir dados da transação:", transactionError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao registrar transação:", error);
    return false;
  }
};

/**
 * Map PaymentStatus from CheckoutModal to internal status
 */
export const mapPaymentStatus = (
  status: PaymentStatus
): "pending" | "approved" | "rejected" | "error" => {
  switch (status) {
    case 'processing':
      return 'pending';
    case 'approved':
    case 'rejected':
    case 'error':
    case 'pending':
      return status;
    default:
      return 'error';
  }
};
