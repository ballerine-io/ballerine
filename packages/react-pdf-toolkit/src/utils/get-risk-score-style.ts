export const getRiskScoreStyle = (score: number | null = 0) => {
  if (Number(score) <= 39) {
    return 'success';
  }

  if (Number(score) <= 69) {
    return 'moderate';
  }

  if (Number(score) <= 84) {
    return 'warning';
  }

  return 'error';
};
