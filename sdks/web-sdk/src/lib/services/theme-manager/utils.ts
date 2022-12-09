import { ICSSProperties } from '../css-manager';

export const injectPrimaryIntoLayoutGradient = (
  layoutStyles: ICSSProperties,
  primaryColor: string,
): ICSSProperties => {
  if (typeof layoutStyles.background === 'string' && layoutStyles.background.includes('gradient')) {
    return {
      ...layoutStyles,
      background: `linear-gradient(180deg, #fff 0%, #fff 75%, ${primaryColor} 250%)`,
    };
  }
  return layoutStyles;
};
