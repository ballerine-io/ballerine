import { hslToRgb } from '@/common/utils/hsl-to-rgb/hsl-to-rgb';

/**
 * Convert a value to a color based on the value, maxValue, and lightness offset
 * @param value
 * @param maxValue
 * @param lightnessOffset
 */
export const valueToColor = ({
  value,
  maxValue,
  lightnessOffset,
  baseHslColor,
}: {
  value: number;
  maxValue: number;
  lightnessOffset: number;
  baseHslColor: { hue: number; saturation: number; lightness: number };
}) => {
  const { hue: baseHue, saturation: baseSaturation, lightness: baseLightness } = baseHslColor;

  /**
   * Edge case - mostly to appease TypeScript.
   */
  if (!baseHue || !baseSaturation || !baseLightness) {
    throw new Error('Invalid base color');
  }

  // Calculate the ratio of value to maxValue
  const valueRatio = value / maxValue;

  // Calculate the new lightness based on the value ratio and the lightness offset
  const lightness = baseLightness + lightnessOffset * (1 - valueRatio);

  const { red, green, blue } = hslToRgb({
    hue: baseHue,
    saturation: baseSaturation,
    lightness,
  });

  return `${red}, ${green}, ${blue}`;
};
