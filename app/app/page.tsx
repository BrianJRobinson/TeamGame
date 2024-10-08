declare global {
  interface Window {
    ethereum?: any;
  }
}

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useContractWrite, usePrepareContractWrite, useContractRead, useNetwork, useSwitchNetwork } from 'wagmi';
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
import { BASE_CHAIN_ID } from '@/app/utils/helpers';
import {
  checkTransaction,
  handleCreatePlayer,
  handleCreateTeam,
  handleJoinTeam,
  fetchCurrentPoolId,
  fetchTeamCost,
  fetchTotalTeamCount,
  fetchTotalPlayerCount,
  fetchETHBalance,
  fetchTokenBalance
} from '@/app/utils/chainfunctions';

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
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [isCorrectChain, setIsCorrectChain] = useState(true);

  useEffect(() => {
    if (isConnected && chain) {
      setIsCorrectChain(chain.id === BASE_CHAIN_ID);
    }
  }, [isConnected, chain]);

  const handleConnect = useCallback(() => {
    connect();
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const handleSwitchNetwork = useCallback(() => {
    if (switchNetwork) {
      switchNetwork(BASE_CHAIN_ID);
    }
  }, [switchNetwork]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Set isLoaded to true after a short delay
    const timer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const getTranslateX = (isLeft: boolean) => {
    if (!isLoaded) return isLeft ? '-100%' : '100%';
    
    const direction = isLeft ? -1 : 1;
    const maxScroll = 500; // Adjust this value to control how quickly the characters move off-screen
    const translateX = Math.min(scrollY / maxScroll, 1) * 100 * direction;
    return `${translateX}%`;
  };

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
      checkTransaction(data.hash, 'player', toast, setPlayerName, setTeamName, setTeamIdToJoin, setPendingTransactions);
    },
  });

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
      //checkTransaction(data.hash, 'team');
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
      checkTransaction(data.hash, 'join', toast, setPlayerName, setTeamName, setTeamIdToJoin, setPendingTransactions);
    },
  });

  const handleCreatePlayerWrapper = useCallback(() => {
    handleCreatePlayer(createPlayer, setIsCreatingPlayer);
  }, [createPlayer]);

  const handleCreateTeamWrapper = useCallback(() => {
    handleCreateTeam(createTeam);
  }, [createTeam, handleCreateTeam]);

  const handleJoinTeamWrapper = useCallback(() => {
    handleJoinTeam(joinTeam);
  }, [joinTeam, handleJoinTeam]);

  useEffect(() => {
    if (isClient && isCorrectChain) {
      fetchCurrentPoolId(setCurrentPoolId, setCurrentPoolIdError, isCorrectChain);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && isCorrectChain) {
      fetchTeamCost(setTeamCost, setTeamCostError, isCorrectChain);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && isCorrectChain) {
      fetchTotalTeamCount(setTotalTeamCount, setTotalTeamCountError, isCorrectChain);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && isCorrectChain) {
      fetchTotalPlayerCount(setTotalPlayerCount, setTotalPlayerCountError, isCorrectChain);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && isConnected && address) {
      fetchETHBalance(address, setCurrentETHBalance, setCurrentETHBalanceError, isCorrectChain);
    }
  }, [isClient, isConnected, address, isCorrectChain]);

  useEffect(() => {
    if (isClient && isConnected && address) {
      fetchTokenBalance(address, setCurrentTokenBalance, setCurrentTokenBalanceError, isCorrectChain);
    }
  }, [isClient, isConnected, address]);

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

  // Render placeholder content during SSR
  if (!isClient) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden flex flex-col pt-[20vh]"
         style={{backgroundImage: `url(${battleSceneImage.src})`, margin: `-70px`}}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-purple-900/70"></div>
      
      {/* Character Images */}
      <div className="relative z-10 flex justify-between items-end pt-40 px-4 sm:px-6 lg:px-8 mx-auto max-w-8xl w-full lg:w-4/5 xl:w-3/4">
        <div 
          style={{ transform: `translateX(${getTranslateX(true)})` }}
          className="absolute left-0 transition-transform duration-1000 ease-in-out"
        >
          <Image 
            src={leftCharacter} 
            alt="Left Character" 
            width={200} 
            height={300} 
            className="mb-[-50px] transition-all duration-1000 ease-in-out hover:scale-105"
          />
        </div>
        
        <div 
          style={{ transform: `translateX(${getTranslateX(false)})` }}
          className="absolute right-0 transition-transform duration-1000 ease-in-out"
        >
          <Image 
            src={rightCharacter} 
            alt="Right Character" 
            width={200} 
            height={300} 
            className="mb-[-50px] transition-all duration-1000 ease-in-out hover:scale-105"
          />
        </div>
      </div>

      {/* Hero Container */}
      <div className="relative z-20 bg-gray-900/80 mt-[-50px] py-12 px-4 sm:px-6 lg:px-8 rounded-t-3xl mx-auto max-w-8xl w-full lg:w-4/5 xl:w-3/4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome to MEGA WAR</h1>
              {!isLoading && isConnected && isCorrectChain && currentPlayerName && currentETHBalance && currentTokenBalance && !isError ? (
                <DogTag 
                  playerName={currentPlayerName} 
                  ethBalance={currentETHBalance} 
                  tokenBalance={currentTokenBalance} 
                />
              ) : (
                <DogTag 
                  playerName='Unknown' 
                  ethBalance='0.0' 
                  tokenBalance='0.0' 
                />
              )}
            </div>
            {isConnected ? (
              isCorrectChain ? (
                <Button onClick={handleDisconnect} variant="outline">Disconnect Wallet</Button>
              ) : (
                <Button onClick={handleSwitchNetwork} variant="outline">Switch to Base Chain</Button>
              )
            ) : (
              <Button onClick={handleConnect} variant="outline">Connect Wallet</Button>
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
          {/* Action Cards */}
          {isConnected && isCorrectChain ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left side: Action Cards */}
              <div className="space-y-6">
                <InputCard
                  cardNumber="1"
                  title="Create a Player"
                  imageSrc={playerIcon.src}
                  imageAlt="Create Player"
                  inputPlaceholder={ playerData != null ? `Player already registered!` : `Enter player name (Max ${MAX_CHARS})`}
                  inputValue={playerName}
                  onInputChange={(e) => setPlayerName(e.target.value)}
                  buttonText={isCreatingPlayer || isCreatingPlayerTransaction ? "Creating..." : "Create Player"}
                  onButtonClick={handleCreatePlayerWrapper}
                  isLoading={isCreatingPlayer || isCreatingPlayerTransaction}
                  isDisabled={!isConnected || isCreatingPlayer || isCreatingPlayerTransaction || playerData != null}
                  maxChars={MAX_CHARS}
                  minChars={MIN_CHARS}
                />

                <InputCard
                  cardNumber="2"
                  title="Create a Team"
                  imageSrc={teamIcon.src}
                  imageAlt="Form Team"
                  inputPlaceholder={`Enter team name (Max ${MAX_CHARS})`}
                  inputValue={teamName}
                  onInputChange={(e) => setTeamName(e.target.value)}
                  buttonText={isCreatingTeam || Object.values(pendingTransactions).some(Boolean) ? "Creating..." : "Create Team"}
                  onButtonClick={handleCreateTeamWrapper}
                  isLoading={isCreatingTeam || Object.values(pendingTransactions).some(Boolean)}
                  isDisabled={!isConnected || isCreatingTeam || Object.values(pendingTransactions).some(Boolean)}
                  animationDelay="animation-delay-200"
                  maxChars={MAX_CHARS}
                  minChars={MIN_CHARS}
                />

                <InputCard
                  cardNumber="3"
                  title="Join a Team"
                  imageSrc={RobotsBattle.src}
                  imageAlt="Compete"
                  inputPlaceholder="Enter team ID to join"
                  inputValue={teamIdToJoin}
                  onInputChange={(e) => setTeamIdToJoin(e.target.value)}
                  buttonText={isJoiningTeam || Object.values(pendingTransactions).some(Boolean) ? "Joining..." : "Join Team"}
                  onButtonClick={handleJoinTeamWrapper}
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
          ) : (
            <p className="text-xl text-center text-red-400">
              {isConnected ? "Please switch to the Base chain to interact with the game." : "Please connect your wallet to interact with the game."}
            </p>
          )}
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