
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { usePrintingService } from '../../utils/printing-service';
import { useSharingService } from '../../utils/sharing-service';
import { useEmailService } from '../../utils/email-service';

interface PrinterServiceProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  sheetCount: number;
  sheets: number[];
  projectName: string;
}

export const usePrinterService = ({ sheet, placedPieces, sheetCount, sheets, projectName }: PrinterServiceProps) => {
  // Use the separate service hooks
  const { handlePrint } = usePrintingService(sheet, placedPieces, sheetCount, sheets, projectName);
  const { handleSharePdf } = useSharingService(sheet, placedPieces, sheetCount, sheets, projectName);
  const { handleEmailPdf } = useEmailService(sheet, placedPieces, sheetCount, sheets, projectName);

  return { 
    handlePrint,
    handleSharePdf,
    handleEmailPdf
  };
};
