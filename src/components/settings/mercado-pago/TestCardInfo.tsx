
import React from 'react';

export function TestCardInfo() {
  return (
    <div className="mt-8 p-4 border rounded-lg bg-muted/50 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Cartão de Teste Aprovado</h4>
        <div className="text-sm space-y-1">
          <p><strong>Cartão de teste:</strong> 4235 6477 2802 5682</p>
          <p><strong>Data de validade:</strong> 11/25</p>
          <p><strong>Código de segurança:</strong> 123</p>
          <p><strong>Titular:</strong> APRO (para pagamentos aprovados)</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Cartão de Teste Reprovado</h4>
        <div className="text-sm space-y-1">
          <p><strong>Cartão de teste:</strong> 5031 4332 1540 6351</p>
          <p><strong>Data de validade:</strong> 11/25</p>
          <p><strong>Código de segurança:</strong> 123</p>
          <p><strong>Titular:</strong> OTHE (para erros de processamento)</p>
        </div>
      </div>
    </div>
  );
}
