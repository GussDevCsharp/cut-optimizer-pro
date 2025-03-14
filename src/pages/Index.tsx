
import Layout from '../components/Layout';
import SheetPanel from '../components/SheetPanel';
import PiecesPanel from '../components/PiecesPanel';
import CuttingBoard from '../components/CuttingBoard';
import OptimizationControls from '../components/OptimizationControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="animate-fade-in shadow-subtle border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  <CardTitle>Melhor Corte</CardTitle>
                </div>
              </div>
              <CardDescription>
                Otimize o corte de chapas com eficiência máxima
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OptimizationControls />
            </CardContent>
          </Card>
          
          <SheetPanel />
          <PiecesPanel />
        </div>
        
        {/* Right Column - Visualization */}
        <div className="lg:col-span-2">
          <CuttingBoard />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
