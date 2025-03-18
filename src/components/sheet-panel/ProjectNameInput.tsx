
import React from 'react';
import { Input } from "@/components/ui/input";
import { useSheetData } from '../../hooks/useSheetData';

export const ProjectNameInput = () => {
  const { projectName, setProjectName } = useSheetData();

  return (
    <Input
      id="project-name"
      placeholder="Nome do projeto"
      value={projectName}
      onChange={(e) => setProjectName(e.target.value)}
      className="w-full"
    />
  );
};
