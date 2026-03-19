import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // ou 'dark'
    primary: {
      main: '#1976d2', // Sua cor principal
    },
    secondary: {
      main: '#9c27b0', // Sua cor secundária
    },
    background: {
      default: '#f4f4f4', // Cor de fundo da página
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
  },
  // Você também pode customizar componentes globalmente aqui
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Todos os botões do app terão borda arredondada
        },
      },
    },
  },
});

export default theme;