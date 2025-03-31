
import { useState, useEffect } from 'react';
import { PaymentStatus } from '../CheckoutModal';
import { useToast } from "@/hooks/use-toast";
import { initMercadoPago } from "@/services/mercadoPagoService";

export const usePaymentState = (isOpen: boolean) => {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
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

  const handlePaymentSuccess = (id?: string) => {
    setPaymentStatus('approved');
    if (id) setPaymentId(id);
    
    toast({
      title: "Pagamento aprovado!",
      description: "Seu pagamento foi processado com sucesso.",
    });
  };

  const handlePaymentRejected = () => {
    setPaymentStatus('rejected');
    
    toast({
      variant: "destructive",
      title: "Falha no pagamento",
      description: "Houve um problema com seu pagamento. Por favor, tente novamente.",
    });
  };

  const handlePaymentPending = () => {
    setPaymentStatus('pending');
    
    toast({
      title: "Pagamento pendente",
      description: "Seu pagamento está sendo processado. Você receberá uma confirmação em breve.",
    });
  };

  const resetPaymentState = () => {
    if (!isProcessing) {
      setPaymentMethod('pix');
      setPaymentStatus(null);
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
    handlePaymentSuccess,
    handlePaymentRejected,
    handlePaymentPending,
    resetPaymentState
  };
};
