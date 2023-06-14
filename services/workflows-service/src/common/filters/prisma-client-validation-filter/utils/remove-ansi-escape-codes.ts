export function removeAnsiEscapeCodes(string: string): string {
  return string.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');
}
