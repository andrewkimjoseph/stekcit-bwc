// app/providers.tsx
'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { customTheme } from '../utils/themes/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={customTheme}
  >{children}</ChakraProvider>
}