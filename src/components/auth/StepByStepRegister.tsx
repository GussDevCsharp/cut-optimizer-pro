
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { plans, PricingPlan } from "@/hooks/usePricingPlans";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import RegisterStepIndicator from './RegisterStepIndicator';
import UserInfoStep from './UserInfoStep';
import PlanSelectionStep from './PlanSelectionStep';

// Schema para validar os dados do usuário
const userSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

export type UserFormValues = z.infer<typeof userSchema>;

export default function StepByStepRegister() {
  const [currentStep, setCurrentStep] = useState<'userInfo' | 'checkout'>('userInfo');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const saveLeadToDatabase = async (data: UserFormValues, planId: string) => {
    try {
      console.log('Saving lead to database:', { 
        name: data.name, 
        email: data.email, 
        planId 
      });
      
      // Save lead to database
      const { data: leadData, error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          address: data.address,
          created_at: new Date().toISOString(),
          status: 'pending',
          source: `plan_${planId}`
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving lead:', error);
        throw error;
      }
      
      console.log('Lead saved successfully:', leadData);
      toast.success('Dados salvos com sucesso!');
      
      return leadData.id;
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast.error('Erro ao salvar dados. Tente novamente.');
      return null;
    }
  };

  const handleContinue = async (data: UserFormValues) => {
    if (!selectedPlan) {
      toast.error('Selecione um plano para continuar');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Salvar como lead no banco de dados
      const id = await saveLeadToDatabase(data, selectedPlan.id);
      
      if (id) {
        setLeadId(id);
        setCurrentStep('checkout');
        setCheckoutOpen(true);
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Erro ao salvar dados. Tente novamente.');
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
      
      <Form {...form}>
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
              <Button 
                type="submit" 
                size="lg" 
                disabled={!selectedPlan || isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? 'Salvando...' : 'Continuar para pagamento'}
              </Button>
            </div>
          )}
        </form>
      </Form>
      
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
