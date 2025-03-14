
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Trash2, Plus, Puzzle, RotateCw, RotateCcw } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { useSheetData, Piece } from '../hooks/useSheetData';

export const PiecesPanel = () => {
  const { pieces, addPiece, updatePiece, removePiece } = useSheetData();
  const [newPiece, setNewPiece] = useState<Omit<Piece, 'id'>>({
    width: 100,
    height: 100,
    quantity: 1,
    canRotate: true,
  });

  const handleAddPiece = () => {
    // Basic validation
    if (newPiece.width <= 0 || newPiece.height <= 0 || newPiece.quantity <= 0) {
      return;
    }
    
    const piece: Piece = {
      ...newPiece,
      id: `piece-${Date.now()}`,
      // Generate a random pastel color
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`,
    };
    
    addPiece(piece);
    
    // Reset form
    setNewPiece({
      width: 100,
      height: 100,
      quantity: 1,
      canRotate: true,
    });
  };

  return (
    <Card className="w-full shadow-subtle border animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Puzzle size={18} />
          Peças
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Largura (mm)</Label>
            <Input
              id="width"
              type="number"
              value={newPiece.width}
              onChange={(e) => setNewPiece({ ...newPiece, width: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Altura (mm)</Label>
            <Input
              id="height"
              type="number"
              value={newPiece.height}
              onChange={(e) => setNewPiece({ ...newPiece, height: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              value={newPiece.quantity}
              onChange={(e) => setNewPiece({ ...newPiece, quantity: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex items-center space-x-2">
              <Switch 
                id="can-rotate"
                checked={newPiece.canRotate}
                onCheckedChange={(checked) => setNewPiece({ ...newPiece, canRotate: checked })}
              />
              <Label htmlFor="can-rotate" className="cursor-pointer flex items-center">
                <span>Pode Rotacionar</span>
                {newPiece.canRotate ? (
                  <RotateCw size={16} className="ml-1 text-muted-foreground" />
                ) : (
                  <RotateCcw size={16} className="ml-1 text-muted-foreground/40" />
                )}
              </Label>
            </div>
          </div>
        </div>

        <Button className="w-full mt-2" onClick={handleAddPiece}>
          <Plus size={16} className="mr-2" />
          Adicionar Peça
        </Button>
      </CardContent>

      {pieces.length > 0 && (
        <div className="px-6 pb-4">
          <div className="max-h-[250px] overflow-y-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-3 font-medium">Peça</th>
                  <th className="text-center py-2 px-3 font-medium">Dimensões</th>
                  <th className="text-center py-2 px-3 font-medium">Qtd.</th>
                  <th className="text-center py-2 px-3 font-medium">Rot.</th>
                  <th className="text-right py-2 px-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {pieces.map((piece, index) => (
                  <tr key={piece.id} className="border-t">
                    <td className="py-2 px-3">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: piece.color }}
                        ></div>
                        <span>{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {piece.width}×{piece.height}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updatePiece(piece.id, { quantity: Math.max(1, piece.quantity - 1) })}
                        >
                          <Minus size={14} />
                        </Button>
                        <span>{piece.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updatePiece(piece.id, { quantity: piece.quantity + 1 })}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updatePiece(piece.id, { canRotate: !piece.canRotate })}
                      >
                        {piece.canRotate ? <RotateCw size={14} /> : <RotateCcw size={14} className="opacity-30" />}
                      </Button>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removePiece(piece.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PiecesPanel;
