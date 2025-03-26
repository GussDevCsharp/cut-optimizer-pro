
import { toast } from '@/hooks/use-toast';
import { Sheet, PlacedPiece } from '../hooks/useSheetData';
import { generatePdf } from './pdf-generator';

export const useSharingService = (
  sheet: Sheet,
  placedPieces: PlacedPiece[],
  sheetCount: number,
  sheets: number[],
  projectName: string
) => {
  const handleSharePdf = async () => {
    toast({
      title: "Preparando arquivo",
      description: "Gerando PDF para compartilhamento...",
    });
    
    try {
      // Generate the PDF blob
      const pdfBlob = await generatePdf(sheet, placedPieces, sheetCount, sheets, projectName);
      
      // Use Web Share API for mobile
      if (navigator.share) {
        const file = new File([pdfBlob], `plano-de-corte-${projectName || 'sem-nome'}.pdf`, { 
          type: 'application/pdf' 
        });
        
        await navigator.share({
          title: `Plano de Corte ${projectName ? '- ' + projectName : ''}`,
          text: 'Confira este plano de corte',
          files: [file]
        });
        
        toast({
          title: "Compartilhado",
          description: "Seu plano de corte foi compartilhado com sucesso.",
        });
      } else {
        // Fallback for non-supporting browsers
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plano-de-corte-${projectName || 'sem-nome'}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download iniciado",
          description: "O PDF foi gerado e está sendo baixado.",
        });
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível gerar ou compartilhar o PDF.",
        variant: "destructive",
      });
    }
  };

  return { handleSharePdf };
};
