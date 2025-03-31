
import React from 'react';
import { ProductInfo, PaymentStatus } from "../CheckoutModal";
import {
  CustomerInfoForm,
  CardInfoForm,
  PaymentButton,
  useCardPaymentForm
} from './card-payment';

interface CardPaymentProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

const CardPayment: React.FC<CardPaymentProps> = ({ product, onProcessing, onComplete }) => {
  const {
    formState,
    handleChange,
    handleCardNumberChange,
    handleCpfChange,
    handleSubmit,
    errors,
    isLoading
  } = useCardPaymentForm({ product, onProcessing, onComplete });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Information */}
      <CustomerInfoForm
        name={formState.name}
        email={formState.email}
        cpf={formState.cpf}
        onNameChange={(value) => handleChange('name', value)}
        onEmailChange={(value) => handleChange('email', value)}
        onCpfChange={handleCpfChange}
        errors={errors}
        isLoading={isLoading}
      />
      
      {/* Card Information */}
      <CardInfoForm
        cardNumber={formState.cardNumber}
        cardholderName={formState.cardholderName}
        expirationMonth={formState.expirationMonth}
        expirationYear={formState.expirationYear}
        securityCode={formState.securityCode}
        installments={formState.installments}
        onCardNumberChange={handleCardNumberChange}
        onCardholderNameChange={(value) => handleChange('cardholderName', value)}
        onExpirationMonthChange={(value) => handleChange('expirationMonth', value)}
        onExpirationYearChange={(value) => handleChange('expirationYear', value)}
        onSecurityCodeChange={(value) => handleChange('securityCode', value)}
        onInstallmentsChange={(value) => handleChange('installments', value)}
        errors={errors}
        isLoading={isLoading}
        productPrice={product.price}
      />
      
      {/* Payment Button */}
      <PaymentButton isLoading={isLoading} />
    </form>
  );
};

export default CardPayment;
