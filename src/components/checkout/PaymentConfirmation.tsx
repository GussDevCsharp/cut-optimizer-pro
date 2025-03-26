
import React from 'react';
import { PaymentStatus, ProductInfo } from './CheckoutModal';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentConfirmationProps {
  status: PaymentStatus;
  paymentMethod: 'pix' | 'card' | 'boleto';
  paymentId?: string;
  product: ProductInfo;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  status,
  paymentMethod,
  paymentId,
  product
}) => {
  // Map payment methods to Portuguese
  const paymentMethodNames = {
    pix: 'Pix',
    card: 'Cartão',
    boleto: 'Boleto'
  };

  // Render different content based on payment status
  const renderStatusContent = () => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pagamento aprovado!</h3>
            <p className="text-muted-foreground mb-4">
              Seu pagamento via {paymentMethodNames[paymentMethod]} foi aprovado com sucesso.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg w-full mb-4">
              <p className="text-sm font-medium">Detalhes da compra:</p>
              <p className="text-sm">Produto: {product.name}</p>
              <p className="text-sm">Valor: {formatPrice(product.price)}</p>
              <p className="text-sm">ID do pagamento: {paymentId || 'N/A'}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Enviamos um comprovante para o seu e-mail.
            </p>
          </div>
        );

      case 'rejected':
        return (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pagamento recusado</h3>
            <p className="text-muted-foreground mb-4">
              Infelizmente, seu pagamento via {paymentMethodNames[paymentMethod]} foi recusado.
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Erro no processamento</h3>
            <p className="text-muted-foreground mb-4">
              Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        );

      case 'pending':
        // For Pix and Boleto, we'll show the payment details directly, not this
        // But we include it for completeness
        return (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <Info className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pagamento pendente</h3>
            <p className="text-muted-foreground mb-4">
              Seu pagamento via {paymentMethodNames[paymentMethod]} está sendo processado.
            </p>
            <p className="text-sm text-muted-foreground">
              Assim que for confirmado, você receberá uma notificação.
            </p>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Info className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Status desconhecido</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível determinar o status do seu pagamento.
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        );
    }
  };

  // Format price to Brazilian currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="p-6">
      {renderStatusContent()}
    </div>
  );
};

export default PaymentConfirmation;
