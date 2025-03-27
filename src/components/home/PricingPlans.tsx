
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePricingPlans, PricingPlan } from '@/hooks/usePricingPlans';

interface PricingPlansProps {
  onPlanSelect?: (plan: PricingPlan) => void;
}

const PlanCard: React.FC<{
  plan: PricingPlan;
  onSelect: (plan: PricingPlan) => void;
}> = ({ plan, onSelect }) => {
  return (
    <div 
      className={`relative flex flex-col p-6 bg-card rounded-xl shadow-sm border ${
        plan.highlighted ? 'border-primary ring-1 ring-primary' : ''
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          Mais popular
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-muted-foreground mt-1">{plan.description}</p>
      </div>
      
      <div className="mt-4 mb-6">
        <span className="text-3xl font-bold">
          R$ {plan.price.toFixed(2).replace('.', ',')}
        </span>
        <span className="text-muted-foreground">/{plan.duration}</span>
      </div>
      
      <ul className="space-y-3 flex-1 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full ${plan.highlighted ? '' : 'bg-card hover:bg-card/90 text-card-foreground border'}`}
        variant={plan.highlighted ? "default" : "outline"}
        onClick={() => onSelect(plan)}
      >
        Assinar agora
      </Button>
    </div>
  );
};

const PricingPlans = ({ onPlanSelect }: PricingPlansProps) => {
  const { plans, handlePlanSelect } = usePricingPlans({ onPlanSelect });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onSelect={handlePlanSelect}
        />
      ))}
    </div>
  );
};

export { PricingPlans };
export default PricingPlans;
