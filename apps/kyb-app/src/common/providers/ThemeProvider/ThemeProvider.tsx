import { APP_LANGUAGE_QUERY_KEY } from '@/common/consts/consts';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { transformThemeToInlineStyles } from '@/utils/transform-theme-to-inline-styles';
import { useLayoutEffect, useMemo } from 'react';
import defaultTheme from '../../../../theme.json';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const ThemeProvider = ({ children }: Props) => {
  const language = new URLSearchParams(window.location.search).get(APP_LANGUAGE_QUERY_KEY) || 'en';
  const { data: uiSchema, isLoading, error } = useUISchemasQuery(language);

  const theme = useMemo(() => {
    if (isLoading) return null;

    if (error) {
      console.warn('Failed to load theme', error);

      return defaultTheme.theme;
    }

    if (!uiSchema?.uiSchema?.theme) return defaultTheme.theme;

    return uiSchema.uiSchema.theme;
  }, [uiSchema, isLoading, error]);

  useLayoutEffect(() => {
    if (!theme) return;

    document
      .getElementsByTagName('html')[0]
      ?.setAttribute('style', transformThemeToInlineStyles(theme));
  }, [theme]);

  return <>{children}</>;
};
