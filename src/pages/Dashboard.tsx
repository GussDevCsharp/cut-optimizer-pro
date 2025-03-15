
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { CreateProjectDialog } from "@/components/dashboard/CreateProjectDialog";
import { fetchProjects } from "@/services/project-service";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const { 
    data: projects = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: !!user,
    staleTime: 30000,
    retry: 1,
  });

  const handleProjectClick = (projectId: string, projectName: string) => {
    navigate("/app", { state: { projectId, projectName } });
  };

  return (
    <Layout>
      <div className={`${isMobile ? 'px-2 py-2' : 'container mx-auto p-4'}`}>
        <DashboardHeader user={user} isMobile={isMobile} />
        
        <ProjectGrid 
          projects={projects}
          isLoading={isLoading}
          error={error}
          isMobile={isMobile}
          onProjectClick={handleProjectClick}
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </Layout>
  );
}
