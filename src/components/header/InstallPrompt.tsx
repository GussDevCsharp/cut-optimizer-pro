
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface InstallPromptProps {
  isInstallable: boolean;
  deferredPrompt: any;
  setIsInstallable: (value: boolean) => void;
  setDeferredPrompt: (value: any) => void;
}

export const InstallPrompt = ({ 
  isInstallable, 
  deferredPrompt, 
  setIsInstallable, 
  setDeferredPrompt 
}: InstallPromptProps) => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true);
      
      // Check if user already dismissed the dialog (using localStorage)
      const installPromptDismissed = localStorage.getItem('pwaInstallPromptDismissed');
      if (!installPromptDismissed) {
        // Show the install dialog after a short delay
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [setDeferredPrompt, setIsInstallable]);

  const handleInstallClick = async () => {
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

    // Hide the dialog
    setShowInstallPrompt(false);
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
  };

  const dismissInstallPrompt = () => {
    // Mark as dismissed in localStorage so we don't show it again
    localStorage.setItem('pwaInstallPromptDismissed', 'true');
    setShowInstallPrompt(false);
  };

  return (
    <>
      {/* Install App Dialog */}
      <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Instalar Melhor Corte como aplicativo</DialogTitle>
            <DialogDescription>
              Instale o aplicativo Melhor Corte em seu dispositivo para uma experiência mais rápida e melhor, mesmo sem internet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-4">
            <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary-foreground"></div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={dismissInstallPrompt}>
              Agora não
            </Button>
            <Button className="gap-2" onClick={handleInstallClick}>
              <Download className="h-4 w-4" />
              Instalar aplicativo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallPrompt;
