
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';
import { ProjectLoader } from './ProjectLoader';
import { toast } from 'sonner';
import { useSheetData } from '@/hooks/useSheetData';
import { useSearchParams } from 'react-router-dom';

export const IndexContent = () => {
  const isMobile = useIsMobile();
  const { pieces, placedPieces } = useSheetData();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');

  // Check if we have data loaded on mount
  useEffect(() => {
    // Only show loading toast if we're loading a project by ID
    if (projectId) {
      const timeout = setTimeout(() => {
        // If no pieces are loaded after a short delay, show a message
        if (pieces.length === 0 && placedPieces.length === 0) {
          toast.info('Carregando plano de corte...', {
            id: 'loading-project',
            duration: 3000
          });
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [projectId, pieces.length, placedPieces.length]);

  return (
    <>
      <ProjectLoader />
      {!isMobile ? <DesktopLayout /> : <MobileLayout />}
    </>
  );
};

export default IndexContent;
