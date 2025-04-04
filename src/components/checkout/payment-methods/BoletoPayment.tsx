
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Copy, FileText, CheckCircle } from 'lucide-react';
import { 
  generateBoletoPayment, 
  CustomerData, 
  formatCPF, 
  validateCPF 
} from "@/services/mercadoPagoService";
import { ProductInfo, PaymentStatus } from "../CheckoutModal";

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

  // Handle copy to clipboard
  const copyToClipboard = () => {
    if (paymentData?.boletoNumber) {
      navigator.clipboard.writeText(paymentData.boletoNumber)
        .then(() => {
          setCopiedToClipboard(true);
          setTimeout(() => setCopiedToClipboard(false), 3000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };

  // Format expiration date
  const formatExpirationDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString('pt-BR');
  };

  // If payment data is available, show boleto information
  if (paymentData) {
    return (
      <div className="flex flex-col py-4">
        <h3 className="text-lg font-semibold mb-4">Boleto bancário gerado</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Utilize o código de barras abaixo para efetuar o pagamento via internet banking ou em qualquer banco, casa lotérica ou supermercado.
          </p>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <Label htmlFor="boleto-code" className="text-xs">Código de barras</Label>
            <div className="flex mt-1">
              <Input
                id="boleto-code"
                value={paymentData.boletoNumber}
                readOnly
                className="text-xs pr-10 font-mono"
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
          
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              <strong>Data de vencimento:</strong> {formatExpirationDate(paymentData.expirationDate)}
            </p>
            <p className="text-xs text-muted-foreground">
              O boleto estará disponível para pagamento em até 1 hora.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(paymentData.boletoUrl, '_blank')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Visualizar boleto completo
          </Button>
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
            Gerando boleto...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Gerar boleto
          </>
        )}
      </Button>
    </form>
  );
};

export default BoletoPayment;
