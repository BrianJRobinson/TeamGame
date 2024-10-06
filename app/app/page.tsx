"use client";

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useContractWrite, usePrepareContractWrite, useContractRead } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';
import battleSceneImage from '/public/images/battlescene2.jpg';

// Import images
import leftCharacter from '/public/images/left-character.png';
import rightCharacter from '/public/images/right-character.png';
import playerIcon from '/public/images/teamgame-player.png';
import teamIcon from '/public/images/teamgame-team.png';
import RobotsBattle from '/public/images/2robots-battle.jpg';
import battleImage from '/public/images/BattleArena.jpg';

// Replace this with your actual deployed contract address
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

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
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const { config: createPlayerConfig, error: createPlayerError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'CreatePlayer',
    args: [playerName],
    enabled: isConnected && playerName.trim() !== '',
  });

  const { config: createTeamConfig, error: createTeamError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'CreateTeam',
    args: [teamName],
    enabled: isConnected && teamName.trim() !== '',
  });

  const { config: joinTeamConfig, error: joinTeamError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'JoinTeam',
    args: [parseInt(teamIdToJoin)],
    enabled: isConnected && teamIdToJoin.trim() !== '',
  });

  // Read contract data
  const { data: teamCost, isError: isTeamCostError } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'teamCost',
  });

  const { data: totalTeamCount, isError: isTotalTeamCountError } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalTeamCount',
  });

  const { data: totalPlayerCount, isError: isTotalPlayerCountError } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalPlayerCount',
  });

  const { data: currentPoolId, isError: isCurrentPoolIdError } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'currentPoolId',
  });

  const { write: createPlayer, isLoading: isCreatingPlayer } = useContractWrite(createPlayerConfig);
  const { write: createTeam, isLoading: isCreatingTeam } = useContractWrite(createTeamConfig);
  const { write: joinTeam, isLoading: isJoiningTeam } = useContractWrite(joinTeamConfig);

  const handleCreatePlayer = async () => {
    if (!createPlayer) {
      toast({
        title: "Error",
        description: "Unable to create player. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createPlayer();
      toast({
        title: "Success",
        description: "Player created successfully!",
      });
      setPlayerName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create player. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    if (createPlayerError) {
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

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden flex flex-col"
         style={{backgroundImage: `url(${battleSceneImage.src})`, margin: `-70px`, zIndex: -100}}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-purple-900/70"></div>
      
      {/* Character Images */}
      <div className="relative z-10 flex justify-between items-end pt-20 px-4 sm:px-6 lg:px-8 mx-20">
        <Image src={leftCharacter} alt="Left Character" width={200} height={300} className="mb-[-50px] transition-all translate-x-1 origin-left duration-500 ease-in-out hover:scale-105 translate-x-12"/>
        <Image src={rightCharacter} alt="Right Character" width={200} height={300} className="mb-[-50px]" />
      </div>

      {/* Hero Container */}
      <div className="relative z-20 bg-gray-900/80 mt-[-50px] py-12 px-4 mx-20 sm:px-6 lg:px-8 rounded-t-3xl ">
        <div className="max-w-7xl mx-auto">
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
           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6 lg:gap-18 mb-12 lg:max-w-48">
            <Card className="bg-white/10 backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle>Team Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isTeamCostError ? 'Error' : (teamCost ? `${teamCost.toString()} WETH` : 'Loading...')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle>Total Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isTotalTeamCountError ? 'Error' : (totalTeamCount ? totalTeamCount.toString() : 'Loading...')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle>Total Players</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isTotalPlayerCountError ? 'Error' : (totalPlayerCount ? totalPlayerCount.toString() : 'Loading...')}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle>Current Pool ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {isCurrentPoolIdError ? 'Error' : (currentPoolId ? currentPoolId.toString() : 'Loading...')}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side: Action Cards */}
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-lg text-white overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 animate-slide-up">
                <div className="flex">
                  <div className="w-1/4 flex items-center justify-start rounded-lg">
                    <Image src={playerIcon} alt="Create Player" width={100} height={100} className="rounded-l-lg h-full"/>
                  </div>
                  <div className="w-4/5">
                    <CardHeader>
                      <CardTitle>Step 1: Create a Player</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Enter player name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="mb-4"
                        disabled={!isConnected}
                      />
                      <Button 
                        onClick={handleCreatePlayer} 
                        disabled={!isConnected || playerName.trim() === '' || isCreatingPlayer}
                      >
                        {isCreatingPlayer ? 'Creating...' : 'Create Player'}
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg text-white overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 animate-slide-up animation-delay-200">
                <div className="flex">
                  <div className="w-1/4 flex items-center justify-start rounded-lg">
                    <Image src={teamIcon} alt="Form Team" width={100} height={100}  className="rounded-l-lg h-full"/>
                  </div>
                  <div className="w-4/5">
                    <CardHeader>
                      <CardTitle>Step 2: Create a Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Enter team name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="mb-4"
                        disabled={!isConnected}
                      />
                      <Button 
                        onClick={handleCreateTeam} 
                        disabled={!isConnected || teamName.trim() === '' || isCreatingTeam}
                      >
                        {isCreatingTeam ? 'Creating...' : 'Create Team'}
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg text-white overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 animate-slide-up animation-delay-400">
                <div className="flex">
                  <div className="w-1/4 flex items-center justify-start rounded-lg">
                    <Image src={RobotsBattle} alt="Compete" width={100} height={100} className="rounded-l-lg h-full" />
                  </div>
                  <div className="w-4/5">
                    <CardHeader>
                      <CardTitle>Step 3: Join a Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Enter team ID to join"
                        value={teamIdToJoin}
                        onChange={(e) => setTeamIdToJoin(e.target.value)}
                        className="mb-4"
                        disabled={!isConnected}
                      />
                      <Button 
                        onClick={handleJoinTeam} 
                        disabled={!isConnected || teamIdToJoin.trim() === '' || isJoiningTeam}
                      >
                        {isJoiningTeam ? 'Joining...' : 'Join Team'}
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
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