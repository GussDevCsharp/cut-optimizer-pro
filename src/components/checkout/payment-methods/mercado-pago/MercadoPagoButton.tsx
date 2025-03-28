
import React, { useEffect, useRef, useState } from 'react';
import { getMercadoPagoConfig, initMercadoPago, getMercadoPagoInstance } from "@/services/mercadoPago/initialize";
import { ProductInfo } from '@/components/checkout/CheckoutModal';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from "sonner";

interface MercadoPagoButtonProps {
  product: ProductInfo;
  onPaymentCreated?: (preferenceId: string) => void;
  onPaymentError?: (error: any) => void;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  product,
  onPaymentCreated,
  onPaymentError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState<any>(null);
  const checkoutBtnRef = useRef<HTMLDivElement>(null);

  // Function to generate checkout button with Mercado Pago
  const renderCheckoutButton = async () => {
    try {
      if (!checkoutBtnRef.current) return;
      
      const mpInstance = await getMercadoPagoInstance();
      if (!mpInstance) {
        throw new Error("Mercado Pago instance not available");
      }
      
      // Limpa o container antes de renderizar novo botão
      checkoutBtnRef.current.innerHTML = '';
      
      // Cria um ID único para este checkout
      const preferenceId = `TEST-${Date.now()}`;
      
      // Inicializa o checkout
      const checkout = mpInstance.checkout({
        preference: {
          id: preferenceId
        },
        render: {
          container: checkoutBtnRef.current,
          label: 'Pagar com Mercado Pago'
        }
      });
      
      // Notifica sobre a criação do pagamento
      if (onPaymentCreated) {
        onPaymentCreated(preferenceId);
      }
      
      console.log("Botão de checkout do Mercado Pago renderizado com sucesso");
    } catch (err) {
      console.error("Erro ao renderizar botão do Mercado Pago:", err);
      setError(err);
      
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle direct payment without SDK
  const handleDirectPayment = () => {
    try {
      setIsLoading(true);
      
      // Generate a simulated preference ID
      const preferenceId = `TEST-${Date.now()}`;
      
      // Notify about payment creation
      if (onPaymentCreated) {
        onPaymentCreated(preferenceId);
      }
    } catch (err) {
      console.error("Error processing direct payment:", err);
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load MercadoPago SDK
  useEffect(() => {
    const loadSDK = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get MercadoPago configuration
        const config = await getMercadoPagoConfig();
        console.log("MercadoPago config loaded, initializing SDK.");
        
        await initMercadoPago();
        setSdkLoaded(true);
        
        // Rendering button is now handled in a separate effect
      } catch (err) {
        console.error("Failed to initialize MercadoPago:", err);
        setError(err);
        
        // Notify parent about the error
        if (onPaymentError) {
          onPaymentError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSDK();
  }, [onPaymentError]);
  
  // Render checkout button once SDK is loaded
  useEffect(() => {
    if (sdkLoaded && checkoutBtnRef.current) {
      renderCheckoutButton();
    }
  }, [sdkLoaded, product]);

  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando...
      </Button>
    );
  }

  if (error) {
    return (
      <Button 
        variant="destructive" 
        className="w-full" 
        onClick={handleDirectPayment}
      >
        Tentar pagamento alternativo
      </Button>
    );
  }

  return (
    <>
      {/* Container for Mercado Pago checkout button */}
      <div ref={checkoutBtnRef} className="w-full mp-checkout-container"></div>
      
      {/* Fallback button in case the SDK fails to render */}
      {!sdkLoaded && (
        <Button 
          className="w-full" 
          onClick={handleDirectPayment}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pagar com Mercado Pago
        </Button>
      )}
    </>
  );
};

export default MercadoPagoButton;
