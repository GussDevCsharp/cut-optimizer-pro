
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSheetData } from '../../hooks/useSheetData';

export const ProjectNameInput = () => {
  const { projectName, setProjectName } = useSheetData();

  return (
    <div className="grid grid-cols-1 gap-2">
      <Label htmlFor="project-name">Nome do Projeto</Label>
      <Input
        id="project-name"
        placeholder="Digite o nome do projeto"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
    </div>
  );
};
