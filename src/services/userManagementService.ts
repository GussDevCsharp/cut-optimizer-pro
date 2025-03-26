
import { MASTER_ADMIN_EMAIL } from "@/context/AuthContext";

/**
 * Verifica se usuário é admin pelo email
 */
export const isUserAdmin = (email: string): boolean => {
  // Improved admin check - accepting multiple admin emails
  const adminEmails = [
    'admin@melhorcdorte.com.br',
    'admin@exemplo.com',
    MASTER_ADMIN_EMAIL // Using the centralized constant
  ];
  
  return adminEmails.includes(email);
};

/**
 * Verifica se o usuário tem acesso total aos dados
 */
export const hasFullDataAccess = (email: string): boolean => {
  return email === MASTER_ADMIN_EMAIL;
};

/**
 * Obtém todos os usuários (apenas para o admin master)
 */
export const getAllUsers = async () => {
  try {
    // In a real implementation, this would fetch from a Supabase table
    // For now, we'll return mocked data
    return [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@exemplo.com',
        isActive: true,
        planType: 'Básico',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        isActive: true,
        planType: 'Profissional',
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        id: '3',
        name: 'Pedro Alves',
        email: 'pedro@exemplo.com',
        isActive: false,
        planType: 'Básico',
        expirationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        id: '4',
        name: 'Ana Pereira',
        email: 'ana@exemplo.com',
        isActive: true,
        planType: 'Empresarial',
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      },
      {
        id: '5',
        name: 'Carlos Ferreira',
        email: 'carlos@exemplo.com',
        isActive: true,
        planType: 'Profissional',
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        id: '6',
        name: 'Lúcia Oliveira',
        email: 'lucia@exemplo.com',
        isActive: false,
        planType: 'Básico',
        expirationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        id: '7',
        name: 'Roberto Souza',
        email: 'roberto@exemplo.com',
        isActive: true,
        planType: 'Empresarial',
        expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      },
      {
        id: '8',
        name: 'Amanda Costa',
        email: 'amanda@exemplo.com',
        isActive: true,
        planType: 'Básico',
        expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
      {
        id: '9',
        name: 'Ricardo Martins',
        email: 'ricardo@exemplo.com',
        isActive: false,
        planType: 'Profissional',
        expirationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        id: '10',
        name: 'Fernanda Lima',
        email: 'fernanda@exemplo.com',
        isActive: true,
        planType: 'Básico',
        expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      },
      {
        id: '11',
        name: 'Lucas Almeida',
        email: 'lucas@exemplo.com',
        isActive: true,
        planType: 'Profissional',
        expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      },
      {
        id: '12',
        name: 'Juliana Ribeiro',
        email: 'juliana@exemplo.com',
        isActive: false,
        planType: 'Básico',
        expirationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      }
    ];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};
