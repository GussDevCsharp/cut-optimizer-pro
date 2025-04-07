
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
      
      console.log("Preference created successfully:", preference.preferenceId);
      
      // Wait a bit for DOM to be ready
      setTimeout(async () => {
        // Ensure the container is present in the DOM
        const checkoutContainer = document.getElementById('user-registration-checkout-container');
        if (!checkoutContainer) {
          console.error("Checkout container not found in the DOM");
          toast({
            variant: "destructive",
            title: "Erro ao inicializar pagamento",
            description: "Elemento de checkout não encontrado. Por favor, tente novamente."
          });
          setIsLoading(false);
          return;
        }
        
        console.log("Initializing Bricks with preference:", preference.preferenceId);
        const success = await initCheckoutBricks(
          'user-registration-checkout-container', 
          preference.preferenceId,
          onPaymentComplete as (status: PaymentStatus, paymentId?: string) => void
        );
        
        if (success) {
          console.log("Checkout Bricks initialized successfully");
          setCheckoutInitialized(true);
        } else {
          console.error("Failed to initialize Checkout Bricks");
          toast({
            variant: "destructive",
            title: "Erro ao inicializar pagamento",
            description: "Não foi possível carregar o checkout. Por favor, tente novamente."
          });
        }
        setIsLoading(false);
      }, 1000); // Aumentando o tempo de espera para garantir que o DOM esteja pronto
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
    <div className="relative">
      <div id="user-registration-checkout-container" className="min-h-[300px]"></div>
      {!checkoutInitialized && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
          <button 
            onClick={() => initializeCheckout()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutContainer;
