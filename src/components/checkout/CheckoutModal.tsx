
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductSummary } from './components/ProductSummary';
import PaymentMethodTabs from './components/PaymentMethodTabs';
import { usePaymentState } from './hooks/usePaymentState';
import { X } from 'lucide-react';
import { SubscriptionPlan } from '@/integrations/supabase/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define export types that can be used throughout the application
export type PaymentMethod = 'card' | 'pix' | 'boleto';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'error';

export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan | null;
  onPlanChange: (planId: string) => void;
  isLoadingPlans: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onOpenChange,
  plans,
  selectedPlan,
  onPlanChange,
  isLoadingPlans
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const { 
    paymentStatus, 
    isProcessing, 
    setIsProcessing, 
    resetPaymentState 
  } = usePaymentState(isOpen);

  // Convert selected plan to ProductInfo format
  const getProductInfo = (): ProductInfo | null => {
    if (!selectedPlan) return null;
    
    return {
      id: selectedPlan.id,
      name: selectedPlan.name,
      description: selectedPlan.description,
      price: selectedPlan.price
    };
  };

  const handleCloseDialog = () => {
    // Only allow closing if not in the middle of a payment process
    if (!isProcessing) {
      resetPaymentState();
      onOpenChange(false);
    }
  };

  const handlePaymentComplete = (status: PaymentStatus, paymentId?: string) => {
    // Handle payment completion
    console.log("Payment completed with status:", status, "and ID:", paymentId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[600px] p-0">
        {!paymentStatus || paymentStatus === 'pending' ? (
          <button
            onClick={handleCloseDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 z-10"
            disabled={isProcessing}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </button>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Summary Section */}
          <div className="p-6 border-r border-border bg-muted/30">
            <DialogHeader className="mb-4">
              <DialogTitle>Escolha seu plano</DialogTitle>
            </DialogHeader>

            {isLoadingPlans ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <Select
                    value={selectedPlan?.id || ''}
                    onValueChange={onPlanChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPlan && (
                  <ProductSummary product={getProductInfo() as ProductInfo} />
                )}
              </>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle>Método de Pagamento</DialogTitle>
            </DialogHeader>

            {selectedPlan && getProductInfo() && (
              <PaymentMethodTabs
                product={getProductInfo() as ProductInfo}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onProcessing={(isProcessing) => {
                  setIsProcessing(isProcessing);
                }}
                onComplete={handlePaymentComplete}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
