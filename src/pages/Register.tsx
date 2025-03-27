
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PricingPlans from "@/components/home/PricingPlans";
import { RegisterForm, RegisterFormValues } from "@/components/auth/RegisterForm";
import { toast } from "sonner";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import { PaymentStatus } from "@/components/checkout/CheckoutModal";
import { PricingPlan } from "@/hooks/usePricingPlans";

export default function Register() {
  const { isAuthenticated, isLoading, register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormValues | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-32 bg-primary/20 rounded"></div>
        </div>
      </div>
    );
  }
  
  // If already authenticated, don't render the register form
  if (isAuthenticated) {
    return null;
  }

  const handleFormSubmit = async (data: RegisterFormValues) => {
    setFormData(data);
    // Show checkout modal
    setCheckoutOpen(true);
  };

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentComplete = async (status: PaymentStatus, paymentId?: string) => {
    console.log('Payment completed with status:', status, 'and ID:', paymentId);
    
    if (status === 'approved' && formData) {
      try {
        console.log("Register.tsx: Registering user after payment approval");
        // Register user with the provided credentials
        await register(formData.name, formData.email, formData.password);
        
        toast.success("Conta criada com sucesso!", {
          description: "Seu acesso à plataforma foi ativado.",
        });
        
        // Redirect to dashboard after successful payment and registration
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error: any) {
        console.error("Register.tsx: Erro ao registrar usuário após pagamento:", error);
        toast.error("Erro ao criar conta", {
          description: error.message || "Não foi possível criar sua conta. Entre em contato com o suporte.",
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg">CutOptimizer</span>
            </Link>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground mr-4"
            >
              Já tenho uma conta
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Escolha seu plano</h1>
            <p className="text-muted-foreground mt-2">
              Selecione o plano ideal para o seu negócio e comece a otimizar seus projetos hoje mesmo.
            </p>
          </div>

          <PricingPlans onPlanSelect={handlePlanSelect} />

          {selectedPlan && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Crie sua conta</h2>
                <p className="text-muted-foreground mb-6">
                  Complete seu cadastro para continuar com a compra do plano {selectedPlan.name}
                </p>
                <RegisterForm onSubmit={handleFormSubmit} isLoading={false} />
              </div>
            </div>
          )}
        </div>
      </main>

      {formData && selectedPlan && (
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

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:h-16 items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} CutOptimizer. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
