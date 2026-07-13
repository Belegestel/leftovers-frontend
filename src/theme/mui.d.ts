import '@mui/material/Button';
import '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    secondary: true;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    rating: Palette['primary'];
  }

  interface PaletteOptions {
    rating?: PaletteOptions['primary'];
  }
}
