import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/toaster";
import Header from '../components/Header';
import './globals.css'
import ClientProviders from './ClientProviders'
import { ChainWatcher } from './hooks/ChainWatcher';
import Web3Provider from '@/components/Web3Provider';

export const metadata: Metadata = {
  title: 'Mega War Blockchain Game',
  description: 'Create and join teams in this exciting blockchain game!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body>
        <ClientProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Web3Provider>
                <Header />
                <ChainWatcher />
                {children}
            </Web3Provider>
            <Toaster />
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  );
}