
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader, CreditCard } from 'lucide-react';
import { CustomerInfoForm } from "../customer-info";
import { CardInfoForm } from '../card-info';
import { MercadoPagoButton } from '../mercado-pago';
import "../mercado-pago/mercadoPagoStyles.css";

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
  // Determine if we should use the custom button instead of MercadoPago
  const [useCustomButton, setUseCustomButton] = useState(false);
  // State to track if customer data has been filled
  const [isCustomerDataValid, setIsCustomerDataValid] = useState(false);
  
  // Product info para o MercadoPagoButton
  const productInfo = {
    id: 'card-payment',
    name: 'Pagamento com Cartão',
    description: 'Pagamento via cartão de crédito',
    price: installmentOptions?.length > 0 && installments ? 
      installmentOptions[parseInt(installments) - 1]?.totalAmount || 0 : 0
  };

  // Validate customer data before showing payment button
  useEffect(() => {
    const isValid = Boolean(
      name.trim() && 
      email.trim() && 
      email.includes('@') && 
      cpf.trim() && 
      cpf.replace(/\D/g, '').length === 11
    );
    
    setIsCustomerDataValid(isValid);
  }, [name, email, cpf]);

  // Handler for when payment is created by MercadoPago
  const handlePaymentCreated = (preferenceId: string) => {
    console.log("Payment created with preferenceId:", preferenceId);
    // Submit the form directly without event
    onSubmit({} as React.FormEvent);
  };

  // Handler for errors in MercadoPago button
  const handlePaymentError = (error: any) => {
    console.error("Error processing payment:", error);
    // Fall back to standard button
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
        {/* Show MercadoPago button if customer data is valid */}
        {isCustomerDataValid && !useCustomButton && !isLoading ? (
          <MercadoPagoButton 
            product={productInfo}
            onPaymentCreated={handlePaymentCreated}
            onPaymentError={handlePaymentError}
          />
        ) : (
          /* Show regular button if loading, or if MercadoPago button failed */
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isCustomerDataValid}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Processando pagamento...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {isCustomerDataValid ? 'Pagar com cartão' : 'Preencha os dados para continuar'}
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default CardForm;
