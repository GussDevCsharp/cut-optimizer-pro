
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';
import { ProjectLoader } from './ProjectLoader';
import { ArchitectureHeader } from './ArchitectureHeader';

export const IndexContent = () => {
  const isMobile = useIsMobile();

  return (
    <div className="architecture-theme">
      <ArchitectureHeader />
      <ProjectLoader />
      {!isMobile ? <DesktopLayout /> : <MobileLayout />}
    </div>
  );
};

export default IndexContent;
