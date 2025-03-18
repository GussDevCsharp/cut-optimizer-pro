
import { useRef, useEffect } from 'react';
import { Shape } from '../types/drawingTypes';

export function useDrawingState() {
  const isDrawingRef = useRef<boolean>(false);
  const shapesRef = useRef<Shape[]>([]);
  const undoHistoryRef = useRef<Shape[][]>([]);
  const redoHistoryRef = useRef<Shape[][]>([]);
  const currentShapeRef = useRef<Shape | null>(null);
  const isTouchDeviceRef = useRef<boolean>(false);
  
  // Detect if the user is on a touch device
  useEffect(() => {
    isTouchDeviceRef.current = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0;
  }, []);

  return {
    isDrawingRef,
    shapesRef,
    undoHistoryRef,
    redoHistoryRef,
    currentShapeRef,
    isTouchDeviceRef,
  };
}
