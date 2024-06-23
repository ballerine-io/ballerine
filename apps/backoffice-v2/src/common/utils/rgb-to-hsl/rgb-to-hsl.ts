export const rgbToHsl = ({ red, green, blue }: { red: number; green: number; blue: number }) => {
  const baseRed = red / 255;
  const baseGreen = green / 255;
  const baseBlue = blue / 255;

  const max = Math.max(baseRed, baseGreen, baseBlue);
  const min = Math.min(baseRed, baseGreen, baseBlue);

  let hue = (max + min) / 2;
  let saturation = (max + min) / 2;
  const lightness = (max + min) / 2;

  if (max === min) {
    hue = 0;
    saturation = 0;
  }

  if (max !== min) {
    const difference = max - min;

    if (lightness > 0.5) {
      saturation = difference / (2 - max - min);
    }

    if (lightness <= 0.5) {
      saturation = difference / (max + min);
    }

    switch (max) {
      case baseRed:
        hue = (baseGreen - baseBlue) / difference + (baseGreen < baseBlue ? 6 : 0);

        break;
      case baseGreen:
        hue = (baseBlue - baseRed) / difference + 2;

        break;
      case baseBlue:
        hue = (baseRed - baseGreen) / difference + 4;

        break;
    }

    hue *= 60;
  }

  return { hue, saturation: saturation * 100, lightness: lightness * 100 };
};
