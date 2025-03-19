
import React from 'react';

interface PieceDimensionsProps {
  width: number;
  height: number;
  fontSize: number;
  labelFontSize: number;
  showVerticalDimension: boolean;
  color: string;
  labelColor: string;
  isScrap?: boolean;
}

export const PieceDimensions = ({
  width,
  height,
  fontSize,
  labelFontSize,
  showVerticalDimension,
  color,
  labelColor,
  isScrap = false,
}: PieceDimensionsProps) => {
  return (
    <>
      {/* Center width dimension */}
      <div 
        className={`font-medium text-center ${isScrap ? 'text-green-800' : ''}`}
        style={{ fontSize: `${fontSize}px`, color }}
      >
        {width}
      </div>
      
      {/* Vertical dimension for tall pieces */}
      {showVerticalDimension && (
        <div 
          className={`absolute transform -rotate-90 font-medium ${isScrap ? 'text-green-800' : ''}`}
          style={{ 
            fontSize: `${fontSize}px`, 
            color,
            zIndex: 2
          }}
        >
          {height}
        </div>
      )}
      
      {/* Display width at the bottom of the piece */}
      <div 
        className={`absolute bottom-0.5 w-full text-center font-medium ${isScrap ? 'text-green-800' : ''}`} 
        style={{ fontSize: `${labelFontSize}px`, color: labelColor }}
      >
        {width}
      </div>
      
      {/* Display height on the left side of the piece with vertical text */}
      <div 
        className={`absolute left-0.5 h-full flex items-center font-medium ${isScrap ? 'text-green-800' : ''}`}
        style={{ 
          fontSize: `${labelFontSize}px`, 
          color: labelColor, 
          writingMode: 'vertical-rl', 
          transform: 'rotate(180deg)' 
        }}
      >
        {height}
      </div>
    </>
  );
};
