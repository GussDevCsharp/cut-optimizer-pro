
// Re-export all authentication-related functions
export {
  formatSupabaseUser,
  getCurrentSession,
  loginWithEmail,
  registerUser,
  resetPasswordEmail,
  logout,
  getUserById
} from './authService';

// Re-export all user management-related functions
export {
  isUserAdmin,
  hasFullDataAccess,
  getAllUsers
} from './userManagementService';
