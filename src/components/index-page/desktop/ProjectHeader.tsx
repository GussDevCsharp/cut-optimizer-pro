
import React from 'react';
import { Card } from "@/components/ui/card";
import { ProjectNameInput } from '../../sheet-panel/ProjectNameInput';
import { Ruler } from 'lucide-react';

export const ProjectHeader = () => {
  return (
    <div className="flex justify-between mb-1">
      <Card className="animate-fade-in shadow-subtle border border-lilac/20 p-2 bg-gray-50 flex items-center">
        <span className="text-xs text-muted-foreground flex items-center">
          <span className="inline-block w-6 border-t border-dashed border-red-500 mr-1"></span>
          Linhas tracejadas indicam dimensões externas
        </span>
      </Card>
      <Card className="animate-fade-in shadow-subtle border border-lilac/20 w-1/3 p-2 bg-gray-50 flex items-center">
        <Ruler className="h-4 w-4 text-lilac-dark mr-2" />
        <ProjectNameInput />
      </Card>
    </div>
  );
};

export default ProjectHeader;
