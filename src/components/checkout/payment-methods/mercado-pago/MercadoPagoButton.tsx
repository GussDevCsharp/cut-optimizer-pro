
import React, { useEffect, useRef, useState } from 'react';
import { getMercadoPagoConfig } from "@/services/mercadoPago/initialize";
import { ProductInfo } from '@/components/checkout/CheckoutModal';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MercadoPagoButtonProps {
  product: ProductInfo;
  onPaymentCreated?: (preferenceId: string) => void;
  onPaymentError?: (error: any) => void;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  product,
  onPaymentCreated,
  onPaymentError
}) => {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initMercadoPago = async () => {
      try {
        setIsLoading(true);

        // Obter a configuração do MercadoPago
        const config = await getMercadoPagoConfig();
        console.log('MercadoPago config loaded:', config.publicKey);

        // Verificar se o SDK já está carregado
        if (!window.MercadoPago) {
          console.log('Loading MercadoPago SDK...');
          // Se não estiver usando o script no HTML, podemos carregar dinamicamente
          const script = document.createElement('script');
          script.src = 'https://sdk.mercadopago.com/js/v2';
          script.type = 'text/javascript';
          script.onload = () => initializeButton(config.publicKey);
          script.onerror = (e) => {
            console.error('Erro ao carregar script do MercadoPago:', e);
            setIsLoading(false);
            onPaymentError && onPaymentError('Failed to load MercadoPago SDK');
          };
          document.body.appendChild(script);
        } else {
          // Se já estiver carregado, inicializar o botão
          initializeButton(config.publicKey);
        }
      } catch (error) {
        console.error('Erro ao inicializar MercadoPago:', error);
        setIsLoading(false);
        onPaymentError && onPaymentError(error);
      }
    };

    const initializeButton = (publicKey: string) => {
      try {
        if (!buttonContainerRef.current) {
          console.error('Container do botão não encontrado');
          setIsLoading(false);
          return;
        }

        // Limpar o container antes de criar um novo botão
        buttonContainerRef.current.innerHTML = '';

        // Inicializar o SDK do MercadoPago
        const mp = new window.MercadoPago(publicKey, {
          locale: 'pt-BR'
        });
        window.mercadoPagoInstance = mp;

        // Criar o botão de checkout
        mp.checkout({
          preference: {
            id: 'YOUR_PREFERENCE_ID', // Será substituído ao clicar no botão
          },
          render: {
            container: buttonContainerRef.current,
            label: 'Pagar com MercadoPago',
          }
        });

        setIsInitialized(true);
        setIsLoading(false);
        console.log('MercadoPago SDK inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar botão MercadoPago:', error);
        setIsLoading(false);
        onPaymentError && onPaymentError(error);
      }
    };

    initMercadoPago();
  }, [onPaymentError]);

  const handlePayment = async () => {
    if (!isInitialized) {
      console.error('MercadoPago não está inicializado');
      return;
    }

    try {
      setIsLoading(true);

      // Aqui você faria uma chamada para seu backend para criar uma preferência de pagamento
      // Por enquanto, vamos simular uma preferência com um ID fictício
      const preferenceId = `TEST-${Date.now()}`;
      
      // Atualizar a preferência no botão
      if (window.mercadoPagoInstance && buttonContainerRef.current) {
        window.mercadoPagoInstance.checkout({
          preference: {
            id: preferenceId,
          },
          autoOpen: true
        });
      }

      onPaymentCreated && onPaymentCreated(preferenceId);
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      onPaymentError && onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Container para o botão do MercadoPago */}
      <div ref={buttonContainerRef} className="w-full"></div>
      
      {/* Botão alternativo enquanto carrega */}
      {isLoading && (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Carregando...
        </Button>
      )}
      
      {/* Botão manual para iniciar o checkout (caso o botão automático não funcione) */}
      {!isLoading && !buttonContainerRef.current?.hasChildNodes() && (
        <Button onClick={handlePayment} className="w-full">
          Pagar com MercadoPago
        </Button>
      )}
    </div>
  );
};

export default MercadoPagoButton;
