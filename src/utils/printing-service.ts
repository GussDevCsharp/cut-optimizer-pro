
import { toast } from '@/hooks/use-toast';
import { Sheet, PlacedPiece } from '../hooks/useSheetData';
import { generateCuttingPlanHtml } from './html-generator';
import { generatePdf } from './pdf-generator';

export const usePrintingService = (
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  sheetCount: number,
  sheets: number[],
  projectName: string
) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(generateCuttingPlanHtml(sheet, placedPieces, sheetCount, sheets, projectName));
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => printWindow.close(), 1000);
    }, 500);
  };

  return { handlePrint };
};
