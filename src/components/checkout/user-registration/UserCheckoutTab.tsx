
import React, { useEffect } from 'react';
import { createCheckoutPreference } from '@/services/mercadoPagoService';
import { useToast } from "@/hooks/use-toast";
import { registerLead } from '@/services/leadService';

interface UserCheckoutTabProps {
  planId: string;
  planName: string;
  planPrice: number;
  customerInfo: {
    name: string;
    email: string;
  };
}

const UserCheckoutTab: React.FC<UserCheckoutTabProps> = ({ 
  planId, 
  planName, 
  planPrice,
  customerInfo 
}) => {
  const { toast } = useToast();

  useEffect(() => {
    const openCheckoutInNewTab = async () => {
      try {
        // Register lead first
        if (customerInfo) {
          try {
            await registerLead({
              name: customerInfo.name,
              email: customerInfo.email,
              plan_id: planId,
              plan_name: planName,
              price: planPrice
            });
            console.log("Lead registered successfully");
          } catch (error) {
            console.error("Failed to register lead:", error);
            // Continue with checkout even if lead registration fails
          }
        }

        // Create checkout preference
        const product = {
          id: planId,
          name: planName,
          description: `Assinatura do plano ${planName}`,
          price: planPrice,
        };

        const preference = await createCheckoutPreference(
          product,
          customerInfo ? {
            ...customerInfo,
            identificationType: "CPF",
            identificationNumber: "00000000000"
          } : undefined
        );

        // Open the Mercado Pago checkout URL in a new tab
        const checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?preference-id=${preference.preferenceId}`;
        window.open(checkoutUrl, '_blank');
      } catch (error) {
        console.error("Failed to open checkout:", error);
        toast({
          variant: "destructive",
          title: "Erro ao abrir checkout",
          description: "Não foi possível abrir a página de pagamento. Por favor, tente novamente."
        });
      }
    };

    openCheckoutInNewTab();
  }, [planId, planName, planPrice, customerInfo, toast]);

  return (
    <div className="flex flex-col justify-center items-center py-8 space-y-4">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      <p className="text-sm text-muted-foreground">Redirecionando para o checkout...</p>
    </div>
  );
};

export default UserCheckoutTab;
