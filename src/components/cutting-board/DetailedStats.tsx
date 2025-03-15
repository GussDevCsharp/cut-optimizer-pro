
import React from 'react';
import { PlacedPiece, Sheet } from '@/hooks/useSheetData';
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SheetStatistics {
  sheetIndex: number;
  usedArea: number;
  wasteArea: number;
  efficiency: number;
  pieceCount: number;
}

interface DetailedStatsProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  currentSheetIndex: number;
  sheetCount: number;
}

export const DetailedStats = ({ sheet, placedPieces, currentSheetIndex, sheetCount }: DetailedStatsProps) => {
  // Calculate statistics for each sheet
  const allSheetStats: SheetStatistics[] = React.useMemo(() => {
    const totalSheetArea = sheet.width * sheet.height;
    const stats: SheetStatistics[] = [];

    // Create stats for each sheet
    for (let i = 0; i < sheetCount; i++) {
      const sheetPieces = placedPieces.filter(p => p.sheetIndex === i);
      const usedArea = sheetPieces.reduce((total, piece) => 
        total + (piece.rotated ? piece.height * piece.width : piece.width * piece.height), 0);
      
      const wasteArea = totalSheetArea - usedArea;
      const efficiency = totalSheetArea > 0 ? (usedArea / totalSheetArea) * 100 : 0;
      
      stats.push({
        sheetIndex: i,
        usedArea,
        wasteArea,
        efficiency,
        pieceCount: sheetPieces.length
      });
    }

    return stats;
  }, [placedPieces, sheet, sheetCount]);

  // Get current sheet stats
  const currentSheetStats = allSheetStats[currentSheetIndex] || { 
    efficiency: 0, 
    usedArea: 0, 
    wasteArea: 0, 
    pieceCount: 0 
  };

  // Create data for the chart
  const chartData = allSheetStats.map((stat, index) => ({
    name: `Chapa ${index + 1}`,
    efficiency: parseFloat(stat.efficiency.toFixed(1)),
    fill: index === currentSheetIndex ? '#1e40af' : '#3b82f6'
  }));

  return (
    <div className="bg-card border rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-medium mb-2">Estatísticas Detalhadas</h3>
      
      {/* Current sheet efficiency */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Eficiência da chapa atual:</span>
          <span className="font-medium">{currentSheetStats.efficiency.toFixed(1)}%</span>
        </div>
        <Progress value={currentSheetStats.efficiency} className="h-2" />
      </div>
      
      {/* Current sheet detailed stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
        <div className="text-muted-foreground">Área utilizada:</div>
        <div className="font-medium text-right">{Math.round(currentSheetStats.usedArea).toLocaleString()} mm²</div>
        
        <div className="text-muted-foreground">Área desperdiçada:</div>
        <div className="font-medium text-right">{Math.round(currentSheetStats.wasteArea).toLocaleString()} mm²</div>
        
        <div className="text-muted-foreground">Peças na chapa:</div>
        <div className="font-medium text-right">{currentSheetStats.pieceCount}</div>
      </div>
      
      {/* Charts comparing all sheets */}
      {sheetCount > 1 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Comparação entre chapas</h4>
          <div className="h-[150px]">
            <ChartContainer 
              config={{
                efficiency: { label: "Eficiência" }
              }}
            >
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis 
                  tickFormatter={(value) => `${value}%`} 
                  domain={[0, 100]} 
                  fontSize={10}
                />
                <Bar dataKey="efficiency" name="Eficiência" />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <ChartTooltipContent
                          className="bg-popover border border-border shadow-md rounded-md"
                          label={`${data.name}: ${data.efficiency}%`}
                        />
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  );
};
