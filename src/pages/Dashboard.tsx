// Import necessary components and hooks
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { ProjectsTabContent } from '@/components/dashboard/ProjectsTabContent';
import { MaterialsTabContent } from '@/components/dashboard/MaterialsTabContent';
import { SettingsContainer } from '@/components/settings/SettingsContainer';
import { useNavigate } from 'react-router-dom';

// Dashboard component
const Dashboard = () => {
  // Initialize state and hooks
  const [activeTab, setActiveTab] = useState<string>('projects');
  const { user, isLoading, isAdmin, isMasterAdmin } = useAuth();
  const navigate = useNavigate();

  // Listen for tab change events
  useEffect(() => {
    const handleSetTab = (event: CustomEvent) => {
      const { tab } = event.detail;
      if (tab) {
        setActiveTab(tab);
      }
    };

    // Type assertion for the event type
    window.addEventListener('dashboard-set-tab', handleSetTab as EventListener);
    
    return () => {
      window.removeEventListener('dashboard-set-tab', handleSetTab as EventListener);
    };
  }, []);

  // Redirect to app if user clicks on New Project
  const handleNewProject = () => {
    navigate('/app');
  };

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Get display name or email for greeting
  const displayName = user?.email ? (user.email.split('@')[0]) : 'usuário';

  return (
    <Layout>
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Painel de controle</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {displayName}. Gerencie seus projetos e materiais.
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs 
        defaultValue="projects" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <ProjectsTabContent onNewProject={handleNewProject} />
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <MaterialsTabContent />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <SettingsContainer />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Dashboard;
