
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AuthUser } from '@/types/auth';

interface AccountSettingsProps {
  user: AuthUser | null;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Conta</CardTitle>
        <CardDescription>
          Gerencie as configurações da sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Notificações por email</Label>
            <p className="text-sm text-muted-foreground">
              Receba atualizações sobre seus projetos
            </p>
          </div>
          <Switch id="notifications" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">Emails de marketing</Label>
            <p className="text-sm text-muted-foreground">
              Receba notícias e ofertas sobre nossos produtos
            </p>
          </div>
          <Switch id="marketing" />
        </div>
        
        <div className="pt-4">
          <Button variant="destructive">Excluir minha conta</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
