import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#fdffed',
    },
    text: {
      primary: '#71717b',
    },
    primary: {
      main: '#a684ff',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontWeightRegular: 400,
    lineHeight: 1.5,
    allVariants: {
      color: '#71717b',
    },
  },
  shape: {
    borderRadius: 3, // 元件圓角統一
  },
});

export default theme;