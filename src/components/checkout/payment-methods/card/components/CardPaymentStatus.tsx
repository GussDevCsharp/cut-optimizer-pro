
import React from 'react';
import TransactionStatusTracker from '@/components/checkout/components/TransactionStatusTracker';

interface CardPaymentStatusProps {
  isSandbox: boolean;
}

const CardPaymentStatus: React.FC<CardPaymentStatusProps> = ({ isSandbox }) => {
  return (
    <div className="space-y-4">
      {!isSandbox && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-md mb-4">
          <p className="text-green-800 text-sm">
            <strong>Modo de produção ativo.</strong> Pagamentos reais serão processados.
          </p>
        </div>
      )}
      
      <TransactionStatusTracker />
    </div>
  );
};

export default CardPaymentStatus;
