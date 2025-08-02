import { useEffect } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export function useAutoSwitchChain() {
  const chainId = useChainId();
  const { switchChain, isPending, error } = useSwitchChain();

  useEffect(() => {
    if (chainId !== baseSepolia.id && !isPending) {
      switchChain({ chainId: baseSepolia.id });
    }
  }, [chainId, isPending, switchChain]);

  return { error, isPending };
}





