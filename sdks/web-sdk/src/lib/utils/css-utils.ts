import { IAppConfiguration, ICSSProperties } from '../contexts/configuration';

const cssProperties: (keyof ICSSProperties)[] = [
  'margin',
  'padding',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'vertical-align',
  'width',
  'height',
  'background',
  'color',
  'border-radius',
  'border',
  'display',
  'align-items',
  'text-align',
  'justify-content',
  'cursor',
  'position',
  'top',
  'bottom',
  'left',
  'right',
  'hover',
  'active',
  'box-shadow',
  '-webkit-box-shadow',
  'flex-direction',
  'align-self',
  'fill',
  'flex-grow',
  'background-position-y',
  'outline',
  'z-index',
];

export const makeStylesFromConfiguration = (
  globalComponentStyles: ICSSProperties = {},
  configStyles: ICSSProperties = {},
): string => {
  const styles: string[] = [];

  const setProperties = (
    globalCss: ICSSProperties,
    localCss: ICSSProperties,
    property: keyof ICSSProperties,
    prefix = '',
  ) => {
    if (localCss && localCss[property]) {
      styles.push(`--${prefix}${property}: ${localCss[property]};`);
      return;
    }
    if (globalCss && globalCss[property]) {
      styles.push(`--${prefix}${property}: ${globalCss[property]};`);
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
  const styles: string[] = [];

  const setProperties = (css: ICSSProperties, property: keyof ICSSProperties, prefix = '') => {
    if (css[property]) styles.push(`--${prefix}${property}: ${css[property]};`);
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
