
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader, CreditCard } from 'lucide-react';
import { CustomerInfoForm } from "../customer-info";
import { CardInfoForm } from '../card-info';

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
      
      <Button 
        type="submit" 
        className="w-full mt-6" 
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
    </form>
  );
};

export default CardForm;
