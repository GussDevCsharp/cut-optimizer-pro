
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, FileText, CheckCircle } from 'lucide-react';

interface BoletoReceiptInfoProps {
  boletoNumber: string;
  boletoUrl: string;
  expirationDate: string;
}

const BoletoReceiptInfo: React.FC<BoletoReceiptInfoProps> = ({
  boletoNumber,
  boletoUrl,
  expirationDate
}) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Handle copy to clipboard
  const copyToClipboard = () => {
    if (boletoNumber) {
      navigator.clipboard.writeText(boletoNumber)
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
              value={boletoNumber}
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
            <strong>Data de vencimento:</strong> {formatExpirationDate(expirationDate)}
          </p>
          <p className="text-xs text-muted-foreground">
            O boleto estará disponível para pagamento em até 1 hora.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(boletoUrl, '_blank')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Visualizar boleto completo
        </Button>
      </div>
    </div>
  );
};

export default BoletoReceiptInfo;
