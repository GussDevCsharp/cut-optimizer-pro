
import React, { useState, useEffect, useRef } from 'react';
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
  const checkoutContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Quando o componente é montado, garantimos que o ref esteja disponível
  useEffect(() => {
    console.log("CheckoutContainer mounted, ref is:", !!checkoutContainerRef.current);
  }, []);

  useEffect(() => {
    if (plan && !checkoutInitialized) {
      // Aumento o delay para garantir que o DOM esteja completamente pronto
      const timer = setTimeout(() => {
        console.log("Starting checkout initialization after delay");
        initializeCheckout();
      }, 1500);
      return () => clearTimeout(timer);
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
      
      // Aguardamos mais tempo para garantir que o DOM esteja pronto
      setTimeout(async () => {
        // Verificamos novamente se o elemento existe no DOM
        console.log("Checking DOM element before initialization");
        console.log("Ref exists:", !!checkoutContainerRef.current);
        
        const containerElement = document.getElementById('user-registration-checkout-container');
        console.log("Container by ID exists:", !!containerElement);
        
        if (!containerElement) {
          // Força a renderização do elemento se ele não existir
          console.log("Container not found, will try to ensure it exists");
          setIsLoading(false);
          
          // Damos um tempo para que o elemento seja renderizado após setIsLoading(false)
          setTimeout(async () => {
            const containerElement = document.getElementById('user-registration-checkout-container');
            console.log("Container now exists after rerender?", !!containerElement);
            
            if (!containerElement) {
              console.error("Container still not available in the DOM even after rerendering");
              toast({
                variant: "destructive",
                title: "Erro ao inicializar pagamento",
                description: "Elemento de checkout não encontrado. Por favor, atualize a página e tente novamente."
              });
              return;
            }
            
            await initBricksAndUpdateState(preference.preferenceId);
          }, 1000);
          return;
        }
        
        await initBricksAndUpdateState(preference.preferenceId);
      }, 2500);
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
  
  const initBricksAndUpdateState = async (preferenceId: string) => {
    console.log("Initializing Bricks with preference:", preferenceId);
    const success = await initCheckoutBricks(
      'user-registration-checkout-container', 
      preferenceId,
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
  };

  if (isLoading) {
    return <CheckoutLoading message="Preparando o checkout do plano..." />;
  }

  return (
    <div className="relative">
      <div 
        id="user-registration-checkout-container" 
        ref={checkoutContainerRef}
        className="min-h-[300px] border rounded-md p-4 bg-white"
      ></div>
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
