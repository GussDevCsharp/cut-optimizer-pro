
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiecesList } from './PiecesList';
import { Piece } from '@/hooks/useSheetData';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsiblePiecesListProps {
  pieces: Piece[];
  onUpdatePiece: (id: string, piece: Partial<Piece>) => void;
  onRemovePiece: (id: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export const CollapsiblePiecesList = ({
  pieces,
  onUpdatePiece,
  onRemovePiece,
  onOpenChange
}: CollapsiblePiecesListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  if (pieces.length === 0) {
    return null;
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <div className="h-full flex relative">
      <Collapsible 
        open={isOpen} 
        onOpenChange={handleOpenChange} 
        className="h-full w-full"
      >
        <div 
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 transform ${isOpen ? 'translate-x-0' : 'translate-x-2'} transition-transform duration-300`}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shadow-md bg-background rounded-full">
              {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent 
          className={`h-full transition-all duration-300 ${isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}
          forceMount
        >
          <Card className="h-full shadow-subtle border animate-fade-in overflow-hidden flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                Lista de Peças
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <PiecesList
                  pieces={pieces}
                  onUpdatePiece={onUpdatePiece}
                  onRemovePiece={onRemovePiece}
                />
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsiblePiecesList;
