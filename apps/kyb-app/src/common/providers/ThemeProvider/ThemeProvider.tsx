import { ITheme } from '@/common/types/settings';
import { transformThemeToInlineStyles } from '@/utils/transform-theme-to-inline-styles';
import { useLayoutEffect } from 'react';

interface Props {
  theme: ITheme;
  children: React.ReactNode | React.ReactNode[];
}

export const ThemeProvider = ({ theme, children }: Props) => {
  useLayoutEffect(() => {
    document
      .getElementsByTagName('html')[0]
      ?.setAttribute('style', transformThemeToInlineStyles(theme as ITheme));
  }, [theme]);

  return <>{children}</>;
};
