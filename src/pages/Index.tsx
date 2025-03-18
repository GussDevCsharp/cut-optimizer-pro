
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import IndexContent from '../components/index-page/IndexContent';
import { Toaster } from 'sonner';

const Index = () => {
  // Add initialization effect to ensure page is properly set up
  useEffect(() => {
    // Make sure sheet panel is visible on load
    document.title = 'Plano de Corte';
  }, []);

  return (
    <Layout>
      <IndexContent />
      <Toaster position="top-right" />
    </Layout>
  );
};

export default Index;
