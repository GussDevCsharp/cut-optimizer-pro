
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
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema para validar os dados do usuário
const userSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

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
  const { register } = useAuth();
  const { toast } = useToast();

  // Inicializar o formulário com os dados do usuário
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userCredentials.name,
      email: userCredentials.email,
      password: userCredentials.password,
      confirmPassword: userCredentials.password,
    },
  });

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
      if (userCredentials?.email) {
        await updateLeadStatus(userCredentials.email, leadStatus);
        console.log(`Lead status updated to ${leadStatus}`);
      }
    } catch (error) {
      console.error("Failed to update lead status:", error);
      // Continue even if lead update fails
    }
    
    if (status === 'approved' || status === 'pending') {
      try {
        setIsRegistering(true);
        
        // Obter os dados atualizados do formulário
        const formData = form.getValues();
        
        // Register the user
        const { user, error } = await register(
          formData.name,
          formData.email,
          formData.password
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

  const handleProceedToPayment = (data: z.infer<typeof userSchema>) => {
    // Prosseguir para o checkout com os dados atualizados
    setStep('checkout');
  };

  const handleCloseDialog = (open: boolean) => {
    // Only allow closing when not in the middle of registration
    if (!isRegistering) {
      onOpenChange(open);
    }
  };

  // Format currency function
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 'loading' && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {step === 'review' && plan && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">Revisar sua compra</h2>
              <p className="text-sm text-muted-foreground">Confirme seus dados e o plano selecionado</p>
            </div>
            
            <PlanDisplay plan={plan} />
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleProceedToPayment)} className="space-y-4">
                <div className="border p-4 rounded-md space-y-3">
                  <h3 className="text-lg font-medium">Seus dados</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="******" 
                            type="password" 
                            showPasswordToggle
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirme a senha</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="******" 
                            type="password" 
                            showPasswordToggle
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border p-4 rounded-md space-y-3">
                  <h3 className="text-lg font-medium">Resumo do pedido</h3>
                  
                  <div className="flex justify-between items-center">
                    <span>{plan.name}</span>
                    <span>{formatCurrency(plan.price)}</span>
                  </div>
                  
                  <div className="border-t pt-2 mt-2 flex justify-between items-center font-medium">
                    <span>Total:</span>
                    <span>{formatCurrency(plan.price)}</span>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Prosseguir para pagamento
                </Button>
              </form>
            </Form>
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
                name: form.getValues().name,
                email: form.getValues().email
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
