
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSheetData } from '../hooks/useSheetData';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';
import { SettingsContainer } from './settings/SettingsContainer';
import { useToast } from '@/hooks/use-toast';
import InstallPrompt from './header/InstallPrompt';
import DesktopMenu from './header/DesktopMenu';
import MobileMenu from './header/MobileMenu';

export const Header = () => {
  const { projectName } = useSheetData();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isAppRoute = location.pathname === '/app';
  const { toast } = useToast();
  
  // PWA installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

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
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2 sm:py-4 transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-subtle" 
          : "bg-transparent"
      }`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-primary-foreground"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-xl font-semibold tracking-tight">Melhor Corte</h1>
              {projectName && <span className="text-xs text-muted-foreground">{projectName}</span>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            {/* Back to Dashboard Button - Only show on app route */}
            {isAppRoute && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToDashboard}
                className="bg-lilac text-white hover:bg-lilac/90 border-lilac mr-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
            )}

            {isMobile ? (
              <MobileMenu
                user={user}
                isInstallable={isInstallable}
                onInstallClick={handleInstallClick}
                onOpenSettings={openSettings}
                onLogout={handleLogout}
              />
            ) : (
              <DesktopMenu
                user={user}
                isInstallable={isInstallable}
                onInstallClick={handleInstallClick}
                onOpenSettings={openSettings}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
        
        <SettingsContainer open={settingsOpen} onOpenChange={setSettingsOpen} />
      </header>

      <InstallPrompt
        isInstallable={isInstallable}
        deferredPrompt={deferredPrompt}
        setIsInstallable={setIsInstallable}
        setDeferredPrompt={setDeferredPrompt}
      />
    </>
  );
};

export default Header;
