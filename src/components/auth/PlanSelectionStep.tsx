
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { plans, PricingPlan } from "@/hooks/usePricingPlans";

interface PlanSelectionStepProps {
  selectedPlan: PricingPlan | null;
  onSelectPlan: (plan: PricingPlan) => void;
}

export default function PlanSelectionStep({ 
  selectedPlan, 
  onSelectPlan 
}: PlanSelectionStepProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Escolha seu Plano</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedPlan?.id || ''}
          onValueChange={(value) => {
            const plan = plans.find(p => p.id === value);
            if (plan) onSelectPlan(plan);
          }}
        >
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                <RadioGroupItem
                  value={plan.id}
                  id={plan.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={plan.id}
                  className={`flex flex-col p-4 border-2 rounded-md cursor-pointer transition-all
                    ${selectedPlan?.id === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'}
                    peer-focus-visible:ring-2 peer-focus-visible:ring-primary`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-lg">{plan.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">{plan.description}</div>
                      <div className="font-bold text-xl">
                        R$ {plan.price.toFixed(2).replace('.', ',')}
                        <span className="font-normal text-sm text-muted-foreground">/{plan.duration}</span>
                      </div>
                    </div>
                    {plan.highlighted && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium py-1 px-2 rounded-bl-md rounded-tr-md">
                        Popular
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-6">
                        +{plan.features.length - 3} recursos adicionais
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
