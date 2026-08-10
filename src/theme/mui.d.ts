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
    privateOverlay: Palette['primary'];
    notification: Palette['main'];
    upload: Palette['primary']
  }

  interface PaletteOptions {
    rating?: PaletteOptions['primary'];
    privateOverlay?: PaletteOptions['primary'];
    notification: Palette['main'];
    upload?: PaletteOptions['primary'];
  }
}
