export const hslToRgb = ({
  hue,
  saturation,
  lightness,
}: {
  hue: number;
  saturation: number;
  lightness: number;
}) => {
  const baseSaturation = saturation / 100;
  const baseLightness = lightness / 100;

  const hueFactor = (number: number) => (number + hue / 30) % 12;
  const chroma = baseSaturation * Math.min(baseLightness, 1 - baseLightness);
  const colorComponent = (number: number) =>
    baseLightness -
    chroma * Math.max(Math.min(hueFactor(number) - 3, 9 - hueFactor(number), 1), -1);

  return {
    red: Math.floor(colorComponent(0) * 255),
    green: Math.floor(colorComponent(8) * 255),
    blue: Math.floor(colorComponent(4) * 255),
  };
};
