
import { Card, CardContent } from "@/components/ui/card";
import { useSheetData } from '../hooks/useSheetData';
import { StatsDisplay } from './cutting-board/StatsDisplay';
import { SheetCarousel } from './cutting-board/SheetCarousel';
import { usePrinterService } from './cutting-board/PrinterService';
import { useIsMobile } from '../hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

export const CuttingBoard = () => {
  const { sheet, placedPieces, stats, currentSheetIndex, setCurrentSheetIndex, projectName } = useSheetData();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Group pieces by sheet index
  const sheetCount = stats.sheetCount > 0 ? stats.sheetCount : 1;
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);

  // Initialize the printer service
  const { handlePrint, handleSharePdf, handleEmailPdf } = usePrinterService({ 
    sheet, 
    placedPieces, 
    sheetCount, 
    sheets,
    projectName 
  });

  return (
    <Card className="h-full border shadow-subtle flex flex-col animate-fade-in bg-gradient-to-br from-white to-lilac/5">
      <CardContent className={`${isMobile ? 'p-2' : 'p-4'} flex-1 relative`}>
        {/* Stats display - outside the sheet */}
        <StatsDisplay 
          sheet={sheet} 
          placedPieces={placedPieces} 
          stats={stats} 
          onPrint={handlePrint}
          onSharePdf={handleSharePdf}
          onEmailPdf={handleEmailPdf}
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
