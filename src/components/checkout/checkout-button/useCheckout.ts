
import { useState, useRef, useEffect } from 'react';
import { PaymentStatus } from "../CheckoutModal";
import { createCheckoutPreference, initCheckoutBricks } from "@/services/mercadoPagoService";
import { useToast } from "@/hooks/use-toast";

interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface CustomerData {
  name: string;
  email: string;
}

export const useCheckout = (
  product: ProductInfo,
  customerData?: CustomerData,
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isCheckoutReady, setIsCheckoutReady] = useState(false);
  const checkoutContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const initCheckout = async () => {
    setIsLoading(true);
    try {
      // Get preference ID
      const preference = await createCheckoutPreference(
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image
        },
        customerData
      );
      
      setPreferenceId(preference.preferenceId);
      
      // Make sure the container is rendered
      setTimeout(async () => {
        if (checkoutContainerRef.current && preference.preferenceId) {
          const success = await initCheckoutBricks(
            'checkout-container', 
            preference.preferenceId,
            handlePaymentComplete
          );
          
          if (success) {
            setIsCheckoutReady(true);
          } else {
            toast({
              variant: "destructive",
              title: "Erro ao inicializar pagamento",
              description: "Não foi possível carregar o checkout. Por favor, tente novamente."
            });
          }
        }
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to initialize checkout:", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Erro ao inicializar checkout",
        description: "Ocorreu um erro ao preparar o checkout. Por favor, tente novamente."
      });
    }
  };

  const handlePaymentComplete = (status: PaymentStatus, paymentId?: string) => {
    setPaymentStatus(status);
    
    // Call the callback if provided
    if (onPaymentComplete) {
      onPaymentComplete(status, paymentId);
    }
  };

  const resetCheckout = () => {
    setIsCheckoutReady(false);
    setPreferenceId(null);
    setPaymentStatus(null);
  };

  return {
    isLoading,
    paymentStatus,
    isCheckoutReady,
    checkoutContainerRef,
    initCheckout,
    resetCheckout
  };
};
