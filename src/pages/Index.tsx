
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import IndexContent from '../components/index-page/IndexContent';
import { Helmet } from 'react-helmet';

const Index = () => {
  useEffect(() => {
    // Set a more architectural page title
    document.title = "Arquitec - Planejador de Projetos";
  }, []);

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Work+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Helmet>
      <Layout>
        <IndexContent />
      </Layout>
    </>
  );
};

export default Index;
