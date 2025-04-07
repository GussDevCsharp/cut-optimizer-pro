
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserRegistrationCheckoutProps } from './types';
import { fetchSubscriptionPlans, createUserSubscriptionWithPayment } from "@/services/subscriptionService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from '@/integrations/supabase/schema';
import PlanDisplay from './PlanDisplay';
import CheckoutContainer from './CheckoutContainer';
import RegistrationSuccess from './RegistrationSuccess';
import { updateLeadStatus } from '@/services/leadService';
import UserDataReviewForm from './UserDataReviewForm';
import CheckoutLoading from './CheckoutLoading';
import OrderSummary from './OrderSummary';

const UserRegistrationCheckout: React.FC<UserRegistrationCheckoutProps> = ({
  isOpen,
  onOpenChange,
  planId,
  userCredentials,
  onPaymentComplete
}) => {
  const [step, setStep] = useState<'loading' | 'review' | 'checkout' | 'success'>('loading');
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [userData, setUserData] = useState(userCredentials);
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
        setStep('review');
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
    
    try {
      // Update lead status based on payment status
      const leadStatus = status === 'approved' ? 'converted' : 'lost';
      if (userData?.email) {
        await updateLeadStatus(userData.email, leadStatus);
        console.log(`Lead status updated to ${leadStatus}`);
      }
    } catch (error) {
      console.error("Failed to update lead status:", error);
      // Continue even if lead update fails
    }
    
    if (status === 'approved' || status === 'pending') {
      try {
        setIsRegistering(true);
        
        // Register the user with updated form data
        const { user, error } = await register(
          userData.name,
          userData.email,
          userData.password
        );
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (user) {
          // Create the subscription
          await createUserSubscriptionWithPayment({
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

  const handleProceedToPayment = (formData: typeof userData) => {
    // Update user data with form values
    setUserData(formData);
    setStep('checkout');
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
        {step === 'loading' && <CheckoutLoading />}
        
        {step === 'review' && plan && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">Revisar sua compra</h2>
              <p className="text-sm text-muted-foreground">Confirme seus dados e o plano selecionado</p>
            </div>
            
            <PlanDisplay plan={plan} />
            
            <UserDataReviewForm 
              initialData={userData}
              onSubmit={handleProceedToPayment}
            />
            
            <OrderSummary plan={plan} />
          </div>
        )}
        
        {step === 'checkout' && plan && (
          <div className="space-y-6">
            <PlanDisplay plan={plan} />
            
            <CheckoutContainer
              plan={plan}
              customerInfo={{
                name: userData.name,
                email: userData.email
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
