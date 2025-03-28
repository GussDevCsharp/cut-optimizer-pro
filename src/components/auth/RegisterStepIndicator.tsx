
import React from 'react';
import { Check, UserRound, CreditCard } from 'lucide-react';

interface RegisterStepIndicatorProps {
  currentStep: 'userInfo' | 'checkout';
}

export default function RegisterStepIndicator({ currentStep }: RegisterStepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          {/* Etapa 1 - Informações do usuário */}
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${currentStep === 'userInfo' 
                ? 'border-primary bg-primary text-primary-foreground' 
                : 'border-primary bg-background text-primary'}`}>
              <UserRound className="h-5 w-5" />
            </div>
            <span className="mt-2 text-sm font-medium">Seus dados</span>
          </div>
          
          {/* Linha de conexão */}
          <div className={`w-16 h-0.5 mx-2 ${currentStep === 'userInfo' ? 'bg-muted' : 'bg-primary'}`}></div>
          
          {/* Etapa 2 - Checkout */}
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
              ${currentStep === 'checkout' 
                ? 'border-primary bg-primary text-primary-foreground' 
                : 'border-muted bg-muted text-muted-foreground'}`}>
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="mt-2 text-sm font-medium">Pagamento</span>
          </div>
        </div>
      </div>
    </div>
  );
}
