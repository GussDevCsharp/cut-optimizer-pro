
import { createContext, useContext, useState } from "react";

export interface Piece {
  id: string;
  label: string;
  width: number;
  height: number;
  quantity: number;
  color?: string;
}

export interface PlacedPiece extends Piece {
  x: number;
  y: number;
  rotation?: boolean;
}

export interface Sheet {
  width: number;
  height: number;
  cutWidth: number;
  materialId?: string;
}

interface SheetDataContextType {
  sheet: Sheet;
  pieces: Piece[];
  placedPieces: PlacedPiece[];
  projectName: string;
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
