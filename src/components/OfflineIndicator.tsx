
import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { toast } from "sonner";

export const OfflineIndicator = () => {
  // Check if window exists to ensure we're in browser environment
  const isClient = typeof window !== 'undefined';
  const [isOnline, setIsOnline] = useState(isClient ? navigator.onLine : true);

  useEffect(() => {
    if (!isClient) return;
    
    // Function to update the online/offline status
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

    // Register the listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check initial status
    if (!isOnline) {
      toast.error("Você está offline!", {
        description: "Algumas funcionalidades podem estar limitadas",
        icon: <WifiOff className="h-5 w-5" />,
        duration: 5000
      });
    }

    // Clean up the listeners when the component is unmounted
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isClient, isOnline]);

  // Only render the indicator when offline
  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-3 py-2 rounded-full flex items-center gap-2 shadow-lg z-50">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Offline</span>
    </div>
  );
};

export default OfflineIndicator;
