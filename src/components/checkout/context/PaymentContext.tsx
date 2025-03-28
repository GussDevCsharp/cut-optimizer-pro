
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PaymentStatus, ProductInfo } from '../CheckoutModal';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { usePaymentProcessor } from "@/services/mercadoPago/paymentProcessor";
import { toast } from "sonner";

interface PaymentContextType {
  paymentMethod: 'pix' | 'card' | 'boleto';
  setPaymentMethod: (method: 'pix' | 'card' | 'boleto') => void;
  paymentStatus: PaymentStatus;
  setPaymentStatus: (status: PaymentStatus) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  paymentId: string | undefined;
  setPaymentId: (id: string | undefined) => void;
  handlePaymentComplete: (status: PaymentStatus, id?: string) => Promise<void>;
  isSandbox: boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
  product: ProductInfo;
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void;
  isSandbox: boolean;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ 
  children, 
  product, 
  onPaymentComplete,
  isSandbox 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const { processPlanPurchase } = usePaymentProcessor();
  const { user } = useAuth();

  // Handle payment completion callback
  const handlePaymentComplete = async (status: PaymentStatus, id?: string) => {
    setPaymentStatus(status);
    if (id) setPaymentId(id);
    
    // Log transaction attempt
    const transactionLog = {
      timestamp: new Date().toISOString(),
      productId: product.id,
      productName: product.name,
      price: product.price,
      paymentMethod,
      status,
      paymentId: id,
      userId: user?.id || 'anonymous',
      isSandbox,
      userAgent: navigator.userAgent
    };
    
    // Log transaction details to console for debugging
    console.log('TRANSACTION LOG:', JSON.stringify(transactionLog, null, 2));
    
    // In a real implementation, you would send this log to your backend
    try {
      // Send transaction log to database if available
      if (window.navigator.onLine) {
        const { error } = await supabase
          .from('payment_logs')
          .insert([transactionLog]);
          
        if (error) {
          console.error('Error logging transaction:', error);
        } else {
          console.log('Transaction logged successfully');
        }
      } else {
        // Store offline for later sync
        const offlineLogs = JSON.parse(localStorage.getItem('offlinePaymentLogs') || '[]');
        offlineLogs.push(transactionLog);
        localStorage.setItem('offlinePaymentLogs', JSON.stringify(offlineLogs));
      }
    } catch (error) {
      console.error('Error saving transaction log:', error);
    }
    
    // Process payment in database if user is logged in
    if (user && id) {
      try {
        const result = await processPlanPurchase(product, paymentMethod, id, status);
        
        if (result.success) {
          console.log("Pagamento processado com sucesso no banco de dados");
        }
      } catch (error) {
        console.error("Erro ao processar pagamento no banco de dados:", error);
      }
    }
    
    if (onPaymentComplete) {
      onPaymentComplete(status, id);
    }
    
    // Show toast notification based on status
    if (status === 'approved') {
      toast.success("Pagamento aprovado!", {
        description: "Seu pagamento foi processado com sucesso."
      });
    } else if (status === 'rejected' || status === 'error') {
      toast.error("Falha no pagamento", {
        description: "Houve um problema com seu pagamento. Por favor, tente novamente."
      });
    }
  };

  const value = {
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    setPaymentStatus,
    isProcessing,
    setIsProcessing,
    paymentId,
    setPaymentId,
    handlePaymentComplete,
    isSandbox
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
