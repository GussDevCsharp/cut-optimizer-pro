
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader, CreditCard } from 'lucide-react';
import { 
  formatCardNumber, 
  formatCPF, 
  validateCPF, 
  getInstallmentOptions,
  processCardPayment,
  CustomerData,
  CardData
} from "@/services/mercadoPago";
import { ProductInfo, PaymentStatus } from "../CheckoutModal";

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

  // Format card number as user types
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  // Format CPF as user types
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

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
      
      const customerData: CustomerData = {
        name,
        email,
        identificationType: 'CPF',
        identificationNumber: cpf.replace(/\D/g, '')
      };
      
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
      
      // Call the service to process the card payment and explicitly type the response
      const response = await processCardPayment(product, cardData, customerData) as PaymentResponse;
      
      onComplete(response.status, response.paymentId);
    } catch (error) {
      console.error('Error processing card payment:', error);
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Customer Information */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium">Dados pessoais</h4>
        
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            disabled={isLoading}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            disabled={isLoading}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            value={cpf}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            maxLength={14}
            disabled={isLoading}
          />
          {errors.cpf && <p className="text-xs text-destructive">{errors.cpf}</p>}
        </div>
      </div>
      
      {/* Card Information */}
      <div className="space-y-4">
        <h4 className="font-medium">Dados do cartão</h4>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número do cartão</Label>
          <Input
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="0000 0000 0000 0000"
            maxLength={19} // 16 digits + 3 spaces
            disabled={isLoading}
          />
          {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Nome no cartão</Label>
          <Input
            id="cardholderName"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            disabled={isLoading}
          />
          {errors.cardholderName && <p className="text-xs text-destructive">{errors.cardholderName}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiration">Validade</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={expirationMonth} 
                onValueChange={setExpirationMonth}
                disabled={isLoading}
              >
                <SelectTrigger id="expiration-month">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = (i + 1).toString().padStart(2, '0');
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Select 
                value={expirationYear} 
                onValueChange={setExpirationYear}
                disabled={isLoading}
              >
                <SelectTrigger id="expiration-year">
                  <SelectValue placeholder="AA" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = (new Date().getFullYear() + i).toString().substring(2);
                    return (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {errors.expiration && <p className="text-xs text-destructive">{errors.expiration}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="securityCode">Código de segurança</Label>
            <Input
              id="securityCode"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="CVV"
              maxLength={4}
              disabled={isLoading}
            />
            {errors.securityCode && <p className="text-xs text-destructive">{errors.securityCode}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="installments">Parcelas</Label>
          <Select 
            value={installments} 
            onValueChange={setInstallments}
            disabled={isLoading}
          >
            <SelectTrigger id="installments">
              <SelectValue placeholder="Selecione o número de parcelas" />
            </SelectTrigger>
            <SelectContent>
              {installmentOptions.map((option) => (
                <SelectItem key={option.installments} value={option.installments.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
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

export default CardPayment;
