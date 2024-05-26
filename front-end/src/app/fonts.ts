// app/fonts.ts
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-rubik',
})

export const fonts = {
    dmSans,
}