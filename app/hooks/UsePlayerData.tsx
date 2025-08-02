import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../Contract";
import { ethers } from "ethers";

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