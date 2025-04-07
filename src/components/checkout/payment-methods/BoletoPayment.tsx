
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Printer, Loader2, Download } from 'lucide-react';
import { generateBoletoPayment, CustomerData, formatCPF } from "@/services/mercadoPagoService";
import { ProductInfo, PaymentStatus } from "../CheckoutModal";
import { useToast } from '@/hooks/use-toast';

interface BoletoPaymentProps {
  product: ProductInfo;
  onProcessing: (isProcessing: boolean) => void;
  onComplete: (status: PaymentStatus, paymentId?: string) => void;
}

const BoletoPayment: React.FC<BoletoPaymentProps> = ({ product, onProcessing, onComplete }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [boletoData, setBoletoData] = useState<{
    boletoNumber: string;
    boletoUrl: string;
    expirationDate: string;
    paymentId: string;
  } | null>(null);
  const { toast } = useToast();

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const generateBoleto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim() || !email.trim() || !cpf.trim()) {
      toast({
        variant: "destructive",
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos para gerar o boleto.",
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
      
      const response = await generateBoletoPayment(product, customerData);
      
      setBoletoData({
        boletoNumber: response.boletoNumber || response.barcode,
        boletoUrl: response.boletoUrl || response.external_resource_url || '#',
        expirationDate: response.expirationDate || new Date(Date.now() + 3 * 24 * 60 * 60000).toISOString(),
        paymentId: response.paymentId || `boleto_${Date.now()}`
      });
      
      // Map status string to PaymentStatus enum
      const status: PaymentStatus = 
        response.status === 'pending' ? 'pending' : 
        response.status === 'approved' ? 'approved' : 
        response.status === 'rejected' ? 'rejected' : 'pending';
      
      onComplete(status, response.paymentId);
    } catch (error) {
      console.error("Error generating boleto:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar boleto",
        description: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
      });
      onComplete('error');
    } finally {
      setIsLoading(false);
      onProcessing(false);
    }
  };

  // Format expiration date for display
  const formatExpirationDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handlePrintBoleto = () => {
    if (boletoData?.boletoUrl) {
      window.open(boletoData.boletoUrl, '_blank');
    }
  };

  return (
    <div>
      {!boletoData ? (
        <form onSubmit={generateBoleto} className="space-y-4">
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
                Gerando boleto...
              </>
            ) : (
              "Gerar boleto"
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-medium mb-2">Boleto gerado com sucesso!</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Imprima ou salve o boleto para pagamento
            </p>
            <p className="text-xs text-red-500">
              Vencimento: {formatExpirationDate(boletoData.expirationDate)}
            </p>
          </div>
          
          <div className="border-2 p-4 rounded-md bg-muted/30">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            
            <div className="text-center mb-4">
              <p className="text-sm font-medium">Código do boleto:</p>
              <p className="text-xs font-mono mt-1 break-all">{boletoData.boletoNumber}</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handlePrintBoleto}
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar boleto
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={handlePrintBoleto}
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimir boleto
              </Button>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>ID do pagamento: {boletoData.paymentId}</p>
            <p className="mt-2">
              Após o pagamento, você receberá uma confirmação por e-mail em até 3 dias úteis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoletoPayment;
