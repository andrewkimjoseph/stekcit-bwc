"use client";

import StekcitNavBar from "../components/navbar";
import { fonts } from "./fonts";
import { ThemeProvider } from "./providers";

import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { http, WagmiProvider } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";

import "./globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Stekcit BwC",
  projectId: process.env.WALLETCONNECT_PROJECT_ID!,
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fonts.dmSans.variable}>
      <head>
        <title>Stekcit BwC</title>
        <meta name="description" content="tickets, the other way around" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />

        <meta property="og:title" content="Stekcit BwC" />
        <meta
          property="og:description"
          content="tickets, the other way around"
        />
        <meta property="og:image" content="/favicon.png" />
      </head>
      <body>
        <ThemeProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider
                theme={lightTheme({
                  accentColor: "#EA1845",
                  accentColorForeground: "white",
                  borderRadius: "large",
                  fontStack: "rounded",
                  overlayBlur: "small",
                })}
              >
                <StekcitNavBar>{children}</StekcitNavBar>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
