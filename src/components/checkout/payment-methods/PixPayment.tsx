import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, CopyIcon, CheckCircle } from 'lucide-react';
import { generatePixPayment, CustomerData, formatCPF, convertToMPProductInfo } from "@/services/mercadoPagoService";
import { ProductInfo, PaymentStatus } from "../CheckoutModal";
import { useToast } from '@/hooks/use-toast';

interface PixPaymentProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

const PixPayment: React.FC<PixPaymentProps> = ({ product, onProcessing, onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeText: string;
    expirationDate: string;
    paymentId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const generatePix = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !email.trim() || !cpf.trim()) {
      toast({
        variant: "destructive",
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos para gerar o PIX.",
      });
      return;
    }
    
    setIsLoading(true);
    onProcessing(true);
    
    try {
      const customerData: CustomerData = {
        name,
        email,
        identificationType: "CPF",
        identificationNumber: cpf.replace(/\D/g, ''),
        cpf
      };
      
      // Convert product to Mercado Pago format
      const mpProduct = convertToMPProductInfo({
        id: product.id,
        title: product.name,
        description: product.description || '',
        unit_price: product.price,
        name: product.name,
        price: product.price
      });
      
      const response = await generatePixPayment(mpProduct, customerData);
      
      setPixData({
        qrCode: response.qrCode || response.qr_code,
        qrCodeText: response.qrCodeText || '00020101021226800014br.gov.bcb.pix2558api.mercadolibre.com/payment/123456789',
        expirationDate: response.expirationDate || new Date(Date.now() + 30 * 60000).toISOString(),
        paymentId: response.paymentId || `pix_${Date.now()}`
      });
      
      // Map status to PaymentStatus enum
      const status: PaymentStatus = 
        response.status === 'pending' ? 'pending' : 
        response.status === 'approved' ? 'approved' : 
        response.status === 'rejected' ? 'rejected' : 'error';
      
      onComplete(status, response.paymentId);
    } catch (error) {
      console.error("Error generating PIX:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PIX",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
      });
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.qrCodeText) {
      navigator.clipboard.writeText(pixData.qrCodeText);
      setCopied(true);
      toast({
        title: "Código PIX copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatExpirationDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {!pixData ? (
        <form onSubmit={generatePix} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nome completo
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium mb-1">
              CPF
            </label>
            <Input
              id="cpf"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              disabled={isLoading}
              required
              maxLength={14}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              "Gerar PIX"
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-medium mb-2">PIX gerado com sucesso!</h3>
            <p className="text-sm text-muted-foreground">
              Escaneie o QR Code ou copie o código para pagar
            </p>
            <p className="text-xs text-red-500">
              Validade: {formatExpirationDate(pixData.expirationDate)}
            </p>
          </div>
          
          <div className="flex justify-center">
            <img 
              src={pixData.qrCode} 
              alt="QR Code PIX" 
              className="h-48 w-48 border-2 p-2"
            />
          </div>
          
          <Separator />
          
          <div className="relative">
            <Input
              value={pixData.qrCodeText}
              readOnly
              className="pr-10 bg-muted/30 text-xs font-mono truncate"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3"
              onClick={copyToClipboard}
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>ID do pagamento: {pixData.paymentId}</p>
            <p className="mt-2">
              Após o pagamento, você receberá uma confirmação por e-mail.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixPayment;
