
import { supabase } from "@/integrations/supabase/client";
import { PaymentStatus } from "../CheckoutModal";
import { mapPaymentStatus } from "@/services/mercadoPago/processors/baseProcessor";

// Log transaction to payment_logs table directly using RPC
export const logTransaction = async (
  status: PaymentStatus, 
  id: string | undefined,
  product: {
    id: string;
    name: string;
    price: number;
  },
  paymentMethod: 'pix' | 'card' | 'boleto',
  isSandbox: boolean,
  userId?: string | null,
  userEmail?: string | null
) => {
  if (!id) return;
  
  try {
    const mappedStatus = mapPaymentStatus(status);
    
    const logData = {
      timestamp: new Date().toISOString(),
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      payment_method: paymentMethod,
      status: mappedStatus,
      payment_id: id,
      user_id: userId || null,
      is_sandbox: isSandbox,
      user_agent: navigator.userAgent,
      customer_email: userEmail || null
    };
    
    console.log('Salvando log de pagamento via RPC:', logData);
    
    // Use a RPC function to bypass RLS policies
    if (window.navigator.onLine) {
      const { data, error } = await supabase
        .rpc('insert_payment_log', {
          log_data: logData
        });
        
      if (error) {
        console.error('Erro ao salvar log de pagamento:', error);
        // Store offline for later sync
        const offlineLogs = JSON.parse(localStorage.getItem('offlinePaymentLogs') || '[]');
        offlineLogs.push(logData);
        localStorage.setItem('offlinePaymentLogs', JSON.stringify(offlineLogs));
        console.log('Log armazenado offline para sincronização futura');
      } else {
        console.log('Log de pagamento salvo com sucesso:', data);
      }
    } else {
      // Store offline for later sync
      const offlineLogs = JSON.parse(localStorage.getItem('offlinePaymentLogs') || '[]');
      offlineLogs.push(logData);
      localStorage.setItem('offlinePaymentLogs', JSON.stringify(offlineLogs));
      console.log('Log armazenado offline para sincronização futura (offline)');
    }
  } catch (error) {
    console.error('Erro ao preparar log de pagamento:', error);
  }
};
