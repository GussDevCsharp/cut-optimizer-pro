
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';
import ProjectLoader from './ProjectLoader';
import { Toaster } from '../ui/sonner';

export const IndexContent = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <ProjectLoader>
        {!isMobile ? <DesktopLayout /> : <MobileLayout />}
      </ProjectLoader>
      <Toaster />
    </>
  );
};

export default IndexContent;
