/**
 * Calculates the relative luminance of a color.
 * This function implements the formula for relative luminance
 * defined in WCAG 2.0, which accounts for human perception of brightness.
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns The relative luminance value between 0 and 1
 */
export const getLuminance = (r: number, g: number, b: number): number => {
  const [r1, g1, b1] = [r, g, b].map(v => {
    v /= 255;

    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r1! + 0.7152 * g1! + 0.0722 * b1!;
};

/**
 * Extracts RGB color values from an element's background.
 * Note: This function assumes the background is set and in RGB format.
 * It may not work correctly for other color formats or unset backgrounds.
 *
 * @param element - The HTML element to extract the background color from
 * @returns An array of RGB values [r, g, b] or null if extraction fails
 */
export const getRGBColorFromElement = (element: HTMLElement): number[] | null => {
  const style = window.getComputedStyle(element);
  const bgColor = style.background || style.backgroundColor;

  if (!bgColor) {
    console.warn('Background color not found for the element');

    return null;
  }

  const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

  if (rgbMatch && rgbMatch.length === 4) {
    return rgbMatch.slice(1).map(Number);
  }

  console.warn('Failed to extract RGB values from background color:', bgColor);

  return null;
};

/**
 * Checks if a color is dark based on its RGB components.
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns true if the color is dark, false otherwise
 */
export const isColorDark = (r: number, g: number, b: number) => {
  const luminance = getLuminance(r, g, b);

  return luminance < 0.5;
};
