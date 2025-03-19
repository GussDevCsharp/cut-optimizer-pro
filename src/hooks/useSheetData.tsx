
import { useState, createContext, useContext, ReactNode } from 'react';

export interface Piece {
  id: string;
  width: number;
  height: number;
  quantity: number;
  canRotate: boolean;
  color?: string;
  materialId?: string;
}

export interface PlacedPiece extends Piece {
  x: number;
  y: number;
  rotated: boolean;
  sheetIndex: number; // Add sheetIndex to track which sheet the piece is on
}

export interface ScrapPiece extends PlacedPiece {
  isScrap: boolean;
}

export interface Sheet {
  width: number;
  height: number;
  cutWidth: number;
  materialId?: string; // Add materialId to track the selected material
}

interface SheetContextType {
  projectName: string;
  setProjectName: (name: string) => void;
  sheet: Sheet;
  setSheet: (sheet: Sheet) => void;
  pieces: Piece[];
  addPiece: (piece: Piece) => void;
  setPieces: (pieces: Piece[]) => void; // Add this method to set all pieces at once
  updatePiece: (id: string, piece: Partial<Piece>) => void;
  removePiece: (id: string) => void;
  placedPieces: PlacedPiece[];
  setPlacedPieces: (pieces: PlacedPiece[]) => void;
  scrapPieces: ScrapPiece[];
  setScrapPieces: (scraps: ScrapPiece[]) => void;
  stats: {
    usedArea: number;
    wasteArea: number;
    efficiency: number;
    sheetCount: number; // Add sheet count to stats
    scrapArea: number; // Add scrap area to stats
  };
  currentSheetIndex: number; // Add current sheet index
  setCurrentSheetIndex: (index: number) => void; // Add setter for current sheet index
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [sheet, setSheet] = useState<Sheet>({
    width: 1220,
    height: 2440,
    cutWidth: 4,
  });
  
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [scrapPieces, setScrapPieces] = useState<ScrapPiece[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState<number>(0);

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

  // Calculate the number of sheets used
  const sheetCount = placedPieces.length > 0 
    ? Math.max(...placedPieces.map(p => p.sheetIndex)) + 1 
    : 0;

  // Calculate usage statistics for the current sheet
  const currentSheetPieces = placedPieces.filter(p => p.sheetIndex === currentSheetIndex);
  const currentSheetScraps = scrapPieces.filter(p => p.sheetIndex === currentSheetIndex);
  
  const totalSheetArea = sheet.width * sheet.height;
  const usedArea = currentSheetPieces.reduce((total, piece) => {
    return total + (piece.width * piece.height);
  }, 0);
  
  const scrapArea = currentSheetScraps.reduce((total, scrap) => {
    return total + (scrap.width * scrap.height);
  }, 0);
  
  const wasteArea = totalSheetArea - usedArea - scrapArea;
  const efficiency = totalSheetArea > 0 ? ((usedArea + scrapArea) / totalSheetArea) * 100 : 0;

  const stats = {
    usedArea,
    wasteArea,
    efficiency,
    sheetCount,
    scrapArea
  };

  return (
    <SheetContext.Provider
      value={{
        projectName,
        setProjectName,
        sheet,
        setSheet,
        pieces,
        setPieces,
        addPiece,
        updatePiece,
        removePiece,
        placedPieces,
        setPlacedPieces,
        scrapPieces,
        setScrapPieces,
        stats,
        currentSheetIndex,
        setCurrentSheetIndex,
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
