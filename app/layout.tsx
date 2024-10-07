import type { Metadata } from 'next';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/Header';
import { WagmiProvider } from './providers';
import './globals.css'

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
        <WagmiProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}