
export const getRandomColor = (isDarkMode = false) => {
  // Paleta para tema claro
  const lightColors = [
    '#D6BCFA', '#C4B5FD', '#A78BFA', '#9B87F5', '#8B5CF6', 
    '#C8C8C9', '#A1A1AA', '#9F9EA1', '#71717A', '#52525B',
    '#F1F5F9', '#E2E8F0', '#E5E7EB', '#D1D5DB', '#9CA3AF'
  ];
  
  // Paleta para tema escuro - cores mais vibrantes para maior contraste
  const darkColors = [
    '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA',
    '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569',
    '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8'
  ];
  
  const colors = isDarkMode ? darkColors : lightColors;
  return colors[Math.floor(Math.random() * colors.length)];
};
