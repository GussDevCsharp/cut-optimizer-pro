
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';
import ProjectLoader from './ProjectLoader';
import { Toaster } from '../ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export const IndexContent = () => {
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <ProjectLoader>
        {!isMobile ? <DesktopLayout /> : <MobileLayout />}
      </ProjectLoader>
      <Toaster />
    </TooltipProvider>
  );
};

export default IndexContent;
