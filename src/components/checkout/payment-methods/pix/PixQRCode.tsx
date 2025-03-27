
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CheckCircle } from 'lucide-react';

interface PixQRCodeProps {
  qrCodeUrl: string;
  qrCodeText: string;
  expirationDate: string;
}

const PixQRCode: React.FC<PixQRCodeProps> = ({ 
  qrCodeUrl, 
  qrCodeText, 
  expirationDate 
}) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Handle copy to clipboard
  const copyToClipboard = () => {
    if (qrCodeText) {
      navigator.clipboard.writeText(qrCodeText)
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

  return (
    <div className="flex flex-col items-center py-4">
      <h3 className="text-lg font-semibold mb-4">Pague com Pix</h3>
      
      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-center text-muted-foreground">
          Escaneie o QR code abaixo com o app do seu banco ou carteira digital
        </p>
        
        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          <img 
            src={qrCodeUrl} 
            alt="QR Code para pagamento Pix" 
            className="w-48 h-48 mx-auto"
          />
        </div>
        
        <div className="w-full">
          <Label htmlFor="pix-code" className="text-xs">Código Pix (copia e cola)</Label>
          <div className="flex mt-1">
            <Input
              id="pix-code"
              value={qrCodeText}
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
          O QR code expira às {formatExpirationTime(expirationDate)}
        </p>
      </div>
    </div>
  );
};

export default PixQRCode;
