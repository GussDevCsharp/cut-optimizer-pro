
import { Card, CardContent } from "@/components/ui/card";
import { useSheetData } from '../hooks/useSheetData';
import { StatsDisplay } from './cutting-board/StatsDisplay';
import { SheetCarousel } from './cutting-board/SheetCarousel';
import { PrinterService } from './cutting-board/PrinterService';
import { useIsMobile } from '../hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export const CuttingBoard = () => {
  const { sheet, placedPieces, stats, currentSheetIndex, setCurrentSheetIndex, projectName } = useSheetData();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sheetCount, setSheetCount] = useState(1);
  
  // Use effect to update sheet count when placedPieces changes
  useEffect(() => {
    if (placedPieces.length > 0) {
      const maxSheetIndex = Math.max(...placedPieces.map(p => p.sheetIndex)) + 1;
      setSheetCount(maxSheetIndex);
    } else {
      setSheetCount(1);
    }
  }, [placedPieces]);
  
  // Group pieces by sheet index
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);

  return (
    <Card className="h-full border shadow-subtle flex flex-col animate-fade-in bg-gradient-to-br from-white to-lilac/5">
      <CardContent className={`${isMobile ? 'p-2' : 'p-4'} flex-1 relative`}>
        {/* Stats display - outside the sheet */}
        <StatsDisplay 
          sheet={sheet} 
          placedPieces={placedPieces} 
          stats={stats}
          projectName={projectName}
          isMobile={isMobile}
        />

        {/* Sheet carousel */}
        {sheets.length > 0 && (
          <SheetCarousel 
            sheet={sheet}
            placedPieces={placedPieces}
            sheetCount={sheetCount}
            currentSheetIndex={currentSheetIndex}
            setCurrentSheetIndex={setCurrentSheetIndex}
            isMobile={isMobile}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CuttingBoard;
