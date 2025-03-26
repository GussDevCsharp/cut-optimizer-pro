
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Testing from "./pages/Testing";
import Home from "./pages/Home";
import { useEffect } from "react";
import { ThemeProvider } from "@/hooks/useTheme";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route component with enhanced security
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard component with tab handling
const DashboardWithTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the settings tab parameter
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab) {
      // Custom event to notify Dashboard component to change tab
      const event = new CustomEvent('dashboard-set-tab', { 
        detail: { tab }
      });
      window.dispatchEvent(event);
      
      // Clean up the URL
      navigate('/dashboard', { replace: true });
    }
    
    // Listen for navigate to settings tab event
    const handleNavigateToSettings = () => {
      const event = new CustomEvent('dashboard-set-tab', { 
        detail: { tab: 'settings' }
      });
      window.dispatchEvent(event);
    };
    
    window.addEventListener('navigate-to-settings-tab', handleNavigateToSettings);
    
    return () => {
      window.removeEventListener('navigate-to-settings-tab', handleNavigateToSettings);
    };
  }, [location, navigate]);

  return <Dashboard />;
};

// Mobile viewport height fix
const ViewportHeightFix = () => {
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();

    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  return null;
};

// Create a new QueryClient
const queryClient = new QueryClient();

// Application Root Component with properly structured providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ViewportHeightFix />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Home />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardWithTabs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/app" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/testing" 
                element={
                  <AdminRoute>
                    <Testing />
                  </AdminRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
