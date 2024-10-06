declare global {
  interface Window {
    ethereum?: any;
  }
}

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useContractWrite, usePrepareContractWrite, useContractRead, useWaitForTransaction } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';
import battleSceneImage from '/public/images/battlescene2.jpg';
import InfoCard from '@/components/my-ui/InfoCard'; // Add this import
import InputCard from '@/components/my-ui/InputCard';
import { ethers } from 'ethers';

// Import images
import leftCharacter from '/public/images/left-character.png';
import rightCharacter from '/public/images/right-character.png';
import playerIcon from '/public/images/teamgame-player.png';
import teamIcon from '/public/images/teamgame-team.png';
import RobotsBattle from '/public/images/2robots-battle.jpg';
import battleImage from '/public/images/BattleArena.jpg';

// Replace this with your actual deployed contract address
const CONTRACT_ADDRESS = "0xF2aA715A7E7Dfd8222fa8fDe7499c5385EA3c4D6";
const MAX_CHARS = 30;
const MIN_CHARS = 3;

const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "CreatePlayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "CreateTeam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "teamId",
        "type": "uint256"
      }
    ],
    "name": "JoinTeam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "teamCost",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalTeamCount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPlayerCount",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentPoolId",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }  
];

export default function AppPage() {
  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamIdToJoin, setTeamIdToJoin] = useState('');
  const [animate, setAnimate] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isCreatingPlayer, setIsCreatingPlayer] = useState(false);
  const { address, isConnected } = useAccount();
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

  
  const { config: createPlayerConfig, error: prepareError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'CreatePlayer',
    args: [playerName],
    enabled: !isCreatingPlayer && isConnected && (playerName.trim().length >= MIN_CHARS && playerName.trim().length <= MAX_CHARS),
  });

  const { write: createPlayer, data: createPlayerData, error: writeError } = useContractWrite(createPlayerConfig);

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isTransactionFailed, error: transactionError } = useWaitForTransaction({
    hash: createPlayerData?.hash,
  });

  const handleCreatePlayer = useCallback(async () => {
    if (!createPlayer) {
      console.error("Create player function is not available");
      toast({
        title: "Error",
        description: "Unable to create player. Create player function is not available.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingPlayer(true);
    try {
      console.log("Attempting to create player with name:", playerName);
      await createPlayer();
    } catch (error) {
      console.error("Error creating player:", error);
      toast({
        title: "Error",
        description: `Failed to create player: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      setIsCreatingPlayer(false);
    }
  }, [createPlayer, toast, playerName]);

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Success",
        description: "Player created successfully!",
      });
      setPlayerName('');
      setIsCreatingPlayer(false);
    } else if (isTransactionFailed) {
      const errorMessage = transactionError?.message || "The transaction was unsuccessful.";
      let userFriendlyMessage = errorMessage;

      // Check for specific error messages and provide more user-friendly explanations
      if (errorMessage.includes("execution reverted")) {
        if (errorMessage.includes("Player already exists")) {
          userFriendlyMessage = "This wallet already has a player. You cannot create another one.";
        } else if (errorMessage.includes("Invalid name")) {
          userFriendlyMessage = "The player name is invalid. Please choose a different name.";
        }
        // Add more specific error checks as needed
      }

      toast({
        title: "Error",
        description: `Failed to create player: ${userFriendlyMessage}`,
        variant: "destructive",
      });
      setIsCreatingPlayer(false);
    }
  }, [isConfirmed, isTransactionFailed, transactionError, toast]);

  const { config: createTeamConfig, error: createTeamError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'CreateTeam',
    args: [teamName],
    enabled: isConnected && teamName.trim() !== '',
  });

  const { write: createTeam, isLoading: isCreatingTeam } = useContractWrite(createTeamConfig);


  const { config: joinTeamConfig, error: joinTeamError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'JoinTeam',
    args: [parseInt(teamIdToJoin)],
    enabled: isConnected && teamIdToJoin.trim() !== '',
  });


  const { write: joinTeam, isLoading: isJoiningTeam } = useContractWrite(joinTeamConfig);

  const handleCreateTeam = async () => {
    if (!createTeam) {
      toast({
        title: "Error",
        description: "Unable to create team. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createTeam();
      toast({
        title: "Success",
        description: "Team created successfully!",
      });
      setTeamName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJoinTeam = async () => {
    if (!joinTeam) {
      toast({
        title: "Error",
        description: "Unable to join team. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await joinTeam();
      toast({
        title: "Success",
        description: "Joined team successfully!",
      });
      setTeamIdToJoin('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join team. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Display error messages if contract interactions fail
  useEffect(() => {
    if (prepareError) {
      console.error("Prepare error:", prepareError);
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
  }, [prepareError, createTeamError, joinTeamError, toast]);

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
          className={`mb-[-50px] transition-all duration-1000 ease-in-out hover:scale-105 ${
            animate ? 'animate-slide-in-left' : 'opacity-0'
          }`}
        />
        <Image 
          src={rightCharacter} 
          alt="Left Character" 
          width={200} 
          height={300} 
          className="mb-[-50px] transition-all duration-1000 ease-in-out hover:scale-105 animate-slide-in-right"
        />
      </div>

      {/* Hero Container */}
      <div className="relative z-20 bg-gray-900/80 mt-[-50px] py-12 px-4 sm:px-6 lg:px-8 rounded-t-3xl mx-auto max-w-8xl w-full lg:w-4/5 xl:w-3/4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">Welcome to MEGA WAR</h1>
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
                inputPlaceholder={`Enter player name (Max ${MAX_CHARS})`}
                inputValue={playerName}
                onInputChange={(e) => setPlayerName(e.target.value)}
                buttonText={isCreatingPlayer || isConfirming ? "Creating..." : "Create Player"}
                onButtonClick={handleCreatePlayer}
                isLoading={isCreatingPlayer || isConfirming}
                isDisabled={!isConnected || isCreatingPlayer || isConfirming}
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
                buttonText="Create Team"
                onButtonClick={handleCreateTeam}
                isLoading={isCreatingTeam}
                isDisabled={!isConnected}
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
                buttonText="Join Team"
                onButtonClick={handleJoinTeam}
                isLoading={isJoiningTeam}
                isDisabled={!isConnected}
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
                {/* Add team list here */}
                <p>Team list will be displayed here.</p>
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