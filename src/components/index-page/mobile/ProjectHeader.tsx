
import React from 'react';
import { Card } from "@/components/ui/card";
import { ProjectNameInput } from '../../sheet-panel/ProjectNameInput';

export const ProjectHeader = () => {
  return (
    <div className="flex justify-end mb-1">
      <Card className="animate-fade-in shadow-subtle border w-4/5 p-2 bg-gray-50">
        <ProjectNameInput />
      </Card>
    </div>
  );
};
