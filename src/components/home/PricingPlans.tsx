
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    description: 'Ideal para marceneiros iniciantes',
    price: 29.90,
    duration: 'mensal',
    features: [
      'Ilimitados planos de corte',
      'Até 20 peças por projeto',
      'Suporte por email',
      'Exportação em PDF'
    ]
  },
  {
    id: 'pro',
    name: 'Profissional',
    description: 'Perfeito para profissionais',
    price: 49.90,
    duration: 'mensal',
    features: [
      'Ilimitados planos de corte',
      'Peças ilimitadas por projeto',
      'Suporte prioritário',
      'Exportação em PDF e DXF',
      'Relatórios detalhados',
      'Otimização avançada'
    ],
    highlighted: true
  },
  {
    id: 'business',
    name: 'Empresarial',
    description: 'Para marcenarias e empresas',
    price: 99.90,
    duration: 'mensal',
    features: [
      'Todos os recursos do Profissional',
      'Múltiplos usuários',
      'Gestão de estoque',
      'Integração com ERPs',
      'Suporte 24/7',
      'Treinamento personalizado'
    ]
  }
];

interface PricingPlansProps {
  onPlanSelect?: (plan: {
    id: string;
    name: string;
    description: string;
    price: number;
  }) => void;
}

export default function PricingPlans({ onPlanSelect }: PricingPlansProps) {
  const navigate = useNavigate();

  const handlePlanSelect = (plan: {
    id: string;
    name: string;
    description: string;
    price: number;
  }) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    } else {
      navigate('/cadastro');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div 
          key={plan.id}
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
            onClick={() => handlePlanSelect({
              id: plan.id,
              name: plan.name,
              description: plan.description,
              price: plan.price
            })}
          >
            Assinar agora
          </Button>
        </div>
      ))}
    </div>
  );
}
