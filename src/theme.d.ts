import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    rose: Palette['primary'];
  }
  interface PaletteOptions {
    rose?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    rose: true;
  }
}
