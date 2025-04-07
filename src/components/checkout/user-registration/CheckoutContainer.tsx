
import React, { useState, useEffect, useRef } from 'react';
import { CheckoutContainerProps } from './types';
import { createCheckoutPreference, initMercadoPago, initCheckoutBricks, convertToMPProductInfo } from "@/services/mercadoPagoService";
import { useToast } from "@/hooks/use-toast";
import CheckoutLoading from './CheckoutLoading';
import { PaymentStatus } from '../CheckoutModal';
import { registerLead } from '@/services/leadService';
import UserCheckoutTab from './UserCheckoutTab';

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ 
  plan, 
  customerInfo,
  onPaymentComplete,
  openInNewTab = false // Changed default to false to open in same tab
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutInitialized, setCheckoutInitialized] = useState(false);
  const [leadRegistered, setLeadRegistered] = useState(false);
  const checkoutContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // If we're using external checkout, render the UserCheckoutTab component
  if (openInNewTab && plan) {
    return (
      <UserCheckoutTab
        planId={plan.id}
        planName={plan.name}
        planPrice={plan.price}
        customerInfo={customerInfo}
      />
    );
  }
  
  // Initialize Mercado Pago when the component is mounted
  useEffect(() => {
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
  
  // Register lead when customer info is available
  useEffect(() => {
    if (customerInfo && !leadRegistered && plan) {
      const registerUserAsLead = async () => {
        try {
          console.log("Registering lead:", customerInfo);
          await registerLead({
            name: customerInfo.name,
            email: customerInfo.email,
            plan_id: plan.id,
            plan_name: plan.name,
            price: plan.price
          });
          setLeadRegistered(true);
          console.log("Lead registered successfully");
        } catch (error) {
          console.error("Failed to register lead:", error);
          // Continue with checkout even if lead registration fails
        }
      };
      
      registerUserAsLead();
    }
  }, [customerInfo, leadRegistered, plan]);
  
  // When the component is mounted, we ensure that the ref is available
  useEffect(() => {
    console.log("CheckoutContainer mounted, ref is:", !!checkoutContainerRef.current);
  }, []);

  useEffect(() => {
    if (plan && !checkoutInitialized) {
      console.log("Starting checkout initialization process");
      // First, make sure the element will be rendered immediately
      setIsLoading(false);
      
      // After rendering, start the checkout with sufficient delay
      const timer = setTimeout(() => {
        initializeCheckout();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [plan, checkoutInitialized]);

  const initializeCheckout = async () => {
    if (!plan) return;
    
    try {
      console.log("Creating checkout preference...");
      
      // Convert plan to proper Mercado Pago product format
      const mpProduct = convertToMPProductInfo({
        id: plan.id,
        title: plan.name,
        name: plan.name,
        description: plan.description || `Assinatura do plano ${plan.name}`,
        unit_price: plan.price,
        price: plan.price
      });
      
      const preference = await createCheckoutPreference(
        mpProduct,
        customerInfo ? {
          name: customerInfo.name,
          email: customerInfo.email,
          firstName: customerInfo.name.split(' ')[0],
          lastName: customerInfo.name.split(' ').slice(1).join(' '),
          identificationType: "CPF",
          identificationNumber: "00000000000"
        } : undefined
      );
      
      console.log("Preference created successfully:", preference.preferenceId);
      
      // Verify if the element exists in the DOM before initializing
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
            // Initialize Mercado Pago Bricks
            console.log("Initializing Bricks with preference:", preference.preferenceId);
            
            // Prepare customer data in the expected format
            const customerData = customerInfo ? {
              firstName: customerInfo.name.split(' ')[0],
              lastName: customerInfo.name.split(' ').slice(1).join(' '),
              email: customerInfo.email
            } : undefined;
            
            initCheckoutBricks(
              'user-registration-checkout-container', 
              preference.preferenceId,
              plan.price,
              customerData,
              (status: PaymentStatus, paymentId?: string) => {
                if (onPaymentComplete) {
                  onPaymentComplete(status, paymentId);
                }
              }
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
          // Try again after a short delay
          console.log(`Container not found, retrying in 500ms (attempt ${currentAttempt}/${maxAttempts})`);
          setTimeout(attemptInitialization, 500);
        } else {
          handleInitializationError("Container not found after maximum attempts");
        }
      };
      
      // Start the initialization attempts
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
        <CheckoutLoading />
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
