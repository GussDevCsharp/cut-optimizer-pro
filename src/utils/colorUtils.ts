
export const getRandomColor = () => {
  // Refined palette with industrial tech colors
  const colors = [
    // Tech blues
    '#005BAA', '#2A5C8F', '#3A6DA0', '#4A7EB0', '#5A8EC0',
    // Tech oranges
    '#FF6B35', '#F96323', '#FF7D4F', '#FF8F6A', '#FFA185',
    // Tech grays 
    '#6D7B8D', '#7D8A9C', '#8D99AB', '#9DA8BA', '#ADB7C9',
    // Whites/light grays for contrast
    '#FFFFFF', '#F5F7FA', '#E5E9EF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
