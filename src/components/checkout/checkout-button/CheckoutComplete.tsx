
import React, { useEffect, useState } from 'react';
import { CheckCircle, Gift, PartyPopper } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutCompleteProps {
  productName: string;
}

const CheckoutComplete: React.FC<CheckoutCompleteProps> = ({ productName }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Show success toast when component mounts
    toast({
      title: "Pagamento bem-sucedido!",
      description: `Sua compra de ${productName} foi confirmada.`,
      variant: "default",
    });
    
    // Trigger animation after a small delay
    setTimeout(() => setShowConfetti(true), 300);
  }, [productName]);

  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 overflow-hidden">
      <CardContent className="py-8 px-4">
        <div className="flex flex-col items-center text-center">
          {/* Icon animation */}
          <div className="relative mb-6">
            <CheckCircle 
              className="h-16 w-16 text-green-500 animate-scale-in z-10 relative" 
            />
            
            {showConfetti && (
              <>
                <PartyPopper 
                  className="absolute -left-6 -top-4 h-6 w-6 text-amber-500 animate-fade-in" 
                />
                <Gift 
                  className="absolute -right-6 -top-4 h-6 w-6 text-purple-500 animate-fade-in" 
                />
              </>
            )}
          </div>
          
          {/* Success message */}
          <h3 className="text-xl font-bold mb-2 text-green-700 dark:text-green-400 animate-fade-in">
            Pagamento Aprovado!
          </h3>
          
          <div className="space-y-3 animate-fade-in">
            <p className="text-center text-muted-foreground">
              Seu pagamento para <span className="font-medium text-foreground">{productName}</span> foi 
              processado com sucesso.
            </p>
            
            <p className="text-sm text-muted-foreground">
              Você receberá uma confirmação por e-mail em breve e será redirecionado automaticamente.
            </p>
            
            <div className="w-full max-w-xs mx-auto mt-4 p-2 bg-green-100 dark:bg-green-800/30 rounded-md">
              <p className="text-xs text-green-700 dark:text-green-400 text-center">
                Pedido confirmado • Preparando sua compra
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutComplete;
