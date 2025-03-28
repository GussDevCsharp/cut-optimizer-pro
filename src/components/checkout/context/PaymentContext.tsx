
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PaymentStatus, ProductInfo } from '../CheckoutModal';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { usePaymentProcessor } from "@/services/mercadoPago/hooks/usePaymentProcessor";
import { toast } from "sonner";
import { mapPaymentStatus } from "@/services/mercadoPago/processors/baseProcessor";

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
  // New transaction tracking fields
  transactionSteps: string[];
  currentStep: number;
  transactionStatus: 'idle' | 'processing' | 'success' | 'error';
  updateTransactionStep: (step: number, status?: 'idle' | 'processing' | 'success' | 'error') => void;
  startTransaction: (steps: string[]) => void;
  resetTransaction: () => void;
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
  
  // New transaction step tracking state
  const [transactionSteps, setTransactionSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Start a new transaction with defined steps
  const startTransaction = (steps: string[]) => {
    setTransactionSteps(steps);
    setCurrentStep(0);
    setTransactionStatus('processing');
  };

  // Update the current transaction step
  const updateTransactionStep = (step: number, status: 'idle' | 'processing' | 'success' | 'error' = 'processing') => {
    setCurrentStep(step);
    setTransactionStatus(status);
  };

  // Reset transaction tracking
  const resetTransaction = () => {
    setTransactionSteps([]);
    setCurrentStep(0);
    setTransactionStatus('idle');
  };

  // Log transaction to payment_logs table directly using RPC
  const logTransaction = async (status: PaymentStatus, id?: string) => {
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
        user_id: user?.id || null,
        is_sandbox: isSandbox,
        user_agent: navigator.userAgent,
        customer_email: user?.email || null
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

  // Handle payment completion callback
  const handlePaymentComplete = async (status: PaymentStatus, id?: string) => {
    setPaymentStatus(status);
    if (id) setPaymentId(id);
    
    // Update transaction status on completion
    if (status === 'approved') {
      setTransactionStatus('success');
    } else if (status === 'rejected' || status === 'error') {
      setTransactionStatus('error');
    }
    
    // Log transaction attempt in console for debugging
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
    
    // Log to payment_logs table
    await logTransaction(status, id);
    
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
    isSandbox,
    // Provide transaction tracking to consumers
    transactionSteps,
    currentStep,
    transactionStatus,
    updateTransactionStep,
    startTransaction,
    resetTransaction
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
