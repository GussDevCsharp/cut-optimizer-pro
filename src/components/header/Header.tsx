
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSheetData } from '../../hooks/useSheetData';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '../../hooks/use-mobile';
import { SettingsContainer } from '../settings/SettingsContainer';
import { Logo } from './Logo';
import { BackButton } from './BackButton';
import { MobileMenu } from './MobileMenu';
import { DesktopMenu } from './DesktopMenu';
import { InstallAppDialog } from './InstallAppDialog';

export const Header = () => {
  const { projectName } = useSheetData();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isAppRoute = location.pathname === '/app';
  
  // PWA installation state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
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
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2 sm:py-4 transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-subtle" 
          : "bg-transparent"
      }`}>
        <div className="container mx-auto flex items-center justify-between">
          <Logo projectName={projectName} />

          <div className="flex items-center justify-end gap-2">
            {/* Back to Dashboard Button - Only show on app route */}
            {isAppRoute && (
              <BackButton onClick={handleBackToDashboard} />
            )}

            {isMobile ? (
              <MobileMenu 
                onSettingsClick={openSettings}
                onLogoutClick={handleLogout}
                onInstallClick={() => setShowInstallPrompt(true)}
                isInstallable={isInstallable}
              />
            ) : (
              <DesktopMenu 
                onSettingsClick={openSettings}
                onLogoutClick={handleLogout}
                onInstallClick={() => setShowInstallPrompt(true)}
                isInstallable={isInstallable}
              />
            )}
          </div>
        </div>
        
        <SettingsContainer open={settingsOpen} onOpenChange={setSettingsOpen} />
      </header>

      {/* Install App Dialog */}
      <InstallAppDialog 
        open={showInstallPrompt}
        onOpenChange={setShowInstallPrompt}
        onInstall={handleInstallClick}
        onDismiss={dismissInstallPrompt}
      />
    </>
  );
};

export default Header;
