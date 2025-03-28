
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader, CreditCard } from 'lucide-react';
import { CustomerInfoForm } from "../customer-info";
import { CardInfoForm } from '../card-info';
import { MercadoPagoButton } from '../mercado-pago';

interface CardFormProps {
  // Customer information
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  cpf: string;
  setCpf: (value: string) => void;
  
  // Card information
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardholderName: string;
  setCardholderName: (value: string) => void;
  expirationMonth: string;
  setExpirationMonth: (value: string) => void;
  expirationYear: string;
  setExpirationYear: (value: string) => void;
  securityCode: string;
  setSecurityCode: (value: string) => void;
  installments: string;
  setInstallments: (value: string) => void;
  installmentOptions: any[];
  
  // UI states
  errors: Record<string, string>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const CardForm: React.FC<CardFormProps> = ({
  // Customer information
  name,
  setName,
  email,
  setEmail,
  cpf,
  setCpf,
  
  // Card information
  cardNumber,
  setCardNumber,
  cardholderName,
  setCardholderName,
  expirationMonth,
  setExpirationMonth,
  expirationYear,
  setExpirationYear,
  securityCode,
  setSecurityCode,
  installments,
  setInstallments,
  installmentOptions,
  
  // UI states
  errors,
  isLoading,
  onSubmit
}) => {
  const [useCustomButton, setUseCustomButton] = useState(false);
  
  // Product info para o MercadoPagoButton
  const productInfo = {
    id: 'card-payment',
    name: 'Pagamento com Cartão',
    description: 'Pagamento via cartão de crédito',
    price: installmentOptions?.length > 0 && installments ? 
      installmentOptions[parseInt(installments) - 1]?.amount || 0 : 0
  };

  const handlePaymentCreated = (preferenceId: string) => {
    console.log("MercadoPago preferenceId:", preferenceId);
    // Após criar o pagamento, notificar através do formulário
    onSubmit({} as React.FormEvent);
  };

  const handlePaymentError = (error: any) => {
    console.error("Erro ao processar pagamento:", error);
    // Falha no botão do MercadoPago, voltar para o botão padrão
    setUseCustomButton(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Customer Information Component */}
      <CustomerInfoForm
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        cpf={cpf}
        setCpf={setCpf}
        errors={errors}
        isLoading={isLoading}
      />
      
      {/* Card Information Component */}
      <CardInfoForm
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        cardholderName={cardholderName}
        setCardholderName={setCardholderName}
        expirationMonth={expirationMonth}
        setExpirationMonth={setExpirationMonth}
        expirationYear={expirationYear}
        setExpirationYear={setExpirationYear}
        securityCode={securityCode}
        setSecurityCode={setSecurityCode}
        installments={installments}
        setInstallments={setInstallments}
        installmentOptions={installmentOptions}
        errors={errors}
        isLoading={isLoading}
      />
      
      <div className="w-full mt-6">
        {useCustomButton || isLoading ? (
          <Button 
            type="submit" 
            className="w-full" 
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
        ) : (
          <MercadoPagoButton 
            product={productInfo}
            onPaymentCreated={handlePaymentCreated}
            onPaymentError={handlePaymentError}
          />
        )}
      </div>
    </form>
  );
};

export default CardForm;
