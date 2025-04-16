
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthUser } from '@/types/auth';
import { getUserSubscriptionPlan } from '@/services/userManagementService';
import { hasLifetimeAccess } from '@/services/userManagementService';
import { format } from 'date-fns';

interface BillingSettingsProps {
  user: AuthUser | null;
}

const BillingSettings: React.FC<BillingSettingsProps> = ({ user }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLifetimeUser = user?.email ? hasLifetimeAccess(user.email) : false;

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      getUserSubscriptionPlan(user.id)
        .then(data => {
          setSubscription(data);
        })
        .catch(err => {
          console.error("Error loading subscription:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
        <CardDescription>
          Gerencie suas assinaturas e detalhes de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="rounded-md border p-4">
              {isLifetimeUser ? (
                <>
                  <div className="font-medium text-primary">Plano atual: Vitalício</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Você possui acesso vitalício a todas as funcionalidades do sistema.
                  </div>
                </>
              ) : subscription ? (
                <>
                  <div className="font-medium">Plano atual: {subscription.plan_name || 'Premium'}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {subscription.is_lifetime ? 
                      'Seu plano oferece acesso vitalício ao sistema.' : 
                      `Seu plano expira em ${subscription.expiration_date ? 
                        format(new Date(subscription.expiration_date), 'dd/MM/yyyy') : 
                        'data não informada'}.`
                    }
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium">Plano atual: Gratuito</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Seu plano atual oferece recursos básicos.
                  </div>
                  <Button className="mt-4" variant="outline">
                    Fazer upgrade para Premium
                  </Button>
                </>
              )}
            </div>
            
            <div className="rounded-md border p-4">
              <div className="font-medium">Histórico de pagamentos</div>
              <div className="text-sm text-muted-foreground mt-1">
                {isLifetimeUser ? 
                  'Acesso vitalício concedido.' : 
                  'Você não possui pagamentos registrados.'}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BillingSettings;
