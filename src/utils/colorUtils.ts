
export const getRandomColor = () => {
  // Lilac, gray, and black palette - avoiding the light gray (#F1F0FB) used for available areas
  const colors = [
    '#D6BCFA', '#C4B5FD', '#A78BFA', '#9B87F5', '#8B5CF6', 
    '#A1A1AA', '#9F9EA1', '#71717A', '#52525B',
    '#E2E8F0', '#E5E7EB', '#D1D5DB', '#9CA3AF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
