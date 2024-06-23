import { rgbToHsl } from '@/common/utils/rgb-to-hsl/rgb-to-hsl';
import { valueToColor } from '@/common/utils/value-to-color/value-to-color';

export const assignColorToItem = <
  TItem extends Record<PropertyKey, unknown> & {
    id: string;
    name: string;
    value: number;
  },
>({
  items,
  baseLightnessOffset,
  duplicateLightnessOffsetStep,
  baseRgbColor,
}: {
  items: TItem[];
  baseLightnessOffset: number;
  duplicateLightnessOffsetStep: number;
  baseRgbColor: { red: number; green: number; blue: number };
}) => {
  const highestValue = Math.max(...items.map(({ value }) => value));
  const valueCounts = new Map();
  const baseHslColor = rgbToHsl(baseRgbColor);

  // Count the occurrences of each value
  items.forEach(({ value }) => {
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  });

  const valueIndexMap = new Map(); // To track the current index for each value

  // Assign colors based on perturbed values in a single loop
  return items.map(item => {
    let lightnessOffset = baseLightnessOffset;

    if (item.value === highestValue) {
      return {
        ...item,
        color: `${baseRgbColor.red}, ${baseRgbColor.green}, ${baseRgbColor.blue}`,
      };
    }

    const count = valueCounts.get(item.value);

    if (count > 1) {
      const currentIndex = valueIndexMap.get(item.value) || 0;

      lightnessOffset += currentIndex * duplicateLightnessOffsetStep; // Add additional offset for duplicates

      valueIndexMap.set(item.value, currentIndex + 1); // Increment the index for the next duplicate
    }

    return {
      ...item,
      color: valueToColor({
        value: item.value,
        maxValue: highestValue,
        lightnessOffset,
        baseHslColor,
      }),
    };
  });
};
