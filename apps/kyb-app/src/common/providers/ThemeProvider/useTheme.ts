import { themeContext } from '@/common/providers/ThemeProvider/theme.context';
import { IThemeContext } from '@/common/providers/ThemeProvider/types';
import { useContext } from 'react';

export const useTheme = (): IThemeContext => {
  const context = useContext(themeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
