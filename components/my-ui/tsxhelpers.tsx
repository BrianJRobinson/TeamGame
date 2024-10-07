declare global {
    interface Window {
      ethereum?: any;
    }
  }
  
"use client";

import React from 'react';
import { useTeams } from "../../app/utils/helpers";
import { useToast } from '../../hooks/use-toast';
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../app/Contract';
import { Button } from '../ui/button';

const TeamList = () => {
    const { teams, isLoading, error, refetchTeams } = useTeams();
    const { toast } = useToast();
    const [joiningTeam, setJoiningTeam] = useState<string | null>(null);
  
    const handleJoinTeam = useCallback(async (teamId : string) => {
      setJoiningTeam(teamId);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
        const tx = await contract.JoinTeam(teamId);
        await tx.wait();
  
        toast({
          title: "Success",
          description: "Joined team successfully!",
        });
        refetchTeams();
      } catch (error) {
        console.error('Error joining team:', error);
        toast({
          title: "Error",
          description: `Failed to join team: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
          variant: "destructive",
        });
      } finally {
        setJoiningTeam(null);
      }
    }, [refetchTeams, toast]);
  
    if (isLoading) return <div>Loading teams...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
      <div className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
            <div className="flex-1">{team.name}</div>
            <div className="flex-1 text-center">{team.playerCount} / {team.teamSize}</div>
            <Button 
              onClick={() => handleJoinTeam(team.id.toString())}
              disabled={team.playerCount >= team.teamSize || joiningTeam === team.id.toString()}
            >
              {joiningTeam === team.id.toString() ? 'Joining...' : 'Join'}
            </Button>
          </div>
        ))}
      </div>
    );
}

export default TeamList;