export const getRandomBrightHexColor = (): string => {
  // Generate random values for R, G, and B components with a minimum value to avoid dark colors
  const min = 128; // Minimum value to ensure brightness (0-127 would be darker colors)
  const max = 255; // Maximum value for RGB components

  const r = Math.floor(Math.random() * (max - min + 1)) + min;
  const g = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;

  // Convert RGB to hex
  const toHex = (value: number) => value.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
