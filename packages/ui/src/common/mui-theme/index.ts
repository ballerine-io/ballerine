import { createTheme } from '@mui/material';

const getCSSVariableValue = (variableName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(variableName);

export const muiTheme = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  palette: {
    primary: {
      main: `hsla(${getCSSVariableValue('--primary')})`,
      contrastText: '#fff',
    },
  },
});
