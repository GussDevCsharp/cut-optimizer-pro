
import React from 'react';
import { AvailableArea } from '../../utils/optimization/availableSpaceFinder';

interface AvailableAreaDisplayProps {
  area: AvailableArea;
  scale: number;
  isMobile?: boolean;
}

export const AvailableAreaDisplay = ({ area, scale, isMobile }: AvailableAreaDisplayProps) => {
  // Calculate font size based on area dimensions and device
  const minDimension = Math.min(area.width, area.height) * scale;
  const fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 10, 10), 6) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 8, 12), 7);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: area.x * scale,
        top: area.y * scale,
        width: area.width * scale,
        height: area.height * scale,
        border: '1px dashed rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 5, // Below pieces but above the sheet
        backgroundColor: 'rgba(200, 200, 255, 0.05)'
      }}
    >
      <div
        className="flex flex-col items-center justify-center p-1 rounded"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          fontSize: `${fontSize}px`,
          color: 'rgba(100, 100, 100, 0.9)',
          fontWeight: 500,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          padding: '2px 4px',
        }}
      >
        <span>{area.width} x {area.height}</span>
      </div>
    </div>
  );
};
