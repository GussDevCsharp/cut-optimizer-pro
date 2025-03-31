
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { PaymentStatus } from '../CheckoutModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { fetchSubscriptionPlanById, createUserSubscription, recordPayment } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/integrations/supabase/schema';
import PlanDisplay from './PlanDisplay';
import RegistrationSuccess from './RegistrationSuccess';
import CheckoutContainer from './CheckoutContainer';
import { UserRegistrationCheckoutProps } from './types';

const UserRegistrationCheckout: React.FC<UserRegistrationCheckoutProps> = ({
  isOpen,
  onOpenChange,
  planId,
  userCredentials,
  onPaymentComplete
}) => {
  const { register } = useAuth();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPlanData();
    }
  }, [isOpen, planId]);

  const loadPlanData = async () => {
    setIsLoading(true);
    const subscriptionPlan = await fetchSubscriptionPlanById(planId);
    setPlan(subscriptionPlan);
    if (!subscriptionPlan) {
      toast({
        variant: "destructive",
        title: "Plano não encontrado",
        description: "Não foi possível carregar os detalhes do plano selecionado."
      });
      onOpenChange(false);
    }
    setIsLoading(false);
  };

  const handlePaymentComplete = async (status: PaymentStatus, paymentId?: string) => {
    setPaymentStatus(status);
    
    // Only register the user if payment was successful
    if (status === 'approved' && !isRegistering && plan) {
      setIsRegistering(true);
      try {
        // Register the user with the provided credentials
        const result = await register(
          userCredentials.name, 
          userCredentials.email, 
          userCredentials.password
        );
        
        // Fix TS error by properly checking the result
        if (result && 'user' in result && result.user && result.user.id) {
          // Create user subscription
          await createUserSubscription(result.user.id, plan.id);
          
          // Record payment
          if (paymentId) {
            await recordPayment(
              result.user.id,
              plan.id,
              plan.price,
              'card', // Default to card, could be enhanced to track actual method
              'approved',
              paymentId
            );
          }
          
          toast({
            title: "Conta criada com sucesso!",
            description: "Seu acesso à plataforma foi ativado.",
          });
        } else if (result && 'error' in result && result.error) {
          throw new Error(result.error.message);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao criar conta",
          description: error.message || "Não foi possível criar sua conta. Entre em contato com o suporte.",
        });
        console.error("Erro ao registrar usuário após pagamento:", error);
      } finally {
        setIsRegistering(false);
      }
    }
    
    // Call the original onPaymentComplete callback
    if (onPaymentComplete) {
      onPaymentComplete(status, paymentId);
    }
  };
  
  const handleCloseDialog = () => {
    // Only allow closing if not processing payment
    if (!isRegistering) {
      onOpenChange(false);
      setPaymentStatus(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {paymentStatus !== 'approved' && !isRegistering && (
          <button 
            onClick={handleCloseDialog} 
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
        )}
        
        {plan && <PlanDisplay plan={plan} />}
        
        <div className="p-6">
          {paymentStatus === 'approved' ? (
            <RegistrationSuccess isRegistering={isRegistering} />
          ) : isLoading ? (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="mt-4 text-center text-muted-foreground">
                Carregando detalhes do plano...
              </p>
            </div>
          ) : (
            <>
              <DialogHeader className="mb-4">
                <DialogTitle>Finalizar compra</DialogTitle>
              </DialogHeader>
              
              {plan && (
                <CheckoutContainer 
                  plan={plan}
                  customerInfo={{
                    name: userCredentials.name,
                    email: userCredentials.email
                  }}
                  onPaymentComplete={handlePaymentComplete}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserRegistrationCheckout;
