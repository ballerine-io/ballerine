export const getLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map(v => {
    v /= 255;

    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0]! * 0.2126 + a[1]! * 0.7152 + a[2]! * 0.0722;
};

export const getRGBColorFromElement = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  const bgColor = style.background;

  const rgbValues = bgColor.match(/\d+/g);

  if (rgbValues && rgbValues.length >= 3) {
    return rgbValues.map(Number);
  }

  return null;
};

export const isColorDark = (r: number, g: number, b: number) => {
  const luminance = getLuminance(r, g, b);

  return luminance < 0.5;
};
