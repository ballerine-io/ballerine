import { ITheme } from '@/common/types/settings';

const createInlineVariable = (key: string, value: string) => {
  return `--${key}: ${value};`;
};

export const transformThemeToInlineStyles = (theme: ITheme): string => {
  let styles = '';

  Object.entries(theme.palette).forEach(([variableKey, value]) => {
    styles += createInlineVariable(variableKey, value.color);
    styles += createInlineVariable(`${variableKey}-foreground`, value.foreground);
  });

  const buildInlineVariableForElements = (elements: ITheme['elements'], path?: string) => {
    Object.entries(elements).forEach(([variableKey, value]) => {
      if (typeof value === 'string') {
        styles += createInlineVariable(`${path ? `${path}-` : ''}${variableKey}`, value);
      } else {
        buildInlineVariableForElements(value, `${path ? `${path}-` : ''}${variableKey}`);
      }
    });
  };

  buildInlineVariableForElements(theme.elements);

  return styles;
};
