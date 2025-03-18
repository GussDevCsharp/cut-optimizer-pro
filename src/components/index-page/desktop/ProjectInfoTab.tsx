
import React from 'react';
import SheetPanel from '../../SheetPanel';
import CuttingBoard from '../../CuttingBoard';
import PiecesAndOptimizationPanel from '../../PiecesAndOptimizationPanel';

export const ProjectInfoTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
      {/* Left Column - Controls in the order: Sheet, Pieces e Otimização */}
      <div className="lg:col-span-1 space-y-2">
        <SheetPanel />
        <PiecesAndOptimizationPanel />
      </div>
      
      {/* Middle to Right Column - Visualization with multiple sheets in carousel */}
      <div className="lg:col-span-3">
        <CuttingBoard />
      </div>
    </div>
  );
};

export default ProjectInfoTab;
