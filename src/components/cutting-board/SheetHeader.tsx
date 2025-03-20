
import React from 'react';

interface SheetHeaderProps {
  currentSheetIndex: number;
  sheetCount: number;
  isMobile?: boolean;
}

export const SheetHeader = ({ 
  currentSheetIndex, 
  sheetCount,
  isMobile 
}: SheetHeaderProps) => {
  return (
    <div className="flex justify-center items-center mb-2">
      <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
        Chapa {currentSheetIndex + 1} de {sheetCount}
      </span>
    </div>
  );
};
