
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, List, PenTool } from 'lucide-react';
import { ProjectHeader } from './mobile/ProjectHeader';
import { ProjectTab } from './mobile/ProjectTab';
import { PiecesTab } from './mobile/PiecesTab';
import { DrawingTab } from './mobile/DrawingTab';

export const MobileLayout = () => {
  return (
    <div className="w-full space-y-1 font-work-sans">
      <ProjectHeader />

      {/* Main/Outer Tabs for Project/Pieces/Drawing */}
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-1 bg-charcoal/90 text-white">
          <TabsTrigger value="project" className="gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
            <FileText size={16} />
            <span>Projeto</span>
          </TabsTrigger>
          <TabsTrigger value="pieces" className="gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
            <List size={16} />
            <span>Peças</span>
          </TabsTrigger>
          <TabsTrigger value="drawing" className="gap-1.5 data-[state=active]:bg-lilac data-[state=active]:text-white">
            <PenTool size={16} />
            <span>Desenho</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Contents */}
        <TabsContent value="project" className="mt-0">
          <ProjectTab />
        </TabsContent>
        
        <TabsContent value="pieces" className="mt-0">
          <PiecesTab />
        </TabsContent>
        
        <TabsContent value="drawing" className="mt-0">
          <DrawingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileLayout;
