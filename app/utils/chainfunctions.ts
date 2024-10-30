import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, ETH_ADDRESS, ETH_ABI, TOKEN_ADDRESS, TOKEN_ABI } from '@/app/Contract';

export const checkTransaction = async (hash: string, type: 'player' | 'team' | 'join', toast: any, setPlayerName: any, setTeamName: any, setTeamIdToJoin: any, setPendingTransactions: any) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  try {
    const tx = await provider.getTransaction(hash);
    if (tx) {
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        toast({
          title: "Success",
          description: `${type === 'player' ? 'Player created' : type === 'team' ? 'Team created' : 'Joined team'} successfully!`,
        });
        if (type === 'player') {
          setPlayerName('');
        } else if (type === 'team') {
          setTeamName('');
        } else {
          setTeamIdToJoin('');
        }
      } else {
        throw new Error("Transaction failed");
      }
    }
  } catch (error) {
    console.error(`Error checking ${type} transaction:`, error);
    toast({
      title: "Error",
      description: `Failed to ${type === 'player' ? 'create player' : type === 'team' ? 'create team' : 'join team'}. Please check the transaction on the blockchain.`,
      variant: "destructive",
    });
  } finally {
    setPendingTransactions((prev: any) => ({ ...prev, [hash]: false }));
  }
};

export const handleCreatePlayer = async (createPlayer: any, setIsCreatingPlayer: any) => {
  if (!createPlayer) {
    console.error("Create player function is not available");
    return;
  }
  setIsCreatingPlayer(true);
  try {
    await createPlayer();
  } catch (error) {
    console.error("Error creating player:", error);
    setIsCreatingPlayer(false);
  }
};

export const handleCreateTeam = async (createTeam: any) => {
  if (!createTeam) {
    console.error("Create team function is not available");
    return;
  }
  try {
    await createTeam();
  } catch (error) {
    console.error("Error creating team:", error);
  }
};

export const handleJoinTeam = async (joinTeam: any) => {
    if (!joinTeam) {
      console.error("Join team function is not available");
      return;
    }
    try {
      await joinTeam();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

export const fetchCurrentPoolId = async (setCurrentPoolId: any, setCurrentPoolIdError: any, expectedChainId: number) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId != expectedChainId)
      {
        setCurrentPoolIdError("Change Network");
      }
      else
      {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const result = await contract.currentPoolId();
        console.log("Current Pool ID from ethers:", result);
        setCurrentPoolId(result.toNumber());
      }
    } catch (error) {
      console.error("Error fetching currentPoolId with ethers:", error);
      if (error instanceof Error) {
        setCurrentPoolIdError(error.message);
      } else {
        setCurrentPoolIdError("An unknown error occurred");
      }
    }
  }
};

export const fetchTeamCost = async (setTeamCost: any, setTeamCostError: any, expectedChainId: number) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId != expectedChainId)
      {
        setTeamCostError("Change Network");
      }
      else
      {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const result = await contract.teamCost();
        setTeamCost(ethers.utils.formatEther(result));
      }
    } catch (error) {
      console.error("Error fetching teamCost:", error);
      if (error instanceof Error) {
        setTeamCostError(error.message);
      } else {
        setTeamCostError("An unknown error occurred");
      }
    }
  }
};

export const fetchTotalTeamCount = async (setTotalTeamCount: any, setTotalTeamCountError: any, expectedChainId: number) => {
    if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId != expectedChainId)
      {
        setTotalTeamCountError("Change Network");
      }
      else
      {      
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const result = await contract.totalTeamCount();
        setTotalTeamCount(result.toString());
      }
    } catch (error) {
      console.error("Error fetching totalTeamCount:", error);
      if (error instanceof Error) {
        setTotalTeamCountError(error.message);
      } else {
        setTotalTeamCountError("An unknown error occurred");
      }
    }
  }
};

export const fetchTotalPlayerCount = async (setTotalPlayerCount: any, setTotalPlayerCountError: any, expectedChainId: number) => {
    if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId != expectedChainId)
      {
        setTotalPlayerCountError("Change Network");
      }
      else
      {       
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const result = await contract.totalPlayerCount();
        setTotalPlayerCount(result.toString());
      }
    } catch (error) {
      console.error("Error fetching totalPlayerCount:", error);
      if (error instanceof Error) {
        setTotalPlayerCountError(error.message);
      } else {
        setTotalPlayerCountError("An unknown error occurred");
      }
    }
  }
};

export const fetchETHBalance = async (address: string, setCurrentETHBalance: any, setCurrentETHBalanceError: any, expectedChainId: number) => {
    if (typeof window.ethereum !== 'undefined' && address) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId != expectedChainId)
      {
        setCurrentETHBalanceError("Change Network");
      }
      else
      {       
        const balance = await provider.getBalance(address);
        let newBal = Number(ethers.utils.formatEther(balance));
        setCurrentETHBalance(newBal.toFixed(7));
        setCurrentETHBalanceError(null);
      }
    } catch (error) {
      console.error("Error fetching ETH Balance:", error);
      if (error instanceof Error) {
        setCurrentETHBalanceError(error.message);
      } else {
        setCurrentETHBalanceError("An unknown error occurred");
      }
    }
  }
};

export const fetchTokenBalance = async (address: string, setCurrentTokenBalance: any, setCurrentTokenBalanceError: any, expectedChainId: number) => {
    if (typeof window.ethereum !== 'undefined' && address) {
    try {
      console.log("Fetching token balance for address:", address);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId != expectedChainId)
      {
        setCurrentTokenBalanceError("Change Network");
      }
      else
      {       
        const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
        const result = await contract.balanceOf(address);
        console.log("Token balance result:", result.toString());
        setCurrentTokenBalance(ethers.utils.formatEther(result));
      }
    } catch (error) {
      console.error("Error fetching Token Balance:", error);
      if (error instanceof Error) {
        setCurrentTokenBalanceError(error.message);
      } else {
        setCurrentTokenBalanceError("An unknown error occurred");
      }
    }
  }
};
