
import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSubscriptionPlans } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/integrations/supabase/schema';
import UserRegistrationCheckout from '../checkout/UserRegistrationCheckout';

interface UserCredentials {
  name: string;
  email: string;
  password: string;
}

const PricingPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [userCredentials, setUserCredentials] = useState<UserCredentials>({
    name: 'Usuário Teste',
    email: 'usuario@teste.com', 
    password: 'senha123'
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    const subscriptionPlans = await fetchSubscriptionPlans();
    setPlans(subscriptionPlans);
    setIsLoading(false);
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlanId(planId);
    setIsCheckoutOpen(true);
  };

  // For demo purposes - in production, you would collect these from a form
  const setDemoCredentials = () => {
    setUserCredentials({
      name: 'Usuário Demo',
      email: `user${Math.floor(Math.random() * 10000)}@example.com`,
      password: 'Password123!'
    });
  };

  // Format currency
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <section id="pricing" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Planos e Preços</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades e comece a otimizar seus projetos hoje mesmo.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-12 w-64 bg-muted rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-96 w-full bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`border-2 ${plan.name === 'Profissional' ? 'border-primary' : 'border-border'}`}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.duration_days} dias</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.name === 'Profissional' ? 'default' : 'outline'}
                    onClick={() => {
                      setDemoCredentials();
                      handlePlanSelection(plan.id);
                    }}
                  >
                    Selecionar Plano
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {selectedPlanId && (
        <UserRegistrationCheckout
          isOpen={isCheckoutOpen}
          onOpenChange={setIsCheckoutOpen}
          planId={selectedPlanId}
          userCredentials={userCredentials}
          onPaymentComplete={(status) => {
            console.log("Payment status:", status);
            // Additional logic after payment
          }}
        />
      )}
    </section>
  );
};

export default PricingPlans;
