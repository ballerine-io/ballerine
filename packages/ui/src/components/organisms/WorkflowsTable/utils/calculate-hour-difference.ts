export function calculateHourDifference(dateA: Date, dateB: Date) {
  const diff = Math.abs(
    Number(new Date(dateB.toISOString())) - Number(new Date(dateA.toISOString())),
  );
  const hours = Math.floor(diff / (1000 * 60 * 60));

  return hours;
}
