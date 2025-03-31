
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CheckoutCompleteProps {
  productName: string;
}

const CheckoutComplete: React.FC<CheckoutCompleteProps> = ({ productName }) => {
  return (
    <div className="flex flex-col items-center py-8">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-xl font-bold mb-2">Pagamento Aprovado!</h3>
      <p className="text-center text-muted-foreground mb-6">
        Seu pagamento foi processado com sucesso. Você será redirecionado em instantes.
      </p>
    </div>
  );
};

export default CheckoutComplete;
