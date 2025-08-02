// app/providers.tsx
'use client'

import React from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { base, baseSepolia } from 'wagmi/chains'

const queryClient = new QueryClient()

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(), // Defaults to public RPC — you can swap in a custom endpoint if needed
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}