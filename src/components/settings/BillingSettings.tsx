
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/types/auth';

interface BillingSettingsProps {
  user: AuthUser | null;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
        <CardDescription>
          Gerencie suas assinaturas e detalhes de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border p-4">
          <div className="font-medium">Plano atual: Gratuito</div>
          <div className="text-sm text-muted-foreground mt-1">
            Seu plano atual oferece recursos básicos.
          </div>
          <Button className="mt-4" variant="outline">
            Fazer upgrade para Premium
          </Button>
        </div>
        
        <div className="rounded-md border p-4">
          <div className="font-medium">Histórico de pagamentos</div>
          <div className="text-sm text-muted-foreground mt-1">
            Você não possui pagamentos registrados.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingSettings;
