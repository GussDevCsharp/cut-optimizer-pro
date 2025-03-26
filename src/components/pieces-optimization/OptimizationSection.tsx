
import React from 'react';
import { OptimizationControls } from '../OptimizationControls';

export const OptimizationSection: React.FC = () => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Otimização</h2>
      <OptimizationControls className="mb-4" />
    </div>
  );
};
