
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SheetNavigationProps {
  currentSheetIndex: number;
  sheetCount: number;
  setCurrentSheetIndex: (index: number) => void;
  isMobile?: boolean;
}

export const SheetNavigation = ({
  currentSheetIndex,
  sheetCount,
  setCurrentSheetIndex,
  isMobile
}: SheetNavigationProps) => {
  return (
    <div className="flex justify-center mt-8 mb-4">
      <Button 
        variant="outline" 
        size={isMobile ? "icon" : "sm"} 
        onClick={() => setCurrentSheetIndex(Math.max(0, currentSheetIndex - 1))}
        disabled={currentSheetIndex === 0}
        className={isMobile ? "w-8 h-8 mr-2" : "mr-2"}
      >
        <ChevronLeft className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        {!isMobile && "Anterior"}
      </Button>
      <Button 
        variant="outline" 
        size={isMobile ? "icon" : "sm"} 
        onClick={() => setCurrentSheetIndex(Math.min(sheetCount - 1, currentSheetIndex + 1))}
        disabled={currentSheetIndex === sheetCount - 1}
        className={isMobile ? "w-8 h-8" : ""}
      >
        {!isMobile && "Próxima"}
        <ChevronRight className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
      </Button>
    </div>
  );
};
