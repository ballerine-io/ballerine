import { useLayoutEffect } from 'react';
import { transformThemeToInlineStyles } from '@app/utils/transform-theme-to-inline-styles';
import { ITheme } from '@app/common/types/settings';

interface Props {
  theme: ITheme;
  children: React.ReactNode | React.ReactNode[];
}

export const ThemeProvider = ({ theme, children }: Props) => {
  useLayoutEffect(() => {
    document
      .getElementsByTagName('html')[0]
      .setAttribute('style', transformThemeToInlineStyles(theme));
  });

  return <>{children}</>;
};
