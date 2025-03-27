
import { useNavigate } from 'react-router-dom';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  highlighted?: boolean;
}

export const plans: PricingPlan[] = [
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

interface UsePricingPlansProps {
  onPlanSelect?: (plan: {
    id: string;
    name: string;
    description: string;
    price: number;
  }) => void;
}

export const usePricingPlans = ({ onPlanSelect }: UsePricingPlansProps = {}) => {
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

  return {
    plans,
    handlePlanSelect
  };
};
