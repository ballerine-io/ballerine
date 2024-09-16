import { themeContext } from '@/common/providers/ThemeProvider/theme.context';
import { useContext } from 'react';

export const useTheme = () => useContext(themeContext);
