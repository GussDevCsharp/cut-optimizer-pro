
import { useState } from 'react';
import { 
  formatCardNumber, 
  formatCPF, 
  validateCPF, 
  processCardPayment,
  CustomerData,
  CardData,
  convertToMPProductInfo
} from "@/services/mercadoPagoService";
import { ProductInfo, PaymentStatus } from "../../CheckoutModal";

interface FormState {
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

interface UseCardPaymentFormProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

export const useCardPaymentForm = ({ product, onProcessing, onComplete }: UseCardPaymentFormProps) => {
  // Form state
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    cpf: '',
    cardNumber: '',
    cardholderName: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    installments: '1'
  });
  
  // UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Form field change handlers
  const handleChange = (field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  // Format card number as user types
  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    handleChange('cardNumber', formatted);
  };

  // Format CPF as user types
  const handleCpfChange = (value: string) => {
    const formatted = formatCPF(value);
    handleChange('cpf', formatted);
  };
  
  // Validate all fields before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate customer information
    if (!formState.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formState.email.trim()) newErrors.email = 'E-mail é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formState.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!validateCPF(formState.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    // Validate card information
    if (!formState.cardNumber.trim() || formState.cardNumber.replace(/\D/g, '').length < 16) {
      newErrors.cardNumber = 'Número de cartão inválido';
    }
    
    if (!formState.cardholderName.trim()) {
      newErrors.cardholderName = 'Nome no cartão é obrigatório';
    }
    
    if (!formState.expirationMonth || !formState.expirationYear) {
      newErrors.expiration = 'Data de validade inválida';
    }
    
    if (!formState.securityCode.trim() || formState.securityCode.length < 3) {
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
      
      const customerData: CustomerData = {
        name: formState.name,
        email: formState.email,
        cpf: formState.cpf,
        identificationType: 'CPF',
        identificationNumber: formState.cpf.replace(/\D/g, '')
      };
      
      const cardData: CardData = {
        cardNumber: formState.cardNumber.replace(/\D/g, ''),
        cardholderName: formState.cardholderName,
        expirationMonth: formState.expirationMonth,
        expirationYear: formState.expirationYear,
        securityCode: formState.securityCode,
        installments: parseInt(formState.installments, 10),
        issuer: 'visa', // This would normally be detected by Mercado Pago
        paymentMethodId: 'visa', // This would normally be detected by Mercado Pago
        identificationType: 'CPF',
        identificationNumber: formState.cpf.replace(/\D/g, '')
      };
      
      // Convert product to Mercado Pago format
      const mpProduct = convertToMPProductInfo(product);
      
      // Call the service to process the card payment
      const response = await processCardPayment(mpProduct, cardData, customerData);
      
      onComplete(response.status, response.paymentId);
    } catch (error) {
      console.error('Error processing card payment:', error);
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  return {
    formState,
    handleChange,
    handleCardNumberChange,
    handleCpfChange,
    handleSubmit,
    errors,
    isLoading
  };
};
