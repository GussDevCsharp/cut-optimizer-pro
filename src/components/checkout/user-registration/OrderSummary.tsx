
import React from 'react';
import { SubscriptionPlan } from '@/integrations/supabase/schema';

type OrderSummaryProps = {
  plan: SubscriptionPlan;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ plan }) => {
  // Format currency function
  const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
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
  );
};

export default OrderSummary;
