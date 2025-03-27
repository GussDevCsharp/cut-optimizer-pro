
import React, { useState } from 'react';
import { generateBoletoPayment, CustomerData, validateCPF } from "@/services/mercadoPago";
import { ProductInfo, PaymentStatus } from "../../CheckoutModal";
import { BoletoForm, BoletoReceiptInfo } from './';

interface BoletoPaymentProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

interface BoletoPaymentResponse {
  status: PaymentStatus;
  paymentId: string;
  boletoNumber: string;
  boletoUrl: string;
  expirationDate: string;
}

const BoletoPayment: React.FC<BoletoPaymentProps> = ({ product, onProcessing, onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<BoletoPaymentResponse | null>(null);

  // Validate all fields before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!validateCPF(cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      onProcessing(true);
      
      const customerData: CustomerData = {
        name,
        email,
        identificationType: 'CPF',
        identificationNumber: cpf.replace(/\D/g, '')
      };
      
      // Call the service to generate a Boleto payment
      const response = await generateBoletoPayment(product, customerData) as BoletoPaymentResponse;
      
      setPaymentData(response);
      onComplete('pending', response.paymentId);
    } catch (error) {
      console.error('Error generating Boleto payment:', error);
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  // If payment data is available, show boleto information
  if (paymentData) {
    return (
      <BoletoReceiptInfo
        boletoNumber={paymentData.boletoNumber}
        boletoUrl={paymentData.boletoUrl}
        expirationDate={paymentData.expirationDate}
      />
    );
  }

  // Show form to collect customer data
  return (
    <BoletoForm
      name={name}
      setName={setName}
      email={email}
      setEmail={setEmail}
      cpf={cpf}
      setCpf={setCpf}
      errors={errors}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
};

export default BoletoPayment;
