
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

type InstallAppButtonProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export const InstallAppButton = ({ 
  variant = "outline", 
  className,
  children,
  onClick
}: InstallAppButtonProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (onClick) {
      onClick();
      return;
    }
    
    if (!deferredPrompt) {
      toast({
        title: "Instalação",
        description: "Este dispositivo ou navegador não suporta a instalação do aplicativo.",
      });
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast({
        title: "Sucesso!",
        description: "Obrigado por instalar nosso aplicativo!",
      });
      setIsInstallable(false);
    }
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
  };

  if (!isInstallable && !onClick) return null;

  return (
    <Button 
      variant={variant} 
      className={`justify-start gap-2 ${className}`}
      onClick={handleInstallClick}
    >
      <Download className="h-4 w-4" />
      {children || <span>Instalar aplicativo</span>}
    </Button>
  );
};
