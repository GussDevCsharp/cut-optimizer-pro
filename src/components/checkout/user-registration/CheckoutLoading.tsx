
import React from 'react';

const CheckoutLoading: React.FC<{ message?: string }> = ({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col justify-center items-center py-8 space-y-4">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default CheckoutLoading;
