"use client";

import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

// Or define a custom chain if needed:
const baseChain = {
   id: 84532,
   name: 'BaseSepolia',
   network: 'base',
   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
   rpcUrls: {
     default: { http: ['https://sepolia.base.org'] },
     public: { http: ['https://sepolia.base.org'] },
   },
   blockExplorers: {
     default: { name: 'Basescan', url: 'https://sepolia.basescan.org/' },
   },
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [baseChain], // Add or remove chains as needed
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}