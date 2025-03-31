
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { PricingPlan } from "@/hooks/usePricingPlans";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import RegisterStepIndicator from './RegisterStepIndicator';
import UserInfoStep from './UserInfoStep';
import PlanSelectionStep from './PlanSelectionStep';
import { useUserForm } from '@/hooks/useUserForm';
import { useLeadManagement, UserFormValues } from '@/hooks/useLeadManagement';
import { supabase } from '@/integrations/supabase/client';

export type { UserFormValues } from '@/hooks/useLeadManagement';

export default function StepByStepRegister() {
  const [currentStep, setCurrentStep] = useState<'userInfo' | 'checkout'>('userInfo');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useUserForm();
  const { saveLeadToDatabase } = useLeadManagement();

  const handleContinue = async (data: UserFormValues) => {
    if (!selectedPlan) {
      toast.error('Selecione um plano para continuar');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Salvar como lead no banco de dados
      const id = await saveLeadToDatabase(data, `plan_${selectedPlan.id}`);
      
      if (id) {
        setLeadId(id);
        setCurrentStep('checkout');
        setCheckoutOpen(true);
      } else {
        // If no ID was returned, something went wrong
        throw new Error('Falha ao registrar seus dados. Por favor, tente novamente.');
      }
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast.error('Erro ao salvar dados. Tente novamente.', {
        description: error.message || 'Houve um problema ao salvar seus dados.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentComplete = async (status: PaymentStatus, paymentId?: string) => {
    console.log('Payment completed with status:', status, 'and ID:', paymentId);
    
    if (status === 'approved' && form.getValues() && leadId) {
      try {
        const formData = form.getValues();
        
        console.log('Updating lead status:', leadId);
        // Update lead status
        const { error: updateError } = await supabase
          .from('leads')
          .update({ 
            status: 'converted', 
            payment_id: paymentId,
            updated_at: new Date().toISOString()
          })
          .eq('id', leadId);
          
        if (updateError) {
          console.error('Error updating lead status:', updateError);
          throw updateError;
        }
        
        console.log("Registering user after payment approval");
        await register(formData.name, formData.email, formData.password);
        
        // Get the newly registered user
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData.user) {
          // Update profile with address
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              address: formData.address,
              updated_at: new Date().toISOString()
            })
            .eq('id', userData.user.id);
            
          if (profileError) {
            console.error("Error updating profile address:", profileError);
          }
          
          console.log('Inserting transaction record');
          // Insert transaction record
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              user_id: userData.user.id,
              product_id: selectedPlan?.id || '',
              product_name: selectedPlan?.name || '',
              payment_id: paymentId || '',
              payment_method: 'card',
              payment_status: 'approved',
              amount: selectedPlan?.price || 0,
              created_at: new Date().toISOString()
            });
            
          if (transactionError) {
            console.error('Error inserting transaction:', transactionError);
          }
        }
        
        toast.success("Cadastro concluído com sucesso!", {
          description: "Seu acesso à plataforma foi ativado."
        });
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: any) {
        console.error('Error registering user:', error);
        toast.error("Erro ao cadastrar usuário", {
          description: error.message || "Por favor, tente novamente."
        });
      }
    } else if (status === 'rejected' || status === 'error') {
      toast.error("Falha no pagamento", {
        description: "Houve um problema com seu pagamento. Por favor, tente novamente."
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <RegisterStepIndicator currentStep={currentStep} />
      
      <form onSubmit={form.handleSubmit(handleContinue)} className="space-y-6">
        {currentStep === 'userInfo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coluna de informações do usuário */}
            <UserInfoStep form={form} />
            
            {/* Coluna de seleção de planos */}
            <PlanSelectionStep 
              selectedPlan={selectedPlan} 
              onSelectPlan={handlePlanSelect}
            />
          </div>
        )}
        
        {currentStep === 'userInfo' && (
          <div className="flex justify-center mt-8">
            <button 
              type="submit" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedPlan || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⚙️</span>
                  Salvando...
                </>
              ) : 'Continuar para pagamento'}
            </button>
          </div>
        )}
      </form>
      
      {selectedPlan && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          product={{
            id: selectedPlan.id,
            name: selectedPlan.name,
            description: selectedPlan.description,
            price: selectedPlan.price
          }}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
