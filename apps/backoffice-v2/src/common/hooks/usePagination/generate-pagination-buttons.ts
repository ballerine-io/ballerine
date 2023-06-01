export const generatePaginationButtons = ({ page, siblings, totalPages }) => {
  let min = Math.max(page - siblings, 1);
  let max = Math.min(page + siblings, totalPages);

  if (min === 1) {
    max = Math.min(siblings * 2 + 1, totalPages);
  }

  if (max === totalPages) {
    min = Math.max(totalPages - siblings * 2, 1);
  }

  const length = Math.max(max - min + 1, 1);

  return Array.from({ length }, (_, i) => min + i);
};
