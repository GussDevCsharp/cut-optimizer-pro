
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PaymentStatus, ProductInfo } from './CheckoutModal';
import { useAuth } from '@/context/AuthContext';
import { createUserSubscription, recordPayment } from '@/services/subscriptionService';

interface PaymentConfirmationProps {
  status: PaymentStatus;
  paymentId?: string;
  onClose: () => void;
  product: ProductInfo;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  status,
  paymentId,
  onClose,
  product
}) => {
  const { user } = useAuth();

  useEffect(() => {
    if (status === 'approved' && user?.id && paymentId) {
      handleSuccessfulPayment();
    }
  }, [status, paymentId, user]);

  const handleSuccessfulPayment = async () => {
    if (!user?.id || !paymentId) return;

    try {
      // Create user subscription
      await createUserSubscription(user.id, product.id);
      
      // Record payment in history
      await recordPayment(
        user.id,
        product.id,
        product.price,
        'card', // This should ideally be dynamic based on the method used
        'approved',
        paymentId
      );
      
      console.log("Subscription created and payment recorded successfully");
    } catch (error) {
      console.error("Error creating subscription after payment:", error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-amber-500" />;
      default:
        return <AlertTriangle className="h-16 w-16 text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'approved':
        return 'Pagamento Aprovado!';
      case 'rejected':
        return 'Pagamento Rejeitado';
      case 'pending':
        return 'Pagamento Pendente';
      default:
        return 'Erro no Pagamento';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'approved':
        return 'Seu pagamento foi processado com sucesso. Sua assinatura está ativa.';
      case 'rejected':
        return 'Seu pagamento foi rejeitado. Por favor, tente outro método de pagamento ou entre em contato com sua operadora de cartão.';
      case 'pending':
        return 'Seu pagamento está sendo processado. Você receberá uma confirmação em breve.';
      default:
        return 'Ocorreu um erro durante o processamento do seu pagamento. Por favor, tente novamente mais tarde.';
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-6 pb-4 px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            {getStatusIcon()}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {getStatusTitle()}
          </h2>
          
          <p className="text-muted-foreground mb-4">
            {getStatusMessage()}
          </p>
          
          {paymentId && (
            <p className="text-xs bg-muted p-2 rounded-md w-full mb-4">
              ID do Pagamento: <span className="font-mono">{paymentId}</span>
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0 flex justify-center">
        <Button onClick={onClose}>
          {status === 'approved' ? 'Continuar' : 'Fechar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentConfirmation;
