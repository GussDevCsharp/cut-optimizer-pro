
import React, { useState, useEffect, useRef } from 'react';
import { CheckoutContainerProps } from './types';
import { createCheckoutPreference, initMercadoPago, initCheckoutBricks } from "@/services/mercadoPagoService";
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
  
  // Inicializa o Mercado Pago quando o componente é montado
  useEffect(() => {
    // Inicializamos o SDK do Mercado Pago logo no início
    const initMP = async () => {
      try {
        await initMercadoPago();
        console.log("MercadoPago SDK initialized");
      } catch (error) {
        console.error("Failed to initialize MercadoPago SDK:", error);
      }
    };
    
    initMP();
  }, []);
  
  // Quando o componente é montado, garantimos que o ref esteja disponível
  useEffect(() => {
    console.log("CheckoutContainer mounted, ref is:", !!checkoutContainerRef.current);
  }, []);

  useEffect(() => {
    if (plan && !checkoutInitialized) {
      console.log("Starting checkout initialization process");
      // Primeiro, garantimos que o elemento será renderizado imediatamente
      setIsLoading(false);
      
      // Após o render, iniciamos o checkout com um delay suficiente
      const timer = setTimeout(() => {
        initializeCheckout();
      }, 1000); // Reduzindo para 1 segundo para ser mais responsivo
      
      return () => clearTimeout(timer);
    }
  }, [plan, checkoutInitialized]);

  const initializeCheckout = async () => {
    if (!plan) return;
    
    try {
      console.log("Creating checkout preference...");
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
      
      // Verificamos várias vezes se o elemento existe no DOM antes de inicializar
      const maxAttempts = 5;
      let currentAttempt = 0;
      
      const attemptInitialization = () => {
        currentAttempt++;
        const containerElement = document.getElementById('user-registration-checkout-container');
        console.log(`Attempt ${currentAttempt}: Container exists in DOM:`, !!containerElement);
        
        if (containerElement) {
          // Log dimensions to ensure the element is visible
          const width = containerElement.offsetWidth;
          const height = containerElement.offsetHeight;
          console.log("Container dimensions:", width, "x", height);
          
          if (width > 0 && height > 0) {
            // Inicializar Mercado Pago Bricks
            console.log("Initializing Bricks with preference:", preference.preferenceId);
            initCheckoutBricks(
              'user-registration-checkout-container', 
              preference.preferenceId,
              onPaymentComplete as (status: PaymentStatus, paymentId?: string) => void
            )
            .then(success => {
              if (success) {
                console.log("Checkout Bricks initialized successfully");
                setCheckoutInitialized(true);
              } else {
                handleInitializationError("Failed to initialize Checkout Bricks");
              }
            })
            .catch(error => {
              handleInitializationError(`Error initializing Checkout Bricks: ${error}`);
            });
          } else {
            handleInitializationError("Container has zero dimensions");
          }
        } else if (currentAttempt < maxAttempts) {
          // Tentar novamente após um curto intervalo
          console.log(`Container not found, retrying in 500ms (attempt ${currentAttempt}/${maxAttempts})`);
          setTimeout(attemptInitialization, 500);
        } else {
          handleInitializationError("Container not found after maximum attempts");
        }
      };
      
      // Inicia as tentativas de inicialização
      attemptInitialization();
      
    } catch (error) {
      console.error("Failed to initialize checkout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao inicializar checkout",
        description: "Ocorreu um erro ao preparar o checkout. Por favor, tente novamente."
      });
    }
  };
  
  const handleInitializationError = (message: string) => {
    console.error(message);
    toast({
      variant: "destructive",
      title: "Erro ao inicializar pagamento",
      description: "Não foi possível inicializar o checkout. Por favor, tente novamente."
    });
  };

  return (
    <div className="relative">
      {isLoading ? (
        <CheckoutLoading message="Preparando o checkout do plano..." />
      ) : (
        <div 
          id="user-registration-checkout-container" 
          ref={checkoutContainerRef}
          className="min-h-[400px] border-2 border-primary rounded-md p-4 bg-white"
          style={{ width: '100%', minHeight: '400px' }}
          data-testid="checkout-container"
        ></div>
      )}
      
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
