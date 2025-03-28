
import React, { useState, useEffect } from 'react';
import { 
  getInstallmentOptions,
  processCardPayment,
  CustomerData,
  CardData,
  validateCPF
} from "@/services/mercadoPago";
import { ProductInfo, PaymentStatus } from "../../CheckoutModal";
import CardForm from './CardForm';
import { usePayment } from '../../context/PaymentContext';
import TransactionStatusTracker from '../../components/TransactionStatusTracker';

interface CardPaymentProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

interface PaymentResponse {
  status: PaymentStatus;
  paymentId?: string;
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
  
  // UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);
  
  // Get transaction step tracking from context
  const { startTransaction, updateTransactionStep } = usePayment();

  // Generate installment options when component mounts
  useEffect(() => {
    const options = getInstallmentOptions(product.price);
    setInstallmentOptions(options);
  }, [product.price]);

  // Validate all fields before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate customer information
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!validateCPF(cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    // Validate card information
    if (!cardNumber.trim() || cardNumber.replace(/\D/g, '').length < 16) {
      newErrors.cardNumber = 'Número de cartão inválido';
    }
    
    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Nome no cartão é obrigatório';
    }
    
    if (!expirationMonth || !expirationYear) {
      newErrors.expiration = 'Data de validade inválida';
    }
    
    if (!securityCode.trim() || securityCode.length < 3) {
      newErrors.securityCode = 'Código de segurança inválido';
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
      
      // Define transaction steps for visual tracking
      startTransaction([
        "Validando informações do cliente",
        "Verificando dados do cartão",
        "Processando pagamento",
        "Autorizando transação",
        "Finalizando"
      ]);
      
      // Step 1: Validate customer info
      updateTransactionStep(0);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      const customerData: CustomerData = {
        name,
        email,
        identificationType: 'CPF',
        identificationNumber: cpf.replace(/\D/g, '')
      };
      
      // Step 2: Prepare card data
      updateTransactionStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      const cardData: CardData = {
        cardNumber: cardNumber.replace(/\D/g, ''),
        cardholderName,
        cardExpirationMonth: expirationMonth,
        cardExpirationYear: expirationYear,
        securityCode,
        issuer: 'visa', // This would normally be detected by Mercado Pago
        installments: parseInt(installments, 10),
        paymentMethodId: 'visa', // This would normally be detected by Mercado Pago
        identificationType: 'CPF',
        identificationNumber: cpf.replace(/\D/g, '')
      };
      
      // Step 3: Process payment
      updateTransactionStep(2);
      
      // Call the service to process the card payment and explicitly type the response
      const response = await processCardPayment(product, cardData, customerData) as PaymentResponse;
      
      // Step 4: Authorization
      updateTransactionStep(3);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      // Step 5: Finalizing
      updateTransactionStep(4);
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
      
      onComplete(response.status, response.paymentId);
    } catch (error) {
      console.error('Error processing card payment:', error);
      // Fix: Use the step number directly instead of referencing currentStep variable
      updateTransactionStep(2, 'error'); // Assuming error happens during payment processing (step 2)
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <TransactionStatusTracker />
      
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
