
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AccessDenied } from './mercado-pago/AccessDenied';
import { MercadoPagoForm } from './mercado-pago/MercadoPagoForm';
import { TestCardInfo } from './mercado-pago/TestCardInfo';
import { useMercadoPagoConfig } from './mercado-pago/useMercadoPagoConfig';

export function MercadoPagoSettings() {
  const { isMasterAdmin } = useAuth();
  const { config, isLoading, hasError } = useMercadoPagoConfig();

  if (!isMasterAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuração do Mercado Pago</h3>
        <p className="text-sm text-muted-foreground">
          Configure as chaves de API do Mercado Pago para processar pagamentos.
        </p>
      </div>
      
      {hasError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar configurações</AlertTitle>
          <AlertDescription>
            Não foi possível carregar as configurações do Mercado Pago. Tente novamente ou entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      )}
      
      {!isLoading && (
        <MercadoPagoForm initialValues={config} />
      )}
      
      <TestCardInfo />
    </div>
  );
}
