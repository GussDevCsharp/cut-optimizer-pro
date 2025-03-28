
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface ConfigAlertsProps {
  productionModeWithTestKeys: boolean;
  hasProductionKeys: boolean;
  isSandbox: boolean;
}

export function ConfigAlerts({ productionModeWithTestKeys, hasProductionKeys, isSandbox }: ConfigAlertsProps) {
  return (
    <>
      {productionModeWithTestKeys && (
        <Alert variant="warning" className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-600">Configuração inadequada detectada</AlertTitle>
          <AlertDescription className="text-amber-600">
            <strong>Atenção:</strong> Você está configurando o Mercado Pago para funcionar em modo de produção, 
            mas está usando chaves de teste (TEST-*). Para processar pagamentos reais, você precisa fornecer 
            chaves de produção obtidas em sua conta Mercado Pago.
          </AlertDescription>
        </Alert>
      )}

      {!isSandbox && hasProductionKeys && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Modo de produção</AlertTitle>
          <AlertDescription className="text-green-600">
            <strong>Atenção:</strong> O sistema está configurado para processar pagamentos reais. 
            Certifique-se de que as chaves fornecidas são válidas e estão corretas.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
