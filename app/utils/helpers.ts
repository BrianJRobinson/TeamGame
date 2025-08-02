import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../app/Contract';
import { Team } from './types';

export const BASE_CHAIN_ID = 84532; // Base chain ID
export const BASE_CHAIN_NAME = 'Base-Sepolia';
export const BASE_RPC_URL = 'https://base-sepolia.blockpi.network/v1/rpc/public'; // Replace with the correct RPC URL


export function usePlayerData() {
    const { address, isConnected } = useAccount();
    const [playerData, setPlayerData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
  
    const fetchPlayerData = useCallback(async () => {
      if (!isConnected || !address) return;
  
      setIsLoading(true);
      setIsError(false);
  
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  
        const result = await contract.GetPlayerByAddress(address);
        console.log('GetPlayerByAddress result:', result);  // For debugging
  
        setPlayerData(result);
      } catch (error) {
        console.error('Error fetching player data:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, [address, isConnected]);
  
    useEffect(() => {
      fetchPlayerData();
    }, [fetchPlayerData]);
  
    return { playerData, isError, isLoading, isConnected, refetch: fetchPlayerData };
  }
  
 export function useTeams() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchTeams = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        
        const teamCount = await contract.totalTeamCount();
        
        const fetchedTeams = [];
        for (let i = 1; i <= teamCount; i++) {
          const team = await contract.GetTeamById(i);
          console.log(team);
          fetchedTeams.push({
            id: i,
            name: team.name,
            playerCount: team.playerCount,
            teamSize: team.teamSize
          });
        }
        setTeams(fetchedTeams);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to fetch teams');
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchTeams();
    }, [fetchTeams]);
  
    return { teams, isLoading, error, refetchTeams: fetchTeams };
  }
  
  export async function checkAndSwitchChain(provider: ethers.providers.Web3Provider) {
    const network = await provider.getNetwork();
    if (network.chainId !== BASE_CHAIN_ID) {
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: ethers.utils.hexValue(BASE_CHAIN_ID) }]);
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await provider.send('wallet_addEthereumChain', [
              {
                chainId: ethers.utils.hexValue(BASE_CHAIN_ID),
                chainName: BASE_CHAIN_NAME,
                rpcUrls: [BASE_RPC_URL],
              },
            ]);
          } catch (addError) {
            console.error('Failed to add the Base network:', addError);
          }
        } else {
          console.error('Failed to switch to the Base network:', switchError);
        }
      }
    }
    return network.chainId === BASE_CHAIN_ID;
  }