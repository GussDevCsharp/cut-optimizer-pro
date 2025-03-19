
import React from 'react';
import { Sheet } from '../../hooks/useSheetData';

interface AvailableArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AvailableAreasDisplayProps {
  availableAreas: AvailableArea[];
  scale: number;
  isMobile?: boolean;
}

export const AvailableAreasDisplay = ({ availableAreas, scale, isMobile }: AvailableAreasDisplayProps) => {
  // Calculate font size based on area dimensions and device
  const getFontSize = (width: number, height: number) => {
    const minDimension = Math.min(width, height) * scale;
    return isMobile 
      ? Math.max(Math.min(minDimension / 8, 10), 6) // Smaller text on mobile
      : Math.max(Math.min(minDimension / 6, 12), 7);
  };
  
  return (
    <>
      {availableAreas.map((area, index) => {
        const fontSize = getFontSize(area.width, area.height);
        
        // Only display areas that are large enough to be meaningful
        // Skip very small areas that would just add visual noise
        if (area.width < 50 || area.height < 50) return null;
        
        return (
          <div
            key={`area-${index}`}
            style={{
              position: 'absolute',
              left: area.x * scale,
              top: area.y * scale,
              width: area.width * scale,
              height: area.height * scale,
              border: '1px dashed rgba(139, 92, 246, 0.5)',
              backgroundColor: 'rgba(229, 222, 255, 0.2)',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                fontSize: `${fontSize}px`,
                color: 'rgba(139, 92, 246, 0.8)',
                fontWeight: 500,
                textAlign: 'center',
                padding: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '3px',
              }}
            >
              {`${area.width}x${area.height}`}
            </div>
          </div>
        );
      })}
    </>
  );
};
