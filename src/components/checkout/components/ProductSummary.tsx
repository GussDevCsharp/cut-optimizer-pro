
import React from 'react';
import { ProductInfo } from '../CheckoutModal';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';

interface ProductSummaryProps {
  product: ProductInfo;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({ product }) => {
  // Format currency
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // For demo purposes, let's create some features based on the plan name
  const getFeatures = (): string[] => {
    const baseFeatures = [
      'Acesso à plataforma',
      'Suporte por email'
    ];

    if (product.name === 'Básico') {
      return [
        ...baseFeatures,
        'Projetos ilimitados',
        'Até 50 peças por projeto'
      ];
    } else if (product.name === 'Profissional') {
      return [
        ...baseFeatures,
        'Projetos ilimitados',
        'Peças ilimitadas por projeto',
        'Exportação para PDF',
        'Suporte prioritário'
      ];
    } else if (product.name === 'Empresarial') {
      return [
        ...baseFeatures,
        'Projetos ilimitados',
        'Peças ilimitadas por projeto',
        'Exportação para PDF e Excel',
        'Suporte prioritário 24/7',
        'Acesso à API',
        'Usuários múltiplos'
      ];
    }

    return baseFeatures;
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.description}</p>
        </div>

        <div className="mb-4">
          <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
        </div>

        <Separator className="my-4" />

        <div>
          <h4 className="font-medium mb-2">O que está incluído:</h4>
          <ul className="space-y-2">
            {getFeatures().map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
