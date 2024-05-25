/* theme.ts */
import { extendTheme } from "@chakra-ui/react";

export const customTheme = extendTheme({
  initialColorMode: 'dark',
  fonts: {
    heading: 'var(--font-dmSans)',
    body: 'var(--font-dmSans)',
  }
});