
import { createContext, useContext, useState } from "react";

export interface Piece {
  id: string;
  label: string;
  width: number;
  height: number;
  quantity: number;
  color?: string;
  canRotate?: boolean; // Added this property
}

export interface PlacedPiece extends Piece {
  x: number;
  y: number;
  rotated?: boolean; // Changed from rotation to rotated
  sheetIndex: number; // Added this property
}

export interface Sheet {
  width: number;
  height: number;
  cutWidth: number;
  materialId?: string;
}

// Stats object to track metrics
export interface OptimizationStats {
  totalArea: number;
  usedArea: number;
  wasteArea: number;
  wastePercentage: number;
  sheetsUsed: number;
}

interface SheetDataContextType {
  sheet: Sheet;
  pieces: Piece[];
  placedPieces: PlacedPiece[];
  projectName: string;
  stats?: OptimizationStats; // Added stats property
  currentSheetIndex: number; // Added currentSheetIndex property
  setCurrentSheetIndex: (index: number) => void; // Added setCurrentSheetIndex method
  setSheet: (sheet: Sheet) => void;
  setPieces: (pieces: Piece[]) => void;
  setPlacedPieces: (pieces: PlacedPiece[]) => void;
  setProjectName: (name: string) => void;
  addPiece: (piece: Piece) => void;
  updatePiece: (id: string, updates: Partial<Piece>) => void;
  removePiece: (id: string) => void;
}

const SheetDataContext = createContext<SheetDataContextType | undefined>(undefined);

export const SheetDataProvider = ({ children }: { children: React.ReactNode }) => {
  // Initial sheet data - this could potentially come from localStorage or API
  const [sheet, setSheet] = useState<Sheet>({
    width: 2750,
    height: 1830,
    cutWidth: 3
  });
  
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [currentSheetIndex, setCurrentSheetIndex] = useState<number>(0); // Added currentSheetIndex state
  
  // Calculate stats based on current state
  const calculateStats = (): OptimizationStats => {
    if (placedPieces.length === 0) {
      return {
        totalArea: sheet.width * sheet.height,
        usedArea: 0,
        wasteArea: 0,
        wastePercentage: 0,
        sheetsUsed: 0
      };
    }
    
    // Find out how many sheets are being used
    const sheetsUsed = Math.max(...placedPieces.map(p => p.sheetIndex)) + 1;
    
    // Calculate total sheet area
    const totalArea = sheet.width * sheet.height * sheetsUsed;
    
    // Calculate used area by all placed pieces
    const usedArea = placedPieces.reduce((sum, piece) => {
      return sum + (piece.width * piece.height);
    }, 0);
    
    // Calculate waste
    const wasteArea = totalArea - usedArea;
    const wastePercentage = (wasteArea / totalArea) * 100;
    
    return {
      totalArea,
      usedArea,
      wasteArea,
      wastePercentage,
      sheetsUsed
    };
  };
  
  // Compute stats whenever placedPieces or sheet changes
  const stats = calculateStats();

  // Add a new piece
  const addPiece = (piece: Piece) => {
    setPieces(prevPieces => [...prevPieces, piece]);
  };

  // Update an existing piece
  const updatePiece = (id: string, updates: Partial<Piece>) => {
    setPieces(prevPieces => 
      prevPieces.map(piece => 
        piece.id === id ? { ...piece, ...updates } : piece
      )
    );
  };

  // Remove a piece
  const removePiece = (id: string) => {
    setPieces(prevPieces => prevPieces.filter(piece => piece.id !== id));
  };

  return (
    <SheetDataContext.Provider value={{
      sheet,
      pieces,
      placedPieces,
      projectName,
      stats,
      currentSheetIndex,
      setCurrentSheetIndex,
      setSheet,
      setPieces,
      setPlacedPieces,
      setProjectName,
      addPiece,
      updatePiece,
      removePiece
    }}>
      {children}
    </SheetDataContext.Provider>
  );
};

export const useSheetData = () => {
  const context = useContext(SheetDataContext);
  if (!context) {
    throw new Error("useSheetData must be used within a SheetDataProvider");
  }
  return context;
};
