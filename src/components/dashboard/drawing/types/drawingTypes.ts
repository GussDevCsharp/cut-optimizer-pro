
export interface Shape {
  type: 'square' | 'circle' | 'triangle' | 'line';
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  color: string;
  lineWidth?: number;
}

export type DrawingTool = 'select' | 'pencil' | 'square' | 'circle' | 'triangle';

export interface DrawingCanvasProps {
  activeTool: DrawingTool;
  activeColor: string;
  lineWidth?: number;
  width?: number;
  height?: number;
  showGrid?: boolean; // Optional prop to toggle grid visibility
}

export interface DrawingCanvasRef {
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  saveAsImage: () => void;
  setDrawingColor: (color: string) => void;
  setDrawingTool: (tool: string) => void;
  setLineWidth: (width: number) => void;
}

// Define the union type for both mouse and touch events
export type DrawingEvent = 
  | React.MouseEvent<HTMLCanvasElement> 
  | React.TouchEvent<HTMLCanvasElement>;
