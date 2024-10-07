declare global {
  interface Window {
    ethereum?: any;
  }
}

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';
import battleSceneImage from '/public/images/battlescene2.jpg';
import InfoCard from '@/components/my-ui/InfoCard'; // Add this import
import InputCard from '@/components/my-ui/InputCard';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, ETH_ADDRESS, TOKEN_ADDRESS, ETH_ABI, TOKEN_ABI } from '@/app/Contract';
import { Skeleton } from "@/components/ui/skeleton"; // Make sure you have this component
//import { usePlayerData } from '@/app/utils/helpers';
import { PlayerData } from '@/app/utils/types';
import TeamList from '@/components/my-ui/tsxhelpers';
// Import images
import leftCharacter from '/public/images/left-character.png';
import rightCharacter from '/public/images/right-character.png';
import playerIcon from '/public/images/teamgame-player.png';
import teamIcon from '/public/images/teamgame-team.png';
import RobotsBattle from '/public/images/2robots-battle.jpg';
import DogTag from '@/components/my-ui/DogTag';


// Replace this with your actual deployed contract address
const MAX_CHARS = 30;
const MIN_CHARS = 3;

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

export default function AppPage() {
  const { playerData, isError, isLoading, isConnected, refetch } = usePlayerData();
  const [currentPlayerName, setCurrentPlayerName] = useState('');

  useEffect(() => {
    if (playerData && !isError && !isLoading && isConnected) {
      // Assuming the player data structure includes a 'name' field
      setCurrentPlayerName((playerData as PlayerData).name || 'No name');
    } else {
      setCurrentPlayerName('');
    }
  }, [playerData, isError, isLoading, isConnected]);

  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamIdToJoin, setTeamIdToJoin] = useState('');
  const [animate, setAnimate] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isCreatingPlayer, setIsCreatingPlayer] = useState(false);
  const { address } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  const [currentPoolId, setCurrentPoolId] = useState<number | null>(null);
  const [currentPoolIdError, setCurrentPoolIdError] = useState<string | null>(null);
  const [teamCost, setTeamCost] = useState<string | null>(null);
  const [teamCostError, setTeamCostError] = useState<string | null>(null);
  const [totalTeamCount, setTotalTeamCount] = useState<string | null>(null);
  const [totalTeamCountError, setTotalTeamCountError] = useState<string | null>(null);
  const [totalPlayerCount, setTotalPlayerCount] = useState<string | null>(null);
  const [totalPlayerCountError, setTotalPlayerCountError] = useState<string | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<Record<string, boolean>>({});
  const [currentETHBalance, setCurrentETHBalance] = useState<string | null>(null);
  const [currentETHBalanceError, setCurrentETHBalanceError] = useState<string | null>(null);
  const [currentTokenBalance, setCurrentTokenBalance] = useState<string | null>(null);
  const [currentTokenBalanceError, setCurrentTokenBalanceError] = useState<string | null>(null);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);

  const { config: createPlayerConfig, error: createPlayerError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'CreatePlayer',
    args: [playerName],
    enabled: isConnected && (playerName.trim().length >= MIN_CHARS && playerName.trim().length <= MAX_CHARS),
  });

  const { write: createPlayer, data: createPlayerData, isLoading: isCreatingPlayerTransaction } = useContractWrite({
    ...createPlayerConfig,
    onSuccess(data) {
      setPendingTransactions(prev => ({ ...prev, [data.hash]: true }));
      checkTransaction(data.hash, 'player');
    },
  });

  const { config: joinTeamConfig, error: joinTeamError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'JoinTeam',
    args: [parseInt(teamIdToJoin)],
    enabled: isConnected && teamIdToJoin.trim() !== '',
  });

  const { write: joinTeam, data: joinTeamData, isLoading: isJoiningTeam } = useContractWrite({
    ...joinTeamConfig,
    onSuccess(data) {
      setPendingTransactions(prev => ({ ...prev, [data.hash]: true }));
      checkTransaction(data.hash, 'join');
    },
  });

  const checkTransaction = useCallback(async (hash: string, type: 'player' | 'team' | 'join') => {
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
      setPendingTransactions(prev => ({ ...prev, [hash]: false }));
    }
  }, [toast, setPlayerName, setTeamName, setTeamIdToJoin]);

  const handleCreatePlayer = useCallback(async () => {
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
  }, [createPlayer]);

  const { config: createTeamConfig, error: createTeamError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'CreateTeam',
    args: [teamName],
    enabled: isConnected && (teamName.trim().length >= MIN_CHARS && teamName.trim().length <= MAX_CHARS),
  });

  const { write: createTeam, data: createTeamData, isLoading: isCreatingTeam } = useContractWrite({
    ...createTeamConfig,
    onSuccess(data) {
      setPendingTransactions(prev => ({ ...prev, [data.hash]: true }));
      checkTransaction(data.hash, 'team');
    },
  });

  const handleCreateTeam = useCallback(async () => {
    if (!createTeam) {
      console.error("Create team function is not available");
      return;
    }
    try {
      await createTeam();
    } catch (error) {
      console.error("Error creating team:", error);
    }
  }, [createTeam]);

  const handleJoinTeam = useCallback(async () => {
    if (!joinTeam) {
      console.error("Join team function is not available");
      return;
    }
    try {
      await joinTeam();
    } catch (error) {
      console.error("Error joining team:", error);
    }
  }, [joinTeam]);

  // Display error messages if contract interactions fail
  useEffect(() => {
    if (createPlayerError) {
      console.error("Error preparing create player transaction:", createPlayerError);
      toast({
        title: "Error",
        description: `Failed to prepare create player transaction: ${createPlayerError.message}`,
        variant: "destructive",
      });
    }
    if (createTeamError) {
      toast({
        title: "Error",
        description: `Failed to prepare create team transaction: ${createTeamError.message}`,
        variant: "destructive",
      });
    }
    if (joinTeamError) {
      toast({
        title: "Error",
        description: `Failed to prepare join team transaction: ${joinTeamError.message}`,
        variant: "destructive",
      });
    }
  }, [createPlayerError, createTeamError, joinTeamError, toast]);

  useEffect(() => {
    setAnimate(true);
    setIsClient(true);
  }, []);

  //#region Fetch Contract Data

  useEffect(() => {
    const fetchCurrentPoolId = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const result = await contract.currentPoolId();
          console.log("Current Pool ID from ethers:", result);
          setCurrentPoolId(result.toNumber());
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

    if (isClient) {
      fetchCurrentPoolId();
    }
  }, [isClient]);

  useEffect(() => {
    const fetchTeamCost = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const result = await contract.teamCost();
          setTeamCost(ethers.utils.formatEther(result));
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

    if (isClient) {
      fetchTeamCost();
    }
  }, [isClient]);

  useEffect(() => {
    const fetchTotalTeamCount = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const result = await contract.totalTeamCount();
          setTotalTeamCount(result.toString());
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

    if (isClient) {
      fetchTotalTeamCount();
    }
  }, [isClient]);

  useEffect(() => {
    const fetchTotalPlayerCount = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          const result = await contract.totalPlayerCount();
          setTotalPlayerCount(result.toString());
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

    if (isClient) {
      fetchTotalPlayerCount();
    }
  }, [isClient]);

  useEffect(() => {
    const fetchETHBalance = async () => {
      if (typeof window.ethereum !== 'undefined' && address) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(ETH_ADDRESS, ETH_ABI, provider);
          const balance = await provider.getBalance(address);
          let newBal = Number(ethers.utils.formatEther(balance));
          setCurrentETHBalance(newBal.toFixed(7));
          setCurrentETHBalanceError(null);
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

    if (isClient && isConnected && address) {
      fetchETHBalance();
    }
  }, [isClient, isConnected, address]);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (typeof window.ethereum !== 'undefined' && address) {
        try {
          console.log("Fetching token balance for address:", address);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
          const result = await contract.balanceOf(address);
          console.log("Token balance result:", result.toString());
          setCurrentTokenBalance(ethers.utils.formatEther(result));
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

    if (isClient && isConnected && address) {
      fetchTokenBalance();
    }
  }, [isClient, isConnected, address, TOKEN_ADDRESS, TOKEN_ABI]);

  //#endregion
  // Render placeholder content during SSR
  if (!isClient) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden flex flex-col"
         style={{backgroundImage: `url(${battleSceneImage.src})`, margin: `-70px`}}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-purple-900/70"></div>
      
      {/* Character Images */}
      <div className="relative z-10 flex justify-between items-end pt-40 px-4 sm:px-6 lg:px-8 mx-auto max-w-8xl w-full lg:w-4/5 xl:w-3/4">
        <Image 
          src={leftCharacter} 
          alt="Left Character" 
          width={200} 
          height={300} 
          className="mb-[-50px] transition-all duration-1000 ease-in-out hover:scale-105 animate-slide-in-left"
        />
        <Image 
          src={rightCharacter} 
          alt="Right Character" 
          width={200} 
          height={300} 
          className="mb-[-50px] transition-all duration-1000 ease-in-out hover:scale-105 animate-slide-in-right"
        />
      </div>

      {/* Hero Container */}
      <div className="relative z-20 bg-gray-900/80 mt-[-50px] py-12 px-4 sm:px-6 lg:px-8 rounded-t-3xl mx-auto max-w-8xl w-full lg:w-4/5 xl:w-3/4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome to MEGA WAR</h1>
              {!isLoading && isConnected && currentPlayerName && currentETHBalance && currentTokenBalance && !isError ? 
              (<DogTag 
                playerName={currentPlayerName} 
                ethBalance={currentETHBalance} 
                tokenBalance={currentTokenBalance} 
              />): (
                <DogTag 
                playerName='Unknown' 
                ethBalance='0.0' 
                tokenBalance='0.0' 
              />)}                                        
            </div>
            {isConnected ? (
              <Button onClick={() => disconnect()} variant="outline">Disconnect Wallet</Button>
            ) : (
              <Button onClick={() => connect()} variant="outline">Connect Wallet</Button>
            )}
          </div>
          <p className="text-xl text-gray-200 mb-12">Create your player, form a team, and battle for glory!</p>
           {/* Info Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoCard
                title="Team Cost"
                content={teamCostError ? `Error: ${teamCostError}` : (teamCost ? `${teamCost} WETH` : 'Loading...')}
              />
              <InfoCard
                title="Total Teams"
                content={totalTeamCountError ? `Error: ${totalTeamCountError}` : (totalTeamCount ? totalTeamCount : 'Loading...')}
              />
              <InfoCard
                title="Total Players"
                content={totalPlayerCountError ? `Error: ${totalPlayerCountError}` : (totalPlayerCount ? totalPlayerCount : 'Loading...')}
              />
              <InfoCard
                title="Current Pool ID"
                content={currentPoolIdError 
                  ? `Error: ${currentPoolIdError}` 
                  : (currentPoolId !== null ? currentPoolId.toString() : 'Loading...')}
              />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side: Action Cards */}
            <div className="space-y-6">
              <InputCard
                title="1: Create a Player"
                imageSrc={playerIcon.src}
                imageAlt="Create Player"
                inputPlaceholder={ playerData != null ? `Player already registered!` : `Enter player name (Max ${MAX_CHARS})`}
                inputValue={playerName}
                onInputChange={(e) => setPlayerName(e.target.value)}
                buttonText={isCreatingPlayer || isCreatingPlayerTransaction ? "Creating..." : "Create Player"}
                onButtonClick={handleCreatePlayer}
                isLoading={isCreatingPlayer || isCreatingPlayerTransaction}
                isDisabled={!isConnected || isCreatingPlayer || isCreatingPlayerTransaction || playerData != null}
                maxChars={MAX_CHARS}
                minChars={MIN_CHARS}
              />

              <InputCard
                title="2: Create a Team"
                imageSrc={teamIcon.src}
                imageAlt="Form Team"
                inputPlaceholder={`Enter team name (Max ${MAX_CHARS})`}
                inputValue={teamName}
                onInputChange={(e) => setTeamName(e.target.value)}
                buttonText={isCreatingTeam || Object.values(pendingTransactions).some(Boolean) ? "Creating..." : "Create Team"}
                onButtonClick={handleCreateTeam}
                isLoading={isCreatingTeam || Object.values(pendingTransactions).some(Boolean)}
                isDisabled={!isConnected || isCreatingTeam || Object.values(pendingTransactions).some(Boolean)}
                animationDelay="animation-delay-200"
                maxChars={MAX_CHARS}
                minChars={MIN_CHARS}
              />

              <InputCard
                title="3: Join a Team"
                imageSrc={RobotsBattle.src}
                imageAlt="Compete"
                inputPlaceholder="Enter team ID to join"
                inputValue={teamIdToJoin}
                onInputChange={(e) => setTeamIdToJoin(e.target.value)}
                buttonText={isJoiningTeam || Object.values(pendingTransactions).some(Boolean) ? "Joining..." : "Join Team"}
                onButtonClick={handleJoinTeam}
                isLoading={isJoiningTeam || Object.values(pendingTransactions).some(Boolean)}
                isDisabled={!isConnected || isJoiningTeam || Object.values(pendingTransactions).some(Boolean)}
                animationDelay="animation-delay-400"
                maxChars={MAX_CHARS}
                minChars={MIN_CHARS}                
              />
            </div>

            {/* Right side: Team List */}
            <Card className="bg-white/10 backdrop-blur-lg text-white overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 animate-slide-up animation-delay-600">
              <CardHeader>
                <CardTitle>Existing Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <TeamList />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/80 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">MEGA WAR</h3>
              <p className="text-sm text-gray-300 max-w-md">
                Join the ultimate blockchain-based battle arena. Create your player, form alliances, and compete for glory and rewards in MEGA WAR!
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                <Github size={24} />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            © 2023 MEGA WAR. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}