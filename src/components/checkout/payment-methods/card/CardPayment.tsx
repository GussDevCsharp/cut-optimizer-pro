
import React, { useState, useEffect } from 'react';
import { getInstallmentOptions } from "@/services/mercadoPago";
import { ProductInfo, PaymentStatus } from "../../CheckoutModal";
import CardForm from './CardForm';
import { useCardPaymentProcessor } from './hooks';
import { CardPaymentStatus } from './components';

interface CardPaymentProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

const CardPayment: React.FC<CardPaymentProps> = ({ product, onProcessing, onComplete }) => {
  // Customer information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  
  // Card information
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [installments, setInstallments] = useState('1');
  
  // UI state
  const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);
  
  // Initialize the payment processor hook
  const {
    isLoading,
    errors,
    isSandbox,
    checkSandboxMode,
    processPayment
  } = useCardPaymentProcessor({
    product,
    onProcessing,
    onComplete
  });

  // Check sandbox mode and generate installment options on component mount
  useEffect(() => {
    checkSandboxMode();
    
    const options = getInstallmentOptions(product.price);
    setInstallmentOptions(options);
  }, [product.price]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await processPayment({
      name,
      email,
      cpf,
      cardNumber,
      cardholderName,
      expirationMonth,
      expirationYear,
      securityCode,
      installments
    });
  };

  return (
    <div className="space-y-4">
      <CardPaymentStatus isSandbox={isSandbox} />
      
      <CardForm
        // Customer information
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        cpf={cpf}
        setCpf={setCpf}
        
        // Card information
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
        
        // UI states
        errors={errors}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CardPayment;
