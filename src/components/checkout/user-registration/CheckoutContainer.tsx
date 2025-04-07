
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
      console.log("Starting checkout initialization process");
      // Primeiro, garantimos que o elemento será renderizado imediatamente
      setIsLoading(false);
      
      // Após o render, iniciamos o checkout com um delay suficiente
      const timer = setTimeout(() => {
        initializeCheckout();
      }, 3000); // Aumentando o delay para 3 segundos para garantir que o DOM está pronto
      
      return () => clearTimeout(timer);
    }
  }, [plan]);

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
      
      // Verificamos se o elemento existe no DOM antes de inicializar
      const containerElement = document.getElementById('user-registration-checkout-container');
      console.log("Container exists in DOM:", !!containerElement);
      
      if (!containerElement) {
        console.error("Container not found in DOM. Will attempt to retry initialization.");
        toast({
          variant: "destructive",
          title: "Erro ao inicializar pagamento",
          description: "Elemento de checkout não encontrado. Por favor, tente novamente."
        });
        return;
      }
      
      // Log dimensions to ensure the element is visible
      console.log("Container dimensions:", containerElement.offsetWidth, "x", containerElement.offsetHeight);
      
      // Inicializar Mercado Pago Bricks
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
    } catch (error) {
      console.error("Failed to initialize checkout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao inicializar checkout",
        description: "Ocorreu um erro ao preparar o checkout. Por favor, tente novamente."
      });
    }
  };

  return (
    <div className="relative">
      {isLoading ? (
        <CheckoutLoading message="Preparando o checkout do plano..." />
      ) : (
        <div 
          id="user-registration-checkout-container" 
          ref={checkoutContainerRef}
          className="min-h-[300px] border-2 border-primary/30 rounded-md p-4 bg-white"
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
