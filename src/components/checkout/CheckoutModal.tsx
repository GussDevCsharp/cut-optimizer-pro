
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { initMercadoPago, getMercadoPagoConfig } from "@/services/mercadoPago";
import SandboxBanner from './components/SandboxBanner';
import CheckoutContent from './components/CheckoutContent';
import { PaymentProvider } from './context/PaymentContext';
import { toast } from "sonner";

// Payment status types
export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'error';

// Product information type
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
  product: ProductInfo;
  onPaymentComplete?: (status: PaymentStatus, paymentId?: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  product,
  onPaymentComplete 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpInitialized, setMpInitialized] = useState(false);
  const [isSandbox, setIsSandbox] = useState(true);

  // Initialize Mercado Pago SDK when modal opens
  useEffect(() => {
    if (isOpen && !mpInitialized) {
      const initMP = async () => {
        try {
          // Get config first to check sandbox mode
          const config = await getMercadoPagoConfig();
          setIsSandbox(config.isSandbox);
          
          if (!config.isSandbox) {
            console.log('Mercado Pago inicializado em modo de PRODUÇÃO');
            if (config.publicKey.startsWith('TEST-')) {
              console.warn('ATENÇÃO: Modo de produção ativado, mas usando chave pública de TESTE');
              toast.warning('Configuração incorreta', {
                description: "Modo de produção ativado com chaves de teste. Pagamentos não serão processados."
              });
            }
          } else {
            console.log('Mercado Pago inicializado em modo de TESTE (sandbox)');
          }
          
          await initMercadoPago();
          setMpInitialized(true);
        } catch (error) {
          console.error("Failed to initialize Mercado Pago:", error);
          toast.error("Erro ao inicializar pagamento", {
            description: "Por favor, tente novamente mais tarde."
          });
        }
      };
      
      initMP();
    }
  }, [isOpen, mpInitialized]);

  // Reset state when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Only reset if payment is not in progress
      if (!isProcessing) {
        // The reset will be handled by PaymentProvider's default state
      }
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Don't show close button during processing */}
        {!isProcessing && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        )}

        <SandboxBanner isSandbox={isSandbox} />

        <PaymentProvider 
          product={product} 
          onPaymentComplete={onPaymentComplete}
          isSandbox={isSandbox}
        >
          <CheckoutContent product={product} />
        </PaymentProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
