
import React from 'react';
import { CheckCircle, Loader } from 'lucide-react';
import { RegistrationSuccessProps } from './types';

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({ isRegistering }) => {
  if (isRegistering) {
    return (
      <div className="flex flex-col items-center py-8">
        <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-center text-muted-foreground">
          Criando sua conta...
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center py-8">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-xl font-bold mb-2">Pagamento Aprovado!</h3>
      <p className="text-center text-muted-foreground mb-6">
        Seu pagamento foi processado com sucesso e sua conta foi criada.
        Você será redirecionado para a plataforma em instantes.
      </p>
    </div>
  );
};

export default RegistrationSuccess;
