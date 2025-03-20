
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, Share, Download, Mail } from 'lucide-react';
import { usePrintingService, Orientation } from '@/utils/printing-service';
import { useSheetData } from '@/hooks/useSheetData';
import { EmailDialog } from './EmailDialog';
import { generatePdf } from '@/utils/pdf-generator';
import { saveAs } from 'file-saver';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const PrinterService = () => {
  const { sheet, placedPieces, stats, projectName } = useSheetData();
  const [emailDialogOpen, setEmailDialogOpen] = React.useState(false);
  const sheets = Array.from({ length: stats.sheetCount }, (_, i) => i);
  
  const { handlePrint, orientation, setOrientation } = usePrintingService(
    sheet,
    placedPieces,
    stats.sheetCount,
    sheets,
    projectName
  );
  
  const handleDownloadPdf = async () => {
    if (placedPieces.length === 0) return;
    
    try {
      const pdfBlob = await generatePdf(sheet, placedPieces, stats.sheetCount, sheets, projectName, orientation);
      saveAs(pdfBlob, `${projectName || 'plano-de-corte'}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  
  const handleShare = async () => {
    if (placedPieces.length === 0 || !navigator.share) return;
    
    try {
      const pdfBlob = await generatePdf(sheet, placedPieces, stats.sheetCount, sheets, projectName, orientation);
      const file = new File([pdfBlob], `${projectName || 'plano-de-corte'}.pdf`, { type: 'application/pdf' });
      
      await navigator.share({
        title: 'Plano de Corte',
        text: `Plano de corte ${projectName}`,
        files: [file]
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="text-sm font-medium mb-1">Orientação:</div>
        <ToggleGroup 
          type="single" 
          value={orientation} 
          onValueChange={(value) => value && setOrientation(value as Orientation)}
          className="justify-start"
        >
          <ToggleGroupItem value="vertical" size="sm">Vertical</ToggleGroupItem>
          <ToggleGroupItem value="horizontal" size="sm">Horizontal</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="default" 
          className="w-full flex items-center gap-2" 
          onClick={handlePrint}
          disabled={placedPieces.length === 0}
        >
          <Printer size={16} />
          Imprimir
        </Button>
        
        <Button 
          variant="default" 
          className="w-full flex items-center gap-2" 
          onClick={handleDownloadPdf}
          disabled={placedPieces.length === 0}
        >
          <Download size={16} />
          Download
        </Button>
        
        {navigator.share && (
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2" 
            onClick={handleShare}
            disabled={placedPieces.length === 0}
          >
            <Share size={16} />
            Compartilhar
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2" 
          onClick={() => setEmailDialogOpen(true)}
          disabled={placedPieces.length === 0}
        >
          <Mail size={16} />
          Email
        </Button>
      </div>
      
      <EmailDialog 
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen} 
        pdfGenerator={() => generatePdf(sheet, placedPieces, stats.sheetCount, sheets, projectName, orientation)}
        projectName={projectName}
      />
    </div>
  );
};

export default PrinterService;
