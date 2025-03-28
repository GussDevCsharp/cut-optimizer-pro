
import React, { createContext, useState, useContext } from 'react';
import { PaymentStatus } from '../CheckoutModal';
import { useAuth } from "@/context/AuthContext";
import { usePaymentProcessor } from "@/services/mercadoPago/hooks/usePaymentProcessor";
import { toast } from "sonner";
import { useTransactionState } from './useTransactionState';
import { logTransaction } from './paymentLogger';
import { PaymentContextType, PaymentProviderProps } from './types';

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

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
  
  // Use the transaction state hook for the transaction steps state
  const { 
    transactionSteps, 
    currentStep, 
    transactionStatus, 
    startTransaction, 
    updateTransactionStep, 
    resetTransaction 
  } = useTransactionState();

  // Handle payment completion callback
  const handlePaymentComplete = async (status: PaymentStatus, id?: string) => {
    setPaymentStatus(status);
    if (id) setPaymentId(id);
    
    // Update transaction status on completion
    if (status === 'approved') {
      updateTransactionStep(currentStep, 'success');
    } else if (status === 'rejected' || status === 'error') {
      updateTransactionStep(currentStep, 'error');
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
    await logTransaction(
      status, 
      id, 
      product, 
      paymentMethod, 
      isSandbox, 
      user?.id, 
      user?.email
    );
    
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
