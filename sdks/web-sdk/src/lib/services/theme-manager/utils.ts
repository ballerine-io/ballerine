import { ICSSProperties } from '../../contexts/configuration';

export const injectPrimaryIntoLayoutGradient = (
  layoutStyles: ICSSProperties,
  primaryColor: string,
): ICSSProperties => {
  return {
    ...layoutStyles,
    background: `linear-gradient(180deg, #fff 0%, #fff 75%, ${primaryColor} 250%)`,
  };
};
