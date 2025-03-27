
import { toast } from 'sonner';
import { Sheet, PlacedPiece } from '../hooks/useSheetData';
import { generatePdf } from './pdf-generator';

export const useEmailService = (
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  sheetCount: number,
  sheets: number[],
  projectName: string
) => {
  const handleEmailPdf = async (email: string): Promise<boolean> => {
    toast("Preparando email", {
      description: "Gerando PDF para envio...",
    });
    
    try {
      // Get email settings from localStorage
      const emailSettingsString = localStorage.getItem('emailSettings');
      if (!emailSettingsString) {
        toast.error("Configurações não encontradas", {
          description: "Configure suas credenciais de email nas configurações da conta.",
        });
        return false;
      }
      
      const emailSettings = JSON.parse(emailSettingsString);
      
      // Generate the PDF blob
      const pdfBlob = await generatePdf(sheet, placedPieces, sheetCount, sheets, projectName);
      
      // This is a mock implementation since we don't have a backend
      // In a real app, you would send the PDF to a server endpoint that would email it
      console.log(`Would email PDF to ${email} using settings:`, {
        service: emailSettings.emailService,
        server: emailSettings.smtpServer,
        port: emailSettings.smtpPort,
        fromEmail: emailSettings.fromEmail,
        fromName: emailSettings.fromName,
        // Don't log sensitive data like username/password in production
      });
      
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
