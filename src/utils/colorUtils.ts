
export const getRandomColor = () => {
  // Lilac, gray, and black palette
  const colors = [
    '#D6BCFA', '#C4B5FD', '#A78BFA', '#9B87F5', '#8B5CF6', 
    '#C8C8C9', '#A1A1AA', '#9F9EA1', '#71717A', '#52525B',
    '#F1F5F9', '#E2E8F0', '#E5E7EB', '#D1D5DB', '#9CA3AF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate consistent pastel colors for scrap areas
export const getScrapAreaColor = (index: number, alpha: number = 0.15): string => {
  // Pastel color palette
  const colors = [
    'rgba(214, 188, 250, $alpha)', // Lilac
    'rgba(253, 225, 211, $alpha)', // Peach
    'rgba(211, 228, 253, $alpha)', // Light blue
    'rgba(242, 252, 226, $alpha)', // Light green
    'rgba(254, 247, 205, $alpha)', // Light yellow
    'rgba(229, 222, 255, $alpha)', // Light purple
    'rgba(255, 222, 226, $alpha)', // Light pink
    'rgba(254, 198, 161, $alpha)', // Light orange
    'rgba(241, 240, 251, $alpha)', // Light gray
  ];
  
  const colorIndex = index % colors.length;
  return colors[colorIndex].replace('$alpha', alpha.toString());
};
