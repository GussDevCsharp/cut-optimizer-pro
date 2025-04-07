
import React, { useEffect, useRef, useState } from 'react';
import { SubscriptionPlan } from '@/integrations/supabase/schema';
import CheckoutLoading from './CheckoutLoading';
import { createCheckoutPreference, initCheckoutBricks } from '@/services/mercadoPagoService';
import { useToast } from '@/hooks/use-toast';

interface CheckoutContainerProps {
  plan: SubscriptionPlan | null;
  customerInfo?: {
    name: string;
    email: string;
  };
  onPaymentComplete?: (status: string, paymentId?: string) => void;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({
  plan,
  customerInfo,
  onPaymentComplete
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const initializeCheckout = async () => {
      setIsLoading(true);
      
      if (!plan) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Plano não selecionado"
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Starting checkout initialization process");
      
      try {
        // Create checkout preference
        console.log("Creating checkout preference...");
        const preference = await createCheckoutPreference(
          {
            id: plan.id,
            title: plan.name,
            description: plan.description || '',
            unit_price: plan.price,
            quantity: 1,
            currency_id: "BRL"
          },
          customerInfo ? {
            name: customerInfo.name,
            email: customerInfo.email,
            firstName: customerInfo.name.split(' ')[0],
            lastName: customerInfo.name.split(' ').slice(1).join(' ') || '',
            identificationType: "CPF",
            identificationNumber: "00000000000"
          } : undefined
        );
        
        console.log("Preference created successfully:", preference.preferenceId);
        setPreferenceId(preference.preferenceId);
        
        // Initialize the brick
        if (containerRef.current) {
          console.log("Container exists in DOM:", !!containerRef.current);
          console.log("Container dimensions:", containerRef.current.offsetWidth, "x", containerRef.current.offsetHeight);
          
          // Initialize the checkout brick with a slight delay to ensure DOM is ready
          setTimeout(async () => {
            console.log("Initializing Bricks with preference:", preference.preferenceId);
            const success = await initCheckoutBricks(
              'user-registration-checkout-container',
              preference.preferenceId,
              plan.price,
              customerInfo ? {
                firstName: customerInfo.name.split(' ')[0],
                lastName: customerInfo.name.split(' ').slice(1).join(' ') || '',
                email: customerInfo.email
              } : undefined,
              (status, paymentId) => {
                if (onPaymentComplete) {
                  onPaymentComplete(status, paymentId);
                }
              }
            );
            
            console.log("Checkout Bricks initialized:", success ? "successfully" : "failed");
            if (!success) {
              toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível inicializar o checkout"
              });
            }
            
            setIsLoading(false);
          }, 800); // Increased delay for safer DOM rendering
        } else {
          console.error("Container ref is null");
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Container de checkout não encontrado"
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing checkout:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao inicializar o checkout"
        });
        setIsLoading(false);
      }
    };
    
    initializeCheckout();
  }, [plan, customerInfo, onPaymentComplete, toast]);
  
  return (
    <div className="relative h-full flex flex-col">
      {isLoading && <CheckoutLoading message="Carregando checkout..." />}
      <div 
        id="user-registration-checkout-container" 
        className="flex-1 min-h-[400px] w-full border rounded-md bg-background p-4"
        ref={containerRef}
      ></div>
    </div>
  );
};

export default CheckoutContainer;
