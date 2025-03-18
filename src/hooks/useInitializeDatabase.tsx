
import { useEffect, useState } from 'react';
import { initializeMaterialsTable } from '@/services/materialService';
import { useAuth } from '@/context/AuthContext';

export function useInitializeDatabase() {
  const { user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsInitializing(false);
      return;
    }

    const initialize = async () => {
      try {
        setIsInitializing(true);
        // Initialize materials table
        const success = await initializeMaterialsTable();
        
        if (!success) {
          setError('Não foi possível inicializar o banco de dados. Por favor, tente novamente mais tarde.');
        } else {
          setIsInitialized(true);
          setError(null);
        }
      } catch (err) {
        console.error('Error initializing database:', err);
        setError('Erro ao inicializar o banco de dados.');
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [user]);

  return { isInitializing, isInitialized, error };
}
