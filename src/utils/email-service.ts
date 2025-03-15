
import { useToast } from '@/hooks/use-toast';
import { Sheet, PlacedPiece } from '../hooks/useSheetData';
import { generatePdf } from './pdf-generator';

export const useEmailService = (
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  sheetCount: number,
  sheets: number[],
  projectName: string
) => {
  const { toast } = useToast();

  const handleEmailPdf = async (email: string): Promise<boolean> => {
    toast({
      title: "Preparando email",
      description: "Gerando PDF para envio...",
    });
    
    try {
      // Generate the PDF blob
      const pdfBlob = await generatePdf(sheet, placedPieces, sheetCount, sheets, projectName);
      
      // This is a mock implementation since we don't have a backend
      // In a real app, you would send the PDF to a server endpoint that would email it
      console.log(`Would email PDF to ${email}`);
      
      // This simulates the API call delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // Return success for demo purposes
          resolve(true);
        }, 1500);
      });
    } catch (error) {
      console.error('Error generating PDF for email:', error);
      return false;
    }
  };

  return { handleEmailPdf };
};
