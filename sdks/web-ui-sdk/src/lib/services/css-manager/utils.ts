import { cssProperties, hexTransparencies } from './constants';
import { ICSSProperties, IOpacityColor } from './types';

const setBackgroundWithOpacity = (
  style: IOpacityColor,
  styles: string[],
  prefix = '',
): string[] => {
  if (style.color.includes('primary')) {
    const app = document.getElementById('blrn-app') as HTMLDivElement;
    const color = getComputedStyle(app).getPropertyValue('--general-colors-primary');
    return [
      ...styles,
      `--${prefix}background: ${color}${
        hexTransparencies[Math.round(style.opacity * 100) as keyof typeof hexTransparencies]
      };`,
    ];
  }
  return styles;
};

export const makeStylesFromConfiguration = (
  globalComponentStyles: ICSSProperties = {},
  configStyles: ICSSProperties = {},
): string => {
  let styles: string[] = [];

  const setProperties = (
    globalCss: ICSSProperties,
    localCss: ICSSProperties,
    property: keyof ICSSProperties,
    prefix = '',
  ) => {
    if (localCss && localCss[property]) {
      if (typeof localCss[property] === 'object' && property === 'background') {
        styles = setBackgroundWithOpacity(localCss[property] as IOpacityColor, styles, prefix);
        return;
      }
      styles.push(`--${prefix}${property}: ${String(localCss[property])};`);
      return;
    }
    if (globalCss && globalCss[property]) {
      if (typeof globalCss[property] === 'object' && property === 'background') {
        styles = setBackgroundWithOpacity(globalCss[property] as IOpacityColor, styles, prefix);
        return;
      }
      styles.push(`--${prefix}${property}: ${String(globalCss[property])};`);
      return;
    }
  };

  cssProperties.map(property => {
    if (property === 'hover') {
      cssProperties.map(hoverProperty => {
        const globalHoverProperties = globalComponentStyles.hover as ICSSProperties;
        const localHoverProperties = configStyles.hover as ICSSProperties;
        setProperties(globalHoverProperties, localHoverProperties, hoverProperty, 'hover-');
      });
      return;
    }
    if (property === 'active') {
      cssProperties.map(property => {
        const globalActiveProperties = globalComponentStyles.active as ICSSProperties;
        const localActiveHoverProperties = configStyles.active as ICSSProperties;
        setProperties(globalActiveProperties, localActiveHoverProperties, property, 'active-');
      });
      return;
    }
    setProperties(globalComponentStyles, configStyles, property);
  });

  return styles.join('\n');
};

export const makesLocalStyles = (configStyles: ICSSProperties) => {
  let styles: string[] = [];

  const setProperties = (css: ICSSProperties, property: keyof ICSSProperties, prefix = '') => {
    if (typeof css[property] === 'object' && property === 'background') {
      styles = setBackgroundWithOpacity(css[property] as IOpacityColor, styles, prefix);
      return;
    }
    if (css[property]) styles.push(`--${prefix}${property}: ${String(css[property])};`);
  };

  cssProperties.map(property => {
    if (property === 'hover' && configStyles.hover) {
      cssProperties.map(hoverProperty => {
        const cssHoverProperties = configStyles.hover as ICSSProperties;
        setProperties(cssHoverProperties, hoverProperty, 'hover-');
      });
      return;
    }
    if (property === 'active' && configStyles.active) {
      cssProperties.map(property => {
        const cssActiveProperties = configStyles.active as ICSSProperties;
        setProperties(cssActiveProperties, property, 'active-');
      });
      return;
    }
    setProperties(configStyles, property);
  });

  return styles.join('\n');
};
