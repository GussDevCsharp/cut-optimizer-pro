
import { Card, CardContent } from "@/components/ui/card";
import { useSheetData } from '../hooks/useSheetData';
import { StatsDisplay } from './cutting-board/StatsDisplay';
import { SheetCarousel } from './cutting-board/SheetCarousel';
import { usePrinterService } from './cutting-board/PrinterService';

export const CuttingBoard = () => {
  const { sheet, placedPieces, stats, currentSheetIndex, setCurrentSheetIndex } = useSheetData();
  
  // Group pieces by sheet index
  const sheetCount = stats.sheetCount > 0 ? stats.sheetCount : 1;
  const sheets = Array.from({ length: sheetCount }, (_, i) => i);

  // Initialize the printer service
  const { handlePrint } = usePrinterService({ 
    sheet, 
    placedPieces, 
    sheetCount, 
    sheets 
  });

  return (
    <Card className="h-full border shadow-subtle flex flex-col animate-fade-in">
      <CardContent className="p-4 flex-1 relative">
        {/* Stats display - outside the sheet */}
        <StatsDisplay 
          sheet={sheet} 
          placedPieces={placedPieces} 
          stats={stats} 
          onPrint={handlePrint} 
        />

        {/* Sheet carousel */}
        {sheets.length > 0 && (
          <SheetCarousel 
            sheet={sheet}
            placedPieces={placedPieces}
            sheetCount={sheetCount}
            currentSheetIndex={currentSheetIndex}
            setCurrentSheetIndex={setCurrentSheetIndex}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CuttingBoard;
