
import { useState, useEffect } from 'react';
import { LogOut, Menu, Settings, ChevronLeft, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSheetData } from '../hooks/useSheetData';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from '../hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SettingsContainer } from './settings/SettingsContainer';
import { useToast } from '@/hooks/use-toast';

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

  return (
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name || 'Usuário'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  {isInstallable && (
                    <Button variant="outline" className="justify-start gap-2" onClick={handleInstallClick}>
                      <Download className="h-4 w-4" />
                      <span>Instalar aplicativo</span>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="justify-start gap-2" onClick={openSettings}>
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Button>
                  
                  <Button variant="outline" className="justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isInstallable && (
                  <DropdownMenuItem onClick={handleInstallClick} className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Instalar aplicativo</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={openSettings} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <SettingsContainer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};

export default Header;
