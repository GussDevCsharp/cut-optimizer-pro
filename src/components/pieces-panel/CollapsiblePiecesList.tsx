
import { useState } from 'react';
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
}

export const CollapsiblePiecesList = ({
  pieces,
  onUpdatePiece,
  onRemovePiece
}: CollapsiblePiecesListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (pieces.length === 0) {
    return null;
  }

  return (
    <div className="h-full flex">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="h-full flex">
        <CollapsibleContent className="h-full">
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
        
        <div className="flex items-center">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
};

export default CollapsiblePiecesList;
