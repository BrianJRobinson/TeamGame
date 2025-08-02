'use client';

import { useChainId } from 'wagmi';
import { useEffect } from 'react';
import { BASE_CHAIN_ID } from '../../app/utils/helpers';
import { useAutoSwitchChain } from './AutoswitchChain';

export function ChainWatcher({
  onChainStatus = () => {},
}: {
  onChainStatus?: (isCorrect: boolean) => void;
}) {
  const chainId = useChainId();
  const { error } = useAutoSwitchChain();

  useEffect(() => {
    const isCorrect = chainId === BASE_CHAIN_ID;
    onChainStatus(isCorrect);
  }, [chainId, onChainStatus]);

return error ? (
    <p style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>
      Failed to switch chain: {error?.message || 'Unknown error'}
    </p>
  ) : null;
}
