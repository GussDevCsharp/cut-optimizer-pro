
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Copy, CheckCircle } from 'lucide-react';
import { 
  generatePixPayment, 
  CustomerData, 
  formatCPF, 
  validateCPF 
} from "@/services/mercadoPago";
import { ProductInfo, PaymentStatus } from "../CheckoutModal";

interface PixPaymentProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

interface PixPaymentResponse {
  status: PaymentStatus;
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  qrCodeText: string;
  expirationDate: string;
}

const PixPayment: React.FC<PixPaymentProps> = ({ product, onProcessing, onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PixPaymentResponse | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Format CPF as the user types
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCpf = formatCPF(e.target.value);
    setCpf(formattedCpf);
  };

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
      
      // Call the service to generate a Pix payment
      const response = await generatePixPayment(product, customerData) as PixPaymentResponse;
      
      setPaymentData(response);
      onComplete('pending', response.paymentId);
    } catch (error) {
      console.error('Error generating Pix payment:', error);
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  // Handle copy to clipboard
  const copyToClipboard = () => {
    if (paymentData?.qrCodeText) {
      navigator.clipboard.writeText(paymentData.qrCodeText)
        .then(() => {
          setCopiedToClipboard(true);
          setTimeout(() => setCopiedToClipboard(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  // Format expiration time
  const formatExpirationTime = (isoDate: string): string => {
    return new Date(isoDate).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If payment data is available, show QR code
  if (paymentData) {
    return (
      <div className="flex flex-col items-center py-4">
        <h3 className="text-lg font-semibold mb-4">Pague com Pix</h3>
        
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            Escaneie o QR code abaixo com o app do seu banco ou carteira digital
          </p>
          
          <div className="border rounded-lg p-4 bg-gray-50 mb-4">
            <img 
              src={paymentData.qrCode} 
              alt="QR Code para pagamento Pix" 
              className="w-48 h-48 mx-auto"
            />
          </div>
          
          <div className="w-full">
            <Label htmlFor="pix-code" className="text-xs">Código Pix (copia e cola)</Label>
            <div className="flex mt-1">
              <Input
                id="pix-code"
                value={paymentData.qrCodeText}
                readOnly
                className="text-xs pr-10"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="-ml-10 h-10"
                onClick={copyToClipboard}
              >
                {copiedToClipboard ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            O QR code expira às {formatExpirationTime(paymentData.expirationDate)}
          </p>
        </div>
      </div>
    );
  }

  // Show form to collect customer data
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      
      <Button 
        type="submit" 
        className="w-full mt-6" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Gerando QR Code...
          </>
        ) : 'Gerar QR Code Pix'}
      </Button>
    </form>
  );
};

export default PixPayment;
