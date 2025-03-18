
import React from 'react';
import { Card } from "@/components/ui/card";
import { Building2 } from 'lucide-react';
import ShapeSelector from '../../dashboard/drawing/ShapeSelector';

interface DrawingToolsProps {
  activeTool: 'select' | 'pencil' | 'square' | 'circle' | 'triangle';
  activeColor: string;
  lineWidth: number;
  onToolSelect: (tool: 'select' | 'pencil' | 'square' | 'circle' | 'triangle') => void;
  onColorChange: (color: string) => void;
  onLineWidthChange: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearCanvas: () => void;
  onSaveDrawing: () => void;
  onGenerateProject: () => void;
}

export const DrawingTools = ({
  activeTool,
  activeColor,
  lineWidth,
  onToolSelect,
  onColorChange,
  onLineWidthChange,
  onUndo,
  onRedo,
  onClearCanvas,
  onSaveDrawing,
  onGenerateProject
}: DrawingToolsProps) => {
  return (
    <Card className="p-3 space-y-3 bg-gray-50 border border-gray-200">
      <div className="text-center mb-2">
        <h3 className="font-playfair text-lg text-charcoal-dark">Ferramentas de Desenho</h3>
        <div className="h-0.5 w-16 bg-lilac mx-auto mt-1"></div>
      </div>
      
      <ShapeSelector 
        activeTool={activeTool} 
        onSelectTool={onToolSelect} 
        activeColor={activeColor}
        onColorChange={onColorChange}
        lineWidth={lineWidth}
        onLineWidthChange={onLineWidthChange}
      />
      
      <div className="flex flex-wrap gap-1 mt-2">
        <button 
          onClick={onUndo}
          className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          title="Desfazer"
        >
          Desfazer
        </button>
        <button 
          onClick={onRedo}
          className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          title="Refazer"
        >
          Refazer
        </button>
        <button 
          onClick={onClearCanvas}
          className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          title="Limpar"
        >
          Limpar
        </button>
        <button 
          onClick={onSaveDrawing}
          className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
          title="Salvar"
        >
          Salvar
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          onClick={onGenerateProject}
          className="w-full py-2 px-3 bg-lilac hover:bg-lilac-dark text-white rounded flex items-center justify-center gap-2 transition-colors"
        >
          <Building2 size={16} />
          Gerar Projeto
        </button>
      </div>
    </Card>
  );
};

export default DrawingTools;
