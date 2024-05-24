"use client";

import "@/styles/globals.css";
import clsx from "clsx";

import { Providers } from "./providers";

import { dmSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

import {
  RainbowKitProvider,
  getDefaultConfig,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { http, WagmiProvider } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConnectWallet } from "@rainbow-me/rainbowkit/dist/wallets/walletConnectors/walletConnectWallet/walletConnectWallet";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "c12fc096f3ae8e713d0c3425cc540b1f",
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
  ssr: false,
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          dmSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
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
                <div className="relative flex flex-col h-screen">
                  <Navbar />
                  <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                    {children}
                  </main>
                  <footer className="w-full flex items-center justify-center py-3">
                    {/* <Button
                      onClick={() => {
                        // theme.setTheme("dark");
                      }}
                    /> */}
                    {/* <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                title="nextui.org homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">NextUI</p>
              </Link> */}
                  </footer>
                </div>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </Providers>
      </body>
    </html>
  );
}
