
import React from 'react';

const CheckoutLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

export default CheckoutLoading;
