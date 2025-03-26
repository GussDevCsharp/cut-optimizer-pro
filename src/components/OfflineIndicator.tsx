
"use client";

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from "sonner";

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Função para atualizar o estado online/offline
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online) {
        toast.success("Você está online novamente!", {
          description: "Todas as funcionalidades estão disponíveis",
          icon: <Wifi className="h-5 w-5" />
        });
      } else {
        toast.error("Você está offline!", {
          description: "Algumas funcionalidades podem estar limitadas",
          icon: <WifiOff className="h-5 w-5" />,
          duration: 5000
        });
      }
    };

    // Registrar os listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Verificar o status inicial
    if (!isOnline) {
      toast.error("Você está offline!", {
        description: "Algumas funcionalidades podem estar limitadas",
        icon: <WifiOff className="h-5 w-5" />,
        duration: 5000
      });
    }

    // Limpar os listeners quando o componente for desmontado
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isOnline]);

  // Renderizar um indicador de status apenas quando estiver offline
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-3 py-2 rounded-full flex items-center gap-2 shadow-lg z-50">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Offline</span>
    </div>
  );
};

export default OfflineIndicator;
