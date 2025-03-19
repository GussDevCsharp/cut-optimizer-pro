
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileLayout } from "@/components/index-page/MobileLayout";
import { DesktopLayout } from "@/components/index-page/DesktopLayout";
import { IndexContent } from "@/components/index-page/IndexContent";
import { ProjectLoader } from "@/components/index-page/ProjectLoader";
import { useSheetData } from "@/hooks/useSheetData";
import { SaveProjectButton } from "@/components/SaveProjectButton";
import { useProjectActions } from "@/hooks/useProjectActions";
import { DeleteProject } from "@/components/dashboard/DeleteProject";
import { Card } from "@/components/ui/card";

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setProjectName } = useSheetData(); // Remove resetData as it doesn't exist
  const { loadProject } = useProjectActions();
  
  // Extract project information from location state
  const projectId = location.state?.projectId;
  const projectName = location.state?.projectName;
  
  // State to track if we have a valid project loaded
  const [currentProject, setCurrentProject] = useState<{id: string, name: string} | null>(null);
  
  // Load project when projectId changes
  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        const project = await loadProject(projectId);
        if (project) {
          setCurrentProject({
            id: project.id,
            name: project.name
          });
        }
      };
      
      fetchProject();
    } else {
      // No project ID, reset to new project
      // Instead of resetData(), set name to empty
      setProjectName("");
      setCurrentProject(null);
    }
  }, [projectId]);

  return (
    <Layout>
      {/* Add a sticky header to show project name and controls */}
      {currentProject && (
        <div className="sticky top-16 z-10 bg-background border-b py-2 px-4 mb-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">{currentProject.name}</h1>
            <div className="flex gap-2">
              <SaveProjectButton projectId={currentProject.id} />
              {currentProject && (
                <DeleteProject 
                  project={{ 
                    id: currentProject.id, 
                    name: currentProject.name,
                    // These fields are required by the Project type but not used in DeleteProject
                    user_id: "",
                    created_at: "",
                    updated_at: "",
                    description: ""
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className={isMobile ? "px-2 pb-20" : "container mx-auto p-4 pb-20"}>
        {projectId ? (
          <ProjectLoader>
            {isMobile ? <MobileLayout /> : <DesktopLayout />}
          </ProjectLoader>
        ) : (
          <IndexContent />
        )}
      </div>
    </Layout>
  );
}
