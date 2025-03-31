import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import BillingSettings from './BillingSettings';
import AdminSettings from './AdminSettings';

export const SettingsContainer = () => {
  const { user, isAdmin, isMasterAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>
            Gerencie suas preferências de conta, perfil e pagamentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="profile" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-4 max-w-2xl">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="account">Conta</TabsTrigger>
              <TabsTrigger value="billing">Pagamentos</TabsTrigger>
              {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <ProfileSettings user={user} />
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4">
              <AccountSettings user={user} />
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4">
              <BillingSettings user={user} />
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="admin" className="space-y-4">
                <AdminSettings user={user} isMasterAdmin={isMasterAdmin} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
