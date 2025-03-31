
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import BillingSettings from './BillingSettings';
import AdminSettings from './AdminSettings';
import { AuthUser } from '@/types/auth';
import { User } from '@supabase/supabase-js';

// Helper function to convert User to AuthUser
const convertToAuthUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || '',
    email: user.email || '',
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata,
    aud: user.aud || '',
    created_at: user.created_at
  };
};

export const SettingsContainer = () => {
  const { user, isAdmin, isMasterAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Convert User to AuthUser
  const authUser = convertToAuthUser(user);

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
              <ProfileSettings user={authUser} />
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4">
              <AccountSettings user={authUser} />
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4">
              <BillingSettings user={authUser} />
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="admin" className="space-y-4">
                <AdminSettings user={authUser} isMasterAdmin={isMasterAdmin} />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
