const hashString = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }

  return hash;
};

export const stringToRGB = (str: string) => {
  // Generate a hash of the string
  const hash = hashString(str);

  // Make sure to produce "moderately bright" colors (values between 50 and 205 for good contrast)
  let red = ((hash & 0xff) % 156) + 50;
  let green = (((hash & 0xff00) >> 8) % 156) + 50;
  let blue = (((hash & 0xff0000) >> 16) % 156) + 50;

  // Tweak the values to ensure they are not too close to each other (avoiding grayish colors)
  const minValue = Math.min(red, green, blue);
  const maxValue = Math.max(red, green, blue);

  // We'll make sure the smallest component is at most 80, and the largest component is at least 170
  // This will ensure the color is neither too bright nor too dark, and also reasonably colorful
  if (minValue > 80) {
    const reduceAmount = minValue - 80;
    red -= reduceAmount;
    green -= reduceAmount;
    blue -= reduceAmount;
  }

  if (maxValue < 170) {
    const increaseAmount = 170 - maxValue;
    red += increaseAmount;
    green += increaseAmount;
    blue += increaseAmount;
  }

  return `${red}, ${green}, ${blue}`;
};
