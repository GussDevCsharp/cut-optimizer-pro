
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader, CreditCard } from 'lucide-react';

interface PaymentButtonProps {
  isLoading: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ isLoading }) => {
  return (
    <Button 
      type="submit" 
      className="w-full mt-6" 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Processando pagamento...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pagar com cartão
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
