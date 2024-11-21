import { IThemeContext } from '@/common/providers/ThemeProvider/types';
import { createContext } from 'react';

export const themeContext = createContext({} as IThemeContext);
