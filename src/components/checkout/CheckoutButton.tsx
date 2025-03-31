
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import { fetchSubscriptionPlans } from '@/services/subscriptionService';
import { SubscriptionPlan } from '@/integrations/supabase/schema';
import { useToast } from '@/hooks/use-toast';

interface CheckoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  fullWidth?: boolean;
  className?: string;
  planId?: string; // Optional plan ID
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  variant = 'default',
  size = 'default',
  showIcon = true,
  fullWidth = false,
  className = '',
  planId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen]);

  useEffect(() => {
    if (plans.length > 0 && planId) {
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
      }
    } else if (plans.length > 0) {
      // Default to the professional plan or the first plan
      const professionalPlan = plans.find(p => p.name === 'Profissional');
      setSelectedPlan(professionalPlan || plans[0]);
    }
  }, [plans, planId]);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const subscriptionPlans = await fetchSubscriptionPlans();
      setPlans(subscriptionPlans);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar planos",
        description: "Não foi possível obter os planos de assinatura."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handlePlanChange = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={`${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {showIcon && <LogIn className="mr-2 h-4 w-4" />}
        Assinar Agora
      </Button>

      {isOpen && (
        <CheckoutModal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          plans={plans}
          selectedPlan={selectedPlan}
          onPlanChange={handlePlanChange}
          isLoadingPlans={isLoading}
        />
      )}
    </>
  );
};

export default CheckoutButton;
