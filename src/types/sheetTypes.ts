
export interface Piece {
  id: string;
  width: number;
  height: number;
  quantity: number;
  canRotate: boolean;
  color?: string;
  materialId?: string;
  name: string;
}

export interface PlacedPiece extends Piece {
  x: number;
  y: number;
  rotated: boolean;
  sheetIndex: number;
}

export interface Sheet {
  width: number;
  height: number;
  cutWidth: number;
  materialId?: string;
}

export interface SheetStats {
  usedArea: number;
  wasteArea: number;
  efficiency: number;
  sheetCount: number;
}

export interface OptimizationCallbacks {
  onProgressUpdate?: (iteration: number, totalIterations: number) => void;
  onFinish?: () => void;
}

export type OptimizationDirection = 'horizontal' | 'vertical';

export interface SheetContextType {
  projectName: string;
  setProjectName: (name: string) => void;
  sheet: Sheet;
  setSheet: (sheet: Sheet) => void;
  pieces: Piece[];
  addPiece: (piece: Piece) => void;
  setPieces: (pieces: Piece[]) => void;
  updatePiece: (id: string, piece: Partial<Piece>) => void;
  removePiece: (id: string) => void;
  placedPieces: PlacedPiece[];
  setPlacedPieces: (pieces: PlacedPiece[]) => void;
  stats: SheetStats;
  currentSheetIndex: number;
  setCurrentSheetIndex: (index: number) => void;
  optimizationDirection: OptimizationDirection;
  setOptimizationDirection: (direction: OptimizationDirection) => void;
  isOptimizing: boolean;
  optimizationProgress: number;
  setIsOptimizing: (value: boolean) => void;
  setOptimizationProgress: (value: number) => void;
  startOptimization: (callbacks?: OptimizationCallbacks) => void;
  stopOptimization: () => Promise<void>;
  optimizationTimeLimit: number;
  setOptimizationTimeLimit: (limit: number) => void;
  updateSheetData: (sheetId: string, data: any) => Promise<void>;
  kerf: number;
  setKerf: (value: number) => void;
  grainDirection: 'width' | 'height';
  setGrainDirection: (direction: 'width' | 'height') => void;
}
