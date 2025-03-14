
import { useState, createContext, useContext, ReactNode } from 'react';

export interface Piece {
  id: string;
  width: number;
  height: number;
  quantity: number;
  canRotate: boolean;
  color?: string;
}

export interface PlacedPiece extends Piece {
  x: number;
  y: number;
  rotated: boolean;
}

export interface Sheet {
  width: number;
  height: number;
  cutWidth: number;
}

interface SheetContextType {
  sheet: Sheet;
  setSheet: (sheet: Sheet) => void;
  pieces: Piece[];
  addPiece: (piece: Piece) => void;
  updatePiece: (id: string, piece: Partial<Piece>) => void;
  removePiece: (id: string) => void;
  placedPieces: PlacedPiece[];
  setPlacedPieces: (pieces: PlacedPiece[]) => void;
  stats: {
    usedArea: number;
    wasteArea: number;
    efficiency: number;
  };
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const [sheet, setSheet] = useState<Sheet>({
    width: 1220,
    height: 2440,
    cutWidth: 4,
  });
  
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);

  const addPiece = (piece: Piece) => {
    setPieces([...pieces, piece]);
  };

  const updatePiece = (id: string, updatedPiece: Partial<Piece>) => {
    setPieces(pieces.map(piece => 
      piece.id === id ? { ...piece, ...updatedPiece } : piece
    ));
  };

  const removePiece = (id: string) => {
    setPieces(pieces.filter(piece => piece.id !== id));
  };

  // Calculate usage statistics
  const totalSheetArea = sheet.width * sheet.height;
  const usedArea = placedPieces.reduce((total, piece) => {
    return total + (piece.width * piece.height);
  }, 0);
  const wasteArea = totalSheetArea - usedArea;
  const efficiency = totalSheetArea > 0 ? (usedArea / totalSheetArea) * 100 : 0;

  const stats = {
    usedArea,
    wasteArea,
    efficiency
  };

  return (
    <SheetContext.Provider
      value={{
        sheet,
        setSheet,
        pieces,
        addPiece,
        updatePiece,
        removePiece,
        placedPieces,
        setPlacedPieces,
        stats,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};

export const useSheetData = () => {
  const context = useContext(SheetContext);
  if (context === undefined) {
    throw new Error('useSheetData must be used within a SheetProvider');
  }
  return context;
};
