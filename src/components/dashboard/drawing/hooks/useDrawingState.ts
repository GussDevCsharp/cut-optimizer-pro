
import { useRef } from 'react';
import { Shape } from '../types/drawingTypes';

export function useDrawingState() {
  const isDrawingRef = useRef<boolean>(false);
  const shapesRef = useRef<Shape[]>([]);
  const undoHistoryRef = useRef<Shape[][]>([]);
  const redoHistoryRef = useRef<Shape[][]>([]);
  const currentShapeRef = useRef<Shape | null>(null);

  return {
    isDrawingRef,
    shapesRef,
    undoHistoryRef,
    redoHistoryRef,
    currentShapeRef,
  };
}
