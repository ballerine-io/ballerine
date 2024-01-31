export const getRiskScoreStyle = (score: number | null = 0) => {
  score = score === null ? 0 : score;

  if (score <= 39) {
    return 'success';
  }

  if (score <= 69) {
    return 'moderate';
  }

  if (score <= 84) {
    return 'warning';
  }

  return 'error';
};
