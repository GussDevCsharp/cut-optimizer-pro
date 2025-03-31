
import React, { useState, useEffect } from 'react';
import { CheckoutContainerProps } from './types';
import { createCheckoutPreference, initCheckoutBricks } from "@/services/mercadoPagoService";
import { useToast } from "@/hooks/use-toast";
import CheckoutLoading from '../checkout-button/CheckoutLoading';
import { PaymentStatus } from '../CheckoutModal';

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ 
  plan, 
  customerInfo,
  onPaymentComplete 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutInitialized, setCheckoutInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (plan && !checkoutInitialized) {
      initializeCheckout();
    }
  }, [plan]);

  const initializeCheckout = async () => {
    if (!plan) return;

    try {
      const product = {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
      };
      
      const preference = await createCheckoutPreference(
        product,
        customerInfo ? {
          ...customerInfo,
          identificationType: "CPF", // Default value
          identificationNumber: "00000000000" // Default value
        } : undefined
      );
      
      // Wait a bit for DOM to be ready
      setTimeout(async () => {
        const success = await initCheckoutBricks(
          'user-registration-checkout-container', 
          preference.preferenceId,
          onPaymentComplete as (status: PaymentStatus, paymentId?: string) => void
        );
        
        if (success) {
          setCheckoutInitialized(true);
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao inicializar pagamento",
            description: "Não foi possível carregar o checkout. Por favor, tente novamente."
          });
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

  if (isLoading) {
    return <CheckoutLoading message="Preparando o checkout do plano..." />;
  }

  return (
    <div>
      <div id="user-registration-checkout-container" className="min-h-[300px]"></div>
    </div>
  );
};

export default CheckoutContainer;
