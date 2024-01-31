export function toTitleCase(s: string) {
  const result = s.replaceAll(/([A-Z])/g, ' $1');

  return result.charAt(0).toUpperCase() + result.slice(1);
}
