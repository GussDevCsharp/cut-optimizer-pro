
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, Mail, Share2, ChevronLeft } from "lucide-react";
import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmailDialog } from './EmailDialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface StatsDisplayProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  stats: {
    efficiency: number;
    sheetCount: number;
  };
  projectName: string;
  onPrint: () => void;
  onSharePdf: () => void;
  onEmailPdf: (email: string) => Promise<boolean>;
  isMobile?: boolean;
}

export const StatsDisplay = ({ 
  sheet, 
  placedPieces, 
  stats, 
  projectName, 
  onPrint, 
  onSharePdf,
  onEmailPdf,
  isMobile 
}: StatsDisplayProps) => {
  const navigate = useNavigate();
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className={`mb-4 text-sm flex ${isMobile ? 'flex-col gap-2' : 'justify-between items-center'}`}>
      {/* Back to Dashboard Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBackToDashboard} 
        className="mb-2 gap-1"
      >
        <ChevronLeft size={16} />
        Voltar ao Dashboard
      </Button>
    
      <div className={`px-3 py-1.5 rounded-md bg-background/95 border shadow-subtle ${isMobile ? 'w-full' : 'inline-block'}`}>
        <div className={`${isMobile ? 'grid grid-cols-2 gap-x-2 gap-y-1 text-xs' : 'grid grid-cols-2 gap-x-4 gap-y-1'}`}>
          {projectName && (
            <>
              <div className="text-muted-foreground">Projeto:</div>
              <div className="font-medium text-right">{projectName}</div>
            </>
          )}
          
          <div className="text-muted-foreground">Dimensões:</div>
          <div className="font-medium text-right">{sheet.width}×{sheet.height}mm</div>
          
          <div className="text-muted-foreground">Peças:</div>
          <div className="font-medium text-right">{placedPieces.length}</div>
          
          <div className="text-muted-foreground">Chapas utilizadas:</div>
          <div className="font-medium text-right">{stats.sheetCount}</div>
          
          <div className="text-muted-foreground">Eficiência:</div>
          <div className="font-medium text-right">{stats.efficiency.toFixed(1)}%</div>
          
          <div className="text-muted-foreground">Largura de corte:</div>
          <div className="font-medium text-right">{sheet.cutWidth}mm</div>
        </div>
      </div>
      
      <div className={`flex ${isMobile ? 'w-full gap-2' : 'gap-2'}`}>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "sm"} 
          onClick={onPrint} 
          className="gap-2"
        >
          <Printer size={16} />
          Imprimir
        </Button>
        
        {isMobile ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSharePdf} 
            className="gap-2 flex-1"
          >
            <Share2 size={16} />
            Compartilhar
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Mail size={16} />
                Email
              </Button>
            </DialogTrigger>
            <EmailDialog onSendEmail={onEmailPdf} />
          </Dialog>
        )}
      </div>
    </div>
  );
};
