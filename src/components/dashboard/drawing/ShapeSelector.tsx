
import React from "react";
import { Button } from "@/components/ui/button";
import { MousePointer, Pencil, Square, Circle, Triangle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ShapeSelectorProps {
  activeTool: 'select' | 'pencil' | 'square' | 'circle' | 'triangle';
  onSelectTool: (tool: 'select' | 'pencil' | 'square' | 'circle' | 'triangle') => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  lineWidth?: number;
  onLineWidthChange?: (width: number) => void;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ 
  activeTool, 
  onSelectTool, 
  activeColor, 
  onColorChange,
  lineWidth = 2,
  onLineWidthChange
}) => {
  // Predefined colors
  const colors = [
    '#000000', // Black
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#22c55e', // Green
    '#eab308', // Yellow
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f97316'  // Orange
  ];

  const handleLineWidthChange = (value: number[]) => {
    if (onLineWidthChange) {
      onLineWidthChange(value[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Ferramentas</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeTool === 'select' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onSelectTool('select')}
            title="Selecionar"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button 
            variant={activeTool === 'pencil' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onSelectTool('pencil')}
            title="Lápis"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant={activeTool === 'square' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onSelectTool('square')}
            title="Quadrado"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button 
            variant={activeTool === 'circle' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onSelectTool('circle')}
            title="Círculo"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button 
            variant={activeTool === 'triangle' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => onSelectTool('triangle')}
            title="Triângulo"
          >
            <Triangle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="line-width">Espessura da Linha: {lineWidth}px</Label>
          <Slider 
            id="line-width"
            min={1} 
            max={20} 
            step={1} 
            value={[lineWidth]} 
            onValueChange={handleLineWidthChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Cores</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border ${activeColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Cor Personalizada</h3>
        <input
          type="color"
          value={activeColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full h-8 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ShapeSelector;
