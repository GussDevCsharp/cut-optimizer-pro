
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AuthUser } from '@/types/auth';

interface ProfileSettingsProps {
  user: AuthUser | null;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>
          Gerencie suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" defaultValue={user?.name || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={user?.email || ''} readOnly />
        </div>
        <Button>Salvar alterações</Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
