
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/types/auth';

interface AdminSettingsProps {
  user: AuthUser | null;
  isMasterAdmin: boolean;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ user, isMasterAdmin }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Administração</CardTitle>
        <CardDescription>
          {isMasterAdmin 
            ? "Você tem acesso completo ao painel de administração" 
            : "Configurações disponíveis para administradores"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="font-medium">Gerenciamento de usuários</div>
          <div className="text-sm text-muted-foreground">
            Acesse a lista de usuários da plataforma e gerencie suas permissões
          </div>
          <Button className="mt-2">Acessar painel de usuários</Button>
        </div>
        
        {isMasterAdmin && (
          <div className="space-y-2">
            <div className="font-medium">Configurações avançadas</div>
            <div className="text-sm text-muted-foreground">
              Configurações e ferramentas especiais para administradores master
            </div>
            <Button className="mt-2" variant="secondary">Ferramentas avançadas</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
