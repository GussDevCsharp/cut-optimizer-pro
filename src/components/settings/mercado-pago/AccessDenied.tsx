
import React from 'react';

export function AccessDenied() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuração do Mercado Pago</h3>
        <p className="text-sm text-muted-foreground">
          Você não tem permissão para acessar estas configurações.
        </p>
      </div>
    </div>
  );
}
