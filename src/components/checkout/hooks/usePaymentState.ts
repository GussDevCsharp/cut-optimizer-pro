
import { useState, useEffect } from 'react';
import { PaymentStatus } from '../CheckoutModal';
import { useToast } from "@/hooks/use-toast";
import { initMercadoPago } from "@/services/mercadoPagoService";

export const usePaymentState = (
  isOpen: boolean, 
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void
) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | undefined>(undefined);
  const [mpInitialized, setMpInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize Mercado Pago SDK when modal opens
  useEffect(() => {
    if (isOpen && !mpInitialized) {
      initMercadoPago()
        .then(() => {
          setMpInitialized(true);
        })
        .catch(error => {
          console.error("Failed to initialize Mercado Pago:", error);
          toast({
            variant: "destructive",
            title: "Erro ao inicializar pagamento",
            description: "Por favor, tente novamente mais tarde."
          });
        });
    }
  }, [isOpen, mpInitialized, toast]);

  // Handle payment completion callback
  const handlePaymentComplete = (status: PaymentStatus, id?: string) => {
    setPaymentStatus(status);
    if (id) setPaymentId(id);
    
    if (onPaymentComplete) {
      onPaymentComplete(status, id);
    }
    
    // Show toast notification based on status
    if (status === 'approved') {
      toast({
        title: "Pagamento aprovado!",
        description: "Seu pagamento foi processado com sucesso.",
      });
    } else if (status === 'rejected' || status === 'error') {
      toast({
        variant: "destructive",
        title: "Falha no pagamento",
        description: "Houve um problema com seu pagamento. Por favor, tente novamente.",
      });
    }
  };

  const resetPaymentState = () => {
    if (!isProcessing) {
      setPaymentMethod('pix');
      setPaymentStatus('pending');
      setPaymentId(undefined);
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    isProcessing,
    setIsProcessing,
    paymentId,
    mpInitialized,
    handlePaymentComplete,
    resetPaymentState
  };
};
