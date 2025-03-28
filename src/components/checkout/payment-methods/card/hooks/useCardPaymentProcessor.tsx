
import { useState } from 'react';
import { 
  CustomerData,
  CardData,
  processCardPayment,
  getMercadoPagoConfig
} from "@/services/mercadoPago";
import { ProductInfo, PaymentStatus } from "@/components/checkout/CheckoutModal";
import { usePayment } from '@/components/checkout/context/PaymentContext';

interface UseCardPaymentProcessorProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

interface CardPaymentFormData {
  // Customer information
  name: string;
  email: string;
  cpf: string;
  
  // Card information
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  installments: string;
}

export const useCardPaymentProcessor = ({
  product,
  onProcessing,
  onComplete
}: UseCardPaymentProcessorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSandbox, setIsSandbox] = useState(true);
  
  // Get transaction step tracking from context
  const { startTransaction, updateTransactionStep } = usePayment();
  
  // Check if we're in sandbox mode
  const checkSandboxMode = async () => {
    try {
      const config = await getMercadoPagoConfig();
      setIsSandbox(config.isSandbox);
      console.log(`Card payment initialized in ${config.isSandbox ? 'SANDBOX' : 'PRODUCTION'} mode`);
    } catch (error) {
      console.error('Error checking sandbox mode:', error);
    }
  };

  // Validate all fields before submission
  const validateForm = (formData: CardPaymentFormData): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate customer information
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    // Validate card information
    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\D/g, '').length < 16) {
      newErrors.cardNumber = 'Número de cartão inválido';
    }
    
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Nome no cartão é obrigatório';
    }
    
    if (!formData.expirationMonth || !formData.expirationYear) {
      newErrors.expiration = 'Data de validade inválida';
    }
    
    if (!formData.securityCode.trim() || formData.securityCode.length < 3) {
      newErrors.securityCode = 'Código de segurança inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const processPayment = async (formData: CardPaymentFormData) => {
    if (!validateForm(formData)) return;
    
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
        name: formData.name,
        email: formData.email,
        identificationType: 'CPF',
        identificationNumber: formData.cpf.replace(/\D/g, '')
      };
      
      // Step 2: Prepare card data
      updateTransactionStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      const cardData: CardData = {
        cardNumber: formData.cardNumber.replace(/\D/g, ''),
        cardholderName: formData.cardholderName,
        cardExpirationMonth: formData.expirationMonth,
        cardExpirationYear: formData.expirationYear,
        securityCode: formData.securityCode,
        issuer: 'visa', // This would normally be detected by Mercado Pago
        installments: parseInt(formData.installments, 10),
        paymentMethodId: 'visa', // This would normally be detected by Mercado Pago
        identificationType: 'CPF',
        identificationNumber: formData.cpf.replace(/\D/g, '')
      };
      
      // Step 3: Process payment
      updateTransactionStep(2);
      
      // Call the service to process the card payment and explicitly type the response
      const response = await processCardPayment(product, cardData, customerData) as {
        status: PaymentStatus;
        paymentId?: string;
      };
      
      // Step 4: Authorization
      updateTransactionStep(3);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      // Step 5: Finalizing
      updateTransactionStep(4);
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
      
      onComplete(response.status, response.paymentId);
    } catch (error) {
      console.error('Error processing card payment:', error);
      // Use the step number directly instead of referencing currentStep variable
      updateTransactionStep(2, 'error'); // Assuming error happens during payment processing (step 2)
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  return {
    isLoading,
    errors,
    isSandbox,
    checkSandboxMode,
    processPayment
  };
};
