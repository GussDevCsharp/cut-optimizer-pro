
import { PropsWithChildren } from 'react';
import Header from './Header';
import { SheetProvider } from '../hooks/useSheetData';
import { useIsMobile } from '../hooks/use-mobile';

export const Layout = ({ children }: PropsWithChildren) => {
  const isMobile = useIsMobile();
  
  return (
    <SheetProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
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
      </div>
    </SheetProvider>
  );
};

export default Layout;
