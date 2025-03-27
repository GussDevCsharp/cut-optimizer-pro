
import React from 'react';

export function TestCardInfo() {
  return (
    <div className="mt-8 p-4 border rounded-lg bg-muted/50">
      <h4 className="font-medium mb-2">Informações para teste</h4>
      <p className="text-sm mb-2">
        Para testar o Mercado Pago em modo sandbox, use os seguintes dados:
      </p>
      <div className="text-sm space-y-1">
        <p><strong>Cartão de teste:</strong> 5031 4332 1540 6351</p>
        <p><strong>Data de validade:</strong> 11/25</p>
        <p><strong>Código de segurança:</strong> 123</p>
        <p><strong>Titular:</strong> APRO (para pagamentos aprovados) ou OTHE (para erros de processamento)</p>
      </div>
    </div>
  );
}
