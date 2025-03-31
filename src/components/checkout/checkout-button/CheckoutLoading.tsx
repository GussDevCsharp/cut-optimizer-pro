
import React from 'react';
import { Loader } from 'lucide-react';

interface CheckoutLoadingProps {
  message?: string;
}

const CheckoutLoading: React.FC<CheckoutLoadingProps> = ({ 
  message = "Inicializando o checkout..." 
}) => {
  return (
    <div className="flex flex-col items-center py-12">
      <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-center text-muted-foreground">
        {message}
      </p>
    </div>
  );
};

export default CheckoutLoading;
