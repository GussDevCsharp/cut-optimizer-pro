
import React, { useState } from 'react';
import { MercadoPagoButton } from './index';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MercadoPagoDemo: React.FC = () => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  
  const handlePaymentCreated = (id: string) => {
    setPreferenceId(id);
    toast.success('Preferência de pagamento criada', {
      description: `ID: ${id}`
    });
  };
  
  const handlePaymentError = (error: any) => {
    console.error('Erro no pagamento:', error);
    toast.error('Erro ao processar pagamento', {
      description: 'Verifique o console para mais detalhes'
    });
  };
  
  const testProduct = {
    id: 'prod-123',
    name: 'Produto de Teste',
    description: 'Este é um produto de teste para integração do MercadoPago',
    price: 19.90
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demonstração MercadoPago</CardTitle>
        <CardDescription>
          Teste de integração do botão de pagamento do MercadoPago
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-semibold">{testProduct.name}</h3>
            <p className="text-sm text-muted-foreground">{testProduct.description}</p>
            <p className="font-medium mt-2">R$ {testProduct.price.toFixed(2)}</p>
          </div>
          
          <MercadoPagoButton 
            product={testProduct}
            onPaymentCreated={handlePaymentCreated}
            onPaymentError={handlePaymentError}
          />
          
          {preferenceId && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm">Preferência criada: {preferenceId}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MercadoPagoDemo;
