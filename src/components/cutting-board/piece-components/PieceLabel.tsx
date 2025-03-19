
import React from 'react';

interface PieceLabelProps {
  label: string;
  fontSize: number;
  color: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const PieceLabel = ({ label, fontSize, color, position }: PieceLabelProps) => {
  // Calculate position classes
  let positionClass = 'absolute top-1 left-1';
  if (position === 'top-right') positionClass = 'absolute top-1 right-1';
  if (position === 'bottom-left') positionClass = 'absolute bottom-1 left-1';
  if (position === 'bottom-right') positionClass = 'absolute bottom-1 right-1';

  return (
    <div 
      className={`${positionClass} font-medium`} 
      style={{ fontSize: `${fontSize}px`, color }}
    >
      {label}
    </div>
  );
};
