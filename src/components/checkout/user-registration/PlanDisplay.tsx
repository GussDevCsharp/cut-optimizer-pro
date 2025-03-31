
import React from 'react';
import { PlanDisplayProps } from './types';
import { CheckCircle } from 'lucide-react';

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  if (!plan) return null;

  // Format currency
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
      <p className="mt-2 text-xl font-bold">{formatCurrency(plan.price)}</p>
      <div className="mt-2">
        <ul className="text-sm">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanDisplay;
