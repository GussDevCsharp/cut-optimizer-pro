
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserRegistrationCheckoutProps } from './types';
import { fetchSubscriptionPlans, createUserSubscription } from "@/services/subscriptionService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from '@/integrations/supabase/schema';
import PlanDisplay from './PlanDisplay';
import CheckoutContainer from './CheckoutContainer';
import RegistrationSuccess from './RegistrationSuccess';

const UserRegistrationCheckout: React.FC<UserRegistrationCheckoutProps> = ({
  isOpen,
  onOpenChange,
  planId,
  userCredentials,
  onPaymentComplete
}) => {
  const [step, setStep] = useState<'loading' | 'checkout' | 'success'>('loading');
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { register } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && planId) {
      // Reset state when the dialog opens
      setStep('loading');
      setPaymentStatus(null);
      loadPlanDetails();
    }
  }, [isOpen, planId]);

  const loadPlanDetails = async () => {
    try {
      // Use fetchSubscriptionPlans instead of fetchSubscriptionPlan and filter by planId
      const plans = await fetchSubscriptionPlans();
      const selectedPlan = plans.find(p => p.id === planId) || null;
      
      if (selectedPlan) {
        setPlan(selectedPlan);
        setStep('checkout');
      } else {
        throw new Error("Plan not found");
      }
    } catch (error) {
      console.error("Failed to load plan details:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar plano",
        description: "Não foi possível carregar os detalhes do plano. Por favor, tente novamente."
      });
      onOpenChange(false);
    }
  };

  const handlePaymentComplete = async (status: string, paymentId?: string) => {
    setPaymentStatus(status);
    
    if (status === 'approved' || status === 'pending') {
      try {
        setIsRegistering(true);
        
        // Register the user
        const { user, error } = await register(
          userCredentials.name,
          userCredentials.email,
          userCredentials.password
        );
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (user) {
          // Create the subscription
          await createUserSubscription({
            userId: user.id,
            planId: planId,
            paymentId: paymentId || `manual_${Date.now()}`,
            status: status
          });
          
          setStep('success');
        }
      } catch (error) {
        console.error("Registration or subscription creation failed:", error);
        toast({
          variant: "destructive",
          title: "Erro no registro",
          description: "Ocorreu um erro ao registrar sua conta. Por favor, tente novamente."
        });
      } finally {
        setIsRegistering(false);
      }
    }
    
    // Call the parent callback if provided
    if (onPaymentComplete) {
      onPaymentComplete(status, paymentId);
    }
  };

  const handleCloseDialog = (open: boolean) => {
    // Only allow closing when not in the middle of registration
    if (!isRegistering) {
      onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 'loading' && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {step === 'checkout' && plan && (
          <div className="space-y-6">
            <PlanDisplay plan={plan} />
            
            <CheckoutContainer
              plan={{
                id: plan.id,
                name: plan.name,
                description: plan.description,
                price: plan.price
              }}
              customerInfo={{
                name: userCredentials.name,
                email: userCredentials.email,
                identificationType: "CPF",
                identificationNumber: "00000000000"
              }}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        )}
        
        {step === 'success' && (
          <RegistrationSuccess 
            onClose={() => onOpenChange(false)}
            isRegistering={isRegistering}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserRegistrationCheckout;
