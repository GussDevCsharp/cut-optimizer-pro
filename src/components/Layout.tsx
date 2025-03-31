
import { PropsWithChildren } from 'react';
import Header from './Header';
import { SheetProvider, useSheetData } from '../hooks/useSheetData';
import { useIsMobile } from '../hooks/use-mobile';
import OfflineIndicator from './OfflineIndicator';
import TopLoadingBar from './ui/top-loading-bar';
import { ThemeProvider } from '@/hooks/useTheme';
import { TooltipProvider } from '@/components/ui/tooltip';

const LayoutContent = ({ children }: PropsWithChildren) => {
  const isMobile = useIsMobile();
  const { isOptimizing, optimizationProgress } = useSheetData();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-charcoal-dark dark:to-charcoal">
      <TopLoadingBar 
        isLoading={isOptimizing} 
        progress={optimizationProgress} 
      />
      
      <Header />
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-6 px-2' : 'pt-20 pb-12 px-4 sm:px-6'}`}>
        <div className={`${isMobile ? 'w-full' : 'container mx-auto'}`}>
          {children}
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          Melhor Corte © {new Date().getFullYear()} - Otimizador de corte profissional
        </div>
      </footer>
      <OfflineIndicator />
    </div>
  );
};

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SheetProvider>
          <LayoutContent>{children}</LayoutContent>
        </SheetProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default Layout;
