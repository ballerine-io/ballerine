import { ITheme } from '@/common/types/settings';

function createInlineVariable(key: string, value: string): string {
  return `--${key}: ${value};`;
}

export const transformThemeToInlineStyles = (theme: ITheme): string => {
  let styles = '';

  Object.entries(theme.pallete).forEach(([variableKey, value]) => {
    styles += createInlineVariable(variableKey, value.color);
    styles += createInlineVariable(`${variableKey}-foreground`, value.foreground);
  });

  Object.entries(theme.elements).forEach(([variableKey, value]) => {
    styles += createInlineVariable(variableKey, value);
  });

  return styles;
};
