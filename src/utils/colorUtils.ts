
export const getRandomColor = () => {
  // Lilac, gray, and black palette
  const colors = [
    '#D6BCFA', '#C4B5FD', '#A78BFA', '#9B87F5', '#8B5CF6', 
    '#C8C8C9', '#A1A1AA', '#9F9EA1', '#71717A', '#52525B',
    '#F1F5F9', '#E2E8F0', '#E5E7EB', '#D1D5DB', '#9CA3AF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
